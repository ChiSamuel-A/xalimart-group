'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, LogOut } from 'lucide-react'
import TemplatePicker from '@/components/TemplatePicker'
import SignatureForm from '@/components/SignatureForm'
import SignaturePreview from '@/components/SignaturePreview'
import ConfirmModal from '@/components/ConfirmModal'
import type { SignatureData } from '@/types/signature'

const STORAGE_KEY = 'xalimart_signature_data'

const defaultData: SignatureData = {
  fullName: '',
  role: '',
  phone: '',
  mobile: '',
  email: '',
  website: '',
  photoBase64: null,
  templateId: 'xalimart-white',
  socials: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },
}

export default function Dashboard() {
  const [data, setData]       = useState<SignatureData>(defaultData)
  const [isValid, setIsValid] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setData({ ...defaultData, ...JSON.parse(saved) })
  }, [])

  const handleChange = (newData: SignatureData) => {
    setData(newData)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...newData, photoBase64: null }))
    }
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
    setShowClearConfirm(false)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="bg-black shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/xalimart-white.png"
              alt="Xalimart Group"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
            <div className="h-8 w-px bg-zinc-700" />
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight leading-tight">
                Signature Generator
              </h1>
              <p className="text-zinc-400 text-xs">Build your professional email signature</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-all text-sm font-medium border border-zinc-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <TemplatePicker data={data} onChange={handleChange} />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <SignatureForm data={data} onChange={handleChange} onValidationChange={setIsValid} />
          <div className="xl:sticky xl:top-8">
            <SignaturePreview data={data} isValid={isValid} />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear local cache
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
