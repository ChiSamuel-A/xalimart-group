export interface SignatureData {
  fullName: string
  role: string
  phone: string
  mobile: string
  email: string
  website: string
  photoBase64: string | null
  compositePhotoBase64?: string | null
  templateId: 'xalimart-white' | 'xalimart-black' | 'xalimart-black-v2' | 'xalimart-white-v2' | 'xalimart-black-v3' | 'xalimart-white-v3' | 'xalimart-card'
  socials: {
    facebook: string
    instagram: string
    linkedin: string
  }
}

export interface SignatureImages {
  xalimartBlack: string
  xalimartWhite: string
  xalimartWhiteNew: string
  emailIcon: string
  emailIconWh: string
  globeIcon: string
  globeIconWh: string
  appelIcon: string
  appelIconBl: string
  phoneIcon: string
  phoneIconBl: string
  telephoneIconWh: string
  locationBlack: string
  locationWhite: string
  instagramWh: string
  facebookWh: string
  linkedinWh: string
  instagramBl: string
  facebookBl: string
  linkedinBl: string
  lineIconBl: string
  lineIconWh: string
  taglineBl: string
  taglineWh: string
  watermarkCard: string
}
