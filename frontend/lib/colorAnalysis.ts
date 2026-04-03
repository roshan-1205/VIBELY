/**
 * Color analysis utilities for extracting dominant colors from images
 * and generating robot appearance themes
 */

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface RobotTheme {
  bodyColor: string
  accentColor: string
  eyeColor: string
  backgroundGradient: string[]
  lightingColor: string
  skinVariations?: {
    base: string
    highlight: string
    shadow: string
    warm: string
    cool: string
  }
}

/**
 * Extract dominant colors from an image using canvas with enhanced skin tone detection
 */
export const extractColorsFromImage = (imageUrl: string): Promise<ColorPalette> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Set canvas size for better analysis
        canvas.width = 150
        canvas.height = 150
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, 150, 150)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, 150, 150)
        const data = imageData.data
        
        // Analyze colors with focus on skin tones and prominent colors
        const colors: number[][] = []
        const skinTones: number[][] = []
        
        // Sample pixels more densely for better color detection
        for (let i = 0; i < data.length; i += 8) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          
          // Skip transparent pixels
          if (a < 128) continue
          
          // Skip very dark or very light pixels
          const brightness = (r + g + b) / 3
          if (brightness < 20 || brightness > 240) continue
          
          colors.push([r, g, b])
          
          // Detect potential skin tones
          if (isSkinTone(r, g, b)) {
            skinTones.push([r, g, b])
          }
        }
        
        console.log(`Analyzed ${colors.length} colors, found ${skinTones.length} skin tones`)
        
        // Find dominant colors using improved clustering
        const dominantColors = findDominantColors(colors, 6)
        
        // Generate color palette with skin tone preference
        const palette = generateColorPalette(dominantColors, skinTones)
        
        console.log('Generated color palette:', palette)
        resolve(palette)
        
      } catch (error) {
        console.error('Color extraction error:', error)
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageUrl
  })
}

/**
 * Detect if a color is likely a skin tone
 */
const isSkinTone = (r: number, g: number, b: number): boolean => {
  // Enhanced skin tone detection algorithm
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  
  // Basic skin tone rules
  if (r > 95 && g > 40 && b > 20 && 
      max - min > 15 && 
      Math.abs(r - g) > 15 && 
      r > g && r > b) {
    return true
  }
  
  // Additional skin tone ranges
  const hsl = rgbToHsl(r, g, b)
  const hue = hsl[0]
  const saturation = hsl[1]
  const lightness = hsl[2]
  
  // Skin tone hue range (0-50 degrees, warm tones)
  if ((hue >= 0 && hue <= 50) && 
      saturation >= 0.2 && saturation <= 0.8 && 
      lightness >= 0.2 && lightness <= 0.9) {
    return true
  }
  
  return false
}

/**
 * Find dominant colors using simplified clustering
 */
const findDominantColors = (colors: number[][], k: number): number[][] => {
  if (colors.length === 0) return []
  if (colors.length <= k) return colors
  
  // Simple k-means clustering
  let centroids = colors.slice(0, k)
  
  for (let iteration = 0; iteration < 10; iteration++) {
    const clusters: number[][][] = Array(k).fill(null).map(() => [])
    
    // Assign colors to nearest centroid
    colors.forEach(color => {
      let minDistance = Infinity
      let closestCentroid = 0
      
      centroids.forEach((centroid, index) => {
        const distance = Math.sqrt(
          Math.pow(color[0] - centroid[0], 2) +
          Math.pow(color[1] - centroid[1], 2) +
          Math.pow(color[2] - centroid[2], 2)
        )
        
        if (distance < minDistance) {
          minDistance = distance
          closestCentroid = index
        }
      })
      
      clusters[closestCentroid].push(color)
    })
    
    // Update centroids
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0] // Fallback
      
      const avgR = cluster.reduce((sum, color) => sum + color[0], 0) / cluster.length
      const avgG = cluster.reduce((sum, color) => sum + color[1], 0) / cluster.length
      const avgB = cluster.reduce((sum, color) => sum + color[2], 0) / cluster.length
      
      return [Math.round(avgR), Math.round(avgG), Math.round(avgB)]
    })
  }
  
  return centroids
}

/**
 * Generate a color palette from dominant colors with skin tone preference
 */
