import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WordPrompt, ConstraintPrompt } from '../types';
import { Sparkles, Compass, Lightbulb, RefreshCw } from 'lucide-react';

interface PromptDisplayProps {
  currentWord: WordPrompt;
  currentConstraint: ConstraintPrompt;
  flashKey: number; // changes on every 4-bar trigger to trigger flash animation
  onManualCycle?: () => void;
  isPlaying: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({
  currentWord,
  currentConstraint,
  flashKey,
  onManualCycle,
  isPlaying,
}) => {
  return (
    <div id="prompt-display-container" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Central High-Visibility Prompt Card (Span 7 cols) */}
      <motion.div
        key={`word-${flashKey}`}
        initial={{ scale: 0.96, opacity: 0.8, borderColor: '#00ff88' }}
        animate={{ scale: 1, opacity: 1, borderColor: '#1b3b28' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="lg:col-span-7 bg-[#070b09] border-2 border-[#1b3b28] rounded-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between"
      >
        {/* Neon corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff88]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff88]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff88]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff88]" />

        {/* Top Tag & Actions */}
        <div className="flex items-center justify-between border-b border-[#14261b] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88] rounded">
              MANDATORY WORD
            </span>
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-mono">
              CATEGORY: <span className="text-zinc-300">{currentWord.category}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentWord.phonetics && (
              <span className="text-zinc-400 font-mono text-xs px-2 py-0.5 bg-black/40 rounded border border-zinc-800">
                {currentWord.phonetics}
              </span>
            )}
            {onManualCycle && (
              <button
                id="btn-skip-prompt"
                onClick={onManualCycle}
                title="Skip to next prompt manually"
                className="p-1 text-zinc-500 hover:text-[#00ff88] transition-colors rounded hover:bg-zinc-800"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Central Giant Word Display */}
        <div className="my-auto py-4 text-center">
          <motion.div
            key={currentWord.word}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h1
              id="active-mandatory-word"
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,255,136,0.35)] select-none uppercase"
            >
              {currentWord.word}
            </h1>
          </motion.div>

          <p className="mt-2 text-zinc-400 text-xs sm:text-sm font-mono italic">
            "{currentWord.vibe}"
          </p>
        </div>

        {/* Bottom Rhyme Spark Assistance */}
        <div className="border-t border-[#14261b] pt-3 mt-4">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-2">
            <Lightbulb size={13} className="text-[#00ff88]" />
            <span className="font-semibold uppercase tracking-wider">Rhyme Launchpad:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentWord.rhymeHints.map((hint, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs font-mono bg-[#0c1611] text-[#00ff88] border border-[#1a3826] rounded hover:border-[#00ff88] transition-colors"
              >
                ~{hint}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Secondary Constraint Card: Rhyme Pattern or Structural Meter (Span 5 cols) */}
      <motion.div
        key={`constraint-${flashKey}`}
        initial={{ scale: 0.96, opacity: 0.8, borderColor: '#00e5ff' }}
        animate={{ scale: 1, opacity: 1, borderColor: '#193946' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="lg:col-span-5 bg-[#060a0d] border-2 border-[#193946] rounded-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between"
      >
        {/* Neon corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />

        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-[#14242e] pb-3 mb-4">
          <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest bg-[#00e5ff]/15 border border-[#00e5ff]/40 text-[#00e5ff] rounded">
            {currentConstraint.badge}
          </span>
          <span className="text-zinc-500 text-[11px] font-mono uppercase">
            TARGET 4-BAR FORMAT
          </span>
        </div>

        {/* Constraint Title & Formula */}
        <div className="my-auto py-2">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={18} className="text-[#00e5ff]" />
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white text-glow-cyan tracking-tight">
              {currentConstraint.title}
            </h2>
          </div>

          <div className="mt-3 p-3 rounded bg-[#091217] border border-[#16303d]">
            <div className="text-[11px] text-zinc-400 uppercase font-semibold mb-1">Execution Formula:</div>
            <div className="text-sm font-mono font-bold text-[#00e5ff]">
              {currentConstraint.formula}
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed">
            {currentConstraint.description}
          </p>
        </div>

        {/* Rhyme / Meter Guide Bar */}
        <div className="border-t border-[#14242e] pt-3 mt-4 bg-black/30 p-2.5 rounded border border-[#13232c]">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Rhythm Cadence Blueprint:</div>
          <div className="text-xs font-mono text-zinc-200">
            {currentConstraint.guide}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
