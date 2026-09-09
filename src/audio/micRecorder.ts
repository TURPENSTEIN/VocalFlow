export class MicRecorder {
  private stream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private dataArray: Uint8Array | null = null;
  private isRecording: boolean = false;
  private currentObjectUrl: string | null = null;

  public async requestPermission(): Promise<boolean> {
    try {
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: false, // keep vocal nuances
            autoGainControl: true,
          },
        });
      }
      this.setupAnalyser();
      return true;
    } catch (err) {
      console.warn('Microphone permission denied or unavailable', err);
      return false;
    }
  }

  private setupAnalyser() {
    if (!this.stream) return;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    source.connect(this.analyser);

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  public async startRecording(): Promise<boolean> {
    const hasPerm = await this.requestPermission();
    if (!hasPerm || !this.stream) return false;

    this.audioChunks = [];
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    try {
      // Find supported mime type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        '',
      ];
      let selectedType = '';
      for (const type of mimeTypes) {
        if (!type || MediaRecorder.isTypeSupported(type)) {
          selectedType = type;
          break;
        }
      }

      const options = selectedType ? { mimeType: selectedType } : undefined;
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250); // Slice every 250ms
      this.isRecording = true;
      return true;
    } catch (e) {
      console.error('Failed to start MediaRecorder', e);
      return false;
    }
  }

  public stopRecording(): Promise<{ blob: Blob | null; url: string | null }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.isRecording = false;
        resolve({ blob: null, url: null });
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        this.currentObjectUrl = url;
        resolve({ blob, url });
      };

      this.mediaRecorder.stop();
    });
  }

  public getWaveformData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }

  public getLiveRmsVolume(): number {
    const wave = this.getWaveformData();
    if (!wave) return 0;
    let sum = 0;
    for (let i = 0; i < wave.length; i++) {
      const val = (wave[i] - 128) / 128.0;
      sum += val * val;
    }
    return Math.min(1, Math.sqrt(sum / wave.length) * 3.5);
  }

  public cleanup() {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}
