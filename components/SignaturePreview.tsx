'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react' // useState kept for safeImages/previewMode/iframeHeight
import { Monitor, Smartphone } from 'lucide-react'
import { buildSignatureHTML, getPreviewImages } from '@/lib/generateSignature'
import CopyButton from '@/components/CopyButton'
import CopyButtonErrorBoundary from '@/components/CopyButtonErrorBoundary'
import type { SignatureData, SignatureImages } from '@/types/signature'
import { processAllImages } from '@/lib/safeIcons'

interface Props {
  data: SignatureData
  isValid?: boolean
}

type PreviewMode = 'desktop' | 'mobile'

export default function SignaturePreview({ data, isValid = true }: Props) {
  const [safeImages, setSafeImages]         = useState<SignatureImages | null>(null)
  const [previewMode, setPreviewMode]       = useState<PreviewMode>('desktop')
  const [iframeHeight, setIframeHeight]     = useState(260)
  const iframeRef                           = useRef<HTMLIFrameElement>(null)

  // ── Icon processing ────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true
    async function prepare() {
      const rawImages = getPreviewImages()
      const processed = await processAllImages(rawImages)
      if (active) setSafeImages(processed)
    }
    prepare()
    return () => { active = false }
  }, [])

  const displayData = useMemo(() => ({ ...data }), [data])

  const html = useMemo(
    () => buildSignatureHTML(displayData, safeImages || getPreviewImages()),
    [displayData, safeImages]
  )

  // ── Auto-size the mobile iframe to its content ─────────────────────────────
  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const body = iframe.contentDocument?.body
      if (body) setIframeHeight(body.scrollHeight + 8)
    } catch { /* cross-origin guard */ }
  }, [])

  // Mobile iframe srcdoc — injects the signature into a narrow viewport
  const mobileSrcDoc = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 12px; background: #ffffff; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `, [html])

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-black px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Live Preview</h2>
            <p className="text-zinc-400 text-sm">How your signature appears in Outlook</p>
          </div>

          {/* ── Desktop / Mobile toggle ── */}
          <div className="flex items-center gap-1 bg-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                previewMode === 'desktop'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                previewMode === 'mobile'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>
        </div>

        {/* ── Email chrome ── */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 w-7 flex-shrink-0">From</span>
            <div className="text-[11px] text-gray-600 bg-white border border-gray-200 rounded px-2 py-1 flex-1 truncate">
              {data.email || 'your.email@xalimartgroup.sn'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 w-7 flex-shrink-0">To</span>
            <div className="text-[11px] text-gray-300 bg-white border border-gray-200 rounded px-2 py-1 flex-1">
              recipient@example.com
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 w-7 flex-shrink-0">Subj</span>
            <div className="text-[11px] text-gray-300 bg-white border border-gray-200 rounded px-2 py-1 flex-1">
              Re: Follow-up from our meeting
            </div>
          </div>
        </div>

        {/* ── Signature preview area ── */}
        <div className="p-6 bg-white">
          <p className="text-sm text-gray-400 pb-4 mb-4 border-b border-gray-100 whitespace-pre-line">
            {`Hi,\n\nThank you for your time today. Looking forward to working together.\n\nBest regards,`}
          </p>

          {previewMode === 'desktop' ? (
            /* Desktop: horizontally scrollable so full 600px signature is reachable */
            <div className="overflow-x-auto">
              <div
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ minWidth: 'max-content' }}
              />
            </div>
          ) : (
            /* Mobile: 375px iframe — @media queries fire inside it */
            <div className="flex justify-center">
              <div
                className="rounded-3xl overflow-hidden shadow-md"
                style={{
                  width: 375,
                  border: '8px solid #1a1a1a',
                  borderRadius: 36,
                }}
              >
                {/* Status bar */}
                <div
                  className="flex items-center justify-between px-5"
                  style={{ background: '#1a1a1a', paddingTop: 10, paddingBottom: 10 }}
                >
                  <span className="text-white text-[10px] font-semibold">9:41</span>
                  <div className="w-16 h-4 bg-black rounded-full" />
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 bg-white rounded-sm opacity-80" />
                    <div className="w-2 h-2 bg-white rounded-full opacity-80" />
                  </div>
                </div>

                {/* Screen */}
                <div style={{ background: '#ffffff' }}>
                  <iframe
                    ref={iframeRef}
                    srcDoc={mobileSrcDoc}
                    width={359}
                    height={iframeHeight}
                    onLoad={resizeIframe}
                    style={{ border: 'none', display: 'block', width: '359px' }}
                    title="Mobile signature preview"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CopyButtonErrorBoundary>
        <CopyButton data={displayData} isValid={isValid} />
      </CopyButtonErrorBoundary>

      <p className="text-xs text-center text-gray-400">
        All logos are served from the hosted URL — no external image hosting needed.
      </p>
    </div>
  )
}
