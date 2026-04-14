export interface SignatureData {
  fullName: string
  role: string
  phone: string
  mobile: string
  email: string
  website: string
  photoBase64: string | null
  compositePhotoBase64?: string | null
  templateId: 'dark' | 'light' | 'minimal-light' | 'minimal-dark' | 'xalimart-white'
  socials: {
    facebook: string
    instagram: string
    linkedin: string
  }
}

export interface SignatureImages {
  xalimartBlack: string
  xalimartWhite: string
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
}
