'use client'

import { Suspense, lazy, useEffect, useState, useRef } from 'react'
import { RobotCustomization, getDefaultCustomization } from '@/lib/robotCustomization'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface CustomizableSplineSceneProps {
  scene: string
  className?: string
  customization?: RobotCustomization
  userId?: string
  debug?: boolean
}

export function CustomizableSplineScene({ 
  scene, 
  className, 
  customization = getDefaultCustomization(), 
  userId, 
  debug = false 
}: CustomizableSplineSceneProps) {
  const [isApplying, setIsApplying] = useState(false)
  const splineRef = useRef<any>(null)
  const [splineApp, setSplineApp] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Apply customization when it changes
  useEffect(() => {
    if (splineApp && customization) {
      setIsApplying(true)
      applyCustomizationToRobot(splineApp, customization)
      setTimeout(() => setIsApplying(false), 2000)
    }
  }, [splineApp, customization])

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev.slice(-4), info])
    console.log('Spline Debug:', info)
  }

  const onLoad = (spline: any) => {
    console.log('Spline loaded:', spline)
    setSplineApp(spline)
    splineRef.current = spline
    
    addDebugInfo('Spline scene loaded')
    
    // Wait a bit for scene to fully initialize
    setTimeout(() => {
      if (customization) {
        applyCustomizationToRobot(spline, customization)
      }
    }, 1000)
  }

  const applyCustomizationToRobot = (spline: any, custom: RobotCustomization) => {
    try {
      addDebugInfo('Starting customization application')
      console.log('Applying robot customization:', custom)
      console.log('Spline object methods:', Object.getOwnPropertyNames(spline))
      
      // Wait a bit more for scene to be ready
      setTimeout(() => {
        try {
          // Method 1: Try Spline's built-in methods first
          if (spline.setVariable) {
            addDebugInfo('Trying Spline variables method')
            applyViaSplineVariables(spline, custom)
          }
          
          // Method 2: Try direct object manipulation
          let allObjects: any[] = []
          
          // Get objects using multiple approaches
          if (spline.getAllObjects) {
            try {
              allObjects = spline.getAllObjects()
              addDebugInfo(`Found ${allObjects.length} objects via getAllObjects`)
            } catch (e) {
              addDebugInfo('getAllObjects failed: ' + e)
            }
          }
          
          // Try scene traversal
          if (spline.scene) {
            const sceneObjects = getAllChildrenRecursive([spline.scene])
            allObjects = allObjects.concat(sceneObjects)
            addDebugInfo(`Total objects after scene traversal: ${allObjects.length}`)
          }
          
          // Log object details for debugging
          const objectInfo = allObjects.slice(0, 10).map((obj: any) => ({
            name: obj.name || 'unnamed',
            type: obj.type || 'unknown',
            hasMaterial: !!obj.material,
            hasGeometry: !!obj.geometry,
            isMesh: obj.isMesh || false,
            isGroup: obj.isGroup || false
          }))
          console.log('Object details:', objectInfo)
          addDebugInfo(`Sample objects: ${JSON.stringify(objectInfo)}`)
          
          // Apply customizations
          if (allObjects.length > 0) {
            applyColorsAndMaterials(spline, allObjects, custom)
            applyBodyStructure(spline, allObjects, custom)
            applyAccessories(spline, allObjects, custom)
          }
          
          // Apply environment and effects
          applyEnvironment(spline, custom)
          applyAdvancedEffects(spline, allObjects, custom)
          
          addDebugInfo('Customization completed')
          
        } catch (delayedError) {
          console.error('Delayed customization error:', delayedError)
          addDebugInfo(`Delayed error: ${delayedError}`)
        }
      }, 500)
      
    } catch (error) {
      console.error('Error applying robot customization:', error)
      addDebugInfo(`Error: ${error}`)
    }
  }

  const getAllChildrenRecursive = (children: any[]): any[] => {
    let result: any[] = []
    
    children.forEach((child: any) => {
      result.push(child)
      if (child.children && child.children.length > 0) {
        result = result.concat(getAllChildrenRecursive(child.children))
      }
    })
    
    return result
  }

  const applyViaSplineVariables = (spline: any, custom: RobotCustomization) => {
    try {
      addDebugInfo('Applying via Spline variables')
      
      // Try to set color variables that might exist in the Spline scene
      const colorVariables = [
        'bodyColor', 'robotColor', 'primaryColor', 'mainColor',
        'accentColor', 'secondaryColor', 'highlightColor',
        'eyeColor', 'glowColor', 'emissionColor'
      ]
      
      colorVariables.forEach(varName => {
        try {
          if (varName.includes('body') || varName.includes('robot') || varName.includes('primary') || varName.includes('main')) {
            spline.setVariable(varName, custom.bodyColor)
          } else if (varName.includes('accent') || varName.includes('secondary') || varName.includes('highlight')) {
            spline.setVariable(varName, custom.accentColor)
          } else if (varName.includes('eye') || varName.includes('glow') || varName.includes('emission')) {
            spline.setVariable(varName, custom.eyeColor)
          }
        } catch (e) {
          // Variable doesn't exist, continue
        }
      })
      
      // Try material property variables
      const materialVariables = [
        'metalness', 'roughness', 'emissive', 'opacity', 'transparency'
      ]
      
      materialVariables.forEach(varName => {
        try {
          if (varName === 'metalness') {
            spline.setVariable(varName, custom.metalness)
          } else if (varName === 'roughness') {
            spline.setVariable(varName, custom.roughness)
          } else if (varName === 'emissive') {
            spline.setVariable(varName, custom.emissiveIntensity)
          } else if (varName === 'opacity') {
            spline.setVariable(varName, 1 - custom.transparency)
          } else if (varName === 'transparency') {
            spline.setVariable(varName, custom.transparency)
          }
        } catch (e) {
          // Variable doesn't exist, continue
        }
      })
      
      addDebugInfo('Spline variables applied')
      
    } catch (error) {
      addDebugInfo(`Spline variables error: ${error}`)
    }
  }

  const applyColorsAndMaterials = (spline: any, allObjects: any[], custom: RobotCustomization) => {
    try {
      addDebugInfo('Applying colors and materials')
      
      let coloredCount = 0
      let materialCount = 0
      
      // Filter for mesh objects that likely have materials
      const meshObjects = allObjects.filter(obj => 
        obj.isMesh || 
        obj.type === 'Mesh' || 
        obj.material || 
        (obj.geometry && obj.geometry.material) ||
        obj.name?.toLowerCase().includes('robot') ||
        obj.name?.toLowerCase().includes('character') ||
        obj.name?.toLowerCase().includes('body')
      )
      
      addDebugInfo(`Found ${meshObjects.length} potential mesh objects`)
      
      meshObjects.forEach((obj: any, index: number) => {
        // Distribute colors across objects
        let color = custom.bodyColor
        let partType = 'body'
        
        // Try to identify part type by name
        if (obj.name) {
          const name = obj.name.toLowerCase()
          if (name.includes('eye') || name.includes('lens') || name.includes('light')) {
            color = custom.eyeColor
            partType = 'eyes'
          } else if (name.includes('accent') || name.includes('detail') || name.includes('trim')) {
            color = custom.accentColor
            partType = 'accent'
          } else if (index % 3 === 1) {
            color = custom.accentColor
            partType = 'accent'
          } else if (index % 3 === 2) {
            color = custom.eyeColor
            partType = 'eyes'
          }
        } else {
          // No name, distribute by index
          if (index % 3 === 1) {
            color = custom.accentColor
            partType = 'accent'
          } else if (index % 3 === 2) {
            color = custom.eyeColor
            partType = 'eyes'
          }
        }
        
        if (applyMaterialProperties(obj, color, custom, partType)) {
          coloredCount++
        }
      })
      
      // Also try direct object finding by common names
      const commonNames = [
        'Robot', 'Character', 'Figure', 'Body', 'Head', 'Torso', 'Chest',
        'Arms', 'Legs', 'Eyes', 'Face', 'Main', 'Primary', 'Mesh', 'Object'
      ]
      
      commonNames.forEach(name => {
        try {
          if (spline.findObjectByName) {
            const obj = spline.findObjectByName(name)
            if (obj && applyMaterialProperties(obj, custom.bodyColor, custom, 'body')) {
              materialCount++
            }
          }
        } catch (e) {
          // Ignore individual failures
        }
      })
      
      // Try to find objects by UUID or other methods
      if (spline.findObjectById) {
        // Try some common UUIDs or iterate through possible IDs
        for (let i = 0; i < 10; i++) {
          try {
            const obj = spline.findObjectById(i.toString())
            if (obj && applyMaterialProperties(obj, custom.bodyColor, custom, 'body')) {
              materialCount++
            }
          } catch (e) {
            // Continue
          }
        }
      }
      
      addDebugInfo(`Applied colors to ${coloredCount} mesh objects, ${materialCount} named objects`)
      
      // If still no success, try a brute force approach on all objects
      if (coloredCount === 0 && materialCount === 0) {
        addDebugInfo('Trying brute force color application')
        let bruteForceCount = 0
        
        allObjects.forEach((obj: any, index: number) => {
          if (obj && typeof obj === 'object') {
            const color = index % 2 === 0 ? custom.bodyColor : custom.accentColor
            if (applyMaterialPropertiesBruteForce(obj, color)) {
              bruteForceCount++
            }
          }
        })
        
        addDebugInfo(`Brute force applied to ${bruteForceCount} objects`)
      }
      
    } catch (error) {
      console.error('Error applying colors:', error)
      addDebugInfo(`Color error: ${error}`)
    }
  }

  const applyMaterialProperties = (obj: any, hexColor: string, custom: RobotCustomization, partType: string): boolean => {
    try {
      if (!obj) return false
      
      let applied = false
      
      // Convert hex to different formats
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      // Collect all possible materials
      const materials = []
      if (obj.material) materials.push(obj.material)
      if (obj.materials) materials.push(...obj.materials)
      if (obj.geometry?.material) materials.push(obj.geometry.material)
      if (obj.geometry?.materials) materials.push(...obj.geometry.materials)
      
      // Try to access materials through different paths
      if (obj.mesh?.material) materials.push(obj.mesh.material)
      if (obj.userData?.material) materials.push(obj.userData.material)
      
      materials.forEach((material: any) => {
        if (!material) return
        
        // Try multiple color setting approaches
        const colorMethods = [
          () => material.color?.setRGB?.(r, g, b),
          () => material.color?.set?.(hexColor),
          () => material.color?.setHex?.(parseInt(hex, 16)),
          () => material.color?.setStyle?.(hexColor),
          () => { if (material.color) { material.color.r = r; material.color.g = g; material.color.b = b } },
          () => { material.color = { r, g, b } },
          () => { material.diffuse?.setRGB?.(r, g, b) },
          () => { material.albedo?.setRGB?.(r, g, b) }
        ]
        
        for (const method of colorMethods) {
          try {
            method()
            applied = true
            break
          } catch (e) {
            // Try next method
          }
        }
        
        // Apply material properties with error handling
        try {
          if (material.metalness !== undefined) material.metalness = custom.metalness
          if (material.roughness !== undefined) material.roughness = custom.roughness
          
          // Apply emissive for glow effects
          if ((partType === 'eyes' || custom.glowEffect) && material.emissive) {
            const emissiveMethods = [
              () => material.emissive.setRGB?.(r * custom.emissiveIntensity, g * custom.emissiveIntensity, b * custom.emissiveIntensity),
              () => { material.emissive.r = r * custom.emissiveIntensity; material.emissive.g = g * custom.emissiveIntensity; material.emissive.b = b * custom.emissiveIntensity }
            ]
            
            for (const method of emissiveMethods) {
              try {
                method()
                break
              } catch (e) {
                // Try next method
              }
            }
          }
          
          if (material.emissiveIntensity !== undefined) {
            material.emissiveIntensity = custom.emissiveIntensity
          }
          
          // Apply transparency
          if (custom.transparency > 0) {
            if (material.opacity !== undefined) material.opacity = 1 - custom.transparency
            if (material.transparent !== undefined) material.transparent = custom.transparency > 0
          }
          
          // Apply wireframe
          if (material.wireframe !== undefined) material.wireframe = custom.wireframe
          
          // Force update
          if (material.needsUpdate !== undefined) material.needsUpdate = true
          
        } catch (e) {
          console.warn('Material property application failed:', e)
        }
      })
      
      // Apply to children recursively
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((child: any) => {
          if (applyMaterialProperties(child, hexColor, custom, partType)) {
            applied = true
          }
        })
      }
      
      return applied
      
    } catch (error) {
      console.error('Error applying material properties:', error)
      return false
    }
  }

  const applyMaterialPropertiesBruteForce = (obj: any, hexColor: string): boolean => {
    try {
      if (!obj || typeof obj !== 'object') return false
      
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      let applied = false
      
      // Try to find and modify any color-like properties
      const traverseObject = (target: any, depth = 0) => {
        if (depth > 3) return // Prevent infinite recursion
        
        for (const key in target) {
          try {
            const value = target[key]
            
            if (value && typeof value === 'object') {
              // Check if this looks like a color object
              if (value.r !== undefined && value.g !== undefined && value.b !== undefined) {
                value.r = r
                value.g = g
                value.b = b
                applied = true
              }
              
              // Check for color setting methods
              if (typeof value.setRGB === 'function') {
                value.setRGB(r, g, b)
                applied = true
              }
              
              if (typeof value.set === 'function' && key.toLowerCase().includes('color')) {
                value.set(hexColor)
                applied = true
              }
              
              // Recurse into nested objects
              if (depth < 2) {
                traverseObject(value, depth + 1)
              }
            }
          } catch (e) {
            // Continue with next property
          }
        }
      }
      
      traverseObject(obj)
      return applied
      
    } catch (error) {
      return false
    }
  }

  const applyBodyStructure = (spline: any, allObjects: any[], custom: RobotCustomization) => {
    try {
      addDebugInfo('Applying body structure')
      
      // Try to scale objects based on customization
      const scaleMap = {
        head: custom.headSize,
        body: custom.bodyHeight,
        torso: custom.bodyHeight,
        chest: custom.bodyHeight,
        arm: custom.armLength,
        leg: custom.legLength
      }
      
      let scaledCount = 0
      
      Object.entries(scaleMap).forEach(([partName, scale]) => {
        // Try direct name finding
        try {
          if (spline.findObjectByName) {
            const obj = spline.findObjectByName(partName)
            if (obj && obj.scale) {
              if (obj.scale.set) {
                obj.scale.set(scale, scale, scale)
              } else {
                obj.scale.x = scale
                obj.scale.y = scale
                obj.scale.z = scale
              }
              scaledCount++
            }
          }
        } catch (e) {
          // Try searching in all objects
          allObjects.forEach((obj: any) => {
            if (obj.name && obj.name.toLowerCase().includes(partName.toLowerCase()) && obj.scale) {
              try {
                if (obj.scale.set) {
                  obj.scale.set(scale, scale, scale)
                } else {
                  obj.scale.x = scale
                  obj.scale.y = scale
                  obj.scale.z = scale
                }
                scaledCount++
              } catch (scaleError) {
                console.warn('Scaling failed for object:', obj.name, scaleError)
              }
            }
          })
        }
      })
      
      if (scaledCount > 0) {
        addDebugInfo(`Scaled ${scaledCount} objects`)
      }
      
    } catch (error) {
      console.error('Error applying body structure:', error)
      addDebugInfo(`Structure error: ${error}`)
    }
  }

  const applyAccessories = (spline: any, allObjects: any[], custom: RobotCustomization) => {
    try {
      addDebugInfo('Applying accessories')
      
      const accessories = {
        helmet: custom.helmet,
        visor: custom.visor,
        armor: custom.armor,
        cape: custom.cape
      }
      
      let accessoryCount = 0
      
      Object.entries(accessories).forEach(([accessory, visible]) => {
        // Try direct name finding
        try {
          if (spline.findObjectByName) {
            const obj = spline.findObjectByName(accessory)
            if (obj) {
              obj.visible = visible
              accessoryCount++
            }
          }
        } catch (e) {
          // Try searching in all objects
          allObjects.forEach((obj: any) => {
            if (obj.name && obj.name.toLowerCase().includes(accessory.toLowerCase())) {
              obj.visible = visible
              accessoryCount++
            }
          })
        }
      })
      
      if (accessoryCount > 0) {
        addDebugInfo(`Applied ${accessoryCount} accessories`)
      }
      
    } catch (error) {
      console.error('Error applying accessories:', error)
      addDebugInfo(`Accessory error: ${error}`)
    }
  }

  const applyEnvironment = (spline: any, custom: RobotCustomization) => {
    try {
      addDebugInfo('Applying environment')
      
      // Try to update lighting
      const updateLights = (objects: any[]) => {
        let lightCount = 0
        
        objects.forEach((obj: any) => {
          if (obj.type && (obj.type.includes('Light') || obj.isLight)) {
            try {
              if (obj.intensity !== undefined) {
                obj.intensity = custom.lightingIntensity
                lightCount++
              }
              
              if (obj.color) {
                const hex = custom.lightingColor.replace('#', '')
                const r = parseInt(hex.substr(0, 2), 16) / 255
                const g = parseInt(hex.substr(2, 2), 16) / 255
                const b = parseInt(hex.substr(4, 2), 16) / 255
                
                if (obj.color.setRGB) {
                  obj.color.setRGB(r, g, b)
                } else if (obj.color.set) {
                  obj.color.set(custom.lightingColor)
                }
              }
            } catch (lightError) {
              console.warn('Light update failed:', lightError)
            }
          }
          
          if (obj.children && obj.children.length > 0) {
            updateLights(obj.children)
          }
        })
        
        return lightCount
      }
      
      let lightCount = 0
      
      // Try different scene access methods
      if (spline.scene && spline.scene.children) {
        lightCount += updateLights(spline.scene.children)
      }
      
      if (spline._scene && spline._scene.children) {
        lightCount += updateLights(spline._scene.children)
      }
      
      if (lightCount > 0) {
        addDebugInfo(`Updated ${lightCount} lights`)
      }
      
    } catch (error) {
      console.error('Error applying environment:', error)
      addDebugInfo(`Environment error: ${error}`)
    }
  }

  const applyAdvancedEffects = (spline: any, allObjects: any[], custom: RobotCustomization) => {
    try {
      addDebugInfo('Applying advanced effects')
      
      // Try to set animation speed
      if (spline.setSpeed) {
        try {
          spline.setSpeed(custom.animationSpeed)
          addDebugInfo(`Set animation speed: ${custom.animationSpeed}`)
        } catch (e) {
          console.warn('Animation speed setting failed:', e)
        }
      }
      
      // Apply outline effect if available
      if (custom.outline) {
        // This would need specific Spline implementation
        addDebugInfo('Outline effect requested (not implemented)')
      }
      
    } catch (error) {
      console.error('Error applying advanced effects:', error)
      addDebugInfo(`Advanced effects error: ${error}`)
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
        <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-xs max-h-64 overflow-y-auto">
          <div className="font-semibold mb-2">Customization Debug:</div>
          <div>Spline App: {splineApp ? '✓' : '✗'}</div>
          <div>Applying: {isApplying ? '✓' : '✗'}</div>
          <div>Body Type: {customization.bodyType}</div>
          <div>Body Color: {customization.bodyColor}</div>
          <div>Accent Color: {customization.accentColor}</div>
          <div className="mt-2 text-xs">
            <div className="font-medium">Recent Actions:</div>
            {debugInfo.map((info, index) => (
              <div key={index} className="text-gray-300">{info}</div>
            ))}
          </div>
        </div>
      )}
      
      {/* Customization Indicator */}
      {isApplying && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-xs flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
          Applying Customization...
        </div>
      )}
    </div>
  )
}