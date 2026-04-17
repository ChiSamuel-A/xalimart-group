'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildSignatureHTML, getInlineImages } from '@/lib/generateSignature'
import { processAllImages } from '@/lib/safeIcons'
import type { SignatureData } from '@/types/signature'

interface Props {
  data: SignatureData
  isValid?: boolean
}

type CopyState = 'idle' | 'loading' | 'success' | 'error'

export default function CopyButton({ data, isValid = true }: Props) {
  const [state, setState] = useState<CopyState>('idle')
  const hasRequired = !!(data.fullName.trim() && data.email.trim())
  const canCopy = isValid && hasRequired

  const handleCopy = async () => {
    setState('loading')
    try {
      const rawImages = await getInlineImages()
      const images = await processAllImages(rawImages)
      const html = buildSignatureHTML(data, images)

      // Create a blob containing the HTML. This is the modern, 
      // most reliable way to copy "Rich Text" for Outlook.
      const htmlBlob = new Blob([html], { type: 'text/html' })
      const textBlob = new Blob([data.fullName + '\n' + data.role], { type: 'text/plain' })

      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      })

      await navigator.clipboard.write([item])

      setState('success')
      setTimeout(() => setState('idle'), 3500)
    } catch (err) {
      console.error('Copy failed:', err)
      setState('error')
      setTimeout(() => setState('idle'), 4000)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCopy}
        disabled={!canCopy || state === 'loading'}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all',
          !canCopy && 'bg-gray-200 text-gray-400 cursor-not-allowed',
          canCopy && state === 'idle' &&
            'bg-black hover:bg-zinc-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]',
          canCopy && state === 'loading' && 'bg-zinc-500 text-white cursor-wait',
          canCopy && state === 'success' && 'bg-emerald-600 text-white',
          canCopy && state === 'error'   && 'bg-red-500 text-white'
        )}
      >
        {state === 'idle' && (
          <>
            <Copy className="w-4 h-4" />
            Copy Your Email Signature
          </>
        )}
        {state === 'loading' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing signature…
          </>
        )}
        {state === 'success' && (
          <>
            <Check className="w-4 h-4" />
            Copied! Paste into your mail settings
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="w-4 h-4" />
            Copy failed — see note below
          </>
        )}
      </button>

      {!hasRequired && (
        <p className="text-xs text-center text-gray-400 leading-relaxed">
          Fill in your <strong>name</strong> and <strong>email</strong> to unlock your signature.
        </p>
      )}

      {hasRequired && !isValid && (
        <p className="text-xs text-center text-red-500 leading-relaxed">
          <strong>Fix the invalid fields above</strong> — one or more emails or URLs are incorrectly formatted.
        </p>
      )}

      {canCopy && state === 'success' && (
        <p className="text-xs text-center text-gray-500 leading-relaxed">
          Paste with{' '}
          <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px]">
            Ctrl+V
          </kbd>
          {' '}into <strong>Outlook</strong> or <strong>Gmail</strong> settings.
        </p>
      )}

      {canCopy && state === 'error' && (
        <p className="text-xs text-center text-red-400 leading-relaxed">
          Browser blocked clipboard access. The page must be served over{' '}
          <strong>HTTPS</strong> or <strong>localhost</strong> for the
          ClipboardItem API to work.
        </p>
      )}
    </div>
  )
}
