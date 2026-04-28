// Template: Xalimart White V3 (Outlook Fix)
// Fixes applied:
//   - Dark mode: off-white/off-black colors + color-scheme:light + [data-ogsb] CSS
//   - Divider: <div> → <table><tr><td background-color> (Outlook-safe)
//   - Social spacer: margin-top → <tr> spacer row
//   - object-fit removed (photo crop guarantees correct ratio)
//   - role="presentation" on all layout tables
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS, STATIC_PHONE } from './shared'

const FONT      = "'Century Gothic', Arial, sans-serif"
// Off-white/off-black: imperceptible to the eye but prevents Apple Mail's
// automatic color inversion which targets exact #000000 and #ffffff values.
const TEXT_NAME = '#000001'
const TEXT_ROLE = '#000001'
const TEXT_INFO = '#000001'
const TEXT_ADDR = '#000001'
const DIVIDER   = '#e0e0e0'
const BG        = '#fffffe'

function simpleIcon(iconSrc: string, iconSize: number): string {
  return `<img src="${iconSrc}" width="${iconSize}" height="${iconSize}" border="0" alt="" style="display:block;width:${iconSize}px;height:${iconSize}px;min-width:${iconSize}px;min-height:${iconSize}px;max-width:${iconSize}px;max-height:${iconSize}px;border:none;">`
}

function contactRow(
  iconSrc: string,
  href: string,
  label: string,
  opts: { color?: string; isStatic?: boolean; isAddress?: boolean } = {}
): string {
  const { color = TEXT_INFO, isStatic = false, isAddress = false } = opts
  const fontSize   = '10px'
  const lineHeight = '16px'

  const content = isStatic
    ? `<span style="color:${color};font-size:${fontSize};font-family:${FONT};line-height:${lineHeight};margin:0;padding:0;">${label}</span>`
    : `<a href="${href}" style="color:${color};text-decoration:none;font-size:${fontSize};font-family:${FONT};line-height:${lineHeight};margin:0;padding:0;">${label}</a>`

  const vAlign = isAddress ? 'top' : 'middle'
  return `<tr><td width="16" valign="${vAlign}" style="padding:1px 5px 1px 0;width:16px;font-size:0;line-height:0;mso-line-height-rule:exactly;">${simpleIcon(iconSrc, 16)}</td><td valign="${vAlign}" style="font-size:${fontSize};color:${color};font-family:${FONT};line-height:${lineHeight};padding:1px 0;mso-line-height-rule:exactly;">${content}</td></tr>`
}

