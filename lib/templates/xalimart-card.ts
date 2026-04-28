// Template: Xalimart Card — Outlook-safe flat layout
// 8 columns: SP0(10)+C1(110)+SP1(20)+C2(210)+SP_div(14)+C3(1)+C4(95)+C5(140) = 600px
// No nested spacer tables — spacers are direct <td> columns in the main row
// Divider = 1px bgcolor <td> (most Outlook-safe technique)
// Icons: same style as xalimart-white-v3 — 16px black icons, no badge circles
import type { SignatureData, SignatureImages } from '@/types/signature'
import { clampText, whatsappHref, normalizeUrl, STATIC_ADDRESS } from './shared'

const FONT      = "'Century Gothic', Arial, sans-serif"
const TEXT_NAME = '#111111'
const TEXT_ROLE = '#333333'
const TEXT_INFO = '#444444'
const DIVIDER   = '#222222'
const DECO      = '#111111'
const ICON_SIZE = 16
// Text area per contact row: C2(210) - icon(16) - gap(5) = 189px
const TEXT_W    = 189

// Simple icon cell — identical to xalimart-white-v3's simpleIcon approach
function iconCell(iconSrc: string, vAlign: 'top' | 'middle' = 'middle'): string {
  return `<td width="${ICON_SIZE}" valign="${vAlign}" style="padding:0;width:${ICON_SIZE}px;font-size:0;line-height:0;mso-line-height-rule:exactly;"><img src="${iconSrc}" width="${ICON_SIZE}" height="${ICON_SIZE}" border="0" alt="" style="display:block;width:${ICON_SIZE}px;height:${ICON_SIZE}px;min-width:${ICON_SIZE}px;min-height:${ICON_SIZE}px;max-width:${ICON_SIZE}px;max-height:${ICON_SIZE}px;border:none;"></td>`
}

// 3-col row: icon(16) | 5px spacer | text(189) — nowrap HTML attr for Outlook
function contactRow(
  iconSrc: string,
  href: string,
  label: string,
  opts: { isStatic?: boolean; isAddress?: boolean } = {}
): string {
  const { isStatic = false, isAddress = false } = opts
  const vAlign = isAddress ? 'top' : 'middle'
  const content = isStatic
    ? `<span style="color:${TEXT_INFO};font-size:11px;font-family:${FONT};line-height:16px;">${label}</span>`
    : `<a href="${href}" style="color:${TEXT_INFO};text-decoration:none;font-size:11px;font-family:${FONT};line-height:16px;">${label}</a>`
  const textTd = isAddress
    ? `<td width="${TEXT_W}" valign="top" style="padding:0;width:${TEXT_W}px;font-size:11px;color:${TEXT_INFO};font-family:${FONT};line-height:16px;mso-line-height-rule:exactly;">${content}</td>`
    : `<td nowrap width="${TEXT_W}" valign="middle" style="padding:0;width:${TEXT_W}px;white-space:nowrap;font-size:11px;color:${TEXT_INFO};font-family:${FONT};line-height:16px;mso-line-height-rule:exactly;">${content}</td>`
  return `<tr>${iconCell(iconSrc, vAlign)}<td width="5" style="width:5px;font-size:0;line-height:0;padding:0;">&nbsp;</td>${textTd}</tr><tr><td colspan="3" height="5" style="height:5px;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td></tr>`
}

