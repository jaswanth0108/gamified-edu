/**
 * LearnQuest — Main Application Entry Point v2
 * Orchestrates all modules, screens, and routing.
 */

import '../styles/main.css';
import { Store }          from './store.js';
import { SoundEngine }    from './sound-engine.js';
import { OnboardingFlow } from './onboarding.js';
import { AdventureMap }   from './adventure-map.js';
import { GameEngine }     from './game-engine.js';
import { RewardsView }    from './rewards-view.js';
import { ProgressView }   from './progress-view.js';

/* ─── Global singletons ─────────────────────────────────────────── */
export const store  = new Store();
export const sound  = new SoundEngine();

/* ─── Screen registry ───────────────────────────────────────────── */
const SCREENS = [
  'loading', 'welcome', 'onboarding',
  'map', 'gameplay', 'level-complete', 'reward',
  'rewards-collection', 'progress',
];

export function showScreen(name) {
  SCREENS.forEach(id => {
    const el = document.getElementById(`${id}-screen`);
    if (el) {
      el.classList.toggle('active', id === name);
    }
  });
}

/* ─── Module instances ───────────────────────────────────────────── */
let mapModule, gameModule, rewardsModule, progressModule, onboarding;

/* ─── Boot sequence ─────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  showScreen('loading');
  await simulateLoading();
  await initApp();
});

async function simulateLoading() {
  const bar  = document.getElementById('loading-bar');
  const text = document.getElementById('loading-text');
  const steps = [
    { p: 20, t: 'Loading syllabi...'       },
    { p: 45, t: 'Building game world...'   },
    { p: 65, t: 'Preparing questions...'   },
    { p: 80, t: 'Rendering adventure map..'},
    { p: 95, t: 'Almost ready!'            },
    { p:100, t: 'Adventure begins!'        },
  ];
  for (const s of steps) {
    await delay(280);
    if (bar)  bar.style.width = s.p + '%';
    if (text) text.textContent = s.t;
  }
  await delay(350);
  // Animate loading canvas
  startLoadingParticles();
}

function startLoadingParticles() {
  const canvas = document.getElementById('loading-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1, vx: (Math.random() - 0.5) * 0.5, vy: -Math.random() * 0.5 - 0.2,
    a: Math.random(), hue: Math.floor(Math.random() * 60 + 240)
  }));
  let raf;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a -= 0.004;
      if (p.a <= 0) { p.a = 1; p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.a})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };
  draw();
  // Stop after 3s
  setTimeout(() => cancelAnimationFrame(raf), 3000);
}

async function initApp() {
  // Init sound (requires user gesture, so best-effort)
  try { await sound.init(); } catch {}

  // Init mute button
  const muteBtn = document.getElementById('global-mute-btn');
  muteBtn?.addEventListener('click', () => {
    sound.toggleMute();
    muteBtn.textContent = sound.muted ? '🔇' : '🔊';
  });

  // Decide entry point based on saved profile
  const profile = store.get('profile');
  if (profile?.setupComplete) {
    // Returning user — go straight to map
    await initMap();
    showScreen('map');
  } else {
    // New user — show welcome first
    initWelcome();
    showScreen('welcome');
  }

  // Lazy-init rewards and progress
  rewardsModule  = new RewardsView(store);
  progressModule = new ProgressView(store);
  bindGlobalUI();
}

/* ─── Welcome screen ─────────────────────────────────────────────── */
function initWelcome() {
  startWelcomeCanvas();

  document.getElementById('btn-start-adventure')?.addEventListener('click', () => {
    sound.play('click');
    onboarding = new OnboardingFlow(store, async (profile) => {
      // Onboarding complete callback
      await initMap();
      showScreen('map');
    });
    showScreen('onboarding');
    onboarding.start();
  });
}

function startWelcomeCanvas() {
  const canvas = document.getElementById('welcome-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, animId;

  const resize = () => {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: 80 }, () => mkStar(w, h));
  };
  resize();
  window.addEventListener('resize', resize);

  const COLS = ['#6C5CE7','#0984E3','#00CEC9','#FD79A8','#FFD93D','#00B894'];
  function mkStar(w, h) {
    return { x: Math.random()*w, y: Math.random()*h, r: Math.random()*2.5+0.5,
      vy: -(Math.random()*0.4+0.1), vx: (Math.random()-0.5)*0.2,
      a: Math.random(), color: COLS[Math.floor(Math.random()*COLS.length)] };
  }

  const gradient = (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0,   '#020215');
    g.addColorStop(0.4, '#0d0d35');
    g.addColorStop(0.7, '#1a0a3e');
    g.addColorStop(1,   '#0d0520');
    return g;
  };

  const draw = () => {
    ctx.fillStyle = gradient(ctx, w, h);
    ctx.fillRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { Object.assign(p, mkStar(w, h)); p.y = h + 5; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color + Math.floor(p.a * 255).toString(16).padStart(2,'0');
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  };
  draw();
}

