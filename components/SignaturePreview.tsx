'use client'

import { useMemo, useState, useEffect } from 'react'
import { buildSignatureHTML, getPreviewImages } from '@/lib/generateSignature'
import CopyButton from '@/components/CopyButton'
import CopyButtonErrorBoundary from '@/components/CopyButtonErrorBoundary'
import type { SignatureData } from '@/types/signature'
import { createLightComposite } from '@/lib/composite'

interface Props {
  data: SignatureData
  isValid?: boolean
}

export default function SignaturePreview({ data, isValid = true }: Props) {
  const [processedData, setProcessedData] = useState<SignatureData>(data)

  // ── Compositing logic ───────────────────────────────────────────────────────
  // We only run this when the photo or template changes.
  useEffect(() => {
    let active = true

    async function process() {
      // If template is light, we MUST have the composite for it to look right.
      if (data.templateId === 'light') {
        try {
          const composite = await createLightComposite(data.photoBase64)
          if (active) {
            setProcessedData({ ...data, compositePhotoBase64: composite })
          }
        } catch (err) {
          console.error('Compositing failed:', err)
          if (active) setProcessedData(data)
        }
      } else {
        // For other templates, we don't need the composite.
        if (active) setProcessedData(data)
      }
    }

    process()
    return () => { active = false }
  }, [data.photoBase64, data.templateId])

  // NOTE: We also need to keep other text fields in sync immediately.
  // The useEffect above only depends on photo/template. If they type their name,
  // we want the preview to update instantly without waiting for an async process.
  const displayData = useMemo(() => {
    return {
      ...data,
      compositePhotoBase64: processedData.compositePhotoBase64
    }
  }, [data, processedData.compositePhotoBase64])

  const html = useMemo(
    () => buildSignatureHTML(displayData, getPreviewImages()),
    [displayData]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-black px-6 py-4">
          <h2 className="text-white font-semibold text-lg">Live Preview</h2>
          <p className="text-zinc-400 text-sm">How your signature will appear in Outlook</p>
        </div>

        {/* Minimal email-client chrome */}
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

        {/* Email body + signature */}
        <div className="p-6 bg-white overflow-x-auto">
          <p className="text-sm text-gray-400 pb-4 mb-4 border-b border-gray-100 whitespace-pre-line">
            {`Hi,\n\nThank you for your time today. Looking forward to working together.\n\nBest regards,`}
          </p>

          {/* The signature — rendered at natural width, scrollable on small screens */}
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ minWidth: 'max-content' }}
          />
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
