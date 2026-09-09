export interface WordPrompt {
  word: string;
  category: string;
  phonetics?: string;
  rhymeHints: string[];
  vibe: string;
  tabooWords: string[]; // Words you cannot say in Taboo / Gauntlet mode
}

export interface ConstraintPrompt {
  id: string;
  title: string;
  badge: string;
  formula: string;
  description: string;
  guide: string;
  type: 'rhyme' | 'meter' | 'cadence';
}

export type DrumStyle = 'boombap' | 'trap' | 'lofi' | 'drill';

export type TrainingMode = 'classic' | 'taboo' | 'multi_word' | 'gauntlet';

export type MobilePromptView = 'both' | 'word' | 'constraint';

export interface SessionTrial {
  barNumber: number;
  words: string[];
  tabooWords?: string[];
  constraint: ConstraintPrompt;
  bpm: number;
  timestamp: number;
  mode: TrainingMode;
}

export interface SessionAnalytics {
  roundDurationSeconds: number;
  totalTrials: number;
  averageBpm: number;
  drumStyle: DrumStyle;
  trainingMode: TrainingMode;
  distractionEnabled: boolean;
  distractionIntensity: 'low' | 'medium' | 'high';
  trials: SessionTrial[];
  audioBlob: Blob | null;
  audioUrl: string | null;
  completedAt: Date;
}
