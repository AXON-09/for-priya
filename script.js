/**
 * A STORY FOR PRIYA — INTERACTIVE ROMANTIC EXPERIENCE
 * Dedicated to Priya from Ashu
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const state = {
    currentPage: 1,
    isTransitioning: false,
    noClickCountProposal: 0,
    noClickCountDate: 0,
    envelopeOpened: false,
    musicPlaying: false,
    synthAudioPlaying: false
  };

  // Pleading phrases for Proposal NO button
  const proposalPleadMessages = [
    "Nooo Priya 😭",
    "Please reconsider... 🥺",
    "Are you sure? 🥺",
    "Look at my innocent face first...",
    "Ek baar YES bol do na... ❤️",
    "Please Priya... itna bhi kya attitude 😭",
    "Masoom chehra dekh ke YES bol do na 🥺"
  ];

  // ==========================================================================
  // DOM REFERENCES
  // ==========================================================================
  const appContainer = document.getElementById('appContainer');
  const pages = {
    p1: document.getElementById('page1'),
    p2: document.getElementById('page2'),
    p3: document.getElementById('page3'),
    p4: document.getElementById('page4'),
    p5: document.getElementById('page5'),
    p6: document.getElementById('page6'),
    p7: document.getElementById('page7')
  };

  // Music elements
  const bgMusic = document.getElementById('backgroundMusic');
  const musicWidget = document.getElementById('musicWidget');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');

  // Page 1 Elements
  const p1RefreshBtn = document.getElementById('p1RefreshBtn');

  // Page 2 Elements
  const p2YesBtn = document.getElementById('p2YesBtn');
  const p2NoBtn = document.getElementById('p2NoBtn');
  const p2PleadBubble = document.getElementById('p2PleadBubble');
  const ashuPleadCard = document.getElementById('ashuPleadCard');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const proposalCard = document.getElementById('proposalCard');

  // Page 3 Elements
  const p3ContinueBtn = document.getElementById('p3ContinueBtn');

  // Page 4 Elements
  const interactiveEnvelope = document.getElementById('interactiveEnvelope');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const openLetterSheet = document.getElementById('openLetterSheet');
  const p4ContinueBtn = document.getElementById('p4ContinueBtn');

  // Page 5 Elements
  const p5TapHeartBtn = document.getElementById('p5TapHeartBtn');

  // Page 6 Elements
  const p6GoBtn = document.getElementById('p6GoBtn');
  const p6NoBtn = document.getElementById('p6NoBtn');
  const datePleadBubble = document.getElementById('datePleadBubble');
  const dateConfirmModal = document.getElementById('dateConfirmModal');
  const dateConfirmTitle = document.getElementById('dateConfirmTitle');
  const dateConfirmText = document.getElementById('dateConfirmText');

  // Page 7 Elements
  const replayStoryBtn = document.getElementById('replayStoryBtn');

  // ==========================================================================
  // IMAGE FALLBACK SYSTEM (Handles missing assets gracefully)
  // ==========================================================================
  function setupImageFallbacks() {
    const candidateExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

    document.querySelectorAll('.fallbackable-img').forEach(img => {
      img.dataset.attemptIndex = "0";

      img.addEventListener('error', function () {
        const currentSrc = this.getAttribute('src') || '';
        let attempt = parseInt(this.dataset.attemptIndex || "0", 10);

        // Try alternative extensions before drawing SVG placeholder
        const basePath = currentSrc.substring(0, currentSrc.lastIndexOf('.')) || currentSrc;
        const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.')).toLowerCase();

        const remainingExts = candidateExtensions.filter(ext => ext !== currentExt);

        if (attempt < remainingExts.length) {
          const nextExt = remainingExts[attempt];
          this.dataset.attemptIndex = (attempt + 1).toString();
          this.src = basePath + nextExt;
          return;
        }

        // If all extensions fail, render elegant SVG fallback
        const caption = this.getAttribute('data-caption') || '❤️ For Priya ❤️';
        const isAshu = this.id === 'ashuFaceImg';
        const isEyes = this.id === 'eyesPhoto';

        const bg = isAshu ? '#f8d7da' : (isEyes ? '#f3e8f6' : '#fde2e4');
        const icon = isAshu ? '🥺' : (isEyes ? '✨👁️✨' : '🌸');

        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${bg}" />
                <stop offset="100%" stop-color="#fff0f3" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
            <circle cx="200" cy="120" r="45" fill="rgba(214, 125, 142, 0.2)" />
            <text x="200" y="132" font-size="34" text-anchor="middle">${icon}</text>
            <text x="200" y="200" font-family="'Cormorant Garamond', serif" font-size="20" font-weight="bold" fill="#591d28" text-anchor="middle">${caption}</text>
          </svg>
        `.trim();

        this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        this.style.filter = 'none';
        this.style.opacity = '1';
      });
    });
  }
  setupImageFallbacks();

  // ==========================================================================
  // AMBIENT BACKGROUND CANVAS (Floating Hearts & Bokeh)
  // ==========================================================================
  const ambCanvas = document.getElementById('ambientCanvas');
  const ambCtx = ambCanvas.getContext('2d');
  let ambWidth = (ambCanvas.width = window.innerWidth);
  let ambHeight = (ambCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    ambWidth = ambCanvas.width = window.innerWidth;
    ambHeight = ambCanvas.height = window.innerHeight;
  });

  const ambientParticles = [];
  const PARTICLE_COUNT = Math.min(32, Math.floor(window.innerWidth / 30));

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * ambWidth;
      this.y = initial ? Math.random() * ambHeight : ambHeight + 20;
      this.size = Math.random() * 12 + 6;
      this.speed = Math.random() * 0.45 + 0.2;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.isHeart = Math.random() > 0.4;
      this.sway = Math.random() * 2 + 1;
      this.swaySpeed = Math.random() * 0.02 + 0.008;
      this.angle = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speed;
      this.angle += this.swaySpeed;
      this.x += Math.sin(this.angle) * 0.4;
      if (this.y < -30) {
        this.reset(false);
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      if (this.isHeart) {
        ctx.fillStyle = '#e894a4';
        drawHeart(ctx, 0, 0, this.size);
      } else {
        // Soft glowing circle
        ctx.fillStyle = '#fce4ec';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    ambientParticles.push(new AmbientParticle());
  }

  function animateAmbient() {
    ambCtx.clearRect(0, 0, ambWidth, ambHeight);
    ambientParticles.forEach(p => {
      p.update();
      p.draw(ambCtx);
    });
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // ==========================================================================
  // CONFETTI SYSTEM (Hearts, Stars, Petals)
  // ==========================================================================
  const confCanvas = document.getElementById('confettiCanvas');
  const confCtx = confCanvas.getContext('2d');
  let confWidth = (confCanvas.width = window.innerWidth);
  let confHeight = (confCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    confWidth = confCanvas.width = window.innerWidth;
    confHeight = confCanvas.height = window.innerHeight;
  });

  let confettiPieces = [];

  class ConfettiPiece {
    constructor(originX, originY) {
      this.x = originX || confWidth / 2;
      this.y = originY || confHeight / 2;
      this.vx = (Math.random() - 0.5) * 12;
      this.vy = -(Math.random() * 10 + 6);
      this.gravity = 0.22;
      this.drag = 0.98;
      this.size = Math.random() * 10 + 6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.opacity = 1;
      this.type = Math.random() > 0.5 ? 'heart' : (Math.random() > 0.5 ? 'star' : 'petal');
      const colors = ['#e63946', '#f4a261', '#e87a90', '#d88a9a', '#ffd166', '#f8bbd0', '#ffccd5'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.vx *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      if (this.y > confHeight * 0.4) {
        this.opacity -= 0.012;
      }
    }
    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      if (this.type === 'heart') {
        drawHeart(ctx, 0, -this.size / 2, this.size);
      } else if (this.type === 'star') {
        drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.6, this.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  function fireConfetti(count = 70, x, y) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece(x, y));
    }
  }

  function animateConfetti() {
    confCtx.clearRect(0, 0, confWidth, confHeight);
    confettiPieces = confettiPieces.filter(p => p.opacity > 0 && p.y < confHeight + 50);
    confettiPieces.forEach(p => {
      p.update();
      p.draw(confCtx);
    });
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // ==========================================================================
  // AUDIO CONTROLLER & WEB AUDIO SYNTH FALLBACK
  // ==========================================================================
  let audioCtx = null;
  let synthInterval = null;

  function initWebAudioFallback() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  // Romantic Violin & Warm Ambient Piano Synth Fallback Engine
  function playRomanticSynthMelody() {
    if (!audioCtx) initWebAudioFallback();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    state.synthAudioPlaying = true;
    updateMusicUI(true);

    // Emotional romantic chord progression in D Major / F# Minor / G / A
    const notes = [
      // Phrase 1 (Gentle warmth)
      { freq: 293.66, dur: 2.2 }, // D4
      { freq: 369.99, dur: 2.0 }, // F#4
      { freq: 440.00, dur: 2.8 }, // A4
      { freq: 587.33, dur: 3.5 }, // D5
      // Phrase 2 (Nostalgic confession)
      { freq: 554.37, dur: 2.0 }, // C#5
      { freq: 440.00, dur: 2.2 }, // A4
      { freq: 493.88, dur: 2.8 }, // B4
      { freq: 369.99, dur: 3.8 }, // F#4
      // Phrase 3 (Sweet longing)
      { freq: 392.00, dur: 2.4 }, // G4
      { freq: 440.00, dur: 2.0 }, // A4
      { freq: 587.33, dur: 3.0 }, // D5
      { freq: 659.25, dur: 4.0 }  // E5
    ];

    let noteIdx = 0;

    function playNextNote() {
      if (!state.synthAudioPlaying || !audioCtx) return;
      const n = notes[noteIdx];
      noteIdx = (noteIdx + 1) % notes.length;

      const now = audioCtx.currentTime;
      // Violin-like oscillator (Sawtooth with low-pass filter)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.freq, now);
      // Subtle natural vibrato
      const vibrato = audioCtx.createOscillator();
      const vibGain = audioCtx.createGain();
      vibrato.frequency.setValueAtTime(4.8, now);
      vibGain.gain.setValueAtTime(2.5, now);
      vibrato.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + n.dur);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      // Smooth envelope attack and release
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + n.dur);

      synthInterval = setTimeout(playNextNote, (n.dur - 0.4) * 1000);
    }

    playNextNote();
  }

  function stopRomanticSynthMelody() {
    state.synthAudioPlaying = false;
    if (synthInterval) clearTimeout(synthInterval);
    updateMusicUI(false);
  }

  function startMusic() {
    bgMusic.volume = 0.28;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.musicPlaying = true;
          updateMusicUI(true);
        })
        .catch(() => {
          // If mp3 file is not present or failed, fallback to our built-in romantic synth
          playRomanticSynthMelody();
        });
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    state.musicPlaying = false;
    stopRomanticSynthMelody();
    updateMusicUI(false);
  }

  function toggleMusic() {
    if (state.musicPlaying || state.synthAudioPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }

  function updateMusicUI(isPlaying) {
    if (isPlaying) {
      musicToggleBtn.classList.add('playing');
      musicIcon.textContent = '🎵';
      musicToggleBtn.setAttribute('title', 'Pause Music');
    } else {
      musicToggleBtn.classList.remove('playing');
      musicIcon.textContent = '🔇';
      musicToggleBtn.setAttribute('title', 'Play Music');
    }
  }

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initWebAudioFallback();
    toggleMusic();
  });

  // ==========================================================================
  // SMOOTH PAGE TRANSITION SYSTEM
  // ==========================================================================
  function goToPage(targetPageNumber) {
    if (state.isTransitioning) return;
    if (state.currentPage === targetPageNumber) return;

    state.isTransitioning = true;
    const fromPage = pages[`p${state.currentPage}`];
    const toPage = pages[`p${targetPageNumber}`];

    if (!fromPage || !toPage) {
      state.isTransitioning = false;
      return;
    }

    // Fade out current page
    fromPage.classList.remove('visible');
    fromPage.classList.add('fade-out');

    setTimeout(() => {
      fromPage.classList.remove('active', 'fade-out');
      toPage.classList.add('active');

      // Scroll to top of window smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger entrance
      setTimeout(() => {
        toPage.classList.add('visible');
        state.currentPage = targetPageNumber;
        state.isTransitioning = false;
        onPageEnter(targetPageNumber);
      }, 50);
    }, 600);
  }

  function onPageEnter(pageNumber) {
    // Page specific triggers
    if (pageNumber === 4 && state.envelopeOpened) {
      revealLetterParagraphs();
    } else if (pageNumber === 7) {
      revealFinalLines();
    }
  }

  // Initialize Page 1
  setTimeout(() => {
    pages.p1.classList.add('visible');
  }, 100);

  // ==========================================================================
  // PAGE 1: REFRESH BUTTON
  // ==========================================================================
  p1RefreshBtn.addEventListener('click', () => {
    initWebAudioFallback();
    startMusic();
    goToPage(2);
  });

  // ==========================================================================
  // PAGE 2: PROPOSAL & SMART SMOOTH EVASIVE NO BUTTON LOGIC
  // ==========================================================================
  let noBtnCurrentTx = 0;
  let noBtnCurrentTy = 0;
  let lastMoveTime = 0;

  function moveNoButton() {
    state.noClickCountProposal++;

    const card = document.getElementById('proposalCard');
    const cardRect = card.getBoundingClientRect();
    const btnRect = p2NoBtn.getBoundingClientRect();
    const yesRect = p2YesBtn.getBoundingClientRect();
    const qEl = document.querySelector('.proposal-main-question');
    const qRect = qEl ? qEl.getBoundingClientRect() : { bottom: btnRect.top - 20 };

    // Untranslated base button coordinates
    const baseBtnLeft = btnRect.left - noBtnCurrentTx;
    const baseBtnTop = btnRect.top - noBtnCurrentTy;
    const btnW = btnRect.width;
    const btnH = btnRect.height;

    // Horizontal bounds within card with padding
    const minTx = (cardRect.left + 20) - baseBtnLeft;
    const maxTx = (cardRect.right - btnW - 20) - baseBtnLeft;

    // Vertical bounds: MUST STAY STRICTLY BELOW QUESTION TEXT ("Will you be mine?")
    const minTy = Math.max((qRect.bottom + 14) - baseBtnTop, -8);
    const maxTy = Math.min((cardRect.bottom - btnH - 20) - baseBtnTop, 120);

    let bestTx = noBtnCurrentTx;
    let bestTy = noBtnCurrentTy;
    let found = false;

    // Search for a truly random safe displacement
    for (let attempt = 0; attempt < 30; attempt++) {
      const candTx = Math.random() * (maxTx - minTx) + minTx;
      const candTy = Math.random() * (maxTy - minTy) + minTy;

      // Ensure distinct smooth jump distance
      const dist = Math.hypot(candTx - noBtnCurrentTx, candTy - noBtnCurrentTy);
      if (dist < 40) continue;

      const projLeft = baseBtnLeft + candTx;
      const projTop = baseBtnTop + candTy;
      const projRight = projLeft + btnW;
      const projBottom = projTop + btnH;

      // 1. Do NOT overlap YES button
      const overlapYes = !(
        projRight < yesRect.left - 14 ||
        projLeft > yesRect.right + 14 ||
        projBottom < yesRect.top - 14 ||
        projTop > yesRect.bottom + 14
      );
      if (overlapYes) continue;

      // 2. Do NOT overlap question heading or text above
      if (projTop < qRect.bottom + 10) continue;

      bestTx = candTx;
      bestTy = candTy;
      found = true;
      break;
    }

    // Curated safe backup spots if tightly constrained
    if (!found) {
      const safeSpots = [
        { x: maxTx * 0.85, y: Math.max(minTy, 25) },
        { x: minTx * 0.75, y: Math.max(minTy, 45) },
        { x: maxTx * 0.45, y: Math.max(minTy, 70) },
        { x: minTx * 0.4, y: Math.max(minTy, 85) },
        { x: maxTx * 0.9, y: Math.max(minTy, 10) }
      ];
      const spot = safeSpots[(state.noClickCountProposal - 1) % safeSpots.length];
      bestTx = spot.x;
      bestTy = spot.y;
    }

    noBtnCurrentTx = bestTx;
    noBtnCurrentTy = bestTy;

    // Smooth springy translation with subtle playful tilt
    const playfulRot = (Math.random() - 0.5) * 14;
    p2NoBtn.style.transform = `translate3d(${noBtnCurrentTx}px, ${noBtnCurrentTy}px, 0) rotate(${playfulRot}deg)`;

    // Show cute pleading message
    const msgIndex = (state.noClickCountProposal - 1) % proposalPleadMessages.length;
    p2PleadBubble.textContent = proposalPleadMessages[msgIndex];
    p2PleadBubble.classList.add('show');

    // Reveal Ashu face card on first attempt
    if (!ashuPleadCard.classList.contains('show')) {
      ashuPleadCard.classList.add('show');
    }
  }

  function handleNoEvasion(e) {
    if (e && e.type === 'touchstart') {
      e.preventDefault();
    }
    const now = Date.now();
    if (now - lastMoveTime < 160) return;
    lastMoveTime = now;
    moveNoButton();
  }

  p2NoBtn.addEventListener('mouseenter', handleNoEvasion);
  p2NoBtn.addEventListener('pointerenter', handleNoEvasion);
  p2NoBtn.addEventListener('touchstart', handleNoEvasion, { passive: false });
  p2NoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleNoEvasion(e);
  });

  // YES Button on Proposal
  p2YesBtn.addEventListener('click', () => {
    // Hide running NO button if detached
    p2NoBtn.style.display = 'none';
    p2PleadBubble.style.display = 'none';

    // Show Celebration Overlay
    celebrationOverlay.classList.add('show');
    fireConfetti(90);

    // Warm up audio if not already running
    startMusic();

    // After 2.6s delay, transition smoothly to Page 3 (The Eyes)
    setTimeout(() => {
      goToPage(3);
    }, 2600);
  });

  // ==========================================================================
  // PAGE 3: THE EYES CONTINUE BUTTON
  // ==========================================================================
  p3ContinueBtn.addEventListener('click', () => {
    goToPage(4);
  });

  // ==========================================================================
  // PAGE 4: 3D INTERACTIVE LOVE LETTER ENVELOPE
  // ==========================================================================
  function openLoveLetter() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;

    interactiveEnvelope.classList.add('opened');
    fireConfetti(35, window.innerWidth / 2, window.innerHeight / 2);

    setTimeout(() => {
      envelopeContainer.classList.add('hidden');
      openLetterSheet.classList.add('show');
      revealLetterParagraphs();
    }, 900);
  }

  interactiveEnvelope.addEventListener('click', openLoveLetter);
  interactiveEnvelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLoveLetter();
    }
  });

  function revealLetterParagraphs() {
    const paras = document.querySelectorAll('#letterContent .letter-para');
    const signature = document.querySelector('.letter-signature');

    paras.forEach((para, idx) => {
      setTimeout(() => {
        para.classList.add('revealed');
      }, idx * 260);
    });

    setTimeout(() => {
      if (signature) signature.classList.add('revealed');
    }, paras.length * 260 + 200);
  }

  p4ContinueBtn.addEventListener('click', () => {
    goToPage(5);
  });

  // ==========================================================================
  // CENTRALIZED HEARTBEAT HAPTIC FEEDBACK (FOR ALL BUTTONS & INTERACTIVE CONTROLS)
  // ==========================================================================
  let lastHapticVibrateTime = 0;

  function triggerHeartbeatHaptic() {
    if ('vibrate' in navigator) {
      const now = Date.now();
      // Prevent overlapping vibration patterns if user taps rapidly (350ms window)
      if (now - lastHapticVibrateTime < 350) return;
      lastHapticVibrateTime = now;

      try {
        // Heartbeat pattern: beat (60ms) -> pause (50ms) -> beat (100ms)
        navigator.vibrate([60, 50, 100]);
      } catch (err) {
        // Graceful fallback for devices/browsers that restrict vibration
      }
    }
  }

  // Centralized event listener using event delegation for all interactive elements
  document.addEventListener('pointerdown', (e) => {
    const interactiveTarget = e.target.closest('button, [role="button"], .btn, .envelope-box, .tap-heart-btn, .music-btn, a');
    if (interactiveTarget) {
      triggerHeartbeatHaptic();
    }
  }, { passive: true });

  // ==========================================================================
  // PAGE 5: BIRTHDAY & BEATING HEART TAP
  // ==========================================================================
  p5TapHeartBtn.addEventListener('click', (e) => {
    const rect = p5TapHeartBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    fireConfetti(45, cx, cy);

    setTimeout(() => {
      goToPage(6);
    }, 600);
  });

  // ==========================================================================
  // PAGE 6: DATE REQUEST & PLAYFUL NO
  // ==========================================================================
  p6NoBtn.addEventListener('click', () => {
    state.noClickCountDate++;

    dateConfirmTitle.textContent = "NO again?! 😭";
    dateConfirmText.innerHTML = `
      After all this effort...<br>
      <strong>You are going there anyway. 😂❤️</strong><br><br>
      <em>There is absolutely no escaping the date now.<br>Fine... I'll wait for you. ❤️</em>
    `;
    dateConfirmModal.classList.add('show');

    setTimeout(() => {
      goToPage(7);
    }, 3800);
  });

  p6GoBtn.addEventListener('click', () => {
    dateConfirmTitle.textContent = "I KNEW IT. ❤️😭";
    dateConfirmText.textContent = "Date confirmed in my heart.";
    dateConfirmModal.classList.add('show');
    fireConfetti(60);

    setTimeout(() => {
      goToPage(7);
    }, 2200);
  });

  // ==========================================================================
  // PAGE 7 / 8: FINAL PEACEFUL EMOTIONAL ENDING
  // ==========================================================================
  function revealFinalLines() {
    const lines = document.querySelectorAll('#finalSequence .final-line');
    const sig = document.querySelector('.final-signature');
    const bdayNote = document.querySelector('.final-ending-salute');

    lines.forEach((line, idx) => {
      setTimeout(() => {
        line.classList.add('revealed');
      }, (idx + 1) * 700);
    });

    setTimeout(() => {
      if (sig) sig.classList.add('revealed');
    }, (lines.length + 1) * 700);

    setTimeout(() => {
      if (bdayNote) bdayNote.classList.add('revealed');
      fireConfetti(25, window.innerWidth / 2, window.innerHeight * 0.7);
    }, (lines.length + 2) * 700 + 400);
  }

  // Replay Story
  replayStoryBtn.addEventListener('click', () => {
    // Reset state variables
    state.noClickCountProposal = 0;
    state.noClickCountDate = 0;
    state.envelopeOpened = false;

    // Reset NO button
    noBtnCurrentTx = 0;
    noBtnCurrentTy = 0;
    p2NoBtn.classList.remove('running');
    p2NoBtn.removeAttribute('style');
    p2NoBtn.style.transform = 'translate3d(0, 0, 0)';
    p2PleadBubble.classList.remove('show');
    p2PleadBubble.removeAttribute('style');
    p2NoBtn.style.display = 'inline-flex';
    celebrationOverlay.classList.remove('show');
    ashuPleadCard.classList.remove('show');

    // Reset envelope
    interactiveEnvelope.classList.remove('opened');
    envelopeContainer.classList.remove('hidden');
    openLetterSheet.classList.remove('show');
    document.querySelectorAll('#letterContent .letter-para').forEach(p => p.classList.remove('revealed'));
    const letterSig = document.querySelector('.letter-signature');
    if (letterSig) letterSig.classList.remove('revealed');

    // Reset date modal
    dateConfirmModal.classList.remove('show');

    // Reset final sequence
    document.querySelectorAll('#finalSequence .final-line').forEach(l => l.classList.remove('revealed'));
    const finalSig = document.querySelector('.final-signature');
    if (finalSig) finalSig.classList.remove('revealed');
    const bdaySalute = document.querySelector('.final-ending-salute');
    if (bdaySalute) bdaySalute.classList.remove('revealed');

    goToPage(1);
  });

});
