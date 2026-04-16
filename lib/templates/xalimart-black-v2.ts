// Template: Xalimart Black V2
// Rebuilt around a fixed 550x180 solid background color
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS } from './shared'

const FONT      = "'Century Gothic', Arial, sans-serif"
const TEXT_NAME = '#ffffff'
const TEXT_ROLE = '#ffffff'
const TEXT_INFO = '#ffffff'
const TEXT_ADDR = '#ffffff'
const DIVIDER   = '#444444'
const BG        = '#000000'

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
  const fontSize = '11px' // Slightly increased
  const content = isStatic
    ? `<span style="color:${color};font-size:${fontSize};font-family:${FONT};line-height:1.1;">${label}</span>`
    : `<a href="${href}" style="color:${color};text-decoration:none;font-size:${fontSize};font-family:${FONT};line-height:1.1;">${label}</a>`

  return `
    <tr>
      <td valign="${isAddress ? 'top' : 'middle'}" style="padding:1px 6px 1px 0;">
        ${simpleIcon(iconSrc, 16)} 
      </td>
      <td valign="${isAddress ? 'top' : 'middle'}"
        style="font-size:${fontSize};color:${color};font-family:${FONT};line-height:1.1;padding:1px 0;">
        ${content}
      </td>
    </tr>`
}

// ── Social icons row ───────────────────────────────────────────────────────
function socialsRow(
  socials: SignatureData['socials'],
  images: SignatureImages,
  iconSize = 22 // Slightly increased
): string {
  const items = [
    socials.instagram ? { url: socials.instagram, src: images.instagramWh, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookWh,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinWh,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!items.length) return ''

  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-top:2px;">
      <tr>
        ${items.map((s, i) => `
          <td align="center" valign="middle"
            style="${i < items.length - 1 ? 'padding-right:12px;' : ''}mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <a href="${s.url}" target="_blank" style="text-decoration:none;display:block;">
              ${simpleIcon(s.src, iconSize)}
            </a>
          </td>`).join('')}
      </tr>
    </table>`
}

export function buildXalimartBlackV2(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, mobile, email, website, photoBase64, socials } = data

  // ── Profile photo (Occupying full 144x180 dimension) ────────────────
  const photo = photoBase64
    ? `<table class="xsig-photo-wrap" cellpadding="0" cellspacing="0" border="0" width="144"
         style="width:144px;background-color:${BG};border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td class="xsig-photo-td" width="144" height="180"
             style="width:144px;height:180px;padding:0;font-size:0;line-height:0;overflow:hidden;">
             <img class="xsig-photo" src="${photoBase64}" alt="${clampText(fullName, 40)}"
               width="144" height="180"
               style="display:block;width:144px;height:180px;max-width:144px;max-height:180px;border:none;vertical-align:top;object-fit:cover;border-radius:12px;">
           </td>
         </tr>
       </table>`
    : `<table class="xsig-photo-wrap" cellpadding="0" cellspacing="0" border="0" width="144"
         style="width:144px;background-color:#222222;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td class="xsig-photo-td" width="144" height="180" align="center" valign="middle"
             style="width:144px;height:180px;font-size:0;line-height:0;background-color:#222222;">&nbsp;</td>
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

  return `<!--[if gte mso 9]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:550px;height:180px;">
    <v:fill type="solid" color="${BG}" />
    <v:textbox inset="0,0,0,0">
  <![endif]-->
  <div style="background-color: ${BG}; width: 550px; height: 180px;">
  <style>
    @media screen and (max-width:550px){
      table.xsig{width:100%!important; height:auto!important;}
      td.xsig-c1{width:22%!important;padding:0!important;height:auto!important;}
      td.xsig-c1 img.xsig-logo{width:100%!important;height:auto!important;}
      td.xsig-c1 img.xsig-tag{width:90%!important;}
      td.xsig-c2{display:none!important;}
      td.xsig-c3{padding:0!important;}
      td.xsig-c3 .xsig-name{font-size:14px!important;}
      td.xsig-c4{width:100px!important;padding:0!important;}
      table.xsig-photo-wrap, td.xsig-photo-td, img.xsig-photo{width:100px!important;height:125px!important;}
    }
  </style>
  <table class="xsig" cellpadding="0" cellspacing="0" border="0" width="550" height="180"
      style="margin:0;padding:0;width:550px;height:180px;border-collapse:collapse;
             mso-table-lspace:0pt;mso-table-rspace:0pt;
             font-family:${FONT};font-size:0;line-height:0;
             table-layout:fixed;overflow:hidden;background-color:${BG};">
      <tr height="180" style="height:180px;mso-line-height-rule:exactly;">

        <!-- Col 1: Logo + tagline + socials — 130px -->
        <td class="xsig-c1" valign="middle" width="130"
          style="padding:0;width:130px;text-align:center;height:180px;mso-line-height-rule:exactly;background-color:${BG};">
          <a href="https://xalimartgroup.sn" target="_blank"
            style="text-decoration:none;display:block;">
            <img class="xsig-logo" src="${images.xalimartWhiteNew}" alt="Xalimart Group" width="130" height="110"
              style="display:block;margin:0 auto;width:130px;height:110px;max-width:130px;max-height:110px;outline:none;text-decoration:none;border:none;object-fit:contain;">
          </a>
          <img class="xsig-tag" src="${images.taglineBl}" alt="We don't follow the standArts, We create them."
            style="display:block;margin:0 auto;max-width:125px;border:none;outline:none;">
          ${socialsRow(socials, images)}
        </td>

        <!-- Col 2: Divider — 1px -->
        <td class="xsig-c2" valign="middle" width="1"
          style="padding:0;width:1px;height:180px;mso-line-height-rule:exactly;background-color:${BG};">
          <table cellpadding="0" cellspacing="0" border="0"
            style="width:1px;height:180px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto;">
            <tr>
              <td width="1" height="180"
                style="width:1px;height:180px;background-color:${DIVIDER};font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td>
            </tr>
          </table>
        </td>

        <!-- Col 3: Name + Role + contacts — 275px -->
        <td class="xsig-c3" valign="middle" width="275"
          style="padding:0;width:275px;height:180px;mso-line-height-rule:exactly;background-color:${BG};">
          <div class="xsig-name" style="font-size:17px;font-weight:bold;margin:0;padding:0 0 0 10px;
                      font-family:${FONT};color:${TEXT_NAME};line-height:1.1;">
            ${clampText(fullName || 'Full Name', 30)}
          </div>
          <div class="xsig-role" style="font-size:12px;color:${TEXT_ROLE};margin:0;padding:0 0 2px 10px;
                      font-weight:bold;font-family:${FONT};line-height:1.2;">
            ${clampText(role || 'Job Title', 45)}
          </div>
          <table cellpadding="0" cellspacing="0" border="0"
            style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-left:10px;">
            ${contactRows}
          </table>
        </td>

        <!-- Col 4: Profile photo — 144px -->
        <td class="xsig-c4" valign="middle" width="144"
          style="padding:0;width:144px;height:180px;line-height:0;font-size:0;mso-line-height-rule:exactly;text-align:center;background-color:${BG};">
          ${photo}
        </td>

      </tr>
    </table>
  </div>
  <!--[if gte mso 9]>
    </v:textbox>
  </v:rect>
  <![endif]-->`
}
