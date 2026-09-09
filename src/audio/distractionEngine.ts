export type DistractionIntensity = 'low' | 'medium' | 'high';

export class DistractionEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private intensity: DistractionIntensity = 'medium';

  // Active nodes
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private bleepIntervalId: number | null = null;
  private babbleIntervalId: number | null = null;

  constructor() {}

  public async initAudio(existingCtx?: AudioContext): Promise<void> {
    if (existingCtx) {
      this.ctx = existingCtx;
    } else if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setIntensity(intensity: DistractionIntensity): void {
    this.intensity = intensity;
    if (this.isRunning && this.masterGain && this.ctx) {
      const targetGain = this.getTargetGain();
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  private getTargetGain(): number {
    switch (this.intensity) {
      case 'low': return 0.18;
      case 'medium': return 0.35;
      case 'high': return 0.55;
      default: return 0.35;
    }
  }

  public start(existingCtx?: AudioContext): void {
    if (this.isRunning) return;

    this.initAudio(existingCtx).then(() => {
      if (!this.ctx || !this.masterGain) return;
      this.isRunning = true;

      // Fade in master gain smoothly
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(this.getTargetGain(), now + 0.3);

      this.startContinuousNoise();
      this.startInterferenceBleeps();
      this.startCrowdBabble();
    });
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.bleepIntervalId !== null) {
      window.clearInterval(this.bleepIntervalId);
      this.bleepIntervalId = null;
    }
    if (this.babbleIntervalId !== null) {
      window.clearInterval(this.babbleIntervalId);
      this.babbleIntervalId = null;
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.2);

      window.setTimeout(() => {
        if (!this.isRunning) {
          try {
            if (this.noiseNode) {
              this.noiseNode.stop();
              this.noiseNode.disconnect();
              this.noiseNode = null;
            }
            if (this.lfoOsc) {
              this.lfoOsc.stop();
              this.lfoOsc.disconnect();
              this.lfoOsc = null;
            }
          } catch {
            // Safe cleanup
          }
        }
      }, 250);
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private startContinuousNoise(): void {
    if (!this.ctx || !this.masterGain) return;

    // Generate pinkish/white static buffer
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    // Sweeping resonant bandpass filter (simulating shifting radio frequencies)
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    this.noiseFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // LFO to drift the radio frequency
    this.lfoOsc = this.ctx.createOscillator();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.setValueAtTime(0.35, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(800, this.ctx.currentTime);

    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(this.noiseFilter.frequency);

    const staticGain = this.ctx.createGain();
    staticGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(staticGain);
    staticGain.connect(this.masterGain);

    this.lfoOsc.start();
    this.noiseNode.start();
  }

  private startInterferenceBleeps(): void {
    const fireBleep = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Random dissonant frequencies (e.g., telemetry, dialup modem beeps)
      const frequencies = [440, 523, 659, 830, 987, 1174, 1480, 1864, 2349, 3135];
      const freq1 = frequencies[Math.floor(Math.random() * frequencies.length)];
      const freq2 = frequencies[Math.floor(Math.random() * frequencies.length)];

      const now = this.ctx.currentTime;
      const duration = 0.08 + Math.random() * 0.15;

      osc.type = Math.random() > 0.5 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq1, now);
      osc.frequency.setValueAtTime(freq2, now + duration * 0.5);

      const bleepVol = this.intensity === 'high' ? 0.3 : (this.intensity === 'medium' ? 0.2 : 0.1);
      gain.gain.setValueAtTime(bleepVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3500, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    };

    const scheduleNextBleep = () => {
      if (!this.isRunning) return;
      fireBleep();
      const baseDelay = this.intensity === 'high' ? 400 : (this.intensity === 'medium' ? 800 : 1600);
      const nextDelay = baseDelay + Math.random() * baseDelay;
      this.bleepIntervalId = window.setTimeout(scheduleNextBleep, nextDelay);
    };

    scheduleNextBleep();
  }

  private startCrowdBabble(): void {
    const fireBabbleBurst = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;
      if (this.intensity === 'low') return; // Babble only on medium and high

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const formants = [300, 500, 700, 1200, 2000];
      const f1 = formants[Math.floor(Math.random() * formants.length)];

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(f1, this.ctx.currentTime);
      filter.Q.setValueAtTime(6.0, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const duration = 0.4 + Math.random() * 0.8;

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(130 + Math.random() * 90, now);
      osc1.frequency.linearRampToValueAtTime(160 + Math.random() * 80, now + duration);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(220 + Math.random() * 100, now);

      const vol = this.intensity === 'high' ? 0.25 : 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    };

    const scheduleNextBabble = () => {
      if (!this.isRunning) return;
      fireBabbleBurst();
      const delay = 600 + Math.random() * 1200;
      this.babbleIntervalId = window.setTimeout(scheduleNextBabble, delay);
    };

    scheduleNextBabble();
  }
}
