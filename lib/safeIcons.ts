import type { SignatureImages } from '@/types/signature'

// Icons are served as hosted URLs from Vercel — no base64 conversion needed.
// Gmail blocks data: URIs in <img> tags via CSP; using hosted URLs ensures
// icons are visible in Gmail, Outlook, and all other clients.
export async function processAllImages(images: SignatureImages): Promise<SignatureImages> {
  return { ...images }
}
