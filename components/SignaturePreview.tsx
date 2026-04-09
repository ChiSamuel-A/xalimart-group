'use client'

import { useMemo } from 'react'
import { buildSignatureHTML, getPreviewImages } from '@/lib/generateSignature'
import CopyButton from '@/components/CopyButton'
import CopyButtonErrorBoundary from '@/components/CopyButtonErrorBoundary'
import type { SignatureData } from '@/types/signature'

interface Props {
  data: SignatureData
  isValid?: boolean
}

export default function SignaturePreview({ data, isValid = true }: Props) {
  const html = useMemo(
    () => buildSignatureHTML(data, getPreviewImages()),
    [data]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-950 to-purple-800 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">Live Preview</h2>
          <p className="text-purple-300 text-sm">How your signature will appear in Outlook</p>
        </div>

        {/* Minimal email-client chrome */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 w-7 flex-shrink-0">From</span>
            <div className="text-[11px] text-gray-600 bg-white border border-gray-200 rounded px-2 py-1 flex-1 truncate">
              {data.email || 'your.email@targetpoint.com'}
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

          {/* The signature itself — rendered at natural width, scrollable on small screens */}
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ minWidth: 'max-content' }}
          />
        </div>
      </div>

      <CopyButtonErrorBoundary>
        <CopyButton data={data} isValid={isValid} />
      </CopyButtonErrorBoundary>

      <p className="text-xs text-center text-gray-400">
        All logos are embedded as base64 on copy — no external image hosting needed.
      </p>
    </div>
  )
}
