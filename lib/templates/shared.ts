import type { SignatureImages } from '@/types/signature'

// ── Brand constants ────────────────────────────────────────────────────────────
export const BRAND       = '#7f51ff'
export const BANNER_BG   = '#6438cc'   // non-negotiable: product banner always this
export const BANNER_RULE = '#5e35b1'   // hairline between body and banner

// ── Text clamp — truncate long strings so cells never expand beyond 2 lines ────
export function clampText(value: string, maxChars: number): string {
  if (!value || value.length <= maxChars) return value
  return value.slice(0, maxChars).trimEnd() + '\u2026'
}

// ── TargetPoint logo badge ─────────────────────────────────────────────────────
// targetpoint.png has transparent bg → must always sit inside a solid pill.
// bgColor defaults to white; pass BRAND (#7f51ff) for templates with dark bodies.
export function tpBadge(src: string, bgColor = '#ffffff'): string {
  return `<table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <tr>
      <td style="background-color:${bgColor};padding-top:6px;padding-right:10px;
                 padding-bottom:6px;padding-left:10px;border-radius:4px;">
        <a href="https://targetpoint.fr" target="_blank"
          style="display:block;text-decoration:none;">
          <img src="${src}" height="26"
            style="display:block;height:26px;" alt="Target Point">
        </a>
      </td>
    </tr>
  </table>`
}

// ── Contact row — PNG icon image + linked label ────────────────────────────────
interface ContactOpts {
  textColor?: string   // label + link color
  bottomPad?: boolean
}
export function contactRow(
  iconSrc: string,
  href: string,
  label: string,
  { textColor = '#ffffff', bottomPad = true }: ContactOpts = {}
): string {
  return `<tr>
    <td${bottomPad ? ' style="padding-bottom:8px;"' : ''}>
      <table cellpadding="0" cellspacing="0" border="0"
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td width="24" valign="middle"
            style="width:24px;vertical-align:middle;">
            <img src="${iconSrc}" width="16" height="16" border="0"
              style="display:block;width:16px;height:16px;" alt="">
          </td>
          <td style="padding-left:8px;font-family:Arial,sans-serif;font-size:12px;
                     color:${textColor};line-height:18px;mso-line-height-rule:exactly;
                     vertical-align:middle;max-width:180px;word-break:break-all;
                     overflow-wrap:break-word;" valign="middle">
            <a href="${href}"
              style="color:${textColor};text-decoration:none;
                     font-family:Arial,sans-serif;font-size:12px;
                     line-height:18px;mso-line-height-rule:exactly;">
              ${label}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ── Product banner (non-negotiable: always BANNER_BG #6438cc) ─────────────────
interface ProdEntry { src: string; href: string; alt: string }

function prodCells(list: ProdEntry[]): string {
  return list
    .map((p, i) => {
      const div = i > 0
        ? `<td width="1" style="width:1px;background-color:#9575ff;font-size:0;
               line-height:0;mso-line-height-rule:exactly;" width="1">&nbsp;</td>`
        : ''
      const pL = i > 0                   ? 'padding-left:16px;'  : ''
      const pR = i < list.length - 1     ? 'padding-right:16px;' : ''
      return `${div}<td style="vertical-align:middle;${pL}${pR}" valign="middle">
          <a href="${p.href}" target="_blank" style="display:block;text-decoration:none;">
            <img src="${p.src}" height="26" style="display:block;height:26px;" alt="${p.alt}">
          </a>
        </td>`
    })
    .join('')
}

export function productBanner(
  images: SignatureImages,
  products: { weExport: boolean; tripnbusiness: boolean; weXperience: boolean },
  colCount: number
): string {
  const active: ProdEntry[] = [
    products.weExport      ? { src: images.weExport,      href: 'https://www.we-export.com',      alt: 'We Export' }      : null,
    products.tripnbusiness ? { src: images.tripnbusiness, href: 'https://www.tripnbusiness.com',   alt: 'Trip N Business' } : null,
    products.weXperience   ? { src: images.weXperience,   href: 'https://we-xperience.com',        alt: 'We Xperience' }   : null,
  ].filter((p): p is ProdEntry => p !== null)

  if (!active.length) return ''

  return `<tr>
    <td colspan="${colCount}" height="1"
      style="height:1px;background-color:${BANNER_RULE};font-size:0;
             line-height:0;mso-line-height-rule:exactly;" height="1">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="${colCount}"
      style="background-color:${BANNER_BG};padding-top:12px;padding-right:20px;
             padding-bottom:12px;padding-left:20px;">
      <table cellpadding="0" cellspacing="0" border="0"
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>${prodCells(active)}</tr>
      </table>
    </td>
  </tr>`
}

// ── WhatsApp link helper ───────────────────────────────────────────────────────
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`
}

// ── URL normalizer — prepend https:// for bare domains ────────────────────────
export function normalizeUrl(val: string): string {
  return /^https?:\/\//i.test(val) ? val : `https://${val}`
}

// ── Social media icon row ──────────────────────────────────────────────────────
// Only renders platforms the user has filled in. Order: LinkedIn → Instagram → Facebook.
// Each icon is a 28×28 colored badge with the white platform icon inside.
export function socialIconsRow(
  socials: { facebook: string; instagram: string; linkedin: string },
  images: SignatureImages
): string {
  const active = [
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedin,  bg: '#0077b5', alt: 'LinkedIn'  } : null,
    socials.instagram ? { url: socials.instagram, src: images.instagram, bg: '#e1306c', alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebook,  bg: '#1877f2', alt: 'Facebook'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!active.length) return ''

  const cells = active.map((s, i) =>
    `<td${i < active.length - 1 ? ' style="padding-right:8px;"' : ''}>
      <table cellpadding="0" cellspacing="0" border="0"
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td width="36" height="36" align="center" valign="middle"
            style="width:36px;height:36px;background-color:${s.bg};border-radius:50%;
                   text-align:center;vertical-align:middle;">
            <a href="${s.url}" target="_blank" style="text-decoration:none;display:block;">
              <img src="${s.src}" width="18" height="18" border="0"
                style="display:block;margin:0 auto;width:18px;height:18px;" alt="${s.alt}">
            </a>
          </td>
        </tr>
      </table>
    </td>`
  ).join('')

  const single = active.length === 1
  return `<tr>
    <td${single ? ' align="center"' : ''} style="padding-top:8px;${single ? 'text-align:center;' : ''}">
      <table cellpadding="0" cellspacing="0" border="0"${single ? ' align="center"' : ''}
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;${single ? 'margin:0 auto;' : ''}">
        <tr>${cells}</tr>
      </table>
    </td>
  </tr>`
}
