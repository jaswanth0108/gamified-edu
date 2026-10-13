/**
 * LearnQuest — Game Engine v5
 *
 * - Strict 3-Lane Movement: Left (-1), Center (0), Right (+1) only
 * - Realistic Character Design: Pre-processed transparent adventurer cutout with dynamic stride kinematics,
 *   banking roll, contact shadow, dust puffs, and magical equipment aura
 * - 3-Lane Quick Nav Dock + 3 Discrete Touch Zones + Full Keyboard (Arrows / WASD / 1-2-3 / Space)
 * - Collectibles: Golden Stars (⭐ +10), Knowledge Gems (💎 +50), Magnetic Compass (🧲 6s attraction power-up)
 * - Dodging Obstacles: Holographic energy hurdles with dodge bonus (+20 XP)
 * - Combo Streak (🔥 2x / 3x multiplier) and floating action score popups
 * - Glassmorphic Question Checkpoint with realistic character duo
 */

import { getQuestionsForLevel, getLevels, APP_CONFIG, CORRECT_MESSAGES, INCORRECT_MESSAGES } from './curriculum-data.js';

const RUN_SECONDS = 7;
const LANE_OFFSETS = [-1, 0, 1]; // Left (-1), Center (0), Right (+1)

/* Subject color themes */
const THEMES = {
  mathematics:     { sky: ['#0d0521','#1a0a3e','#2d1b69'], road: '#22154d', line: '#6C5CE7', accent: '#a78bfa', gem: '#00CEC9' },
  science:         { sky: ['#021002','#011a01','#0a2e0a'], road: '#082611', line: '#00B894', accent: '#00E676', gem: '#55EFC4' },
  english:         { sky: ['#0a0015','#1a0a2e','#2d1650'], road: '#1c0c36', line: '#8e44ad', accent: '#CE93D8', gem: '#FDA7DF' },
  'social-science':{ sky: ['#0d0800','#1a0e00','#2e1a00'], road: '#261300', line: '#f39c12', accent: '#FFAB40', gem: '#FDCB6E' },
  hindi:           { sky: ['#0d0008','#1a0010','#300020'], road: '#280013', line: '#e91e63', accent: '#FF80AB', gem: '#FF7675' },
};

/**
 * Pre-processes high-resolution character image:
 * Removes light background using boundary BFS flood-fill and returns a crisp transparent sprite canvas.
 */