function socialsRow(
  socials: SignatureData['socials'],
  images: SignatureImages,
  iconSize = 18
): string {
  const items = [
    socials.instagram ? { url: socials.instagram, src: images.instagramBl, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookBl,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinBl,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)

  if (!items.length) return ''

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        ${items.map((s, i) => `<td align="center" valign="middle" style="${i < items.length - 1 ? 'padding-right:8px;' : ''}mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:0;line-height:0;"><a href="${s.url}" target="_blank" style="text-decoration:none;display:block;font-size:0;line-height:0;">${simpleIcon(s.src, iconSize)}</a></td>`).join('')}
      </tr>
    </table>`
}

export function buildXalimartWhiteV3(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, photoBase64, socials } = data

  const hasSocials = !!(socials.instagram || socials.facebook || socials.linkedin)

  // Photo: no object-fit — the crop modal guarantees the correct portrait ratio.
  const photo = photoBase64
    ? `<img class="xsig-photo" src="${photoBase64}" alt="${clampText(fullName, 40)}"
         width="160" height="180"
         style="display:block;width:160px;height:180px;max-width:160px;max-height:180px;
                border:none;vertical-align:top;">`
    : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="160"
         style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr><td width="160" height="180"
           style="width:160px;height:180px;background-color:#f0f0f0;font-size:0;line-height:0;">&nbsp;</td></tr>
       </table>`

  return `<!--[if gte mso 9]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:200px;">
    <v:fill type="solid" color="${BG}" />
    <v:textbox inset="0,0,0,0">
  <![endif]-->
  <div style="background-color:${BG};width:600px;max-width:600px;height:200px;
              overflow:hidden;line-height:0;font-size:0;color-scheme:light only;">
  <style>
    @media screen and (max-width:600px){
      table.xsig-outer{width:100%!important;}
      table.xsig-inner{width:100%!important;height:auto!important;}
      td.xsig-c1{width:110px!important;height:auto!important;}
      td.xsig-c1 img.xsig-logo{width:95px!important;height:auto!important;}
      td.xsig-c2{display:none!important;}
      td.xsig-c3{width:auto!important;}
      td.xsig-c4{width:90px!important;}
      img.xsig-photo{width:90px!important;height:130px!important;max-width:90px!important;max-height:130px!important;}
    }
    /* Outlook.com dark mode overrides */
    [data-ogsb] table.xsig-outer{background-color:${BG}!important;}
    [data-ogsb] table.xsig-inner{background-color:${BG}!important;}
    [data-ogsb] td.xsig-c3{background-color:${BG}!important;}
    [data-ogsc] span,[data-ogsc] a{color:${TEXT_INFO}!important;}
    /* Declare light-only to supporting clients */
    @media (prefers-color-scheme:dark){
      table.xsig-outer{background-color:${BG}!important;}
      table.xsig-inner{background-color:${BG}!important;}
    }
  </style>

  <table role="presentation" class="xsig-outer" cellpadding="0" cellspacing="0" border="0" width="600"
    style="margin:0;padding:0;width:600px;border-collapse:collapse;
           mso-table-lspace:0pt;mso-table-rspace:0pt;table-layout:fixed;
           background-color:${BG};">

    <tr><td height="10" style="height:10px;font-size:0;line-height:0;
            mso-line-height-rule:exactly;background-color:${BG};">&nbsp;</td></tr>

    <tr>
      <td align="left" valign="top"
        style="padding:0;background-color:${BG};mso-line-height-rule:exactly;">

        <table role="presentation" class="xsig-inner" cellpadding="0" cellspacing="0" border="0"
          width="560" height="180"
          style="margin:0;padding:0;width:560px;height:180px;border-collapse:collapse;
                 mso-table-lspace:0pt;mso-table-rspace:0pt;table-layout:fixed;
                 font-family:${FONT};font-size:0;line-height:0;background-color:${BG};">
          <tr height="180" style="height:180px;mso-line-height-rule:exactly;">

            <!-- Col 1: Photo — 160px -->
            <td class="xsig-c4" valign="top" width="160" height="180"
              style="margin:0;padding:0;width:160px;height:180px;
                     line-height:0;font-size:0;vertical-align:top;
                     background-color:${BG};mso-line-height-rule:exactly;">
              ${photo}
            </td>

            <!-- Col 2: Info — 240px + 20px left padding -->
            <td class="xsig-c3" valign="middle" width="240" height="180"
              style="margin:0;padding:0 0 0 20px;width:240px;height:180px;
                     vertical-align:middle;background-color:${BG};
                     mso-line-height-rule:exactly;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                <tr><td colspan="2" style="padding:0 0 2px 0;margin:0;font-family:${FONT};font-size:20px;font-weight:bold;color:${TEXT_NAME};line-height:26px;mso-line-height-rule:exactly;white-space:nowrap;"><span style="margin:0;padding:0;">${clampText(fullName || 'Full Name', 26)}</span></td></tr>
                <tr><td colspan="2" style="padding:0 0 8px 0;margin:0;font-family:${FONT};font-size:16px;font-weight:bold;color:${TEXT_ROLE};line-height:20px;mso-line-height-rule:exactly;white-space:nowrap;"><span style="margin:0;padding:0;">${clampText(role || 'Job Title', 38)}</span></td></tr>
                ${contactRow(images.appelIconBl,  whatsappHref(phone || ''),             phone || '&nbsp;')}
                ${contactRow(images.phoneIconBl,  `tel:${STATIC_PHONE}`,                 STATIC_PHONE)}
                ${contactRow(images.emailIcon,    `mailto:${email || ''}`,               clampText(email || '&nbsp;', 34))}
                ${contactRow(images.globeIcon,    normalizeUrl('www.xalimartgroup.sn'),   'www.xalimartgroup.sn')}
                ${contactRow(images.locationBlack, '#', STATIC_ADDRESS, { color: TEXT_ADDR, isStatic: true, isAddress: true })}
              </table>
            </td>

            <!-- Col 3: Vertical divider — 1px line inside 10px column -->
            <td class="xsig-c2" width="10" height="180"
              style="margin:0;padding:0 4.5px;width:10px;height:180px;
                     background-color:${BG};mso-line-height-rule:exactly;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                <tr>
                  <td width="1" height="180"
                    style="width:1px;height:180px;background-color:${DIVIDER};
                           font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td>
                </tr>
              </table>
            </td>

            <!-- Col 4: Logo + tagline + socials — 130px -->
            <td class="xsig-c1" valign="middle" width="130" height="180"
              style="margin:0;padding:0;width:130px;height:180px;
                     vertical-align:middle;text-align:center;
                     background-color:${BG};mso-line-height-rule:exactly;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="130"
                style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                <tr>
                  <td align="center" style="padding:0;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <a href="https://xalimartgroup.sn" target="_blank"
                      style="text-decoration:none;display:block;">
                      <img class="xsig-logo" src="${images.xalimartBlack}" alt="Xalimart Group"
                        width="120" height="110"
                        style="display:block;margin:0 auto;width:120px;height:110px;
                               max-width:120px;max-height:110px;outline:none;border:none;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <img class="xsig-tag" src="${images.taglineWh}" alt=""
                      style="display:block;margin:0 auto;width:110px;max-width:110px;
                             height:auto;border:none;outline:none;">
                  </td>
                </tr>
                ${hasSocials ? `
                <tr>
                  <td height="6" style="height:6px;font-size:0;line-height:0;
                      mso-line-height-rule:exactly;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center" style="padding:0;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    ${socialsRow(socials, images)}
                  </td>
                </tr>` : ''}
              </table>
            </td>

          </tr>
        </table>
      </td>
    </tr>

    <tr><td height="10" style="height:10px;font-size:0;line-height:0;
            mso-line-height-rule:exactly;background-color:${BG};">&nbsp;</td></tr>

  </table>
  </div>
  <!--[if gte mso 9]>
    </v:textbox>
  </v:rect>
  <![endif]-->`
}
