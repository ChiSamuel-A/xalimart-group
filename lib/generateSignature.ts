import type { SignatureData, SignatureImages } from '@/types/signature'
import { buildXalimartWhite } from './templates/xalimart-white'
import { buildXalimartBlack } from './templates/xalimart-black'

// ── Template router ────────────────────────────────────────────────────────────
export function buildSignatureHTML(data: SignatureData, images: SignatureImages): string {
  const isBlack = data.templateId === 'xalimart-black'
  const lineIcon = isBlack ? (images.lineIconBl || '/line-bl.png') : (images.lineIconWh || '/line-wh.png')
  
  const templateImages = { ...images, lineIcon }

  switch (data.templateId) {
    case 'xalimart-black': return buildXalimartBlack(data, templateImages)
    default:               return buildXalimartWhite(data, templateImages)
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
    phoneIcon:        `${HOSTED_BASE}/phone.png`,
    phoneIconBl:      `${HOSTED_BASE}/phone-bl.png`,
    telephoneIconWh:  `${HOSTED_BASE}/telephone-wh.png`,
    locationBlack:    `${HOSTED_BASE}/location-black.png`,
    locationWhite:    `${HOSTED_BASE}/location-white.png`,
    instagramWh:      `${HOSTED_BASE}/instagram.png`,
    facebookWh:       `${HOSTED_BASE}/facebook.png`,
    linkedinWh:       `${HOSTED_BASE}/linkedin.png`,
    instagramBl:      `${HOSTED_BASE}/instagram-bl.png`,
    facebookBl:       `${HOSTED_BASE}/facebook-bl.png`,
    linkedinBl:       `${HOSTED_BASE}/linkedin-bl.png`,
    lineIconBl:       `${HOSTED_BASE}/gray-vertical-line.png`,
    lineIconWh:       `${HOSTED_BASE}/gray-vertical-line.png`,
    taglineBl:        `${HOSTED_BASE}/tagline-bl.png`,
    taglineWh:        `${HOSTED_BASE}/tagline-wh.png`,
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
    phoneIcon:        '/phone.png',
    phoneIconBl:      '/phone-bl.png',
    telephoneIconWh:  '/telephone-wh.png',
    locationBlack:    '/location-black.png',
    locationWhite:    '/location-white.png',
    instagramWh:      '/instagram.png',
    facebookWh:       '/facebook.png',
    linkedinWh:       '/linkedin.png',
    instagramBl:      '/instagram-bl.png',
    facebookBl:       '/facebook-bl.png',
    linkedinBl:       '/linkedin-bl.png',
    lineIconBl:       '/gray-vertical-line.png',
    lineIconWh:       '/gray-vertical-line.png',
    taglineBl:        '/tagline-bl.png',
    taglineWh:        '/tagline-wh.png',
  }
}
