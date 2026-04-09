// JG — white body, circular gold-bordered photo, indigo name, gold social circles, indigo banner
import type { SignatureData, SignatureImages } from '@/types/signature'
import { normalizeUrl, clampText, whatsappHref } from './shared'

function contactIconBadge(src: string, alt: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
      <td width="24" height="24" align="center" valign="middle"
        style="width:24px;height:24px;background-color:#c79437;border-radius:50%;text-align:center;vertical-align:middle;">
        <img src="${src}" width="12" height="12" border="0"
          style="display:block;margin:0 auto;width:12px;height:12px;" alt="${alt}">
      </td>
    </tr>
  </table>`
}

const INDIGO = '#2f25ba'
const GOLD   = '#c79437'

// ── Brand banner entries ───────────────────────────────────────────────────────
const BRANDS = [
  { fav: 'targetpointFav',   url: 'https://targetpoint.fr',            label: 'TARGET POINT'  },
  { fav: 'tripnbusinessFav', url: 'https://www.tripnbusiness.com',      label: 'TRIPNBUSINESS' },
  { fav: 'weExportFav',      url: 'https://www.we-export.com',          label: 'WE EXPORT'     },
  { fav: 'weImportFav',      url: 'https://www.we-import.fr',          label: 'WE IMPORT'     },
] as const

export function buildJG(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, socials } = data
  const hasSocials = !!(socials.linkedin || socials.instagram || socials.facebook)

  // ── COLUMN 1: Photo ─────────────────────────────────────────────────────────
  const photoInner = photoBase64
    ? `<img src="${photoBase64}" width="100" height="100"
         style="display:block;border-radius:50%;border:3px solid ${GOLD};
                width:100px;height:100px;object-fit:cover;" alt="${fullName}">`
    : `<table cellpadding="0" cellspacing="0" border="0"
         style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td width="100" height="100"
             style="width:100px;height:100px;border-radius:50%;border:3px solid ${GOLD};
                    font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
         </tr>
       </table>`

  const photoCell = `<td width="140" valign="middle" align="center" class="stack"
    style="width:140px;padding-top:24px;padding-right:0;padding-bottom:24px;
           padding-left:14px;vertical-align:middle;text-align:center;">
    ${photoInner}
  </td>`

  // ── COLUMN 2: Info block ───────────────────────────────────────────────────
  const socialPlatforms = [
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedin,  alt: 'LinkedIn'  } : null,
    socials.instagram ? { url: socials.instagram, src: images.instagram, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebook,  alt: 'Facebook'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  const socialCells = socialPlatforms.map(s =>
    `<td style="padding-right:8px;">
      <table cellpadding="0" cellspacing="0" border="0"
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td width="32" height="32" align="center" valign="middle"
            style="width:32px;height:32px;background-color:${GOLD};border-radius:50%;
                   text-align:center;vertical-align:middle;">
            <a href="${s.url}" target="_blank" style="text-decoration:none;display:block;">
              <img src="${s.src}" width="16" height="18" border="0"
                style="display:block;margin:0 auto;width:16px;height:18px;" alt="${s.alt}">
            </a>
          </td>
        </tr>
      </table>
    </td>`
  ).join('')

  const infoCell = `<td width="340" valign="top" class="stack"
    style="width:340px;vertical-align:top;padding-top:24px;padding-right:10px;
           padding-bottom:24px;padding-left:20px;
           border-left:2px solid ${INDIGO};">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:20px;font-weight:bold;
                   color:${INDIGO};line-height:24px;mso-line-height-rule:exactly;
                   padding-bottom:2px;white-space:nowrap;">
          ${clampText(fullName || 'Full Name', 45)}
        </td>
      </tr>
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;
                   line-height:18px;mso-line-height-rule:exactly;
                   padding-bottom:16px;white-space:nowrap;">
          ${clampText(role || 'Job Title', 60)}
        </td>
      </tr>
      ${email ? `<tr>
        <td style="padding-bottom:8px;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td width="32" valign="middle">${contactIconBadge(images.emailIconWh, 'Email')}</td>
              <td style="font-family:Arial,sans-serif;font-size:12px;color:#333333;padding-left:8px;white-space:nowrap;">
                <a href="mailto:${email}" style="color:#333333;text-decoration:none;">${clampText(email, 42)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>` : ''}
      ${phone ? `<tr>
        <td style="padding-bottom:8px;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td width="32" valign="middle">${contactIconBadge(images.telephoneIconWh, 'Phone')}</td>
              <td style="font-family:Arial,sans-serif;font-size:12px;color:#333333;padding-left:8px;white-space:nowrap;">
                <a href="${whatsappHref(phone)}" target="_blank" style="color:#333333;text-decoration:none;">${phone}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>` : ''}
      ${website ? `<tr>
        <td style="padding-bottom:12px;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td width="32" valign="middle">${contactIconBadge(images.globeIconWh, 'Website')}</td>
              <td style="font-family:Arial,sans-serif;font-size:12px;color:#333333;padding-left:8px;white-space:nowrap;">
                <a href="${normalizeUrl(website)}" target="_blank" style="color:#333333;text-decoration:none;">${clampText(website, 42)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>` : ''}
      ${hasSocials ? `<tr>
        <td style="padding-top:4px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>${socialCells}</tr>
          </table>
        </td>
      </tr>` : ''}
    </table>
  </td>`

  // ── COLUMN 3: JG Logo ──────────────────────────────────────────────────────
  const logoCell = `<td width="220" valign="middle" align="center" class="stack"
    style="width:220px;padding-top:20px;padding-right:20px;padding-bottom:20px;
           padding-left:14px;vertical-align:middle;text-align:center;">
    <a href="https://www.josephinegarrick.com/" target="_blank"
      style="display:block;text-decoration:none;margin:0 auto;">
      <img src="${images.jgLogo}" width="200"
        style="display:block;width:200px;height:auto;object-fit:contain;margin:0 auto;" alt="Josephine Garrick LTD">
    </a>
  </td>`

  // ── BOTTOM BANNER ──────────────────────────────────────────────────────────
  const brandCells = BRANDS.map(b => {
    const favSrc = images[b.fav as keyof SignatureImages]
    return `<td align="center" style="padding: 8px 4px;">
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td valign="middle" style="padding-right:4px;">
            <a href="${b.url}" target="_blank" style="display:block;">
              <img src="${favSrc}" width="16" height="16" style="display:block;width:16px;height:16px;" alt="${b.label}">
            </a>
          </td>
          <td valign="middle" style="white-space:nowrap;">
            <a href="${b.url}" target="_blank"
              style="color:#ffffff;font-family:Arial,sans-serif;font-size:8px;
                     font-weight:bold;text-decoration:none;text-transform:uppercase;letter-spacing:0.2px;white-space:nowrap;">
              ${b.label}
            </a>
          </td>
        </tr>
      </table>
    </td>`
  }).join('')

  return `
  <style>
    @media only screen and (max-width: 600px) {
      .stack { display: block !important; width: 100% !important; max-width: 100% !important; border: none !important; text-align: center !important; padding-left: 0 !important; padding-right: 0 !important; }
      .stack img { margin: 0 auto !important; }
    }
  </style>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="700"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
           background-color:#ffffff;font-family:Arial,sans-serif;
           color-scheme:light;width:700px;">
    <tr>
      ${photoCell}
      ${infoCell}
      ${logoCell}
    </tr>
    <tr>
      <td colspan="3" style="background-color:${INDIGO};padding:4px 10px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
          <tr>
            ${brandCells}
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}
