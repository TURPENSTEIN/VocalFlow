import React from 'react';

interface BeatVisualizerProps {
  currentBarInCycle: number; // 0, 1, 2, 3
  currentStep: number;        // 0 to 15 (16th notes in current bar)
  currentBeat: number;        // 0, 1, 2, 3
  totalBars: number;
  bpm: number;
  isPlaying: boolean;
}

export const BeatVisualizer: React.FC<BeatVisualizerProps> = ({
  currentBarInCycle,
  currentBeat,
  currentStep,
  totalBars,
  bpm,
  isPlaying,
}) => {
  // Cycle progress: 4 bars * 16 steps = 64 total steps in a 4-bar trial
  const currentCycleTotalSteps = currentBarInCycle * 16 + currentStep;
  const cycleProgressPercent = isPlaying ? Math.min(100, ((currentCycleTotalSteps + 1) / 64) * 100) : 0;
  const barsRemaining = 4 - (currentBarInCycle + 1);

  return (
    <div id="beat-visualizer" className="w-full bg-[#0a0f0d] border border-[#1b3323] rounded-lg p-4 font-mono">
      {/* Top Header: Bar Counter & Rhythm Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs border-b border-[#16271c] pb-2">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 uppercase tracking-widest text-[11px]">Bar Cycle:</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((barIdx) => {
              const isActive = isPlaying && currentBarInCycle === barIdx;
              const isPassed = isPlaying && currentBarInCycle > barIdx;
              return (
                <div
                  key={barIdx}
                  className={`px-2.5 py-1 text-xs font-bold rounded border transition-all duration-100 ${
                    isActive
                      ? 'border-[#00ff88] bg-[#00ff88]/15 text-[#00ff88] glow-green'
                      : isPassed
                      ? 'border-[#0f3822] bg-[#061d11] text-[#00ff88]/50'
                      : 'border-zinc-800 bg-[#080808] text-zinc-600'
                  }`}
                >
                  BAR {barIdx + 1}/4
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-zinc-500 text-[10px] block uppercase">Next Prompt Switch</span>
            <span className="text-[#00e5ff] font-bold">
              {isPlaying ? `${barsRemaining === 0 ? 'FINAL BAR' : `IN ${barsRemaining} BAR${barsRemaining === 1 ? '' : 'S'}`}` : 'STANDBY'}
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-3">
            <span className="text-zinc-500 text-[10px] block uppercase">Total Bars</span>
            <span className="text-zinc-300 font-semibold">{isPlaying ? totalBars : 0}</span>
          </div>
        </div>
      </div>

      {/* Beat Pulse Dots (Beats 1, 2, 3, 4) */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[0, 1, 2, 3].map((beatIdx) => {
          const isBeatActive = isPlaying && currentBeat === beatIdx;
          const isDownbeat = beatIdx === 0;

          return (
            <div
              key={beatIdx}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded border transition-all duration-75 ${
                isBeatActive
                  ? isDownbeat
                    ? 'border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.6)]'
                    : 'border-[#00e5ff] bg-[#00e5ff]/20 text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'border-[#131c17] bg-[#060a08] text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform duration-75 ${
                    isBeatActive ? 'scale-125' : 'scale-90 opacity-40'
                  } ${
                    isDownbeat
                      ? isBeatActive ? 'bg-[#00ff88]' : 'bg-emerald-950'
                      : isBeatActive ? 'bg-[#00e5ff]' : 'bg-cyan-950'
                  }`}
                />
                <span className="text-xs font-bold font-mono">
                  {isDownbeat ? 'BEAT 1 [ONE]' : `BEAT ${beatIdx + 1}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smooth 4-Bar Cycle Countdown Bar */}
      <div className="w-full bg-[#050806] rounded border border-[#14231a] p-1.5">
        <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1 px-1">
          <span>4-BAR COUNTDOWN PROGRESS</span>
          <span className="text-[#00ff88] font-bold">{Math.round(cycleProgressPercent)}%</span>
        </div>
        <div className="w-full bg-zinc-900/90 h-2.5 rounded overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-[#00ff88] transition-all duration-75 rounded"
            style={{ width: `${cycleProgressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
