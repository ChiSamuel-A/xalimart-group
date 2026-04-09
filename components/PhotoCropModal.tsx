'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  imageSrc: string
  onConfirm: (croppedBase64: string) => void
  onCancel: () => void
}

async function getCroppedImg(imageSrc: string, cropPixels: Area): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = imageSrc
  })
  const size = Math.min(cropPixels.width, cropPixels.height)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(
    image,
    cropPixels.x, cropPixels.y,
    cropPixels.width, cropPixels.height,
    0, 0,
    size, size
  )
  return canvas.toDataURL('image/jpeg', 0.92)
}

export default function PhotoCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop]         = useState({ x: 0, y: 0 })
  const [zoom, setZoom]         = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedArea) return
    const base64 = await getCroppedImg(imageSrc, croppedArea)
    onConfirm(base64)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 to-purple-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Crop Photo</h2>
            <p className="text-purple-300 text-sm">Drag and pinch to frame your photo</p>
          </div>
          <button
            onClick={onCancel}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full bg-gray-900" style={{ height: 320 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
          <ZoomOut className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-purple-600 cursor-pointer h-1.5 rounded-full"
          />
          <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

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
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
                       bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>

      </div>
    </div>
  )
}
