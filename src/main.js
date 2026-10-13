/**
 * LearnQuest — Main Entry Point v2
 * File: src/main.js (Vite entry)
 */

import './styles/main.css';
import { Store }          from './modules/store.js';
import { SoundEngine }    from './modules/sound-engine.js';
import { OnboardingFlow } from './modules/onboarding.js';
import { AdventureMap }   from './modules/adventure-map.js';
import { GameEngine }     from './modules/game-engine.js';
import { RewardsView }    from './modules/rewards-view.js';
import { ProgressView }   from './modules/progress-view.js';
import { GIFT_CARDS, APP_CONFIG, getLevels } from './modules/curriculum-data.js';

/* ─── Singletons ────────────────────────────────────────────── */
const store = new Store();
const sound = new SoundEngine();

/* ─── Screen helper ─────────────────────────────────────────── */
const ALL_SCREENS = [
  'loading','welcome','onboarding',
  'map','gameplay','level-complete','reward',
  'rewards-collection','progress',
];

function showScreen(name) {
  ALL_SCREENS.forEach(id => {
    const el = document.getElementById(`${id}-screen`);
    if (el) el.classList.toggle('active', id === name);
  });
}

/* ─── Module instances ───────────────────────────────────────── */
let mapModule, gameModule, rewardsModule, progressModule, onboarding;

/* ─── App boot ───────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  showScreen('loading');
  startLoadingFX();
  await runLoadingSequence();
  await initApp();
});

/* ─── Loading screen ─────────────────────────────────────────── */
function startLoadingFX() {
  const canvas = document.getElementById('loading-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#6C5CE7','#FD79A8','#00CEC9','#FFD93D','#0984E3','#00B894'];

  function mkParticle(w, h) {
    return {
      x: Math.random() * w, y: Math.random() * h + h * 0.2,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.8 + 0.2),
      a: Math.random() * 0.8 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  const particles = Array.from({ length: 70 }, () => mkParticle(canvas.width, canvas.height));

  let raf;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { Object.assign(p, mkParticle(canvas.width, canvas.height)); p.y = canvas.height + 10; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.a * 200).toString(16).padStart(2, '0');
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  })();

  window._loadingRaf = raf;
}

async function runLoadingSequence() {
  const bar  = document.getElementById('loading-bar');
  const txt  = document.getElementById('loading-text');
  const steps = [
    { p:15,  t:'Loading NCERT syllabi…'       },
    { p:35,  t:'Building your map world…'      },
    { p:55,  t:'Preparing questions…'          },
    { p:75,  t:'Rendering adventure path…'     },
    { p:92,  t:'Almost ready!'                 },
    { p:100, t:'Adventure awaits! 🚀'          },
  ];
  for (const s of steps) {
    await delay(300);
    if (bar) bar.style.width = s.p + '%';
    if (txt) txt.textContent = s.t;
  }
  await delay(400);
  cancelAnimationFrame(window._loadingRaf);
}

/* ─── App init ───────────────────────────────────────────────── */
async function initApp() {
  try { await sound.init(); } catch {}

  // Mute button
  document.getElementById('global-mute-btn')?.addEventListener('click', () => {
    sound.toggleMute?.();
    const btn = document.getElementById('global-mute-btn');
    if (btn) btn.textContent = sound.muted ? '🔇' : '🔊';
  });

  rewardsModule  = new RewardsView(store);
  progressModule = new ProgressView(store);

  bindGlobalNav();

  const profile = store.get('profile');
  if (profile?.setupComplete) {
    await launchMap();
    showScreen('map');
  } else {
    launchWelcome();
    showScreen('welcome');
  }
}

/* ─── Welcome ────────────────────────────────────────────────── */
function launchWelcome() {
  startWelcomeCanvas();
  document.getElementById('btn-start-adventure')?.addEventListener('click', () => {
    sound.play?.('click');
    showScreen('onboarding');
    onboarding = new OnboardingFlow(store, async (profile) => {
      await launchMap();
      showScreen('map');
    });
    onboarding.start();
  }, { once: true });
}

function startWelcomeCanvas() {
  const canvas = document.getElementById('welcome-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars, raf2;
  const COLS = ['#6C5CE7','#0984E3','#00CEC9','#FD79A8','#FFD93D','#00B894'];

  function mkStar(w, h) {
    return { x:Math.random()*w, y:Math.random()*h, r:Math.random()*2+0.4,
      vx:(Math.random()-0.5)*0.3, vy:-(Math.random()*0.5+0.1),
      a:Math.random(), color:COLS[Math.floor(Math.random()*COLS.length)] };
  }
  function resize() {
    w = canvas.width  = canvas.offsetWidth  || window.innerWidth;
    h = canvas.height = canvas.offsetHeight || window.innerHeight;
    stars = Array.from({ length: 90 }, () => mkStar(w, h));
  }
  resize();
  window.addEventListener('resize', resize);

  function drawBg() {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0,   '#030318');
    g.addColorStop(0.4, '#0d0d35');
    g.addColorStop(0.7, '#1a0a3e');
    g.addColorStop(1,   '#0d0520');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  (function draw() {
    drawBg();
    stars.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4) { Object.assign(p, mkStar(w, h)); p.y = h + 4; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color + Math.floor(p.a * 200).toString(16).padStart(2,'0');
      ctx.fill();
    });
    raf2 = requestAnimationFrame(draw);
  })();
}

