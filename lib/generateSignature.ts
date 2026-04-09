import type { SignatureData, SignatureImages } from '@/types/signature'
import { buildClassic } from './templates/classic'
import { buildLight }   from './templates/light'
import { buildBold }    from './templates/bold'
import { buildMono }    from './templates/mono'
import { buildJG }      from './templates/jg'

// ── Template router ────────────────────────────────────────────────────────────
export function buildSignatureHTML(data: SignatureData, images: SignatureImages): string {
  switch (data.templateId) {
    case 'light':  return buildLight(data, images)
    case 'bold':   return buildBold(data, images)
    case 'mono':   return buildMono(data, images)
    case 'jg':     return buildJG(data, images)
    default:       return buildClassic(data, images)
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

// Logos are served from the deployed Vercel URL so Outlook can fetch them
// as normal hosted images — base64 logos are unreliable in Outlook Desktop.
// The profile photo (photoBase64) remains base64 since it is user-uploaded.
const HOSTED_BASE = 'https://targetpoint-sign.vercel.app'

export async function getInlineImages(): Promise<SignatureImages> {
  return {
    targetpoint:      `${HOSTED_BASE}/targetpoint.png`,
    weExport:         `${HOSTED_BASE}/we-export.png`,
    tripnbusiness:    `${HOSTED_BASE}/tripnbusiness.png`,
    weXperience:      `${HOSTED_BASE}/we-xperience.png`,
    facebook:         `${HOSTED_BASE}/facebook.png`,
    instagram:        `${HOSTED_BASE}/instagram.png`,
    linkedin:         `${HOSTED_BASE}/linkedin.png`,
    jgLogo:           `${HOSTED_BASE}/JG.png`,
    targetpointFav:   `${HOSTED_BASE}/targetpoint-fav.png`,
    tripnbusinessFav: `${HOSTED_BASE}/tripnbusiness-fav.png`,
    weExportFav:      `${HOSTED_BASE}/we-export-fav.png`,
    weImportFav:      `${HOSTED_BASE}/we-import-fav.png`,
    iconInstagram:    `${HOSTED_BASE}/icon-instagram.png`,
    iconFacebook:     `${HOSTED_BASE}/icon-facebook.png`,
    iconLinkedin:     `${HOSTED_BASE}/icon-linkedin.png`,
    emailIcon:        `${HOSTED_BASE}/email.png`,
    globeIcon:        `${HOSTED_BASE}/globe.png`,
    appelIcon:        `${HOSTED_BASE}/appel.png`,
    emailIconWh:      `${HOSTED_BASE}/email-wh.png`,
    globeIconWh:      `${HOSTED_BASE}/globe-wh.png`,
    telephoneIconWh:  `${HOSTED_BASE}/telephone-wh.png`,
  }
}

export function getPreviewImages(): SignatureImages {
  return {
    targetpoint:      '/targetpoint.png',
    weExport:         '/we-export.png',
    tripnbusiness:    '/tripnbusiness.png',
    weXperience:      '/we-xperience.png',
    facebook:         '/facebook.png',
    instagram:        '/instagram.png',
    linkedin:         '/linkedin.png',
    jgLogo:           '/JG\.png',
    targetpointFav:   '/targetpoint-fav.png',
    tripnbusinessFav: '/tripnbusiness-fav.png',
    weExportFav:      '/we-export-fav.png',
    weImportFav:      '/we-import-fav.png',
    iconInstagram:    '/icon-instagram.png',
    iconFacebook:     '/icon-facebook.png',
    iconLinkedin:     '/icon-linkedin.png',
    emailIcon:        '/email.png',
    globeIcon:        '/globe.png',
    appelIcon:        '/appel.png',
    emailIconWh:      '/email-wh.png',
    globeIconWh:      '/globe-wh.png',
    telephoneIconWh:  '/telephone-wh.png',
  }
}
