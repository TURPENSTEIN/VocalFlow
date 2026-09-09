import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DrumEngine } from './audio/drumEngine';
import { DistractionEngine, DistractionIntensity } from './audio/distractionEngine';
import { MicRecorder } from './audio/micRecorder';
import { WORD_PROMPTS, CONSTRAINT_PROMPTS, promptQueue } from './data/prompts';
import { WordPrompt, ConstraintPrompt, DrumStyle, SessionTrial, SessionAnalytics, TrainingMode } from './types';
import { PromptDisplay } from './components/PromptDisplay';
import { BeatVisualizer } from './components/BeatVisualizer';
import { AudioOscilloscope } from './components/AudioOscilloscope';
import { ControlsPanel } from './components/ControlsPanel';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { downloadSingleFileHtml } from './utils/exportSingleFile';
import { DiscordBanner } from './components/DiscordBanner';
import { Zap, ShieldAlert, FileCode, HelpCircle, Flame } from 'lucide-react';

const ROUND_DURATION_SECONDS = 120; // 2 minutes round

export default function App() {
  // Audio Engine instances
  const drumEngineRef = useRef<DrumEngine | null>(null);
  const distractionEngineRef = useRef<DistractionEngine | null>(null);
  const micRecorderRef = useRef<MicRecorder | null>(null);

  // App & Rhythm State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(90);
  const [drumStyle, setDrumStyle] = useState<DrumStyle>('boombap');
  const [volume, setVolume] = useState<number>(0.85);

  // Beat & Bar tracking
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [currentBarInCycle, setCurrentBarInCycle] = useState<number>(0);
  const [totalBars, setTotalBars] = useState<number>(0);

  // Training Mode & Word Configuration
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('classic');
  const [wordCount, setWordCount] = useState<number>(1);
  const [showRhymeLaunchpad, setShowRhymeLaunchpad] = useState<boolean>(true);

  // Prompts
  const [currentWords, setCurrentWords] = useState<WordPrompt[]>([WORD_PROMPTS[0]]);
  const [currentConstraint, setCurrentConstraint] = useState<ConstraintPrompt>(CONSTRAINT_PROMPTS[0]);
  const [flashKey, setFlashKey] = useState<number>(0);

  // Mic & Recording
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  // Distraction mode (Interference Control)
  const [distractionEnabled, setDistractionEnabled] = useState<boolean>(false);
  const [distractionIntensity, setDistractionIntensity] = useState<DistractionIntensity>('medium');

  // Round Timer & Analytics
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(ROUND_DURATION_SECONDS);
  const [sessionTrials, setSessionTrials] = useState<SessionTrial[]>([]);
  const [summaryAnalytics, setSummaryAnalytics] = useState<SessionAnalytics | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(false);

  // Initialize Audio Engines on first mount
  useEffect(() => {
    const drum = new DrumEngine(90, 'boombap');
    const distraction = new DistractionEngine();
    const mic = new MicRecorder();

    drumEngineRef.current = drum;
    distractionEngineRef.current = distraction;
    micRecorderRef.current = mic;

    return () => {
      drum.stop();
      distraction.stop();
      mic.cleanup();
    };
  }, []);

  // Cycle to a fresh set of words and constraint from the non-repeating queue
  const cyclePrompts = useCallback(() => {
    // Determine number of words based on mode or user setting
    const count = trainingMode === 'multi_word' ? Math.max(2, wordCount) : wordCount;
    const nextWords = promptQueue.getNextWords(count);
    const nextConstraint = promptQueue.getNextConstraint();

    setCurrentWords(nextWords);
    setCurrentConstraint(nextConstraint);
    setFlashKey((prev) => prev + 1);

    // Audio cue ping on 4-bar trigger
    if (drumEngineRef.current) {
      drumEngineRef.current.playPromptFlashCue();
    }

    // Record trial into session history
    const tabooList = nextWords.flatMap((w) => w.tabooWords || []);
    setSessionTrials((prev) => [
      ...prev,
      {
        barNumber: totalBars + 4,
        words: nextWords.map((w) => w.word),
        tabooWords: trainingMode === 'taboo' || trainingMode === 'gauntlet' ? tabooList : undefined,
        constraint: nextConstraint,
        bpm,
        timestamp: Date.now(),
        mode: trainingMode,
      },
    ]);
  }, [totalBars, bpm, wordCount, trainingMode]);

  // Hook up Drum Engine step & 4-bar boundary callbacks
  useEffect(() => {
    const drum = drumEngineRef.current;
    if (!drum) return;

    drum.onStep = (step, beat, barInCycle, bars) => {
      setCurrentStep(step);
      setCurrentBeat(beat);
      setCurrentBarInCycle(barInCycle);
      setTotalBars(bars);
    };

    drum.onFourBarsTrigger = () => {
      cyclePrompts();
    };
  }, [cyclePrompts]);

  // Round countdown timer
  useEffect(() => {
    let timerId: number | null = null;
    if (isPlaying && timeRemainingSeconds > 0) {
      timerId = window.setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId !== null) clearInterval(timerId);
    };
  }, [isPlaying, timeRemainingSeconds]);

  // Handle Start Round
  const handleStart = async () => {
    if (!drumEngineRef.current) return;

    // Reset round state if starting fresh
    if (timeRemainingSeconds <= 0) {
      setTimeRemainingSeconds(ROUND_DURATION_SECONDS);
      setSessionTrials([]);
    }

    // Initial trial entry if empty
    if (sessionTrials.length === 0) {
      const tabooList = currentWords.flatMap((w) => w.tabooWords || []);
      setSessionTrials([
        {
          barNumber: 0,
          words: currentWords.map((w) => w.word),
          tabooWords: trainingMode === 'taboo' || trainingMode === 'gauntlet' ? tabooList : undefined,
          constraint: currentConstraint,
          bpm,
          timestamp: Date.now(),
          mode: trainingMode,
        },
      ]);
    }

    // Start drum synthesizer
    drumEngineRef.current.setBpm(bpm);
    drumEngineRef.current.setStyle(drumStyle);
    drumEngineRef.current.setVolume(volume);
    drumEngineRef.current.start();

    // Start distraction engine if armed
    if (distractionEnabled && distractionEngineRef.current) {
      distractionEngineRef.current.setIntensity(distractionIntensity);
      distractionEngineRef.current.start();
    }

    // Start microphone recorder if toggled on
    if (isMicActive && micRecorderRef.current) {
      await micRecorderRef.current.startRecording();
    }

    setIsPlaying(true);
  };

  // Handle Stop Engine
  const handleStop = () => {
    if (drumEngineRef.current) {
      drumEngineRef.current.stop();
    }
    if (distractionEngineRef.current) {
      distractionEngineRef.current.stop();
    }
    setIsPlaying(false);
  };

  // End Round and display Session Summary
  const endRound = async () => {
    handleStop();

    // Stop mic recording and retrieve audio blob
    let recordedBlob: Blob | null = null;
    let recordedUrl: string | null = null;

    if (micRecorderRef.current && isMicActive) {
      const result = await micRecorderRef.current.stopRecording();
      recordedBlob = result.blob;
      recordedUrl = result.url;
    }

    // Compile session analytics
    const avgBpm = sessionTrials.length > 0
      ? Math.round(sessionTrials.reduce((acc, curr) => acc + curr.bpm, 0) / sessionTrials.length)
      : bpm;

    const analytics: SessionAnalytics = {
      roundDurationSeconds: ROUND_DURATION_SECONDS - timeRemainingSeconds,
      totalTrials: Math.max(1, sessionTrials.length),
      averageBpm: avgBpm,
      drumStyle,
      trainingMode,
      distractionEnabled,
      distractionIntensity,
      trials: [...sessionTrials],
      audioBlob: recordedBlob,
      audioUrl: recordedUrl,
      completedAt: new Date(),
    };

    setSummaryAnalytics(analytics);
    setIsSummaryOpen(true);
  };

  // BPM change handler
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (drumEngineRef.current) {
      drumEngineRef.current.setBpm(newBpm);
    }
  };

  // Drum style change handler
  const handleDrumStyleChange = (style: DrumStyle) => {
    setDrumStyle(style);
    if (drumEngineRef.current) {
      drumEngineRef.current.setStyle(style);
    }
  };

  // Volume change handler
  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (drumEngineRef.current) {
      drumEngineRef.current.setVolume(vol);
    }
  };

  // Toggle Distraction Mode
  const handleToggleDistraction = () => {
    const nextState = !distractionEnabled;
    setDistractionEnabled(nextState);

    if (distractionEngineRef.current) {
      if (nextState && isPlaying) {
        distractionEngineRef.current.setIntensity(distractionIntensity);
        distractionEngineRef.current.start();
      } else {
        distractionEngineRef.current.stop();
      }
    }
  };

  // Distraction Intensity Change
  const handleChangeDistractionIntensity = (intensity: DistractionIntensity) => {
    setDistractionIntensity(intensity);
    if (distractionEngineRef.current) {
      distractionEngineRef.current.setIntensity(intensity);
    }
  };

  // Toggle Microphone
  const handleToggleMic = async () => {
    if (!micRecorderRef.current) return;

    if (!isMicActive) {
      const granted = await micRecorderRef.current.requestPermission();
      if (granted) {
        setIsMicActive(true);
        if (isPlaying) {
          await micRecorderRef.current.startRecording();
        }
      }
    } else {
      if (isPlaying) {
        await micRecorderRef.current.stopRecording();
      }
      setIsMicActive(false);
    }
  };

  // Change Training Mode
  const handleChangeTrainingMode = (mode: TrainingMode) => {
    setTrainingMode(mode);
    if (mode === 'multi_word' && wordCount === 1) {
      setWordCount(2);
    }
    // Refresh prompts with new mode configuration
    setTimeout(() => cyclePrompts(), 50);
  };

  // Change Word Count
  const handleChangeWordCount = (count: number) => {
    setWordCount(count);
    const nextWords = promptQueue.getNextWords(count);
    setCurrentWords(nextWords);
  };

  // Restart new round
  const handleRestartNewRound = () => {
    setIsSummaryOpen(false);
    setTimeRemainingSeconds(ROUND_DURATION_SECONDS);
    setSessionTrials([]);
    setTotalBars(0);
    cyclePrompts();
    handleStart();
  };

  // Keyboard Shortcuts (Space to play/pause, M for mic, D for distraction, N for next prompt)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) handleStop();
        else handleStart();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMic();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleToggleDistraction();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        cyclePrompts();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMicActive, distractionEnabled, distractionIntensity, cyclePrompts]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex flex-col items-center selection:bg-[#00ff88]/30 selection:text-[#00ff88] relative">
      {/* Top Discord Community Banner linking to MINDBUILDING without duplicate invite link */}
      <DiscordBanner />

      {/* Background scanline effect */}
      <div className="fixed inset-0 pointer-events-none scanline-overlay z-0 opacity-30" />

      {/* Main Canvas Container */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col gap-4 p-3 sm:p-6 pb-12 my-auto">
        {/* App Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183324] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00ff88]/15 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                  VOCALFLOW
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88]">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Monospace Speech-Generation & Rhythm Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs flex-wrap">
            {distractionEnabled && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[10px] sm:text-[11px] animate-pulse">
                <ShieldAlert size={13} />
                <span>INTERFERENCE ON ({distractionIntensity.toUpperCase()})</span>
              </div>
            )}

            {/* Quick Rules Guide Toggle */}
            <button
              onClick={() => setShowQuickGuide(!showQuickGuide)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/70 text-zinc-300 hover:text-white rounded text-xs transition-colors cursor-pointer"
              title="Toggle Quick Start Rules"
            >
              <HelpCircle size={13} className="text-[#00e5ff]" />
              <span>GUIDE</span>
            </button>

            {/* Standalone Single-File HTML Download */}
            <button
              id="btn-header-export-single-file"
              onClick={downloadSingleFileHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1d3d29] hover:border-[#00ff88] bg-[#0c1611] text-zinc-300 hover:text-white rounded text-xs transition-colors cursor-pointer"
              title="Download standalone, dependency-free single-file HTML version"
            >
              <FileCode size={13} className="text-[#00ff88]" />
              <span className="hidden sm:inline">EXPORT</span> SINGLE-FILE HTML
            </button>
          </div>
        </header>

        {/* Quick Guide Card when toggled */}
        {showQuickGuide && (
          <div className="bg-[#080d0a] border border-[#1b3826] rounded-xl p-4 text-xs font-mono text-zinc-300 flex flex-col gap-2 relative shadow-lg">
            <div className="flex items-center justify-between font-bold text-[#00ff88] text-[11px] uppercase tracking-wider border-b border-[#162a1e] pb-1.5">
              <span>⚡ VOCALFLOW RHYTHM INSTRUCTION MANUAL</span>
              <button onClick={() => setShowQuickGuide(false)} className="text-zinc-500 hover:text-white cursor-pointer px-1">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-black/40 p-3 rounded-lg border border-[#14231a]">
                <span className="text-[#00ff88] font-bold block mb-1">1. LOCK INTO THE TEMPO</span>
                <span className="text-zinc-400 leading-relaxed">Press Start Round or tap Spacebar. Synthesized drums start looping cleanly at your chosen BPM.</span>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-[#14231a]">
                <span className="text-[#00e5ff] font-bold block mb-1">2. WEAVE THE CONSTRAINTS</span>
                <span className="text-zinc-400 leading-relaxed">Speak or rap continuously in time with the metronome, incorporating the mandatory word(s) and cadence pattern.</span>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-[#14231a]">
                <span className="text-amber-300 font-bold block mb-1">3. ADAPT EVERY 4 BARS</span>
                <span className="text-zinc-400 leading-relaxed">Every 4 bars, the prompt flashes! In Taboo Mode, avoid the forbidden words. Review vocal playback at round end!</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Audio Oscilloscope */}
        <section aria-label="Audio Visualizer">
          <AudioOscilloscope
            micRecorder={micRecorderRef.current}
            isRecording={isPlaying && isMicActive}
            isBeatPlaying={isPlaying}
            activeBeat={currentBeat}
          />
        </section>

        {/* Prompt & Constraint Display Cards (Optimized for mobile & toggleable rhyme launchpad) */}
        <section aria-label="Current Word & Rhythm Constraint">
          <PromptDisplay
            currentWords={currentWords}
            currentConstraint={currentConstraint}
            flashKey={flashKey}
            onManualCycle={cyclePrompts}
            isPlaying={isPlaying}
            trainingMode={trainingMode}
            showRhymeLaunchpad={showRhymeLaunchpad}
            onToggleRhymeLaunchpad={() => setShowRhymeLaunchpad(!showRhymeLaunchpad)}
            wordCount={wordCount}
          />
        </section>

        {/* 4-Bar Step & Beat Visualizer */}
        <section aria-label="Beat & Measure Metronome">
          <BeatVisualizer
            currentBarInCycle={currentBarInCycle}
            currentBeat={currentBeat}
            currentStep={currentStep}
            totalBars={totalBars}
            bpm={bpm}
            isPlaying={isPlaying}
          />
        </section>

        {/* Playback Controls, Mode Selector, BPM Slider, Distraction Mode, Microphone */}
        <section aria-label="Playback & Engine Controls">
          <ControlsPanel
            isPlaying={isPlaying}
            onStart={handleStart}
            onStop={handleStop}
            bpm={bpm}
            onBpmChange={handleBpmChange}
            drumStyle={drumStyle}
            onDrumStyleChange={handleDrumStyleChange}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            isMicActive={isMicActive}
            onToggleMic={handleToggleMic}
            distractionEnabled={distractionEnabled}
            onToggleDistraction={handleToggleDistraction}
            distractionIntensity={distractionIntensity}
            onChangeDistractionIntensity={handleChangeDistractionIntensity}
            timeRemainingSeconds={timeRemainingSeconds}
            roundTotalSeconds={ROUND_DURATION_SECONDS}
            onEndRoundEarly={endRound}
            trainingMode={trainingMode}
            onChangeTrainingMode={handleChangeTrainingMode}
            wordCount={wordCount}
            onChangeWordCount={handleChangeWordCount}
            showRhymeLaunchpad={showRhymeLaunchpad}
            onToggleRhymeLaunchpad={() => setShowRhymeLaunchpad(!showRhymeLaunchpad)}
          />
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 border-t border-[#142319] pt-3 pb-6 gap-2">
          <div>
            Speak continuously without halting. 4 Bars = <span className="text-[#00e5ff] font-bold">{((16 * 60) / bpm).toFixed(1)}s</span> per cycle.
          </div>
          <div className="font-mono">
            Shortcuts: <kbd className="text-[#00ff88] bg-black px-1 rounded border border-zinc-800">SPACE</kbd> Play/Pause • <kbd className="text-[#00ff88] bg-black px-1 rounded border border-zinc-800">M</kbd> Mic • <kbd className="text-[#00ff88] bg-black px-1 rounded border border-zinc-800">D</kbd> Distraction • <kbd className="text-[#00ff88] bg-black px-1 rounded border border-zinc-800">N</kbd> Skip
          </div>
        </footer>
      </main>

      {/* 2-Minute Session Summary & Vocal Review Modal */}
      {summaryAnalytics && (
        <SessionSummaryModal
          analytics={summaryAnalytics}
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          onRestart={handleRestartNewRound}
        />
      )}
    </div>
  );
}
