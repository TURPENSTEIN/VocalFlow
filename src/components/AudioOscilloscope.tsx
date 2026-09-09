import React, { useEffect, useRef } from 'react';
import { MicRecorder } from '../audio/micRecorder';

interface AudioOscilloscopeProps {
  micRecorder: MicRecorder | null;
  isRecording: boolean;
  isBeatPlaying: boolean;
  activeBeat: number;
}

export const AudioOscilloscope: React.FC<AudioOscilloscopeProps> = ({
  micRecorder,
  isRecording,
  isBeatPlaying,
  activeBeat,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      animFrameId.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#080c0a';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid overlay
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.07)';
      ctx.lineWidth = 1;
      const gridStep = 24;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const waveData = isRecording && micRecorder ? micRecorder.getWaveformData() : null;

      if (waveData && waveData.length > 0) {
        // Draw live microphone waveform
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const sliceWidth = width / waveData.length;
        let x = 0;

        for (let i = 0; i < waveData.length; i++) {
          const v = waveData[i] / 128.0; // 0 to 2
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        // Ambient rhythm oscilloscope sine wave reacting to active beat
        phase += 0.06;
        const beatAmplitude = isBeatPlaying ? (activeBeat === 0 ? 22 : 12) : 4;

        ctx.lineWidth = 1.8;
        ctx.strokeStyle = isBeatPlaying ? '#00e5ff' : '#334155';
        ctx.shadowColor = isBeatPlaying ? '#00e5ff' : 'transparent';
        ctx.shadowBlur = isBeatPlaying ? 6 : 0;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const angle = (x / width) * Math.PI * 8 + phase;
          const y = height / 2 + Math.sin(angle) * beatAmplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [micRecorder, isRecording, isBeatPlaying, activeBeat]);

  return (
    <div id="audio-oscilloscope-container" className="relative w-full rounded-md border border-[#1a2e22] bg-[#080c0a] overflow-hidden p-1">
      <div className="flex items-center justify-between px-3 py-1 text-xs border-b border-[#14231a] text-[#00ff88]">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : (isBeatPlaying ? 'bg-[#00ff88]' : 'bg-zinc-600')}`} />
          <span className="font-mono tracking-wider font-semibold">
            {isRecording ? 'MIC LIVE [RECORDING]' : (isBeatPlaying ? 'DRUM ENGINE [ACTIVE]' : 'OSCILLOSCOPE [IDLE]')}
          </span>
        </div>
        <div className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest">
          {isRecording ? 'AUDIO INPUT: CAPTURING' : 'STANDBY MODE'}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={85}
        className="w-full h-[85px] block"
      />
    </div>
  );
};
