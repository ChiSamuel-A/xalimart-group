// Template: Xalimart White
// Desktop: Logo+Socials (left) | Divider | Name+Info (center) | Photo (right)
// Mobile:  Photo+Name/Role (row1) | Contacts (row2) | Logo+Socials (row3)
// Two separate tables swapped via @media — no horizontal scroll on mobile
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS } from './shared'

const TEXT_NAME = '#000000'
const TEXT_ROLE = '#666666'
const TEXT_INFO = '#000000'
const TEXT_ADDR = '#444444'
const DIVIDER   = '#e0e0e0'
const ICON_BG   = '#000000'

// ── Simple icon wrapper without circle background ──────────────────────────
function simpleIcon(iconSrc: string, iconSize: number): string {
  return `
    <img src="${iconSrc}" width="${iconSize}" height="${iconSize}" border="0"
      style="display:block;width:${iconSize}px;height:${iconSize}px;
             border:none;margin:0 auto;">`
}

// ── Contact row: icon + text ──────────────────────────────────────────────
function contactRow(
  iconSrc: string,
  href: string,
  label: string,
  opts: { color?: string; isStatic?: boolean; isAddress?: boolean } = {}
): string {
  const { color = TEXT_INFO, isStatic = false, isAddress = false } = opts
  const content = isStatic
    ? `<span style="color:${color};font-size:${isAddress ? '12px' : '13px'};
                   font-family:Arial,sans-serif;line-height:1.5;">${label}</span>`
    : `<a href="${href}"
          style="color:${color};text-decoration:none;font-size:13px;
                 font-family:Arial,sans-serif;line-height:1.5;">${label}</a>`

  return `
    <tr>
      <td valign="${isAddress ? 'top' : 'middle'}" style="padding:3px 6px 3px 0;">
        ${simpleIcon(iconSrc, 16)}
      </td>
      <td valign="${isAddress ? 'top' : 'middle'}"
        style="font-size:${isAddress ? '12px' : '13px'};color:${color};
               font-family:Arial,sans-serif;line-height:1.5;padding:3px 0;">
        ${content}
      </td>
    </tr>`
}