// Social icons — black variants, no badge circles (same as white-v3)
function socialsRow(socials: SignatureData['socials'], images: SignatureImages): string {
  const items = [
    socials.instagram ? { url: socials.instagram, src: images.instagramBl, alt: 'Instagram' } : null,
    socials.facebook  ? { url: socials.facebook,  src: images.facebookBl,  alt: 'Facebook'  } : null,
    socials.linkedin  ? { url: socials.linkedin,  src: images.linkedinBl,  alt: 'LinkedIn'  } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null)
  if (!items.length) return ''
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;"><tr>${
    items.map((s, i) =>
      `<td align="center" valign="middle" style="${i < items.length - 1 ? 'padding-right:8px;' : ''}font-size:0;line-height:0;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a href="${s.url}" target="_blank" style="text-decoration:none;display:block;font-size:0;line-height:0;"><img src="${s.src}" width="${ICON_SIZE}" height="${ICON_SIZE}" border="0" alt="${s.alt}" style="display:block;width:${ICON_SIZE}px;height:${ICON_SIZE}px;border:none;"></a></td>`
    ).join('')
  }</tr></table>`
}

const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fxalimartgroup.sn&color=111111&bgcolor=ffffff&format=png'

export function buildXalimartCard(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, photoBase64, socials } = data
  const hasSocials = !!(socials.instagram || socials.facebook || socials.linkedin)

  const photo = photoBase64
    ? `<img class="xsig-card-photo" src="${photoBase64}" alt="${clampText(fullName, 40)}" width="110" height="130" style="display:block;width:110px;height:130px;max-width:110px;max-height:130px;border:none;vertical-align:top;">`
    : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="110" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;"><tr><td width="110" height="130" bgcolor="#e0e0e0" style="width:110px;height:130px;background-color:#e0e0e0;border-radius:8px;font-size:0;line-height:0;">&nbsp;</td></tr></table>`

  const phoneRow = phone
    ? `<tr>${iconCell(images.appelIconBl)}<td width="5" style="width:5px;font-size:0;line-height:0;padding:0;">&nbsp;</td><td nowrap width="${TEXT_W}" valign="middle" style="padding:0;width:${TEXT_W}px;white-space:nowrap;font-size:11px;color:${TEXT_INFO};font-family:${FONT};line-height:16px;mso-line-height-rule:exactly;"><a href="${whatsappHref(phone)}" style="color:${TEXT_INFO};text-decoration:none;font-size:11px;font-family:${FONT};line-height:16px;">${phone}</a></td></tr><tr><td colspan="3" height="5" style="height:5px;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td></tr>`
    : ''

  return `<style>
    @media screen and (max-width:600px){
      table.xsig-card,table.xsig-card-border,table.xsig-card-inner{width:100%!important;}
      td.xsig-sp0,td.xsig-sp1,td.xsig-sp-div,td.xsig-c3,td.xsig-c5{display:none!important;width:0!important;overflow:hidden!important;}
      td.xsig-c1{width:80px!important;}
      td.xsig-c2{width:auto!important;}
      td.xsig-c4{width:70px!important;}
      img.xsig-card-photo{width:70px!important;height:82px!important;max-width:70px!important;max-height:82px!important;}
    }
  </style>

  <table role="presentation" class="xsig-card" cellpadding="0" cellspacing="0" border="0" width="600"
    style="margin:0;padding:0;width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${FONT};font-size:0;line-height:0;">

    <tr><td height="12" style="height:12px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>

    <tr><td style="padding:0;">

      <table role="presentation" class="xsig-card-border" cellpadding="0" cellspacing="0" border="0" width="600"
        style="width:600px;border-collapse:separate;border-spacing:0;border:1.5px solid #d8d8d8;border-radius:14px;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td bgcolor="#ffffff" background="${images.filegram}" style="padding:0;background-color:#ffffff;background-image:url('${images.filegram}');background-repeat:repeat;background-size:100px 100px;border-radius:12px;">

            <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:597px;height:210px;"><v:fill type="tile" src="${images.filegram}" color="#ffffff"/><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true"><div><![endif]-->
            <table role="presentation" class="xsig-card-inner" cellpadding="0" cellspacing="0" border="0" width="600"
              style="margin:0;padding:0;width:600px;border-collapse:separate;border-spacing:0;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${FONT};font-size:0;line-height:0;">

              <!-- Width-setter row — forces Outlook to allocate exact column widths -->
              <tr style="font-size:0;line-height:0;mso-line-height-rule:exactly;">
                <td width="10"  style="width:10px;font-size:0;line-height:0;padding:0;"></td>
                <td width="110" style="width:110px;font-size:0;line-height:0;padding:0;"></td>
                <td width="20"  style="width:20px;font-size:0;line-height:0;padding:0;"></td>
                <td width="210" style="width:210px;font-size:0;line-height:0;padding:0;"></td>
                <td width="14"  style="width:14px;font-size:0;line-height:0;padding:0;"></td>
                <td width="1"   style="width:1px;font-size:0;line-height:0;padding:0;"></td>
                <td width="95"  style="width:95px;font-size:0;line-height:0;padding:0;"></td>
                <td width="140" style="width:140px;font-size:0;line-height:0;padding:0;"></td>
              </tr>

              <!-- Top spacer -->
              <tr><td colspan="8" height="16" style="height:16px;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td></tr>

              <!-- ── Main content row ── -->
              <tr>

                <!-- SP0: 10px left margin -->
                <td class="xsig-sp0" width="10" style="width:10px;font-size:0;line-height:0;padding:0;">&nbsp;</td>

                <!-- C1: 110px photo -->
                <td class="xsig-c1" valign="middle" width="110"
                  style="padding:0;width:110px;vertical-align:middle;font-size:0;line-height:0;">
                  ${photo}
                </td>

                <!-- SP1: 20px gap between photo and text -->
                <td class="xsig-sp1" width="20" style="width:20px;font-size:0;line-height:0;padding:0;">&nbsp;</td>

                <!-- C2: 210px text content -->
                <td class="xsig-c2" valign="middle" width="210"
                  style="padding:0;width:210px;vertical-align:middle;mso-line-height-rule:exactly;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="210"
                    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <!-- Name (colspan=3: icon col + spacer col + text col) -->
                    <tr><td colspan="3" style="padding:0 0 2px 0;font-family:${FONT};font-size:18px;font-weight:bold;color:${TEXT_NAME};line-height:23px;mso-line-height-rule:exactly;">
                      <span style="margin:0;padding:0;">${clampText(fullName || 'Full Name', 26)}</span>
                    </td></tr>
                    <!-- Role -->
                    <tr><td colspan="3" style="padding:0 0 10px 0;font-family:${FONT};font-size:12px;font-weight:bold;color:${TEXT_ROLE};line-height:17px;mso-line-height-rule:exactly;">
                      <span style="margin:0;padding:0;">${clampText(role || 'Job Title', 38)}</span>
                    </td></tr>
                    <!-- Contacts — black icons, no badge circles (same as white-v3) -->
                    ${phoneRow}
                    ${contactRow(images.emailIcon,     `mailto:${email || ''}`,             clampText(email || '&nbsp;', 32))}
                    ${contactRow(images.locationBlack, '#',                                  STATIC_ADDRESS, { isStatic: true, isAddress: true })}
                    ${contactRow(images.globeIcon,     normalizeUrl('www.xalimartgroup.sn'), 'www.xalimartgroup.sn')}
                  </table>
                </td>

                <!-- SP_div: 14px spacer before divider line -->
                <td class="xsig-sp-div" width="14" style="width:14px;font-size:0;line-height:0;padding:0;">&nbsp;</td>

                <!-- C3: 1px divider (bgcolor — no CSS needed, works in all Outlook) -->
                <td class="xsig-c3" width="1" bgcolor="${DIVIDER}"
                  style="width:1px;background-color:${DIVIDER};font-size:0;line-height:0;padding:0;">&nbsp;</td>

                <!-- C4: 95px logo + tagline -->
                <td class="xsig-c4" valign="middle" width="95"
                  style="padding:0;width:95px;vertical-align:middle;text-align:right;mso-line-height-rule:exactly;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="95"
                    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <tr>
                      <td align="right" style="padding:0;">
                        <a href="https://xalimartgroup.sn" target="_blank" style="text-decoration:none;display:inline-block;font-size:0;line-height:0;">
                          <img src="${images.xalimartBlack}" alt="Xalimart Group" width="83" height="76"
                            style="display:block;margin:0 0 0 auto;width:83px;height:76px;max-width:83px;border:none;outline:none;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="right" style="padding:5px 0 0;">
                        <img src="${images.taglineWh}" alt="tagline"
                          style="display:block;margin:0 0 0 auto;width:83px;max-width:83px;height:auto;border:none;outline:none;">
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- C5: 140px QR + socials (centered) -->
                <td class="xsig-c5" valign="middle" width="140"
                  style="padding:0;width:140px;vertical-align:middle;text-align:center;mso-line-height-rule:exactly;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="90"
                    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto;">
                    <tr>
                      <td align="center" style="padding:0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="90" height="90"
                          style="border-collapse:separate;border-spacing:0;border:2px solid #111111;border-radius:16px;mso-table-lspace:0pt;mso-table-rspace:0pt;width:90px;height:90px;">
                          <tr>
                            <td width="90" height="90" align="center" valign="middle"
                              style="width:90px;height:90px;padding:8px;border-radius:14px;line-height:0;font-size:0;">
                              <img src="${QR_URL}" width="74" height="74" border="0" alt="QR xalimartgroup.sn"
                                style="display:block;width:74px;height:74px;border:none;">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ${hasSocials ? `<tr><td height="8" style="height:8px;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td></tr><tr><td align="center" style="padding:0;">${socialsRow(socials, images)}</td></tr>` : ''}
                  </table>
                </td>

              </tr>

              <!-- Bottom decoration -->
              <tr>
                <!-- SP0 + C1: no border (photo area — line starts at text column) -->
                <td colspan="2" width="120" style="width:120px;padding:0;font-size:0;line-height:0;"></td>
                <!-- SP1 + C2: border-left + border-bottom with rounded corner -->
                <td colspan="2" height="16" width="230"
                  style="width:230px;height:16px;border-left:3px solid ${DECO};border-bottom:3px solid ${DECO};border-bottom-left-radius:10px;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td>
                <!-- SP_div + C3: no border -->
                <td colspan="2" width="15" style="width:15px;padding:0;font-size:0;line-height:0;"></td>
                <!-- C4: underline under logo -->
                <td width="95" height="16"
                  style="width:95px;height:16px;border-bottom:3px solid ${DECO};font-size:0;line-height:0;mso-line-height-rule:exactly;"></td>
                <!-- C5: empty -->
                <td width="140" style="width:140px;padding:0;font-size:0;line-height:0;"></td>
              </tr>

              <!-- Bottom spacer -->
              <tr><td colspan="8" height="14" style="height:14px;font-size:0;line-height:0;mso-line-height-rule:exactly;"></td></tr>

            </table>
            <!--[if gte mso 9]></div></v:textbox></v:rect><![endif]-->
          </td>
        </tr>
      </table>

    </td></tr>

    <tr><td height="10" style="height:10px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>

  </table>`
}
