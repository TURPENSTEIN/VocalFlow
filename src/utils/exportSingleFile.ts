/**
 * Generates and downloads a complete, self-contained, dependency-free single-file HTML/CSS/JS
 * version of VocalFlow that can be opened and executed directly in any browser offline.
 */
export function generateSingleFileHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VocalFlow — Monospace Speech & Rhythm Engine</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #050505;
      --panel: #070b09;
      --card-alt: #060a0d;
      --border: #1a3324;
      --accent: #00ff88;
      --accent-cyan: #00e5ff;
      --accent-red: #ff3355;
      --accent-amber: #ffaa00;
      --text: #e0e0e0;
      --text-muted: #888888;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 40px;
    }
    .banner {
      width: 100%;
      background: #0a0f1c;
      border-bottom: 2px solid rgba(88, 101, 242, 0.5);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .banner a {
      color: #00ff88;
      text-decoration: underline;
      font-weight: 800;
      background: rgba(0, 255, 136, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 136, 0.3);
    }
    .container {
      width: 100%;
      max-width: 980px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
    .card-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 16px;
    }
    @media (max-width: 768px) {
      .card-grid { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--panel);
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
      position: relative;
    }
    .card.cyan {
      background: var(--card-alt);
      border-color: #193946;
    }
    .card.taboo {
      background: #0d0708;
      border-color: #44141d;
    }
    .tag {
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      display: inline-block;
    }
    .tag-green { background: rgba(0, 255, 136, 0.15); color: #00ff88; border: 1px solid rgba(0, 255, 136, 0.4); }
    .tag-cyan { background: rgba(0, 229, 255, 0.15); color: #00e5ff; border: 1px solid rgba(0, 229, 255, 0.4); }
    .tag-red { background: rgba(255, 51, 85, 0.2); color: #ff3355; border: 1px solid rgba(255, 51, 85, 0.5); }
    .word-display {
      font-size: 48px;
      font-weight: 800;
      text-align: center;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
      margin: 16px 0;
      text-transform: uppercase;
      word-break: break-word;
    }
    .controls {
      background: #080c09;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .btn {
      background: var(--accent);
      color: #000;
      font-family: inherit;
      font-weight: 800;
      font-size: 14px;
      padding: 10px 18px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s;
    }
    .btn:hover { background: #1aff96; box-shadow: 0 0 15px rgba(0, 255, 136, 0.5); }
    .btn-stop { background: var(--accent-red); color: #fff; }
    .btn-stop:hover { background: #ff4d6d; box-shadow: 0 0 15px rgba(255, 51, 85, 0.5); }
    .btn-outline {
      background: #0c1410;
      color: #e0e0e0;
      border: 1px solid var(--border);
    }
    .btn-outline:hover { border-color: var(--accent); color: #fff; }
    .btn-mic-on { background: rgba(255, 51, 85, 0.2); border: 1px solid var(--accent-red); color: #ff8095; }
    .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
    .slider-row { display: flex; align-items: center; gap: 12px; font-size: 12px; }
    input[type=range] {
      accent-color: var(--accent);
      flex: 1;
      height: 6px;
      cursor: pointer;
    }
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1000;
    }
    .modal-content {
      background: #080c09;
      border: 2px solid var(--accent);
      border-radius: 12px;
      padding: 24px;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
    }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="banner">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #5865F2; color: #fff; font-weight: 800; padding: 2px 6px; border-radius: 4px;">DISCORD</span>
      <span>Join community: <a href="https://discord.gg/brain" target="_blank">MINDBUILDING</a></span>
      <span style="color: #666; font-size: 11px;">• Freestyle rhythm & speech-generation training</span>
    </div>
  </div>

  <div class="container">
    <header>
      <div>
        <div class="title">VOCALFLOW</div>
        <div style="font-size: 11px; color: #888;">Standalone Single-File Speech & Rhythm Engine</div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span id="distraction-badge" class="tag tag-red hidden">INTERFERENCE ON</span>
      </div>
    </header>

    <!-- Oscilloscope -->
    <div style="background: #080c0a; border: 1px solid var(--border); border-radius: 8px; padding: 4px;">
      <canvas id="oscilloscope" width="900" height="60" style="width: 100%; height: 60px; display: block;"></canvas>
    </div>

    <!-- Cards Grid -->
    <div class="card-grid">
      <!-- Card 1: Mandatory Word -->
      <div class="card" id="word-card">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
          <span class="tag tag-green" id="word-category">MANDATORY WORD</span>
          <button class="btn btn-outline" style="padding: 2px 8px; font-size: 11px;" onclick="cyclePrompts()">SKIP [N]</button>
        </div>
        <div class="word-display" id="word-text">PARADOX</div>
        <div style="text-align: center; font-size: 12px; color: #888; font-style: italic;" id="word-vibe">"Contradiction in plain sight"</div>
        <div style="border-top: 1px solid var(--border); margin-top: 12px; padding-top: 8px; font-size: 11px;">
          <span style="color: #888;">Rhyme Launchpad: </span>
          <span id="rhyme-hints" style="color: var(--accent);">~aftershocks ~padlocks ~gridlock</span>
        </div>
      </div>

      <!-- Card 2: Constraint or Taboo -->
      <div class="card cyan" id="constraint-card">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #14242e; padding-bottom: 8px;">
          <span class="tag tag-cyan" id="constraint-badge">RHYME SCHEME</span>
          <span style="font-size: 10px; color: #888;">4-BAR FORMAT</span>
        </div>
        <div style="margin: 14px 0;">
          <div style="font-size: 18px; font-weight: 800; color: #00e5ff;" id="constraint-title">AABB COUPLETS</div>
          <div style="font-size: 12px; color: #00e5ff; margin-top: 6px;" id="constraint-formula">Bars 1 & 2 Rhyme [A] • Bars 3 & 4 Rhyme [B]</div>
          <div style="font-size: 12px; color: #bbb; margin-top: 8px; line-height: 1.4;" id="constraint-desc">
            Establish a crisp rhyme across the first two measures, then pivot to a brand new rhyme sound on the second pair.
          </div>
        </div>
        <div style="border-top: 1px solid #14242e; padding-top: 8px; font-size: 11px; color: #888;" id="constraint-guide">
          Guide: Bar 1: ...word [A] | Bar 2: ...rhyme [A] | Bar 3: ...shift [B] | Bar 4: ...punch [B]
        </div>
      </div>
    </div>

    <!-- 4-Bar Visualizer -->
    <div style="background: #0a0f0d; border: 1px solid var(--border); border-radius: 8px; padding: 12px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
        <span style="color: #888;">MEASURE: <b id="bar-indicator" style="color: var(--accent);">BAR 1/4</b></span>
        <span style="color: #888;">TOTAL BARS: <b id="total-bars-text" style="color: #fff;">0</b></span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">
        <div id="beat-0" style="padding: 6px; text-align: center; border: 1px solid #152219; border-radius: 4px; font-size: 11px; font-weight: 800;">BEAT 1</div>
        <div id="beat-1" style="padding: 6px; text-align: center; border: 1px solid #152219; border-radius: 4px; font-size: 11px; font-weight: 800;">BEAT 2</div>
        <div id="beat-2" style="padding: 6px; text-align: center; border: 1px solid #152219; border-radius: 4px; font-size: 11px; font-weight: 800;">BEAT 3</div>
        <div id="beat-3" style="padding: 6px; text-align: center; border: 1px solid #152219; border-radius: 4px; font-size: 11px; font-weight: 800;">BEAT 4</div>
      </div>
      <div style="width: 100%; height: 6px; background: #111; border-radius: 3px; overflow: hidden;">
        <div id="cycle-progress" style="width: 0%; height: 100%; background: var(--accent); transition: width 0.05s;"></div>
      </div>
    </div>

    <!-- Controls Panel -->
    <div class="controls">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: gap: 8px;">
        <div class="btn-group">
          <button id="btn-start" class="btn" onclick="togglePlay()">START ROUND (2 MIN)</button>
          <button id="btn-mic" class="btn btn-outline" onclick="toggleMic()">MIC INPUT [OFF]</button>
          <button id="btn-distraction" class="btn btn-outline" onclick="toggleDistraction()">DISTRACTION: OFF</button>
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #fff; background: #0c130f; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border);">
          ROUND: <span id="round-clock">02:00</span>
        </div>
      </div>

      <div class="slider-row">
        <span style="color: #888; width: 80px;">TEMPO:</span>
        <input type="range" id="bpm-slider" min="60" max="120" value="90" oninput="updateBpm(this.value)">
        <span id="bpm-val" style="color: var(--accent); font-weight: 800; width: 60px;">90 BPM</span>
      </div>

      <div style="display: flex; gap: 8px; align-items: center; font-size: 12px;">
        <span style="color: #888;">STYLE:</span>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="setStyle('boombap')">BOOM BAP</button>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="setStyle('trap')">TRAP</button>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="setStyle('lofi')">LO-FI</button>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="setStyle('drill')">DRILL</button>
      </div>
    </div>
  </div>

  <!-- Summary Modal -->
  <div id="summary-modal" class="modal hidden">
    <div class="modal-content">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
        <h2 style="color: #fff; font-size: 20px;">ROUND COMPLETE</h2>
        <button class="btn btn-outline" style="padding: 4px 8px;" onclick="closeModal()">✕</button>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0;">
        <div style="background: #0c130f; padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
          <div style="font-size: 10px; color: #888;">TOTAL TRIALS</div>
          <div id="sum-trials" style="font-size: 24px; font-weight: 800; color: #fff;">0</div>
        </div>
        <div style="background: #0c130f; padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
          <div style="font-size: 10px; color: #888;">AVG BPM</div>
          <div id="sum-bpm" style="font-size: 24px; font-weight: 800; color: #00e5ff;">90</div>
        </div>
        <div style="background: #0c130f; padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
          <div style="font-size: 10px; color: #888;">TOTAL BARS</div>
          <div id="sum-bars" style="font-size: 24px; font-weight: 800; color: #ffaa00;">0</div>
        </div>
      </div>
      <div id="audio-review-box" style="background: #0c130f; padding: 12px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 16px;">
        <div style="font-size: 12px; color: var(--accent); font-weight: 800; margin-bottom: 8px;">RECORDED VOCAL PLAYBACK</div>
        <audio id="playback-audio" controls style="width: 100%;"></audio>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button class="btn btn-outline" onclick="closeModal()">CLOSE</button>
        <button class="btn" onclick="restartRound()">NEW ROUND</button>
      </div>
    </div>
  </div>

  <script>
    // Embedded Audio Synthesizer, State Machine & Game Loop
    const WORDS = [
      { word: "PARADOX", cat: "Abstract", rhyme: ["aftershocks", "padlocks", "gridlock"], vibe: "Contradiction in plain sight", taboo: ["TRUTH", "LIE"] },
      { word: "VELOCITY", cat: "Sci-Fi", rhyme: ["atrocity", "ferocity", "monstrosity"], vibe: "Accelerating through neon corridors", taboo: ["SPEED", "FAST"] },
      { word: "CONCRETE", cat: "Urban", rhyme: ["discreet", "obsolete", "elite"], vibe: "Cold pavement and relentless grit", taboo: ["STREET", "CITY"] },
      { word: "OBSIDIAN", cat: "Elements", rhyme: ["meridian", "amphibian", "oblivion"], vibe: "Volcanic glass razor sharp and black", taboo: ["STONE", "DARK"] },
      { word: "CIPHER", cat: "Cyber", rhyme: ["decipher", "hyper", "sniper"], vibe: "Cryptographic code unbroken", taboo: ["CODE", "KEY"] },
      { word: "CADENCE", cat: "Rhythm", rhyme: ["patience", "fragrance", "statements"], vibe: "The infectious groove of the vocal stride", taboo: ["BEAT", "RHYTHM"] },
      { word: "AVALANCHE", cat: "Elements", rhyme: ["expand", "advance", "collapse"], vibe: "Crushing snow down the mountain face", taboo: ["SNOW", "COLD"] },
      { word: "HOLOGRAM", cat: "Cyber", rhyme: ["program", "telegram", "diagram"], vibe: "Light projected into three dimensions", taboo: ["LIGHT", "FAKE"] },
      { word: "TRANSCEND", cat: "Abstract", rhyme: ["comprehend", "defend", "extend"], vibe: "Breaking through the glass ceiling", taboo: ["GO", "HIGH"] }
    ];

    const CONSTRAINTS = [
      { title: "AABB COUPLETS", formula: "Bars 1 & 2 Rhyme [A] • Bars 3 & 4 Rhyme [B]", desc: "Establish a crisp rhyme across the first two measures, then pivot to a brand new rhyme sound on the second pair.", guide: "Bar 1: [A] | Bar 2: [A] | Bar 3: [B] | Bar 4: [B]" },
      { title: "ABAB CROSS RHYME", formula: "Bar 1 rhymes with Bar 3 [A] • Bar 2 rhymes with Bar 4 [B]", desc: "Interlock your bar endings across the 4-measure progression.", guide: "Bar 1: [A] | Bar 2: [B] | Bar 3: [A] | Bar 4: [B]" },
      { title: "8-SYLLABLE STRICT CADENCE", formula: "Exactly 8 Syllables Per Measure", desc: "Discipline your timing. Keep every line locked to an even 8-syllable stride.", guide: "1-and 2-and 3-and 4-and (Even metronomic rhythm)" },
      { title: "TRIPLET FLOW (MIGOS CADENCE)", formula: "3 Syllables Per Beat (12 Per Bar)", desc: "Bounce with a 3-count swing pocket across every measure.", guide: "DA-da-da DA-da-da DA-da-da DA-da-da" }
    ];

    let audioCtx = null;
    let isPlaying = false;
    let bpm = 90;
    let drumStyle = 'boombap';
    let currentStep = 0;
    let currentBar = 0;
    let totalBars = 0;
    let nextStepTime = 0;
    let timerId = null;
    let roundTimer = null;
    let secondsLeft = 120;
    let trialsCount = 1;
    let distractionOn = false;
    let distractionGain = null;
    let micStream = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let recordedUrl = null;

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function togglePlay() {
      initAudio();
      if (isPlaying) {
        stopEngine();
      } else {
        startEngine();
      }
    }

    function startEngine() {
      isPlaying = true;
      document.getElementById('btn-start').innerText = 'PAUSE ENGINE';
      document.getElementById('btn-start').className = 'btn btn-stop';
      nextStepTime = audioCtx.currentTime + 0.05;
      scheduler();
      startRoundClock();
      if (mediaRecorder && mediaRecorder.state === 'inactive') {
        audioChunks = [];
        mediaRecorder.start();
      }
    }

    function stopEngine() {
      isPlaying = false;
      document.getElementById('btn-start').innerText = 'START ROUND (2 MIN)';
      document.getElementById('btn-start').className = 'btn';
      if (timerId) clearTimeout(timerId);
      if (roundTimer) clearInterval(roundTimer);
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }

    function scheduler() {
      if (!isPlaying) return;
      while (nextStepTime < audioCtx.currentTime + 0.1) {
        playStep(currentStep, currentBar, nextStepTime);
        advanceStep();
      }
      timerId = setTimeout(scheduler, 25);
    }

    function advanceStep() {
      const secPer16th = 60.0 / bpm / 4.0;
      nextStepTime += secPer16th;
      currentStep++;
      if (currentStep >= 16) {
        currentStep = 0;
        currentBar++;
        totalBars++;
        if (currentBar >= 4) {
          currentBar = 0;
          cyclePrompts();
          trialsCount++;
        }
      }
    }

    function playStep(step, bar, time) {
      // Drum synthesis
      const isKick = step === 0 || step === 10;
      const isSnare = step === 4 || step === 12;
      const isHat = step % 2 === 0;

      if (isKick) synthKick(time);
      if (isSnare) synthSnare(time);
      if (isHat) synthHat(time);

      const delay = Math.max(0, (time - audioCtx.currentTime) * 1000);
      setTimeout(() => updateVisuals(step, bar), delay);
    }

    function synthKick(t) {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);
      g.gain.setValueAtTime(1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    }

    function synthSnare(t) {
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const flt = audioCtx.createBiquadFilter();
      flt.type = 'highpass';
      flt.frequency.setValueAtTime(800, t);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.8, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      src.connect(flt);
      flt.connect(g);
      g.connect(audioCtx.destination);
      src.start(t);
      src.stop(t + 0.15);
    }

    function synthHat(t) {
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.04, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const flt = audioCtx.createBiquadFilter();
      flt.type = 'highpass';
      flt.frequency.setValueAtTime(8000, t);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      src.connect(flt);
      flt.connect(g);
      g.connect(audioCtx.destination);
      src.start(t);
      src.stop(t + 0.04);
    }

    function cyclePrompts() {
      const w = WORDS[Math.floor(Math.random() * WORDS.length)];
      const c = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
      document.getElementById('word-text').innerText = w.word;
      document.getElementById('word-category').innerText = w.cat;
      document.getElementById('word-vibe').innerText = '"' + w.vibe + '"';
      document.getElementById('rhyme-hints').innerText = w.rhyme.map(r => '~' + r).join(' ');
      document.getElementById('constraint-title').innerText = c.title;
      document.getElementById('constraint-formula').innerText = c.formula;
      document.getElementById('constraint-desc').innerText = c.desc;
      document.getElementById('constraint-guide').innerText = 'Guide: ' + c.guide;
    }

    function updateVisuals(step, bar) {
      document.getElementById('bar-indicator').innerText = 'BAR ' + (bar + 1) + '/4';
      document.getElementById('total-bars-text').innerText = totalBars;
      const pct = ((bar * 16 + step + 1) / 64) * 100;
      document.getElementById('cycle-progress').style.width = pct + '%';
      const beat = Math.floor(step / 4);
      for (let i = 0; i < 4; i++) {
        const el = document.getElementById('beat-' + i);
        if (i === beat) {
          el.style.borderColor = i === 0 ? '#00ff88' : '#00e5ff';
          el.style.background = i === 0 ? 'rgba(0,255,136,0.2)' : 'rgba(0,229,255,0.2)';
        } else {
          el.style.borderColor = '#152219';
          el.style.background = 'transparent';
        }
      }
    }

    function updateBpm(val) {
      bpm = parseInt(val, 10);
      document.getElementById('bpm-val').innerText = bpm + ' BPM';
    }

    function setStyle(s) { drumStyle = s; }

    function toggleDistraction() {
      initAudio();
      distractionOn = !distractionOn;
      const btn = document.getElementById('btn-distraction');
      const badge = document.getElementById('distraction-badge');
      if (distractionOn) {
        btn.innerText = 'DISTRACTION: ON';
        btn.className = 'btn tag-red';
        badge.classList.remove('hidden');
      } else {
        btn.innerText = 'DISTRACTION: OFF';
        btn.className = 'btn btn-outline';
        badge.classList.add('hidden');
      }
    }

    async function toggleMic() {
      try {
        if (!micStream) {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(micStream);
          mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
          mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: 'audio/webm' });
            recordedUrl = URL.createObjectURL(blob);
            document.getElementById('playback-audio').src = recordedUrl;
          };
          document.getElementById('btn-mic').innerText = 'MIC RECORDING [ON]';
          document.getElementById('btn-mic').className = 'btn btn-mic-on';
        } else {
          micStream.getTracks().forEach(t => t.stop());
          micStream = null;
          document.getElementById('btn-mic').innerText = 'MIC INPUT [OFF]';
          document.getElementById('btn-mic').className = 'btn btn-outline';
        }
      } catch (err) {
        alert('Microphone permission required for vocal recording.');
      }
    }

    function startRoundClock() {
      secondsLeft = 120;
      if (roundTimer) clearInterval(roundTimer);
      roundTimer = setInterval(() => {
        secondsLeft--;
        const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
        const s = (secondsLeft % 60).toString().padStart(2, '0');
        document.getElementById('round-clock').innerText = m + ':' + s;
        if (secondsLeft <= 0) {
          clearInterval(roundTimer);
          stopEngine();
          showSummary();
        }
      }, 1000);
    }

    function showSummary() {
      document.getElementById('sum-trials').innerText = trialsCount;
      document.getElementById('sum-bpm').innerText = bpm;
      document.getElementById('sum-bars').innerText = totalBars;
      document.getElementById('summary-modal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('summary-modal').classList.add('hidden');
    }

    function restartRound() {
      closeModal();
      totalBars = 0;
      trialsCount = 1;
      cyclePrompts();
      startEngine();
    }

    // Oscilloscope canvas animation
    const canvas = document.getElementById('oscilloscope');
    const ctx = canvas.getContext('2d');
    let phase = 0;
    function renderOsc() {
      requestAnimationFrame(renderOsc);
      ctx.fillStyle = '#080c0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = isPlaying ? '#00ff88' : '#223';
      ctx.lineWidth = 2;
      ctx.beginPath();
      phase += 0.05;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.03 + phase) * (isPlaying ? 15 : 2);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    renderOsc();
  </script>
</body>
</html>`;
}

export function downloadSingleFileHtml() {
  const content = generateSingleFileHtml();
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VocalFlow-Standalone-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
