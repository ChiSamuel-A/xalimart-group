'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle, Loader2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildSignatureHTML, getInlineImages } from '@/lib/generateSignature'
import type { SignatureData } from '@/types/signature'

interface Props {
  data: SignatureData
  isValid?: boolean
}

type CopyState = 'idle' | 'loading' | 'success' | 'error' | 'downloaded'

export default function CopyButton({ data, isValid = true }: Props) {
  const [state, setState] = useState<CopyState>('idle')
  const hasRequired = !!(data.fullName.trim() && data.email.trim())
  const canCopy = isValid && hasRequired

  const buildHtmlBlob = async (): Promise<Blob> => {
    const images = await getInlineImages()
    return new Blob([buildSignatureHTML(data, images)], { type: 'text/html' })
  }

  const handleDownloadFallback = async () => {
    try {
      const blob = await buildHtmlBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'signature-xalimart.html'
      a.click()
      URL.revokeObjectURL(url)
      setState('downloaded')
      setTimeout(() => setState('idle'), 4000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 4000)
    }
  }

  const handleCopy = async () => {
    setState('loading')
    try {
      // Pass Promise directly to ClipboardItem — required by Safari to keep
      // the call synchronous within the user gesture (click event).
      const htmlPromise = buildHtmlBlob()
      const textBlob = new Blob([data.fullName + '\n' + data.role], { type: 'text/plain' })

      const item = new ClipboardItem({
        'text/html': htmlPromise,
        'text/plain': textBlob,
      })

      await navigator.clipboard.write([item])
      setState('success')
      setTimeout(() => setState('idle'), 3500)
    } catch {
      // ClipboardItem failed (old Firefox, HTTP, permissions denied)
      // Fallback: download as .html file
      await handleDownloadFallback()
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
          canCopy && state === 'downloaded' && 'bg-blue-600 text-white',
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
        {state === 'downloaded' && (
          <>
            <Download className="w-4 h-4" />
            Downloaded! Open the file and copy the content
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="w-4 h-4" />
            Failed — try again
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

      {canCopy && state === 'downloaded' && (
        <p className="text-xs text-center text-blue-500 leading-relaxed">
          Open <strong>signature-xalimart.html</strong> in a browser, select all (Ctrl+A), then copy and paste into your mail client.
        </p>
      )}
    </div>
  )
}
