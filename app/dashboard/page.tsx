'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, LogOut } from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import TemplatePicker from '@/components/TemplatePicker'
import SignatureForm from '@/components/SignatureForm'
import SignaturePreview from '@/components/SignaturePreview'
import ConfirmModal from '@/components/ConfirmModal'
import { supabase } from '@/lib/supabase'
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
  const { user, isLoaded }    = useUser()
  const { signOut }           = useClerk()
  const router                = useRouter()
  const [data, setData]       = useState<SignatureData>(defaultData)
  const [isValid, setIsValid] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [profileSynced, setProfileSynced]       = useState(false)

  // ── Redirect to login if not authenticated ────────────────────────────────
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/')
    }
  }, [isLoaded, user, router])

  // ── Load from localStorage on mount ───────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setData({ ...defaultData, ...JSON.parse(saved) })
  }, [])

  // ── Sync Clerk user → Supabase & load their saved signature ───────────────
  useEffect(() => {
    if (!user || profileSynced) return

    async function syncAndLoad() {
      const clerkEmail = user!.primaryEmailAddress?.emailAddress || ''

      // Ensure the user exists in Supabase profiles
      await supabase.from('profiles').upsert(
        { id: user!.id, email: clerkEmail },
        { onConflict: 'id', ignoreDuplicates: true }
      )

      // Load their saved signature if it exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (profile && !error && profile.full_name) {
        setData({
          fullName:    profile.full_name    || '',
          role:        profile.role         || '',
          phone:       profile.phone        || '',
          mobile:      profile.mobile       || '',
          email:       profile.email        || clerkEmail,
          website:     profile.website      || '',
          photoBase64: profile.photo_base64 || null,
          templateId:  profile.template_id  || 'xalimart-white',
          socials:     profile.socials      || defaultData.socials,
        })
      } else {
        // Pre-fill email from Clerk
        setData(prev => ({ ...prev, email: clerkEmail }))
      }

      setProfileSynced(true)
    }

    syncAndLoad()
  }, [user, profileSynced])

  // ── Reset sync flag on sign out ────────────────────────────────────────────
  useEffect(() => {
    if (!user) setProfileSynced(false)
  }, [user])

  const handleChange = async (newData: SignatureData) => {
    setData(newData)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...newData, photoBase64: null }))
    }

    if (user) {
      await supabase.from('profiles').upsert({
        id:           user.id,
        full_name:    newData.fullName,
        role:         newData.role,
        phone:        newData.phone,
        mobile:       newData.mobile,
        email:        newData.email,
        website:      newData.website,
        photo_base64: newData.photoBase64,
        template_id:  newData.templateId,
        socials:      newData.socials,
        updated_at:   new Date().toISOString(),
      })
    }
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
    setShowClearConfirm(false)
  }

  const handleSignOut = () => {
    signOut(() => router.replace('/'))
  }

  if (!isLoaded || !user) return null

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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-zinc-400 text-xs">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
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
