// Classic — full dark purple body, white text, circular photo with white border
import type { SignatureData, SignatureImages } from '@/types/signature'
import { BRAND, tpBadge, contactRow, productBanner, whatsappHref, socialIconsRow, normalizeUrl, clampText } from './shared'

const C_DIVIDER = '#9575ff'

export function buildClassic(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, products, socials } = data
  const hasSocials = !!(socials.facebook || socials.instagram || socials.linkedin)
  // TDs in main row: [photo?] + center + divider + contact = 3 or 4
  const colCount = photoBase64 ? 4 : 3

  // ── Photo ──────────────────────────────────────────────────────────────────
  const photoCell = photoBase64
    ? `<td width="108" style="width:108px;padding-top:20px;padding-right:0;
           padding-bottom:20px;padding-left:20px;vertical-align:middle;
           mso-table-lspace:0pt;mso-table-rspace:0pt;" valign="middle">
        <img src="${photoBase64}" width="76" height="76"
          style="display:block;border-radius:50%;border:3px solid #ffffff;
                 width:76px;height:76px;object-fit:cover;" alt="${fullName}">
      </td>`
    : ''

  // ── Centre — name, role, TargetPoint badge ──────────────────────────────────
  const centerPadLeft = photoBase64 ? '16px' : '20px'
  const centerCell = `<td style="vertical-align:middle;padding-top:20px;padding-right:20px;
      padding-bottom:20px;padding-left:${centerPadLeft};" valign="middle">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;
                   color:#ffffff;line-height:24px;mso-line-height-rule:exactly;
                   max-width:200px;word-wrap:break-word;overflow-wrap:break-word;
                   padding-bottom:4px;">
          ${clampText(fullName || 'Full Name', 40)}
        </td>
      </tr>
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:12px;color:#d4b8ff;
                   line-height:18px;mso-line-height-rule:exactly;
                   max-width:200px;word-wrap:break-word;overflow-wrap:break-word;
                   padding-bottom:14px;">
          ${clampText(role || 'Job Title', 50)}
        </td>
      </tr>
      <tr>
        <td>${tpBadge(images.targetpoint, '#ffffff')}</td>
      </tr>
    </table>
  </td>`

  // ── Vertical divider ────────────────────────────────────────────────────────
  const vDivider = `<td width="1"
    style="width:1px;background-color:${C_DIVIDER};font-size:0;
           line-height:0;mso-line-height-rule:exactly;" width="1">&nbsp;</td>`

  // ── Contact — phone + email ─────────────────────────────────────────────────
  const contactCell = `<td style="vertical-align:middle;padding-top:20px;padding-right:20px;
      padding-bottom:20px;padding-left:20px;" valign="middle">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      ${phone   ? contactRow(images.telephoneIconWh, whatsappHref(phone),   phone,                    { bottomPad: !!(email || website || hasSocials) }) : ''}
      ${email   ? contactRow(images.emailIconWh,    `mailto:${email}`,     clampText(email, 42),     { bottomPad: !!(website || hasSocials) }) : ''}
      ${website ? contactRow(images.globeIconWh,    normalizeUrl(website), clampText(website, 42),   { bottomPad: hasSocials }) : ''}
      ${socialIconsRow(socials, images)}
    </table>
  </td>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
           background-color:${BRAND};color-scheme:light;
           font-family:Arial,sans-serif;width:560px;">
    <tr>
      ${photoCell}
      ${centerCell}
      ${vDivider}
      ${contactCell}
    </tr>
    ${productBanner(images, products, colCount)}
  </table>`
}
