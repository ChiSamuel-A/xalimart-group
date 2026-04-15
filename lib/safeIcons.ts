import type { SignatureImages } from '@/types/signature'

/**
 * lib/safeIcons.ts
 * 
 * Utility to "glow-ify" icons. It takes a transparent icon and adds a 
 * 1px white stroke/glow around it using Canvas. This ensures black 
 * icons stay visible on dark backgrounds in any email client.
 */

export async function makeIconSafe(iconUrl: string): Promise<string> {
  // 1. Fetch and load the image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.crossOrigin = 'anonymous' // Critical for hosted images
    i.onload = () => resolve(i)
    i.onerror = () => reject(new Error(`Failed to load icon: ${iconUrl}`))
    i.src = iconUrl
  })

  // 2. Create a canvas slightly larger than the icon to allow for the glow
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  const padding = 2
  canvas.width = img.width + padding * 2
  canvas.height = img.height + padding * 2

  // 3. Draw the "Glow" (White outline)
  // We draw the icon in white at 4 offsets to create a 1px stroke
  ctx.shadowColor = '#ffffff'
  ctx.shadowBlur = 1
  
  const offsets = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = img.width
  tempCanvas.height = img.height
  const tCtx = tempCanvas.getContext('2d')!
  tCtx.drawImage(img, 0, 0)
  tCtx.globalCompositeOperation = 'source-in'
  tCtx.fillStyle = '#ffffff'
  tCtx.fillRect(0, 0, img.width, img.height)

  offsets.forEach(([x, y]) => {
    ctx.drawImage(tempCanvas, padding + x, padding + y)
  })

  // 4. Draw the original icon (Black) on top
  ctx.shadowBlur = 0 
  ctx.drawImage(img, padding, padding)

  // 5. Return as Base64 PNG
  return canvas.toDataURL('image/png')
}

/**
 * Process an entire SignatureImages object to make all icons safe.
 */
export async function processAllImages(images: SignatureImages): Promise<SignatureImages> {
  const safeImages = { ...images }
  const iconKeys = (Object.keys(images) as Array<keyof SignatureImages>).filter(k => 
    (k.toLowerCase().includes('icon') || 
    k.toLowerCase().includes('wh') || 
    k.toLowerCase().includes('bl') ||
    ['instagramWh', 'facebookWh', 'linkedinWh', 'instagramBl', 'facebookBl', 'linkedinBl', 'locationBlack', 'locationWhite'].includes(k)) &&
    !k.toLowerCase().includes('line')
  )

  for (const key of iconKeys) {
    try {
      const iconUrl = images[key]
      if (typeof iconUrl === 'string' && (iconUrl.includes('.png') || iconUrl.startsWith('data:image'))) {
        safeImages[key] = await makeIconSafe(iconUrl)
      }
    } catch (err) {
      console.warn(`Could not make icon safe: ${key}`, err)
    }
  }

  return safeImages
}
