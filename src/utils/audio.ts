// Web Audio API synthesized cues and focus soundscapes without external audio dependencies

class AudioController {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbient: 'none' | 'rain' | 'whitenoise' | 'binaural' = 'none';

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play peaceful singing bowl / chime when Pomodoro completes
  playCompletionChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Harmonic chords (E5, G#5, B5, E6)
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Gentle envelope
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2 / (idx + 1), now + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.6);
      });
    } catch {
      // AudioContext fallback
    }
  }

  // Play celebratory milestone sound
  playCelebrationSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.0);
      });
    } catch {
      // AudioContext fallback
    }
  }

  // Start ambient sound generator for studying
  startAmbient(type: 'rain' | 'whitenoise' | 'binaural', volume = 0.15) {
    this.stopAmbient();
    try {
      const ctx = this.getContext();
      this.currentAmbient = type;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'whitenoise' || type === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Brown / Pink filtered noise for rain sound
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // Soft white noise
            output[i] = white * 0.2;
          }
        }

        const whiteNoiseSource = ctx.createBufferSource();
        whiteNoiseSource.buffer = noiseBuffer;
        whiteNoiseSource.loop = true;

        // Lowpass filter for smooth warmth
        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);
        filter.Q.setValueAtTime(1, ctx.currentTime);

        whiteNoiseSource.connect(filter);
        filter.connect(masterGain);
        whiteNoiseSource.start();
        this.ambientSource = whiteNoiseSource;
      } else if (type === 'binaural') {
        // Alpha focus tone (200Hz left, 210Hz right -> 10Hz alpha beat)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        osc1.frequency.setValueAtTime(200, ctx.currentTime);
        osc2.frequency.setValueAtTime(210, ctx.currentTime);
        osc1.type = 'sine';
        osc2.type = 'sine';

        osc1.connect(merger, 0, 0);
        osc2.connect(merger, 0, 1);
        merger.connect(masterGain);

        osc1.start();
        osc2.start();
        this.ambientSource = osc1;
      }
    } catch {
      // AudioContext ambient fallback
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        if ('stop' in this.ambientSource && typeof this.ambientSource.stop === 'function') {
          this.ambientSource.stop();
        }
        this.ambientSource.disconnect();
      } catch {
        // Disconnect catch
      }
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {
        // Disconnect catch
      }
      this.ambientGain = null;
    }
    this.currentAmbient = 'none';
  }

  getCurrentAmbient() {
    return this.currentAmbient;
  }
}

export const soundManager = new AudioController();