// ── Social icons row: simple icons ───────────────────────────────────────
function socialsRow(
  socials: SignatureData['socials'],
  images: SignatureImages,
  iconSize = 20
): string {
  const items = [
    socials.instagram ? { url: socials.instagram, src: images.instagramBl, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookBl,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinBl,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!items.length) return ''

  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
             margin-top:14px;">
      <tr>
        ${items.map((s, i) => `
          <td align="center" valign="middle"
            style="${i < items.length - 1 ? 'padding-right:12px;' : ''}
                   mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <a href="${s.url}" target="_blank"
              style="text-decoration:none;display:block;">
              ${simpleIcon(s.src, iconSize)}
            </a>
          </td>`).join('')}
      </tr>
    </table>`
}

export function buildXalimartWhite(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, mobile, email, website, photoBase64, socials } = data

  // ── Profile photo elements ─────────────────────────────────────────────────
  const desktopPhoto = photoBase64
    ? `<img src="${photoBase64}" alt="${clampText(fullName, 40)}"
         width="120" height="150"
         style="display:block;width:120px;height:150px;object-fit:cover;
                border-radius:12px;border:1px solid ${DIVIDER};margin:0 auto;">`
    : `<table cellpadding="0" cellspacing="0" border="0" width="120"
         style="width:120px;border-radius:12px;background-color:#d8d8d8;
                border:1px solid ${DIVIDER};border-collapse:collapse;
                mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td width="120" height="150" align="center" valign="middle"
             style="width:120px;height:150px;font-size:0;line-height:0;
                    background-color:#d8d8d8;">&nbsp;</td>
         </tr>
       </table>`

  const mobilePhoto = photoBase64
    ? `<img src="${photoBase64}" alt="${clampText(fullName, 40)}"
         width="64" height="80"
         style="display:block;width:64px;height:80px;object-fit:cover;
                border-radius:8px;border:1px solid ${DIVIDER};margin:0 auto;">`
    : `<table cellpadding="0" cellspacing="0" border="0" width="64"
         style="width:64px;border-radius:8px;background-color:#d8d8d8;
                border:1px solid ${DIVIDER};border-collapse:collapse;
                mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td width="64" height="80"
             style="width:64px;height:80px;font-size:0;line-height:0;
                    background-color:#d8d8d8;">&nbsp;</td>
         </tr>
       </table>`

  // ── Contact rows (shared between desktop and mobile) ───────────────────────
  const contactRows = `
    ${email   ? contactRow(images.emailIcon,    `mailto:${email}`,     clampText(email, 38))   : ''}
    ${website ? contactRow(images.globeIcon,    normalizeUrl(website), clampText(website, 38)) : ''}
    ${phone   ? contactRow(images.appelIconBl,  whatsappHref(phone),   phone)                  : ''}
    ${mobile  ? contactRow(images.phoneIconBl,  `tel:${mobile}`,       mobile)                 : ''}
    ${contactRow(images.locationBlack, '#', STATIC_ADDRESS,
        { color: TEXT_ADDR, isStatic: true, isAddress: true })}
  `

  return `
    <style>
      @media only screen and (max-width:480px) {
        .xw-desktop { display:none    !important; }
        .xw-mobile  { display:table   !important; }
      }
    </style>

    <!-- ════════════════════════════════════════════════════════════════════ -->
    <!-- DESKTOP (600px fixed, hidden on mobile)                             -->
    <!-- ════════════════════════════════════════════════════════════════════ -->
    <table class="xw-desktop" cellpadding="0" cellspacing="0" border="0"
      style="margin:0;padding:0;font-family:Arial,sans-serif;font-size:14px;
             line-height:1.4;color:#000000;table-layout:fixed;width:600px;">
      <tr>
        <td style="padding:0;margin:0;width:100%;">
          <table cellpadding="0" cellspacing="0" border="0"
            style="width:100%;border-bottom:2px solid #000000;background-color:#ffffff;">
            <tr>

              <!-- Col 1: Logo + socials -->
              <td valign="middle"
                style="padding:28px 10px 28px 24px;width:130px;text-align:center;">
                <a href="https://xalimartgroup.sn" target="_blank"
                  style="text-decoration:none;display:block;">
                  <img src="${images.xalimartBlack}" alt="Xalimart Group" width="110"
                    style="display:block;margin:0 auto;max-width:110px;
                           outline:none;text-decoration:none;border:none;">
                </a>
                ${socialsRow(socials, images, 16)}
              </td>

              <!-- Col 2: Divider -->
              <td valign="top" style="padding:0 14px;width:1px;">
                <div style="width:1px;height:200px;border-left:1px solid ${DIVIDER};"></div>
              </td>

              <!-- Col 3: Name + Role + contacts -->
              <td valign="top"
                style="padding:28px 10px 28px 0;width:200px;line-height:1.5;">
                <div style="font-size:20px;font-weight:bold;margin-bottom:4px;
                            font-family:Arial,sans-serif;color:${TEXT_NAME};line-height:1.2;
                            white-space:nowrap;">
                  ${clampText(fullName || 'Full Name', 35)}
                </div>
                <div style="font-size:12px;color:${TEXT_ROLE};margin-bottom:14px;
                            font-weight:bold;font-family:Arial,sans-serif;">
                  ${clampText(role || 'Job Title', 50)}
                </div>
                <table cellpadding="0" cellspacing="0" border="0"
                  style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  ${contactRows}
                </table>
              </td>

              <!-- Col 4: Profile photo -->
              <td valign="middle"
                style="padding:28px 24px 28px 10px;width:135px;text-align:center;">
                ${desktopPhoto}
              </td>

            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- ════════════════════════════════════════════════════════════════════ -->
    <!-- MOBILE (100% width, hidden on desktop, shown on mobile via @media)  -->
    <!-- ════════════════════════════════════════════════════════════════════ -->
    <table class="xw-mobile" cellpadding="0" cellspacing="0" border="0"
      style="display:none;margin:0;padding:0;font-family:Arial,sans-serif;
             font-size:14px;line-height:1.4;color:#000000;width:100%;
             border-bottom:2px solid #000000;background-color:#ffffff;">

      <!-- Row 1: Photo (left) + Name & Role (right) -->
      <tr>
        <td width="88" valign="middle"
          style="padding:18px 0 10px 16px;width:88px;text-align:center;">
          ${mobilePhoto}
        </td>
        <td valign="middle" style="padding:18px 16px 10px 12px;">
          <div style="font-size:15px;font-weight:bold;color:${TEXT_NAME};
                      font-family:Arial,sans-serif;line-height:1.2;margin-bottom:4px;
                      white-space:nowrap;">
            ${clampText(fullName || 'Full Name', 35)}
          </div>
          <div style="font-size:11px;color:${TEXT_ROLE};font-weight:bold;
                      font-family:Arial,sans-serif;">
            ${clampText(role || 'Job Title', 50)}
          </div>
        </td>
      </tr>

      <!-- Row 2: Contact rows -->
      <tr>
        <td colspan="2" style="padding:4px 16px 14px 16px;">
          <table cellpadding="0" cellspacing="0" border="0"
            style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            ${contactRows}
          </table>
        </td>
      </tr>

      <!-- Separator -->
      <tr>
        <td colspan="2" height="1"
          style="height:1px;font-size:0;line-height:0;padding:0;
                 background-color:${DIVIDER};">&nbsp;</td>
      </tr>

      <!-- Row 3: Xalimart logo + socials -->
      <tr>
        <td colspan="2" style="padding:14px 16px 18px;text-align:center;">
          <a href="https://xalimartgroup.sn" target="_blank"
            style="text-decoration:none;display:block;">
            <img src="${images.xalimartBlack}" alt="Xalimart Group" width="90"
              style="display:block;margin:0 auto;max-width:90px;border:none;outline:none;">
          </a>
          ${socialsRow(socials, images, 16)}
        </td>
      </tr>

    </table>
  `
}