/* ─── Map ────────────────────────────────────────────────────── */
async function launchMap() {
  if (!mapModule) {
    mapModule = new AdventureMap(store, {
      onLevelSelect: (levelId, levelData) => startGameplay(levelId, levelData),
    });
  }
  mapModule.render();
}

/* ─── Gameplay ───────────────────────────────────────────────── */
function startGameplay(levelId, levelData) {
  sound.play?.('start');
  showScreen('gameplay');
  if (!gameModule) {
    gameModule = new GameEngine(store, sound, {
      onLevelComplete: handleLevelComplete,
      onBackToMap:     () => { showScreen('map'); mapModule?.render(); },
    });
  }
  gameModule.startLevel(levelId, levelData);
}

/* ─── Level complete routing ─────────────────────────────────── */
function handleLevelComplete(result) {
  const prog = store.get('progress') || {};
  const count = (prog.completedLevels || []).length;
  if (count > 0 && count % APP_CONFIG.giftCardEveryNLevels === 0) {
    showRewardScreen(count, result);
  } else {
    renderLevelComplete(result);
    showScreen('level-complete');
  }
}

function renderLevelComplete(result) {
  startConfetti();
  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('lc-title',          result.perfect ? '⭐ Perfect!' : 'Level Complete!');
  el('lc-subtitle',       result.perfect ? 'All answers correct! You\'re amazing!' : `${result.correct} of ${result.total} correct — great effort!`);
  el('lc-stat-questions', `${result.correct}/${result.total}`);
  el('lc-stat-xp',        `+${result.xpEarned}`);
  el('lc-stat-stars',     '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars));

  const list = document.getElementById('lc-concepts-list');
  if (list) list.innerHTML = (result.topics || []).map(t => `<li>${t}</li>`).join('');

  const btnNext   = document.getElementById('btn-next-level');
  const btnReplay = document.getElementById('btn-replay-level');
  btnNext?.replaceWith(btnNext.cloneNode(true));
  btnReplay?.replaceWith(btnReplay.cloneNode(true));

  document.getElementById('btn-next-level')?.addEventListener('click', () => {
    const profile = store.get('profile') || {};
    const levels  = getLevels(profile.classNum, profile.subjectId);
    const nextIdx = levels.findIndex(l => l.id === result.levelId) + 1;
    const next    = levels[nextIdx];
    if (next) startGameplay(next.id, next);
    else { showScreen('map'); mapModule?.render(); }
  });
  document.getElementById('btn-replay-level')?.addEventListener('click', () => {
    startGameplay(result.levelId, result.levelData);
  });
}

/* ─── Reward screen ──────────────────────────────────────────── */
function showRewardScreen(milestone, result) {
  showScreen('reward');
  sound.play?.('reward');

  const card = GIFT_CARDS.find(c => c.milestone === milestone) || GIFT_CARDS[0];

  const chestSec  = document.getElementById('treasure-section');
  const revealSec = document.getElementById('card-reveal-section');
  if (chestSec)  chestSec.style.display  = 'flex';
  if (revealSec) revealSec.style.display = 'none';

  // Reset lid
  document.getElementById('chest-lid')?.classList.remove('open');
  const rays = document.getElementById('chest-rays');
  if (rays) rays.style.display = 'none';

  document.getElementById('btn-open-chest')?.addEventListener('click', async () => {
    sound.play?.('chestOpen');
    document.getElementById('chest-lid')?.classList.add('open');
    if (rays) rays.style.display = 'block';
    await delay(900);
    if (chestSec)  chestSec.style.display  = 'none';
    if (revealSec) revealSec.style.display = 'flex';

    const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    if (card) {
      el('rc-rarity', card.rarity.toUpperCase());
      el('rc-title',  card.title);
      el('rc-desc',   card.description);
      el('reward-msg',`🎉 ${milestone} levels completed! Keep exploring!`);
    }
  }, { once: true });

  document.getElementById('btn-collect-reward')?.addEventListener('click', () => {
    renderLevelComplete(result);
    showScreen('level-complete');
  }, { once: true });
}

/* ─── Confetti ───────────────────────────────────────────────── */
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const COLS = ['#6C5CE7','#FFD93D','#00B894','#FD79A8','#0984E3','#E17055','#00CEC9'];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -(Math.random() * canvas.height),
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    r: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    vr: (Math.random() - 0.5) * 0.15,
    color: COLS[Math.floor(Math.random() * COLS.length)],
  }));
  let raf;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    raf = requestAnimationFrame(draw);
  })();
  setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height); }, 4500);
}

