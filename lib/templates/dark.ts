// Template: Dark — full black body, 620×220px, circular photo left
import type { SignatureData, SignatureImages } from '@/types/signature'
import {
  clampText,
  whatsappHref,
  normalizeUrl,
  STATIC_ADDRESS,
  badgeContactRow,
  socialIconsRowWhiteFilled,
} from './shared'

const BG        = '#000000'
const TEXT_NAME = '#ffffff'
const TEXT_ROLE = '#bbbbbb'
const TEXT_INFO = '#ffffff'
const BADGE_BG  = '#ffffff'   // all icons now use white circles
const DIVIDER   = '#ffffff'

export function buildDark(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, socials } = data

  // ── Photo (left) ───────────────────────────────────────────────────────────
  // Wider cell to accommodate larger photo and provide better spacing
  const photoCell = `<td width="130" valign="middle"
    style="width:130px;padding:20px;vertical-align:middle;
           mso-table-lspace:0pt;mso-table-rspace:0pt;">
    ${photoBase64
      ? `<img src="${photoBase64}" width="100" height="100"
           alt="${clampText(fullName, 40)}"
           style="display:block;border-radius:50%;width:100px;height:100px;object-fit:cover;">`
      : `<table cellpadding="0" cellspacing="0" border="0" width="100" height="100"
           style="width:100px;height:100px;border-radius:50%;background-color:#cccccc;
                  border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
           <tr><td width="100" height="100" style="width:100px;height:100px;font-size:0;line-height:0;">&nbsp;</td></tr>
         </table>`
    }
  </td>`

  // ── Center — name, role, contact rows ──────────────────────────────────────
  const centerCell = `<td valign="middle"
    style="padding:20px 10px;vertical-align:middle;
           mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:22px;font-weight:bold;
                   color:${TEXT_NAME};line-height:26px;mso-line-height-rule:exactly;
                   padding-bottom:4px;">
          ${clampText(fullName || 'Full Name', 40)}
        </td>
      </tr>
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:13px;
                   color:${TEXT_ROLE};line-height:17px;mso-line-height-rule:exactly;
                   padding-bottom:15px;">
          ${clampText(role || 'Job Title', 60)}
        </td>
      </tr>
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0" border="0"
            style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            ${email   ? badgeContactRow(images.emailIcon,     `mailto:${email}`,     clampText(email, 38),   { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
            ${phone   ? badgeContactRow(images.appelIcon,     whatsappHref(phone),   phone,                  { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
            ${website ? badgeContactRow(images.globeIcon,     normalizeUrl(website), clampText(website, 38), { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
            ${badgeContactRow(images.locationBlack, '#', STATIC_ADDRESS, { badgeBg: BADGE_BG, textColor: TEXT_INFO, isStatic: true, multiline: true })}
          </table>
        </td>
      </tr>
    </table>
  </td>`

  // ── Vertical divider ────────────────────────────────────────────────────────
  const vDivider = `<td width="1"
    style="width:1px;background-color:${DIVIDER};font-size:0;
           line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>`

  // ── Right — Xalimart logo + social icons ────────────────────────────────────
  const rightCell = `<td width="200" valign="middle" align="center"
    style="width:200px;padding:20px;vertical-align:middle;text-align:center;
           mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <a href="https://xalimartgroup.sn" target="_blank"
      style="display:block;text-decoration:none;">
      <img src="${images.xalimartWhite}" width="150" alt="Xalimart Group"
        style="display:block;margin:0 auto;width:150px;height:auto;max-width:150px;">
    </a>
    ${socialIconsRowWhiteFilled(socials, images)}
  </td>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620"
    style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
           background-color:${BG};width:620px;max-width:100%;color-scheme:light;
           font-family:Arial,sans-serif;">
    <tr>
      ${photoCell}
      ${centerCell}
      ${vDivider}
      ${rightCell}
    </tr>
  </table>`
}

