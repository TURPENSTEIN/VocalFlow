import { WordPrompt, ConstraintPrompt } from '../types';

export const WORD_PROMPTS: WordPrompt[] = [
  { id: 'w1', word: 'NEON', phonetics: '/ˈniː.ɒn/', category: 'cyber', rhymeHints: ['freon', 'beyond', 'aeon', 'dawn', 'pawn'], vibe: 'Glow in darkness' },
  { id: 'w2', word: 'GRAVITY', phonetics: '/ˈɡræv.ə.ti/', category: 'abstract', rhymeHints: ['cavity', 'sanity', 'depravity', 'clarity'], vibe: 'Heavy pull downward' },
  { id: 'w3', word: 'VELOCITY', phonetics: '/vəˈlɒs.ə.ti/', category: 'cyber', rhymeHints: ['atrocity', 'ferocity', 'reciprocity', 'velocity'], vibe: 'Unstoppable momentum' },
  { id: 'w4', word: 'ECHO', phonetics: '/ˈek.oʊ/', category: 'abstract', rhymeHints: ['gecko', 'retro', 'metro', 'shadow', 'ghetto'], vibe: 'Reflected frequency' },
  { id: 'w5', word: 'CIRCUIT', phonetics: '/ˈsɜː.kɪt/', category: 'cyber', rhymeHints: ['worth it', 'surface', 'nervous', 'purpose'], vibe: 'Closed power loop' },
  { id: 'w6', word: 'HORIZON', phonetics: '/həˈraɪ.zən/', category: 'concrete', rhymeHints: ['rising', 'poison', 'verizon', 'surprising'], vibe: 'Distant boundary' },
  { id: 'w7', word: 'ANVIL', phonetics: '/ˈæn.vɪl/', category: 'concrete', rhymeHints: ['candid', 'dismantle', 'handle', 'stand still'], vibe: 'Tempered under pressure' },
  { id: 'w8', word: 'SYNAPSE', phonetics: '/ˈsaɪ.næps/', category: 'cyber', rhymeHints: ['collapse', 'time lapse', 'relapse', 'traps'], vibe: 'Spark between neurons' },
  { id: 'w9', word: 'SHADOW', phonetics: '/ˈʃæd.oʊ/', category: 'abstract', rhymeHints: ['meadow', 'shallow', 'narrow', 'arrow'], vibe: 'Obscured silhouette' },
  { id: 'w10', word: 'VOLTAGE', phonetics: '/ˈvoʊl.tɪdʒ/', category: 'cyber', rhymeHints: ['dosage', 'hostage', 'postage', 'shortage'], vibe: 'Electric potential' },
  { id: 'w11', word: 'MIRROR', phonetics: '/ˈmɪr.ər/', category: 'concrete', rhymeHints: ['clearer', 'nearer', 'terror', 'bearer'], vibe: 'Self reflection' },
  { id: 'w12', word: 'TEMPEST', phonetics: '/ˈtem.pɪst/', category: 'concrete', rhymeHints: ['relentless', 'endless', 'breathless', 'defenseless'], vibe: 'Storm raging' },
  { id: 'w13', word: 'CIPHER', phonetics: '/ˈsaɪ.fər/', category: 'cyber', rhymeHints: ['hyper', 'sniper', 'viper', 'survivor'], vibe: 'Encrypted truth' },
  { id: 'w14', word: 'FRACTURE', phonetics: '/ˈfræk.tʃər/', category: 'action', rhymeHints: ['rapture', 'capture', 'structure', 'puncture'], vibe: 'Split down the middle' },
  { id: 'w15', word: 'ORBIT', phonetics: '/ˈɔːr.bɪt/', category: 'abstract', rhymeHints: ['absorb it', 'morb it', 'doorstep', 'forge it'], vibe: 'Endless elliptical loop' },
  { id: 'w16', word: 'METEOR', phonetics: '/ˈmiː.ti.ɔːr/', category: 'concrete', rhymeHints: ['bleeder', 'leader', 'speed up', 'fever'], vibe: 'Blazing through atmosphere' },
  { id: 'w17', word: 'LABYRINTH', phonetics: '/ˈlæb.ə.rɪnθ/', category: 'abstract', rhymeHints: ['aberrant', 'phantom', 'canvas', 'pattern'], vibe: 'Infinite maze' },
  { id: 'w18', word: 'PULSE', phonetics: '/pʌls/', category: 'abstract', rhymeHints: ['impulse', 'repulse', 'results', 'insults'], vibe: 'Rhythmic heartbeat' },
  { id: 'w19', word: 'STATIC', phonetics: '/ˈstæt.ɪk/', category: 'cyber', rhymeHints: ['erratic', 'automatic', 'dramatic', 'fanatic'], vibe: 'White noise hiss' },
  { id: 'w20', word: 'RADAR', phonetics: '/ˈreɪ.dɑːr/', category: 'cyber', rhymeHints: ['hater', 'greater', 'flavor', 'crater'], vibe: 'Sweeping detection beam' },
  { id: 'w21', word: 'EMBER', phonetics: '/ˈem.bər/', category: 'concrete', rhymeHints: ['remember', 'december', 'surrender', 'splendor'], vibe: 'Glowing remains of fire' },
  { id: 'w22', word: 'PARADOX', phonetics: '/ˈpær.ə.dɒks/', category: 'abstract', rhymeHints: ['pair of docks', 'matter facts', 'battle axe', 'shatter box'], vibe: 'Contradiction in truth' },
  { id: 'w23', word: 'IGNITE', phonetics: '/ɪɡˈnaɪt/', category: 'action', rhymeHints: ['midnight', 'insight', 'highlight', 'fight night'], vibe: 'Catching sudden flame' },
  { id: 'w24', word: 'ALCHEMY', phonetics: '/ˈæl.kə.mi/', category: 'abstract', rhymeHints: ['mastery', 'calamity', 'anatomy', 'tragedy'], vibe: 'Turning lead to gold' },
  { id: 'w25', word: 'PRISM', phonetics: '/ˈprɪz.əm/', category: 'concrete', rhymeHints: ['rhythm', 'schism', 'wisdom', 'vision'], vibe: 'Splitting white light' },
  { id: 'w26', word: 'RESONANCE', phonetics: '/ˈrez.ən.əns/', category: 'abstract', rhymeHints: ['relevance', 'evidence', 'settlements', 'preference'], vibe: 'Sympathetic vibration' },
  { id: 'w27', word: 'PHANTOM', phonetics: '/ˈfæn.təm/', category: 'abstract', rhymeHints: ['random', 'tandem', 'anthem', 'handsome'], vibe: 'Present but invisible' },
  { id: 'w28', word: 'TITANIUM', phonetics: '/taɪˈteɪ.ni.əm/', category: 'concrete', rhymeHints: ['stadium', 'uranium', 'cranium', 'radiant'], vibe: 'Indestructible shield' },
  { id: 'w29', word: 'COLLIDE', phonetics: '/kəˈlaɪd/', category: 'action', rhymeHints: ['decide', 'divide', 'inside', 'applied'], vibe: 'Direct impact' },
  { id: 'w30', word: 'SATELLITE', phonetics: '/ˈsæt.əl.aɪt/', category: 'cyber', rhymeHints: ['battle cries', 'metal pipes', 'shining bright', 'satellite'], vibe: 'Silent watcher above' },
  { id: 'w31', word: 'GLITCH', phonetics: '/ɡlɪtʃ/', category: 'cyber', rhymeHints: ['switch', 'pitch', 'stitch', 'rich'], vibe: 'Digital anomaly' },
  { id: 'w32', word: 'DISRUPT', phonetics: '/dɪsˈrʌpt/', category: 'action', rhymeHints: ['abrupt', 'erupt', 'corrupt', 'conduct'], vibe: 'Breaking standard pattern' },
  { id: 'w33', word: 'BLADE', phonetics: '/bleɪd/', category: 'concrete', rhymeHints: ['made', 'fade', 'trade', 'shade'], vibe: 'Sharp edge cutting through' },
  { id: 'w34', word: 'CATALYST', phonetics: '/ˈkæt.əl.ɪst/', category: 'abstract', rhymeHints: ['battle list', 'rattle fists', 'shadow mist', 'satellites'], vibe: 'Triggering reaction' },
  { id: 'w35', word: 'MONOLITH', phonetics: '/ˈmɒn.ə.lɪθ/', category: 'concrete', rhymeHints: ['common sense', 'hollow mist', 'prophet lips', 'politics'], vibe: 'Towering ancient stone' }
];

