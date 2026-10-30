// Web Audio API Synthesizer for the SENA Anthem melody
// "Estudiantes del SENA, adelante por Colombia luchad con amor..."

class AnthemAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: number | null = null;
  private onStepCallback: ((index: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // SENA Anthem main chorus melody notes and durations in beats
  // Key: C Major / G Major solemn march tempo (approx 108 BPM)
  private melody: { freq: number; duration: number; lyricIndex: number }[] = [
    // Es-tu-dian-tes del SE-NA a-de-lan-te
    { freq: 261.63, duration: 0.35, lyricIndex: 0 }, // C4
    { freq: 293.66, duration: 0.35, lyricIndex: 0 }, // D4
    { freq: 329.63, duration: 0.45, lyricIndex: 0 }, // E4
    { freq: 349.23, duration: 0.35, lyricIndex: 0 }, // F4
    { freq: 392.00, duration: 0.65, lyricIndex: 0 }, // G4
    { freq: 392.00, duration: 0.5, lyricIndex: 0 },  // G4
    { freq: 440.00, duration: 0.35, lyricIndex: 0 }, // A4
    { freq: 392.00, duration: 0.7, lyricIndex: 0 },  // G4
    // por Co-lom-bia lu-chad con a-mor
    { freq: 349.23, duration: 0.4, lyricIndex: 1 },  // F4
    { freq: 329.63, duration: 0.4, lyricIndex: 1 },  // E4
    { freq: 293.66, duration: 0.45, lyricIndex: 1 }, // D4
    { freq: 329.63, duration: 0.4, lyricIndex: 1 },  // E4
    { freq: 349.23, duration: 0.4, lyricIndex: 1 },  // F4
    { freq: 329.63, duration: 0.7, lyricIndex: 1 },  // E4
    // con el á-ni-mo no-ble y ra-dian-te
    { freq: 261.63, duration: 0.35, lyricIndex: 2 }, // C4
    { freq: 293.66, duration: 0.35, lyricIndex: 2 }, // D4
    { freq: 329.63, duration: 0.45, lyricIndex: 2 }, // E4
    { freq: 349.23, duration: 0.35, lyricIndex: 2 }, // F4
    { freq: 392.00, duration: 0.6, lyricIndex: 2 },  // G4
    { freq: 523.25, duration: 0.55, lyricIndex: 2 }, // C5
    { freq: 493.88, duration: 0.35, lyricIndex: 2 }, // B4
    { freq: 440.00, duration: 0.65, lyricIndex: 2 }, // A4
    // trans-for-mé-mos-le en mun-do me-jor
    { freq: 392.00, duration: 0.4, lyricIndex: 3 },  // G4
    { freq: 349.23, duration: 0.4, lyricIndex: 3 },  // F4
    { freq: 329.63, duration: 0.45, lyricIndex: 3 }, // E4
    { freq: 293.66, duration: 0.45, lyricIndex: 3 }, // D4
    { freq: 261.63, duration: 0.9, lyricIndex: 3 },  // C4
  ];

  public play(onStep?: (index: number) => void, onEnd?: () => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.onStepCallback = onStep || null;
    this.onEndCallback = onEnd || null;

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlaying || !this.ctx || noteIdx >= this.melody.length) {
        this.stop();
        if (this.onEndCallback) this.onEndCallback();
        return;
      }

      const note = this.melody[noteIdx];
      if (this.onStepCallback) {
        this.onStepCallback(note.lyricIndex);
      }

      // Play synthesized tone with warm brass/choral envelope
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(note.freq * 0.5, now); // Octave lower for richness

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.duration - 0.04);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + note.duration);
      osc2.stop(now + note.duration);

      noteIdx++;
      this.currentTimeout = window.setTimeout(playNext, note.duration * 1000);
    };

    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout !== null) {
      window.clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const anthemSynthesizer = new AnthemAudioSynthesizer();
