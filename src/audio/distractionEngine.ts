export type DistractionIntensity = 'low' | 'medium' | 'high';

export class DistractionEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private intensity: DistractionIntensity = 'medium';
  private masterGain: GainNode | null = null;

  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private filterLfo: OscillatorNode | null = null;

  private beepIntervalId: number | null = null;

  constructor(initialIntensity: DistractionIntensity = 'medium') {
    this.intensity = initialIntensity;
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.updateGain();
  }

  public setIntensity(intensity: DistractionIntensity) {
    this.intensity = intensity;
    this.updateGain();
  }

  private updateGain() {
    if (!this.masterGain || !this.ctx) return;
    let target = 0.15;
    if (this.intensity === 'low') target = 0.08;
    if (this.intensity === 'high') target = 0.28;

    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
  }

  public start() {
    this.initAudio();
    if (this.isRunning || !this.ctx || !this.masterGain) return;
    this.isRunning = true;

    // 1. Continuous Swept Pink/White Noise (Radio Static & Crowd Murmur)
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate Pink Noise
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

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    // Sweeping bandpass filter to emulate changing interference radio signals
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    this.noiseFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO modulating filter frequency
    this.filterLfo = this.ctx.createOscillator();
    this.filterLfo.frequency.setValueAtTime(0.35, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(600, this.ctx.currentTime);

    this.filterLfo.connect(lfoGain);
    lfoGain.connect(this.noiseFilter.frequency);

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.masterGain);

    this.noiseSource.start();
    this.filterLfo.start();

    // 2. Unpredictable Asynchronous Telemetry Beeps and Chirps
    this.scheduleRandomInterferenceBeeps();
  }

  private scheduleRandomInterferenceBeeps = () => {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;

    // Play short sporadic beep
    this.playTelemetryChirp();

    // Next trigger between 1.5s and 4.5s
    const rate = this.intensity === 'high' ? 1200 : this.intensity === 'medium' ? 2400 : 3800;
    const delay = Math.random() * rate + 800;

    this.beepIntervalId = window.setTimeout(this.scheduleRandomInterferenceBeeps, delay);
  };

  private playTelemetryChirp() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqs = [520, 680, 880, 1100, 1400, 1750, 420];
    const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = Math.random() > 0.5 ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(chosenFreq, now);

    // Sometimes pitch sweep
    if (Math.random() > 0.4) {
      osc.frequency.exponentialRampToValueAtTime(chosenFreq * (Math.random() > 0.5 ? 1.5 : 0.6), now + 0.08);
    }

    const duration = 0.05 + Math.random() * 0.08;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  public stop() {
    this.isRunning = false;

    if (this.beepIntervalId !== null) {
      clearTimeout(this.beepIntervalId);
      this.beepIntervalId = null;
    }

    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
      } catch {}
      this.noiseSource = null;
    }

    if (this.filterLfo) {
      try {
        this.filterLfo.stop();
        this.filterLfo.disconnect();
      } catch {}
      this.filterLfo = null;
    }
  }
}