/* ─── Global nav bindings ────────────────────────────────────── */
function bindGlobalNav() {
  document.getElementById('btn-rewards')?.addEventListener('click', () => {
    rewardsModule?.render();
    showScreen('rewards-collection');
  });
  document.getElementById('btn-progress')?.addEventListener('click', () => {
    progressModule?.render();
    showScreen('progress');
  });
  document.getElementById('btn-settings')?.addEventListener('click', () => {
    openSettingsModal();
  });
  document.getElementById('btn-continue-map')?.addEventListener('click', () => {
    const prog = store.get('progress') || {};
    const profile = store.get('profile') || {};
    const levels = getLevels(profile.classNum, profile.subjectId);
    const curId  = prog.currentLevelId || levels[0]?.id;
    const lvl    = levels.find(l => l.id === curId) || levels[0];
    if (lvl) startGameplay(lvl.id, lvl);
  });
  document.getElementById('btn-back-from-rewards')?.addEventListener('click', () => {
    showScreen('map');
  });
  document.getElementById('btn-back-from-progress')?.addEventListener('click', () => {
    showScreen('map');
  });
}

/* ─── Settings modal ─────────────────────────────────────────── */
function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  // Always start on the main settings body
  const mainBody   = document.getElementById('settings-main-body');
  const pickerBody = document.getElementById('avatar-picker-body');
  if (mainBody)   mainBody.style.display   = 'block';
  if (pickerBody) pickerBody.style.display = 'none';

  // Sync toggle states
  const settings = store.get('settings') || { sfx: true, anim: true };
  const sfxEl  = document.getElementById('setting-sfx');
  const animEl = document.getElementById('setting-anim');
  if (sfxEl)  sfxEl.checked  = settings.sfx  !== false;
  if (animEl) animEl.checked = settings.anim !== false;

  const saveSettings = () => {
    const s = { sfx: sfxEl?.checked ?? true, anim: animEl?.checked ?? true };
    store.set('settings', s);
  };
  sfxEl?.addEventListener('change',  saveSettings);
  animEl?.addEventListener('change', saveSettings);

  // Close helper — also resets picker view
  const close = () => {
    modal.style.display = 'none';
    if (mainBody)   mainBody.style.display   = 'block';
    if (pickerBody) pickerBody.style.display = 'none';
  };

  // --- Fresh bind: clone buttons to remove stale listeners ---
  function rebind(id, fn) {
    const el = document.getElementById(id);
    if (!el) return null;
    const fresh = el.cloneNode(true);
    el.replaceWith(fresh);
    fresh.addEventListener('click', fn);
    return fresh;
  }

  rebind('btn-close-settings', close);
  document.getElementById('settings-backdrop')?.addEventListener('click', close, { once: true });

  // ── Change Avatar ──
  rebind('btn-change-avatar', () => {
    if (mainBody)   mainBody.style.display   = 'none';
    if (pickerBody) pickerBody.style.display = 'block';

    // Highlight current avatar
    const currentAvatar = store.get('profile')?.avatar || 'boy';
    document.querySelectorAll('#avatar-pick-grid .av-pick-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.avatar === currentAvatar);
    });
  });

  // Back from avatar picker
  rebind('btn-avatar-back', () => {
    if (mainBody)   mainBody.style.display   = 'block';
    if (pickerBody) pickerBody.style.display = 'none';
  });

  // Avatar card selection
  document.querySelectorAll('#avatar-pick-grid .av-pick-card').forEach(card => {
    const fresh = card.cloneNode(true);
    card.replaceWith(fresh);
    fresh.addEventListener('click', () => {
      const chosen = fresh.dataset.avatar;
      store.set('profile.avatar', chosen);

      // Update selected state visually
      document.querySelectorAll('#avatar-pick-grid .av-pick-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.avatar === chosen);
      });

      sound.play?.('click');
      showToast(`Avatar changed to ${chosen === 'boy' ? 'Arjun' : chosen === 'girl' ? 'Priya' : 'Sparky'}! 🎉`);

      // Go back to main settings after 700ms
      setTimeout(() => {
        if (mainBody)   mainBody.style.display   = 'block';
        if (pickerBody) pickerBody.style.display = 'none';
      }, 700);
    });
  });

  // ── Reset Progress ──
  rebind('btn-reset-progress', () => {
    if (!confirm('⚠️ Reset ALL progress? This cannot be undone!\n\nAll XP, completed levels, stars and gift cards will be erased.')) return;
    store.clear();
    modal.style.display = 'none';
    // Reload the page so all module singletons and listeners are cleanly re-initialized
    window.location.reload();
  });
}

/* ─── Utility ────────────────────────────────────────────────── */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export function showToast(msg, ms = 2500) {
  document.querySelector('.toast-notification')?.remove();
  const el = Object.assign(document.createElement('div'), { className: 'toast-notification', textContent: msg });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
}
