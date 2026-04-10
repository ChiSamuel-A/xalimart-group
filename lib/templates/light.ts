// Template: Light — white body, 620px wide, circular photo + diagonal bars left
import type { SignatureData, SignatureImages } from '@/types/signature'
import {
  clampText,
  whatsappHref,
  normalizeUrl,
  STATIC_ADDRESS,
  badgeContactRow,
  socialIconsRowBlackCircle,
} from './shared'

const BG        = '#ffffff'
const TEXT_NAME = '#000000'
const TEXT_ROLE = '#777777'
const TEXT_INFO = '#000000'
const BADGE_BG  = '#000000'
const DIVIDER   = '#000000'

export function buildLight(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, socials } = data

  // ── Photo element (120 px) ─────────────────────────────────────────────────
  const photoEl = photoBase64
    ? `<img src="${photoBase64}" width="120" height="120"
         alt="${clampText(fullName, 40)}"
         style="display:block;border-radius:50%;width:120px;height:120px;object-fit:cover;border:0;">`
    : `<table cellpadding="0" cellspacing="0" border="0" width="120" height="120"
         style="width:120px;height:120px;border-radius:50%;background-color:#cccccc;
                border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr><td width="120" height="120" style="width:120px;height:120px;font-size:0;line-height:0;">&nbsp;</td></tr>
       </table>`

  // ── Left cell — single diagonal bar behind the photo ──────────────────────
  // One 28 px-wide bar at -39° slices the full height of the cell (bar is
  // 380 px tall so it extends well past both the top and bottom edges).
  // Modern clients: CSS transform.  Outlook: VML <v:rect> with rotation:-39.
  // Bar bounding-box is centred horizontally (left=59 = 145/2 − 14) and
  // vertically (top=−70 keeps the centre at ≈110 px for a ~220 px row).
  const photoCell = `<td width="145" valign="middle"
    style="width:145px;padding:0;vertical-align:middle;overflow:hidden;position:relative;
           mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <!--[if mso]>
    <v:rect xmlns:v="urn:schemas-microsoft-com:vml"
      style="position:absolute;left:59px;top:-70px;width:28px;height:380px;rotation:-39;"
      filled="t" stroked="f" fillcolor="#000000">
    </v:rect>
    <![endif]-->
    <!--[if !mso]><!-->
    <div style="position:absolute;top:50%;left:59px;width:28px;height:380px;
                background-color:#000000;
                -webkit-transform:translateY(-50%) rotate(-39deg);
                transform:translateY(-50%) rotate(-39deg);
                transform-origin:center center;"></div>
    <!--<![endif]-->
    <!-- Photo on top -->
    <div style="position:relative;z-index:2;text-align:center;padding:17px 0 17px;">
      ${photoEl}
    </div>
  </td>`

  // ── Center — name, role, contact rows ──────────────────────────────────────
  const centerCell = `<td valign="middle"
    style="padding:20px 10px 20px 5px;vertical-align:middle;
           mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;
                   color:${TEXT_NAME};line-height:26px;mso-line-height-rule:exactly;
                   padding-bottom:4px;">
          ${clampText(fullName || 'Full Name', 40)}
        </td>
      </tr>
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:normal;
                   color:${TEXT_ROLE};line-height:17px;mso-line-height-rule:exactly;
                   padding-bottom:15px;">
          ${clampText(role || 'Job Title', 60)}
        </td>
      </tr>
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0" border="0"
            style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            ${email   ? badgeContactRow(images.emailIconWh,    `mailto:${email}`,     clampText(email, 38),   { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
            ${phone   ? badgeContactRow(images.appelIcon,      whatsappHref(phone),   phone,                  { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
            ${website ? badgeContactRow(images.globeIconWh,    normalizeUrl(website), clampText(website, 38), { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
            ${badgeContactRow(images.locationWhite, '#', STATIC_ADDRESS, { badgeBg: BADGE_BG, textColor: TEXT_INFO, isStatic: true, multiline: true })}
          </table>
        </td>
      </tr>
    </table>
  </td>`

  // ── Vertical divider ────────────────────────────────────────────────────────
  const vDivider = `<td width="1"
    style="width:1px;background-color:${DIVIDER};font-size:0;
           line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>`

  // ── Right — Xalimart black logo + social icons ──────────────────────────────
  const rightCell = `<td width="200" valign="middle" align="center"
    style="width:200px;padding:20px;vertical-align:middle;text-align:center;
           mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <a href="https://xalimartgroup.sn" target="_blank"
      style="display:block;text-decoration:none;">
      <img src="${images.xalimartBlack}" width="150" alt="Xalimart Group"
        style="display:block;margin:0 auto;width:150px;height:auto;max-width:150px;">
    </a>
    ${socialIconsRowBlackCircle(socials, images)}
  </td>`

  return `<div style="max-width:620px;overflow:hidden;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
             background-color:${BG};width:620px;max-width:100%;color-scheme:light;
             font-family:Arial,sans-serif;">
      <tr>
        ${photoCell}
        ${centerCell}
        ${vDivider}
        ${rightCell}
      </tr>
    </table>
  </div>`
}
