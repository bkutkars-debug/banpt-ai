// Helper for Text-to-Speech audio feedback using Web Speech API
export class VoiceAssistant {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static isMuted: boolean = false;

  public static setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  public static getMuted(): boolean {
    return this.isMuted;
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira')) && v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    this.synth.speak(utterance);
  }

  public static speakEmergencyAlert(emergencyType: string, severityLevel: string, topAction: string) {
    const speech = `Emergency alert detected. Type: ${emergencyType}. Priority is ${severityLevel}. Immediate recommendation: ${topAction}. Professional emergency services have been alerted.`;
    this.speak(speech);
  }
}