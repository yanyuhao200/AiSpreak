
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  async startRecording(onData: (data: Uint8Array) => void): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (this.analyser && this.dataArray) {
        this.analyser.getByteFrequencyData(this.dataArray);
        onData(new Uint8Array(this.dataArray));
        if (this.mediaRecorder?.state === 'recording') {
          requestAnimationFrame(update);
        }
      }
    };

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.start();
    update();
  }

  async stopRecording(): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return;
      
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
        
        // Cleanup stream
        this.mediaRecorder?.stream.getTracks().forEach(t => t.stop());
        this.audioContext?.close();
      };
      
      this.mediaRecorder.stop();
    });
  }
}

export const audioService = new AudioService();