/* ─── Map initialisation ─────────────────────────────────────────── */
async function initMap() {
  if (!mapModule) {
    mapModule = new AdventureMap(store, {
      onLevelSelect: (levelId, levelData) => {
        startGameplay(levelId, levelData);
      }
    });
  }
  mapModule.render();
  bindMapHUD();
}

/* ─── Map HUD bindings ───────────────────────────────────────────── */
function bindMapHUD() {
  const profile = store.get('profile');
  if (!profile) return;

  // Update HUD
  const nameEl  = document.getElementById('hud-name');
  const classEl = document.getElementById('hud-class');
  const xpEl    = document.getElementById('hud-xp');
  const avEl    = document.getElementById('hud-avatar');

  if (nameEl)  nameEl.textContent  = profile.nickname || 'Explorer';
  if (classEl) classEl.textContent = `Class ${profile.classNum} • ${formatSubject(profile.subjectId)}`;
  if (xpEl)    xpEl.textContent    = store.get('progress')?.totalXP ?? 0;
  if (avEl) {
    avEl.innerHTML = `<img src="${profile.gender === 'girl' ? '/assets/characters/girl-adventurer.jpg' : '/assets/characters/boy-adventurer.jpg'}" alt="${profile.nickname}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`;
  }

  store.on('progress', (prog) => {
    if (xpEl) xpEl.textContent = prog.totalXP ?? 0;
  });

  document.getElementById('btn-rewards')?.addEventListener('click', () => {
    sound.play('click');
    rewardsModule?.render();
    showScreen('rewards-collection');
  });
  document.getElementById('btn-progress')?.addEventListener('click', () => {
    sound.play('click');
    progressModule?.render();
    showScreen('progress');
  });
  document.getElementById('btn-settings')?.addEventListener('click', () => {
    sound.play('click');
    showSettingsModal();
  });
  document.getElementById('btn-continue-map')?.addEventListener('click', () => {
    sound.play('click');
    const currentLevel = store.get('progress')?.currentLevelId;
    const levelData = mapModule?.getLevelData(currentLevel);
    if (currentLevel && levelData) startGameplay(currentLevel, levelData);
  });
}

function formatSubject(id) {
  const map = {
    mathematics: 'Mathematics', science: 'Science',
    english: 'English', 'social-science': 'Social Science', hindi: 'Hindi'
  };
  return map[id] || id;
}

/* ─── Gameplay ───────────────────────────────────────────────────── */
function startGameplay(levelId, levelData) {
  sound.play('start');
  if (!gameModule) {
    gameModule = new GameEngine(store, sound, {
      onLevelComplete: handleLevelComplete,
      onBackToMap: () => { showScreen('map'); mapModule?.render(); },
    });
  }
  gameModule.startLevel(levelId, levelData);
  showScreen('gameplay');
}

function handleLevelComplete(result) {
  // Check gift card milestone
  const prog = store.get('progress') || {};
  const completedCount = (prog.completedLevels || []).length;
  if (completedCount > 0 && completedCount % 5 === 0) {
    // Show reward screen
    showRewardScreen(completedCount, result);
  } else {
    showLevelComplete(result);
  }
}

function showLevelComplete(result) {
  showScreen('level-complete');
  sound.play('levelComplete');
  startConfetti();

  const title    = document.getElementById('lc-title');
  const subtitle = document.getElementById('lc-subtitle');
  const qEl      = document.getElementById('lc-stat-questions');
  const xpEl     = document.getElementById('lc-stat-xp');
  const starEl   = document.getElementById('lc-stat-stars');
  const listEl   = document.getElementById('lc-concepts-list');

  if (title)    title.textContent    = result.perfect ? '⭐ Perfect Level!' : 'Level Complete!';
  if (subtitle) subtitle.textContent = result.perfect ? 'You answered all questions correctly!' : `${result.correct} out of ${result.total} answered correctly!`;
  if (qEl)      qEl.textContent      = `${result.correct}/${result.total}`;
  if (xpEl)     xpEl.textContent     = `+${result.xpEarned}`;
  if (starEl)   starEl.textContent   = result.stars >= 3 ? '⭐⭐⭐' : result.stars >= 2 ? '⭐⭐☆' : '⭐☆☆';
  if (listEl)   listEl.innerHTML     = (result.topics || []).map(t => `<li>${t}</li>`).join('');

  document.getElementById('btn-next-level')?.addEventListener('click', () => {
    sound.play('click');
    const next = mapModule?.getNextLevel(result.levelId);
    if (next) startGameplay(next.id, next);
    else      showScreen('map');
  }, { once: true });

  document.getElementById('btn-replay-level')?.addEventListener('click', () => {
    sound.play('click');
    startGameplay(result.levelId, result.levelData);
  }, { once: true });
}

