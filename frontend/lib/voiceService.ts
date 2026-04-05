/**
 * Voice service for text-to-speech functionality
 * Handles robot voice welcoming users to profiles
 */

export interface VoiceSettings {
  rate: number // 0.1 to 10
  pitch: number // 0 to 2
  volume: number // 0 to 1
  voice?: SpeechSynthesisVoice
  language: string
}

export interface WelcomeMessage {
  profileOwner: string
  visitor?: string
  customMessage?: string
}

class VoiceService {
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private isInitialized = false
  private defaultSettings: VoiceSettings = {
    rate: 0.9,
    pitch: 1.2, // Slightly higher pitch for robot voice
    volume: 0.8,
    language: 'en-US'
  }

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
      this.initializeVoices()
    }
  }

  private async initializeVoices(): Promise<void> {
    if (!this.synth) return Promise.resolve()
    
    return new Promise((resolve) => {
      // Load voices
      const loadVoices = () => {
        this.voices = this.synth!.getVoices()
        this.isInitialized = true
        console.log('Voice service initialized with', this.voices.length, 'voices')
        resolve()
      }

      // Voices might load asynchronously
      if (this.synth!.getVoices().length > 0) {
        loadVoices()
      } else {
        this.synth!.addEventListener('voiceschanged', loadVoices, { once: true })
        // Fallback timeout
        setTimeout(loadVoices, 1000)
      }
    })
  }

  /**
   * Get available voices, preferring robot-like or synthetic voices
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  /**
   * Get the best robot-like voice
   */
  public getRobotVoice(): SpeechSynthesisVoice | null {
    if (!this.isInitialized || this.voices.length === 0) {
      return null
    }

    // Prefer voices that sound more robotic or synthetic
    const robotPreferences = [
      'Microsoft Zira', // Windows synthetic voice
      'Microsoft David', // Windows synthetic voice
      'Google UK English Male',
      'Google US English',
      'Alex', // macOS voice
      'Samantha', // macOS voice
      'Daniel', // macOS voice
    ]

    // Try to find preferred robot voices
    for (const preference of robotPreferences) {
      const voice = this.voices.find(v => 
        v.name.includes(preference) || 
        v.name.toLowerCase().includes(preference.toLowerCase())
      )
      if (voice) return voice
    }

    // Fallback to any English voice
    const englishVoice = this.voices.find(v => 
      v.lang.startsWith('en') && !v.name.toLowerCase().includes('female')
    )
    
    return englishVoice || this.voices[0] || null
  }

  /**
   * Generate welcome message text
   */
  private generateWelcomeText(message: WelcomeMessage): string {
    const { profileOwner, visitor, customMessage } = message

    if (customMessage) {
      return customMessage
    }

    const greetings = [
      `Welcome to ${profileOwner}'s profile!`,
      `Hello! You're viewing ${profileOwner}'s profile.`,
      `Welcome to ${profileOwner}'s space.`,
      `Hello, welcome to ${profileOwner}'s profile.`,
      `Hi there! This is ${profileOwner}'s profile.`
    ]

    // Add visitor-specific greeting if available
    if (visitor && visitor !== profileOwner) {
      const personalGreetings = [
        `Hello ${visitor}! Welcome to ${profileOwner}'s profile.`,
        `Hi ${visitor}! You're viewing ${profileOwner}'s profile.`,
        `Welcome ${visitor}! This is ${profileOwner}'s space.`
      ]
      greetings.push(...personalGreetings)
    }

    // Return random greeting
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  /**
   * Speak welcome message with robot voice
   */
  public async speakWelcome(message: WelcomeMessage, settings?: Partial<VoiceSettings>): Promise<void> {
    if (!this.synth || !this.isInitialized) {
      console.warn('Speech synthesis not available')
      return
    }

    // Cancel any ongoing speech
    this.synth.cancel()

    const text = this.generateWelcomeText(message)
    const utterance = new SpeechSynthesisUtterance(text)

    // Apply settings
    const finalSettings = { ...this.defaultSettings, ...settings }
    utterance.rate = finalSettings.rate
    utterance.pitch = finalSettings.pitch
    utterance.volume = finalSettings.volume
    utterance.lang = finalSettings.language

    // Set robot voice
    const robotVoice = finalSettings.voice || this.getRobotVoice()
    if (robotVoice) {
      utterance.voice = robotVoice
    }

    // Add event listeners
    utterance.onstart = () => {
      console.log('Robot started speaking:', text)
    }

    utterance.onend = () => {
      console.log('Robot finished speaking')
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
    }

    // Speak the message
    this.synth.speak(utterance)
  }

  /**
   * Stop any ongoing speech
   */
  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  /**
   * Check if speech synthesis is supported
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  /**
   * Check if currently speaking
   */
  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false
  }

  /**
   * Get voice settings for robot customization
   */
  public getVoiceSettings(): VoiceSettings {
    return { ...this.defaultSettings }
  }

  /**
   * Update voice settings
   */
  public updateVoiceSettings(settings: Partial<VoiceSettings>): void {
    this.defaultSettings = { ...this.defaultSettings, ...settings }
  }
}

// Export singleton instance
export const voiceService = new VoiceService()

// Export utility functions
export const speakProfileWelcome = async (
  profileOwnerName: string, 
  visitorName?: string,
  customMessage?: string
) => {
  await voiceService.speakWelcome({
    profileOwner: profileOwnerName,
    visitor: visitorName,
    customMessage
  })
}

export const stopRobotSpeech = () => {
  voiceService.stopSpeaking()
}