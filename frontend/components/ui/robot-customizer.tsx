'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Settings, 
  Zap, 
  User, 
  Eye, 
  Shirt, 
  RotateCcw, 
  Save, 
  Download, 
  Upload,
  Sliders,
  Sparkles,
  Sun,
  Moon,
  Cpu,
  Shield
} from 'lucide-react'
import { Button } from './button'
import { Card } from './card'
import { 
  RobotCustomization, 
  getDefaultCustomization, 
  saveCustomization, 
  loadCustomization,
  applyBodyTypePreset,
  applyColorPreset,
  bodyTypePresets,
  colorPresets
} from '@/lib/robotCustomization'

interface RobotCustomizerProps {
  userId?: string
  onCustomizationChange: (customization: RobotCustomization) => void
  className?: string
}

export const RobotCustomizer = ({ userId, onCustomizationChange, className }: RobotCustomizerProps) => {
  const [customization, setCustomization] = useState<RobotCustomization>(getDefaultCustomization())
  const [activeTab, setActiveTab] = useState('colors')
  const [isExpanded, setIsExpanded] = useState(false)

  // Load saved customization on mount
  useEffect(() => {
    if (userId) {
      const loaded = loadCustomization(userId)
      setCustomization(loaded)
      onCustomizationChange(loaded)
    }
  }, [userId, onCustomizationChange])

  // Save and notify on changes
  const updateCustomization = (updates: Partial<RobotCustomization>) => {
    const newCustomization = { ...customization, ...updates }
    setCustomization(newCustomization)
    onCustomizationChange(newCustomization)
    
    if (userId) {
      saveCustomization(userId, newCustomization)
    }
  }

  const resetToDefaults = () => {
    const defaults = getDefaultCustomization()
    setCustomization(defaults)
    onCustomizationChange(defaults)
    if (userId) {
      saveCustomization(userId, defaults)
    }
  }

  const exportCustomization = () => {
    const dataStr = JSON.stringify(customization, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'robot-customization.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importCustomization = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          const merged = { ...getDefaultCustomization(), ...imported }
          setCustomization(merged)
          onCustomizationChange(merged)
          if (userId) {
            saveCustomization(userId, merged)
          }
        } catch (error) {
          alert('Invalid customization file')
        }
      }
      reader.readAsText(file)
    }
  }

  const tabs = [
    { id: 'colors', label: 'Colors', icon: <Palette className="w-4 h-4" /> },
    { id: 'body', label: 'Body', icon: <User className="w-4 h-4" /> },
    { id: 'materials', label: 'Materials', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'accessories', label: 'Accessories', icon: <Shield className="w-4 h-4" /> },
    { id: 'environment', label: 'Environment', icon: <Sun className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings className="w-4 h-4" /> }
  ]

  if (!isExpanded) {
    return (
      <motion.div 
        className={`fixed bottom-6 right-6 z-40 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Sliders className="w-6 h-6" />
        </Button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`fixed right-6 top-6 bottom-6 w-96 z-40 ${className}`}
      >
        <Card className="h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Robot Customizer</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                ×
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Color Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(colorPresets).map(([name, preset]) => (
                    <button
                      key={name}
                      onClick={() => updateCustomization(applyColorPreset(customization, name as keyof typeof colorPresets))}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                    >
                      <div className="flex gap-1 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.bodyColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accentColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.eyeColor }} />
                      </div>
                      <div className="text-xs font-medium capitalize">{name}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <ColorPicker
                    label="Body Color"
                    value={customization.bodyColor}
                    onChange={(color) => updateCustomization({ bodyColor: color })}
                  />
                  <ColorPicker
                    label="Accent Color"
                    value={customization.accentColor}
                    onChange={(color) => updateCustomization({ accentColor: color })}
                  />
                  <ColorPicker
                    label="Eye Color"
                    value={customization.eyeColor}
                    onChange={(color) => updateCustomization({ eyeColor: color })}
                  />
                  <ColorPicker
                    label="Lighting Color"
                    value={customization.lightingColor}
                    onChange={(color) => updateCustomization({ lightingColor: color })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'body' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Body Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(bodyTypePresets).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateCustomization(applyBodyTypePreset(customization, type as keyof typeof bodyTypePresets))}
                      className={`p-3 rounded-lg border transition-colors capitalize ${
                        customization.bodyType === type
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Slider
                    label="Head Size"
                    value={customization.headSize}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onChange={(value) => updateCustomization({ headSize: value })}
                  />
                  <Slider
                    label="Body Height"
                    value={customization.bodyHeight}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onChange={(value) => updateCustomization({ bodyHeight: value })}
                  />
                  <Slider
                    label="Arm Length"
                    value={customization.armLength}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onChange={(value) => updateCustomization({ armLength: value })}
                  />
                  <Slider
                    label="Leg Length"
                    value={customization.legLength}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onChange={(value) => updateCustomization({ legLength: value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4">
                <Slider
                  label="Metalness"
                  value={customization.metalness}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(value) => updateCustomization({ metalness: value })}
                />
                <Slider
                  label="Roughness"
                  value={customization.roughness}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(value) => updateCustomization({ roughness: value })}
                />
                <Slider
                  label="Glow Intensity"
                  value={customization.emissiveIntensity}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(value) => updateCustomization({ emissiveIntensity: value })}
                />
                <Toggle
                  label="Glow Effect"
                  value={customization.glowEffect}
                  onChange={(value) => updateCustomization({ glowEffect: value })}
                />
              </div>
            )}

            {activeTab === 'accessories' && (
              <div className="space-y-4">
                <Toggle
                  label="Helmet"
                  value={customization.helmet}
                  onChange={(value) => updateCustomization({ helmet: value })}
                />
                <Toggle
                  label="Visor"
                  value={customization.visor}
                  onChange={(value) => updateCustomization({ visor: value })}
                />
                <Toggle
                  label="Armor"
                  value={customization.armor}
                  onChange={(value) => updateCustomization({ armor: value })}
                />
                <Toggle
                  label="Cape"
                  value={customization.cape}
                  onChange={(value) => updateCustomization({ cape: value })}
                />
              </div>
            )}

            {activeTab === 'environment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background
                  </label>
                  <select
                    value={customization.backgroundType}
                    onChange={(e) => updateCustomization({ backgroundType: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="gradient">Gradient</option>
                    <option value="space">Space</option>
                    <option value="city">City</option>
                    <option value="nature">Nature</option>
                    <option value="abstract">Abstract</option>
                  </select>
                </div>
                <Slider
                  label="Lighting Intensity"
                  value={customization.lightingIntensity}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  onChange={(value) => updateCustomization({ lightingIntensity: value })}
                />
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <Toggle
                  label="Wireframe Mode"
                  value={customization.wireframe}
                  onChange={(value) => updateCustomization({ wireframe: value })}
                />
                <Toggle
                  label="Outline Effect"
                  value={customization.outline}
                  onChange={(value) => updateCustomization({ outline: value })}
                />
                <Slider
                  label="Transparency"
                  value={customization.transparency}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(value) => updateCustomization({ transparency: value })}
                />
                <Slider
                  label="Animation Speed"
                  value={customization.animationSpeed}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  onChange={(value) => updateCustomization({ animationSpeed: value })}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCustomization} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('import-input')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              id="import-input"
              type="file"
              accept=".json"
              onChange={importCustomization}
              className="hidden"
            />
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper Components
const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  </div>
)

const Slider = ({ label, value, min, max, step, onChange }: { 
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  onChange: (value: number) => void 
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <span className="text-sm text-gray-500 dark:text-gray-400">{value.toFixed(1)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
    />
  </div>
)

const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)