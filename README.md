# Guide de l'Utilisateur - Générateur de Signatures Xalimart Group

## 1. Accès à l'Application (Login)
Pour accéder à l'interface, les utilisateurs doivent utiliser les identifiants partagés suivants :
- **Identifiant :** `demo-xalimart`
- **Mot de passe :** `demo-xalimart-password`

## 2. Gestion de la Session et Boutons de l'Interface
L'application comporte plusieurs boutons de contrôle pour gérer votre travail :
- **Bouton "Sign Out" (En haut à droite) :** Déconnecte l'utilisateur et le renvoie à la page d'accueil.
- **Bouton "Clear local cache" (En bas au centre) :** Efface instantanément toutes les informations saisies (nom, rôle, photo) pour recommencer à zéro.
- **Bouton "Copy Signature" (Dans l'aperçu) :** Copie la signature finale dans votre presse-papiers pour pouvoir la coller dans Gmail ou Outlook. Ce bouton ne s'active que si les champs obligatoires sont remplis.

## 3. Choix du Modèle (Template Picker)
L'utilisateur doit choisir l'un des 4 modèles avant de copier sa signature :
- **Xalimart White V2 :** Design blanc classique. Optimisé pour Gmail et Apple Mail.
- **Xalimart White V3 (Outlook Fix) :** Même apparence que V2, mais conçu spécifiquement pour Microsoft Outlook afin d'éviter les décalages de texte lors de l'envoi d'emails.
- **Xalimart Black V2 :** Design premium sur fond noir. Optimisé pour Gmail et Apple Mail.
- **Xalimart Black V3 (Outlook Fix) :** Design premium noir, spécialisé pour les utilisateurs de Microsoft Outlook.

## 4. Gestion de la Photo de Profil
- **Téléchargement :** Cliquez sur l'icône de profil pour choisir une photo.
- **Recadrage Automatique (Crop) :** Une fenêtre s'ouvre obligatoirement pour vous permettre d'ajuster le cadrage. Le système force un format vertical (Portrait) pour garantir la proportion de la signature.
- **Bouton "Remove" :** Permet de supprimer la photo si vous souhaitez en choisir une autre ou ne pas en mettre.

## 5. Saisie des Informations (Le Formulaire)
Le système sépare les informations modifiables des informations fixes de l'entreprise :

### 5.1. Champs Modifiables (Par l'utilisateur)
- **Nom Complet :** Obligatoire. Si vide, la copie est impossible.
- **Rôle / Titre :** Facultatif. Si laissé vide, la ligne disparaît automatiquement.
- **Email :** Obligatoire. Doit être une adresse email valide.
- **Téléphone :** Sélectionnez le drapeau du pays et tapez votre numéro. Il sera transformé en lien WhatsApp cliquable.
- **Réseaux Sociaux (LinkedIn, Instagram, Facebook) :** Facultatifs. Si un lien n'est pas rempli, l'icône correspondante n'apparaîtra pas dans la signature finale.

### 5.2. Informations Fixes (Verrouillées pour la Marque)
Ces données sont permanentes et ne peuvent pas être modifiées pour garantir l'image du groupe :
- **Adresse :** Residence Sadiya Tower, Dakar - Senegal.
- **Téléphone Standard :** +221 77 624 07 07.
- **Site Web :** www.xalimartgroup.sn.
- **Logos et Slogans :** Les visuels officiels de Xalimart sont fixes.

## 6. Liste de Contrôle pour les Tests (Checklist)
1. **Test du Bouton Copier :** Vérifiez que le bouton reste grisé (inactif) si le nom ou l'email est vide.
2. **Test du Recadrage :** Vérifiez que le cadre de recadrage force toujours une forme rectangulaire verticale.
3. **Test des Réseaux Sociaux :** Remplissez uniquement LinkedIn et vérifiez que les icônes Facebook/Instagram disparaissent bien de l'aperçu.
4. **Test Outlook (V3) :** Envoyez un email avec le modèle V3 depuis Outlook vers Gmail. Le texte doit rester parfaitement aligné sans grands espaces vides entre les lignes.
5. **Test de Déconnexion :** Cliquez sur "Sign Out" et vérifiez le retour immédiat à la page de login.
