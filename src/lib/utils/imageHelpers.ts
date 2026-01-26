const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const TARGET_MAX_WIDTH = 800
const TARGET_MAX_HEIGHT = 800
const COMPRESSION_QUALITY = 0.7

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image must be less than 5MB' }
  }

  return { valid: true }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = base64
  })
}

export function compressImage(base64: string, maxWidth = TARGET_MAX_WIDTH, maxHeight = TARGET_MAX_HEIGHT, quality = COMPRESSION_QUALITY): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to JPEG for better compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = base64
  })
}

export async function fileToCompressedBase64(file: File): Promise<string> {
  const base64 = await fileToBase64(file)
  return compressImage(base64)
}
