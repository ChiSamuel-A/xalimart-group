'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import AuthSection from '@/components/AuthSection'

export default function Home() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      router.replace('/dashboard')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) return null
  if (user) return null // redirecting

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-4">
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
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/xalimart-white.png"
              alt="Xalimart Group"
              width={56}
              height={56}
              className="object-contain mx-auto mb-4 invert"
              priority
            />
            <h2 className="text-2xl font-bold text-black">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-1">Sign in to access your signature dashboard</p>
          </div>
          <AuthSection />
        </div>
      </div>

      <footer className="py-4 text-center text-[10px] text-gray-300 font-medium tracking-widest uppercase">
        Xalimart Group Ecosystem
      </footer>
    </div>
  )
}
