import { WordPrompt, ConstraintPrompt } from '../types';

export const WORD_PROMPTS: WordPrompt[] = [
  // Abstract / Intellectual
  {
    word: 'PARADOX',
    category: 'Abstract',
    phonetics: '/ˈpær.ə.dɑːks/',
    rhymeHints: ['aftershocks', 'padlocks', 'orthodox', 'detox', 'gridlock'],
    vibe: 'Contradiction in plain sight',
    tabooWords: ['TRUTH', 'PUZZLE', 'LIE'],
  },
  {
    word: 'CHRONICLE',
    category: 'Abstract',
    phonetics: '/ˈkrɑː.nɪ.kəl/',
    rhymeHints: ['monocle', 'phenomenal', 'anatomical', 'botanical'],
    vibe: 'Documenting the unseen history',
    tabooWords: ['TIME', 'BOOK', 'WRITE'],
  },
  {
    word: 'EPITOME',
    category: 'Abstract',
    phonetics: '/ɪˈpɪt.ə.mi/',
    rhymeHints: ['vividly', 'symmetry', 'infamy', 'chivalry', 'telepathy'],
    vibe: 'The absolute peak definition',
    tabooWords: ['BEST', 'EXAMPLE', 'PERFECT'],
  },
  {
    word: 'MIRAGE',
    category: 'Abstract',
    phonetics: '/mɪˈrɑːʒ/',
    rhymeHints: ['camouflage', 'barrage', 'collage', 'sabotage', 'garage'],
    vibe: 'Shimmering illusion on the blacktop',
    tabooWords: ['WATER', 'DESERT', 'FAKE'],
  },
  {
    word: 'LABYRINTH',
    category: 'Abstract',
    phonetics: '/ˈlæb.ə.rɪnθ/',
    rhymeHints: ['hyacinth', 'absinthe', 'corinth', 'monolith'],
    vibe: 'Twisting mental maze',
    tabooWords: ['MAZE', 'LOST', 'WALL'],
  },
  {
    word: 'ILLUSION',
    category: 'Abstract',
    phonetics: '/ɪˈluː.ʒən/',
    rhymeHints: ['conclusion', 'intrusion', 'diffusion', 'confusion', 'fusion'],
    vibe: 'Deceptive smoke and mirrors',
    tabooWords: ['MAGIC', 'SEE', 'EYES'],
  },
  {
    word: 'SYMMETRY',
    category: 'Abstract',
    phonetics: '/ˈsɪm.ə.tri/',
    rhymeHints: ['telemetry', 'geometry', 'pedigree', 'sensory', 'chemistry'],
    vibe: 'Balanced reflection in the chaos',
    tabooWords: ['EQUAL', 'SAME', 'SHAPE'],
  },
  {
    word: 'GENESIS',
    category: 'Abstract',
    phonetics: '/ˈdʒen.ə.sɪs/',
    rhymeHints: ['nemesis', 'premises', 'telepathist', 'emphasis'],
    vibe: 'The very first spark of creation',
    tabooWords: ['BEGIN', 'BORN', 'START'],
  },
  {
    word: 'HORIZON',
    category: 'Abstract',
    phonetics: '/həˈraɪ.zən/',
    rhymeHints: ['arisen', 'prison', 'bison', 'collision', 'decision'],
    vibe: 'The edge of everything reachable',
    tabooWords: ['SKY', 'SUN', 'FAR'],
  },
  {
    word: 'RESONANCE',
    category: 'Abstract',
    phonetics: '/ˈrez.ən.əns/',
    rhymeHints: ['dominance', 'relevance', 'arrogance', 'tolerance'],
    vibe: 'Vibrating through every frequency',
    tabooWords: ['SOUND', 'WAVE', 'LOUD'],
  },

  // Tech / Cyber / Sci-Fi
  {
    word: 'VELOCITY',
    category: 'Sci-Fi',
    phonetics: '/vəˈlɑː.sə.t̬i/',
    rhymeHints: ['atrocity', 'curiosity', 'ferocity', 'monstrosity', 'reciprocity'],
    vibe: 'Accelerating through neon corridors',
    tabooWords: ['SPEED', 'FAST', 'QUICK'],
  },
  {
    word: 'CIPHER',
    category: 'Cyber',
    phonetics: '/ˈsaɪ.fɚ/',
    rhymeHints: ['decipher', 'hyper', 'sniper', 'viper', 'striper'],
    vibe: 'Cryptographic code unbroken',
    tabooWords: ['CODE', 'SECRET', 'KEY'],
  },
  {
    word: 'CIRCUIT',
    category: 'Cyber',
    phonetics: '/ˈsɝː.kɪt/',
    rhymeHints: ['surplus', 'perfect', 'purpose', 'surface', 'worship'],
    vibe: 'Copper traces conducting live current',
    tabooWords: ['WIRE', 'CHIP', 'COMPUTER'],
  },
  {
    word: 'NEBULA',
    category: 'Cosmic',
    phonetics: '/ˈneb.jə.lə/',
    rhymeHints: ['formula', 'dracula', 'cellular', 'regular'],
    vibe: 'Deep space interstellar dust clouds',
    tabooWords: ['STAR', 'SPACE', 'GALAXY'],
  },
  {
    word: 'SYNAPSE',
    category: 'Neural',
    phonetics: '/ˈsɪn.æps/',
    rhymeHints: ['collapse', 'time-lapse', 'relapse', 'straps', 'traps'],
    vibe: 'Micro-second neuro-electric flash',
    tabooWords: ['BRAIN', 'NERVE', 'HEAD'],
  },
  {
    word: 'ALGORITHM',
    category: 'Cyber',
    phonetics: '/ˈæl.ɡə.rɪð.əm/',
    rhymeHints: ['logarithm', 'rhythm', 'prism', 'mechanism', 'criticism'],
    vibe: 'Calculated decision engine',
    tabooWords: ['MATH', 'CODE', 'SYSTEM'],
  },
  {
    word: 'QUANTUM',
    category: 'Sci-Fi',
    phonetics: '/ˈkwɑːn.t̬əm/',
    rhymeHints: ['phantom', 'ransom', 'tantrum', 'handsome', 'anthem'],
    vibe: 'Subatomic states of superposition',
    tabooWords: ['ATOM', 'PHYSICS', 'SMALL'],
  },
  {
    word: 'HOLOGRAM',
    category: 'Cyber',
    phonetics: '/ˈhɑː.lə.ɡræm/',
    rhymeHints: ['telegram', 'program', 'monogram', 'diagram', 'diaphragm'],
    vibe: 'Light projected into three dimensions',
    tabooWords: ['LIGHT', 'IMAGE', 'FAKE'],
  },
  {
    word: 'SATELLITE',
    category: 'Cosmic',
    phonetics: '/ˈsæt̬.əl.aɪt/',
    rhymeHints: ['appetite', 'dynamite', 'parasite', 'overnight', 'polite'],
    vibe: 'Orbiting far above the troposphere',
    tabooWords: ['ORBIT', 'MOON', 'SIGNAL'],
  },
  {
    word: 'FREQUENCY',
    category: 'Audio/Tech',
    phonetics: '/ˈfriː.kwən.si/',
    rhymeHints: ['urgency', 'clemency', 'currency', 'decency', 'sequency'],
    vibe: 'Vibrating the sub-woofers at 40Hz',
    tabooWords: ['SOUND', 'WAVE', 'RADIO'],
  },

  // Street / Urban / Hip-Hop
  {
    word: 'CONCRETE',
    category: 'Urban',
    phonetics: '/ˈkɑːn.kriːt/',
    rhymeHints: ['discreet', 'obsolete', 'elite', 'replete', 'defeat'],
    vibe: 'Cold pavement and relentless grit',
    tabooWords: ['STREET', 'CITY', 'GROUND'],
  },
  {
    word: 'BLOCK',
    category: 'Urban',
    phonetics: '/blɑːk/',
    rhymeHints: ['knock', 'shock', 'clock', 'lock', 'rock'],
    vibe: 'Corner sirens and neighborhood pulse',
    tabooWords: ['CORNER', 'NEIGHBORHOOD', 'AVENUE'],
  },
  {
    word: 'ASPHALT',
    category: 'Urban',
    phonetics: '/ˈæs.fɑːlt/',
    rhymeHints: ['assault', 'default', 'exalt', 'vault', 'salt'],
    vibe: 'Tire marks and midnight highways',
    tabooWords: ['ROAD', 'DRIVE', 'BLACK'],
  },
  {
    word: 'GRAFFITI',
    category: 'Urban',
    phonetics: '/ɡrəˈfiː.t̬i/',
    rhymeHints: ['treaty', 'needy', 'greedy', 'speedy', 'creepy'],
    vibe: 'Aerosol signatures on train yards',
    tabooWords: ['PAINT', 'WALL', 'SPRAY'],
  },
  {
    word: 'SUBWAY',
    category: 'Urban',
    phonetics: '/ˈsʌb.weɪ/',
    rhymeHints: ['runway', 'one-way', 'sunray', 'gunplay', 'someway'],
    vibe: 'Steel wheels screeching subterranean',
    tabooWords: ['TRAIN', 'TUNNEL', 'STATION'],
  },
  {
    word: 'NEON',
    category: 'Urban',
    phonetics: '/ˈniː.ɑːn/',
    rhymeHints: ['freon', 'eon', 'peon', 'pantheon', 'fleeing'],
    vibe: 'Midnight diner signs buzzing in rain',
    tabooWords: ['GLOW', 'SIGN', 'BRIGHT'],
  },
  {
    word: 'ROOFTOP',
    category: 'Urban',
    phonetics: '/ˈruːf.tɑːp/',
    rhymeHints: ['drop-top', 'nonstop', 'backdrop', 'tick-tock', 'hip-hop'],
    vibe: 'Looking down upon the skyline grid',
    tabooWords: ['BUILDING', 'TOP', 'HIGH'],
  },
  {
    word: 'CORNERSTONE',
    category: 'Urban',
    phonetics: '/ˈkɔːr.nɚ.stoʊn/',
    rhymeHints: ['overthrown', 'microphone', 'undertone', 'unbeknownst', 'cyclone'],
    vibe: 'The foundation that holds the entire block',
    tabooWords: ['ROCK', 'BRICK', 'BASE'],
  },
  {
    word: 'BASELINE',
    category: 'Music',
    phonetics: '/ˈbeɪs.laɪn/',
    rhymeHints: ['grapevine', 'waistline', 'coastline', 'lifeline', 'guideline'],
    vibe: 'The heavy 808 kicking underneath',
    tabooWords: ['LOW', 'BEAT', 'MUSIC'],
  },
  {
    word: 'VINYL',
    category: 'Music',
    phonetics: '/ˈvaɪ.nəl/',
    rhymeHints: ['final', 'spinal', 'tribunal', 'cycle', 'idle'],
    vibe: 'Crackling needle on black groove wax',
    tabooWords: ['RECORD', 'SCRATCH', 'DISK'],
  },

  // Nature / Elements / Cataclysm
  {
    word: 'OBSIDIAN',
    category: 'Elements',
    phonetics: '/əbˈsɪd.i.ən/',
    rhymeHints: ['meridian', 'amphibian', 'caribbean', 'oblivion'],
    vibe: 'Volcanic glass razor sharp and black',
    tabooWords: ['DARK', 'STONE', 'LAVA'],
  },
  {
    word: 'AVALANCHE',
    category: 'Elements',
    phonetics: '/ˈæv.əl.æntʃ/',
    rhymeHints: ['expand', 'command', 'collapse', 'advance', 'stance'],
    vibe: 'Crushing snow down the mountain face',
    tabooWords: ['SNOW', 'SLIDE', 'COLD'],
  },
  {
    word: 'IGNITION',
    category: 'Elements',
    phonetics: '/ɪɡˈnɪʃ.ən/',
    rhymeHints: ['condition', 'tradition', 'ambition', 'demolition', 'ammunition'],
    vibe: 'Spark turning into roaring inferno',
    tabooWords: ['FIRE', 'START', 'BURN'],
  },
  {
    word: 'CYCLONE',
    category: 'Elements',
    phonetics: '/ˈsaɪ.kloʊn/',
    rhymeHints: ['backbone', 'milestone', 'rhinestone', 'unbeknownst', 'unknown'],
    vibe: 'Vortex of wind tearing through city centers',
    tabooWords: ['STORM', 'WIND', 'HURRICANE'],
  },
  {
    word: 'TEMPEST',
    category: 'Elements',
    phonetics: '/ˈtem.pəst/',
    rhymeHints: ['relentless', 'defenseless', 'endless', 'breathless', 'quest'],
    vibe: 'Raging sea battering the rocky cliffs',
    tabooWords: ['RAIN', 'WATER', 'OCEAN'],
  },
  {
    word: 'VOLCANIC',
    category: 'Elements',
    phonetics: '/vɑːlˈkæn.ɪk/',
    rhymeHints: ['titanic', 'mechanic', 'organic', 'panic', 'botanic'],
    vibe: 'Molten magma waiting to breach the crust',
    tabooWords: ['HOT', 'ERUPT', 'ASH'],
  },
  {
    word: 'LIGHTNING',
    category: 'Elements',
    phonetics: '/ˈlaɪt.nɪŋ/',
    rhymeHints: ['frightening', 'tightening', 'heightening', 'brightening'],
    vibe: 'Billion-volt arc cutting through thunderstorm',
    tabooWords: ['THUNDER', 'STORM', 'FLASH'],
  },
  {
    word: 'GLACIER',
    category: 'Elements',
    phonetics: '/ˈɡleɪ.ʃɚ/',
    rhymeHints: ['nature', 'danger', 'stranger', 'chamber', 'vapor'],
    vibe: 'Ancient ice carving deep river valleys',
    tabooWords: ['ICE', 'MELT', 'FREEZE'],
  },
  {
    word: 'MONSOON',
    category: 'Elements',
    phonetics: '/mɑːnˈsuːn/',
    rhymeHints: ['typhoon', 'buffoon', 'platoon', 'saloon', 'balloon'],
    vibe: 'Torrential downpour flooding the delta',
    tabooWords: ['RAIN', 'WET', 'SEASON'],
  },
  {
    word: 'SOLAR',
    category: 'Cosmic',
    phonetics: '/ˈsoʊ.lɚ/',
    rhymeHints: ['polar', 'roller', 'bolder', 'shoulder', 'soldier'],
    vibe: 'Blinding coronal flare from the sun',
    tabooWords: ['SUN', 'HEAT', 'DAY'],
  },

  // Action / Combat / Hustle
  {
    word: 'CATALYST',
    category: 'Action',
    phonetics: '/ˈkæt̬.əl.ɪst/',
    rhymeHints: ['battle-list', 'capitalist', 'analyst', 'panelist'],
    vibe: 'The element that accelerates reaction',
    tabooWords: ['CHANGE', 'CAUSE', 'FAST'],
  },
  {
    word: 'VANGUARD',
    category: 'Action',
    phonetics: '/ˈvæn.ɡɑːrd/',
    rhymeHints: ['bodyguard', 'graveyard', 'backyard', 'scabbard', 'standard'],
    vibe: 'The front-line warriors pushing forward',
    tabooWords: ['FRONT', 'LEAD', 'FIRST'],
  },
  {
    word: 'RENEGADE',
    category: 'Action',
    phonetics: '/ˈren.ə.ɡeɪd/',
    rhymeHints: ['barricade', 'promenade', 'lemonade', 'serenade', 'blade'],
    vibe: 'Breaking ranks without apology',
    tabooWords: ['REBEL', 'RULE', 'SOLDIER'],
  },
  {
    word: 'AMBUSH',
    category: 'Action',
    phonetics: '/ˈæm.bʊʃ/',
    rhymeHints: ['vanquish', 'standstill', 'outwit', 'blitz', 'strike'],
    vibe: 'Waiting silently in the shadows until zero hour',
    tabooWords: ['TRAP', 'ATTACK', 'SURPRISE'],
  },
  {
    word: 'LEVERAGE',
    category: 'Action',
    phonetics: '/ˈlev.ɚ.ɪdʒ/',
    rhymeHints: ['beverage', 'severance', 'cleverness', 'readiness'],
    vibe: 'Using the fulcrum to move insurmountable mass',
    tabooWords: ['FORCE', 'POWER', 'WEIGHT'],
  },
  {
    word: 'COLLISION',
    category: 'Action',
    phonetics: '/kəˈlɪʒ.ən/',
    rhymeHints: ['decision', 'precision', 'incision', 'vision', 'division'],
    vibe: 'Two unstoppable locomotives meeting head on',
    tabooWords: ['CRASH', 'HIT', 'IMPACT'],
  },
  {
    word: 'FORTRESS',
    category: 'Combat',
    phonetics: '/ˈfɔːr.trəs/',
    rhymeHints: ['dauntless', 'faultless', 'sorceress', 'courtroom', 'torment'],
    vibe: 'Impenetrable stone walls under siege',
    tabooWords: ['CASTLE', 'WALL', 'GUARD'],
  },
  {
    word: 'TACTICAL',
    category: 'Action',
    phonetics: '/ˈtæk.tɪ.kəl/',
    rhymeHints: ['practical', 'radical', 'classical', 'magical', 'sabbatical'],
    vibe: 'Every movement deliberate and strategic',
    tabooWords: ['PLAN', 'WAR', 'WEAPON'],
  },
  {
    word: 'MOMENTUM',
    category: 'Action',
    phonetics: '/moʊˈmen.t̬əm/',
    rhymeHints: ['spectrum', 'pendulum', 'tantrum', 'phantom', 'random'],
    vibe: 'Unstoppable inertia carrying you through',
    tabooWords: ['MOVE', 'KEEP', 'ROLL'],
  },
  {
    word: 'OVERDRIVE',
    category: 'Action',
    phonetics: '/ˈoʊ.vɚ.draɪv/',
    rhymeHints: ['survive', 'revive', 'deprive', 'alive', 'arrive'],
    vibe: 'Red-lining the tachometer into fifth gear',
    tabooWords: ['GEAR', 'PUSH', 'FAST'],
  },

  // Psychological / Emotional
  {
    word: 'OBSESSION',
    category: 'Psychological',
    phonetics: '/əbˈseʃ.ən/',
    rhymeHints: ['possession', 'progression', 'confession', 'oppression', 'expression'],
    vibe: 'Haunting every quiet thought after 3 AM',
    tabooWords: ['MIND', 'CRAZY', 'LOVE'],
  },
  {
    word: 'PARANOIA',
    category: 'Psychological',
    phonetics: '/ˌpær.əˈnɔɪ.ə/',
    rhymeHints: ['destroyer', 'employer', 'sequoia', 'conveyor', 'deployer'],
    vibe: 'Footsteps in the alley behind you',
    tabooWords: ['FEAR', 'SCARED', 'WATCH'],
  },
  {
    word: 'INTUITION',
    category: 'Psychological',
    phonetics: '/ˌɪn.tuːˈɪʃ.ən/',
    rhymeHints: ['tradition', 'audition', 'suspicion', 'petition', 'nutrition'],
    vibe: 'The visceral gut feeling before the eyes confirm',
    tabooWords: ['FEEL', 'GUT', 'KNOW'],
  },
  {
    word: 'MELANCHOLY',
    category: 'Psychological',
    phonetics: '/ˈmel.əŋ.kɑː.li/',
    rhymeHints: ['holy', 'slowly', 'solely', 'folly', 'collie'],
    vibe: 'Rain on the bus window at dusk',
    tabooWords: ['SAD', 'CRY', 'BLUE'],
  },
  {
    word: 'EUPHORIA',
    category: 'Psychological',
    phonetics: '/juːˈfɔːr.i.ə/',
    rhymeHints: ['glorious', 'victorious', 'notorious', 'warrior', 'corridor'],
    vibe: 'Pure transcendent adrenaline rush',
    tabooWords: ['HIGH', 'HAPPY', 'DRUG'],
  },
  {
    word: 'VULNERABLE',
    category: 'Psychological',
    phonetics: '/ˈvʌl.nɚ.ə.bəl/',
    rhymeHints: ['unbearable', 'incomparable', 'terrible', 'durable'],
    vibe: 'Dropping armor with nowhere to hide',
    tabooWords: ['WEAK', 'HURT', 'OPEN'],
  },
  {
    word: 'CONVICTION',
    category: 'Psychological',
    phonetics: '/kənˈvɪk.ʃən/',
    rhymeHints: ['addiction', 'friction', 'restriction', 'affliction', 'prediction'],
    vibe: 'Unshakable belief in your destination',
    tabooWords: ['BELIEF', 'GUILTY', 'SURE'],
  },
  {
    word: 'INSOMNIA',
    category: 'Psychological',
    phonetics: '/ɪnˈsɑːm.ni.ə/',
    rhymeHints: ['california', 'pneumonia', 'begonia', 'ammonia'],
    vibe: 'Ceiling fans spinning while the clock hits four',
    tabooWords: ['SLEEP', 'TIRED', 'BED'],
  },

  // Mythic / Arcane / Enigmatic
  {
    word: 'PHANTOM',
    category: 'Arcane',
    phonetics: '/ˈfæn.t̬əm/',
    rhymeHints: ['ransom', 'handsome', 'quantum', 'anthem', 'sanctum'],
    vibe: 'A ghostly silhouette vanishing around the bend',
    tabooWords: ['GHOST', 'DEAD', 'HAUNT'],
  },
  {
    word: 'SANCTUARY',
    category: 'Arcane',
    phonetics: '/ˈsæŋk.tʃu.er.i/',
    rhymeHints: ['january', 'mortuary', 'statuary', 'temporary', 'cemetery'],
    vibe: 'Sacred haven shielded from the turmoil',
    tabooWords: ['SAFE', 'CHURCH', 'HOME'],
  },
  {
    word: 'PHOENIX',
    category: 'Mythic',
    phonetics: '/ˈfiː.nɪks/',
    rhymeHints: ['remix', 'scenics', 'genetics', 'mechanics', 'aerobics'],
    vibe: 'Rising with fiery wings from carbon ashes',
    tabooWords: ['BIRD', 'ASH', 'RISE'],
  },
  {
    word: 'ECLIPSE',
    category: 'Cosmic',
    phonetics: '/ɪˈklɪps/',
    rhymeHints: ['apocalypse', 'finger-tips', 'scripts', 'grips', 'lips'],
    vibe: 'The dark disc swallowing the midday sun',
    tabooWords: ['MOON', 'DARK', 'SUN'],
  },
  {
    word: 'TALISMAN',
    category: 'Arcane',
    phonetics: '/ˈtæl.ɪz.mən/',
    rhymeHints: ['caravan', 'partisan', 'artisan', 'clan', 'span'],
    vibe: 'Worn pendant imbued with ancient protection',
    tabooWords: ['MAGIC', 'LUCK', 'CHARM'],
  },
  {
    word: 'CHIMERA',
    category: 'Mythic',
    phonetics: '/kaɪˈmɪr.ə/',
    rhymeHints: ['mirror', 'clearer', 'nearer', 'era', 'sierra'],
    vibe: 'A creature forged of incompatible beasts',
    tabooWords: ['MONSTER', 'ANIMAL', 'MYTH'],
  },

  // Rhythm & Flow / Language
  {
    word: 'CADENCE',
    category: 'Rhythm',
    phonetics: '/ˈkeɪ.dəns/',
    rhymeHints: ['patience', 'fragrance', 'statements', 'arrangements', 'spacious'],
    vibe: 'The infectious groove of the vocal stride',
    tabooWords: ['RHYTHM', 'BEAT', 'VOICE'],
  },
  {
    word: 'METAPHOR',
    category: 'Language',
    phonetics: '/ˈmet̬.ə.fɔːr/',
    rhymeHints: ['reservoir', 'settle-scores', 'repertoire', 'forevermore', 'territory'],
    vibe: 'Speaking in riddles that hit like hammers',
    tabooWords: ['POEM', 'LIKE', 'MEAN'],
  },
  {
    word: 'SYNCOPATION',
    category: 'Rhythm',
    phonetics: '/ˌsɪŋ.kəˈpeɪ.ʃən/',
    rhymeHints: ['generation', 'meditation', 'elevation', 'demonstration', 'devastation'],
    vibe: 'Stressing the off-beat pockets in the bar',
    tabooWords: ['NOTE', 'DRUM', 'ACCENT'],
  },
  {
    word: 'DIALECT',
    category: 'Language',
    phonetics: '/ˈdaɪ.ə.lekt/',
    rhymeHints: ['disrespect', 'architect', 'intellect', 'resurrect', 'disconnect'],
    vibe: 'The slang and accent carved by the streets',
    tabooWords: ['SPEAK', 'WORDS', 'LANGUAGE'],
  },
  {
    word: 'SUBZERO',
    category: 'Elements',
    phonetics: '/sʌbˈzɪr.oʊ/',
    rhymeHints: ['superhero', 'nero', 'sombrero', 'bolero'],
    vibe: 'Ice crystals forming on the microphone grille',
    tabooWords: ['COLD', 'FREEZE', 'ICE'],
  },
  {
    word: 'TRANSCEND',
    category: 'Abstract',
    phonetics: '/trænˈsend/',
    rhymeHints: ['comprehend', 'recommend', 'apprehend', 'condescend', 'amend'],
    vibe: 'Breaking through the glass ceiling of reality',
    tabooWords: ['ABOVE', 'GO', 'HIGHER'],
  },
  {
    word: 'VIBRATION',
    category: 'Rhythm',
    phonetics: '/vaɪˈbreɪ.ʃən/',
    rhymeHints: ['foundation', 'revelation', 'destination', 'celebration', 'domination'],
    vibe: 'Rattling the windows from the trunk speakers',
    tabooWords: ['SHAKE', 'FEEL', 'BUZZ'],
  },
  {
    word: 'MONOLITH',
    category: 'Arcane',
    phonetics: '/ˈmɑː.nə.lɪθ/',
    rhymeHints: ['labyrinth', 'hyacinth', 'clench-a-fist', 'myth'],
    vibe: 'Towering black slab standing for millenia',
    tabooWords: ['STONE', 'PILLAR', 'TALL'],
  },
  {
    word: 'ALCHEMY',
    category: 'Arcane',
    phonetics: '/ˈæl.kə.mi/',
    rhymeHints: ['tragedy', 'majesty', 'battery', 'mastery', 'calamity'],
    vibe: 'Turning base lead into lyrical 24K gold',
    tabooWords: ['GOLD', 'POTION', 'MAGIC'],
  },
  {
    word: 'ECHO',
    category: 'Rhythm',
    phonetics: '/ˈek.oʊ/',
    rhymeHints: ['gecko', 'retro', 'metro', 'staccato', 'allegro'],
    vibe: 'The sound bouncing off empty skyscrapers',
    tabooWords: ['REPEAT', 'SOUND', 'VOICE'],
  },
  {
    word: 'INFINITY',
    category: 'Abstract',
    phonetics: '/ɪnˈfɪn.ə.t̬i/',
    rhymeHints: ['vicinity', 'divinity', 'serenity', 'proximity', 'affinity'],
    vibe: 'Unending loops stretching past the event horizon',
    tabooWords: ['FOREVER', 'END', 'TIME'],
  },
  {
    word: 'REVELATION',
    category: 'Abstract',
    phonetics: '/ˌrev.əˈleɪ.ʃən/',
    rhymeHints: ['elevation', 'hesitation', 'devastation', 'meditation', 'creation'],
    vibe: 'The blinds yanked open into sudden light',
    tabooWords: ['SEE', 'GOD', 'FIND'],
  },
  {
    word: 'VORTEX',
    category: 'Elements',
    phonetics: '/ˈvɔːr.teks/',
    rhymeHints: ['cortex', 'vertex', 'complex', 'reflex', 'duplex'],
    vibe: 'Spinning spiral pulling everything inward',
    tabooWords: ['SPIN', 'HOLE', 'SWIRL'],
  },
  {
    word: 'PRESSURE',
    category: 'Psychological',
    phonetics: '/ˈpreʃ.ɚ/',
    rhymeHints: ['measure', 'treasure', 'pleasure', 'lesser', 'professor'],
    vibe: 'Atmospheric barometric weight on your shoulders',
    tabooWords: ['HEAVY', 'WEIGHT', 'STRESS'],
  },
  {
    word: 'DOMINO',
    category: 'Action',
    phonetics: '/ˈdɑː.mə.noʊ/',
    rhymeHints: ['dynamo', 'stereo', 'scenario', 'geronimo', 'audio'],
    vibe: 'One small push triggering the entire collapse',
    tabooWords: ['FALL', 'TILE', 'GAME'],
  },
  {
    word: 'NIGHTFALL',
    category: 'Urban',
    phonetics: '/ˈnaɪt.fɑːl/',
    rhymeHints: ['tightrope', 'lightbulb', 'spiteful', 'rightful', 'sightseer'],
    vibe: 'When the city switches from daylight into shadows',
    tabooWords: ['DARK', 'SUN', 'EVENING'],
  },
  {
    word: 'HYPNOTIC',
    category: 'Psychological',
    phonetics: '/hɪpˈnɑː.t̬ɪk/',
    rhymeHints: ['exotic', 'robotic', 'narcotic', 'chaotic', 'psychotic'],
    vibe: 'Eyes glazed over locked into the rhythm',
    tabooWords: ['SLEEP', 'TRANCE', 'SPELL'],
  },
  {
    word: 'IGNITE',
    category: 'Elements',
    phonetics: '/ɪɡˈnaɪt/',
    rhymeHints: ['polite', 'contite', 'excite', 'insight', 'overnight'],
    vibe: 'Flicking the match across the sandpaper striker',
    tabooWords: ['FIRE', 'BURN', 'LIGHT'],
  },
  {
    word: 'SPECTRUM',
    category: 'Cosmic',
    phonetics: '/ˈspek.trəm/',
    rhymeHints: ['momentum', 'pendulum', 'tantrum', 'phantom', 'album'],
    vibe: 'Prism splitting white laser into seven bands',
    tabooWords: ['COLOR', 'LIGHT', 'RAINBOW'],
  },
  {
    word: 'IRONCLAD',
    category: 'Combat',
    phonetics: '/ˈaɪ.ɚn.klæd/',
    rhymeHints: ['firing-squad', 'scandalous', 'iron-cast', 'steadfast'],
    vibe: 'Riveted steel armor resisting every blow',
    tabooWords: ['METAL', 'STRONG', 'SHIP'],
  },
  {
    word: 'DRIFT',
    category: 'Action',
    phonetics: '/drɪft/',
    rhymeHints: ['shift', 'lift', 'gift', 'swift', 'rift'],
    vibe: 'Rear tires smoking sideways around the curve',
    tabooWords: ['CAR', 'SLIDE', 'MOVE'],
  },
  {
    word: 'REVERB',
    category: 'Audio/Tech',
    phonetics: '/ˈriː.vɝːb/',
    rhymeHints: ['disturb', 'superb', 'suburb', 'curb', 'herb'],
    vibe: 'Spacious decay in a cathedral hall',
    tabooWords: ['ECHO', 'SOUND', 'ROOM'],
  },
  {
    word: 'HOROSCOPE',
    category: 'Arcane',
    phonetics: '/ˈhɔːr.ə.skoʊp/',
    rhymeHints: ['telescope', 'microscope', 'kaleidoscope', 'envelop', 'periscope'],
    vibe: 'Star charts predicting unpredictable fates',
    tabooWords: ['STAR', 'SIGN', 'FUTURE'],
  },
  {
    word: 'TRANSMIT',
    category: 'Cyber',
    phonetics: '/trænzˈmɪt/',
    rhymeHints: ['admit', 'commit', 'outfit', 'permit', 'counterfeit'],
    vibe: 'Broadcasting packet bursts into the night air',
    tabooWords: ['SEND', 'RADIO', 'DATA'],
  },
  {
    word: 'MAVERICK',
    category: 'Action',
    phonetics: '/ˈmæv.ɚ.ɪk/',
    rhymeHints: ['fabric', 'asterisk', 'cataract', 'atmospheric'],
    vibe: 'Unorthodox pilot refusing standard procedure',
    tabooWords: ['LONE', 'PILOT', 'REBEL'],
  },
];

