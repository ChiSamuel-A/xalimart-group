'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { X, Check, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'

interface Props {
  imageSrc: string
  onConfirm: (imageUrl: string) => void // Now expects the uploaded URL
  onCancel: () => void
}

// Helper: Converts the cropped area into a Blob (File) instead of Base64
async function getCroppedImg(imageSrc: string, cropPixels: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = imageSrc
  })
  
  const canvas = document.createElement('canvas')
  // 320×360 = 2× the 160×180 display size (Retina-ready) with exact portrait ratio.
  canvas.width  = 320
  canvas.height = 360
  const ctx = canvas.getContext('2d')!

  // Rounded-corner clip — baked into the PNG so corners work in Outlook too.
  const r = 23
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(320 - r, 0)
  ctx.quadraticCurveTo(320, 0, 320, r)
  ctx.lineTo(320, 360 - r)
  ctx.quadraticCurveTo(320, 360, 320 - r, 360)
  ctx.lineTo(r, 360)
  ctx.quadraticCurveTo(0, 360, 0, 360 - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.clip()

  ctx.drawImage(
    image,
    cropPixels.x, cropPixels.y,
    cropPixels.width, cropPixels.height,
    0, 0,
    320, 360
  )
  
  // Convert canvas to a File/Blob instead of Base64
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'))
      resolve(blob)
    }, 'image/png', 1) // 1 = maximum quality
  })
}

export default function PhotoCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  
  // State to manage the loading spinner while uploading
  const [isUploading, setIsUploading] = useState(false)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  },[])

  const handleConfirm = async () => {
    if (!croppedArea) return
    
    try {
      setIsUploading(true)
      
      // 1. Get the image as a file Blob
      const imageBlob = await getCroppedImg(imageSrc, croppedArea)
      
      // 2. Prepare it for upload
      const formData = new FormData()
      // Generate a unique filename using timestamp
      formData.append('file', imageBlob, `profile-${Date.now()}.png`)

      // 3. Send it to your backend API endpoint
      // Replace '/api/upload' with your actual upload endpoint route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      // 4. Get the URL from the response
      const data = await response.json()
      
      // 5. Pass the secure, hosted URL back to the parent component
      onConfirm(data.url) 
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('There was an error uploading your image. Please try again.')
    } finally {
      setIsUploading(false)
    }
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
            disabled={isUploading}
            className="text-purple-300 hover:text-white transition-colors disabled:opacity-50"
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
            aspect={320 / 360}
            cropShape="rect"
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
            disabled={isUploading}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-purple-600 cursor-pointer h-1.5 rounded-full disabled:opacity-50"
          />
          <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3 justify-end bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800
                       border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          {/* Apply Button changes to loading state when uploading */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white
                       bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors disabled:bg-purple-400 min-w-[100px] justify-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Apply
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}