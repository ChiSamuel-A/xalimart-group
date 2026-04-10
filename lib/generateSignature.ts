import type { SignatureData, SignatureImages } from '@/types/signature'
import { buildDark } from './templates/dark'
import { buildLight } from './templates/light'

// ── Template router ────────────────────────────────────────────────────────────
export function buildSignatureHTML(data: SignatureData, images: SignatureImages): string {
  switch (data.templateId) {
    case 'dark':         return buildDark(data, images)
    case 'light':        return buildLight(data, images)
    // remaining templates will be added here
    default:             return buildDark(data, images)
  }
}

// ── Image utilities ────────────────────────────────────────────────────────────
export async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Logos are served from the deployed URL so Outlook can fetch them as
// normal hosted images — base64 logos are unreliable in Outlook Desktop.
// The profile photo (photoBase64) remains base64 since it is user-uploaded.
const HOSTED_BASE = 'https://xalimart-group.vercel.app'

export async function getInlineImages(): Promise<SignatureImages> {
  return {
    xalimartBlack:    `${HOSTED_BASE}/xalimart-black.png`,
    xalimartWhite:    `${HOSTED_BASE}/xalimart-white.png`,
    emailIcon:        `${HOSTED_BASE}/email.png`,
    emailIconWh:      `${HOSTED_BASE}/email-wh.png`,
    globeIcon:        `${HOSTED_BASE}/globe.png`,
    globeIconWh:      `${HOSTED_BASE}/globe-wh.png`,
    appelIcon:        `${HOSTED_BASE}/appel.png`,
    appelIconBl:      `${HOSTED_BASE}/appel-bl.png`,
    telephoneIconWh:  `${HOSTED_BASE}/telephone-wh.png`,
    locationBlack:    `${HOSTED_BASE}/location-black.png`,
    locationWhite:    `${HOSTED_BASE}/location-white.png`,
    instagramWh:      `${HOSTED_BASE}/instagram.png`,
    facebookWh:       `${HOSTED_BASE}/facebook.png`,
    linkedinWh:       `${HOSTED_BASE}/linkedin.png`,
    instagramBl:      `${HOSTED_BASE}/instagram-bl.png`,
    facebookBl:       `${HOSTED_BASE}/facebook-bl.png`,
    linkedinBl:       `${HOSTED_BASE}/linkedin-bl.png`,
  }
}

export function getPreviewImages(): SignatureImages {
  return {
    xalimartBlack:    '/xalimart-black.png',
    xalimartWhite:    '/xalimart-white.png',
    emailIcon:        '/email.png',
    emailIconWh:      '/email-wh.png',
    globeIcon:        '/globe.png',
    globeIconWh:      '/globe-wh.png',
    appelIcon:        '/appel.png',
    appelIconBl:      '/appel-bl.png',
    telephoneIconWh:  '/telephone-wh.png',
    locationBlack:    '/location-black.png',
    locationWhite:    '/location-white.png',
    instagramWh:      '/instagram.png',
    facebookWh:       '/facebook.png',
    linkedinWh:       '/linkedin.png',
    instagramBl:      '/instagram-bl.png',
    facebookBl:       '/facebook-bl.png',
    linkedinBl:       '/linkedin-bl.png',
  }
}