export const CONSTRAINT_PROMPTS: ConstraintPrompt[] = [
  {
    id: 'c1',
    type: 'rhyme',
    title: 'AABB Couplets',
    badge: 'RHYME SCHEME',
    formula: 'Bar 1-2 Rhyme (A), Bar 3-4 Rhyme (B)',
    description: 'Rhyme the end of bar 1 with bar 2. Then establish a brand new rhyme across bars 3 and 4.',
    guide: 'Line 1: ...word [A] | Line 2: ... [A] | Line 3: ... [B] | Line 4: ... [B]'
  },
  {
    id: 'c2',
    type: 'rhyme',
    title: 'ABAB Alternating',
    badge: 'RHYME SCHEME',
    formula: 'Bar 1 & 3 Rhyme (A), Bar 2 & 4 Rhyme (B)',
    description: 'Weave alternating rhyme sounds across odd and even bars for syncopated tension.',
    guide: 'Line 1: ... [A] | Line 2: ... [B] | Line 3: ... [A] | Line 4: ... [B]'
  },
  {
    id: 'c3',
    type: 'rhyme',
    title: 'ABCB Ballad Stanza',
    badge: 'RHYME SCHEME',
    formula: 'Only Bar 2 & Bar 4 Rhyme (B)',
    description: 'Lines 1 and 3 stay freeform for narrative setup; line 2 and 4 deliver the punchline snap.',
    guide: 'Line 1: ... [A] | Line 2: ... [B] | Line 3: ... [C] | Line 4: ... [B]'
  },
  {
    id: 'c4',
    type: 'rhyme',
    title: 'AAAA Monorhyme',
    badge: 'RHYME SCHEME',
    formula: 'All 4 Bars End in Same Rhyme Sound (A)',
    description: 'High difficulty: lock into a single vowel rhyme sound across every bar without breaking chain.',
    guide: 'Line 1: ... [A] | Line 2: ... [A] | Line 3: ... [A] | Line 4: ... [A]'
  },
  {
    id: 'c5',
    type: 'rhyme',
    title: 'Internal Rhyme',
    badge: 'RHYME SCHEME',
    formula: 'Rhyme Inside the Bar + End of Bar',
    description: 'Place a rhyming word at the midpoint (Beat 2.5/3) and another at the conclusion of each bar.',
    guide: 'Mid-bar rhyme triggers before end-bar anchor.'
  },
  {
    id: 'c6',
    type: 'meter',
    title: '8 Syllable Cadence',
    badge: 'STRUCTURAL METER',
    formula: 'Exactly 8 Syllables per Bar',
    description: 'Even, punchy 8-syllable delivery matching 4 quarter notes per measure (2 syllables per beat).',
    guide: '1-and 2-and 3-and 4-and (8 syllables total per bar).'
  },
  {
    id: 'c7',
    type: 'meter',
    title: '10 Syllable Decasyllable',
    badge: 'STRUCTURAL METER',
    formula: '10 Syllables per Bar (Iambic Weight)',
    description: 'Deliberate, grounded flow allowing complex multisyllabic vocabulary without rushing.',
    guide: 'Count fingers if needed: steady 10 count across 4 beats.'
  },
  {
    id: 'c8',
    type: 'meter',
    title: 'Triplet Flow (3-Count)',
    badge: 'STRUCTURAL METER',
    formula: '3 Syllables per Beat (12 per Bar)',
    description: 'Fast, bouncing triplet cadence. Roll syllables over the hi-hat triplets (Da-da-da, da-da-da).',
    guide: '1-trip-let 2-trip-let 3-trip-let 4-trip-let.'
  },
  {
    id: 'c9',
    type: 'meter',
    title: 'Alliteration Lock',
    badge: 'STRUCTURAL METER',
    formula: '3+ Words Starting with Same Letter',
    description: 'Incorporate the mandatory word and weave at least 3 matching initial consonant sounds.',
    guide: 'Example: "P-p-p" or "S-s-s" percussive consonant bounce.'
  },
  {
    id: 'c10',
    type: 'meter',
    title: 'Double-Time Burst (Bar 3)',
    badge: 'STRUCTURAL METER',
    formula: 'Bar 1-2 Regular, Bar 3 Fast, Bar 4 Settle',
    description: 'Accelerate your syllable density on the 3rd bar then land firmly on beat 4 of the final bar.',
    guide: 'Build tension, explode double time on 3, resolve on 4.'
  }
];
