import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DrumEngine } from './audio/drumEngine';
import { DistractionEngine, DistractionIntensity } from './audio/distractionEngine';
import { MicRecorder } from './audio/micRecorder';
import { WORD_PROMPTS, CONSTRAINT_PROMPTS } from './data/prompts';
import { WordPrompt, ConstraintPrompt, DrumStyle, SessionTrial, SessionAnalytics } from './types';
import { PromptDisplay } from './components/PromptDisplay';
import { BeatVisualizer } from './components/BeatVisualizer';
import { AudioOscilloscope } from './components/AudioOscilloscope';
import { ControlsPanel } from './components/ControlsPanel';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { downloadSingleFileHtml } from './utils/exportSingleFile';
import { DiscordBanner } from './components/DiscordBanner';
import { Zap, Volume2, ShieldAlert, Sparkles, FileCode, Info, HelpCircle } from 'lucide-react';

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

  // Prompts
  const [currentWord, setCurrentWord] = useState<WordPrompt>(WORD_PROMPTS[0]);
  const [currentConstraint, setCurrentConstraint] = useState<ConstraintPrompt>(CONSTRAINT_PROMPTS[0]);
  const [flashKey, setFlashKey] = useState<number>(0);

  // Mic & Recording
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  // Distraction mode
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

  // Cycle to a random new prompt and constraint
  const cyclePrompts = useCallback(() => {
    const randomWordIdx = Math.floor(Math.random() * WORD_PROMPTS.length);
    const randomConstraintIdx = Math.floor(Math.random() * CONSTRAINT_PROMPTS.length);

    const nextWord = WORD_PROMPTS[randomWordIdx];
    const nextConstraint = CONSTRAINT_PROMPTS[randomConstraintIdx];

    setCurrentWord(nextWord);
    setCurrentConstraint(nextConstraint);
    setFlashKey((prev) => prev + 1);

    // Audio cue
    if (drumEngineRef.current) {
      drumEngineRef.current.playPromptFlashCue();
    }

    // Record trial into session history
    setSessionTrials((prev) => [
      ...prev,
      {
        barNumber: totalBars + 4,
        word: nextWord.word,
        constraint: nextConstraint,
        bpm,
        timestamp: Date.now(),
      },
    ]);
  }, [totalBars, bpm]);

  // Hook up Drum Engine callbacks
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
            // Round finished!
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

    // Initial trial entry
    if (sessionTrials.length === 0) {
      setSessionTrials([
        {
          barNumber: 0,
          word: currentWord.word,
          constraint: currentConstraint,
          bpm,
          timestamp: Date.now(),
        },
      ]);
    }

    // Start drum engine
    drumEngineRef.current.setBpm(bpm);
    drumEngineRef.current.setStyle(drumStyle);
    drumEngineRef.current.setVolume(volume);
    drumEngineRef.current.start();

    // Distraction engine
    if (distractionEnabled && distractionEngineRef.current) {
      distractionEngineRef.current.setIntensity(distractionIntensity);
      distractionEngineRef.current.start();
    }

    // Mic recording if requested
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

    // Compile analytics
    const avgBpm = sessionTrials.length > 0
      ? Math.round(sessionTrials.reduce((acc, curr) => acc + curr.bpm, 0) / sessionTrials.length)
      : bpm;

    const analytics: SessionAnalytics = {
      roundDurationSeconds: ROUND_DURATION_SECONDS - timeRemainingSeconds,
      totalTrials: Math.max(1, sessionTrials.length),
      averageBpm: avgBpm,
      drumStyle,
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

  // Restart new round
  const handleRestartNewRound = () => {
    setIsSummaryOpen(false);
    setTimeRemainingSeconds(ROUND_DURATION_SECONDS);
    setSessionTrials([]);
    setTotalBars(0);
    cyclePrompts();
    handleStart();
  };

  // Keyboard Shortcuts (Space to play/pause, M to toggle mic, D for distraction, N for next prompt)
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
      {/* Top Discord Community Banner linking to MINDBUILDING at discord.gg/brain */}
      <DiscordBanner />

      {/* Subtle background scanline effect */}
      <div className="fixed inset-0 pointer-events-none scanline-overlay z-0 opacity-40" />

      {/* Main App Canvas Container */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col gap-5 p-3 sm:p-6 pb-12 my-auto">
        {/* App Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183324] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00ff88]/15 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <Zap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                  VOCALFLOW
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88]">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Speech-Generation & Freestyle Rhythm Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {distractionEnabled && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[11px] animate-pulse">
                <ShieldAlert size={13} />
                <span>INTERFERENCE ON ({distractionIntensity.toUpperCase()})</span>
              </div>
            )}

            {/* Quick How-it-Works guide toggle */}
            <button
              onClick={() => setShowQuickGuide(!showQuickGuide)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/70 text-zinc-300 hover:text-white rounded text-xs transition-colors"
              title="Toggle Quick Start Rules"
            >
              <HelpCircle size={13} className="text-[#00e5ff]" />
              <span>GUIDE</span>
            </button>

            <button
              id="btn-header-export-single-file"
              onClick={downloadSingleFileHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1d3d29] hover:border-[#00ff88] bg-[#0c1611] text-zinc-300 hover:text-white rounded text-xs transition-colors"
              title="Download runnable single-file HTML version"
            >
              <FileCode size={13} className="text-[#00ff88]" />
              <span className="hidden sm:inline">EXPORT</span> SINGLE-FILE HTML
            </button>
          </div>
        </header>

        {/* Intuitive 3-Step Quick Guide when toggled */}
        {showQuickGuide && (
          <div className="bg-[#080d0a] border border-[#1b3826] rounded-lg p-4 text-xs font-mono text-zinc-300 flex flex-col gap-2 relative shadow-lg">
            <div className="flex items-center justify-between font-bold text-[#00ff88] text-[11px] uppercase tracking-wider border-b border-[#162a1e] pb-1.5">
              <span>⚡ VOCALFLOW QUICK START GUIDE (FREESTYLE RHYTHM TRAINING)</span>
              <button onClick={() => setShowQuickGuide(false)} className="text-zinc-500 hover:text-white cursor-pointer px-1">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-black/40 p-3 rounded border border-[#14231a]">
                <span className="text-[#00ff88] font-bold block mb-1">1. START ENGINE [SPACE]</span>
                <span className="text-zinc-400 leading-relaxed">Press Start Round or tap Spacebar to trigger drum synthesis. Enable your microphone to record your vocals.</span>
              </div>
              <div className="bg-black/40 p-3 rounded border border-[#14231a]">
                <span className="text-[#00e5ff] font-bold block mb-1">2. DELIVER ON BEAT</span>
                <span className="text-zinc-400 leading-relaxed">Speak or rap continuously in time with the metronome, weaving the mandatory word and rhyme scheme into your flow.</span>
              </div>
              <div className="bg-black/40 p-3 rounded border border-[#14231a]">
                <span className="text-amber-300 font-bold block mb-1">3. ADAPT EVERY 4 BARS</span>
                <span className="text-zinc-400 leading-relaxed">Every 4 bars, a new prompt flashes. At round completion, review your stats and listen back to your vocal recording!</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Audio Oscilloscope & VU Monitor */}
        <section aria-label="Audio Visualizer">
          <AudioOscilloscope
            micRecorder={micRecorderRef.current}
            isRecording={isPlaying && isMicActive}
            isBeatPlaying={isPlaying}
            activeBeat={currentBeat}
          />
        </section>

        {/* Central High-Visibility Prompt & Constraint Cards */}
        <section aria-label="Current Word & Rhythm Constraint">
          <PromptDisplay
            currentWord={currentWord}
            currentConstraint={currentConstraint}
            flashKey={flashKey}
            onManualCycle={cyclePrompts}
            isPlaying={isPlaying}
          />
        </section>

        {/* Dynamic 4-Bar Step & Beat Visualizer */}
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

        {/* Drum Controls, BPM Slider, Distraction Mode, Microphone */}
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
          />
        </section>

        {/* Instructional Legend Footer */}
        <footer className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 border-t border-[#142319] pt-3 pb-6">
          <div className="flex items-center gap-1.5">
            <Info size={13} className="text-zinc-500" />
            <span>Speak or rap continuously. Every 4 bars, the engine triggers a fresh mandatory word and rhyme constraint.</span>
          </div>
          <div className="font-mono text-zinc-500">
            Tempo: <span className="text-[#00ff88]">{bpm} BPM</span> | 4 Bars = <span className="text-[#00e5ff]">{((16 * 60) / bpm).toFixed(1)}s</span> cycle
          </div>
        </footer>
      </main>

      {/* 2-Minute Session Summary & Recording Review Modal */}
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
