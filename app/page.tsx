'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import TemplatePicker from '@/components/TemplatePicker'
import SignatureForm from '@/components/SignatureForm'
import SignaturePreview from '@/components/SignaturePreview'
import ConfirmModal from '@/components/ConfirmModal'
import type { SignatureData } from '@/types/signature'

const STORAGE_KEY = 'tp_signature_data'

const defaultData: SignatureData = {
  fullName: '',
  role: '',
  phone: '',
  email: '',
  website: '',
  photoBase64: null,
  templateId: 'classic',
  products: {
    weExport: true,
    tripnbusiness: true,
    weXperience: true,
  },
  socials: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },
}

function loadFromStorage(): SignatureData {
  if (typeof window === 'undefined') return defaultData
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...defaultData, ...JSON.parse(saved) }
  } catch {}
  return defaultData
}

function saveToStorage(data: SignatureData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Quota exceeded (large photo) — store without photo
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, photoBase64: null }))
    } catch {}
  }
}

export default function Home() {
  const [data, setData]                   = useState<SignatureData>(loadFromStorage)
  const [isValid, setIsValid]             = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleChange = (newData: SignatureData) => {
    setData(newData)
    saveToStorage(newData)
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
    setShowClearConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="bg-gradient-to-r from-purple-950 to-purple-800 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-4">
          <Image
            src="/targetpoint.png"
            alt="Target Point"
            width={160}
            height={44}
            className="object-contain"
            priority
          />
          <div className="h-8 w-px bg-purple-700" />
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight leading-tight">
              Signature Generator
            </h1>
            <p className="text-purple-300 text-xs">Build your professional email signature</p>
          </div>
        </div>
      </header>

      {/* Template picker sits between header and the two-column layout */}
      <TemplatePicker data={data} onChange={handleChange} />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <SignatureForm data={data} onChange={handleChange} onValidationChange={setIsValid} />
          <div className="xl:sticky xl:top-8">
            <SignaturePreview data={data} isValid={isValid} />
          </div>
        </div>

        {/* Clear saved data */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear saved data
          </button>
        </div>
      </main>

      <ConfirmModal
        open={showClearConfirm}
        title="Clear all saved data?"
        message="This will permanently remove all your saved information from this device. This cannot be undone."
        confirmLabel="Yes, clear everything"
        onConfirm={handleClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  )
}
