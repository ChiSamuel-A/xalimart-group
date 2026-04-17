import type { SignatureImages } from '@/types/signature'

// ── Static content ─────────────────────────────────────────────────────────────
export const STATIC_ADDRESS = 'Flanc des Mamelles,<br/> Residence Sadiya Tower, Dakar - Senegal'
export const STATIC_PHONE   = '+221 77 624 07 07'

// ── Text clamp ─────────────────────────────────────────────────────────────────
export function clampText(value: string, maxChars: number): string {
  if (!value || value.length <= maxChars) return value
  return value.slice(0, maxChars).trimEnd() + '\u2026'
}

// ── URL normalizer ─────────────────────────────────────────────────────────────
export function normalizeUrl(val: string): string {
  return /^https?:\/\//i.test(val) ? val : `https://${val}`
}

// ── WhatsApp link helper ───────────────────────────────────────────────────────
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`
}

// ── Badge contact row ──────────────────────────────────────────────────────────
// Nested-table circle guarantees a perfect circle (no oval) in every client.
// Centering: line-height = badge size on the inner TD + vertical-align:middle
// on an inline-block img — works in Outlook, Gmail, Apple Mail.
interface BadgeRowOpts {
  textColor?: string
  isStatic?: boolean   // true → plain span instead of <a>
  multiline?: boolean  // true → wrapping text (address)
}

const BADGE  = 30   // circle diameter in px
const ICON   = 14   // icon size in px (scales 128×128 originals cleanly)

export function badgeContactRow(
  iconSrc: string,
  href: string,
  label: string,
  { textColor = '#222222', isStatic = false, multiline = false }: BadgeRowOpts = {}
): string {
  const labelHtml = isStatic
    ? `<span style="color:${textColor};font-family:Arial,sans-serif;font-size:12px;
                   line-height:16px;mso-line-height-rule:exactly;font-weight:normal;">${label}</span>`
    : `<a href="${href}" style="color:${textColor};text-decoration:none;
                font-family:Arial,sans-serif;font-size:12px;
                line-height:16px;mso-line-height-rule:exactly;font-weight:normal;">${label}</a>`

  return `<tr>
    <td style="padding-bottom:7px;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <table cellpadding="0" cellspacing="0" border="0"
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td width="${BADGE}" align="center" valign="middle"
            style="width:${BADGE}px;padding:0;font-size:0;line-height:0;text-align:center;vertical-align:middle;">
            <!-- White glow filter helps black icons stay visible on dark backgrounds -->
            <img src="${iconSrc}" width="${ICON}" height="${ICON}" border="0"
              style="display:inline-block;vertical-align:middle;width:${ICON}px;height:${ICON}px;border:0;outline:none;" alt="">
          </td>
          <td style="padding-left:10px;font-family:Arial,sans-serif;font-size:12px;
                     color:${textColor};line-height:16px;mso-line-height-rule:exactly;
                     ${multiline ? 'max-width:240px;' : 'white-space:nowrap;'}
                     vertical-align:${multiline ? 'top' : 'middle'};
                     mso-table-lspace:0pt;mso-table-rspace:0pt;font-weight:normal;" 
              valign="${multiline ? 'top' : 'middle'}">
            ${labelHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ── Social icons row ───────────────────────────────────────────────────────────
const SICO = 18   // social icon size in px

function buildSocialCells(
  active: { url: string; src: string; alt: string }[]
): string {
  return active.map((s, i) =>
    `<td${i < active.length - 1 ? ` style="padding-right:12px;mso-table-lspace:0pt;mso-table-rspace:0pt;"` : ' style="mso-table-lspace:0pt;mso-table-rspace:0pt;"'} align="center" valign="middle">
      <a href="${s.url}" target="_blank"
        style="display:inline-block;vertical-align:middle;text-decoration:none;line-height:0;font-size:0;">
        <img src="${s.src}" width="${SICO}" height="${SICO}" border="0"
          style="display:inline-block;vertical-align:middle;width:${SICO}px;height:${SICO}px;border:0;outline:none;" alt="${s.alt}">
      </a>
    </td>`
  ).join('')
}

// Transparent "Safe" icons (using White sources) — for minimal-light
export function socialIconsRowWhite(
  socials: { facebook: string; instagram: string; linkedin: string },
  images: SignatureImages
): string {
  const active = [
    socials.instagram ? { url: socials.instagram, src: images.instagramWh, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookWh,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinWh,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!active.length) return ''

  return `<table cellpadding="0" cellspacing="0" border="0" align="center"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
           margin-top:14px;">
    <tr>${buildSocialCells(active)}</tr>
  </table>`
}

// Transparent "Safe" icons (using Black sources) — used by dark templates
export function socialIconsRowBlack(
  socials: { facebook: string; instagram: string; linkedin: string },
  images: SignatureImages
): string {
  const active = [
    socials.instagram ? { url: socials.instagram, src: images.instagramBl, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookBl,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinBl,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!active.length) return ''

  return `<table cellpadding="0" cellspacing="0" border="0" align="center"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
           margin-top:14px;">
    <tr>${buildSocialCells(active)}</tr>
  </table>`
}
