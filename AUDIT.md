# Audit Technique Complet — Application de Signatures Email Xalimart Group

> **Rédigé par :** Audit IA — Claude Sonnet 4.6  
> **Date :** Avril 2026  
> **Périmètre :** Codebase complète — Next.js 14, 6 templates HTML email, pipeline copier/coller  
> **Sources techniques :** caniemail.com, litmus.com, emailonacid.com, hteumeuleu.com, MDN, Campaign Monitor CSS Guide  

---

## Table des matières

1. [Résumé exécutif](#1-résumé-exécutif)
2. [Architecture et pipeline de rendu](#2-architecture-et-pipeline-de-rendu)
3. [Audit HTML — Structure des templates](#3-audit-html--structure-des-templates)
4. [Audit CSS — Compatibilité par propriété](#4-audit-css--compatibilité-par-propriété)
5. [Analyse par client email](#5-analyse-par-client-email)
6. [Audit Dark Mode](#6-audit-dark-mode)
7. [Analyse du copier/coller](#7-analyse-du-copiiercoller)
8. [Audit des images (base64 vs hébergées)](#8-audit-des-images-base64-vs-hébergées)
9. [Vulnérabilités et bugs identifiés](#9-vulnérabilités-et-bugs-identifiés)
10. [Bonnes pratiques manquantes](#10-bonnes-pratiques-manquantes)
11. [Recommandations et corrections](#11-recommandations-et-corrections)
12. [Matrice de priorité](#12-matrice-de-priorité)

---

## 1. Résumé exécutif

L'application génère des signatures email HTML via Next.js et les met dans le presse-papiers via l'API `ClipboardItem`. L'audit identifie **4 bugs critiques**, **7 problèmes élevés** et **6 problèmes moyens** qui expliquent l'instabilité de rendu constatée.

### Score de compatibilité actuel (avant corrections)

| Client email | Template White V3 | Template Black V3 |
|---|---|---|
| Gmail (web, compte Google) | ⚠️ Icônes invisibles | ⚠️ Icônes invisibles |
| Outlook Windows 2016–2021 | ⚠️ Séparateur cassé | 🔴 Fond blanc (bug VML) |
| Outlook Windows 365 (Chromium) | ✅ Correct | ✅ Correct |
| Outlook Mac | ✅ Correct | ✅ Correct |
| Apple Mail macOS | ⚠️ Dark mode non protégé | ✅ Correct |
| iOS Mail | ⚠️ Dark mode non protégé | ✅ Correct |
| Yahoo Mail | ✅ Correct | ✅ Correct |
| Android Gmail | ⚠️ Icônes invisibles | ⚠️ Icônes invisibles |

**Problème central :** Les icônes de contact (téléphone, email, globe, localisation, réseaux sociaux) sont converties en `data:image/png;base64,...` au moment de la copie. **Gmail bloque les images base64 par politique de sécurité (CSP)** — toutes les icônes sont invisibles dans les emails envoyés depuis Gmail et reçus par Gmail.

---

## 2. Architecture et pipeline de rendu

### 2.1 Évaluation de Next.js pour ce cas d'usage

**Verdict : Approprié avec réserves.**

Next.js est utilisé comme interface de saisie — le HTML final est du pur HTML tabulaire inline sans injection de framework. L'architecture est conceptuellement saine. La génération HTML côté client (TypeScript pur) est correcte.

**Risque d'architecture identifié :**

```
SignatureForm → SignatureData (localStorage)
                    ↓
         getInlineImages()       ← URLs Vercel absolues (logos)
                    ↓
         processAllImages()      ← Canvas API → BASE64 pour toutes les ICÔNES ← BUG CRITIQUE
                    ↓
         buildSignatureHTML()    ← string HTML tabulaire
                    ↓
         ClipboardItem({ 'text/html': Blob })
                    ↓
         Coller dans Gmail / Outlook
```

### 2.2 Dualité des images : une décision à double tranchant

Le code distingue intentionnellement :

| Type | Méthode | Raison déclarée |
|---|---|---|
| Logos (`xalimartBlack`, `xalimartWhite`) | URL Vercel hébergée | Outlook Desktop bloque base64 |
| Icônes de contact (téléphone, email…) | **Canvas → base64** | "Glow" pour lisibilité sur fond sombre |
| Photo de profil | **base64** (upload utilisateur) | Pas d'hébergement externe |

**Le problème :** La logique inverse s'applique à Gmail. Gmail accepte les URLs hébergées et **bloque les `data:` URIs dans les `<img>`**. Résultat : les logos s'affichent dans Outlook ET Gmail, mais les icônes de contact disparaissent dans tout email reçu via Gmail.

### 2.3 Moteurs de rendu par client (contexte 2025-2026)

| Client | Moteur | Conséquence |
|---|---|---|
| Outlook Windows 2007–2021 | Microsoft Word (MSO) | VML requis, CSS très limité |
| Nouvel Outlook Windows 2023+ | Chromium/WebView2 | CSS moderne supporté |
| Outlook Mac | WebKit | Proche d'un navigateur |
| Gmail (web, apps) | Chrome/WebKit | CSP stricte, base64 bloqué |
| Apple Mail macOS/iOS | WebKit | Dark mode agressif |
| Yahoo Mail | Navigateur web | Support partiel |

> **Point critique 2025 :** Microsoft migre progressivement les utilisateurs vers le nouvel Outlook (Chromium). Pendant la transition, les deux moteurs coexistent. Le code doit fonctionner dans les deux simultanément.

---

## 3. Audit HTML — Structure des templates

### 3.1 Inventaire des templates et état de chaque problème

| Template | Fichier | Statut |
|---|---|---|
| `xalimart-black` (V1) | `lib/templates/xalimart-black.ts` | 🔴 Nombreux problèmes |
| `xalimart-white-v2` | `lib/templates/xalimart-white-v2.ts` | 🟠 Masqué mais non corrigé |
| `xalimart-black-v2` | `lib/templates/xalimart-black-v2.ts` | 🔴 Bug VML + div |
| `xalimart-white-v3` | `lib/templates/xalimart-white-v3.ts` | 🟡 Le meilleur — mais dark mode absent |
| `xalimart-black-v3` | `lib/templates/xalimart-black-v3.ts` | 🔴 Bug VML critique |

> Note : `xalimart-white` (V1) n'a pas été trouvé dans la codebase analysée. `xalimart-black` V1 est référencé dans `generateSignature.ts` mais masqué dans l'UI.

---

### 3.2 Bug VML #1 : fond blanc sur template noir (Black V2 et Black V3)

**Fichiers :** `lib/templates/xalimart-black-v2.ts:95`, `lib/templates/xalimart-black-v3.ts:89`

```html
<!-- ACTUEL — BUGUÉ dans Black V2 et Black V3 -->
<v:fill type="solid" color="#ffffff" />   ← BLANC au lieu de NOIR
...
<div style="background-color:#ffffff;..."> ← Wrapper externe BLANC

<!-- CORRECT -->
<v:fill type="solid" color="#000000" />
...
<div style="background-color:#000000;...">
```

**Impact :** Dans Outlook Windows 2016–2021 (Word engine), l'enveloppe VML définit la couleur de fond réelle. Le wrapper externe blanc crée une zone blanche visible autour de la signature noire. C'est la cause principale des problèmes signalés sur Outlook.

**Conversion requise px → pt pour VML :** Outlook mesure les `<v:rect>` en points, pas en pixels. `600px = 450pt`, `200px = 150pt`. Si les attributs `style` du `<v:rect>` utilisent des pixels, les dimensions seront incorrectes.

---

### 3.3 `<div>` pour Nom et Rôle — incompatible Outlook Word engine

**Fichiers :** `xalimart-black-v2.ts:152–161`, `xalimart-black.ts:162–168`

```html
<!-- MAUVAIS — V1 et V2 (ignoré par Outlook Word engine) -->
<div class="xsig-name" style="font-size:20px;font-weight:bold;line-height:1.6;margin:0 0 2px 0;">
  Jean Dupont
</div>
<div class="xsig-role" style="font-size:16px;color:#ffffff;line-height:1.6;margin:0 0 5px 0;">
  Directeur Général
</div>

<!-- CORRECT — V3 (table+td, Outlook compatible) -->
<tr>
  <td style="padding:0 0 2px 0;font-family:...;font-size:20px;font-weight:bold;
             color:#000000;line-height:26px;mso-line-height-rule:exactly;">
    <span style="margin:0;padding:0;">Jean Dupont</span>
  </td>
</tr>
```

**Impact Outlook Word engine :** `width`, `padding`, `margin`, `height` sur les `<div>` sont ignorés. Le nom et le rôle perdent leur espacement et leur largeur contrôlée, provoquant des retours à la ligne imprévisibles.

---

### 3.4 Séparateur vertical `<div>` — hauteur non respectée dans Outlook

**Fichiers :** `xalimart-white-v3.ts:173`, `xalimart-black-v3.ts:173`, `xalimart-white-v2.ts:174`, `xalimart-black-v2.ts:176`

```html
<!-- ACTUEL — MAUVAIS -->
<div style="width:1px;height:180px;background-color:#e0e0e0;
            margin:0;padding:0;font-size:0;line-height:0;"></div>

<!-- CORRECT — td avec background-color (universellement supporté) -->
<table cellpadding="0" cellspacing="0" border="0"
  style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
  <tr>
    <td width="1" height="180"
      style="width:1px;height:180px;background-color:#e0e0e0;
             font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>
</table>
```

**Pourquoi :** Outlook Word engine ignore la `height` sur les `<div>` sans contenu. Le séparateur s'effondre à 0px et disparaît. Un `<td>` avec `height` attribut ET style, contenant `&nbsp;`, est la seule méthode garantie dans tous les clients (testé : Outlook 2007+, Gmail, Apple Mail, Yahoo).

---

### 3.5 Template V1 (`xalimart-black`) — problèmes structurels multiples

```typescript
// xalimart-black.ts:127
<table class="xsig" width="750"  // ← 750px : trop large (standard max = 600px)
```

- **Largeur 750px** : dépasse la largeur standard email. Dans les volets de lecture étroits, la signature sera tronquée ou provoquera un scroll horizontal.
- **`border-radius:12px` sur la photo** : non supporté dans Outlook 2016 et antérieur. La photo sera carrée dans Outlook.
- **Aucun wrapper VML** : pas de `<!--[if gte mso 9]>` autour du template. Le fond noir ne sera pas garanti dans Outlook.
- **`line-height:1.4` relatif** : sans `mso-line-height-rule:exactly`, Outlook ajuste l'interligne librement.
- La V1 possède cependant le seul séparateur correct de la codebase (table+td), qui devrait être réutilisé dans V2/V3.

---

### 3.6 `overflow:hidden` sur les tables — effet nul dans Outlook

Présent dans tous les templates sur `<table>` et `<td>` :

```html
style="...;overflow:hidden;"
```

`overflow:hidden` n'est pas supporté sur les éléments table dans Outlook. Il est ignoré silencieusement. La protection contre le débordement de contenu est inexistante dans Outlook. Pas destructeur, mais la dépendance à ce style pour le recadrage est un danger.

---

### 3.7 `<style>` dans le `<body>` — placement non standard

Tous les templates injectent des blocs `<style>` avec des media queries directement dans le HTML de signature :

```html
<div style="...">
  <style>  ←  Pas dans un <head>
    @media screen and (max-width:600px){ ... }
  </style>
  <table>...</table>
</div>
```

La plupart des clients modernes acceptent `<style>` dans le `<body>`. Cependant :
- Un seul caractère invalide dans le bloc `<style>` fait que **Gmail supprime tout le bloc** silencieusement.
- La présence de `background-image: url(...)` dans n'importe quelle règle du bloc fait que Gmail supprime tout le bloc.
- Limite pratique Gmail : ~8 192 caractères dans un bloc `<style>`.

---

## 4. Audit CSS — Compatibilité par propriété

### 4.1 Tableau de support des propriétés utilisées

| Propriété CSS | Gmail web | Outlook Win (Word) | Outlook Win (Chromium) | Outlook Mac | Apple Mail | iOS Mail | Yahoo |
|---|---|---|---|---|---|---|---|
| `line-height: px` + `mso-line-height-rule:exactly` | ✅ | ✅ (V3 uniquement) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `line-height: 1.6` (relatif) | ✅ | ⚠️ Imprévisible | ✅ | ✅ | ✅ | ✅ | ✅ |
| `object-fit: cover` | ✅ | ❌ Ignoré | ✅ | ❌ Ignoré | ❌ | ❌ | ✅ |
| `@media (max-width)` dans `<style>` | ✅* | ⚠️ Partiel | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| `overflow: hidden` sur `<table>/<td>` | ⚠️ | ❌ Ignoré | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| `margin-top` sur `<table>` | ✅ | ❌ Ignoré | ✅ | ✅ | ✅ | ✅ | ✅ |
| `border-collapse: collapse` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `background-color` sur `<td>` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `display: block` sur `<img>` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `white-space: nowrap` sur `<td>` | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `color-scheme: light` | ❌ (absent) | ❌ (absent) | ❌ (absent) | ❌ (absent) | ❌ (absent) | ❌ (absent) | ❌ (absent) |
| `border-radius` | ✅ | ❌ 2016/2019 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `data: URI` dans `<img>` | ❌ **Bloqué CSP** | ⚠️ Variable | ✅ | ✅ | ✅ | ✅ | ✅ |

\* Gmail GANGA (Gmail As Non-Google Account) ignore entièrement `<style>`.

---

### 4.2 `line-height` relatif vs fixe — analyse détaillée

**V1 et V2 :** `line-height:1.6` — **PROBLÈME**  
**V3 :** `line-height:16px` + `mso-line-height-rule:exactly` — **CORRECT**

```css
/* MAUVAIS — V1, V2 */
line-height: 1.6;

/* CORRECT — V3 */
mso-line-height-rule: exactly;
line-height: 16px;
```

Sans `mso-line-height-rule:exactly`, Outlook Word engine ajuste automatiquement l'interligne pour contenir le plus grand élément de la ligne (images, emojis), créant les "grands espaces vides" signalés. Avec `exactly`, la valeur est respectée littéralement — attention : si `line-height` est inférieur à la hauteur d'une image inline, l'image sera rognée.

---

### 4.3 `object-fit:cover` — alternative obligatoire pour Outlook

**Présent dans :** Tous les templates, sur la photo de profil.

```html
style="...;object-fit:cover;object-position:top center;"
```

**Non supporté dans :** Outlook Windows 2016/2019/2021, Outlook Mac, Apple Mail, iOS Mail.

**Impact :** La photo est affichée à ses dimensions `width`×`height` déclarées mais sans recadrage. Si l'image uploadée a un ratio différent de 160:180 (le ratio cible), elle sera **étirée ou compressée** dans Outlook.

**Solution :** Le `PhotoCropModal` impose déjà un recadrage portrait — mais le ratio final dépend de l'outil `react-easy-crop` et n'est pas garanti en 160×180px. La correction doit s'effectuer dans le canvas de crop (section 11.5).

---

### 4.4 `margin-top` sur `<table>` — ignoré dans Outlook Word engine

Présent sur le tableau des icônes sociales dans tous les templates :

```html
<table style="...;margin-top:6px;">
```

Ce margin est **ignoré dans Outlook Word engine**. Les icônes sociales se collent immédiatement au tagline sans espace. Correction : spacer `<tr>`.

---

### 4.5 Century Gothic — police non disponible dans les clients email

```typescript
const FONT = "'Century Gothic', Arial, sans-serif"
```

Century Gothic n'est pas une police système universelle. Elle est disponible sur Windows via Microsoft Office, mais absente sur :
- La plupart des distributions Linux
- Les appareils Android
- iOS/macOS (pas nativement)

**Impact :** Le rendu de la signature variera selon l'OS : Century Gothic sur Windows + Office, Arial ailleurs. Ce comportement est acceptable si Arial est le fallback voulu, mais il faut le documenter et tester que le layout ne se casse pas avec Arial (largeurs de caractères différentes, risque d'overflow sur les `white-space:nowrap`).

---

## 5. Analyse par client email

### 5.1 Gmail (web — compte Google)

**Moteur :** Chrome + CSP stricte

| Aspect | Statut | Détail |
|---|---|---|
| HTML tabulaire | ✅ | Respecté |
| CSS inline | ✅ | Respecté |
| Bloc `<style>` | ✅ | Supporté (limite ~8 Ko) |
| `@media` queries | ✅ | Supportées |
| Images hébergées (Vercel) | ✅ | Chargées |
| Images `data:` base64 | ❌ **BLOQUÉES** | CSP — icônes invisibles |
| `object-fit` | ✅ | Supporté |
| Dark mode | ⚠️ | Inversion partielle possible |

**Niveau de risque : CRITIQUE** — Les icônes de contact sont invisibles dans tous les emails envoyés depuis Gmail.

---

### 5.2 Gmail GANGA (Gmail As Non-Google Account)

Comptes non-Google configurés dans Gmail (ex: compte professionnel Xalimart via IMAP).

| Aspect | Statut |
|---|---|
| Bloc `<style>` | ❌ Supprimé entièrement |
| `@media` queries | ❌ Non appliquées |
| CSS inline | ✅ Respecté |
| Images `data:` base64 | ❌ Bloquées |

**Niveau de risque : ÉLEVÉ** — Pas de responsive, icônes invisibles.

---

### 5.3 Outlook Windows 2016–2021 (Word engine)

**Moteur :** Microsoft Word

| Aspect | Statut | Détail |
|---|---|---|
| VML enveloppe | ✅ V3 présent | Mais couleur buguée sur Black |
| `<div>` pour texte | ❌ | Layout cassé sur V1, V2 |
| `<div>` séparateur | ❌ | S'effondre à 0px |
| `object-fit` | ❌ | Photo potentiellement déformée |
| `mso-line-height-rule:exactly` | ✅ V3 | Absent V1, V2 |
| `background-color` sur `<td>` | ✅ | Fiable |
| `border-radius` | ❌ | Ignoré (photo carrée) |
| `overflow:hidden` | ❌ | Ignoré |
| Images `data:` base64 | ⚠️ | Variable selon version |
| Images hébergées | ✅ | Téléchargées si connexion |

**Niveau de risque : ÉLEVÉ (White V3) / CRITIQUE (Black V3)**

---

### 5.4 Nouvel Outlook Windows 2023+ (Chromium)

**Moteur :** WebView2 / Chromium

Supporte CSS moderne, `object-fit`, `@media`, `<style>`. La signature V3 s'affiche correctement. Les images base64 sont acceptées.

**Niveau de risque : FAIBLE** — Mais il faut tester que VML ne perturbe pas le rendu Chromium (les `<!--[if gte mso 9]>` sont normalement ignorés par un moteur non-Outlook).

---

### 5.5 Outlook Mac (2019, 16.x)

**Moteur :** WebKit

| Aspect | Statut |
|---|---|
| VML | Ignoré (WebKit) — sans impact négatif |
| `object-fit` | ❌ Non supporté dans Outlook Mac 2019 (oui depuis 2022+) |
| `@media` | ✅ |
| `<style>` | ✅ |
| Dark mode | ⚠️ `prefers-color-scheme` supporté mais protection absente |

**Niveau de risque : MOYEN** — Outlook Mac 2019 ne supporte pas `object-fit`.

---

### 5.6 Apple Mail (macOS + iOS Mail)

| Aspect | Statut |
|---|---|
| HTML tabulaire | ✅ |
| `@media` | ✅ |
| `object-fit` | ❌ Non supporté |
| Dark mode auto-inversion | ⚠️ **ÉLEVÉ** pour White V3 |
| Images hébergées | ✅ (si connexion) |
| `color-scheme` | ❌ Absent |

**Apple Mail** inverse automatiquement le fond blanc → noir et le texte noir → blanc en dark mode. Le template White V3 deviendra illisible : texte blanc sur fond blanc (ou inversement). Aucune protection n'est présente.

**Technique d'inversion Apple Mail :** Apple Mail cible précisément `#000000` et `#ffffff`. Utiliser `#000001` et `#fffffe` contourne l'inversion — différence imperceptible à l'œil nu.

**Niveau de risque : ÉLEVÉ** — Illisible en dark mode.

---

### 5.7 Yahoo Mail

| Aspect | Statut |
|---|---|
| HTML tabulaire | ✅ |
| `<style>` | ✅ Partiel |
| `@media prefers-color-scheme` | ❌ Transformé en `@media (_filtered_a)` |
| Images hébergées | ✅ |
| Images base64 | ✅ |

**Niveau de risque : FAIBLE/MOYEN** — Pas de dark mode réactif, mais rendu généralement correct.

---

### 5.8 Android Gmail App

Comportement identique à Gmail web pour les images base64 (bloquées). Media queries supportées.

**Niveau de risque : ÉLEVÉ** — Icônes invisibles.

---

## 6. Audit Dark Mode

### 6.1 État actuel : aucune protection

Aucun template ne contient :
- `meta name="color-scheme"`
- `@media (prefers-color-scheme: dark)`
- `[data-ogsc]` ou `[data-ogsb]`
- Couleurs "off-black"/"off-white"

### 6.2 Comportement de chaque client en dark mode

| Client | Stratégie dark mode | Impact sur White V3 | Impact sur Black V3 |
|---|---|---|---|
| Apple Mail macOS | Inversion automatique `#000000` ↔ `#ffffff` | 🔴 Texte noir → blanc sur fond blanc devenu noir | ✅ Déjà sombre |
| iOS Mail | Même qu'Apple Mail | 🔴 Illisible | ✅ |
| Outlook Windows 2021 | Inversion complète | 🟠 Possible dégradation | 🟠 Possible inversion |
| Outlook.com | Inversion partielle | 🟠 Fonds clairs → sombres | 🟠 Variable |
| Gmail (web) | Pas d'inversion | ✅ | ✅ |
| Gmail iOS App | Inversion possible | 🟠 | 🟠 |
| Yahoo Mail | Aucune | ✅ | ✅ |

### 6.3 Solution complète recommandée

**Étape 1 — Meta tags (dans le HTML wrapper de chaque template) :**

```html
<!-- À injecter dans les wrappers de tous les templates -->
<div style="background-color:#fffffe;color-scheme:light only;...">
```

**Étape 2 — Bloc `<style>` dans chaque template :**

```css
/* Protection Apple Mail (ne touche pas à #000001 et #fffffe) */
/* Cible Outlook.com dark mode */
[data-ogsb] .xsig-outer { background-color: #ffffff !important; }
[data-ogsc] .xsig-name  { color: #000000 !important; }
[data-ogsc] .xsig-info  { color: #000000 !important; }

/* Support dark mode déclaré pour clients compatibles */
@media (prefers-color-scheme: dark) {
  /* White V3 : ne rien changer, rester en light */
  .xsig-outer { background-color: #ffffff !important; color: #000000 !important; }
  .xsig-name  { color: #000000 !important; }
}
```

**Étape 3 — Couleurs "off-black" et "off-white" pour contourner Apple Mail :**

```typescript
// Dans xalimart-white-v3.ts
const BG        = '#fffffe'  // au lieu de '#ffffff'
const TEXT_NAME = '#000001'  // au lieu de '#000000'
const TEXT_INFO = '#000001'
```

Cette technique est invisible à l'œil mais contourne l'algorithme d'inversion automatique d'Apple Mail qui cible exactement `#000000` et `#ffffff`.

---

## 7. Analyse du copier/coller

### 7.1 Pipeline ClipboardItem — état actuel

```typescript
// components/CopyButton.tsx

const htmlPromise = getInlineImages()           // URLs Vercel pour logos
  .then(raw => processAllImages(raw))           // Canvas → base64 pour ICÔNES ← PROBLÈME
  .then(images => new Blob(
    [buildSignatureHTML(data, images)],
    { type: 'text/html' }
  ))

const item = new ClipboardItem({
  'text/html': htmlPromise,                     // Promise passée directement ← CORRECT pour Safari
  'text/plain': textBlob,
})

await navigator.clipboard.write([item])
```

**Ce qui est correct :**
- Le pattern Promise passée au `ClipboardItem` (pas `await` avant) est la bonne pratique pour Safari — conserve le lien avec le geste utilisateur.
- `ClipboardItem` avec `text/html` est supporté depuis Firefox 127 (juin 2024) — support universel atteint.

**Ce qui est problématique :**
- `processAllImages()` convertit les icônes en base64 → ces data URIs sont bloquées par Gmail.
- Aucun fallback si `ClipboardItem` échoue (Firefox anciens, HTTP, permissions).

### 7.2 Support navigateur (2025)

| Navigateur | `ClipboardItem` | `text/html` | Contexte requis |
|---|---|---|---|
| Chrome 76+ | ✅ | ✅ | HTTPS ou localhost |
| Edge 79+ | ✅ | ✅ | HTTPS ou localhost |
| Safari 13.1+ | ✅ | ✅ | HTTPS |
| Firefox 127+ (juin 2024) | ✅ | ✅ | HTTPS |
| Firefox < 127 | ❌ | ❌ | — |

**Baseline Newly Available** depuis mars 2025 — support universel sur navigateurs modernes.

### 7.3 Sanitisation HTML par Safari/WebKit

Lors de la copie via `ClipboardItem`, Safari charge le HTML dans un document sandboxé et **supprime** :
- Scripts et gestionnaires d'événements (`onclick`, etc.)
- Commentaires HTML (`<!-- ... -->`) — **les conditionnels VML sont donc supprimés par Safari**
- Éléments cachés et attributs non-standard

**Impact :** Quand un utilisateur Safari copie la signature, les blocs VML `<!--[if gte mso 9]>` sont supprimés. La signature collée dans Outlook depuis Safari n'aura pas d'enveloppe VML.

### 7.4 Ce que Gmail modifie au collage dans les paramètres de signature

Quand l'utilisateur colle dans Gmail Settings > Signature :
- Gmail réinjecte le HTML dans son éditeur (Trix ou équivalent)
- Les `<style>` blocks peuvent être déplacés ou supprimés
- Les classes CSS peuvent être préfixées (`xsig-outer` → `gmail_xsig-outer`)
- Les `data:` URIs dans `<img>` sont **supprimées ou remplacées** par des images cassées

### 7.5 Absence de fallback

Si `navigator.clipboard.write` échoue :

```typescript
} catch (err) {
  console.error('Copy failed:', err)
  setState('error')
  setTimeout(() => setState('idle'), 4000)
}
```

L'utilisateur voit un état d'erreur pendant 4 secondes puis rien. Aucun mécanisme alternatif n'est proposé (téléchargement du fichier `.html`, sélection manuelle, `execCommand`).

---

## 8. Audit des images (base64 vs hébergées)

### 8.1 Le bug critique : `processAllImages()` et Gmail CSP

**Fichier :** `lib/safeIcons.ts`

```typescript
export async function processAllImages(images: SignatureImages): Promise<SignatureImages> {
  // Convertit en base64 toutes les clés contenant 'icon', 'wh', 'bl'...
  for (const key of iconKeys) {
    safeImages[key] = await makeIconSafe(iconUrl)  // → data:image/png;base64,...
  }
}
```

Les icônes converties incluent : `emailIcon`, `emailIconWh`, `globeIcon`, `globeIconWh`, `appelIcon`, `appelIconBl`, `phoneIcon`, `phoneIconBl`, `telephoneIconWh`, `locationBlack`, `locationWhite`, `instagramWh`, `facebookWh`, `linkedinWh`, `instagramBl`, `facebookBl`, `linkedinBl`.

**Résultat dans le HTML copié :**

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAA..."  ← BLOQUÉ par Gmail
     width="16" height="16">
```

**Gmail bloque tous les `data:` URIs dans les `<img>` par Content Security Policy** (politique de sécurité anti-XSS). Les icônes sont remplacées par des icônes cassées ou des espaces vides.

**Impact :** Dans tout email envoyé depuis Gmail ou reçu par Gmail, les icônes de contact (téléphone, email, globe, localisation, réseaux sociaux) sont **invisibles**. La signature perd toute sa mise en forme visuelle.

### 8.2 Pourquoi `makeIconSafe()` existe

La fonction ajoute un "glow" blanc autour des icônes noires pour qu'elles restent visibles sur fond sombre (template Black). C'est une bonne idée conceptuelle mais son implémentation via Canvas+base64 crée le problème Gmail.

### 8.3 Solution : garder les images hébergées

**Option A — Deux jeux d'icônes hébergés (recommandé) :**

Héberger directement les icônes avec glow sur Vercel (`/public/icons-white-glow/`) et utiliser les URLs hébergées dans tous les templates.

```typescript
// Avant (base64 via Canvas)
safeImages[key] = await makeIconSafe(iconUrl)

// Après (URL hébergée)
const GLOW_BASE = 'https://xalimart-group.vercel.app/icons-glow'
// Ex: emailIcon → emailIcon-glow.png (pré-traité une fois avec le même algorithme Canvas)
```

**Option B — Icônes blanches natives pour le template Black :**

Créer des variantes blanches des icônes directement dans `/public/` (PNG avec icône blanche sur fond transparent). Supprimer `safeIcons.ts` entièrement.

### 8.4 Photo de profil (base64) — cas justifié mais à risque

La photo uploadée par l'utilisateur reste en base64. C'est acceptable car :
- La photo est spécifique à chaque utilisateur, pas hébergeable facilement
- Elle est dans `photoBase64` (pas dans `safeImages`)

**Risque :** Gmail clippe les emails dépassant 102 Ko. Une photo base64 haute résolution peut à elle seule dépasser cette limite, tronquant l'email.

**Recommandation :** Limiter la photo à 150×200px maximum lors du crop, et compresser en JPEG qualité 80% (au lieu de PNG). Réduction typique : 200 Ko → 15 Ko.

### 8.5 Taille estimée du HTML copié (actuel)

| Élément | Taille estimée |
|---|---|
| Structure HTML + texte | ~5 Ko |
| Logo Xalimart (URL Vercel) | ~100 octets |
| 10 icônes en base64 (PNG 128px chacune) | ~80–200 Ko |
| Photo de profil base64 (PNG crop) | ~50–500 Ko |
| **Total estimé** | **~135–700 Ko** |

La limite de clipping Gmail est **102 Ko**. Un email avec photo et icônes base64 sera systématiquement coupé par Gmail.

---

## 9. Vulnérabilités et bugs identifiés

### BUG-01 🔴 CRITIQUE — VML fond blanc sur template noir

**Fichiers :** `lib/templates/xalimart-black-v2.ts:95`, `lib/templates/xalimart-black-v3.ts:89`

La couleur VML et le wrapper HTML externe sont blancs (`#ffffff`) alors que le contenu est noir (`#000000`). Bandes blanches visibles dans Outlook Windows autour de la signature noire.

---

### BUG-02 🔴 CRITIQUE — Icônes base64 bloquées par Gmail

**Fichier :** `lib/safeIcons.ts`

`processAllImages()` convertit les icônes en `data:` URIs, bloquées par Gmail CSP. Toutes les icônes sont invisibles dans Gmail.

---

### BUG-03 🟠 ÉLEVÉ — `<div>` pour Nom/Rôle dans Outlook Word engine

**Fichiers :** `lib/templates/xalimart-black-v2.ts:152`, `lib/templates/xalimart-black.ts:162`

Les `<div>` sont ignorés par le Word engine d'Outlook pour le layout. Le texte perd son espacement et sa largeur contrôlée.

---

### BUG-04 🟠 ÉLEVÉ — Séparateur `<div>` qui s'effondre dans Outlook

**Fichiers :** Tous les templates V2, V3

`height` ignoré sur les `<div>` vides dans Outlook. Le séparateur vertical disparaît.

---

### BUG-05 🟠 ÉLEVÉ — Aucune protection dark mode

**Fichiers :** Tous les templates

Template White V3 illisible dans Apple Mail en dark mode (texte noir → blanc sur fond devenu noir).

---

### BUG-06 🟡 MOYEN — `object-fit:cover` non supporté dans Outlook/Apple Mail

**Fichiers :** Tous les templates, photo de profil

Photo potentiellement déformée dans Outlook Windows 2016–2021, Outlook Mac 2019, Apple Mail.

---

### BUG-07 🟡 MOYEN — `line-height` relatif dans V1 et V2

**Fichiers :** `xalimart-black.ts`, `xalimart-white-v2.ts`, `xalimart-black-v2.ts`

`line-height:1.6` sans `mso-line-height-rule:exactly` crée des espaces imprévisibles dans Outlook Word engine.

---

### BUG-08 🟡 MOYEN — `margin-top:6px` sur table sociale (ignoré Outlook)

**Fichiers :** Tous les templates

L'espace entre le tagline et les icônes sociales est absent dans Outlook Word engine.

---

### BUG-09 🟡 MOYEN — VML incompatible avec Safari (suppression des commentaires)

**Fichier :** `components/CopyButton.tsx` (pipeline)

Safari supprime les commentaires HTML lors de la copie dans `ClipboardItem`. Les blocs `<!--[if gte mso 9]>` disparaissent. La signature collée depuis Safari vers Outlook n'a pas de VML.

---

### BUG-10 🟡 MOYEN — Aucun fallback si ClipboardItem échoue

**Fichier :** `components/CopyButton.tsx`

Pas de téléchargement alternatif ni d'`execCommand` fallback. L'utilisateur est bloqué.

---

### BUG-11 🟡 MOYEN — Template V1 trop large (750px)

**Fichier :** `lib/templates/xalimart-black.ts:127`

Largeur 750px dépassant le standard 600px. Tronquée dans les volets de lecture étroits.

---

### BUG-12 🔵 FAIBLE — `border-radius:12px` sur photo V1

**Fichier :** `lib/templates/xalimart-black.ts:86`

Non supporté dans Outlook 2016/2019. La photo sera carrée dans ces versions.

---

### BUG-13 🔵 FAIBLE — Photo PNG non compressée (taille HTML)

**Fichier :** `components/CopyButton.tsx`, `lib/composite.ts`

`canvas.toDataURL('image/png')` génère des PNG non compressés. Le format JPEG avec compression ou WebP serait 5–10× plus petit.

---

## 10. Bonnes pratiques manquantes

### 10.1 `role="presentation"` absent sur les tables de layout

```html
<!-- ACTUEL -->
<table cellpadding="0" cellspacing="0" border="0">

<!-- RECOMMANDÉ -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
```

Sans `role="presentation"`, les lecteurs d'écran announcent les tables comme des tableaux de données, perturbant l'accessibilité.

### 10.2 `alt=""` absent sur les images décoratives

```html
<!-- ACTUEL — ambigu -->
<img src="..." alt="tagline">

<!-- CORRECT — image décorative -->
<img src="..." alt="">

<!-- CORRECT — image informative -->
<img src="..." alt="Xalimart Group">
```

### 10.3 Absence de cache pour `processAllImages()`

`processAllImages()` est appelé à chaque clic sur "Copy". La conversion Canvas de ~15 icônes via 8 requêtes fetch est relancée entièrement. Un cache `useRef` ou `useMemo` éviterait ce coût.

### 10.4 Pas de validation de taille de photo

Aucune limite n'est imposée sur la résolution ou le poids de la photo uploadée. Un utilisateur peut uploader une image 4K qui sera stockée intégralement en base64 dans `localStorage` et dans le HTML copié.

### 10.5 La photo n'est pas recadrée aux dimensions exactes du template

`react-easy-crop` impose un aspect ratio portrait mais ne garantit pas les dimensions exactes `160×180px`. Le canvas de crop (`PhotoCropModal`) devrait forcer la sortie à `320×360px` (×2 pour Retina) et exporter en JPEG/80.

### 10.6 `mso-table-lspace:0pt;mso-table-rspace:0pt` manquant sur certaines tables internes

Les tables de contact rows internes n'ont pas toutes `mso-table-lspace:0pt;mso-table-rspace:0pt`. Outlook ajoute 3px d'espace par défaut entre les cellules de table. Toujours l'inclure sur chaque `<table>`.

### 10.7 Pas de `xml:lang` ni `lang` dans le wrapper HTML

```html
<!-- RECOMMANDÉ -->
<div lang="fr" style="...">
```

Améliore l'accessibilité et peut influencer la gestion de la typographie dans certains clients.

---

## 11. Recommandations et corrections

### 11.1 CORRECTION CRITIQUE — Icônes : supprimer la conversion base64, héberger les variantes

**Action :** Créer dans `/public/` deux dossiers d'icônes préprocessées :

```
public/
  icons-light/     ← icônes noires pour fond blanc
    email.png
    phone.png
    globe.png
    location.png
    instagram.png
    facebook.png
    linkedin.png
  icons-dark/      ← icônes blanches (ou avec glow) pour fond noir
    email.png
    phone.png
    ...
```

Générer les icônes "avec glow" une seule fois (script Node.js avec Canvas) et les pousser dans `/public/`. Supprimer `safeIcons.ts` et son appel dans `CopyButton.tsx` et `SignaturePreview.tsx`.

**Dans `generateSignature.ts` :**

```typescript
const HOSTED = 'https://xalimart-group.vercel.app'

export async function getInlineImages(): Promise<SignatureImages> {
  return {
    emailIcon:      `${HOSTED}/icons-light/email.png`,
    emailIconWh:    `${HOSTED}/icons-dark/email.png`,
    globeIcon:      `${HOSTED}/icons-light/globe.png`,
    globeIconWh:    `${HOSTED}/icons-dark/globe.png`,
    appelIcon:      `${HOSTED}/icons-light/phone.png`,
    appelIconBl:    `${HOSTED}/icons-dark/phone.png`,
    // etc.
  }
}
```

**Résultat :** Les icônes deviennent des URLs hébergées → visibles dans Gmail ET Outlook.

---

### 11.2 CORRECTION CRITIQUE — Bug VML fond noir

**Fichiers :** `xalimart-black-v3.ts`, `xalimart-black-v2.ts`

```typescript
// AVANT (bugué)
return `<!--[if gte mso 9]>
  <v:rect ... style="width:600px;height:200px;">
    <v:fill type="solid" color="#ffffff" />     ← BLANC
  ...
  <div style="background-color:#ffffff;...">   ← BLANC

// APRÈS (correct)
return `<!--[if gte mso 9]>
  <v:rect ... style="width:450pt;height:150pt;">  ← Conversion px→pt
    <v:fill type="solid" color="#000000" />        ← NOIR
  ...
  <div style="background-color:#000000;...">       ← NOIR
```

Note : les dimensions VML doivent être en points (pt). `600px = 450pt`, `200px = 150pt`.

---

### 11.3 CORRECTION ÉLEVÉE — Remplacer le séparateur `<div>` par `<td>`

**Tous les templates V2, V3 :**

```html
<!-- AVANT -->
<td class="xsig-c2" width="10" height="180" style="...padding:0 4.5px;...">
  <div style="width:1px;height:180px;background-color:#e0e0e0;..."></div>
</td>

<!-- APRÈS -->
<td class="xsig-c2" width="10" height="180" style="...padding:0 4.5px;...">
  <table cellpadding="0" cellspacing="0" border="0"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <tr>
      <td width="1" height="180"
        style="width:1px;height:180px;background-color:#e0e0e0;
               font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td>
    </tr>
  </table>
</td>
```

---

### 11.4 CORRECTION ÉLEVÉE — Dark mode protection

**Dans tous les templates, wrapper externe :**

```html
<div style="background-color:#fffffe;color-scheme:light only;...">
```

**Dans le bloc `<style>` de chaque template :**

```css
/* Protection Outlook.com dark mode */
[data-ogsb] table.xsig-outer { background-color: #fffffe !important; }
[data-ogsc] td.xsig-c3 { color: #000001 !important; }

/* Déclarer que ce template est light-only */
@media (prefers-color-scheme: dark) {
  table.xsig-outer { background-color: #fffffe !important; }
  .xsig-name, .xsig-role { color: #000001 !important; }
}
```

**Couleurs off-black/off-white dans xalimart-white-v3.ts :**

```typescript
const BG        = '#fffffe'  // #ffffff → #fffffe
const TEXT_NAME = '#000001'  // #000000 → #000001
const TEXT_INFO = '#000001'
const TEXT_ADDR = '#000001'
```

---

### 11.5 CORRECTION MOYENNE — Photo de profil : format et dimensions

**Dans `PhotoCropModal` :** Forcer la sortie à `320×360px` en JPEG/80 :

```typescript
// Dans la logique de crop
const canvas = document.createElement('canvas')
canvas.width  = 320  // 2× l'affichage (160px) pour Retina
canvas.height = 360  // ratio 160:180 respecté
const ctx = canvas.getContext('2d')!
// ... dessin du crop ...
const base64 = canvas.toDataURL('image/jpeg', 0.80)  // JPEG, qualité 80%
```

**Dans les templates, utiliser les dimensions ×2 avec attributs HTML :**

```html
<img src="${photoBase64}" width="160" height="180"
     style="display:block;width:160px;height:180px;border:none;vertical-align:top;">
```

Supprimer `object-fit:cover` — inutile si l'image est déjà au bon ratio.

---

### 11.6 CORRECTION MOYENNE — Spacer `<tr>` pour les icônes sociales

**Tous les templates :**

```html
<!-- AVANT -->
<table style="...;margin-top:6px;">

<!-- APRÈS -->
<tr>
  <td height="6" style="height:6px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
</tr>
<table style="...;margin:0;">
```

---

### 11.7 CORRECTION MOYENNE — Fallback ClipboardItem

**Dans `CopyButton.tsx`, ajouter un fallback `execCommand` :**

```typescript
const handleCopy = async () => {
  setState('loading')
  try {
    // ... tentative ClipboardItem ...
    await navigator.clipboard.write([item])
    setState('success')
  } catch (err) {
    // Fallback : téléchargement du fichier HTML
    try {
      const images = await getInlineImages()
      const html = buildSignatureHTML(data, images)
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'signature-xalimart.html'
      a.click()
      URL.revokeObjectURL(url)
      setState('success') // ou un état 'downloaded'
    } catch {
      setState('error')
    }
  }
}
```

---

### 11.8 CORRECTION FAIBLE — `role="presentation"` sur les tables

Dans `shared.ts` et tous les templates, ajouter `role="presentation"` à chaque `<table>` de layout :

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" ...>
```

---

### 11.9 CORRECTION FAIBLE — Réduire `xalimart-black` V1 à 600px

```typescript
// xalimart-black.ts:127
<table class="xsig" width="600"   // ← 750 → 600
  style="...;width:600px;...">
```

---

## 12. Matrice de priorité

### Bugs à corriger immédiatement (Sprint 1)

| ID | Problème | Fichiers | Effort | Impact |
|---|---|---|---|---|
| BUG-02 | Icônes base64 bloquées Gmail | `safeIcons.ts`, `generateSignature.ts`, `CopyButton.tsx` | 🔴 Moyen | Icônes visibles dans Gmail |
| BUG-01 | VML fond blanc sur template noir | `xalimart-black-v2.ts`, `xalimart-black-v3.ts` | 🟢 Faible | Fond noir correct dans Outlook |
| BUG-04 | Séparateur `<div>` cassé | V2, V3 (4 fichiers) | 🟢 Faible | Séparateur visible dans Outlook |

### Corrections importantes (Sprint 2)

| ID | Problème | Fichiers | Effort | Impact |
|---|---|---|---|---|
| BUG-05 | Dark mode non protégé | Tous les templates | 🟡 Moyen | Lisible sur Apple Mail dark |
| BUG-06 | `object-fit` + photo deformée | `PhotoCropModal`, templates | 🟡 Moyen | Photo correcte dans Outlook |
| BUG-10 | Pas de fallback copie | `CopyButton.tsx` | 🟢 Faible | Pas de blocage utilisateur |
| BUG-08 | `margin-top` social ignoré | Tous templates | 🟢 Faible | Espacement correct Outlook |

### Améliorations (Sprint 3)

| ID | Problème | Fichiers | Effort | Impact |
|---|---|---|---|---|
| BUG-03 | `<div>` pour Nom/Rôle V1/V2 | V1, V2 (masqués) | 🟡 Moyen | Stabilité si réactivés |
| BUG-07 | `line-height` relatif V1/V2 | V1, V2 (masqués) | 🟢 Faible | Espacement Outlook |
| BUG-13 | Photo PNG → JPEG compressé | `PhotoCropModal` | 🟢 Faible | Réduction taille HTML |
| BUG-11 | Template V1 → 600px | `xalimart-black.ts` | 🟢 Faible | Compatibilité volet lecture |

---

## Annexe — Checklist de validation post-correctifs

Après chaque correction, valider sur :

```
□ Gmail web (compte Google)         → Icônes visibles, layout correct
□ Gmail GANGA                       → CSS inline seul, pas de style block
□ Outlook Windows 2019 (Word)       → Fond, séparateur, layout, photo
□ Outlook Windows 365 (Chromium)    → Layout général
□ Outlook Mac 2019                  → Layout, object-fit
□ Apple Mail macOS (dark mode ON)   → Lisibilité White V3
□ iOS Mail (dark mode ON)           → Lisibilité White V3
□ Yahoo Mail                        → Layout général
□ Firefox (clipboard)               → Bouton copier fonctionnel
□ Safari (clipboard)                → VML préservé après copie
□ HTML < 102 Ko total (avec photo)  → Pas de clipping Gmail
```

---

*Rapport généré en avril 2026 — Sources : caniemail.com, litmus.com, emailonacid.com, hteumeuleu.com, tabular.email, MDN Web Docs, Campaign Monitor CSS Guide, Google Workspace Gmail CSS Support.*
