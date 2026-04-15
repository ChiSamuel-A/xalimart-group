// Template: Xalimart Black
// Inverse of xalimart-white — dark background, white text, white icons
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS } from './shared'

const FONT      = "'Century Gothic', Arial, sans-serif"
const TEXT_NAME = '#ffffff'
const TEXT_ROLE = '#ffffff'
const TEXT_INFO = '#ffffff'
const TEXT_ADDR = '#ffffff'
const DIVIDER   = '#444444'
const BG        = '#000000'
const TAGLINE   = "We don&apos;t follow the stand&apos;Arts,<br>We create them."

// ── Simple icon ────────────────────────────────────────────────────────────
function simpleIcon(iconSrc: string, iconSize: number): string {
  return `<img src="${iconSrc}" width="${iconSize}" height="${iconSize}" border="0"
    style="display:block;width:${iconSize}px;height:${iconSize}px;min-width:${iconSize}px;min-height:${iconSize}px;max-width:${iconSize}px;max-height:${iconSize}px;border:none;">`
}

// ── Contact row: icon + text ───────────────────────────────────────────────
function contactRow(
  iconSrc: string,
  href: string,
  label: string,
  opts: { color?: string; isStatic?: boolean; isAddress?: boolean } = {}
): string {
  const { color = TEXT_INFO, isStatic = false, isAddress = false } = opts
  const fontSize = '12px'
  const content = isStatic
    ? `<span style="color:${color};font-size:${fontSize};font-family:${FONT};line-height:1.4;">${label}</span>`
    : `<a href="${href}" style="color:${color};text-decoration:none;font-size:${fontSize};font-family:${FONT};line-height:1.4;">${label}</a>`

  return `
    <tr>
      <td valign="${isAddress ? 'top' : 'middle'}" style="padding:2px 8px 2px 0;">
        ${simpleIcon(iconSrc, 24)}
      </td>
      <td valign="${isAddress ? 'top' : 'middle'}"
        style="font-size:${fontSize};color:${color};font-family:${FONT};line-height:1.4;padding:2px 0;">
        ${content}
      </td>
    </tr>`
}

// ── Social icons row ───────────────────────────────────────────────────────
function socialsRow(
  socials: SignatureData['socials'],
  images: SignatureImages,
  iconSize = 28
): string {
  const items = [
    socials.instagram ? { url: socials.instagram, src: images.instagramWh, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookWh,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinWh,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!items.length) return ''

  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-top:10px;">
      <tr>
        ${items.map((s, i) => `
          <td align="center" valign="middle"
            style="${i < items.length - 1 ? 'padding-right:14px;' : ''}mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <a href="${s.url}" target="_blank" style="text-decoration:none;display:block;">
              ${simpleIcon(s.src, iconSize)}
            </a>
          </td>`).join('')}
      </tr>
    </table>`
}

export function buildXalimartBlack(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, mobile, email, website, photoBase64, socials } = data

  // ── Profile photo ──────────────────────────────────────────────────────────
  const photo = photoBase64
    ? `<img src="${photoBase64}" alt="${clampText(fullName, 40)}"
         width="244" height="244"
         style="display:block;width:244px;height:244px;border:none;">`
    : `<table cellpadding="0" cellspacing="0" border="0" width="244"
         style="width:244px;background-color:#222222;border-collapse:collapse;
                mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td width="244" height="244" align="center" valign="middle"
             style="width:244px;height:244px;font-size:0;line-height:0;background-color:#222222;">&nbsp;</td>
         </tr>
       </table>`

  // ── Contact rows ───────────────────────────────────────────────────────────
  const contactRows = `
    ${email   ? contactRow(images.emailIconWh,  `mailto:${email}`,     clampText(email, 38))   : ''}
    ${website ? contactRow(images.globeIconWh,  normalizeUrl(website), clampText(website, 38)) : ''}
    ${phone   ? contactRow(images.appelIcon,    whatsappHref(phone),   phone)                  : ''}
    ${mobile  ? contactRow(images.phoneIcon,    `tel:${mobile}`,       mobile)                 : ''}
    ${contactRow(images.locationWhite, '#', STATIC_ADDRESS, { color: TEXT_ADDR, isStatic: true, isAddress: true })}
  `

  return `
    <style>
      @font-face {
        font-family: 'Century Gothic';
        src: url('https://xalimart-group-sign.vercel.app/fonts/centurygothic.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Century Gothic';
        src: url('https://xalimart-group-sign.vercel.app/fonts/centurygothic_bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    </style>
    <table cellpadding="0" cellspacing="0" border="0"
      style="margin:0;padding:0;font-family:${FONT};font-size:14px;
             line-height:1.4;color:#ffffff;table-layout:fixed;width:900px;">
      <tr>
        <td style="padding:0;margin:0;width:100%;">
          <table cellpadding="0" cellspacing="0" border="0"
            style="width:100%;background-color:${BG}; mso-table-lspace:0pt; mso-table-rspace:0pt;">
            <tr height="244" style="height:244px;">

              <!-- Col 1: Logo + tagline + socials -->
              <td valign="middle"
                style="padding:10px 10px 10px 24px;width:210px;text-align:center;background-color:${BG};height:244px;">
                <a href="https://xalimartgroup.sn" target="_blank"
                  style="text-decoration:none;display:block;">
                  <img src="${images.xalimartWhite}" alt="Xalimart Group" width="135"
                    style="display:block;margin:0 auto;max-width:135px;outline:none;text-decoration:none;border:none;">
                </a>
                <p style="margin:8px 0 0 0;font-size:12px;color:#ffffff;font-family:${FONT};
                           line-height:1.4;text-align:center;white-space:nowrap;">
                  ${TAGLINE}
                </p>
                ${socialsRow(socials, images)}
              </td>

              <!-- Col 2: Divider -->
              <td valign="middle" style="padding:0 15px;width:1px;background-color:${BG};height:244px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width:1px;height:244px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  <tr>
                    <td width="1" height="244" style="width:1px;height:244px;background-color:${DIVIDER};font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td>
                  </tr>
                </table>
              </td>

              <!-- Col 3: Name + Role + contacts -->
              <td valign="middle"
                style="padding:10px 10px 10px 0;width:415px;line-height:1.4;background-color:${BG};height:244px;">
                <div style="font-size:23px;font-weight:bold;margin-bottom:4px;
                            font-family:${FONT};color:${TEXT_NAME};line-height:1.2;">
                  ${clampText(fullName || 'Full Name', 35)}
                </div>
                <div style="font-size:14px;color:${TEXT_ROLE};margin-bottom:14px;
                            font-weight:bold;font-family:${FONT};">
                  ${clampText(role || 'Job Title', 50)}
                </div>
                <table cellpadding="0" cellspacing="0" border="0"
                  style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  ${contactRows}
                </table>
              </td>

              <!-- Col 4: Profile photo -->
              <td valign="top"
                style="padding:0;width:244px;text-align:right;background-color:${BG};height:244px;line-height:0;font-size:0;">
                ${photo}
              </td>

            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
}
