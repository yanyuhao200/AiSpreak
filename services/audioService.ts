
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  async startRecording(onVisualData?: (data: Uint8Array) => void): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.audioContext = new AudioContext();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (this.analyser && this.dataArray && this.mediaRecorder?.state === 'recording') {
          this.analyser.getByteFrequencyData(this.dataArray);
          onVisualData?.(new Uint8Array(this.dataArray));
          requestAnimationFrame(update);
        }
      };

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.start();
      update();
    } catch (err) {
      console.error('Mic access denied or error:', err);
      throw err;
    }
  }

  async stopRecording(): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return;
      
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Cleanup
        this.mediaRecorder?.stream.getTracks().forEach(t => t.stop());
        this.audioContext?.close();
        this.mediaRecorder = null;
        
        resolve({ blob, url });
      };
      
      this.mediaRecorder.stop();
    });
  }
}

export const audioService = new AudioService();
