import React from 'react';
import { DrumStyle } from '../types';
import { DistractionIntensity } from '../audio/distractionEngine';
import { Play, Square, Mic, MicOff, Volume2, VolumeX, AlertTriangle, Radio, Sliders, Timer } from 'lucide-react';

interface ControlsPanelProps {
  isPlaying: boolean;
  onStart: () => void;
  onStop: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  drumStyle: DrumStyle;
  onDrumStyleChange: (style: DrumStyle) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMicActive: boolean;
  onToggleMic: () => void;
  distractionEnabled: boolean;
  onToggleDistraction: () => void;
  distractionIntensity: DistractionIntensity;
  onChangeDistractionIntensity: (intensity: DistractionIntensity) => void;
  timeRemainingSeconds: number;
  roundTotalSeconds: number;
  onEndRoundEarly: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isPlaying,
  onStart,
  onStop,
  bpm,
  onBpmChange,
  drumStyle,
  onDrumStyleChange,
  volume,
  onVolumeChange,
  isMicActive,
  onToggleMic,
  distractionEnabled,
  onToggleDistraction,
  distractionIntensity,
  onChangeDistractionIntensity,
  timeRemainingSeconds,
  roundTotalSeconds,
  onEndRoundEarly,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div id="controls-panel" className="w-full bg-[#080c09] border border-[#1b3323] rounded-xl p-4 sm:p-5 font-mono">
      {/* Primary Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14261b] pb-4 mb-4">
        {/* Play/Stop Main Engine */}
        <div className="flex items-center gap-3">
          {!isPlaying ? (
            <button
              id="btn-start-round"
              onClick={onStart}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#00ff88] text-black font-bold text-sm sm:text-base rounded-md hover:bg-[#1aff96] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] cursor-pointer"
              title="Start 2-minute round [Space]"
            >
              <Play size={18} fill="currentColor" />
              <span className="hidden sm:inline text-xs opacity-75 bg-black/20 px-1.5 py-0.5 rounded font-mono">SPACE</span>
              <span>START ROUND (2 MIN)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-stop-round"
                onClick={onStop}
                className="flex items-center gap-2 px-5 py-3 bg-[#ff3355] text-white font-bold text-sm sm:text-base rounded-md hover:bg-[#ff4d6d] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,51,85,0.4)] cursor-pointer"
                title="Stop drum engine [Space]"
              >
                <span className="hidden sm:inline text-xs opacity-80 bg-white/20 px-1.5 py-0.5 rounded font-mono">SPACE</span>
                <Square size={18} fill="currentColor" />
                <span>STOP ENGINE</span>
              </button>
              <button
                id="btn-end-round-early"
                onClick={onEndRoundEarly}
                className="px-3 py-3 border border-zinc-700 bg-zinc-900/90 text-zinc-300 hover:text-white hover:border-zinc-500 text-xs font-semibold rounded-md transition-colors"
                title="Finish round and view analytics"
              >
                FINISH & REVIEW
              </button>
            </div>
          )}

          {/* Microphone Recording Toggle */}
          <button
            id="btn-toggle-mic"
            onClick={onToggleMic}
            className={`flex items-center gap-2 px-4 py-3 rounded-md font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
              isMicActive
                ? 'bg-red-950/80 border-red-500 text-red-200 glow-red'
                : 'bg-[#0e1612] border-[#1c3325] text-zinc-300 hover:text-white hover:border-[#00ff88]/50'
            }`}
            title="Toggle microphone recording [M]"
          >
            <span className="hidden sm:inline text-[10px] opacity-70 bg-black/40 px-1.5 py-0.5 rounded font-mono border border-zinc-700">M</span>
            {isMicActive ? <Mic size={16} className="text-red-400 animate-pulse" /> : <MicOff size={16} className="text-zinc-500" />}
            <span>{isMicActive ? 'MIC RECORDING [ON]' : 'MIC INPUT [OFF]'}</span>
          </button>
        </div>

