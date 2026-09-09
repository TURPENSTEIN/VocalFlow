export class MicRecorder {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private freqArray: Uint8Array | null = null;

  public async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // keep user voice raw and responsive
          autoGainControl: true,
        },
      });
      this.mediaStream = stream;
      this.setupAnalyser(stream);
      return true;
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      return false;
    }
  }

  private setupAnalyser(stream: MediaStream): void {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    this.sourceNode = this.audioCtx.createMediaStreamSource(stream);
    this.sourceNode.connect(this.analyser);
    // Note: Do NOT connect analyser to audioCtx.destination to prevent feedback howl!

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.freqArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  public async startRecording(): Promise<boolean> {
    if (this.isRecording) return true;

    if (!this.mediaStream) {
      const granted = await this.requestPermission();
      if (!granted || !this.mediaStream) return false;
    }

    try {
      this.audioChunks = [];
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      let selectedMime = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      this.mediaRecorder = selectedMime
        ? new MediaRecorder(this.mediaStream, { mimeType: selectedMime })
        : new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250); // Emit chunk every 250ms
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error('Error starting MediaRecorder:', err);
      return false;
    }
  }

  public async stopRecording(): Promise<{ blob: Blob | null; url: string | null }> {
    if (!this.isRecording || !this.mediaRecorder) {
      return { blob: null, url: null };
    }

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        this.isRecording = false;
        resolve({ blob: null, url: null });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        this.isRecording = false;
        resolve({ blob, url });
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('MediaRecorder stop error:', e);
        this.isRecording = false;
        resolve({ blob: null, url: null });
      }
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getWaveformData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }

  public getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.freqArray) return null;
    this.analyser.getByteFrequencyData(this.freqArray);
    return this.freqArray;
  }

  public getAudioLevel(): number {
    const data = this.getFrequencyData();
    if (!data || data.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / (data.length * 255); // 0 to 1
  }

  public cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.isRecording = false;
  }
}