export const CONSTRAINT_PROMPTS: ConstraintPrompt[] = [
  // Rhyme Schemes
  {
    id: 'rhyme-aabb',
    title: 'AABB COUPLETS',
    badge: 'RHYME SCHEME',
    formula: 'Bars 1 & 2 Rhyme [A] • Bars 3 & 4 Rhyme [B]',
    description: 'Establish a crisp rhyme across the first two measures, then pivot to a brand new rhyme sound on the second pair.',
    guide: 'Bar 1: ...word [A] | Bar 2: ...rhyme [A] | Bar 3: ...shift [B] | Bar 4: ...punch [B]',
    type: 'rhyme',
  },
  {
    id: 'rhyme-abab',
    title: 'ABAB CROSS RHYME',
    badge: 'RHYME SCHEME',
    formula: 'Bar 1 rhymes with Bar 3 [A] • Bar 2 rhymes with Bar 4 [B]',
    description: 'Interlock your bar endings. Set up rhyme A on measure 1, rhyme B on measure 2, then complete both matches.',
    guide: 'Bar 1: ...flow [A] | Bar 2: ...track [B] | Bar 3: ...glow [A] | Bar 4: ...back [B]',
    type: 'rhyme',
  },
  {
    id: 'rhyme-aaaa',
    title: 'AAAA MONORHYME STACK',
    badge: 'RHYME SCHEME',
    formula: 'All 4 Bars End On The Exact Same Rhyme Family',
    description: 'Sustain unrelenting phonetic pressure by ending every single measure on the same rhyme family sound.',
    guide: 'Bar 1: ...[A] | Bar 2: ...[A] | Bar 3: ...[A] | Bar 4: ...[A] (Complete lock)',
    type: 'rhyme',
  },
  {
    id: 'rhyme-internal',
    title: 'INTERNAL RHYME CHAIN',
    badge: 'RHYME SCHEME',
    formula: 'Rhyme Mid-Bar (Beat 2) AND End-Bar (Beat 4)',
    description: 'Plant rhymes inside the belly of each measure as well as at the tail. Double the rhyming density per bar.',
    guide: 'Bar: [Beat 2: Rhyme 1] ... [Beat 4: Rhyme 2] (Two hits every measure)',
    type: 'rhyme',
  },
  {
    id: 'rhyme-multisyllabic',
    title: 'MULTI-SYLLABIC (MULTIS)',
    badge: 'RHYME SCHEME',
    formula: 'Rhyme 2 or 3 Syllables In Sequence',
    description: 'Match compound vowel structures at bar ends (e.g., "rapid fire" with "traffic tire", "city pavement" with "pity payment").',
    guide: 'Bar 1: ...[Rapid Fire] | Bar 2: ...[Traffic Tire] (Full syllable match)',
    type: 'rhyme',
  },

  // Meters & Cadences
  {
    id: 'meter-8-syllable',
    title: '8-SYLLABLE STRICT CADENCE',
    badge: 'STRUCTURAL METER',
    formula: 'Exactly 8 Syllables Per Measure (2 Per Beat)',
    description: 'Discipline your timing. Keep every line locked to an even 8-syllable stride, aligning two syllables per beat.',
    guide: '1-and 2-and 3-and 4-and (Even metronomic rhythm, no run-ons)',
    type: 'meter',
  },
  {
    id: 'meter-10-syllable',
    title: '10-SYLLABLE EXTENDED FLOW',
    badge: 'STRUCTURAL METER',
    formula: '10 Syllables Per Bar With Syllabic Lean',
    description: 'Deliver conversational yet measured 10-syllable bars with smooth syncopation into the snare on beat 4.',
    guide: 'Slightly faster cadence (10 syllables evenly disbursed across 4 beats)',
    type: 'meter',
  },
  {
    id: 'cadence-triplet',
    title: 'TRIPLET FLOW (MIGOS CADENCE)',
    badge: 'CADENCE PROFILE',
    formula: '3 Syllables Per Beat (12 Per Bar)',
    description: 'Bounce with a 3-count swing pocket: "One-and-a Two-and-a Three-and-a Four-and-a" across the measures.',
    guide: 'DA-da-da DA-da-da DA-da-da DA-da-da (Trap pocket)',
    type: 'cadence',
  },
  {
    id: 'cadence-double-time',
    title: 'DOUBLE-TIME BURST (BARS 1 & 3)',
    badge: 'CADENCE PROFILE',
    formula: 'Fast 16th-Notes On Bars 1 & 3 • Half-Time On Bars 2 & 4',
    description: 'Alternate between rapid-fire tongue agility on odd bars, then spacious, melodic half-time delivery on even bars.',
    guide: 'Bar 1: [SPEED BURST] | Bar 2: [SLOW BREATHE] | Bar 3: [SPEED BURST] | Bar 4: [PUNCH]',
    type: 'cadence',
  },
  {
    id: 'cadence-staccato',
    title: 'STACCATO CHOPPED DELIVERY',
    badge: 'CADENCE PROFILE',
    formula: 'Short, Punctuated Words With Rests In Between',
    description: 'Avoid legato elongation. Cut words short like percussion stabs, using deliberate micro-silences between syllables.',
    guide: 'Hit. Pause. Hit. Pause. Punch the consonants cleanly.',
    type: 'cadence',
  },
  {
    id: 'meter-pause-punchline',
    title: 'PAUSE & PUNCHLINE (BEAT 3 REST)',
    badge: 'STRUCTURAL METER',
    formula: 'Deliver Beats 1-2 • Complete Silence On Beat 3 • Punch On 4',
    description: 'Drop out on beat 3 of the final bar to build cognitive tension, then unleash the rhyme punchline squarely on beat 4.',
    guide: 'Bars 1-3: Standard flow | Bar 4: Speak (1-2) -> [SILENCE ON 3] -> PUNCH (4)',
    type: 'meter',
  },
];

// Helper to shuffle array non-destructively
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Queue manager to avoid seeing repeated words in session
class PromptQueueManager {
  private wordPool: WordPrompt[] = [];
  private constraintPool: ConstraintPrompt[] = [];

  constructor() {
    this.refillWords();
    this.refillConstraints();
  }

  private refillWords() {
    this.wordPool = shuffleArray(WORD_PROMPTS);
  }

  private refillConstraints() {
    this.constraintPool = shuffleArray(CONSTRAINT_PROMPTS);
  }

  public getNextWord(): WordPrompt {
    if (this.wordPool.length === 0) {
      this.refillWords();
    }
    return this.wordPool.pop() || WORD_PROMPTS[0];
  }

  public getNextWords(count: number): WordPrompt[] {
    const words: WordPrompt[] = [];
    for (let i = 0; i < count; i++) {
      words.push(this.getNextWord());
    }
    return words;
  }

  public getNextConstraint(): ConstraintPrompt {
    if (this.constraintPool.length === 0) {
      this.refillConstraints();
    }
    return this.constraintPool.pop() || CONSTRAINT_PROMPTS[0];
  }
}

export const promptQueue = new PromptQueueManager();
