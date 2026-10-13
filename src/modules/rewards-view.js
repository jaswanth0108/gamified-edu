/**
 * LearnQuest — Rewards & Collectibles View v2
 */

import { GIFT_CARDS } from './curriculum-data.js';

const BADGES = [
  { id:'first-level',  emoji:'🌟', title:'First Step',        desc:'Complete your very first level',   xp:0  },
  { id:'five-levels',  emoji:'🔥', title:'On Fire!',           desc:'Complete 5 levels',                xp:5  },
  { id:'ten-levels',   emoji:'💎', title:'Diamond Learner',    desc:'Complete 10 levels',               xp:10 },
  { id:'perfect-level',emoji:'⭐', title:'Perfect Score',      desc:'Answer all 5 questions correctly', xp:0  },
  { id:'no-hints',     emoji:'🧠', title:'No Hints Needed',    desc:'Complete a level without hints',   xp:0  },
  { id:'streak-3',     emoji:'🔥', title:'3-Day Streak',       desc:'Play for 3 days in a row',         xp:0  },
];

const ACHIEVEMENTS = [
  { id:'levels-done',  emoji:'🗺️', title:'Explorer',    desc:'Levels completed', current:0, target:20 },
  { id:'xp-earned',    emoji:'⭐', title:'XP Master',   desc:'Total XP earned',  current:0, target:500 },
  { id:'cards-earned', emoji:'🃏', title:'Collector',   desc:'Gift cards earned', current:0, target:5  },
  { id:'perfect-runs', emoji:'💯', title:'Perfectionist',desc:'Perfect level runs',current:0, target:3 },
];

export class RewardsView {
  constructor(store) {
    this.store     = store;
    this.activeTab = 'cards';
  }

  render() {
    this._bindTabs();
    this._renderTab(this.activeTab);
    this._updateCount();
  }

  _bindTabs() {
    document.querySelectorAll('.ctab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
        this._renderTab(this.activeTab);
      });
    });
  }

  _renderTab(tab) {
    if (tab === 'cards')        this._renderCards();
    else if (tab === 'badges')  this._renderBadges();
    else                        this._renderAchievements();
  }

  /* ── Gift Cards ────────────────────────────────────────── */
  _renderCards() {
    const body = document.getElementById('collection-body');
    if (!body) return;
    const prog = this.store.get('progress') || {};
    const earned = new Set((prog.giftCards || []).map(c => c.id));

    body.innerHTML = `<div class="collectibles-grid"></div>`;
    const grid = body.querySelector('.collectibles-grid');

    GIFT_CARDS.forEach(card => {
      const isEarned = earned.has(card.id);
      const item = document.createElement('div');
      item.className = `gift-card-item ${isEarned ? 'earned' : 'locked-card'}`;
      item.innerHTML = `
        <div style="
          height:110px;
          background: linear-gradient(135deg, ${card.color}33, ${card.color}66);
          display:flex; align-items:center; justify-content:center;
          font-size:2.5rem;
        ">${isEarned ? '🏆' : '🔒'}</div>
        <div style="padding:0.75rem;">
          <div style="
            font-size:0.65rem; font-weight:900; letter-spacing:2px;
            color:${isEarned ? card.color : 'var(--gray-500)'};
            margin-bottom:4px;
          ">${card.rarity.toUpperCase()}</div>
          <div style="font-weight:800; color:${isEarned ? 'var(--white)' : 'var(--gray-600)'}; font-size:0.9rem; margin-bottom:4px;">
            ${isEarned ? card.title : `Reach Level ${card.milestone}`}
          </div>
          <div style="font-size:0.75rem; color:var(--gray-500); font-weight:600;">
            ${isEarned ? card.description : `Complete ${card.milestone} levels to unlock`}
          </div>
        </div>
      `;
      grid.appendChild(item);
    });
  }

  /* ── Badges ─────────────────────────────────────────────── */
  _renderBadges() {
    const body = document.getElementById('collection-body');
    if (!body) return;
    const prog   = this.store.get('progress') || {};
    const done   = (prog.completedLevels || []).length;

    body.innerHTML = `<div class="badges-grid"></div>`;
    const grid = body.querySelector('.badges-grid');

    BADGES.forEach(badge => {
      const unlocked = (badge.id === 'first-level'   && done >= 1)
                    || (badge.id === 'five-levels'    && done >= 5)
                    || (badge.id === 'ten-levels'     && done >= 10)
                    || (badge.id === 'perfect-level'  && done >= 1)
                    || false;
      const item = document.createElement('div');
      item.className = `badge-item ${unlocked ? 'badge-unlocked' : ''}`;
      item.innerHTML = `
        <span class="badge-emoji" style="filter:${unlocked?'none':'grayscale(1) opacity(0.4)'}">${badge.emoji}</span>
        <div class="badge-title" style="color:${unlocked?'var(--white)':'var(--gray-600)'};">${badge.title}</div>
        <div class="badge-desc">${badge.desc}</div>
        ${unlocked ? `<span class="badge-tag">✓ Unlocked</span>` : `<span style="color:var(--gray-600);font-size:0.72rem;font-weight:700;">Locked</span>`}
      `;
      grid.appendChild(item);
    });
  }

  /* ── Achievements ────────────────────────────────────────── */
  _renderAchievements() {
    const body = document.getElementById('collection-body');
    if (!body) return;
    const prog = this.store.get('progress') || {};

    const data = [
      { ...ACHIEVEMENTS[0], current: (prog.completedLevels||[]).length },
      { ...ACHIEVEMENTS[1], current: prog.totalXP || 0 },
      { ...ACHIEVEMENTS[2], current: (prog.giftCards||[]).length },
      { ...ACHIEVEMENTS[3], current: 0 },
    ];

    body.innerHTML = `<div class="achievements-list"></div>`;
    const list = body.querySelector('.achievements-list');

    data.forEach(ach => {
      const pct   = Math.min(100, Math.round((ach.current / ach.target) * 100));
      const done  = ach.current >= ach.target;
      const item  = document.createElement('div');
      item.className = 'achievement-card';
      item.innerHTML = `
        <div class="achievement-icon">${ach.emoji}</div>
        <div class="achievement-info">
          <div class="achievement-header-row">
            <h4>${ach.title}</h4>
            <span class="achievement-score" style="color:${done?'var(--success)':'var(--brand-purple)'}">
              ${ach.current}/${ach.target}
            </span>
          </div>
          <p class="achievement-desc">${ach.desc}</p>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${pct}%;background:${done?'var(--success)':'linear-gradient(90deg,var(--brand-purple),var(--brand-pink))'}"></div>
          </div>
        </div>
      `;
      list.appendChild(item);
    });
  }

  /* ── Count badge ─────────────────────────────────────────── */
  _updateCount() {
    const prog  = this.store.get('progress') || {};
    const count = (prog.giftCards || []).length;
    const el    = document.getElementById('coll-count');
    if (el) el.textContent = `${count} Card${count !== 1 ? 's' : ''}`;
  }
}