const generateColorPalette = (dominantColors: number[][], skinTones: number[][] = []): ColorPalette => {
  if (dominantColors.length === 0) {
    // Fallback palette
    return {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#06B6D4',
      background: '#1E1B4B',
      text: '#F8FAFC'
    }
  }
  
  // Prioritize skin tones for primary color if available
  let primaryColor = dominantColors[0]
  if (skinTones.length > 0) {
    // Use the most common skin tone
    primaryColor = skinTones[0]
    console.log('Using skin tone as primary color:', primaryColor)
  }
  
  // Sort remaining colors by vibrancy and brightness
  const sortedColors = dominantColors
    .filter(color => color !== primaryColor)
    .sort((a, b) => {
      const vibrancyA = getColorVibrancy(a)
      const vibrancyB = getColorVibrancy(b)
      return vibrancyB - vibrancyA
    })
  
  const toHex = (rgb: number[]) => 
    `#${rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`
  
  // Create harmonious palette
  const palette = {
    primary: toHex(primaryColor),
    secondary: toHex(sortedColors[0] || adjustColorHarmony(primaryColor, 60)),
    accent: toHex(sortedColors[1] || adjustColorHarmony(primaryColor, 120)),
    background: toHex(adjustBrightness(primaryColor, -0.8)),
    text: '#F8FAFC'
  }
  
  console.log('Generated palette:', palette)
  return palette
}

/**
 * Calculate color vibrancy (saturation * brightness)
 */
const getColorVibrancy = (rgb: number[]): number => {
  const [r, g, b] = rgb.map(c => c / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max === 0 ? 0 : (max - min) / max
  const brightness = max
  return saturation * brightness
}

/**
 * Adjust color harmony by shifting hue
 */
const adjustColorHarmony = (rgb: number[], hueDegrees: number): number[] => {
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])
  hsl[0] = (hsl[0] + hueDegrees) % 360
  return hslToRgb(hsl[0], hsl[1], hsl[2])
}

/**
 * Adjust color brightness
 */
const adjustBrightness = (rgb: number[], factor: number): number[] => {
  return rgb.map(c => Math.max(0, Math.min(255, Math.round(c * (1 + factor)))))
}

/**
 * Generate robot theme from color palette with skin-like properties
 */
export const generateRobotTheme = (palette: ColorPalette): RobotTheme => {
  // Create skin-like variations of the primary color
  const skinColor = palette.primary
  const skinVariation1 = adjustColorTemperature(skinColor, 10) // Slightly warmer
  const skinVariation2 = adjustColorTemperature(skinColor, -10) // Slightly cooler
  
  return {
    bodyColor: skinColor, // Main skin color
    accentColor: skinVariation1, // Warmer skin tone for accents
    eyeColor: palette.accent, // Contrasting eye color
    backgroundGradient: [
      palette.background, 
      adjustColorHue(palette.background, 30)
    ],
    lightingColor: adjustColorTemperature(palette.accent, 20), // Warm lighting
    skinVariations: {
      base: skinColor,
      highlight: adjustBrightness(hexToRgb(skinColor) || [139, 92, 246], 0.2),
      shadow: adjustBrightness(hexToRgb(skinColor) || [139, 92, 246], -0.3),
      warm: skinVariation1,
      cool: skinVariation2
    }
  }
}

/**
 * Adjust color temperature (warmer/cooler)
 */
const adjustColorTemperature = (hexColor: string, temperature: number): string => {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  // Positive temperature = warmer (more red/yellow)
  // Negative temperature = cooler (more blue)
  const factor = temperature / 100
  
  let { r, g, b } = rgb
  
  if (temperature > 0) {
    // Warmer - increase red and yellow
    r = Math.min(255, r + (factor * 50))
    g = Math.min(255, g + (factor * 30))
  } else {
    // Cooler - increase blue
    b = Math.min(255, b + (Math.abs(factor) * 50))
  }
  
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
}

/**
 * Adjust color hue
 */
const adjustColorHue = (hexColor: string, degrees: number): string => {
  // Convert hex to HSL, adjust hue, convert back
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl[0] = (hsl[0] + degrees) % 360
  
  const newRgb = hslToRgb(hsl[0], hsl[1], hsl[2])
  return `#${newRgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`
}

/**
 * Convert hex to RGB
 */
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to HSL
 */
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return [h * 360, s, l]
}

/**
 * Convert HSL to RGB
 */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return [r * 255, g * 255, b * 255]
}

/**
 * Generate default robot theme
 */
export const getDefaultRobotTheme = (): RobotTheme => {
  return {
    bodyColor: '#8B5CF6',
    accentColor: '#EC4899',
    eyeColor: '#06B6D4',
    backgroundGradient: ['#1E1B4B', '#312E81'],
    lightingColor: '#06B6D4'
  }
}