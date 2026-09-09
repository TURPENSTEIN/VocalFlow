export type RhymeOrMeterType = 'rhyme' | 'meter';

export interface WordPrompt {
  id: string;
  word: string;
  phonetics?: string;
  category: 'concrete' | 'abstract' | 'action' | 'cyber';
  rhymeHints: string[];
  vibe: string;
}

export interface ConstraintPrompt {
  id: string;
  type: RhymeOrMeterType;
  title: string;
  badge: string;
  formula: string;
  description: string;
  guide: string;
}

export type DrumStyle = 'boombap' | 'trap' | 'lofi' | 'drill';

export interface SessionTrial {
  barNumber: number;
  word: string;
  constraint: ConstraintPrompt;
  bpm: number;
  timestamp: number;
}

export interface SessionAnalytics {
  roundDurationSeconds: number;
  totalTrials: number;
  averageBpm: number;
  drumStyle: DrumStyle;
  distractionEnabled: boolean;
  distractionIntensity: 'low' | 'medium' | 'high';
  trials: SessionTrial[];
  audioBlob: Blob | null;
  audioUrl: string | null;
  completedAt: Date;
}
