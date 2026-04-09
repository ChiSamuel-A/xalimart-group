// Mono — white body, 4px purple top strip, gray dividers, purple icon badges
import type { SignatureData, SignatureImages } from '@/types/signature'
import { BRAND, tpBadge, contactRow, productBanner, whatsappHref, socialIconsRow, normalizeUrl, clampText } from './shared'

export function buildMono(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, products, socials } = data
  const hasSocials = !!(socials.facebook || socials.instagram || socials.linkedin)
  // TDs in content row: [photo?] + center + divider + contact = 3 or 4
  // Top-strip and banner rows share this colCount
  const colCount = photoBase64 ? 4 : 3

  // ── Purple top strip ─────────────────────────────────────────────────────────
  const topStrip = `<tr>
    <td colspan="${colCount}" height="4"
      style="height:4px;background-color:${BRAND};font-size:0;
             line-height:0;mso-line-height-rule:exactly;" height="4">&nbsp;</td>
  </tr>`

  // ── Photo ────────────────────────────────────────────────────────────────────
  const photoCell = photoBase64
    ? `<td width="100" style="width:100px;padding-top:18px;padding-right:0;
           padding-bottom:18px;padding-left:16px;vertical-align:middle;
           mso-table-lspace:0pt;mso-table-rspace:0pt;" valign="middle">
        <img src="${photoBase64}" width="68" height="68"
          style="display:block;border-radius:50%;border:2px solid ${BRAND};
                 width:68px;height:68px;object-fit:cover;" alt="${fullName}">
      </td>`
    : ''

  // ── Centre ───────────────────────────────────────────────────────────────────
  const centerPadLeft = photoBase64 ? '14px' : '16px'
  const centerCell = `<td style="vertical-align:middle;padding-top:18px;padding-right:20px;
      padding-bottom:18px;padding-left:${centerPadLeft};" valign="middle">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;
                   color:#1a1a1a;line-height:24px;mso-line-height-rule:exactly;
                   max-width:200px;word-wrap:break-word;overflow-wrap:break-word;
                   padding-bottom:3px;">
          ${clampText(fullName || 'Full Name', 40)}
        </td>
      </tr>
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;
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

  // ── Divider ──────────────────────────────────────────────────────────────────
  const vDivider = `<td width="1"
    style="width:1px;background-color:#e5e7eb;font-size:0;
           line-height:0;mso-line-height-rule:exactly;" width="1">&nbsp;</td>`

  // ── Contact — purple circle badges per spec ──────────────────────────────────
  const contactCell = `<td style="vertical-align:middle;padding-top:18px;padding-right:20px;
      padding-bottom:18px;padding-left:20px;" valign="middle">
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
           background-color:#ffffff;border:1px solid #e5e7eb;
           color-scheme:light;font-family:Arial,sans-serif;width:560px;">
    ${topStrip}
    <tr>
      ${photoCell}
      ${centerCell}
      ${vDivider}
      ${contactCell}
    </tr>
    ${productBanner(images, products, colCount)}
  </table>`
}
