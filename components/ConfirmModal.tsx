'use client'

import { AlertTriangle, X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Body */}
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{title}</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors -mt-0.5 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-6" />

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800
                       border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg
                       hover:bg-red-700 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}
