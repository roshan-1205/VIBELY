/**
 * Robot customization system for manual user preferences
 */

export interface RobotCustomization {
  // Colors
  bodyColor: string
  accentColor: string
  eyeColor: string
  lightingColor: string
  
  // Body Structure
  bodyType: 'slim' | 'athletic' | 'bulky' | 'compact'
  headSize: number // 0.5 to 2.0
  bodyHeight: number // 0.5 to 2.0
  armLength: number // 0.5 to 2.0
  legLength: number // 0.5 to 2.0
  
  // Materials & Effects
  metalness: number // 0 to 1
  roughness: number // 0 to 1
  emissiveIntensity: number // 0 to 1
  glowEffect: boolean
  
  // Animation & Pose
  pose: 'standing' | 'sitting' | 'waving' | 'thinking' | 'dancing'
  animationSpeed: number // 0.1 to 2.0
  
  // Accessories
  helmet: boolean
  visor: boolean
  armor: boolean
  cape: boolean
  
  // Environment
  backgroundType: 'gradient' | 'space' | 'city' | 'nature' | 'abstract'
  lightingIntensity: number // 0.1 to 2.0
  
  // Advanced
  wireframe: boolean
  transparency: number // 0 to 1
  outline: boolean
}

export const getDefaultCustomization = (): RobotCustomization => ({
  // Colors
  bodyColor: '#8B5CF6',
  accentColor: '#EC4899',
  eyeColor: '#06B6D4',
  lightingColor: '#F59E0B',
  
  // Body Structure
  bodyType: 'athletic',
  headSize: 1.0,
  bodyHeight: 1.0,
  armLength: 1.0,
  legLength: 1.0,
  
  // Materials & Effects
  metalness: 0.3,
  roughness: 0.4,
  emissiveIntensity: 0.2,
  glowEffect: false,
  
  // Animation & Pose
  pose: 'standing',
  animationSpeed: 1.0,
  
  // Accessories
  helmet: false,
  visor: false,
  armor: false,
  cape: false,
  
  // Environment
  backgroundType: 'gradient',
  lightingIntensity: 1.0,
  
  // Advanced
  wireframe: false,
  transparency: 0.0,
  outline: false
})

export const bodyTypePresets = {
  slim: {
    headSize: 0.9,
    bodyHeight: 1.2,
    armLength: 1.1,
    legLength: 1.2,
    metalness: 0.1,
    roughness: 0.6
  },
  athletic: {
    headSize: 1.0,
    bodyHeight: 1.0,
    armLength: 1.0,
    legLength: 1.0,
    metalness: 0.3,
    roughness: 0.4
  },
  bulky: {
    headSize: 1.1,
    bodyHeight: 0.9,
    armLength: 0.9,
    legLength: 0.9,
    metalness: 0.6,
    roughness: 0.2
  },
  compact: {
    headSize: 1.2,
    bodyHeight: 0.8,
    armLength: 0.8,
    legLength: 0.8,
    metalness: 0.4,
    roughness: 0.3
  }
}

export const colorPresets = {
  classic: {
    bodyColor: '#8B5CF6',
    accentColor: '#EC4899',
    eyeColor: '#06B6D4',
    lightingColor: '#F59E0B'
  },
  neon: {
    bodyColor: '#10B981',
    accentColor: '#F59E0B',
    eyeColor: '#EF4444',
    lightingColor: '#8B5CF6'
  },
  stealth: {
    bodyColor: '#374151',
    accentColor: '#6B7280',
    eyeColor: '#EF4444',
    lightingColor: '#9CA3AF'
  },
  gold: {
    bodyColor: '#F59E0B',
    accentColor: '#FBBF24',
    eyeColor: '#FCD34D',
    lightingColor: '#F97316'
  },
  ice: {
    bodyColor: '#06B6D4',
    accentColor: '#0EA5E9',
    eyeColor: '#38BDF8',
    lightingColor: '#0284C7'
  },
  fire: {
    bodyColor: '#EF4444',
    accentColor: '#F97316',
    eyeColor: '#FBBF24',
    lightingColor: '#DC2626'
  }
}

export const saveCustomization = (userId: string, customization: RobotCustomization) => {
  try {
    localStorage.setItem(`vibely_robot_customization_${userId}`, JSON.stringify(customization))
    console.log('Robot customization saved for user:', userId)
  } catch (error) {
    console.error('Error saving robot customization:', error)
  }
}

export const loadCustomization = (userId: string): RobotCustomization => {
  try {
    const saved = localStorage.getItem(`vibely_robot_customization_${userId}`)
    if (saved) {
      return { ...getDefaultCustomization(), ...JSON.parse(saved) }
    }
  } catch (error) {
    console.error('Error loading robot customization:', error)
  }
  return getDefaultCustomization()
}

export const applyBodyTypePreset = (customization: RobotCustomization, bodyType: keyof typeof bodyTypePresets): RobotCustomization => {
  const preset = bodyTypePresets[bodyType]
  return {
    ...customization,
    bodyType,
    ...preset
  }
}

export const applyColorPreset = (customization: RobotCustomization, presetName: keyof typeof colorPresets): RobotCustomization => {
  const preset = colorPresets[presetName]
  return {
    ...customization,
    ...preset
  }
}