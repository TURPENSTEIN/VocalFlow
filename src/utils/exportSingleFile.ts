/**
 * Utility to export a complete, self-contained single-file HTML/CSS/JS version
 * of VocalFlow that can be downloaded and opened directly in any browser offline.
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
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #050505;
      color: #e0e0e0;
      font-family: 'JetBrains Mono', monospace;
      padding: 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .app-container { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 20px; }
    .discord-banner { background: #0a0f1d; border: 1px solid #5865F2; border-radius: 8px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; box-shadow: 0 4px 15px rgba(88,101,242,0.2); }
    .discord-banner a { color: #00ff88; text-decoration: underline; font-weight: bold; }
    .discord-banner a:hover { color: #5865F2; }
    .discord-btn { background: #5865F2; color: #fff; text-decoration: none; padding: 5px 12px; border-radius: 5px; font-weight: bold; font-size: 11px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1a3324; padding-bottom: 12px; }
    .logo { font-size: 24px; font-weight: 800; color: #00ff88; text-shadow: 0 0 15px rgba(0,255,136,0.5); }
    .status-badge { font-size: 11px; padding: 4px 8px; border-radius: 4px; border: 1px solid #00e5ff; color: #00e5ff; }
    
    .cards-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .cards-grid { grid-template-columns: 1fr; } }
    
    .card { background: #080c0a; border: 2px solid #183322; border-radius: 12px; padding: 20px; position: relative; }
    .card.cyan { border-color: #173847; }
    .card-label { font-size: 11px; color: #00ff88; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; }
    .card.cyan .card-label { color: #00e5ff; }
    
    .prompt-word { font-size: 52px; font-weight: 800; text-align: center; margin: 20px 0; color: #ffffff; text-shadow: 0 0 20px rgba(0,255,136,0.4); text-transform: uppercase; }
    .prompt-hints { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
    .hint-tag { background: #0e1a13; border: 1px solid #1f422b; color: #00ff88; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    
    .constraint-title { font-size: 24px; font-weight: 800; color: #ffffff; margin: 12px 0 6px 0; text-shadow: 0 0 10px rgba(0,229,255,0.4); }
    .formula-box { background: #0c181f; border: 1px solid #1c4154; padding: 10px; border-radius: 6px; color: #00e5ff; font-weight: bold; margin: 10px 0; font-size: 13px; }
    .constraint-desc { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    
    .hud { background: #090e0b; border: 1px solid #1a3324; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .bar-steps { display: flex; gap: 8px; }
    .bar-step { flex: 1; padding: 8px; text-align: center; font-size: 12px; font-weight: bold; border-radius: 4px; border: 1px solid #222; background: #111; color: #555; }
    .bar-step.active { border-color: #00ff88; background: rgba(0,255,136,0.15); color: #00ff88; box-shadow: 0 0 12px rgba(0,255,136,0.3); }
    
    .beats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .beat-dot { padding: 10px; text-align: center; border-radius: 4px; border: 1px solid #1a261f; background: #060a08; font-size: 12px; font-weight: bold; }
    .beat-dot.active { border-color: #00e5ff; background: rgba(0,229,255,0.2); color: #00e5ff; box-shadow: 0 0 10px rgba(0,229,255,0.5); }
    .beat-dot.downbeat.active { border-color: #00ff88; background: rgba(0,255,136,0.2); color: #00ff88; box-shadow: 0 0 15px rgba(0,255,136,0.6); }
    
    .controls { background: #090e0b; border: 1px solid #1a3324; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .btn-row { display: flex; gap: 12px; flex-wrap: wrap; }
    button { font-family: inherit; cursor: pointer; border-radius: 6px; padding: 10px 18px; font-size: 13px; font-weight: 800; border: none; transition: 0.1s; }
    .btn-primary { background: #00ff88; color: #000; box-shadow: 0 0 15px rgba(0,255,136,0.4); }
    .btn-danger { background: #ff3355; color: #fff; box-shadow: 0 0 15px rgba(255,51,85,0.4); }
    .btn-secondary { background: #131d17; border: 1px solid #23422e; color: #e0e0e0; }
    .btn-secondary.active { border-color: #ff3355; background: rgba(255,51,85,0.2); color: #ff8899; }
    .btn-distract.active { border-color: #ffaa00; background: rgba(255,170,0,0.2); color: #ffaa00; }
    
    .slider-group { display: flex; align-items: center; gap: 12px; }
    input[type=range] { flex: 1; accent-color: #00ff88; }
    canvas { width: 100%; height: 75px; background: #050806; border: 1px solid #132419; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="app-container">
    <div class="discord-banner">
      <div>💬 <strong>COMMUNITY:</strong> Join our circle <a href="https://discord.gg/brain" target="_blank" rel="noopener noreferrer">MINDBUILDING</a> (discord.gg/brain)</div>
      <a class="discord-btn" href="https://discord.gg/brain" target="_blank" rel="noopener noreferrer">Join Discord ↗</a>
    </div>

    <div class="header">
      <div class="logo">⚡ VOCALFLOW</div>
      <div id="round-clock" class="status-badge">TIME: 02:00</div>
    </div>

    <canvas id="osc-canvas" width="800" height="75"></canvas>

    <div class="cards-grid">
      <div class="card">
        <div class="card-label">MANDATORY WORD (4 BARS)</div>
        <div id="word-el" class="prompt-word">NEON</div>
        <div id="hints-el" class="prompt-hints">
          <span class="hint-tag">~beyond</span><span class="hint-tag">~freon</span><span class="hint-tag">~dawn</span>
        </div>
      </div>
      <div class="card cyan">
        <div class="card-label">RHYME / STRUCTURAL METER</div>
        <div id="constraint-title-el" class="constraint-title">AABB Couplets</div>
        <div id="constraint-formula-el" class="formula-box">Bar 1-2 (A), Bar 3-4 (B)</div>
        <div id="constraint-desc-el" class="constraint-desc">Rhyme the end of bar 1 with bar 2. Then establish a brand new rhyme across bars 3 and 4.</div>
      </div>
    </div>

    <div class="hud">
      <div class="bar-steps">
        <div id="bar-1" class="bar-step active">BAR 1/4</div>
        <div id="bar-2" class="bar-step">BAR 2/4</div>
        <div id="bar-3" class="bar-step">BAR 3/4</div>
        <div id="bar-4" class="bar-step">BAR 4/4</div>
      </div>
      <div class="beats-row">
        <div id="beat-0" class="beat-dot downbeat active">BEAT 1</div>
        <div id="beat-1" class="beat-dot">BEAT 2</div>
        <div id="beat-2" class="beat-dot">BEAT 3</div>
        <div id="beat-3" class="beat-dot">BEAT 4</div>
      </div>
    </div>

    <div class="controls">
      <div class="btn-row">
        <button id="btn-toggle-engine" class="btn-primary">START DRUM LOOP</button>
        <button id="btn-mic" class="btn-secondary">RECORD MIC: OFF</button>
        <button id="btn-distract" class="btn-secondary btn-distract">DISTRACTION: OFF</button>
      </div>
      <div class="slider-group">
        <label style="font-size: 12px; font-weight: bold; min-width: 110px;">BPM: <span id="bpm-val" style="color:#00ff88;">90</span></label>
        <input type="range" id="bpm-slider" min="60" max="120" value="90">
      </div>
    </div>
  </div>

  <script>
    // Embedded Audio & Game Engine
    const words = [
      { w: "NEON", hints: ["beyond", "freon", "dawn", "drawn"] },
      { w: "GRAVITY", hints: ["cavity", "sanity", "depravity", "clarity"] },
      { w: "VELOCITY", hints: ["ferocity", "atrocity", "reciprocity"] },
      { w: "ECHO", hints: ["shadow", "retro", "metro", "gecko"] },
      { w: "CIRCUIT", hints: ["surface", "worth it", "purpose"] },
      { w: "HORIZON", hints: ["rising", "poison", "surprising"] },
      { w: "ANVIL", hints: ["handle", "candid", "stand still"] },
      { w: "SYNAPSE", hints: ["collapse", "time lapse", "relapse"] },
      { w: "SHADOW", hints: ["meadow", "shallow", "narrow"] },
      { w: "VOLTAGE", hints: ["dosage", "hostage", "postage"] },
      { w: "CIPHER", hints: ["hyper", "sniper", "survivor"] },
      { w: "TEMPEST", hints: ["relentless", "endless", "breathless"] }
    ];

    const constraints = [
      { t: "AABB Couplets", f: "Bar 1-2 (A), Bar 3-4 (B)", d: "Rhyme bar 1 with bar 2. Start a fresh rhyme on bar 3 and 4." },
      { t: "ABAB Alternating", f: "Bar 1 & 3 (A), Bar 2 & 4 (B)", d: "Weave alternating rhymes across odd and even bars." },
      { t: "AAAA Monorhyme", f: "All 4 Bars End on Same Rhyme (A)", d: "Lock into a single vowel rhyme sound across all 4 measures." },
      { t: "8 Syllable Cadence", f: "Exactly 8 Syllables per Bar", d: "Even, punchy 8-syllable delivery matching 4 quarter notes." },
      { t: "Internal Rhyme", f: "Rhyme inside the bar + end of bar", d: "Place a rhyming word at beat 2.5 and another at bar end." },
      { t: "Triplet Flow", f: "3 Syllables per Beat (12 per Bar)", d: "Fast, rolling triplet cadence over the hi-hats." }
    ];

    let audioCtx = null;
    let isPlaying = false;
    let bpm = 90;
    let step = 0;
    let barInCycle = 0;
    let nextNoteTime = 0;
    let timerId = null;
    let distractionActive = false;
    let noiseSource = null;
    let noiseGain = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    function initAudio() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playKick(time) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.25);
      gain.gain.setValueAtTime(1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
    }

    function playSnare(time) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.12);
    }

    function playHat(time) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(8000, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.04);
    }

    function scheduleStep(s, time) {
      if (s === 0 || s === 10) playKick(time);
      if (s === 4 || s === 12) playSnare(time);
      if (s % 2 === 0) playHat(time);
      
      const beat = Math.floor(s / 4);
      setTimeout(() => {
        if (!isPlaying) return;
        updateUI(s, beat, barInCycle);
      }, Math.max(0, (time - audioCtx.currentTime) * 1000));
    }

    function scheduler() {
      while (nextNoteTime < audioCtx.currentTime + 0.1) {
        scheduleStep(step, nextNoteTime);
        const secPer16th = 60 / bpm / 4;
        nextNoteTime += secPer16th;
        step = (step + 1) % 16;
        if (step === 0) {
          barInCycle = (barInCycle + 1) % 4;
          if (barInCycle === 0) triggerNewPrompt();
        }
      }
      if (isPlaying) timerId = setTimeout(scheduler, 25);
    }

    function triggerNewPrompt() {
      const w = words[Math.floor(Math.random() * words.length)];
      const c = constraints[Math.floor(Math.random() * constraints.length)];
      document.getElementById('word-el').innerText = w.w;
      document.getElementById('hints-el').innerHTML = w.hints.map(h => '<span class="hint-tag">~' + h + '</span>').join('');
      document.getElementById('constraint-title-el').innerText = c.t;
      document.getElementById('constraint-formula-el').innerText = c.f;
      document.getElementById('constraint-desc-el').innerText = c.d;
    }

    function updateUI(step, beat, bar) {
      for (let i = 0; i < 4; i++) {
        document.getElementById('bar-' + (i + 1)).classList.toggle('active', i === bar);
        document.getElementById('beat-' + i).classList.toggle('active', i === beat);
      }
    }

    document.getElementById('btn-toggle-engine').onclick = function() {
      initAudio();
      isPlaying = !isPlaying;
      if (isPlaying) {
        this.innerText = 'STOP DRUM LOOP';
        this.className = 'btn-danger';
        step = 0;
        barInCycle = 0;
        nextNoteTime = audioCtx.currentTime + 0.05;
        scheduler();
      } else {
        this.innerText = 'START DRUM LOOP';
        this.className = 'btn-primary';
        clearTimeout(timerId);
      }
    };

    document.getElementById('bpm-slider').oninput = function(e) {
      bpm = Number(e.target.value);
      document.getElementById('bpm-val').innerText = bpm;
    };

    // Distraction Noise
    document.getElementById('btn-distract').onclick = function() {
      initAudio();
      distractionActive = !distractionActive;
      this.classList.toggle('active', distractionActive);
      this.innerText = distractionActive ? 'DISTRACTION: ON' : 'DISTRACTION: OFF';
      if (distractionActive) {
        const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
        const d = buf.getChannelData(0);
        for(let i=0; i<d.length; i++) d[i] = Math.random() * 2 - 1;
        noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buf;
        noiseSource.loop = true;
        noiseGain = audioCtx.createGain();
        noiseGain.gain.value = 0.2;
        noiseSource.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseSource.start();
      } else if (noiseSource) {
        noiseSource.stop();
        noiseSource = null;
      }
    };

    // Mic recording
    document.getElementById('btn-mic').onclick = async function() {
      if (!isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          recordedChunks = [];
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'vocalflow-recording.webm';
            a.innerText = 'DOWNLOAD RECORDING';
            a.className = 'btn-primary';
            a.style.display = 'inline-block';
            a.style.marginTop = '10px';
            document.querySelector('.controls').appendChild(a);
          };
          mediaRecorder.start();
          isRecording = true;
          this.innerText = 'RECORD MIC: ON [REC]';
          this.classList.add('active');
        } catch (e) {
          alert('Microphone access denied.');
        }
      } else {
        mediaRecorder.stop();
        isRecording = false;
        this.innerText = 'RECORD MIC: OFF';
        this.classList.remove('active');
      }
    };

    // Simple canvas visualizer
    const canvas = document.getElementById('osc-canvas');
    const cCtx = canvas.getContext('2d');
    let phase = 0;
    function drawOsc() {
      requestAnimationFrame(drawOsc);
      cCtx.fillStyle = '#050806';
      cCtx.fillRect(0, 0, canvas.width, canvas.height);
      cCtx.strokeStyle = isPlaying ? '#00ff88' : '#223328';
      cCtx.lineWidth = 2;
      cCtx.beginPath();
      phase += 0.05;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x / canvas.width) * Math.PI * 6 + phase) * (isPlaying ? 15 : 3);
        if (x === 0) cCtx.moveTo(x, y); else cCtx.lineTo(x, y);
      }
      cCtx.stroke();
    }
    drawOsc();
  </script>
</body>
</html>`;
}

export function downloadSingleFileHtml(): void {
  const html = generateSingleFileHtml();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vocalflow-standalone.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