        {/* Round Timer Indicator */}
        <div className="flex items-center gap-3 bg-[#0c130f] px-3.5 py-2 rounded-md border border-[#16271c]">
          <Timer size={16} className={isPlaying ? 'text-[#00ff88] animate-pulse' : 'text-zinc-500'} />
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase">Round Clock:</span>
            <span className={`text-sm sm:text-base font-bold font-mono ${timeRemainingSeconds <= 15 && isPlaying ? 'text-red-400 animate-pulse' : 'text-zinc-200'}`}>
              {formatTime(timeRemainingSeconds)} / {formatTime(roundTotalSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Second Row: BPM, Drum Groove Style, Volume */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* BPM Slider (Range 60 to 120) */}
        <div className="md:col-span-5 bg-[#050806] p-3 rounded-lg border border-[#142319]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
              <Sliders size={13} className="text-[#00ff88]" />
              DRUM TEMPO (BPM)
            </span>
            <div className="flex items-center gap-1">
              <button
                id="btn-bpm-minus"
                onClick={() => onBpmChange(Math.max(60, bpm - 5))}
                className="px-1.5 py-0.5 flex items-center justify-center bg-zinc-800 text-zinc-300 hover:text-white rounded text-xs font-bold"
                title="-5 BPM"
              >
                -5
              </button>
              <span className="text-base font-bold text-[#00ff88] px-1.5 min-w-[50px] text-center">
                {bpm}
              </span>
              <button
                id="btn-bpm-plus"
                onClick={() => onBpmChange(Math.min(120, bpm + 5))}
                className="px-1.5 py-0.5 flex items-center justify-center bg-zinc-800 text-zinc-300 hover:text-white rounded text-xs font-bold"
                title="+5 BPM"
              >
                +5
              </button>
            </div>
          </div>
          <input
            id="bpm-slider"
            type="range"
            min={60}
            max={120}
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-full accent-[#00ff88] bg-zinc-800 h-1.5 rounded cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 gap-1">
            {[
              { label: '70 Chill', val: 70 },
              { label: '90 BoomBap', val: 90 },
              { label: '105 Trap', val: 105 },
              { label: '120 Fast', val: 120 },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => onBpmChange(preset.val)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                  bpm === preset.val
                    ? 'border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88]'
                    : 'border-zinc-800 bg-black/40 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drum Groove Style Selector */}
        <div className="md:col-span-4 bg-[#050806] p-3 rounded-lg border border-[#142319]">
          <div className="text-xs text-zinc-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
            <Radio size={13} className="text-[#00e5ff]" />
            DRUM TRACK STYLE
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(['boombap', 'trap', 'lofi', 'drill'] as DrumStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => onDrumStyleChange(style)}
                className={`py-1.5 text-[11px] font-bold uppercase rounded border transition-colors ${
                  drumStyle === style
                    ? 'border-[#00e5ff] bg-[#00e5ff]/20 text-[#00e5ff]'
                    : 'border-zinc-800 bg-[#0a0a0a] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Master Drum Volume */}
        <div className="md:col-span-3 bg-[#050806] p-3 rounded-lg border border-[#142319]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
              {volume === 0 ? <VolumeX size={14} className="text-zinc-500" /> : <Volume2 size={14} className="text-[#00ff88]" />}
              DRUM GAIN
            </span>
            <span className="text-zinc-300 font-bold">{Math.round(volume * 100)}%</span>
          </div>
          <input
            id="drum-volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full accent-[#00ff88] bg-zinc-800 h-1.5 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Desirable Difficulty Section: Distraction Mode Toggle & Interference Options */}
      <div className="mt-4 pt-3 border-t border-[#14261b] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-distraction"
            onClick={onToggleDistraction}
            className={`flex items-center gap-2 px-3.5 py-2 rounded border font-semibold text-xs transition-all cursor-pointer ${
              distractionEnabled
                ? 'bg-amber-950/70 border-amber-500 text-amber-300 glow-amber'
                : 'bg-[#0a0d0a] border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle distraction noise [D]"
          >
            <span className="hidden sm:inline text-[10px] opacity-70 bg-black/40 px-1.5 py-0.5 rounded font-mono border border-zinc-700">D</span>
            <AlertTriangle size={15} className={distractionEnabled ? 'text-amber-400 animate-bounce' : 'text-zinc-500'} />
            <span>DISTRACTION MODE: {distractionEnabled ? 'ARMED [CHAOTIC NOISE]' : 'OFF [CLEAR AUDIO]'}</span>
          </button>

          {distractionEnabled && (
            <div className="flex items-center gap-1 bg-[#120f07] p-1 rounded border border-amber-900/60">
              <span className="text-[10px] text-amber-500/80 px-1.5 uppercase font-bold">INTERFERENCE LEVEL:</span>
              {(['low', 'medium', 'high'] as DistractionIntensity[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onChangeDistractionIntensity(lvl)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border transition-colors ${
                    distractionIntensity === lvl
                      ? 'border-amber-400 bg-amber-400/25 text-amber-300'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-[11px] text-zinc-500 font-mono italic">
          Selective Attention & Interference Control Engine
        </div>
      </div>
    </div>
  );
};
