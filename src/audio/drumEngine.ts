import { DrumStyle } from '../types';

export class DrumEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private isRunning: boolean = false;
  private bpm: number = 90;
  private style: DrumStyle = 'boombap';
  private volume: number = 0.85;

  private nextNoteTime: number = 0;
  private current16thStep: number = 0;
  private currentBar: number = 0;
  private cycleStepCount: number = 0; // counts 0 to 63 (4 bars of 16 steps = 64 steps)
  private timerId: number | null = null;

  // Callbacks
  public onStep?: (step: number, beat: number, barInCycle: number, totalBars: number) => void;
  public onFourBarsTrigger?: (cycleIndex: number) => void;

  constructor(initialBpm: number = 90, initialStyle: DrumStyle = 'boombap') {
    this.bpm = initialBpm;
    this.style = initialStyle;
  }

  public async initAudio(): Promise<void> {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (!this.noiseBuffer && this.ctx) {
      this.noiseBuffer = this.createWhiteNoiseBuffer(this.ctx);
    }
  }

  private createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public start(): void {
    if (this.isRunning) return;
    this.initAudio().then(() => {
      if (!this.ctx) return;
      this.isRunning = true;
      this.current16thStep = 0;
      this.currentBar = 0;
      this.cycleStepCount = 0;
      this.nextNoteTime = this.ctx.currentTime + 0.05;
      this.scheduler();
    });
  }

  public stop(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setBpm(newBpm: number): void {
    this.bpm = Math.min(120, Math.max(60, newBpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setStyle(newStyle: DrumStyle): void {
    this.style = newStyle;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private scheduler(): void {
    if (!this.isRunning || !this.ctx) return;

    // Schedule any notes that fall within lookahead window (100ms)
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.scheduleStep(this.current16thStep, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerId = window.setTimeout(() => this.scheduler(), 25);
  }

  private advanceStep(): void {
    // 16th note duration = 60 / bpm / 4
    const secondsPer16th = 60.0 / this.bpm / 4.0;
    this.nextNoteTime += secondsPer16th;

    this.current16thStep = (this.current16thStep + 1) % 16;
    this.cycleStepCount = (this.cycleStepCount + 1) % 64; // 4 bars = 64 16th steps

    if (this.current16thStep === 0) {
      this.currentBar++;
    }

    // Every 4 bars (when cycleStepCount rolls back to 0 and we advanced)
    if (this.cycleStepCount === 0) {
      const cycleIndex = Math.floor(this.currentBar / 4);
      if (this.onFourBarsTrigger) {
        this.onFourBarsTrigger(cycleIndex);
      }
    }
  }

  private scheduleStep(step16th: number, time: number): void {
    if (!this.ctx || !this.masterGain) return;

    const barInCycle = Math.floor(this.cycleStepCount / 16); // 0, 1, 2, 3
    const beat = Math.floor(step16th / 4); // 0, 1, 2, 3

    // Broadcast step to UI listeners
    if (this.onStep) {
      // Delay call to match audio schedule timing using setTimeout or requestAnimationFrame
      const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
      window.setTimeout(() => {
        if (this.isRunning && this.onStep) {
          this.onStep(step16th, beat, barInCycle, this.currentBar);
        }
      }, delayMs);
    }

    // Determine instruments based on style pattern
    this.playInstrumentsForStep(step16th, time);
  }

  private playInstrumentsForStep(step: number, time: number): void {
    // Patterns for 16 steps (0-15)
    // 0: Beat 1, 4: Beat 2, 8: Beat 3, 12: Beat 4
    switch (this.style) {
      case 'boombap': {
        // Kick on 0, 10, and occasionally 7
        if (step === 0 || step === 10) {
          this.playKick(time, 1.0);
        } else if (step === 7) {
          this.playKick(time, 0.7);
        }
        // Snare on 4 and 12 (Beats 2 and 4)
        if (step === 4 || step === 12) {
          this.playSnare(time, 0.95);
        }
        // Hi-hat on every 8th note (0, 2, 4, 6, 8, 10, 12, 14) + slight swing
        if (step % 2 === 0) {
          const accent = step % 4 === 0 ? 0.65 : 0.45;
          this.playHat(time, accent, step === 14 ? 0.09 : 0.04);
        }
        break;
      }
      case 'trap': {
        // Kick on 0, 8, 11
        if (step === 0 || step === 8 || step === 11) {
          this.playKick(time, 1.0, true);
        }
        // Snare/Clap on 8 (half-time beat 3) or 4 & 12
        if (step === 8) {
          this.playSnare(time, 1.0);
          this.playClap(time, 0.7);
        }
        // 16th hats
        const isRoll = step === 14 || step === 15;
        this.playHat(time, isRoll ? 0.8 : (step % 4 === 0 ? 0.6 : 0.4), 0.03);
        break;
      }
      case 'lofi': {
        // Soft mellow kick on 0 and 6
        if (step === 0 || step === 6) {
          this.playKick(time, 0.75, false, 80);
        }
        // Soft rim / snare on 4 and 12
        if (step === 4 || step === 12) {
          this.playSnare(time, 0.7, true);
        }
        // Swung hats
        if (step % 2 === 0) {
          this.playHat(time, 0.35, 0.05);
        }
        break;
      }
      case 'drill': {
        // Syncopated kick on 0, 6, 12
        if (step === 0 || step === 6 || step === 12) {
          this.playKick(time, 1.0, true);
        }
        // Snare on 8 (Beat 3)
        if (step === 8) {
          this.playSnare(time, 0.95);
        }
        // Triple-feel hats
        if (step % 2 === 0 || step === 3 || step === 7) {
          this.playHat(time, 0.5, 0.035);
        }
        break;
      }
    }
  }

  // --- Sound Synthesis Engines ---

  private playKick(time: number, velocity: number = 1.0, is808: boolean = false, startFreq: number = 150): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const decay = is808 ? 0.45 : 0.28;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + decay);

    gain.gain.setValueAtTime(velocity * 1.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    // Subtle drive distortion
    const waveShaper = this.ctx.createWaveShaper();
    waveShaper.curve = this.makeDistortionCurve(10);

    osc.connect(gain);
    gain.connect(waveShaper);
    waveShaper.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + decay + 0.05);
  }

  private playSnare(time: number, velocity: number = 0.9, softTone: boolean = false): void {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    // Noise layer
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(softTone ? 900 : 1800, time);
    noiseFilter.Q.setValueAtTime(1.5, time);

    const noiseGain = this.ctx.createGain();
    const noiseDecay = softTone ? 0.12 : 0.2;
    noiseGain.gain.setValueAtTime(velocity * 0.8, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + noiseDecay);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(185, time);
    osc.frequency.exponentialRampToValueAtTime(65, time + 0.08);

    oscGain.gain.setValueAtTime(velocity * 0.6, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noiseSource.start(time);
    noiseSource.stop(time + noiseDecay + 0.02);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  private playHat(time: number, velocity: number = 0.5, decayDuration: number = 0.04): void {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decayDuration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start(time);
    noiseSource.stop(time + decayDuration + 0.01);
  }

  private playClap(time: number, velocity: number = 0.7): void {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const burstTimes = [0, 0.012, 0.024];
    burstTimes.forEach((offset, idx) => {
      const isLast = idx === burstTimes.length - 1;
      const decay = isLast ? 0.18 : 0.015;

      const noiseSource = this.ctx!.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, time + offset);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(velocity * (isLast ? 0.8 : 0.5), time + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, time + offset + decay);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      noiseSource.start(time + offset);
      noiseSource.stop(time + offset + decay + 0.01);
    });
  }

  // Play a sharp cue beep to signal a new prompt card
  public playPromptFlashCue(): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 20;
    const nSamples = 22050;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}
