import { DrumStyle } from '../types';

export class DrumEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private bpm: number = 90;
  private style: DrumStyle = 'boombap';
  private masterGain: GainNode | null = null;

  // Scheduling clock
  private nextStepTime: number = 0;
  private currentStep: number = 0; // 0 to 15 (16th notes per bar)
  private currentBarInCycle: number = 0; // 0, 1, 2, 3 (in 4-bar cycle)
  private totalBars: number = 0;
  private timerId: number | null = null;
  private lookaheadMs: number = 25;
  private scheduleAheadSeconds: number = 0.1;

  // Callbacks
  public onStep?: (step: number, beat: number, barInCycle: number, totalBars: number) => void;
  public onFourBarsTrigger?: (cycleCount: number) => void;

  constructor(initialBpm: number = 90, initialStyle: DrumStyle = 'boombap') {
    this.bpm = initialBpm;
    this.style = initialStyle;
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(60, Math.min(140, newBpm));
  }

  public setStyle(newStyle: DrumStyle) {
    this.style = newStyle;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public start() {
    this.initAudio();
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentStep = 0;
    this.currentBarInCycle = 0;
    this.totalBars = 0;

    if (this.ctx) {
      this.nextStepTime = this.ctx.currentTime + 0.05;
    }
    this.scheduler();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduler = () => {
    if (!this.isRunning || !this.ctx) return;

    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadSeconds) {
      this.scheduleStep(this.currentStep, this.currentBarInCycle, this.nextStepTime);
      this.advanceStep();
    }

    this.timerId = window.setTimeout(this.scheduler, this.lookaheadMs);
  };

  private advanceStep() {
    const secondsPer16th = 60.0 / this.bpm / 4.0;
    this.nextStepTime += secondsPer16th;

    this.currentStep++;
    if (this.currentStep >= 16) {
      this.currentStep = 0;
      this.currentBarInCycle++;
      this.totalBars++;

      if (this.currentBarInCycle >= 4) {
        this.currentBarInCycle = 0;
        // Trigger 4-bar prompt cycle
        if (this.onFourBarsTrigger) {
          const cycles = Math.floor(this.totalBars / 4);
          this.onFourBarsTrigger(cycles);
        }
      }
    }
  }

  private scheduleStep(step: number, barInCycle: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Report step back to UI via requestAnimationFrame / setTimeout
    const currentBeat = Math.floor(step / 4);
    const barsCount = this.totalBars;
    const barCycle = barInCycle;

    // Synthesize drums based on style pattern
    this.playPatternInstruments(step, barCycle, time);

    // Sync UI with audio time
    const delay = Math.max(0, (time - this.ctx.currentTime) * 1000);
    setTimeout(() => {
      if (this.isRunning && this.onStep) {
        this.onStep(step, currentBeat, barCycle, barsCount);
      }
    }, delay);
  }

  private playPatternInstruments(step: number, bar: number, time: number) {
    switch (this.style) {
      case 'trap':
        this.playTrapStep(step, bar, time);
        break;
      case 'lofi':
        this.playLofiStep(step, bar, time);
        break;
      case 'drill':
        this.playDrillStep(step, bar, time);
        break;
      case 'boombap':
      default:
        this.playBoomBapStep(step, bar, time);
        break;
    }
  }

  // BOOM BAP PATTERN:
  // Kick: step 0, step 10, sometimes step 6
  // Snare: step 4, step 12 (Beats 2 & 4)
  // Closed Hat: Every even step (0, 2, 4, 6, 8, 10, 12, 14), with swing on offbeat
  private playBoomBapStep(step: number, bar: number, time: number) {
    const isKick = step === 0 || (step === 10) || (bar % 2 === 1 && step === 7);
    const isSnare = step === 4 || step === 12;
    const isHat = step % 2 === 0 || (step === 15 && bar === 3);

    if (isKick) this.synthesizeKick(time, 150, 42, 0.35, 1.0);
    if (isSnare) this.synthesizeSnare(time, 0.18, 200, 0.85);
    if (isHat) this.synthesizeHat(time, step === 12 ? 0.1 : 0.04, 0.5);
  }

  // TRAP PATTERN:
  // 808 Sub Kick on 0, 8, and syncopations
  // Snare on beat 3 (step 8)
  // Rapid hi-hats with rolls on step 14-15
  private playTrapStep(step: number, bar: number, time: number) {
    const is808 = step === 0 || step === 6 || (bar % 2 === 1 && step === 11);
    const isSnare = step === 8;
    const isHat = true; // Every 16th

    if (is808) this.synthesize808(time, 0.5, 0.95);
    if (isSnare) this.synthesizeTrapSnare(time, 0.9);
    if (isHat) {
      const isRoll = (bar === 3 && step >= 12);
      this.synthesizeHat(time, isRoll ? 0.02 : 0.03, isRoll ? 0.7 : 0.4);
    }
  }

  // LO-FI PATTERN:
  // Muffled kick, lazy soft snare, warm swing
  private playLofiStep(step: number, bar: number, time: number) {
    const isKick = step === 0 || step === 10;
    const isSnare = step === 4 || step === 12;
    const isHat = step % 2 === 0;

    if (isKick) this.synthesizeKick(time, 110, 36, 0.28, 0.7, true);
    if (isSnare) this.synthesizeLofiSnare(time, 0.65);
    if (isHat) this.synthesizeHat(time, 0.035, 0.3, true);
  }

  // DRILL PATTERN:
  // Gliding 808s, snappy rim/snare on step 6 and 14 (classic UK/NY drill bounce)
  private playDrillStep(step: number, bar: number, time: number) {
    const isKick = step === 0 || step === 3 || step === 10;
    const isDrillSnare = step === 6 || step === 14;
    const isHat = step % 2 === 0 || step === 7 || step === 15;

    if (isKick) this.synthesize808(time, 0.4, 0.9);
    if (isDrillSnare) this.synthesizeTrapSnare(time, 0.85);
    if (isHat) this.synthesizeHat(time, 0.03, 0.4);
  }

  // SYNTHESIZED DRUM VOICES

  // 1. Kick Drum (Pitch envelope sine sweep + transient click)
  private synthesizeKick(time: number, startFreq: number, endFreq: number, decay: number, gainVal: number, lofi: boolean = false) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.08);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    if (lofi) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, time);
      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.masterGain);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain);
    }

    osc.start(time);
    osc.stop(time + decay);
  }

  // 2. 808 Sub Kick (Deep sub-bass saturation)
  private synthesize808(time: number, decay: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.09);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + decay);
  }

  // 3. Snare Drum (Tonal body + noise burst through bandpass filter)
  private synthesizeSnare(time: number, decay: number, toneFreq: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;

    // Noise component
    const bufferSize = this.ctx.sampleRate * decay;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(800, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(gainVal, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + decay);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // Tonal body component
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(toneFreq, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);

    oscGain.gain.setValueAtTime(gainVal * 0.7, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noise.start(time);
    osc.start(time);
    noise.stop(time + decay);
    osc.stop(time + 0.1);
  }

  // 4. Trap Snare / Rimshot
  private synthesizeTrapSnare(time: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.06);

    oscGain.gain.setValueAtTime(gainVal * 0.8, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2200, time);
    noiseFilter.Q.setValueAtTime(2.0, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(gainVal, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noise.start(time);
    osc.start(time);
    noise.stop(time + 0.12);
    osc.stop(time + 0.08);
  }

  // 5. Lo-Fi Snare (Muffled, filtered noise)
  private synthesizeLofiSnare(time: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.15);
  }

  // 6. Hi-Hat (White noise through highpass resonant filter)
  private synthesizeHat(time: number, decay: number, gainVal: number, warm: boolean = false) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * decay;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = warm ? 'bandpass' : 'highpass';
    filter.frequency.setValueAtTime(warm ? 5000 : 8000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal * 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + decay);
  }

  // 7. Prompt Flash Audio Cue (Subtle synth ping when 4 bars complete)
  public playPromptFlashCue() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}
