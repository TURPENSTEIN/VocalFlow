import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WordPrompt, ConstraintPrompt, TrainingMode, MobilePromptView } from '../types';
import {
  Compass,
  Lightbulb,
  RefreshCw,
  Eye,
  EyeOff,
  AlertOctagon,
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface PromptDisplayProps {
  currentWords: WordPrompt[];
  currentConstraint: ConstraintPrompt;
  flashKey: number;
  onManualCycle?: () => void;
  isPlaying: boolean;
  trainingMode: TrainingMode;
  showRhymeLaunchpad: boolean;
  onToggleRhymeLaunchpad: () => void;
  wordCount: number;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({
  currentWords,
  currentConstraint,
  flashKey,
  onManualCycle,
  isPlaying,
  trainingMode,
  showRhymeLaunchpad,
  onToggleRhymeLaunchpad,
  wordCount,
}) => {
  // Mobile prompt view filter: 'both' | 'word' | 'constraint'
  const [mobileView, setMobileView] = useState<MobilePromptView>('both');

  // Active word (primary)
  const primaryWord = currentWords[0] || {
    word: 'FLOW',
    category: 'Rhythm',
    rhymeHints: ['glow', 'show', 'grow'],
    vibe: 'Continuous vocal delivery',
    tabooWords: ['STOP', 'BREAK'],
  };

  // Collect all taboo words from all active words
  const allTabooWords = currentWords.flatMap((w) => w.tabooWords || []);
  const uniqueTabooWords = Array.from(new Set(allTabooWords)).slice(0, 4);

  return (
    <div id="prompt-display-container" className="w-full flex flex-col gap-3 font-mono">
      {/* Mobile-Friendly Segmented View Switcher (Only visible on small screens to solve the mobile visibility problem) */}
      <div className="flex sm:hidden items-center justify-between bg-[#080c09] border border-[#16291d] p-1.5 rounded-lg text-xs">
        <span className="text-[11px] text-zinc-400 flex items-center gap-1 pl-1">
          <Smartphone size={12} className="text-[#00ff88]" />
          MOBILE VIEW:
        </span>
        <div className="flex items-center gap-1">
          {(['both', 'word', 'constraint'] as MobilePromptView[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setMobileView(mode)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                mobileView === mode
                  ? 'bg-[#00ff88] text-black font-extrabold'
                  : 'text-zinc-400 hover:text-white bg-black/40'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* =========================================================================
            CARD 1: CENTRAL HIGH-VISIBILITY PROMPT CARD (MANDATORY WORD(S))
        ========================================================================= */}
        <motion.div
          key={`word-card-${flashKey}`}
          initial={{ scale: 0.98, opacity: 0.85, borderColor: '#00ff88' }}
          animate={{ scale: 1, opacity: 1, borderColor: '#1b3b28' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`bg-[#070b09] border-2 border-[#1b3b28] rounded-xl p-4 sm:p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all ${
            mobileView === 'constraint' ? 'hidden sm:flex' : 'flex'
          } ${
            mobileView === 'word' ? 'lg:col-span-12' : 'lg:col-span-7'
          }`}
        >
          {/* Neon Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff88]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff88]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff88]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff88]" />

          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-[#14261b] pb-2.5 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88] rounded">
                {currentWords.length > 1 ? `${currentWords.length} MANDATORY WORDS` : 'MANDATORY WORD'}
              </span>
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider hidden sm:inline">
                CAT: <span className="text-zinc-300">{primaryWord.category}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {primaryWord.phonetics && (
                <span className="text-zinc-400 text-[11px] px-2 py-0.5 bg-black/40 rounded border border-zinc-800 hidden md:inline">
                  {primaryWord.phonetics}
                </span>
              )}
              {/* Toggle Rhyme Launchpad button */}
              <button
                id="btn-toggle-rhyme-launchpad"
                onClick={onToggleRhymeLaunchpad}
                className="flex items-center gap-1 px-2 py-1 bg-[#0c1611] hover:bg-[#12241b] border border-[#1b3826] text-[10px] sm:text-[11px] text-zinc-300 hover:text-[#00ff88] rounded transition-colors"
                title={showRhymeLaunchpad ? 'Hide Rhyme Launchpad' : 'Show Rhyme Launchpad'}
              >
                {showRhymeLaunchpad ? <EyeOff size={12} className="text-zinc-400" /> : <Eye size={12} className="text-[#00ff88]" />}
                <span className="hidden sm:inline">LAUNCHPAD</span>
              </button>

              {/* Skip / Next Prompt button */}
              {onManualCycle && (
                <button
                  id="btn-skip-prompt"
                  onClick={onManualCycle}
                  title="Skip to next prompt manually [N]"
                  className="p-1.5 text-zinc-400 hover:text-[#00ff88] transition-colors rounded hover:bg-zinc-800"
                >
                  <RefreshCw size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Central Prominent Word Display */}
          <div className="my-auto py-2 sm:py-4 text-center">
            {currentWords.length === 1 ? (
              <motion.div
                key={primaryWord.word}
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h1
                  id="active-mandatory-word"
                  className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,255,136,0.35)] select-none uppercase break-words"
                >
                  {primaryWord.word}
                </h1>
                <p className="mt-1.5 text-zinc-400 text-xs sm:text-sm italic">
                  "{primaryWord.vibe}"
                </p>
              </motion.div>
            ) : (
              /* Multi-word mode display */
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
                {currentWords.map((item, idx) => (
                  <motion.div
                    key={`${item.word}-${idx}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="flex flex-col items-center p-2 sm:p-3 bg-black/40 border border-[#1b3826] rounded-lg min-w-[140px]"
                  >
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">WORD #{idx + 1}</span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#00ff88] text-glow-green uppercase">
                      {item.word}
                    </span>
                    <span className="text-[10px] text-zinc-400 italic mt-0.5">"{item.vibe}"</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Toggleable Rhyme Launchpad Assistance */}
          <AnimatePresence>
            {showRhymeLaunchpad && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-[#14261b] pt-2.5 mt-3 overflow-hidden"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb size={13} className="text-[#00ff88]" />
                    <span className="font-semibold uppercase tracking-wider">Rhyme Launchpad:</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">Phonetic matches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {primaryWord.rhymeHints.map((hint, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-mono bg-[#0c1611] text-[#00ff88] border border-[#1a3826] rounded hover:border-[#00ff88] transition-colors"
                    >
                      ~{hint}
                    </span>
                  ))}
                  {currentWords.length > 1 && currentWords[1] && (
                    <>
                      <span className="text-zinc-600 text-xs self-center">•</span>
                      {currentWords[1].rhymeHints.slice(0, 2).map((hint, idx) => (
                        <span
                          key={`hint-2-${idx}`}
                          className="px-2 py-0.5 text-xs font-mono bg-[#0c1611] text-[#00e5ff] border border-[#163542] rounded hover:border-[#00e5ff] transition-colors"
                        >
                          ~{hint}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* =========================================================================
            CARD 2: SECONDARY CONSTRAINT CARD OR TABOO WORDS CARD
        ========================================================================= */}
        <motion.div
          key={`constraint-card-${flashKey}`}
          initial={{ scale: 0.98, opacity: 0.85, borderColor: trainingMode === 'taboo' ? '#ff3355' : '#00e5ff' }}
          animate={{ scale: 1, opacity: 1, borderColor: trainingMode === 'taboo' ? '#44141d' : '#193946' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`bg-[#060a0d] border-2 rounded-xl p-4 sm:p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all ${
            mobileView === 'word' ? 'hidden sm:flex' : 'flex'
          } ${
            mobileView === 'constraint' ? 'lg:col-span-12' : 'lg:col-span-5'
          } ${
            trainingMode === 'taboo' ? 'border-[#44141d] bg-[#0d0708]' : 'border-[#193946] bg-[#060a0d]'
          }`}
        >
          {/* Neon Corner Accents */}
          {trainingMode === 'taboo' ? (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff3355]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff3355]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff3355]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff3355]" />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />
            </>
          )}

          {/* Header Badge */}
          <div className="flex items-center justify-between border-b pb-2.5 mb-3 border-zinc-800">
            <span
              className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded ${
                trainingMode === 'taboo'
                  ? 'bg-red-950/60 border border-red-500/60 text-red-400'
                  : 'bg-[#00e5ff]/15 border border-[#00e5ff]/40 text-[#00e5ff]'
              }`}
            >
              {trainingMode === 'taboo' ? '⛔ FORBIDDEN TABOO MODE' : currentConstraint.badge}
            </span>
            <span className="text-zinc-500 text-[10px] sm:text-[11px] uppercase">
              {trainingMode === 'taboo' ? 'INHIBITION TEST' : '4-BAR BLUEPRINT'}
            </span>
          </div>

          {/* Card Body: Taboo Mode vs Structural Constraint */}
          {trainingMode === 'taboo' ? (
            <div className="my-auto py-2">
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <AlertOctagon size={18} />
                <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                  WORDS YOU CANNOT SAY
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Flow continuously without uttering any of these taboo words. Test your cognitive control:
              </p>

              {/* Forbidden Words Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2">
                {uniqueTabooWords.map((forbidden, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center p-2 rounded bg-red-950/40 border border-red-500/50 text-red-300 font-extrabold text-sm sm:text-base tracking-wider text-glow-red"
                  >
                    🚫 {forbidden}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Standard or Gauntlet Constraint display */
            <div className="my-auto py-1 sm:py-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Compass size={18} className="text-[#00e5ff]" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-white text-glow-cyan tracking-tight">
                  {currentConstraint.title}
                </h2>
              </div>

              <div className="mt-2 p-2.5 rounded bg-[#091217] border border-[#16303d]">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold mb-0.5">Execution Formula:</div>
                <div className="text-xs sm:text-sm font-mono font-bold text-[#00e5ff]">
                  {currentConstraint.formula}
                </div>
              </div>

              <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentConstraint.description}
              </p>

              {/* If Gauntlet mode, also display the Taboo forbidden words inside this card! */}
              {trainingMode === 'gauntlet' && uniqueTabooWords.length > 0 && (
                <div className="mt-2.5 p-2 rounded bg-red-950/30 border border-red-500/40 text-xs">
                  <span className="text-[10px] font-bold text-red-400 block uppercase">
                    ⛔ BONUS TABOO RESTRICTION:
                  </span>
                  <div className="flex gap-2 mt-1">
                    {uniqueTabooWords.slice(0, 2).map((tb, idx) => (
                      <span key={idx} className="text-red-300 font-bold bg-red-900/30 px-1.5 py-0.5 rounded border border-red-700/50">
                        🚫 {tb}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guide Blueprint Footer */}
          <div className="border-t border-[#14242e] pt-2.5 mt-3 bg-black/30 p-2 rounded border border-[#13232c]">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
              {trainingMode === 'taboo' ? 'Inhibition Tip:' : 'Cadence Blueprint:'}
            </div>
            <div className="text-xs font-mono text-zinc-200 truncate sm:whitespace-normal">
              {trainingMode === 'taboo'
                ? 'Use metaphors, phonetics, and circumlocution to convey the concept without saying the banned words!'
                : currentConstraint.guide}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
