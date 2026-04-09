export interface SignatureData {
  fullName: string
  role: string
  phone: string
  email: string
  website: string
  photoBase64: string | null
  templateId: 'classic' | 'light' | 'bold' | 'mono' | 'jg'
  products: {
    weExport: boolean
    tripnbusiness: boolean
    weXperience: boolean
  }
  socials: {
    facebook: string
    instagram: string
    linkedin: string
  }
}

export interface SignatureImages {
  targetpoint: string
  weExport: string
  tripnbusiness: string
  weXperience: string
  facebook: string
  instagram: string
  linkedin: string
  jgLogo: string
  targetpointFav: string
  tripnbusinessFav: string
  weExportFav: string
  weImportFav: string
  iconInstagram: string
  iconFacebook: string
  iconLinkedin: string
  emailIcon: string
  globeIcon: string
  appelIcon: string
  emailIconWh: string
  globeIconWh: string
  telephoneIconWh: string
}
