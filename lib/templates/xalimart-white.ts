// Template: Xalimart White
// Single desktop layout — works in Outlook, Gmail, Apple Mail
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS } from './shared'

const FONT        = "'Century Gothic', Arial, sans-serif"
const TEXT_NAME   = '#000000'
const TEXT_ROLE   = '#000000'
const TEXT_INFO   = '#000000'
const TEXT_ADDR   = '#000000'
const DIVIDER     = '#e0e0e0'
const TAGLINE     = "We don&apos;t follow the stand&apos;Arts,<br>We create them."

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
  const fontSize = '13px'
  const content = isStatic
    ? `<span style="color:${color};font-size:${fontSize};font-family:${FONT};line-height:1.4;">${label}</span>`
    : `<a href="${href}" style="color:${color};text-decoration:none;font-size:${fontSize};font-family:${FONT};line-height:1.4;">${label}</a>`

  return `
    <tr>
      <td valign="${isAddress ? 'top' : 'middle'}" style="padding:4px 8px 4px 0;">
        ${simpleIcon(iconSrc, 24)}
      </td>
      <td valign="${isAddress ? 'top' : 'middle'}"
        style="font-size:${fontSize};color:${color};font-family:${FONT};line-height:1.4;padding:4px 0;">
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
    socials.instagram ? { url: socials.instagram, src: images.instagramBl, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookBl,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinBl,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!items.length) return ''

  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-top:14px;">
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

export function buildXalimartWhite(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, mobile, email, website, photoBase64, socials } = data

  // ── Profile photo ──────────────────────────────────────────────────────────
  const photo = photoBase64
    ? `<img src="${photoBase64}" alt="${clampText(fullName, 40)}"
         width="220" height="220"
         style="display:block;width:220px;height:220px;
                border-radius:12px;border:1px solid ${DIVIDER};margin:0 auto;">`
    : `<table cellpadding="0" cellspacing="0" border="0" width="220"
         style="width:220px;border-radius:12px;background-color:#d8d8d8;
                border:1px solid ${DIVIDER};border-collapse:collapse;
                mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td width="220" height="220" align="center" valign="middle"
             style="width:220px;height:220px;font-size:0;line-height:0;background-color:#d8d8d8;">&nbsp;</td>
         </tr>
       </table>`

  // ── Contact rows ───────────────────────────────────────────────────────────
  const contactRows = `
    ${email   ? contactRow(images.emailIcon,   `mailto:${email}`,     clampText(email, 38))   : ''}
    ${website ? contactRow(images.globeIcon,   normalizeUrl(website), clampText(website, 38)) : ''}
    ${phone   ? contactRow(images.appelIconBl, whatsappHref(phone),   phone)                  : ''}
    ${mobile  ? contactRow(images.phoneIconBl, `tel:${mobile}`,       mobile)                 : ''}
    ${contactRow(images.locationBlack, '#', STATIC_ADDRESS, { color: TEXT_ADDR, isStatic: true, isAddress: true })}
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
             line-height:1.4;color:#000000;table-layout:fixed;width:900px;">
      <tr>
        <td style="padding:0;margin:0;width:100%;">
          <table cellpadding="0" cellspacing="0" border="0"
            style="width:100%;background-color:#ffffff;">
            <tr>

              <!-- Col 1: Logo + tagline + socials -->
              <td valign="middle"
                style="padding:28px 10px 28px 20px;width:210px;text-align:center;">
                <a href="https://xalimartgroup.sn" target="_blank"
                  style="text-decoration:none;display:block;">
                  <img src="${images.xalimartBlack}" alt="Xalimart Group" width="135"
                    style="display:block;margin:0 auto;max-width:135px;outline:none;text-decoration:none;border:none;">
                </a>
                <p style="margin:12px 0 0 0;font-size:13px;color:#000000;font-family:${FONT};
                           line-height:1.4;text-align:center;white-space:nowrap;">
                  ${TAGLINE}
                </p>
                ${socialsRow(socials, images)}
              </td>

              <!-- Col 2: Divider -->
              <td valign="middle" style="padding:0 15px;width:1px;">
                <div style="width:1px;height:160px;border-left:1px solid ${DIVIDER};"></div>
              </td>

              <!-- Col 3: Name + Role + contacts -->
              <td valign="top"
                style="padding:28px 10px 28px 0;width:415px;line-height:1.4;">
                <div style="font-size:24px;font-weight:bold;margin-bottom:4px;
                            font-family:${FONT};color:${TEXT_NAME};line-height:1.2;">
                  ${clampText(fullName || 'Full Name', 35)}
                </div>
                <div style="font-size:15px;color:${TEXT_ROLE};margin-bottom:14px;
                            font-weight:bold;font-family:${FONT};">
                  ${clampText(role || 'Job Title', 50)}
                </div>
                <table cellpadding="0" cellspacing="0" border="0"
                  style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  ${contactRows}
                </table>
              </td>

              <!-- Col 4: Profile photo -->
              <td valign="middle"
                style="padding:0 12px 0 8px;width:244px;text-align:center;">
                ${photo}
              </td>

            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
}
