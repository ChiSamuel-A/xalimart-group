// Bold — two-column split: left TD dark purple (photo + name), right TD white (contact)
import type { SignatureData, SignatureImages } from '@/types/signature'
import { BRAND, tpBadge, contactRow, productBanner, whatsappHref, socialIconsRow, normalizeUrl, clampText } from './shared'

export function buildBold(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, products, socials } = data
  const hasSocials = !!(socials.facebook || socials.instagram || socials.linkedin)
  // Always 2 TDs in the main row: left + right
  const colCount = 2

  // ── Left column — dark purple with photo (optional), name, role, logo ────────
  const photoRow = photoBase64
    ? `<tr>
        <td style="padding-bottom:12px;text-align:left;">
          <img src="${photoBase64}" width="68" height="68"
            style="display:block;border-radius:50%;border:3px solid #ffffff;
                   width:68px;height:68px;object-fit:cover;" alt="${fullName}">
        </td>
      </tr>`
    : ''

  const leftCell = `<td width="240" style="width:240px;background-color:${BRAND};
      vertical-align:middle;padding-top:20px;padding-right:20px;
      padding-bottom:20px;padding-left:20px;" valign="middle">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      ${photoRow}
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;
                   color:#ffffff;line-height:24px;mso-line-height-rule:exactly;
                   max-width:200px;word-wrap:break-word;overflow-wrap:break-word;
                   padding-bottom:3px;">
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

  // ── Right column — white with contact info ────────────────────────────────────
  const rightCell = `<td style="background-color:#ffffff;vertical-align:middle;
      padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;"
      valign="middle">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      ${phone   ? contactRow(images.appelIcon, whatsappHref(phone),   phone,                    { textColor: '#374151', bottomPad: !!(email || website || hasSocials) }) : ''}
      ${email   ? contactRow(images.emailIcon, `mailto:${email}`,    clampText(email, 42),     { textColor: '#374151', bottomPad: !!(website || hasSocials) }) : ''}
      ${website ? contactRow(images.globeIcon, normalizeUrl(website), clampText(website, 42),  { textColor: '#374151', bottomPad: hasSocials }) : ''}
      ${socialIconsRow(socials, images)}
    </table>
  </td>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
           color-scheme:light;font-family:Arial,sans-serif;width:560px;">
    <tr>
      ${leftCell}
      ${rightCell}
    </tr>
    ${productBanner(images, products, colCount)}
  </table>`
}
