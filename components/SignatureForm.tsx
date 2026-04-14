'use client'

import { useRef, useState } from 'react'
import { User, Briefcase, Mail, Globe, Upload, X, Link } from 'lucide-react'
import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js'
import { cn } from '@/lib/utils'
import type { SignatureData } from '@/types/signature'
import PhotoCropModal from '@/components/PhotoCropModal'

interface Props {
  data: SignatureData
  onChange: (data: SignatureData) => void
  onValidationChange: (isValid: boolean) => void
}

const DIAL_CODES = [
  { code: '+221', flag: '🇸🇳' },
  { code: '+237', flag: '🇨🇲' },
  { code: '+229', flag: '🇧🇯' },
  { code: '+261', flag: '🇲🇬' },
  { code: '+34',  flag: '🇪🇸' },
  { code: '+33',  flag: '🇫🇷' },
  { code: '+32',  flag: '🇧🇪' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+44',  flag: '🇬🇧' },
  { code: '+1',   flag: '🇺🇸' },
]

const TEXT_FIELDS = [
  { field: 'fullName' as const, label: 'Full Name',        icon: User,      placeholder: 'Sidiki Camara',              type: 'text',  required: true,  maxLength: 60  },
  { field: 'role'     as const, label: 'Role / Job Title', icon: Briefcase, placeholder: 'CEO & Architecte',           type: 'text',  required: true,  maxLength: 80  },
  { field: 'email'    as const, label: 'Email Address',    icon: Mail,      placeholder: 'sidiki.camara@xalimartgroup.sn', type: 'email', required: true,  maxLength: undefined },
  { field: 'website'  as const, label: 'Website',          icon: Globe,     placeholder: 'www.xalimartgroup.sn',       type: 'url',   required: false, maxLength: undefined },
]

function isValidEmail(val: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

function extractDialCode(phone: string): string {
  if (!phone) return '+221'
  const clean = phone.replace(/[\s()\-]/g, '')
  const sorted = [...DIAL_CODES].sort((a, b) => b.code.length - a.code.length)
  for (const { code } of sorted) {
    if (clean.startsWith(code)) return code
  }
  return '+221'
}

function extractLocalNumber(phone: string): string {
  if (!phone) return ''
  const dialCode = extractDialCode(phone)
  return phone.slice(dialCode.length).trim()
}

function normalizeUrl(val: string): string {
  if (!val) return val
  return /^https?:\/\//i.test(val) ? val : `https://${val}`
}

function isValidUrl(val: string): boolean {
  try { new URL(normalizeUrl(val)); return true } catch { return false }
}

export default function SignatureForm({ data, onChange, onValidationChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dialCode, setDialCode]             = useState(() => extractDialCode(data.phone))
  const [localNumber, setLocalNumber]       = useState(() => extractLocalNumber(data.phone))
  const [mobileDialCode, setMobileDialCode] = useState(() => extractDialCode(data.mobile || ''))
  const [mobileLocal, setMobileLocal]       = useState(() => extractLocalNumber(data.mobile || ''))
  const [errors, setErrors]                 = useState<Record<string, string>>({})
  const [cropSrc, setCropSrc]               = useState<string | null>(null)

  const applyError = (key: string, message: string | null) => {
    const next = { ...errors }
    if (message) next[key] = message
    else delete next[key]
    setErrors(next)
    onValidationChange(Object.keys(next).length === 0)
  }

  const validateEmail = (key: string, val: string) => {
    if (val && !isValidEmail(val)) applyError(key, 'Enter a valid email address')
    else applyError(key, null)
  }

  const validateUrl = (key: string, val: string) => {
    if (val && !isValidUrl(val)) applyError(key, 'Enter a valid URL starting with https://')
    else applyError(key, null)
  }

  const setField = (
    field: keyof Omit<SignatureData, 'photoBase64' | 'templateId' | 'phone' | 'socials'>,
    value: string
  ) => onChange({ ...data, [field]: value })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const updatePhone = (code: string, local: string) => {
    const raw = `${code}${local.trim()}`
    let formatted = raw
    try {
      if (raw.length > 5 && isValidPhoneNumber(raw)) {
        formatted = parsePhoneNumberWithError(raw).formatInternational()
      }
    } catch { /* keep raw */ }
    onChange({ ...data, phone: formatted })
  }

  const updateMobile = (code: string, local: string) => {
    const raw = `${code}${local.trim()}`
    let formatted = raw
    try {
      if (raw.length > 5 && isValidPhoneNumber(raw)) {
        formatted = parsePhoneNumberWithError(raw).formatInternational()
      }
    } catch { /* keep raw */ }
    onChange({ ...data, mobile: formatted })
  }

  const handleDialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDialCode(e.target.value)
    updatePhone(e.target.value, localNumber)
  }

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalNumber(e.target.value)
    updatePhone(dialCode, e.target.value)
  }

  const handleMobileDialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMobileDialCode(e.target.value)
    updateMobile(e.target.value, mobileLocal)
  }

  const handleMobileLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileLocal(e.target.value)
    updateMobile(mobileDialCode, e.target.value)
  }

  const inputClass = (key: string, base: string) =>
    cn(base, errors[key] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-black')

  return (
    <>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-black px-6 py-4">
        <h2 className="text-white font-semibold text-lg">Your Details</h2>
        <p className="text-zinc-400 text-sm">Fill in your information below</p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Photo Upload ─────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-300
                         flex items-center justify-center overflow-hidden cursor-pointer
                         hover:border-black transition-colors flex-shrink-0"
            >
              {data.photoBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photoBase64} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm text-black font-medium
                           hover:text-zinc-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {data.photoBase64 ? 'Change photo' : 'Upload photo'}
              </button>
              {data.photoBase64 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...data, photoBase64: null })}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
              <p className="text-xs text-gray-400 mt-1">PNG, JPG — embedded as base64</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="h-px bg-gray-100" />

        {/* ── Text Fields ──────────────────────────────────────────────────── */}
        {TEXT_FIELDS.map(({ field, label, icon: Icon, placeholder, type, required, maxLength }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={type}
                value={data[field]}
                onChange={(e) => setField(field, e.target.value)}
                onBlur={(e) => {
                  const val = e.target.value
                  if (required && !val.trim()) {
                    applyError(field, 'This field is required')
                    return
                  }
                  if (type === 'email') validateEmail(field, val)
                  if (type === 'url')   validateUrl(field, val)
                }}
                placeholder={placeholder}
                maxLength={maxLength}
                className={inputClass(field,
                  'w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow placeholder:text-gray-300 text-gray-800'
                )}
              />
            </div>
            {errors[field] && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* ── Phone ────────────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <div className="flex gap-2">
            <select
              value={dialCode}
              onChange={handleDialChange}
              className="flex-shrink-0 w-28 py-2.5 pl-2 pr-1 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         bg-white text-gray-800 cursor-pointer"
            >
              {DIAL_CODES.map(({ code, flag }) => (
                <option key={code} value={code}>{flag} {code}</option>
              ))}
            </select>
            <input
              type="tel"
              value={localNumber}
              onChange={handleLocalChange}
              placeholder="77 525 47 25"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         transition-shadow placeholder:text-gray-300 text-gray-800"
            />
          </div>
          {data.phone && (
            <p className="text-[11px] text-zinc-500 mt-1 ml-1">{data.phone}</p>
          )}
        </div>

        {/* ── Mobile ───────────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number
            <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
          </label>
          <div className="flex gap-2">
            <select
              value={mobileDialCode}
              onChange={handleMobileDialChange}
              className="flex-shrink-0 w-28 py-2.5 pl-2 pr-1 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         bg-white text-gray-800 cursor-pointer"
            >
              {DIAL_CODES.map(({ code, flag }) => (
                <option key={code} value={code}>{flag} {code}</option>
              ))}
            </select>
            <input
              type="tel"
              value={mobileLocal}
              onChange={handleMobileLocalChange}
              placeholder="77 624 07 07"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         transition-shadow placeholder:text-gray-300 text-gray-800"
            />
          </div>
          {data.mobile && (
            <p className="text-[11px] text-zinc-500 mt-1 ml-1">{data.mobile}</p>
          )}
        </div>

        <div className="h-px bg-gray-100" />

        {/* ── Social Media ─────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Social Media</label>
          <div className="space-y-3">
            {([
              { key: 'linkedin'  as const, icon: Link, placeholder: 'https://linkedin.com/in/yourname',  domain: 'linkedin.com',  name: 'LinkedIn'  },
              { key: 'instagram' as const, icon: Link, placeholder: 'https://instagram.com/yourhandle',  domain: 'instagram.com', name: 'Instagram' },
              { key: 'facebook'  as const, icon: Link, placeholder: 'https://facebook.com/yourprofile',  domain: 'facebook.com',  name: 'Facebook'  },
            ] as const).map(({ key, icon: Icon, placeholder, domain, name }) => (
              <div key={key}>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="url"
                    value={data.socials[key]}
                    onChange={(e) =>
                      onChange({ ...data, socials: { ...data.socials, [key]: e.target.value } })
                    }
                    onBlur={(e) => {
                      const val = e.target.value
                      const errorKey = `socials.${key}`
                      if (!val) { applyError(errorKey, null); return }
                      if (!isValidUrl(val)) {
                        applyError(errorKey, `Enter a valid URL (e.g. https://${domain}/...)`)
                        return
                      }
                      try {
                        const hostname = new URL(normalizeUrl(val)).hostname
                        if (!hostname.includes(domain))
                          applyError(errorKey, `This must be a ${name} link — URL must include ${domain}`)
                        else
                          applyError(errorKey, null)
                      } catch {
                        applyError(errorKey, `Enter a valid ${name} URL`)
                      }
                    }}
                    placeholder={placeholder}
                    className={inputClass(`socials.${key}`,
                      'w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow placeholder:text-gray-300 text-gray-800'
                    )}
                  />
                </div>
                {errors[`socials.${key}`] && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors[`socials.${key}`]}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            All optional — only filled links appear in the signature
          </p>
        </div>

      </div>
    </div>

    {/* Photo crop modal */}
    {cropSrc && (
      <PhotoCropModal
        imageSrc={cropSrc}
        onConfirm={(base64) => {
          onChange({ ...data, photoBase64: base64 })
          setCropSrc(null)
        }}
        onCancel={() => setCropSrc(null)}
      />
    )}
    </>
  )
}
