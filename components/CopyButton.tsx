'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildSignatureHTML, getInlineImages } from '@/lib/generateSignature'
import type { SignatureData } from '@/types/signature'

interface Props {
  data: SignatureData
  isValid?: boolean
}

type CopyState = 'idle' | 'loading' | 'success' | 'error'

export default function CopyButton({ data, isValid = true }: Props) {
  const [state, setState] = useState<CopyState>('idle')
  const hasRequired = !!(data.fullName.trim() && data.role.trim() && data.email.trim())
  const canCopy = isValid && hasRequired

  const handleCopy = async () => {
    setState('loading')
    try {
      // Fetch all logos and embed them as base64 so the signature
      // is fully self-contained when pasted into Outlook.
      const images = await getInlineImages()
      const html = buildSignatureHTML(data, images)

      // ClipboardItem with text/html writes rich text to the clipboard.
      // When pasted into Outlook's signature editor the full table
      // structure, colours, and images are preserved.
      const htmlBlob = new Blob([html], { type: 'text/html' })
      const textBlob = new Blob(
        [`${data.fullName} | ${data.role} | ${data.phone} | ${data.email}`],
        { type: 'text/plain' }
      )

      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob }),
      ])

      setState('success')
      setTimeout(() => setState('idle'), 3500)
    } catch (err) {
      console.error('Clipboard write failed:', err)
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
            'bg-purple-700 hover:bg-purple-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]',
          canCopy && state === 'loading' && 'bg-purple-400 text-white cursor-wait',
          canCopy && state === 'success' && 'bg-emerald-600 text-white',
          canCopy && state === 'error' && 'bg-red-500 text-white'
        )}
      >
        {state === 'idle' && (
          <>
            <Copy className="w-4 h-4" />
            Copy Signature to Outlook
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
            Copied! Paste into Outlook now
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
          Fill in your <strong>name</strong>, <strong>role</strong> and <strong>email</strong> to unlock your signature.
        </p>
      )}

      {hasRequired && !isValid && (
        <p className="text-xs text-center text-red-500 leading-relaxed">
          <strong>Fix the invalid fields above</strong> — one or more emails or URLs are incorrectly formatted.
        </p>
      )}

      {canCopy && state === 'success' && (
        <p className="text-xs text-center text-gray-500 leading-relaxed">
          Open Outlook &rarr; <strong>File &rarr; Options &rarr; Mail &rarr; Signatures</strong>
          {' '}and paste with{' '}
          <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px]">
            Ctrl+V
          </kbd>
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
