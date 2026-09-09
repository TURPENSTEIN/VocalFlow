import React, { useRef, useState, useEffect } from 'react';
import { SessionAnalytics } from '../types';
import { downloadSingleFileHtml } from '../utils/exportSingleFile';
import {
  Trophy,
  Activity,
  Zap,
  Volume2,
  Download,
  RotateCcw,
  X,
  Play,
  Pause,
  BrainCircuit,
  FileCode,
  CheckCircle2,
  Radio
} from 'lucide-react';

interface SessionSummaryModalProps {
  analytics: SessionAnalytics;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  analytics,
  isOpen,
  onClose,
  onRestart,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  }, [analytics.audioUrl]);

  if (!isOpen) return null;

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioCurrentTime(time);
    }
  };

  const formatSecs = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate interference score
  const totalBarsSpoken = analytics.totalTrials * 4;
  const interferenceRating = analytics.distractionEnabled
    ? (analytics.distractionIntensity === 'high' ? 'EXPERT' : analytics.distractionIntensity === 'medium' ? 'ADVANCED' : 'MODERATE')
    : 'STANDARD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="session-summary-card"
        className="w-full max-w-2xl bg-[#080c09] border-2 border-[#1b3b28] rounded-xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,255,136,0.25)] text-zinc-200 font-mono relative my-8"
      >
        {/* Neon corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff88]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff88]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff88]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff88]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#14261b] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#00ff88]/15 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88]">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white text-glow-green tracking-tight">
                ROUND COMPLETE
              </h2>
              <p className="text-xs text-zinc-400">
                Session Analytics & Vocal Performance Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0c130f] border border-[#16291e] rounded-lg p-3">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <Zap size={12} className="text-[#00ff88]" />
              TOTAL TRIALS
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {analytics.totalTrials}
            </div>
            <div className="text-[10px] text-zinc-500">4-Bar Word Cycles</div>
          </div>

          <div className="bg-[#0c130f] border border-[#16291e] rounded-lg p-3">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <Activity size={12} className="text-[#00e5ff]" />
              AVERAGE BPM
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#00e5ff]">
              {analytics.averageBpm}
            </div>
            <div className="text-[10px] text-zinc-500">Rhythm Lock Tempo</div>
          </div>

          <div className="bg-[#0c130f] border border-[#16291e] rounded-lg p-3">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <Radio size={12} className="text-amber-400" />
              TOTAL BARS
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300">
              {totalBarsSpoken}
            </div>
            <div className="text-[10px] text-zinc-500">Delivered Measures</div>
          </div>

          <div className="bg-[#0c130f] border border-[#16291e] rounded-lg p-3">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center gap-1 mb-1">
              <BrainCircuit size={12} className="text-purple-400" />
              INTERFERENCE
            </div>
            <div className="text-xl sm:text-2xl font-bold text-purple-300">
              {interferenceRating}
            </div>
            <div className="text-[10px] text-zinc-500">Selective Attention</div>
          </div>
        </div>

        {/* Recorded Audio Review Section */}
        <div className="bg-[#0c130f] border border-[#182f22] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00ff88] uppercase tracking-wider">
              <Volume2 size={15} />
              <span>RECORDED VOCAL REVIEW</span>
            </div>
            {analytics.audioUrl && (
              <a
                id="btn-download-recording"
                href={analytics.audioUrl}
                download={`vocalflow-session-${Date.now()}.webm`}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#00ff88]/15 border border-[#00ff88]/40 hover:bg-[#00ff88] hover:text-black text-[#00ff88] text-xs font-bold rounded transition-colors"
              >
                <Download size={13} />
                DOWNLOAD AUDIO (.WEBM)
              </a>
            )}
          </div>

          {analytics.audioUrl ? (
            <div className="flex flex-col gap-3">
              <audio
                ref={audioRef}
                src={analytics.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlayingAudio(false)}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  id="btn-play-audio-review"
                  onClick={togglePlayAudio}
                  className="w-10 h-10 rounded-full bg-[#00ff88] text-black flex items-center justify-center font-bold hover:bg-[#1aff96] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.4)] cursor-pointer shrink-0"
                >
                  {isPlayingAudio ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 1}
                    step={0.1}
                    value={audioCurrentTime}
                    onChange={handleSeek}
                    className="w-full accent-[#00ff88] bg-zinc-800 h-2 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>{formatSecs(audioCurrentTime)}</span>
                    <span>{formatSecs(audioDuration)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-zinc-400 bg-black/30 rounded border border-dashed border-zinc-800">
              No audio recorded this session. Activate the <span className="text-[#00ff88] font-bold">MIC INPUT</span> toggle during your next round to record and review your vocals!
            </div>
          )}
        </div>

        {/* Word & Constraint Trials History */}
        <div className="mb-6">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#00ff88]" />
            TRIALS PROMPTS COMPLETED ({analytics.trials.length})
          </div>

          <div className="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {analytics.trials.map((trial, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded bg-[#070c09] border border-[#142319] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-zinc-500 font-bold w-5">#{idx + 1}</span>
                  <span className="font-extrabold text-[#00ff88] tracking-wider text-sm">
                    {trial.word}
                  </span>
                  <span className="text-[11px] text-zinc-400 border-l border-zinc-800 pl-2">
                    {trial.constraint.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
                    {trial.bpm} BPM
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#14261b]">
          <button
            id="btn-export-standalone-html"
            onClick={downloadSingleFileHtml}
            className="flex items-center gap-2 px-3 py-2 text-xs border border-zinc-700 bg-zinc-900/90 text-zinc-300 hover:text-white hover:border-[#00ff88] rounded-md transition-colors"
            title="Download complete single-file HTML/CSS/JS version"
          >
            <FileCode size={14} className="text-[#00ff88]" />
            DOWNLOAD STANDALONE HTML (SINGLE-FILE)
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              CLOSE
            </button>
            <button
              id="btn-restart-round"
              onClick={onRestart}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] text-black font-bold text-xs sm:text-sm rounded-md hover:bg-[#1aff96] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] cursor-pointer"
            >
              <RotateCcw size={15} />
              START NEW ROUND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
