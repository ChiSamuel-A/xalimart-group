// Template: Xalimart Black V2
// Outer: 600x200 card | Inner: 560x180 shared reference — all cols align to same box
// DEBUG: borders enabled
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS, STATIC_PHONE } from './shared'

const FONT      = "'Century Gothic', Arial, sans-serif"
const TEXT_NAME = '#ffffff'
const TEXT_ROLE = '#ffffff'
const TEXT_INFO = '#ffffff'
const TEXT_ADDR = '#ffffff'
const DIVIDER   = '#444444'
const BG        = '#000000'

function simpleIcon(iconSrc: string, iconSize: number): string {
  return `<img src="${iconSrc}" width="${iconSize}" height="${iconSize}" border="0"
    style="display:block;width:${iconSize}px;height:${iconSize}px;min-width:${iconSize}px;
           min-height:${iconSize}px;max-width:${iconSize}px;max-height:${iconSize}px;border:none;">`
}

function contactRow(
  iconSrc: string,
  href: string,
  label: string,
  opts: { color?: string; isStatic?: boolean; isAddress?: boolean } = {}
): string {
  const { color = TEXT_INFO, isStatic = false, isAddress = false } = opts
  const fontSize = '13px'
  const content = isStatic
    ? `<span style="color:${color};font-size:${fontSize};font-family:${FONT};line-height:1.2;">${label}</span>`
    : `<a href="${href}" style="color:${color};text-decoration:none;font-size:${fontSize};font-family:${FONT};line-height:1.2;">${label}</a>`

  return `
    <tr>
      <td valign="${isAddress ? 'top' : 'middle'}"
        style="padding:1px 5px 1px 0;width:16px;font-size:0;line-height:0;">
        ${simpleIcon(iconSrc, 16)}
      </td>
      <td valign="${isAddress ? 'top' : 'middle'}"
        style="font-size:${fontSize};color:${color};font-family:${FONT};line-height:1.2;padding:1px 0;">
        ${content}
      </td>
    </tr>`
}

