/**
 * lib/composite.ts
 * 
 * Utility to merge the user photo and the diagonal line image into a single 
 * "composite" image for the Light template. This is the only bulletproof way 
 * to ensure Gmail/Outlook don't mangle the layout.
 */

export async function createLightComposite(
  photoBase64: string | null,
  lineImageUrl: string = '/line.png'
): Promise<string> {
  // 1. Create a 145 x 250 canvas (tall enough to touch top/bottom even if text spans many rows)
  const CANVAS_W = 145
  const CANVAS_H = 250
  const PHOTO_SIZE = 120
  const PHOTO_RADIUS = PHOTO_SIZE / 2

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')!

  // 2. Load the line image
  const lineImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load line image'))
    img.src = lineImageUrl
  })

  // 3. Draw the line image as background
  // We want it to cover the canvas (like object-fit: cover)
  const lineRatio = lineImg.width / lineImg.height
  const canvasRatio = CANVAS_W / CANVAS_H

  let drawW, drawH, drawX, drawY
  if (lineRatio > canvasRatio) {
    drawH = CANVAS_H
    drawW = CANVAS_H * lineRatio
    drawX = (CANVAS_W - drawW) / 2
    drawY = 0
  } else {
    drawW = CANVAS_W
    drawH = CANVAS_W / lineRatio
    drawX = 0
    drawY = (CANVAS_H - drawH) / 2
  }
  ctx.drawImage(lineImg, drawX, drawY, drawW, drawH)

  // 4. Draw the user photo (or gray circle)
  const centerX = CANVAS_W / 2
  const centerY = CANVAS_H / 2

  if (photoBase64) {
    const photoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load photo'))
      img.src = photoBase64
    })

    // Create a circular clipping path
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, PHOTO_RADIUS, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    // Draw the photo inside the circle
    ctx.drawImage(
      photoImg,
      centerX - PHOTO_RADIUS,
      centerY - PHOTO_RADIUS,
      PHOTO_SIZE,
      PHOTO_SIZE
    )
    ctx.restore()
  } else {
    // Default gray circle if no photo
    ctx.beginPath()
    ctx.arc(centerX, centerY, PHOTO_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = '#cccccc'
    ctx.fill()
    ctx.closePath()
  }

  // 5. Export as PNG (transparency is nice if needed, though background is white)
  return canvas.toDataURL('image/png')
}
