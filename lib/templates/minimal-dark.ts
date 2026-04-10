// Template: Minimal Dark — transparent body, optimized for dark themes, no photo
import type { SignatureData, SignatureImages } from '@/types/signature'
import {
  clampText,
  whatsappHref,
  normalizeUrl,
  STATIC_ADDRESS,
  badgeContactRow,
  socialIconsRowWhite,
} from './shared'

const BG        = '#000000'
const TEXT_NAME = '#ffffff' // Pure white for name on black background
const TEXT_ROLE = '#bbbbbb' // Softer grey for the role
const TEXT_INFO = '#ffffff' // Pure white for contact info
const DIVIDER   = '#444444' // Subtle dark divider

export function buildMinimalDark(data: SignatureData, images: SignatureImages): string {
  const { fullName, role, phone, email, website, socials } = data

  // ── Left Side Content (Identity + Contact, no photo) ─────────────────────
  const identityContent = `
    <table cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td style="padding:20px 10px 20px 20px;vertical-align:middle;mso-table-lspace:0pt;mso-table-rspace:0pt;">
          <table cellpadding="0" cellspacing="0" border="0"
            style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;
                         color:${TEXT_NAME};line-height:26px;padding-bottom:4px;">
                ${clampText(fullName || 'Full Name', 40)}
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:normal;
                         color:${TEXT_ROLE};line-height:17px;padding-bottom:18px;">
                ${clampText(role || 'Job Title', 60)}
              </td>
            </tr>
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0"
                  style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  ${email   ? badgeContactRow(images.emailIconWh,   `mailto:${email}`,     clampText(email, 38),   { textColor: TEXT_INFO }) : ''}
                  ${website ? badgeContactRow(images.globeIconWh,   normalizeUrl(website), clampText(website, 38), { textColor: TEXT_INFO }) : ''}
                  ${phone   ? badgeContactRow(images.appelIcon,     whatsappHref(phone),   phone,                  { textColor: TEXT_INFO }) : ''}
                  ${badgeContactRow(images.locationWhite, '#', STATIC_ADDRESS, { textColor: TEXT_INFO, isStatic: true, multiline: true })}
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
        <img src="${images.xalimartWhite}" width="150" alt="Xalimart Group"
          style="display:block;margin:0 auto;width:150px;height:auto;max-width:150px;">
      </a>
      ${socialIconsRowWhite(socials, images)}
    </div>
  `

  return `
    <style>
      @media only screen and (max-width: 480px) {
        .mobile-stack { display: block !important; width: 100% !important; max-width: 100% !important; }
        .mobile-hide { display: none !important; }
        .mobile-center { text-align: center !important; }
      }
      @media (prefers-color-scheme: dark) {
        .dark-adaptive { background-color: transparent !important; }
      }
    </style>
    <div style="max-width:620px;overflow:hidden;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620"
        class="dark-adaptive"
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
            <div class="mobile-stack" style="display:inline-block;width:419px;vertical-align:middle;max-width:100%;font-size:14px;line-height:normal;">
              ${identityContent}
            </div>
            <!--[if mso]>
                </td>
                <td width="1" valign="middle" style="background-color:${DIVIDER};">
            <![endif]-->
            <div class="mobile-hide" style="display:inline-block;width:1px;height:180px;vertical-align:middle;background-color:${DIVIDER};"></div>
            <!--[if mso]>
                </td>
                <td width="200" valign="middle">
            <![endif]-->
            <div class="mobile-stack" style="display:inline-block;width:200px;vertical-align:middle;max-width:100%;font-size:14px;line-height:normal;">
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
