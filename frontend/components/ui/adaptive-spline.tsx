'use client'

import { Suspense, lazy, useEffect, useState, useRef } from 'react'
import { extractColorsFromImage, generateRobotTheme, getDefaultRobotTheme, type RobotTheme } from '@/lib/colorAnalysis'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface AdaptiveSplineSceneProps {
  scene: string
  className?: string
  profileImage?: string | null
  userId?: string
  debug?: boolean
}

export function AdaptiveSplineScene({ scene, className, profileImage, userId, debug = false }: AdaptiveSplineSceneProps) {
  const [robotTheme, setRobotTheme] = useState<RobotTheme>(getDefaultRobotTheme())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const splineRef = useRef<any>(null)
  const [splineApp, setSplineApp] = useState<any>(null)

  // Analyze profile image and generate robot theme
  useEffect(() => {
    if (profileImage && userId) {
      setIsAnalyzing(true)
      
      extractColorsFromImage(profileImage)
        .then(palette => {
          const theme = generateRobotTheme(palette)
          setRobotTheme(theme)
          
          // Store theme for this user
          localStorage.setItem(`vibely_robot_theme_${userId}`, JSON.stringify(theme))
          
          console.log('Generated robot theme from profile image:', theme)
        })
        .catch(error => {
          console.error('Error analyzing profile image:', error)
          // Use default theme on error
          setRobotTheme(getDefaultRobotTheme())
        })
        .finally(() => {
          setIsAnalyzing(false)
        })
    } else if (userId) {
      // Try to load saved theme for this user
      const savedTheme = localStorage.getItem(`vibely_robot_theme_${userId}`)
      if (savedTheme) {
        try {
          setRobotTheme(JSON.parse(savedTheme))
        } catch (error) {
          console.error('Error loading saved robot theme:', error)
          setRobotTheme(getDefaultRobotTheme())
        }
      } else {
        setRobotTheme(getDefaultRobotTheme())
      }
    }
  }, [profileImage, userId])

  // Apply theme to Spline scene when it loads
  useEffect(() => {
    if (splineApp && robotTheme) {
      applyThemeToRobot(splineApp, robotTheme)
    }
  }, [splineApp, robotTheme])

  const onLoad = (spline: any) => {
    setSplineApp(spline)
    splineRef.current = spline
    
    // Apply theme immediately if available
    if (robotTheme) {
      applyThemeToRobot(spline, robotTheme)
    }
  }

  const applyThemeToRobot = (spline: any, theme: RobotTheme) => {
    try {
      console.log('Applying robot theme:', theme)
      console.log('Spline app:', spline)
      
      // Get all objects in the scene
      const allObjects = spline.getAllObjects ? spline.getAllObjects() : []
      console.log('All objects in scene:', allObjects.map((obj: any) => obj.name || obj.type))
      
      // More comprehensive search for robot parts
      const findAndColorObjects = (searchTerms: string[], color: string, isEmissive = false, partType = 'general') => {
        let foundObjects = 0
        
        // Try different methods to find objects
        searchTerms.forEach(term => {
          // Method 1: Direct name search
          try {
            const obj = spline.findObjectByName(term)
            if (obj) {
              applyColorToObject(obj, color, isEmissive, partType, theme)
              foundObjects++
              console.log(`Applied color to object: ${term}`)
            }
          } catch (e) {
            // Ignore errors for non-existent objects
          }
          
          // Method 2: Search through all objects
          if (allObjects.length > 0) {
            allObjects.forEach((obj: any) => {
              if (obj.name && obj.name.toLowerCase().includes(term.toLowerCase())) {
                applyColorToObject(obj, color, isEmissive, partType, theme)
                foundObjects++
                console.log(`Applied color to found object: ${obj.name}`)
              }
            })
          }
        })
        
        return foundObjects
      }
      
      // Apply colors to different parts with more search terms and skin variations
      const bodyTerms = [
        'body', 'torso', 'chest', 'robot', 'main', 'character', 'figure', 'skin',
        'Robot_Body', 'Robot_Head', 'Robot_Arms', 'Robot_Legs', 'Robot_Chest',
        'Body', 'Head', 'Arms', 'Legs', 'Torso', 'Mesh', 'Geometry', 'Face'
      ]
      
      const accentTerms = [
        'accent', 'detail', 'panel', 'stripe', 'decoration', 'clothing', 'armor',
        'Robot_Accents', 'Robot_Details', 'Robot_Panels', 'Clothes', 'Outfit'
      ]
      
      const eyeTerms = [
        'eye', 'eyes', 'visor', 'lens', 'light', 'glow', 'pupil',
        'Robot_Eyes', 'Robot_Eye_Left', 'Robot_Eye_Right', 'Robot_Visor',
        'Eyes', 'Eye_Left', 'Eye_Right', 'Visor', 'Lights', 'Pupils'
      ]
      
      // Apply skin-like colors with variations
      const bodyCount = findAndColorObjects(bodyTerms, theme.bodyColor, false, 'skin')
      const accentCount = findAndColorObjects(accentTerms, theme.accentColor, false, 'accent')
      const eyeCount = findAndColorObjects(eyeTerms, theme.eyeColor, true, 'eyes')
      
      console.log(`Colored objects - Body: ${bodyCount}, Accents: ${accentCount}, Eyes: ${eyeCount}`)
      
      // If no specific objects found, try to color all mesh objects with skin-like approach
      if (bodyCount === 0 && allObjects.length > 0) {
        console.log('No specific objects found, applying skin-like colors to all meshes')
        allObjects.forEach((obj: any, index: number) => {
          if (obj.type === 'Mesh' || obj.geometry || obj.material) {
            let colorToUse = theme.bodyColor
            let partType = 'skin'
            let isEmissive = false
            
            // Distribute colors based on object index for variety
            if (index % 4 === 1) {
              colorToUse = theme.skinVariations?.warm || theme.accentColor
              partType = 'accent'
            } else if (index % 4 === 2) {
              colorToUse = theme.eyeColor
              partType = 'eyes'
              isEmissive = true
            } else if (index % 4 === 3) {
              colorToUse = theme.skinVariations?.highlight || theme.bodyColor
              partType = 'skin'
            }
            
            applyColorToObject(obj, colorToUse, isEmissive, partType, theme)
            console.log(`Applied ${partType} color to mesh ${index}: ${obj.name || 'unnamed'}`)
          }
        })
      }
      
      // Update environment and lighting
      updateSceneLighting(spline, theme)
      
    } catch (error) {
      console.error('Error applying theme to robot:', error)
    }
  }
  
  const applyColorToObject = (obj: any, hexColor: string, isEmissive = false, partType = 'general', theme?: any) => {
    try {
      if (!obj) return
      
      // Convert hex to RGB values (0-1 range)
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      // Apply to material if it exists
      if (obj.material) {
        // Set main color
        if (obj.material.color) {
          if (obj.material.color.setRGB) {
            obj.material.color.setRGB(r, g, b)
          } else if (obj.material.color.set) {
            obj.material.color.set(hexColor)
          } else {
            obj.material.color = { r, g, b }
          }
        }
        
        // Apply skin-like properties for body parts
        if (partType === 'skin' && theme?.skinVariations) {
          // Add subsurface scattering effect for realistic skin
          if (obj.material.subsurfaceScattering !== undefined) {
            obj.material.subsurfaceScattering = 0.3
          }
          
          // Set skin-appropriate material properties
          if (obj.material.metalness !== undefined) {
            obj.material.metalness = 0.0 // Skin is not metallic
          }
          if (obj.material.roughness !== undefined) {
            obj.material.roughness = 0.8 // Skin has some roughness
          }
          
          // Add subtle skin variations using normal maps or bump maps
          if (obj.material.bumpScale !== undefined) {
            obj.material.bumpScale = 0.1
          }
        }
        
        // Set emissive properties for glowing effects (eyes, lights)
        if (isEmissive && obj.material.emissive) {
          if (obj.material.emissive.setRGB) {
            obj.material.emissive.setRGB(r * 0.5, g * 0.5, b * 0.5)
          }
          if (obj.material.emissiveIntensity !== undefined) {
            obj.material.emissiveIntensity = partType === 'eyes' ? 0.8 : 0.4
          }
        }
        
        // Enhance material properties based on part type
        if (!isEmissive) {
          if (obj.material.metalness !== undefined) {
            obj.material.metalness = partType === 'skin' ? 0.0 : 0.3
          }
          if (obj.material.roughness !== undefined) {
            obj.material.roughness = partType === 'skin' ? 0.8 : 0.5
          }
        }
        
        // Force material update
        if (obj.material.needsUpdate !== undefined) {
          obj.material.needsUpdate = true
        }
      }
      
      // Apply to children if they exist
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((child: any) => {
          applyColorToObject(child, hexColor, isEmissive, partType, theme)
        })
      }
      
    } catch (error) {
      console.error('Error applying color to object:', error)
    }
  }
  
  const updateSceneLighting = (spline: any, theme: RobotTheme) => {
    try {
      const scene = spline.scene
      if (!scene || !scene.children) return
      
      // Find and update lights
      const updateLights = (objects: any[]) => {
        objects.forEach((obj: any) => {
          if (obj.type && (obj.type.includes('Light') || obj.isLight)) {
            if (obj.color) {
              const hex = theme.lightingColor.replace('#', '')
              const r = parseInt(hex.substr(0, 2), 16) / 255
              const g = parseInt(hex.substr(2, 2), 16) / 255
              const b = parseInt(hex.substr(4, 2), 16) / 255
              
              if (obj.color.setRGB) {
                obj.color.setRGB(r, g, b)
              } else if (obj.color.set) {
                obj.color.set(theme.lightingColor)
              }
            }
          }
          
          if (obj.children && obj.children.length > 0) {
            updateLights(obj.children)
          }
        })
      }
      
      updateLights(scene.children)
      
    } catch (error) {
      console.error('Error updating scene lighting:', error)
    }
  }

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <span className="text-sm text-gray-500">Loading 3D Scene...</span>
          </div>
        </div>
      }>
        <Spline
          scene={scene}
          className={className}
          onLoad={onLoad}
        />
      </Suspense>
      
      {/* Debug Information */}
      {debug && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-semibold mb-2">Debug Info:</div>
          <div>Profile Image: {profileImage ? '✓' : '✗'}</div>
          <div>User ID: {userId || 'None'}</div>
          <div>Theme: {robotTheme ? '✓' : '✗'}</div>
          <div>Spline App: {splineApp ? '✓' : '✗'}</div>
          <div>Analyzing: {isAnalyzing ? '✓' : '✗'}</div>
          {robotTheme && (
            <div className="mt-2">
              <div>Body: {robotTheme.bodyColor}</div>
              <div>Accent: {robotTheme.accentColor}</div>
              <div>Eyes: {robotTheme.eyeColor}</div>
            </div>
          )}
        </div>
      )}
      
      {/* Theme Analysis Indicator - Subtle and brief */}
      {isAnalyzing && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-2 opacity-80">
          <div className="animate-spin rounded-full h-2 w-2 border border-white border-t-transparent"></div>
          Updating...
        </div>
      )}
      
      {/* Theme Preview - Only show in debug mode */}
      {debug && robotTheme && (
        <div className="absolute bottom-4 left-4 flex gap-1">
          <div 
            className="w-3 h-3 rounded-full border border-white/30" 
            style={{ backgroundColor: robotTheme.bodyColor }}
            title="Body Color"
          />
          <div 
            className="w-3 h-3 rounded-full border border-white/30" 
            style={{ backgroundColor: robotTheme.accentColor }}
            title="Accent Color"
          />
          <div 
            className="w-3 h-3 rounded-full border border-white/30" 
            style={{ backgroundColor: robotTheme.eyeColor }}
            title="Eye Color"
          />
        </div>
      )}
    </div>
  )
}

// Hook for managing robot themes
export const useRobotTheme = (userId?: string) => {
  const [theme, setTheme] = useState<RobotTheme>(getDefaultRobotTheme())

  const updateTheme = (newTheme: RobotTheme) => {
    setTheme(newTheme)
    if (userId) {
      localStorage.setItem(`vibely_robot_theme_${userId}`, JSON.stringify(newTheme))
    }
  }

  const resetTheme = () => {
    const defaultTheme = getDefaultRobotTheme()
    setTheme(defaultTheme)
    if (userId) {
      localStorage.removeItem(`vibely_robot_theme_${userId}`)
    }
  }

  useEffect(() => {
    if (userId) {
      const savedTheme = localStorage.getItem(`vibely_robot_theme_${userId}`)
      if (savedTheme) {
        try {
          setTheme(JSON.parse(savedTheme))
        } catch (error) {
          console.error('Error loading robot theme:', error)
        }
      }
    }
  }, [userId])

  return { theme, updateTheme, resetTheme }
}