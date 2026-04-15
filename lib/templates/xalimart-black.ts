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
    ? `<table class="xsig-photo-wrap" cellpadding="0" cellspacing="0" border="0" width="244"
         style="width:244px;background-color:${BG};border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td class="xsig-photo-td" width="244" height="293"
             style="width:244px;height:293px;padding:0;font-size:0;line-height:0;overflow:hidden;">
             <img class="xsig-photo" src="${photoBase64}" alt="${clampText(fullName, 40)}"
               width="244" height="293"
               style="display:block;width:244px;height:293px;max-width:244px;max-height:293px;border:none;vertical-align:top;border-radius:12px;object-fit:cover;">
           </td>
         </tr>
       </table>`
    : `<table class="xsig-photo-wrap" cellpadding="0" cellspacing="0" border="0" width="244"
         style="width:244px;background-color:#222222;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr>
           <td class="xsig-photo-td" width="244" height="293" align="center" valign="middle"
             style="width:244px;height:293px;font-size:0;line-height:0;background-color:#222222;">&nbsp;</td>
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

  return `<style>
    @media screen and (max-width:600px){
      table.xsig{width:100%!important;}
      table.xsig tr{height:auto!important;}
      td.xsig-c1{width:100px!important;padding:6px 4px 6px 8px!important;height:auto!important;vertical-align:middle!important;}
      td.xsig-c1 img.xsig-logo{width:72px!important;max-width:72px!important;}
      td.xsig-c1 img.xsig-tag{width:80px!important;max-width:80px!important;}
      td.xsig-c2{display:none!important;width:0!important;padding:0!important;overflow:hidden!important;}
      td.xsig-c3{padding:6px 4px 6px 4px!important;height:auto!important;vertical-align:middle!important;}
      td.xsig-c3 .xsig-name{font-size:13px!important;margin-bottom:2px!important;}
      td.xsig-c3 .xsig-role{font-size:10px!important;margin-bottom:4px!important;}
      td.xsig-c3 table td{font-size:7px!important;white-space:normal!important;padding:1px 4px 1px 0!important;line-height:1.2!important;}
      td.xsig-c3 table td span,td.xsig-c3 table td a{font-size:7px!important;line-height:1.2!important;}
      td.xsig-c3 table img{width:14px!important;height:14px!important;min-width:14px!important;min-height:14px!important;max-width:14px!important;max-height:14px!important;}
      td.xsig-c4{width:80px!important;height:auto!important;vertical-align:top!important;}
      table.xsig-photo-wrap{width:80px!important;}
      td.xsig-photo-td{width:80px!important;height:91px!important;font-size:0!important;line-height:0!important;overflow:hidden!important;}
      img.xsig-photo{width:80px!important;height:91px!important;min-width:80px!important;min-height:91px!important;max-width:80px!important;max-height:91px!important;object-fit:cover!important;}
    }
  </style>
  <table class="xsig" cellpadding="0" cellspacing="0" border="0" width="750"
      style="margin:0;padding:0;width:750px;border-collapse:collapse;
             mso-table-lspace:0pt;mso-table-rspace:0pt;
             font-family:${FONT};font-size:0;line-height:0;
             overflow:hidden;">
      <tr height="293" style="height:293px;mso-line-height-rule:exactly;">

        <!-- Col 1: Logo + tagline + socials — 180px -->
        <td class="xsig-c1" valign="middle" width="180"
          style="padding:10px 10px 10px 16px;width:180px;text-align:center;background-color:${BG};height:244px;mso-line-height-rule:exactly;">
          <a href="https://xalimartgroup.sn" target="_blank"
            style="text-decoration:none;display:block;">
            <img class="xsig-logo" src="${images.xalimartWhite}" alt="Xalimart Group" width="120"
              style="display:block;margin:0 auto;max-width:120px;outline:none;text-decoration:none;border:none;">
          </a>
          <img class="xsig-tag" src="${images.taglineBl}" alt="We don't follow the standArts, We create them."
            style="display:block;margin:8px auto 0;max-width:140px;border:none;outline:none;">
          ${socialsRow(socials, images)}
        </td>

        <!-- Col 2: Divider — 25px -->
        <td class="xsig-c2" valign="middle" width="25"
          style="padding:0 12px;width:25px;background-color:${BG};height:244px;mso-line-height-rule:exactly;">
          <table cellpadding="0" cellspacing="0" border="0"
            style="width:1px;height:244px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td width="1" height="244"
                style="width:1px;height:244px;background-color:${DIVIDER};font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td>
            </tr>
          </table>
        </td>

        <!-- Col 3: Name + Role + contacts — 301px -->
        <td class="xsig-c3" valign="middle" width="301"
          style="padding:10px 8px 10px 0;width:301px;background-color:${BG};height:244px;mso-line-height-rule:exactly;">
          <div class="xsig-name" style="font-size:21px;font-weight:bold;margin:0 0 4px 0;padding:0;
                      font-family:${FONT};color:${TEXT_NAME};line-height:1.2;">
            ${clampText(fullName || 'Full Name', 30)}
          </div>
          <div class="xsig-role" style="font-size:13px;color:${TEXT_ROLE};margin:0 0 12px 0;padding:0;
                      font-weight:bold;font-family:${FONT};line-height:1.4;">
            ${clampText(role || 'Job Title', 45)}
          </div>
          <table cellpadding="0" cellspacing="0" border="0"
            style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            ${contactRows}
          </table>
        </td>

        <!-- Col 4: Profile photo — 244px -->
        <td class="xsig-c4" valign="top" width="244"
          style="padding:0;width:244px;background-color:${BG};height:293px;line-height:0;font-size:0;mso-line-height-rule:exactly;">
          ${photo}
        </td>

      </tr>
    </table>`
}
