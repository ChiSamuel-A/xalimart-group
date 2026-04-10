// Template: Dark — full black body, 620×220px, circular photo left
import type { SignatureData, SignatureImages } from '@/types/signature'
import {
  clampText,
  whatsappHref,
  normalizeUrl,
  STATIC_ADDRESS,
  badgeContactRow,
  socialIconsRowBlack,
} from './shared'

const BG        = 'transparent'
const TEXT_NAME = '#222222'
const TEXT_ROLE = '#555555'
const TEXT_INFO = '#222222'
const BADGE_BG  = 'transparent'
const DIVIDER   = '#cccccc'

export function buildDark(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, photoBase64, socials } = data

  // ── Photo (left) ───────────────────────────────────────────────────────────
  const photoEl = photoBase64
    ? `<img src="${photoBase64}" width="120" height="120"
         alt="${clampText(fullName, 40)}"
         style="display:block;border-radius:50%;width:120px;height:120px;object-fit:cover;border:0;">`
    : `<table cellpadding="0" cellspacing="0" border="0" width="120" height="120"
         style="width:120px;height:120px;border-radius:50%;background-color:#444444;
                border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
         <tr><td width="120" height="120" style="width:120px;height:120px;font-size:0;line-height:0;">&nbsp;</td></tr>
       </table>`

  // ── Left Side Content (Photo + Info) ──────────────────────────────────────
  const identityContent = `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td width="145" valign="middle" style="width:145px;padding:20px 0 20px 20px;vertical-align:middle;mso-table-lspace:0pt;mso-table-rspace:0pt;">
          ${photoEl}
        </td>
        <td valign="middle" style="padding:20px 10px 20px 10px;vertical-align:middle;mso-table-lspace:0pt;mso-table-rspace:0pt;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:22px;font-weight:600;color:${TEXT_NAME};line-height:26px;padding-bottom:4px;">
                ${clampText(fullName || 'Full Name', 40)}
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:normal;color:${TEXT_ROLE};line-height:17px;padding-bottom:15px;">
                ${clampText(role || 'Job Title', 60)}
              </td>
            </tr>
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  ${email   ? badgeContactRow(images.emailIcon,     `mailto:${email}`,     clampText(email, 38),   { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
                  ${phone   ? badgeContactRow(images.appelIconBl,   whatsappHref(phone),   phone,                  { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
                  ${website ? badgeContactRow(images.globeIcon,     normalizeUrl(website), clampText(website, 38), { badgeBg: BADGE_BG, textColor: TEXT_INFO }) : ''}
                  ${badgeContactRow(images.locationBlack, '#', STATIC_ADDRESS, { badgeBg: BADGE_BG, textColor: TEXT_INFO, isStatic: true, multiline: true })}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  // ── Right Side Content (Logo + Socials) ───────────────────────────────────
  const brandContent = `
    <div style="padding:20px;text-align:center;">
      <a href="https://xalimartgroup.sn" target="_blank" style="display:block;text-decoration:none;">
        <img src="${images.xalimartBlack}" width="150" alt="Xalimart Group"
          style="display:block;margin:0 auto;width:150px;height:auto;max-width:150px;">
      </a>
      ${socialIconsRowBlack(socials, images)}
    </div>
  `

  return `
    <style>
      @media only screen and (max-width: 480px) {
        .mobile-stack { display: block !important; width: 100% !important; max-width: 100% !important; }
        .mobile-hide { display: none !important; }
        .mobile-center { text-align: center !important; }
      }
    </style>
    <div style="max-width:620px;overflow:hidden;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620"
        style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;
               background-color:${BG};width:620px;max-width:100%;
               font-family:Arial,sans-serif;">
        <tr>
          <td style="padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">
            <!--[if mso]>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620">
              <tr>
                <td width="419" valign="middle">
            <![endif]-->
            <div class="mobile-stack" style="display:inline-block; width:419px; vertical-align:middle; max-width:100%; font-size:14px; line-height:normal;">
              ${identityContent}
            </div>
            <!--[if mso]>
                </td>
                <td width="1" valign="middle" style="background-color:${DIVIDER};">
            <![endif]-->
            <div class="mobile-hide" style="display:inline-block; width:1px; height:180px; vertical-align:middle; background-color:${DIVIDER};"></div>
            <!--[if mso]>
                </td>
                <td width="200" valign="middle">
            <![endif]-->
            <div class="mobile-stack" style="display:inline-block; width:200px; vertical-align:middle; max-width:100%; font-size:14px; line-height:normal;">
              ${brandContent}
            </div>
            <!--[if mso]>
                </td>
              </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </div>
  `
}

