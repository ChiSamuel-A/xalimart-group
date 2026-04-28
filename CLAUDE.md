# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured.

## Architecture

This is a **Next.js 14 App Router** application that generates HTML email signatures for Xalimart Group employees.

### Auth flow

Authentication is custom cookie-based — **not Clerk** (the dependency exists but is unused). Credentials are hardcoded in `app/api/auth/login/route.ts` (`demo-xalimart` / `demo-xalimart-password`). The middleware in `middleware.ts` guards `/dashboard` by checking for an `auth_token` cookie and redirects unauthenticated users to `/login`.

### Route map

- `/` → immediate redirect to `/dashboard`
- `/login` → login form (`app/login/page.tsx`)
- `/dashboard` → main app (`app/dashboard/page.tsx`, client component)
- `/api/auth/login` and `/api/auth/logout` → cookie management

### Signature generation pipeline

1. **`app/dashboard/page.tsx`** holds the top-level state (`SignatureData`) persisted to `localStorage` under key `xalimart_signature_data`.
2. **`components/SignatureForm.tsx`** — editable fields (name, role, email, phone, socials, photo upload).
3. **`components/TemplatePicker.tsx`** — selects one of 6 template IDs written into `SignatureData.templateId`.
4. **`components/SignaturePreview.tsx`** — renders a live HTML preview using `getPreviewImages()` (local `/public` paths).
5. **`components/CopyButton.tsx`** — re-builds the signature via `buildSignatureHTML()` using `getInlineImages()` (absolute Vercel URLs) so copied HTML works in Outlook Desktop.
6. **`lib/generateSignature.ts`** — central router: dispatches to the correct template builder based on `templateId`.
7. **`lib/templates/`** — one file per template. All templates produce a self-contained HTML string using inline table-based layout. Shared helpers (badge rows, social icon rows, static brand data) live in `lib/templates/shared.ts`.

### Two image strategies (important)

- **Preview** (`getPreviewImages`): uses relative `/public` paths — fast, works locally.
- **Copy to clipboard** (`getInlineImages`): uses absolute `https://xalimart-group.vercel.app` URLs — required so Outlook Desktop can fetch logos as hosted images. Base64 logos are unreliable in Outlook.
- **Profile photo**: always stored as base64 (user-uploaded), embedded directly in the HTML.

### Photo composite

`lib/composite.ts` merges the user's circular profile photo with a diagonal line image onto a 145×250 Canvas. This produces a single PNG so email clients cannot break the layout by reordering separate images.

### Template naming convention

| Template ID | Description |
|---|---|
| `xalimart-white` / `xalimart-black` | Legacy v1 |
| `xalimart-white-v2` / `xalimart-black-v2` | Current — optimised for Gmail & Apple Mail |
| `xalimart-white-v3` / `xalimart-black-v3` | Outlook fix — adds `mso-line-height-rule:exactly` and nested table tricks to prevent spacing issues in Outlook Desktop |

### Static brand constants

Locked values (address, standard phone) are defined in `lib/templates/shared.ts` as `STATIC_ADDRESS` and `STATIC_PHONE` — update them there to change across all templates.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (fallback hardcoded in `lib/supabase.ts`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key (fallback hardcoded) |

Create `.env.local` for local overrides. The app runs without a `.env.local` because fallbacks are present.

### Key type

`types/signature.ts` defines `SignatureData` (the central state shape) and `SignatureImages` (the image URL map). Any new template field must be added here first.
