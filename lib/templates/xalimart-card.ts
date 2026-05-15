import type { SignatureData } from '@/types/signature'
import { clampText, whatsappHref, STATIC_ADDRESS, STATIC_PHONE } from './shared'

// IMPORTANT: Change this to your live domain where the public folder is hosted.
const BASE_URL = 'https://xalimart-group.vercel.app/uploads'

function formatPhone(raw: string): string {
  if (!raw) return '';

  const cleaned = raw.replace(/[^\d+]/g, '');
  const digits = cleaned.replace(/\D/g, '');
  const local = digits.startsWith('221') ? digits.slice(3) : digits;

  if (local.length === 9) {
    return `+221 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }

  const genericMatch = cleaned.match(/^(\+\d{1,3})(\d+)$/);
  if (genericMatch) {
    return `${genericMatch[1]} ${genericMatch[2]}`;
  }

  return raw;
}

export function buildXalimartCard(data: SignatureData): string {
  const { fullName, role, phone, email, photoBase64, socials } = data

  const photoHtml = photoBase64
    ? `<img src="${photoBase64}" alt="${clampText(fullName || 'Profile', 40)}" width="160" style="display:block; width: 160px; max-width: 160px; border-radius: 12px; border:none;">`
    : `<img src="${BASE_URL}/profile_img.png" alt="Profile" width="160" style="display:block; width: 160px; max-width: 160px; border-radius: 12px; border:none;">`

  const phoneRow = phone
    ? `<tr>
        <td width="16" valign="middle" style="line-height:0; font-size:0;"><img src="${BASE_URL}/appel-bl.png" width="16" style="display:block; border:none;"></td>
        <td width="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="10" height="1" style="display:block;"></td>
        <td class="dark-text-grey" width="247" valign="middle" style="font-size: 13px; color: #1a1a1b; line-height: 15px; white-space: nowrap;"><a href="${whatsappHref(phone)}" class="dark-text-grey" style="color: #1a1a1b; text-decoration: none;">${formatPhone(phone)}</a> &nbsp;|&nbsp; <a href="tel:${STATIC_PHONE.replace(/\s/g,'')}" class="dark-text-grey" style="color: #1a1a1b; text-decoration: none;">${STATIC_PHONE}</a></td>
       </tr>
       <tr><td colspan="3" height="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="1" height="10" style="display:block;"></td></tr>`
    : `<tr>
        <td width="16" valign="middle" style="line-height:0; font-size:0;"><img src="${BASE_URL}/appel-bl.png" width="16" style="display:block; border:none;"></td>
        <td width="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="10" height="1" style="display:block;"></td>
        <td class="dark-text-grey" width="247" valign="middle" style="font-size: 13px; color: #1a1a1b; line-height: 15px; white-space: nowrap;"><a href="tel:${STATIC_PHONE.replace(/\s/g,'')}" class="dark-text-grey" style="color: #1a1a1b; text-decoration: none;">${STATIC_PHONE}</a></td>
       </tr>
       <tr><td colspan="3" height="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="1" height="10" style="display:block;"></td></tr>`

  const socialItems: string[] = [] 
  if (socials?.instagram) {
      socialItems.push(`<td width="24" style="line-height:0; font-size:0;"><a href="${socials.instagram}" target="_blank" style="line-height:0; font-size:0; text-decoration:none;"><img src="${BASE_URL}/instagram-bl.png" alt="Insta" width="24" style="display:block; width:24px; border:none;"></a></td>`)
  }
  if (socials?.facebook) {
      socialItems.push(`<td width="24" style="line-height:0; font-size:0;"><a href="${socials.facebook}" target="_blank" style="line-height:0; font-size:0; text-decoration:none;"><img src="${BASE_URL}/facebook-bl.png" alt="FB" width="24" style="display:block; width:24px; border:none;"></a></td>`)
  }
  if (socials?.linkedin) {
      socialItems.push(`<td width="24" style="line-height:0; font-size:0;"><a href="${socials.linkedin}" target="_blank" style="line-height:0; font-size:0; text-decoration:none;"><img src="${BASE_URL}/linkedin-bl.png" alt="LinkedIn" width="24" style="display:block; width:24px; border:none;"></a></td>`)
  }

  let socialHtml = ''
  if (socialItems.length > 0) {
      socialHtml = `<table cellpadding="0" cellspacing="0" border="0" align="center"><tr>`
      for (let i = 0; i < socialItems.length; i++) {
          socialHtml += socialItems[i]
          if (i < socialItems.length - 1) {
              socialHtml += `<td width="6" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="6" height="1" style="display:block;"></td>`
          }
      }
      socialHtml += `</tr></table>`
  }

  const displayFullName = fullName ? clampText(fullName, 35) : 'Full Name'
  const displayRole = role ? clampText(role, 45) : 'Role / Job Title'
  const displayEmail = email || 'your.email@xalimartgroup.sn'

  const rawHtml = `
<style type="text/css">
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    a { text-decoration: none; color: inherit; }
    
    @media (prefers-color-scheme: dark) {
        .dark-text-black, .dark-text-black * { color: #000001 !important; -webkit-text-fill-color: #000001 !important; }
        .dark-text-grey, .dark-text-grey * { color: #1a1a1b !important; -webkit-text-fill-color: #1a1a1b !important; }
    }
    [data-ogsc] .dark-text-black, [data-ogsc] .dark-text-black * { color: #000001 !important; }
    [data-ogsc] .dark-text-grey, [data-ogsc] .dark-text-grey * { color: #1a1a1b !important; }
</style>

<!-- OUTLOOK VML ROUNDED BORDER -->
<!--[if gte mso 9]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" arcsize="2%" strokeweight="1px" strokecolor="#e5e5e5" fillcolor="#ffffff" style="width:750px;">
<v:textbox inset="0,0,0,0">
<![endif]-->

<table class="main-wrapper-table" cellpadding="0" cellspacing="0" border="0" width="750" style="width: 750px; min-width: 750px; max-width: 750px; background-color:rgb(255,255,255); border: 1px solid #e5e5e5; border-radius: 15px; border-collapse: separate !important; border-spacing: 0; overflow: hidden; font-family: Arial, Helvetica, sans-serif;">
    
    <tr>
        <td colspan="3" height="25" style="line-height:0; font-size:0;">
            <img src="${BASE_URL}/transprent.png" width="1" height="25" style="display:block;">
        </td>
    </tr>
    
    <tr>
        <td width="25" style="line-height:0; font-size:0;">
            <img src="${BASE_URL}/transprent.png" width="25" height="1" style="display:block;">
        </td>
        
        <td width="700" valign="top">
            
            <table cellpadding="0" cellspacing="0" border="0" width="700">
                <tr>
                    
                    <td width="160" valign="bottom" style="line-height:0; font-size:0;">
                        ${photoHtml}
                    </td>
                    
                    <td width="20" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/transprent.png" width="20" height="1" style="display:block;">
                    </td>
                    
                    <td width="273" valign="top">
                        <table cellpadding="0" cellspacing="0" border="0" width="273">
                            <tr>
                                <td class="dark-text-black" style="font-size: 24px; font-weight: bold; color: #000001; line-height: 26px; white-space: nowrap;">${displayFullName}</td>
                            </tr>
                            
                            <tr><td height="5" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="1" height="5" style="display:block;"></td></tr>
                            
                            <tr>
                                <td class="dark-text-grey" style="font-size: 15px; color: #1a1a1b; line-height: 18px; white-space: nowrap;">${displayRole} | <strong class="dark-text-grey" style="color: #1a1a1b;">Xalimart Group</strong></td>
                            </tr>
                            
                            <tr><td height="18" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="1" height="18" style="display:block;"></td></tr>
                            
                            <tr>
                                <td>
                                    <table cellpadding="0" cellspacing="0" border="0" width="273">
                                        
                                        ${phoneRow}
                                        
                                        <tr>
                                            <td width="16" valign="middle" style="line-height:0; font-size:0;"><img src="${BASE_URL}/email.png" width="16" style="display:block; border:none;"></td>
                                            <td width="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="10" height="1" style="display:block;"></td>
                                            <td class="dark-text-grey" width="247" valign="middle" style="font-size: 13px; color: #1a1a1b; line-height: 15px; white-space: nowrap;"><a href="mailto:${displayEmail}" class="dark-text-grey" style="color: #1a1a1b; text-decoration: none;">${displayEmail}</a></td>
                                        </tr>
                                        
                                        <tr><td colspan="3" height="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="1" height="10" style="display:block;"></td></tr>
                                        
                                        <tr>
                                            <td width="16" valign="middle" style="line-height:0; font-size:0;"><img src="${BASE_URL}/location-black.png" width="16" style="display:block; border:none;"></td>
                                            <td width="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="10" height="1" style="display:block;"></td>
                                            <td class="dark-text-grey" width="247" valign="middle" style="font-size: 13px; color: #1a1a1b; line-height: 15px; white-space: nowrap;">${STATIC_ADDRESS}</td>
                                        </tr>
                                        
                                        <tr><td colspan="3" height="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="1" height="10" style="display:block;"></td></tr>
                                        
                                        <tr>
                                            <td width="16" valign="middle" style="line-height:0; font-size:0;"><img src="${BASE_URL}/globe.png" width="16" style="display:block; border:none;"></td>
                                            <td width="10" style="line-height:0; font-size:0;"><img src="${BASE_URL}/transprent.png" width="10" height="1" style="display:block;"></td>
                                            <td class="dark-text-grey" width="247" valign="middle" style="font-size: 13px; color: #1a1a1b; line-height: 15px; white-space: nowrap;"><a href="https://www.xalimartgroup.sn" target="_blank" class="dark-text-grey" style="color: #1a1a1b; text-decoration: none;">www.xalimartgroup.sn</a></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                    
                    <td width="15" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/transprent.png" width="15" height="1" style="display:block;">
                    </td>
                    
                    <td width="2" valign="middle" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/border.png" height="140" style="display:block; height: 140px; border:none;">
                    </td>
                    
                    <td width="15" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/transprent.png" width="15" height="1" style="display:block;">
                    </td>
                    
                    <td width="215" valign="middle">
                        <table cellpadding="0" cellspacing="0" border="0" width="215">
                            <tr>
                                
                                <td width="115" valign="top">
                                    <table cellpadding="0" cellspacing="0" border="0" width="115">
                                        <tr>
                                            <td style="line-height:0; font-size:0;">
                                                <a href="https://www.xalimartgroup.sn" target="_blank" style="line-height:0; font-size:0;"><img src="${BASE_URL}/logo.png" alt="Xalimart Group" width="115" style="display:block; width:115px; border:none;"></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="8" style="line-height:0; font-size:0;">
                                                <img src="${BASE_URL}/transprent.png" width="1" height="8" style="display:block;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="line-height:0; font-size:0;">
                                                <img src="${BASE_URL}/slogan.png" alt="Slogan" width="115" style="display:block; width:115px; border:none;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                
                                <td width="15" style="line-height:0; font-size:0;">
                                    <img src="${BASE_URL}/transprent.png" width="15" height="1" style="display:block;">
                                </td>
                                
                                <td width="85" valign="top">
                                    <table cellpadding="0" cellspacing="0" border="0" width="85">
                                        <tr>
                                            <td style="line-height:0; font-size:0;">
                                                <img src="${BASE_URL}/barcode.png" alt="QR Code" width="85" style="display:block; width:85px; border:none;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="12" style="line-height:0; font-size:0;">
                                                <img src="${BASE_URL}/transprent.png" width="1" height="12" style="display:block;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="line-height:0; font-size:0;">
                                                ${socialHtml}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table cellpadding="0" cellspacing="0" border="0" width="700">
                <tr>
                    <td width="110" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/transprent.png" width="110" height="1" style="display:block;">
                    </td>
                    <td width="280" valign="top" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/bottom-line.png" alt="" width="280" style="display:block; width:280px; border:none;">
                    </td>
                    <td width="310" style="line-height:0; font-size:0;">
                        <img src="${BASE_URL}/transprent.png" width="310" height="1" style="display:block;">
                    </td>
                </tr>
            </table>
            
        </td>
        
        <td width="25" style="line-height:0; font-size:0;">
            <img src="${BASE_URL}/transprent.png" width="25" height="1" style="display:block;">
        </td>
    </tr>

    <tr>
        <td colspan="3" height="25" style="line-height:0; font-size:0;">
            <img src="${BASE_URL}/transprent.png" width="1" height="25" style="display:block;">
        </td>
    </tr>
    
</table>

<!-- CLOSING OUTLOOK VML TAGS -->
<!--[if gte mso 9]>
</v:textbox>
</v:roundrect>
<![endif]-->
`

  return rawHtml.replace(/>\s+</g, '><').trim()
}