function showRewardScreen(milestone, result) {
  showScreen('reward');
  sound.play('reward');

  const { GIFT_CARDS } = await import('./curriculum-data.js').catch(() => ({ GIFT_CARDS: [] }));
  const card = GIFT_CARDS?.find(c => c.milestone === milestone) || GIFT_CARDS?.[0];

  const chestEl = document.getElementById('treasure-section');
  const revealEl = document.getElementById('card-reveal-section');
  if (chestEl)  chestEl.style.display = 'flex';
  if (revealEl) revealEl.style.display = 'none';

  document.getElementById('btn-open-chest')?.addEventListener('click', async () => {
    sound.play('chestOpen');
    // Animate lid
    document.getElementById('chest-lid')?.classList.add('open');
    const rays = document.getElementById('chest-rays');
    if (rays) rays.style.display = 'block';
    await delay(800);
    if (chestEl)  chestEl.style.display  = 'none';
    if (revealEl) revealEl.style.display = 'flex';

    if (card) {
      const el = (id, text) => { const e = document.getElementById(id); if(e) e.textContent = text; };
      el('rc-rarity', card.rarity.toUpperCase());
      el('rc-title', card.title);
      el('rc-desc', card.description);
      el('reward-msg', `🎉 Milestone ${milestone} Levels Reached! Keep adventuring!`);
    }
    // Save to store
    const prog = store.get('progress') || {};
    prog.giftCards = [...(prog.giftCards || []), { ...(card || {}), earnedAt: Date.now() }];
    store.set('progress', prog);
  }, { once: true });

  document.getElementById('btn-collect-reward')?.addEventListener('click', () => {
    sound.play('click');
    showLevelComplete(result);
  }, { once: true });
}

/* ─── Confetti ───────────────────────────────────────────────────── */
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const COLS = ['#6C5CE7','#FFD93D','#00B894','#FD79A8','#0984E3','#E17055'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    r: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    vr: (Math.random() - 0.5) * 0.2,
    color: COLS[Math.floor(Math.random() * COLS.length)],
  }));
  let raf;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    raf = requestAnimationFrame(draw);
  };
  draw();
  // Stop after 4s
  setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height); }, 4000);
}

/* ─── Settings modal ─────────────────────────────────────────────── */
function showSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  const sfxToggle  = document.getElementById('setting-sfx');
  const animToggle = document.getElementById('setting-anim');
  const settings   = store.get('settings') || { sfx: true, anim: true };
  if (sfxToggle)  sfxToggle.checked  = settings.sfx !== false;
  if (animToggle) animToggle.checked = settings.anim !== false;

  const save = () => {
    store.set('settings', { sfx: sfxToggle?.checked ?? true, anim: animToggle?.checked ?? true });
    if (!sfxToggle?.checked) sound.mute(); else sound.unmute();
  };
  sfxToggle?.addEventListener('change',  save);
  animToggle?.addEventListener('change', save);

  const closeModal = () => { modal.style.display = 'none'; };
  document.getElementById('btn-close-settings')?.addEventListener('click',  closeModal, { once: true });
  document.getElementById('settings-backdrop')?.addEventListener('click',   closeModal, { once: true });
  document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      store.set('progress', null);
      store.set('profile',  null);
      closeModal();
      showScreen('welcome');
      initWelcome();
    }
  }, { once: true });

  document.getElementById('btn-change-avatar')?.addEventListener('click', () => {
    closeModal();
    onboarding?.jumpToNameStep?.();
  }, { once: true });
}

/* ─── Global UI bindings ─────────────────────────────────────────── */
function bindGlobalUI() {
  // Back from rewards/progress
  document.getElementById('btn-back-from-rewards')?.addEventListener('click', () => {
    sound.play('click');
    showScreen('map');
  });
  document.getElementById('btn-back-from-progress')?.addEventListener('click', () => {
    sound.play('click');
    showScreen('map');
  });
}

/* ─── Utility ────────────────────────────────────────────────────── */
export function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
export function showToast(msg, duration = 2500) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast-notification';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el?.remove(), duration);
}
