export class VoiceService {
  private recognition: any | null = null
  private synthesis: SpeechSynthesis
  private voices: SpeechSynthesisVoice[] = []
  private isListening = false

  constructor() {
    this.synthesis = window.speechSynthesis
    this.loadVoices()

    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.setupRecognition()
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = 'en-US'
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices()

    // If voices aren't loaded yet, wait for the event
    if (this.voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices()
      }
    }
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (this.isListening) {
        reject(new Error('Already listening'))
        return
      }

      this.isListening = true

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        this.isListening = false
        resolve(transcript)
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text: string, options: {
    voice?: 'female' | 'male' | 'auto'
    rate?: number
    pitch?: number
    volume?: number
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve()
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Configure voice
      const voice = this.selectVoice(options.voice || 'auto')
      if (voice) utterance.voice = voice

      // Configure speech parameters
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 0.8

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`))

      this.synthesis.speak(utterance)
    })
  }

  private selectVoice(preference: 'female' | 'male' | 'auto'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null

    // Filter for English voices
    const englishVoices = this.voices.filter(voice =>
      voice.lang.startsWith('en-')
    )

    if (englishVoices.length === 0) return this.voices[0]

    switch (preference) {
      case 'female':
        return englishVoices.find(voice =>
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('girl') ||
          ['samantha', 'susan', 'karen', 'victoria', 'alex'].some(name =>
            voice.name.toLowerCase().includes(name)
          )
        ) || englishVoices[0]

      case 'male':
        return englishVoices.find(voice =>
          voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('tom')
        ) || englishVoices[0]

      default:
        // Auto - prefer neural/premium voices
        return englishVoices.find(voice =>
          voice.name.toLowerCase().includes('neural') ||
          voice.name.toLowerCase().includes('premium') ||
          voice.name.toLowerCase().includes('enhanced')
        ) || englishVoices[0]
    }
  }

  isSupported(): {
    speechRecognition: boolean
    speechSynthesis: boolean
  } {
    return {
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      speechSynthesis: !!window.speechSynthesis
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith('en-'))
  }
}

// Global instance
export const voiceService = new VoiceService()

// Extend window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