function prepareCharacterSprite(img) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) return null;

  const canvas = document.createElement('canvas');
  const targetW = 320;
  const targetH = Math.round((h / w) * targetW);
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, targetW, targetH);

  try {
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;
    const visited = new Uint8Array(targetW * targetH);
    const queue = [];

    const isBg = (idx) => {
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const minVal = Math.min(r, g, b);
      const maxVal = Math.max(r, g, b);
      return minVal > 218 && (maxVal - minVal) < 28;
    };

    // Seed flood-fill from the 4 outer borders
    for (let x = 0; x < targetW; x++) {
      let top = x * 4;
      if (isBg(top)) { visited[x] = 1; queue.push(x); }
      let bot = ((targetH - 1) * targetW + x) * 4;
      if (isBg(bot)) { visited[(targetH - 1) * targetW + x] = 1; queue.push((targetH - 1) * targetW + x); }
    }
    for (let y = 0; y < targetH; y++) {
      let left = (y * targetW) * 4;
      if (isBg(left) && !visited[y * targetW]) { visited[y * targetW] = 1; queue.push(y * targetW); }
      let right = (y * targetW + (targetW - 1)) * 4;
      if (isBg(right) && !visited[y * targetW + targetW - 1]) { visited[y * targetW + targetW - 1] = 1; queue.push(y * targetW + targetW - 1); }
    }

    let qHead = 0;
    while (qHead < queue.length) {
      const p = queue[qHead++];
      const px = p % targetW;
      const py = Math.floor(p / targetW);

      const neighbors = [
        px > 0 ? p - 1 : -1,
        px < targetW - 1 ? p + 1 : -1,
        py > 0 ? p - targetW : -1,
        py < targetH - 1 ? p + targetW : -1
      ];

      for (const n of neighbors) {
        if (n !== -1 && !visited[n]) {
          if (isBg(n * 4)) {
            visited[n] = 1;
            queue.push(n);
          }
        }
      }
    }

    // Apply transparent knockout with anti-aliased edge feathering
    for (let p = 0; p < targetW * targetH; p++) {
      if (visited[p]) {
        const idx = p * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const minVal = Math.min(r, g, b);
        if (minVal >= 242) {
          data[idx + 3] = 0;
        } else {
          const factor = Math.max(0, (242 - minVal) / 24);
          data[idx + 3] = Math.floor(data[idx + 3] * factor * 0.35);
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.warn('Character sprite cutout fallback:', err);
  }

  return canvas;
}

export class GameEngine {
  constructor(store, sound, callbacks = {}) {
    this.store     = store;
    this.sound     = sound;
    this.callbacks = callbacks;

    this.canvas = null;
    this.ctx    = null;

    /* Runner state */
    this.running   = false;
    this.paused    = false;
    this.speed     = 2.8; // Gentle, smooth starting speed
    this.distance  = 0;
    this.coins     = 0;
    this.lane      = 0;           // STRICTLY: -1 (Left), 0 (Center), 1 (Right)
    this.laneAnim  = 0;           // Smooth lerp coordinate
    this.tiltAngle = 0;           // Banking roll on lane switch
    this.frameId   = null;
    this.lastTime  = 0;
    this.runTimer  = 0;

    /* Collectibles & Obstacles */
    this.items         = [];      // Stars, gems, magnet pickups
    this.obstacles     = [];      // Road hurdles to dodge
    this.particles     = [];      // Bursts & foot-strike dust
    this.floatingTexts = [];      // Score popups (+10, +50, DODGE!)
    this.runFrame      = 0;
    this.bgOffset      = 0;

    /* Gameplay mechanics */
    this.magnetTimer   = 0;       // Seconds remaining on Magnet power-up
    this.streak        = 0;       // Consecutive star combo
    this.invulnerable  = 0;       // Hit recovery cooldown
    this.shakeTimer    = 0;       // Screen shake duration

    /* Scoring */
    this.starsCollected = 0;
    this.gameStars      = 3;      // Question accuracy stars

    /* Question state */
    this.questions = [];
    this.qIdx      = 0;
    this.correct   = 0;
    this.selected  = null;
    this.hintUsed  = false;

    /* Level meta */
    this.levelId     = null;
    this.levelData   = null;
    this.profile     = null;
    this.theme       = THEMES.mathematics;
    this.countdownId = null;

    /* Realistic Character Sprite Cache */
    this.charSpriteCanvas = null;
    this._loadedSpriteSrc = null;

    this._bindControls();
  }

  /* ─── Start Level ────────────────────────────────────────── */
  startLevel(levelId, levelData) {
    this.levelId   = levelId;
    this.levelData = levelData;
    this.profile   = this.store.get('profile') || {};
    this.theme     = THEMES[this.profile.subjectId] || THEMES.mathematics;

    this.questions      = getQuestionsForLevel(levelId, levelData?.title || 'Chapter');
    this.qIdx           = 0;
    this.correct        = 0;
    this.gameStars      = 3;
    this.coins          = 0;
    this.starsCollected = 0;
    this.distance       = 0;
    this.lane           = 0;      // Always begin in Center Lane
    this.laneAnim       = 0;
    this.tiltAngle      = 0;
    this.speed          = 2.8; // Gentle starting speed
    this.items          = [];
    this.obstacles      = [];
    this.particles      = [];
    this.floatingTexts  = [];
    this.runFrame       = 0;
    this.bgOffset       = 0;
    this.magnetTimer    = 0;
    this.streak         = 0;
    this.invulnerable   = 0;
    this.shakeTimer     = 0;

    this.canvas = document.getElementById('runner-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this._resize();
    this.laneAnim = this.canvas.width / 2;

    this._loadCharacterSprite();

    this._hidePanel();
    this._hideFeedback();
    this._hideCheckpointWarning();
    this._updateHeader();
    this._updateHUD();
    this._updateLaneUI();

    /* Render initial frame immediately so track is ready */
    this._draw();

    this._countdown(() => this._startRunning());
  }

  _loadCharacterSprite() {
    const isGirl = this.profile?.gender === 'girl';
    const src = isGirl ? '/assets/characters/girl-adventurer.jpg' : '/assets/characters/boy-adventurer.jpg';
    if (this._loadedSpriteSrc === src && this.charSpriteCanvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      this._loadedSpriteSrc = src;
      this.charSpriteCanvas = prepareCharacterSprite(img);
    };
  }

  _resize() {
    const p = this.canvas.parentElement;
    const w = (p && p.clientWidth > 0) ? p.clientWidth : window.innerWidth;
    const h = (p && p.clientHeight > 0) ? p.clientHeight : window.innerHeight;
    this.canvas.width  = w;
    this.canvas.height = h;
    if (!this.laneAnim || this.laneAnim === 0) {
      this.laneAnim = w / 2;
    }
  }

  /* ─── Countdown ─────────────────────────────────────────── */
  _countdown(onDone) {
    const overlay = document.getElementById('runner-countdown');
    const numEl   = document.getElementById('countdown-number');
    if (!overlay || !numEl) { onDone(); return; }
    overlay.style.display = 'flex';
    let n = 3;
    numEl.textContent = n;
    this.countdownId = setInterval(() => {
      n--;
      if (n > 0) {
        numEl.textContent = n;
        this.sound?.play?.('click');
      } else if (n === 0) {
        numEl.textContent = 'GO! 🚀';
        this.sound?.play?.('start');
      } else {
        clearInterval(this.countdownId);
        overlay.style.display = 'none';
        onDone();
      }
    }, 750);
  }

  /* ─── Main Running Loop ─────────────────────────────────── */
  _startRunning() {
    this.running  = true;
    this.paused   = false;
    this.runTimer = 0;
    this.lastTime = performance.now();

    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      if (!this.paused) {
        this.runTimer += dt;
        this.distance += this.speed * dt * 8;

        this._updatePhysics(dt);
        this._draw();
        this._updateHUD();

        /* Approaching checkpoint warning 2s before checkpoint */
        if (this.runTimer >= (RUN_SECONDS - 2.0) && this.qIdx < this.questions.length) {
          this._showCheckpointWarning(RUN_SECONDS - this.runTimer);
        }

        /* Checkpoint triggered */
        if (this.runTimer >= RUN_SECONDS && this.qIdx < this.questions.length) {
          this._hideCheckpointWarning();
          this._pauseForQuestion();
        }
      } else {
        // While paused for question: keep drawing background scene so game stays visible under blur!
        this._draw();
      }
      this.frameId = requestAnimationFrame(loop);
    };
    this.frameId = requestAnimationFrame(loop);
  }

  _stop() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  /* ─── Physics & Collectibles ────────────────────────────── */
  _updatePhysics(dt) {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cx = W / 2;
    const horizY = H * 0.38;
    const rTopW = 75, rBotW = W * 0.88;
    const rTop  = horizY + 6, rBot = H;
    const charY = H - 120;

    /* Target lane X at character depth */
    const charProgress = Math.max(0, Math.min(1, (charY - rTop) / (rBot - rTop)));
    const charRoadW = rTopW + charProgress * (rBotW - rTopW);
    const targetX = cx + this.lane * (charRoadW / 3.1);

    /* Smooth responsive slide to target lane */
    this.laneAnim += (targetX - this.laneAnim) * 0.22;

    /* Smooth tilt decay back to vertical */
    this.tiltAngle *= 0.86;

    /* Screen shake decay */
    if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);

    /* Hit recovery invulnerability decay */
    if (this.invulnerable > 0) this.invulnerable = Math.max(0, this.invulnerable - dt);

    /* Magnet power-up countdown */
    if (this.magnetTimer > 0) {
      this.magnetTimer = Math.max(0, this.magnetTimer - dt);
      const magBadge = document.getElementById('runner-magnet-badge');
      const magTimerEl = document.getElementById('runner-magnet-time');
      if (magBadge && magTimerEl) {
        if (this.magnetTimer > 0) {
          magBadge.style.display = 'inline-flex';
          magTimerEl.textContent = `${this.magnetTimer.toFixed(1)}s`;
        } else {
          magBadge.style.display = 'none';
        }
      }
    }

    /* Scroll background & animation cadence */
    this.bgOffset = (this.bgOffset + this.speed * dt * 26) % H;
    this.runFrame += dt * (8 + this.speed * 0.6);

    /* Foot-strike dust particles */
    if (Math.random() < 0.42) {
      const footSide = Math.sin(this.runFrame * Math.PI * 2) > 0 ? 1 : -1;
      this.particles.push({
        x: this.laneAnim + footSide * 14 + (Math.random() - 0.5) * 8,
        y: H - 76,
        vx: footSide * (15 + Math.random() * 20),
        vy: -Math.random() * 25 - 8,
        life: 0.55,
        radius: 3.5 + Math.random() * 3,
        color: 'rgba(255,255,255,0.38)'
      });
    }

    /* Spawn Collectibles (Stars, Gems, Magnet) strictly in one of 3 lanes */
    if (Math.random() < 0.052) {
      const sl = LANE_OFFSETS[Math.floor(Math.random() * 3)];
      const roll = Math.random();
      let type = 'star';
      if (roll < 0.16) type = 'gem';
      else if (roll < 0.21 && this.magnetTimer <= 0) type = 'magnet';

      this.items.push({
        lane: sl,
        y: rTop + 8,
        type,
        rot: 0
      });
    }

    /* Spawn Road Barrier Obstacles (1 of 3 lanes) */
    if (Math.random() < 0.024 && this.items.every(it => it.y > rTop + 140)) {
      const ol = LANE_OFFSETS[Math.floor(Math.random() * 3)];
      this.obstacles.push({
        lane: ol,
        y: rTop + 8,
        passed: false
      });
    }

    /* Move items down the 3D track at gentle starting speed */
    const speedPx = this.speed * dt * 110;
    this.items.forEach(it => {
      it.y += speedPx;
      it.rot += dt * 3.5;

      /* Magnetic attraction pulls all items toward player across all lanes */
      if (this.magnetTimer > 0) {
        const dy = charY - it.y;
        if (dy > 0 && dy < 340) {
          it.lane += (this.lane - it.lane) * dt * 4.5;
          it.y += dt * 260;
        }
      }
    });

    /* Move obstacles down the 3D track */
    this.obstacles.forEach(ob => {
      ob.y += speedPx;
    });

    /* Collectibles collision check */
    this.items = this.items.filter(it => {
      const prog = Math.max(0, Math.min(1, (it.y - rTop) / (rBot - rTop)));
      const roadW = rTopW + prog * (rBotW - rTopW);
      const ix = cx + it.lane * (roadW / 3.1);

      if (Math.abs(ix - this.laneAnim) < 46 && Math.abs(it.y - charY) < 50) {
        if (it.type === 'star') {
          this.starsCollected++;
          this.streak++;
          this.sound?.play?.('star');
          this._spawnSparkles(ix, it.y, '#FFD700', 9);
          this._addFloatingText('+10 ⭐', ix, it.y - 20, '#FFD700');
        } else if (it.type === 'gem') {
          this.starsCollected += 5;
          this.streak += 2;
          this.sound?.play?.('gem');
          this._spawnSparkles(ix, it.y, this.theme.gem, 14);
          this._addFloatingText('+50 💎', ix, it.y - 20, this.theme.gem);
        } else if (it.type === 'magnet') {
          this.magnetTimer = 6.0;
          this.sound?.play?.('powerup');
          this._spawnSparkles(ix, it.y, '#FF6B6B', 18);
          this._addFloatingText('🧲 MAGNET SHIELD!', ix, it.y - 30, '#FF6B6B');
        }
        this._updateStreakUI();
        return false;
      }
      return it.y < H + 60;
    });

    /* Obstacle dodge and collision check */
    this.obstacles = this.obstacles.filter(ob => {
      const prog = Math.max(0, Math.min(1, (ob.y - rTop) / (rBot - rTop)));
      const roadW = rTopW + prog * (rBotW - rTopW);
      const ox = cx + ob.lane * (roadW / 3.1);

      /* Check collision */
      if (!this.invulnerable && Math.abs(ox - this.laneAnim) < 40 && Math.abs(ob.y - charY) < 42) {
        /* Hit obstacle! */
        this.shakeTimer = 0.28;
        this.invulnerable = 1.2;
        this.streak = 0;
        this._updateStreakUI();
        this.sound?.play?.('incorrect');
        this.starsCollected = Math.max(0, this.starsCollected - 2);
        this._spawnSparkles(ox, ob.y, '#FF4757', 14);
        this._addFloatingText('OUCH! -2 ⭐', ox, ob.y - 20, '#FF4757');
        return false;
      }

      /* Check dodge success (passed runner safely) */
      if (!ob.passed && ob.y > charY + 25) {
        ob.passed = true;
        if (Math.abs(ox - this.laneAnim) > 45) {
          this.sound?.play?.('dodge');
          this._addFloatingText('DODGE! +20 ⚡', this.laneAnim, charY - 40, '#00CEC9');
        }
      }

      return ob.y < H + 60;
    });

    /* Update burst particles */
    this.particles.forEach(p => {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy += 320 * dt;
      p.life -= dt * (p.radius ? 1.6 : 2.4);
    });
    this.particles = this.particles.filter(p => p.life > 0);

    /* Update floating score texts */
    this.floatingTexts.forEach(ft => {
      ft.y -= dt * 45;
      ft.life -= dt * 1.5;
    });
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
  }

  _spawnSparkles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 220,
        vy: -(Math.random() * 150 + 50),
        life: 0.9,
        radius: 3.5,
        color
      });
    }
  }

  _addFloatingText(text, x, y, color = '#FFF') {
    this.floatingTexts.push({ text, x, y, life: 1.0, color });
  }

  _updateStreakUI() {
    const streakBadge = document.getElementById('runner-streak-badge');
    const streakText  = document.getElementById('runner-streak-text');
    if (!streakBadge || !streakText) return;

    if (this.streak >= 4) {
      streakBadge.style.display = 'inline-flex';
      const mult = this.streak >= 8 ? '3x' : '2x';
      streakText.textContent = `${mult} COMBO (${this.streak})`;
    } else {
      streakBadge.style.display = 'none';
    }
  }

  _showCheckpointWarning(secLeft) {
    const banner = document.getElementById('checkpoint-warning');
    const secEl  = document.getElementById('checkpoint-countdown-sec');
    if (banner) banner.style.display = 'block';
    if (secEl) secEl.textContent = Math.max(1, Math.ceil(secLeft));
  }

  _hideCheckpointWarning() {
    const banner = document.getElementById('checkpoint-warning');
    if (banner) banner.style.display = 'none';
  }

  /* ─── Draw Canvas ───────────────────────────────────────── */
  _draw() {
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = this.canvas.height;
    const cx  = W / 2;
    const t   = this.theme;

    ctx.save();

    /* Screen shake impact */
    if (this.shakeTimer > 0) {
      const mag = this.shakeTimer * 16;
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }

    /* Clear canvas each frame so vibrant runner-track.jpg is fully visible with no black screen */
    ctx.clearRect(0, 0, W, H);

    /* Twinkling starlight in the sky */
    for (let i = 0; i < 48; i++) {
      const sx = ((i * 137 + this.bgOffset * 0.2) % W);
      const sy = (i * 73) % (H * 0.38);
      const blink = 0.35 + 0.45 * Math.sin(performance.now() / 650 + i);
      ctx.globalAlpha = blink;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(sx, sy, 0.9 + (i % 3) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* Subtle atmospheric horizon glow */
    const horizY = H * 0.38;
    const hGlow = ctx.createRadialGradient(cx, horizY, 0, cx, horizY, W * 0.5);
    hGlow.addColorStop(0, t.accent + '33');
    hGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = hGlow;
    ctx.fillRect(0, horizY - 60, W, 120);

    /* 3D Road trapezoid */
    const rTopW = 75, rBotW = W * 0.88;
    const rTop  = horizY + 6, rBot = H;

    ctx.beginPath();
    ctx.moveTo(cx - rTopW / 2, rTop);
    ctx.lineTo(cx + rTopW / 2, rTop);
    ctx.lineTo(cx + rBotW / 2, rBot);
    ctx.lineTo(cx - rBotW / 2, rBot);
    ctx.closePath();
    const roadGrad = ctx.createLinearGradient(0, rTop, 0, rBot);
    roadGrad.addColorStop(0, t.road + 'dd');
    roadGrad.addColorStop(1, '#09081a');
    ctx.fillStyle = roadGrad;
    ctx.fill();

    /* Road glowing side rails */
    [[-1, cx - rTopW / 2, cx - rBotW / 2], [1, cx + rTopW / 2, cx + rBotW / 2]].forEach(([, tx, bx]) => {
      ctx.beginPath();
      ctx.moveTo(tx, rTop);
      ctx.lineTo(bx, rBot);
      ctx.strokeStyle = t.accent + '99';
      ctx.lineWidth = 3.5;
      ctx.stroke();
    });

    /* 3 Strict Lanes: Distinct animated dashed dividers */
    ctx.setLineDash([18, 22]);
    ctx.lineDashOffset = -this.bgOffset * 0.65;
    ctx.strokeStyle = t.line + 'bb';
    for (const lOff of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + lOff * (rTopW / 6), rTop);
      ctx.lineTo(cx + lOff * (rBotW / 6), rBot);
      ctx.lineWidth = 2.8;
      ctx.stroke();
    }
    ctx.setLineDash([]);

    /* Road Lane Guides: Subtle chevron arrows on asphalt */
    for (let step = 0; step < 4; step++) {
      const arrowProg = ((step * 0.25 + (this.bgOffset / H * 0.6)) % 1 + 1) % 1;
      const ay = rTop + arrowProg * (rBot - rTop);
      const aRoadW = rTopW + arrowProg * (rBotW - rTopW);
      const aScale = 0.5 + arrowProg * 0.9;

      ctx.save();
      ctx.globalAlpha = 0.15 + arrowProg * 0.3;
      LANE_OFFSETS.forEach(laneVal => {
        const ax = cx + laneVal * (aRoadW / 3.1);
        ctx.fillStyle = laneVal === this.lane ? t.accent : 'rgba(255,255,255,0.4)';
        ctx.font = `bold ${Math.round(11 * aScale)}px 'Fredoka One', sans-serif`;
        ctx.textAlign = 'center';
        const label = laneVal === -1 ? '◀' : laneVal === 0 ? '▲' : '▶';
        ctx.fillText(label, ax, ay);
      });
      ctx.restore();
    }

    /* Overhead distance arches zoom past */
    const archProg = ((this.distance / 120) % 1);
    if (archProg > 0.1) {
      const archY = rTop + archProg * (rBot - rTop);
      const archW = rTopW + archProg * (rBotW - rTopW);
      ctx.save();
      ctx.globalAlpha = Math.min(1, archProg * 1.5) * 0.6;
      ctx.strokeStyle = t.accent;
      ctx.lineWidth = 4 * archProg;
      ctx.strokeRect(cx - archW * 0.52, archY - 30 * archProg, archW * 1.04, 8 * archProg);
      ctx.restore();
    }

    /* Obstacles: Holographic Energy Barriers */
    this.obstacles.forEach(ob => {
      const prog = Math.max(0, Math.min(1, (ob.y - rTop) / (rBot - rTop)));
      const roadW = rTopW + prog * (rBotW - rTopW);
      const ox = cx + ob.lane * (roadW / 3.1);
      const barW = Math.max(28, (roadW / 3.6) * 0.85);
      const barH = 14 + prog * 20;

      ctx.save();
      ctx.translate(ox, ob.y);

      // Warning laser barrier
      const barGrad = ctx.createLinearGradient(-barW / 2, 0, barW / 2, 0);
      barGrad.addColorStop(0, '#FF4757');
      barGrad.addColorStop(0.5, '#FFA502');
      barGrad.addColorStop(1, '#FF4757');

      ctx.fillStyle = barGrad;
      ctx.shadowColor = '#FF4757';
      ctx.shadowBlur = 12;
      ctx.fillRect(-barW / 2, -barH, barW, barH);

      // Hazard stripes
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      for (let s = -barW / 2 + 4; s < barW / 2; s += 12) {
        ctx.fillRect(s, -barH, 5, barH);
      }

      // Barrier icon
      ctx.font = `${Math.round(10 + prog * 10)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('⚡', 0, -barH - 4);

      ctx.restore();
    });

    /* Collectibles in the 3 lanes */
    this.items.forEach(it => {
      const prog = Math.max(0, Math.min(1, (it.y - rTop) / (rBot - rTop)));
      const roadW = rTopW + prog * (rBotW - rTopW);
      const drawX = cx + it.lane * (roadW / 3.1);
      const sz = 16 + prog * 26;

      ctx.save();
      ctx.translate(drawX, it.y);

      if (it.type === 'star') {
        // Golden glowing star
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 1.1);
        glow.addColorStop(0, 'rgba(255,215,0,0.55)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, sz * 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(it.rot);
        ctx.font = `${sz}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', 0, 0);
      } else if (it.type === 'gem') {
        // Multi-faceted Knowledge Gem
        const gemGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 1.3);
        gemGlow.addColorStop(0, this.theme.gem + '88');
        gemGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = gemGlow;
        ctx.beginPath();
        ctx.arc(0, 0, sz * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(Math.sin(it.rot) * 0.3);
        ctx.font = `${sz * 1.1}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💎', 0, 0);
      } else if (it.type === 'magnet') {
        // Magnetic Compass Power-up
        const magGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 1.3);
        magGlow.addColorStop(0, 'rgba(255,107,107,0.7)');
        magGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = magGlow;
        ctx.beginPath();
        ctx.arc(0, 0, sz * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `${sz * 1.15}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧲', 0, 0);
      }

      ctx.restore();
    });

    /* Particles: Bursts & Dust */
    this.particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius || 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    /* Realistic Running Character */
    this._drawRunner(cx, H);

    /* Floating Score Popups */
    this.floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
      ctx.font = "bold 16px 'Fredoka One', sans-serif";
      ctx.fillStyle = ft.color;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  }

  /* ─── Realistic Running Character Drawing ───────────────── */
  _drawRunner(cx, H) {
    const ctx = this.ctx;
    const x   = this.laneAnim;
    const y   = H - 118;
    const stride = this.runFrame * Math.PI * 2;
    const isGirl = this.profile?.gender === 'girl';
    const col = isGirl ? '#FF80AB' : '#6C5CE7';

    /* Stride kinematics: vertical bounce & squash/stretch on footfalls */
    const bob = Math.sin(stride) * 4.5;
    const squash = Math.cos(stride);
    const scaleX = 1 + squash * 0.035;
    const scaleY = 1 - squash * 0.035;

    /* Invulnerability flashing on hit */
    if (this.invulnerable > 0 && Math.floor(performance.now() / 80) % 2 === 0) {
      return; // Flash invisibly
    }

    ctx.save();

    /* 1. Ground Contact Shadow (Soft Perspective Asphalt Shadow) */
    ctx.save();
    ctx.translate(x, H - 76);
    ctx.scale(1, 0.32);
    const shadowR = 38 - Math.abs(bob) * 1.5;
    const sGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, shadowR);
    sGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
    sGrad.addColorStop(0.5, 'rgba(0,0,0,0.35)');
    sGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sGrad;
    ctx.beginPath();
    ctx.arc(0, 0, shadowR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* 2. Character Body Transform with Banking Roll Tilt */
    ctx.translate(x, y + bob);
    ctx.rotate((this.tiltAngle * Math.PI) / 180);
    ctx.scale(scaleX, scaleY);

    /* 3. Magical Equipment Aura (Compass / Starlight Book Glow) */
    const auraGrad = ctx.createRadialGradient(0, -62, 8, 0, -62, 70);
    auraGrad.addColorStop(0, isGirl ? 'rgba(255,215,0,0.32)' : 'rgba(0,206,201,0.32)');
    auraGrad.addColorStop(0.6, isGirl ? 'rgba(255,215,0,0.1)' : 'rgba(0,206,201,0.1)');
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, -62, 70, 0, Math.PI * 2);
    ctx.fill();

    /* 4. Swirling Electric Magnet Shield (if power-up active) */
    if (this.magnetTimer > 0) {
      ctx.save();
      const magSpin = performance.now() / 180;
      ctx.rotate(magSpin);
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.85)';
      ctx.lineWidth = 3;
      ctx.setLineDash([14, 12]);
      ctx.beginPath();
      ctx.arc(0, -60, 56, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-magSpin * 2);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -60, 66, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    /* 5. Draw Pre-Processed Realistic Adventurer Sprite */
    if (this.charSpriteCanvas) {
      const charW = 104;
      const charH = 142;
      // Position feet on the road contact plane
      ctx.drawImage(this.charSpriteCanvas, -charW / 2, -charH + 18, charW, charH);
    } else {
      /* High-fidelity Articulated Canvas Fallback (Explorer Suit) */
      this._drawArticulatedRunner(ctx, col, isGirl, stride);
    }

    /* 6. Dynamic Speed Streaks */
    if (this.speed > 6.0) {
      ctx.strokeStyle = col + '66';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const sy = -100 + i * 22;
        ctx.beginPath();
        ctx.moveTo(-35, sy);
        ctx.lineTo(-58, sy);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /** Articulated Anatomical Runner Fallback */
  _drawArticulatedRunner(ctx, col, isGirl, stride) {
    const legAngle = Math.sin(stride) * 0.45;
    const skinTone = isGirl ? '#E0A899' : '#D29074';

    /* Legs & Explorer Hiking Boots */
    ctx.strokeStyle = '#3b2f2f';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';

    // Left leg
    ctx.save();
    ctx.rotate(legAngle);
    ctx.beginPath(); ctx.moveTo(-7, -15); ctx.lineTo(-10, 25); ctx.stroke();
    // Hiking Boot
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath(); ctx.ellipse(-14, 30, 9, 5, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Right leg
    ctx.save();
    ctx.rotate(-legAngle);
    ctx.beginPath(); ctx.moveTo(7, -15); ctx.lineTo(10, 25); ctx.stroke();
    // Hiking Boot
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath(); ctx.ellipse(14, 30, 9, 5, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Cargo Shorts / Pants
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.roundRect(-15, -28, 30, 24, 4);
    ctx.fill();

    // Adventure Jacket
    const jacketGrad = ctx.createLinearGradient(-16, -65, 16, -25);
    jacketGrad.addColorStop(0, col);
    jacketGrad.addColorStop(1, '#1e1a3a');
    ctx.fillStyle = jacketGrad;
    ctx.beginPath();
    ctx.roundRect(-16, -65, 32, 40, 8);
    ctx.fill();

    // Metallic Zipper & Explorer Badges
    ctx.fillStyle = '#F5F6FA';
    ctx.fillRect(-1.5, -63, 3, 36);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(-8, -50, 4, 0, Math.PI * 2); ctx.fill();

    // Realistic Explorer Backpack
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.roundRect(14, -60, 14, 26, 4);
    ctx.fill();

    // Head & Hair
    ctx.fillStyle = skinTone;
    ctx.beginPath(); ctx.arc(0, -82, 16, 0, Math.PI * 2); ctx.fill();

    // Hair
    ctx.fillStyle = isGirl ? '#2c1810' : '#1a1a1a';
    ctx.beginPath();
    if (isGirl) {
      ctx.arc(0, -90, 16, Math.PI, 0);
      ctx.fill();
      ctx.arc(14, -80, 8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(0, -90, 16, Math.PI * 1.1, 0);
      ctx.fill();
    }
  }

  /* ─── Strictly 3-Way Lane Controls ──────────────────────── */
  _switchLane(dir) {
    const next = this.lane + dir;
    if (next >= -1 && next <= 1) {
      this._setLane(next);
    }
  }

  _setLane(targetLane) {
    const clamped = Math.max(-1, Math.min(1, targetLane));
    if (clamped !== this.lane) {
      const dir = clamped - this.lane;
      this.lane = clamped;
      this.tiltAngle = (dir > 0 ? 1 : -1) * 14;
      this.sound?.play?.('laneSwitch');
      this._updateLaneUI();
    }
  }

  _updateLaneUI() {
    // 1. Update 3-Lane Bottom Quick Nav Dock
    const dockBtns = {
      '-1': document.getElementById('dock-lane-left'),
      '0':  document.getElementById('dock-lane-center'),
      '1':  document.getElementById('dock-lane-right'),
    };
    Object.keys(dockBtns).forEach(k => {
      const btn = dockBtns[k];
      if (btn) {
        if (parseInt(k, 10) === this.lane) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    // 2. Update HUD Lane Indicator Pills
    const indPills = {
      '-1': document.getElementById('ind-lane-left'),
      '0':  document.getElementById('ind-lane-center'),
      '1':  document.getElementById('ind-lane-right'),
    };
    Object.keys(indPills).forEach(k => {
      const pill = indPills[k];
      if (pill) {
        if (parseInt(k, 10) === this.lane) pill.classList.add('active');
        else pill.classList.remove('active');
      }
    });
  }

  /* ─── Controls Binding ──────────────────────────────────── */
  _bindControls() {
    // 1. Keyboard Controls (Strictly 3 Lanes)
    document.addEventListener('keydown', e => {
      if (!this.running || this.paused) return;

      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') this._switchLane(-1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this._switchLane(1);
      if (e.key === 'ArrowDown'  || e.key === 's' || e.key === 'S' || e.code === 'Space') this._setLane(0);

      // Direct lane hotkeys 1, 2, 3
      if (e.key === '1') this._setLane(-1);
      if (e.key === '2') this._setLane(0);
      if (e.key === '3') this._setLane(1);
    });

    // 2. Touch Swipes (Mobile gestures)
    let tx = 0, ty = 0;
    document.addEventListener('touchstart', e => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      if (!this.running || this.paused) return;
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;

      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
        this._switchLane(dx > 0 ? 1 : -1);
      } else if (dy > 45 && Math.abs(dy) > Math.abs(dx)) {
        this._setLane(0); // Swipe down centers
      }
    }, { passive: true });

    // 3. Discrete Screen Touch Zones (Left 33%, Center 34%, Right 33%)
    document.getElementById('lane-left')?.addEventListener('click', () => {
      if (!this.running || this.paused) return;
      this._setLane(-1);
    });
    document.getElementById('lane-center')?.addEventListener('click', () => {
      if (!this.running || this.paused) return;
      this._setLane(0);
    });
    document.getElementById('lane-right')?.addEventListener('click', () => {
      if (!this.running || this.paused) return;
      this._setLane(1);
    });

    // 4. Interactive Bottom Dock Buttons
    document.getElementById('dock-lane-left')?.addEventListener('click', () => {
      if (!this.running || this.paused) return;
      this._setLane(-1);
    });
    document.getElementById('dock-lane-center')?.addEventListener('click', () => {
      if (!this.running || this.paused) return;
      this._setLane(0);
    });
    document.getElementById('dock-lane-right')?.addEventListener('click', () => {
      if (!this.running || this.paused) return;
      this._setLane(1);
    });

    // 5. Question & Dialog Actions
    document.getElementById('btn-submit-answer')?.addEventListener('click', () => this._submitAnswer());
    document.getElementById('btn-feedback-continue')?.addEventListener('click', () => this._continueFeedback());
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      if (this.hintUsed) return;
      this.hintUsed = true;
      const q   = this.questions[this.qIdx];
      const hb  = document.getElementById('qp-hint-box');
      const ht  = document.getElementById('qp-hint-text');
      if (ht) ht.textContent = q?.hint || 'Think carefully!';
      if (hb) hb.style.display = 'block';
      this.gameStars = Math.max(1, this.gameStars - 1);
      this._updateStarsMini();
    });
    document.getElementById('btn-back-to-map')?.addEventListener('click', () => {
      this._stop();
      clearInterval(this.countdownId);
      this._hidePanel();
      this._hideFeedback();
      this._hideCheckpointWarning();
      const rcd = document.getElementById('runner-countdown');
      if (rcd) rcd.style.display = 'none';
      this.callbacks.onBackToMap?.();
    });
  }

  /* ─── Pause For Question ────────────────────────────────── */
  _pauseForQuestion() {
    this.paused   = true;
    this.runTimer = 0;
    this.sound?.play?.('checkpoint');
    this._draw(); // Ensure current frame is rendered before showing popup
    setTimeout(() => this._showQuestion(this.qIdx), 350);
  }

  _resume() {
    this.paused   = false;
    this.runTimer = 0;
    this.lastTime = performance.now();
    this.speed    = Math.min(6.5, this.speed + 0.35);
  }

  /* ─── Question Popup ────────────────────────────────────── */
  _showQuestion(idx) {
    const q = this.questions[idx];
    if (!q) return;
    this.selected = null;
    this.hintUsed = false;

    const panel = document.getElementById('gp-question-panel');
    if (panel) { panel.style.display = 'flex'; panel.classList.add('panel-slide-up'); }

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('gp-qcount',        `${idx + 1} / ${this.questions.length}`);
    set('qp-qnum',          `Question ${idx + 1} of ${this.questions.length}`);
    set('qp-question-text', q.text);
    set('qp-type-badge',    q.type === 'mcq' ? '🔘 Multiple Choice' : q.type === 'tf' ? '✅ True / False' : '✏️ Fill in the Blank');

    /* Reset hint */
    const hb = document.getElementById('qp-hint-box');
    if (hb) hb.style.display = 'none';

    /* Submit disabled until answer picked */
    const sb = document.getElementById('btn-submit-answer');
    if (sb) sb.disabled = true;

    /* Render question options */
    const optsEl = document.getElementById('qp-options');
    if (optsEl) { optsEl.innerHTML = ''; this._renderOptions(q, optsEl); }

    /* Realistic Mini Character Duo Header */
    const isGirl = this.profile?.gender === 'girl';
    const playerImg = document.getElementById('qp-player-img');
    if (playerImg) playerImg.src = isGirl ? '/assets/characters/girl-adventurer.jpg' : '/assets/characters/boy-adventurer.jpg';

    const playerCaption = document.getElementById('qp-player-caption');
    if (playerCaption) playerCaption.textContent = this.profile?.nickname || 'Explorer';

    const mascotImg = document.getElementById('qp-mascot-img');
    if (mascotImg) mascotImg.src = isGirl ? '/assets/mascots/wisdom-owl.jpg' : '/assets/mascots/sparky-robot.jpg';

    const mascotCaption = document.getElementById('qp-mascot-caption');
    if (mascotCaption) mascotCaption.textContent = isGirl ? 'Wisdom Owl' : 'Sparky';

    const speechText = document.getElementById('qp-speech-text');
    if (speechText) {
      const tips = [
        `“Let's master ${q.topic || 'this concept'} together!”`,
        `“Read carefully, you have the skills to solve this!”`,
        `“Great 3-lane run! Now conquer this question!”`,
        `“Stay sharp! Every correct answer speeds up our stars!”`,
        `“Final checkpoint! Show what you learned in this unit!”`
      ];
      speechText.textContent = tips[idx % tips.length];
    }

    /* Progress dots */
    const dotsEl = document.getElementById('qp-progress-dots');
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < this.questions.length; i++) {
        const dot = document.createElement('div');
        dot.className = `qp-dot ${i < idx ? 'done' : i === idx ? 'current' : ''}`;
        dot.title = `Question ${i + 1}`;
        dotsEl.appendChild(dot);
      }
    }
  }

  _hidePanel() {
    const p = document.getElementById('gp-question-panel');
    if (p) { p.style.display = 'none'; p.classList.remove('panel-slide-up'); }
  }

  _hideFeedback() {
    const o = document.getElementById('feedback-overlay');
    if (o) o.style.display = 'none';
  }

  /* ─── Render Options ────────────────────────────────────── */
  _renderOptions(q, container) {
    if (q.type === 'mcq') {
      container.className = 'qp-options opts-mcq';
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + i)}</span><span class="opt-text">${opt}</span>`;
        btn.onclick = () => {
          this.selected = i;
          container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const sb = document.getElementById('btn-submit-answer');
          if (sb) sb.disabled = false;
        };
        container.appendChild(btn);
      });
    } else if (q.type === 'tf') {
      container.className = 'qp-options opts-tf';
      [{ val: true, emoji: '✅', label: 'True' }, { val: false, emoji: '❌', label: 'False' }].forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'option-btn tf-btn';
        btn.dataset.val = o.val;
        btn.innerHTML = `<span class="tf-emoji">${o.emoji}</span><span class="tf-label">${o.label}</span>`;
        btn.onclick = () => {
          this.selected = o.val;
          container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const sb = document.getElementById('btn-submit-answer');
          if (sb) sb.disabled = false;
        };
        container.appendChild(btn);
      });
    } else {
      container.className = 'qp-options opts-fill';
      container.innerHTML = `<input type="text" id="fill-answer-input" class="fill-input" placeholder="Your answer…" autocomplete="off"/>`;
      const inp = container.querySelector('#fill-answer-input');
      if (inp) {
        inp.oninput = (e) => {
          this.selected = e.target.value.trim();
          const sb = document.getElementById('btn-submit-answer');
          if (sb) sb.disabled = !this.selected;
        };
      }
    }
  }

  /* ─── Submit Answer ─────────────────────────────────────── */
  _submitAnswer() {
    const q = this.questions[this.qIdx];
    if (!q || this.selected === null) return;

    let ok = false;
    if (q.type === 'mcq')  ok = this.selected === q.correctIndex;
    if (q.type === 'tf')   ok = String(this.selected) === String(q.correctAnswer);
    if (q.type === 'fill') ok = String(this.selected).toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim();

    this._revealOptions(q, ok);
    if (ok) {
      this.correct++;
      this.starsCollected += 5;
      this.sound?.play?.('correct');
    } else {
      this.gameStars = Math.max(0, this.gameStars - 1);
      this.sound?.play?.('incorrect');
    }

    this._updateStarsMini();
    setTimeout(() => this._showFeedback(q, ok), 700);
  }

  _revealOptions(q, ok) {
    const c = document.getElementById('qp-options');
    if (!c) return;
    if (q.type === 'mcq') {
      c.querySelectorAll('.option-btn').forEach((b, i) => {
        if (i === q.correctIndex) b.classList.add('correct-reveal');
        else if (i === this.selected && !ok) b.classList.add('wrong-reveal');
        b.disabled = true;
      });
    } else if (q.type === 'tf') {
      c.querySelectorAll('.option-btn').forEach(b => {
        if (String(b.dataset.val) === String(q.correctAnswer)) b.classList.add('correct-reveal');
        else if (!ok && b.classList.contains('selected')) b.classList.add('wrong-reveal');
        b.disabled = true;
      });
    }
    const sb = document.getElementById('btn-submit-answer');
    if (sb) sb.disabled = true;
  }

  /* ─── Feedback Dialog ───────────────────────────────────── */
  _showFeedback(q, ok) {
    this._hidePanel();
    const overlay = document.getElementById('feedback-overlay');
    if (overlay) overlay.style.display = 'flex';

    const pool = ok ? CORRECT_MESSAGES : INCORRECT_MESSAGES;
    const msg  = pool[Math.floor(Math.random() * pool.length)];

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('feedback-icon',    ok ? '🎉' : '💪');
    set('feedback-title',   msg.title);
    set('feedback-msg',     msg.message);
    set('feedback-explain', q.explanation || '');

    const xpPill = document.getElementById('feedback-xp');
    if (xpPill) {
      xpPill.style.display = ok ? 'inline-block' : 'none';
      const xv = document.getElementById('feedback-xp-val');
      if (xv) xv.textContent = APP_CONFIG.xpPerCorrectAnswer;
    }
  }

  _continueFeedback() {
    this._hideFeedback();
    this.qIdx++;
    if (this.qIdx < this.questions.length) {
      this._resume();
    } else {
      this._completeLevel();
    }
  }

  /* ─── Level Completion ──────────────────────────────────── */
  _completeLevel() {
    this._stop();
    this._saveProgress();
    const xp = this.correct * APP_CONFIG.xpPerCorrectAnswer + APP_CONFIG.xpLevelCompletionBonus;
    setTimeout(() => {
      this.callbacks.onLevelComplete?.({
        levelId: this.levelId,
        levelData: this.levelData,
        correct: this.correct,
        total: this.questions.length,
        xpEarned: xp,
        stars: this.gameStars,
        perfect: this.correct === this.questions.length,
        topics: [...new Set(this.questions.map(q => q.topic).filter(Boolean))],
      });
    }, 400);
  }

  _saveProgress() {
    const prog = this.store.get('progress') || {};
    const xp   = this.correct * APP_CONFIG.xpPerCorrectAnswer + APP_CONFIG.xpLevelCompletionBonus;
    if (!prog.completedLevels) prog.completedLevels = [];
    if (!prog.completedLevels.includes(this.levelId)) prog.completedLevels.push(this.levelId);
    prog.totalXP      = (prog.totalXP || 0) + xp;
    prog.lastPlayedAt = Date.now();
    const profile = this.store.get('profile') || {};
    const levels  = getLevels(profile.classNum, profile.subjectId);
    const next    = levels[levels.findIndex(l => l.id === this.levelId) + 1];
    if (next) prog.currentLevelId = next.id;
    this.store.set('progress', prog);
  }

  /* ─── Header & HUD ──────────────────────────────────────── */
  _updateHeader() {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('gp-level-pill', `Level ${this.levelData?.levelNumber || 1}`);
    set('gp-topic',      this.levelData?.title || 'Chapter');
    set('gp-qcount',     `0 / ${this.questions.length}`);
    set('gp-stars-mini', '⭐⭐⭐');
  }

  _updateHUD() {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('runner-dist',  Math.floor(this.distance));
    set('runner-coins', this.starsCollected);
  }

  _updateStarsMini() {
    const el = document.getElementById('gp-stars-mini');
    if (el) el.textContent = '⭐'.repeat(this.gameStars) + '☆'.repeat(3 - this.gameStars);
  }
}