function socialsRow(
  socials: SignatureData['socials'],
  images: SignatureImages,
  iconSize = 18
): string {
  const items = [
    socials.instagram ? { url: socials.instagram, src: images.instagramWh, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookWh,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinWh,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!items.length) return ''

  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-top:6px;">
      <tr>
        ${items.map((s, i) => `
          <td align="center" valign="middle"
            style="${i < items.length - 1 ? 'padding-right:8px;' : ''}mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <a href="${s.url}" target="_blank" style="text-decoration:none;display:block;">
              ${simpleIcon(s.src, iconSize)}
            </a>
          </td>`).join('')}
      </tr>
    </table>`
}

export function buildXalimartBlackV2(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, socials } = data

  const photo = photoBase64
    ? `<img class="xsig-photo" src="${photoBase64}" alt="${clampText(fullName, 40)}"
         width="160" height="180"
         style="display:block;width:160px;height:180px;max-width:160px;max-height:180px;
                border:none;vertical-align:top;object-fit:cover;object-position:top center;
                ">`
    : `<div style="width:160px;height:180px;background-color:#1a1a1a;"></div>`

  const contactRows = `
    ${contactRow(images.emailIconWh,  `mailto:${email || ''}`,     clampText(email || '&nbsp;', 34))}
    ${contactRow(images.globeIconWh,  normalizeUrl(website || 'www.xalimartgroup.sn'), clampText(website || 'www.xalimartgroup.sn', 34))}
    ${contactRow(images.appelIcon,    whatsappHref(phone || ''),   phone || '&nbsp;')}
    ${contactRow(images.phoneIcon,    `tel:${STATIC_PHONE}`, STATIC_PHONE)}
    ${contactRow(images.locationWhite, '#', STATIC_ADDRESS, { color: TEXT_ADDR, isStatic: true, isAddress: true })}
  `

  return `<!--[if gte mso 9]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:200px;">
    <v:fill type="solid" color="#ffffff" />
    <v:textbox inset="0,0,0,0">
  <![endif]-->
  <div style="background-color:#ffffff;width:600px;max-width:600px;height:200px;overflow:hidden;line-height:0;font-size:0;">
  <style>
    @media screen and (max-width:600px){
      table.xsig-outer{width:100%!important;}
      table.xsig-inner{width:100%!important;height:auto!important;}
      td.xsig-c1{width:110px!important;height:auto!important;}
      td.xsig-c1 img.xsig-logo{width:95px!important;height:auto!important;}
      td.xsig-c2{display:none!important;}
      td.xsig-c3{width:auto!important;}
      td.xsig-c3 .xsig-name{font-size:13px!important;}
      td.xsig-c3 .xsig-role{font-size:10px!important;}
      td.xsig-c4{width:90px!important;}
      img.xsig-photo{width:90px!important;height:130px!important;max-width:90px!important;max-height:130px!important;}
    }
  </style>

  <!-- Outer table: 600x200, black bg -->
  <table class="xsig-outer" cellpadding="0" cellspacing="0" border="0" width="600"
    style="margin:0;padding:0;width:600px;border-collapse:collapse;
           mso-table-lspace:0pt;mso-table-rspace:0pt;table-layout:fixed;
           background-color:#ffffff;overflow:hidden;">

    <!-- Top spacer: 10px -->
    <tr><td height="10" style="height:10px;font-size:0;line-height:0;background-color:#ffffff;">&nbsp;</td></tr>

    <!-- Content row -->
    <tr>
      <td align="left" valign="top"
        style="padding:0;background-color:#ffffff;mso-line-height-rule:exactly;">

        <!-- Inner table: 560x180 — shared reference -->
        <table class="xsig-inner" cellpadding="0" cellspacing="0" border="0" width="560" height="180"
          style="margin:0;padding:0;width:560px;height:180px;border-collapse:collapse;
                 mso-table-lspace:0pt;mso-table-rspace:0pt;table-layout:fixed;
                 font-family:${FONT};font-size:0;line-height:0;overflow:hidden;
                 background-color:${BG};">
          <tr height="180" style="height:180px;mso-line-height-rule:exactly;background-color:${BG};">

            <!-- Col 1: Photo — 160px -->
            <td class="xsig-c4" valign="top" width="160" height="180"
              style="margin:0;padding:0;width:160px;height:180px;
                     line-height:0;font-size:0;vertical-align:top;
                     text-align:right;background-color:${BG};overflow:hidden;
                     mso-line-height-rule:exactly;
                     ">
              ${photo}
            </td>

            <!-- Col 2: Name + Role + contacts — 230px + 30px padding -->
            <td class="xsig-c3" valign="middle" width="240" height="180"
              style="margin:0;padding:0 0 0 20px;width:240px;height:180px;
                     vertical-align:middle;background-color:${BG};overflow:hidden;
                     mso-line-height-rule:exactly;
                     ">
              <div class="xsig-name"
                style="font-size:20px;font-weight:bold;margin:0 0 2px 0;padding:0;
                       font-family:${FONT};color:${TEXT_NAME};line-height:1.15;
                       white-space:nowrap;overflow:hidden;">
                ${clampText(fullName || 'Full Name', 26)}
              </div>
              <div class="xsig-role"
                style="font-size:16px;color:${TEXT_ROLE};margin:0 0 5px 0;padding:0;
                       font-weight:bold;font-family:${FONT};line-height:1.2;
                       white-space:nowrap;overflow:hidden;">
                ${clampText(role || 'Job Title', 38)}
              </div>
              <table cellpadding="0" cellspacing="0" border="0"
                style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                ${contactRows}
              </table>
            </td>

            <!-- Col 3: Vertical Divider — 10px -->
            <td class="xsig-c2" width="10" height="180"
              style="margin:0;padding:0 4.5px;width:10px;height:180px;
                    background-color:${BG};overflow:hidden;
                    mso-line-height-rule:exactly;
                    ">
              <div style="width:1px;height:180px;background-color:${DIVIDER};margin:0;padding:0;font-size:0;line-height:0;"></div>
            </td>

            <!-- Col 4: Logo + tagline + socials — 130px -->
            <td class="xsig-c1" valign="middle" width="130" height="180"
              style="margin:0;padding:0;width:130px;height:180px;
                    vertical-align:middle;text-align:center;
                    background-color:${BG};overflow:hidden;
                    mso-line-height-rule:exactly;
                    ">
              <a href="https://xalimartgroup.sn" target="_blank"
                style="text-decoration:none;display:block;">
                <img class="xsig-logo" src="${images.xalimartWhite}" alt="Xalimart Group"
                  width="100" height="90"
                  style="display:block;margin:0 auto;width:100px;height:90px;
                        max-width:100px;max-height:90px;outline:none;border:none;">
              </a>
              <img class="xsig-tag" src="${images.taglineBl}" alt="tagline"
                style="display:block;margin:0 auto;width:120px;max-width:120px;height:auto;border:none;outline:none;">
              ${socialsRow(socials, images)}
            </td>

          </tr>
        </table>

      </td>
    </tr>

    <!-- Bottom spacer: 10px -->
    <tr><td height="10" style="height:10px;font-size:0;line-height:0;background-color:#ffffff;">&nbsp;</td></tr>

  </table>

  </div>
  <!--[if gte mso 9]>
    </v:textbox>
  </v:rect>
  <![endif]-->`
}