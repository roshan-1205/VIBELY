'use client'

import { Suspense, lazy, useEffect, useState, useRef } from 'react'
import { RobotCustomization, getDefaultCustomization } from '@/lib/robotCustomization'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SimpleRobotTestProps {
  scene: string
  className?: string
  customization?: RobotCustomization
}

export function SimpleRobotTest({ 
  scene, 
  className, 
  customization = getDefaultCustomization()
}: SimpleRobotTestProps) {
  const [splineApp, setSplineApp] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log('Robot Test:', message)
    setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    if (splineApp && customization) {
      addLog('Applying customization...')
      applySimpleCustomization(splineApp, customization)
    }
  }, [splineApp, customization])

  const onLoad = (spline: any) => {
    addLog('Spline loaded successfully')
    setSplineApp(spline)
    
    // Log available methods and properties
    addLog(`Spline methods: ${Object.getOwnPropertyNames(spline).join(', ')}`)
    
    // Try to access scene
    if (spline.scene) {
      addLog(`Scene found with ${spline.scene.children?.length || 0} children`)
    }
    
    // Try getAllObjects
    if (spline.getAllObjects) {
      try {
        const objects = spline.getAllObjects()
        addLog(`getAllObjects returned ${objects.length} objects`)
      } catch (e) {
        addLog(`getAllObjects failed: ${e}`)
      }
    }
  }

  const applySimpleCustomization = (spline: any, custom: RobotCustomization) => {
    try {
      addLog(`Applying colors: body=${custom.bodyColor}, accent=${custom.accentColor}`)
      addLog(`Spline object properties: ${Object.getOwnPropertyNames(spline).join(', ')}`)
      
      // Method 1: Try Spline variables first (most reliable)
      if (spline.setVariable) {
        addLog('Trying Spline setVariable method')
        let variableCount = 0
        
        const colorVars = [
          { name: 'bodyColor', value: custom.bodyColor },
          { name: 'robotColor', value: custom.bodyColor },
          { name: 'primaryColor', value: custom.bodyColor },
          { name: 'mainColor', value: custom.bodyColor },
          { name: 'accentColor', value: custom.accentColor },
          { name: 'secondaryColor', value: custom.accentColor },
          { name: 'eyeColor', value: custom.eyeColor },
          { name: 'glowColor', value: custom.eyeColor }
        ]
        
        colorVars.forEach(({ name, value }) => {
          try {
            spline.setVariable(name, value)
            variableCount++
            addLog(`Set variable ${name} = ${value}`)
          } catch (e) {
            // Variable doesn't exist
          }
        })
        
        if (variableCount > 0) {
          addLog(`Successfully set ${variableCount} Spline variables`)
          return // If variables worked, we're done
        }
      }
      
      // Method 2: Try to get all objects and apply colors
      let objectsFound = 0
      
      if (spline.getAllObjects) {
        try {
          const allObjects = spline.getAllObjects()
          addLog(`Found ${allObjects.length} objects via getAllObjects`)
          
          // Log object details
          const objectDetails = allObjects.slice(0, 5).map((obj: any) => ({
            name: obj.name || 'unnamed',
            type: obj.type || 'unknown',
            hasMaterial: !!obj.material,
            hasGeometry: !!obj.geometry,
            isMesh: obj.isMesh || false
          }))
          addLog(`Sample objects: ${JSON.stringify(objectDetails)}`)
          
          allObjects.forEach((obj: any, index: number) => {
            const color = index % 2 === 0 ? custom.bodyColor : custom.accentColor
            if (applyColorToObject(obj, color)) {
              objectsFound++
            }
          })
          
          addLog(`Applied colors to ${objectsFound} objects via getAllObjects`)
        } catch (e) {
          addLog(`getAllObjects method failed: ${e}`)
        }
      }
      
      // Method 3: Try scene traversal
      if (objectsFound === 0 && spline.scene) {
        try {
          const sceneObjects = traverseScene(spline.scene)
          addLog(`Found ${sceneObjects.length} objects via scene traversal`)
          
          sceneObjects.forEach((obj: any, index: number) => {
            const color = index % 2 === 0 ? custom.bodyColor : custom.accentColor
            if (applyColorToObject(obj, color)) {
              objectsFound++
            }
          })
          
          addLog(`Applied colors to ${objectsFound} objects via scene`)
        } catch (e) {
          addLog(`Scene traversal failed: ${e}`)
        }
      }
      
      // Method 4: Try direct object access by name
      if (spline.findObjectByName) {
        const testNames = ['Robot', 'Character', 'Body', 'Main', 'Mesh', 'Object', 'Group']
        let namedObjects = 0
        
        testNames.forEach(name => {
          try {
            const obj = spline.findObjectByName(name)
            if (obj) {
              addLog(`Found object by name: ${name}`)
              if (applyColorToObject(obj, custom.bodyColor)) {
                namedObjects++
              }
            }
          } catch (e) {
            // Ignore individual failures
          }
        })
        
        if (namedObjects > 0) {
          addLog(`Found ${namedObjects} named objects`)
          objectsFound += namedObjects
        }
      }
      
      // Method 5: Try findObjectById
      if (objectsFound === 0 && spline.findObjectById) {
        addLog('Trying findObjectById method')
        for (let i = 0; i < 20; i++) {
          try {
            const obj = spline.findObjectById(i.toString())
            if (obj) {
              addLog(`Found object by ID: ${i}`)
              if (applyColorToObject(obj, custom.bodyColor)) {
                objectsFound++
              }
            }
          } catch (e) {
            // Continue
          }
        }
      }
      
      if (objectsFound === 0) {
        addLog('No objects found to customize - checking scene structure')
        
        // Log scene structure for debugging
        if (spline.scene) {
          addLog(`Scene type: ${spline.scene.type || 'unknown'}`)
          addLog(`Scene children: ${spline.scene.children?.length || 0}`)
          if (spline.scene.children && spline.scene.children.length > 0) {
            const childTypes = spline.scene.children.map((child: any) => child.type || 'unknown')
            addLog(`Child types: ${childTypes.join(', ')}`)
          }
        }
      } else {
        addLog(`Total objects customized: ${objectsFound}`)
      }
      
    } catch (error) {
      addLog(`Customization error: ${error}`)
    }
  }

  const traverseScene = (scene: any): any[] => {
    const objects: any[] = []
    
    const traverse = (obj: any) => {
      objects.push(obj)
      if (obj.children) {
        obj.children.forEach(traverse)
      }
    }
    
    if (scene.children) {
      scene.children.forEach(traverse)
    }
    
    return objects
  }

  const applyColorToMaterial = (material: any, hexColor: string): boolean => {
    try {
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      // Try different color setting methods
      if (material.color) {
        if (material.color.setRGB) {
          material.color.setRGB(r, g, b)
          return true
        } else if (material.color.set) {
          material.color.set(hexColor)
          return true
        } else if (material.color.setHex) {
          material.color.setHex(parseInt(hex, 16))
          return true
        }
      }
      
      return false
    } catch (e) {
      return false
    }
  }

  const applyColorToObject = (obj: any, hexColor: string): boolean => {
    try {
      if (!obj) return false
      
      let applied = false
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      // Try to apply to material
      if (obj.material) {
        applied = applyColorToMaterial(obj.material, hexColor) || applied
      }
      
      // Try to apply to materials array
      if (obj.materials && Array.isArray(obj.materials)) {
        obj.materials.forEach((material: any) => {
          applied = applyColorToMaterial(material, hexColor) || applied
        })
      }
      
      // Try geometry materials
      if (obj.geometry?.material) {
        applied = applyColorToMaterial(obj.geometry.material, hexColor) || applied
      }
      
      if (obj.geometry?.materials) {
        obj.geometry.materials.forEach((material: any) => {
          applied = applyColorToMaterial(material, hexColor) || applied
        })
      }
      
      // Try to find color properties directly on the object
      if (obj.color) {
        try {
          if (obj.color.setRGB) {
            obj.color.setRGB(r, g, b)
            applied = true
          } else if (obj.color.set) {
            obj.color.set(hexColor)
            applied = true
          } else {
            obj.color.r = r
            obj.color.g = g
            obj.color.b = b
            applied = true
          }
        } catch (e) {
          // Continue
        }
      }
      
      // Apply to children recursively
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((child: any) => {
          applied = applyColorToObject(child, hexColor) || applied
        })
      }
      
      return applied
    } catch (e) {
      return false
    }
  }

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
        </div>
      }>
        <Spline
          scene={scene}
          className={className}
          onLoad={onLoad}
        />
      </Suspense>
      
      {/* Debug Logs */}
      <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-sm max-h-48 overflow-y-auto">
        <div className="font-semibold mb-2">Robot Test Logs:</div>
        {logs.map((log, index) => (
          <div key={index} className="text-gray-300 mb-1">{log}</div>
        ))}
      </div>
      
      {/* Color Indicators */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <div 
          className="w-8 h-8 rounded border-2 border-white" 
          style={{ backgroundColor: customization.bodyColor }}
          title="Body Color"
        />
        <div 
          className="w-8 h-8 rounded border-2 border-white" 
          style={{ backgroundColor: customization.accentColor }}
          title="Accent Color"
        />
      </div>
    </div>
  )
}