/**
 * LearnQuest — Onboarding Flow v2
 * Steps: 1) Gender → 2) Class (1–12 dropdown) → 3) Subject → 4) Nickname
 * Curriculum map is built dynamically from class + subject selection.
 */

import { SUBJECTS } from './curriculum-data.js';

const GIRL_NAMES  = ['Priya','Ananya','Shreya','Meera','Kavya','Riya','Pooja','Simran'];
const BOY_NAMES   = ['Arjun','Rohan','Vivek','Karthik','Aditya','Rahul','Nikhil','Siddharth'];
const OTHER_NAMES = ['Alex','Sam','Jordan','Casey','Riley','Morgan','Taylor','Avery'];

const CLASS_ICONS = {
  1:'🌱', 2:'🌿', 3:'🍀', 4:'🌻', 5:'🌸',
  6:'⚡', 7:'🔥', 8:'💫', 9:'🌟', 10:'🏅',
  11:'🎓', 12:'🏆',
};

export class OnboardingFlow {
  constructor(store, onComplete) {
    this.store      = store;
    this.onComplete = onComplete;
    this.step       = 1;
    this.data       = { gender: null, classNum: null, subjectId: null, nickname: '' };
    this.card       = document.getElementById('onboarding-card');
    this.nextBtn    = document.getElementById('btn-onboarding-next');
    this.backBtn    = document.getElementById('btn-onboarding-back');

    this.nextBtn?.addEventListener('click', () => this._next());
    this.backBtn?.addEventListener('click', () => this._back());
  }

  start() {
    this.step = 1;
    this._render();
  }

  jumpToNameStep() {
    this.step = 4;
    this._render();
  }

  /* ── Navigation ──────────────────────────────────────────── */
  _next() {
    if (!this._validateStep()) return;
    if (this.step < 4) {
      this.step++;
      this._render();
    } else {
      this._complete();
    }
  }

  _back() {
    if (this.step > 1) {
      this.step--;
      this._render();
    }
  }

  _validateStep() {
    switch (this.step) {
      case 1: return !!this.data.gender;
      case 2: return !!this.data.classNum;
      case 3: return !!this.data.subjectId;
      case 4: return this.data.nickname.trim().length >= 2;
      default: return true;
    }
  }

  /* ── Render dispatcher ───────────────────────────────────── */
  _render() {
    this._updateStepIndicator();
    this._updateNavButtons();

    switch (this.step) {
      case 1: this._renderGender();  break;
      case 2: this._renderClass();   break;
      case 3: this._renderSubject(); break;
      case 4: this._renderName();    break;
    }
  }

  /* ── Step 1: Gender ─────────────────────────────────────── */
  _renderGender() {
    if (!this.card) return;
    this.card.innerHTML = `
      <div class="step-view">
        <div style="text-align:center; margin-bottom: 0.5rem;">
          <span class="step-badge-pill">Step 1 of 4</span>
        </div>
        <h2 class="step-title">👋 Who are you?</h2>
        <p class="step-sub">Choose your explorer identity. This helps personalise your avatar — your curriculum stays the same!</p>
        <div class="gender-cards-row">
          <div class="gender-card" id="gc-boy" data-gender="boy" role="button" tabindex="0" aria-label="Boy">
            <div class="gender-check">✓</div>
            <img src="/assets/characters/boy-adventurer.jpg" alt="Boy Explorer" class="gender-img" />
            <span class="gender-label">Boy 🧡</span>
            <span class="gender-desc">Arjun the Explorer</span>
          </div>
          <div class="gender-card" id="gc-girl" data-gender="girl" role="button" tabindex="0" aria-label="Girl">
            <div class="gender-check">✓</div>
            <img src="/assets/characters/girl-adventurer.jpg" alt="Girl Explorer" class="gender-img" />
            <span class="gender-label">Girl 💜</span>
            <span class="gender-desc">Priya the Explorer</span>
          </div>
          <div class="gender-card" id="gc-other" data-gender="other" role="button" tabindex="0" aria-label="Prefer not to say">
            <div class="gender-check">✓</div>
            <img src="/assets/mascots/sparky-robot.jpg" alt="Any Explorer" class="gender-img" />
            <span class="gender-label">Other 🌈</span>
            <span class="gender-desc">Unique Explorer</span>
          </div>
        </div>
      </div>
    `;

    // Re-apply selection if already chosen
    if (this.data.gender) this._highlightGender(this.data.gender);

    ['boy', 'girl', 'other'].forEach(g => {
      const el = document.getElementById(`gc-${g}`);
      el?.addEventListener('click', () => {
        this.data.gender = g;
        this._highlightGender(g);
        this._updateNavButtons();
        // Auto-suggest a default name
        const pool = g === 'girl' ? GIRL_NAMES : g === 'boy' ? BOY_NAMES : OTHER_NAMES;
        if (!this.data.nickname) this.data.nickname = pool[Math.floor(Math.random() * pool.length)];
      });
    });
  }

  _highlightGender(gender) {
    ['boy','girl','other'].forEach(g => {
      const el = document.getElementById(`gc-${g}`);
      if (!el) return;
      el.classList.remove('selected','selected-girl','selected-other');
      if (g === gender) {
        if (g === 'girl')  el.classList.add('selected-girl');
        else if (g === 'other') el.classList.add('selected-other');
        else el.classList.add('selected');
      }
    });
  }

  /* ── Step 2: Class ──────────────────────────────────────── */
  _renderClass() {
    if (!this.card) return;

    // Build quick-select grid 1–12
    const gridBtns = Array.from({ length: 12 }, (_, i) => {
      const c = i + 1;
      const icon = CLASS_ICONS[c] || '📚';
      const sel  = this.data.classNum === c ? 'selected' : '';
      return `
        <button class="class-quick-btn ${sel}" data-class="${c}" aria-label="Class ${c}">
          <span class="cqb-icon">${icon}</span>
          <span>${c}${this._ordinal(c)}</span>
        </button>`;
    }).join('');

    this.card.innerHTML = `
      <div class="step-view">
        <div style="text-align:center; margin-bottom: 0.5rem;">
          <span class="step-badge-pill">Step 2 of 4</span>
        </div>
        <h2 class="step-title">🎒 Your Class</h2>
        <p class="step-sub">Select your current class. Your entire map and all questions will be tailored to your syllabus!</p>
        <div class="class-select-wrap">
          <select class="class-dropdown" id="class-dropdown" aria-label="Select class">
            <option value="">— Select your class —</option>
            ${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${this.data.classNum===i+1?'selected':''}>Class ${i+1}</option>`).join('')}
          </select>
          <div class="class-quick-grid">${gridBtns}</div>
        </div>
      </div>
    `;

    // Dropdown sync
    document.getElementById('class-dropdown')?.addEventListener('change', e => {
      const val = parseInt(e.target.value);
      if (val) { this.data.classNum = val; this._syncClassGrid(); this._updateNavButtons(); }
    });

    // Quick buttons
    document.querySelectorAll('.class-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.data.classNum = parseInt(btn.dataset.class);
        this._syncClassGrid();
        this._syncClassDropdown();
        this._updateNavButtons();
      });
    });
  }

  _syncClassGrid() {
    document.querySelectorAll('.class-quick-btn').forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.dataset.class) === this.data.classNum);
    });
  }

  _syncClassDropdown() {
    const dd = document.getElementById('class-dropdown');
    if (dd) dd.value = this.data.classNum || '';
  }

  _ordinal(n) {
    const sfx = ['th','st','nd','rd'];
    const v = n % 100;
    return sfx[(v-20)%10] || sfx[v] || sfx[0];
  }

  /* ── Step 3: Subject ────────────────────────────────────── */
  _renderSubject() {
    if (!this.card) return;
    const subjectCards = SUBJECTS.map(sub => `
      <div class="subject-select-card ${this.data.subjectId === sub.id ? 'selected' : ''}"
           data-subject="${sub.id}"
           style="--sub-color:${sub.color}"
           role="button" tabindex="0" aria-label="${sub.name}">
        <div class="sub-icon-wrap" style="--sub-color:${sub.color}">
          <span>${sub.icon}</span>
        </div>
        <span class="sub-name">${sub.name}</span>
        <span class="${sub.id === 'mathematics' ? 'sub-ready-tag' : 'sub-preview-tag'}">
          ${sub.id === 'mathematics' ? '✓ Full Content' : 'Preview'}
        </span>
      </div>
    `).join('');

    this.card.innerHTML = `
      <div class="step-view">
        <div style="text-align:center; margin-bottom: 0.5rem;">
          <span class="step-badge-pill">Step 3 of 4</span>
        </div>
        <h2 class="step-title">📚 Choose Subject</h2>
        <p class="step-sub">Pick the subject for your adventure. Mathematics has full demo content for all classes!</p>
        <div class="subject-select-grid">${subjectCards}</div>
        <p style="margin-top:0.75rem;text-align:center;color:var(--gray-500);font-size:0.8rem;font-weight:600;">
          ℹ️ All subjects are NCERT/CBSE aligned. More content coming soon!
        </p>
      </div>
    `;

    document.querySelectorAll('.subject-select-card').forEach(card => {
      card.addEventListener('click', () => {
        this.data.subjectId = card.dataset.subject;
        document.querySelectorAll('.subject-select-card').forEach(c =>
          c.classList.toggle('selected', c.dataset.subject === this.data.subjectId)
        );
        this._updateNavButtons();
      });
    });
  }

  /* ── Step 4: Nickname ───────────────────────────────────── */
  _renderName() {
    if (!this.card) return;
    const gender = this.data.gender || 'boy';
    const pool   = gender === 'girl' ? GIRL_NAMES : gender === 'boy' ? BOY_NAMES : OTHER_NAMES;
    const avatarSrc = gender === 'girl'
      ? '/assets/characters/girl-adventurer.jpg'
      : '/assets/characters/boy-adventurer.jpg';

    const quickTags = pool.slice(0, 6).map(n =>
      `<button class="qname-tag" data-name="${n}">${n}</button>`
    ).join('');

    this.card.innerHTML = `
      <div class="step-view">
        <div style="text-align:center; margin-bottom: 0.5rem;">
          <span class="step-badge-pill">Step 4 of 4</span>
        </div>
        <h2 class="step-title">🌟 Your Explorer Name</h2>
        <p class="step-sub">Pick a fun nickname for your adventure! Never use your real full name — stay safe.</p>
        <div class="name-step-content">
          <div class="name-preview-row">
            <img src="${avatarSrc}" alt="Your avatar" class="name-avatar-thumb" />
            <div class="name-profile-text">
              <strong id="name-preview-display">${this.data.nickname || 'Explorer'}</strong>
              <span>Class ${this.data.classNum}</span>
              <span>${this._formatSubject(this.data.subjectId)}</span>
              <span style="margin-top:4px;font-size:0.78rem;color:var(--brand-purple);font-weight:800;">0 XP • Level 1</span>
            </div>
          </div>
          <div class="name-input-group">
            <label class="name-input-label" for="nickname-field">Your nickname:</label>
            <input
              type="text"
              id="nickname-field"
              class="name-input-field"
              placeholder="e.g. Arjun, Priya, StarKid…"
              maxlength="18"
              value="${this.data.nickname}"
              autocomplete="off"
              aria-label="Enter your nickname"
            />
            <p class="name-input-hint">🛡️ Child-safe: Do NOT use your real surname. Nicknames only!</p>
          </div>
          <div class="quick-names-row">${quickTags}</div>
        </div>
      </div>
    `;

    const field   = document.getElementById('nickname-field');
    const preview = document.getElementById('name-preview-display');

    field?.addEventListener('input', () => {
      this.data.nickname = field.value.trim();
      if (preview) preview.textContent = this.data.nickname || 'Explorer';
      this._updateNavButtons();
    });

    document.querySelectorAll('.qname-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        this.data.nickname = btn.dataset.name;
        if (field)   field.value           = this.data.nickname;
        if (preview) preview.textContent   = this.data.nickname;
        this._updateNavButtons();
      });
    });
  }

  /* ── Complete onboarding ────────────────────────────────── */
  _complete() {
    const profile = {
      gender:       this.data.gender,
      classNum:     this.data.classNum,
      subjectId:    this.data.subjectId,
      nickname:     this.data.nickname.trim(),
      avatarId:     this.data.gender === 'girl' ? 'priya' : 'arjun',
      setupComplete: true,
      createdAt:    Date.now(),
    };

    const progress = {
      totalXP:        0,
      completedLevels: [],
      currentLevelId:  null,   // will be set to first chapter id
      giftCards:       [],
      masteredTopics:  [],
      streakDays:      0,
      lastPlayedAt:    null,
    };

    this.store.set('profile',  profile);
    this.store.set('progress', progress);

    this.onComplete?.(profile);
  }

  /* ── Step indicator ─────────────────────────────────────── */
  _updateStepIndicator() {
    document.querySelectorAll('.ostep').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.remove('active', 'completed');
      if (s === this.step)   el.classList.add('active');
      if (s <  this.step)    el.classList.add('completed');
    });
  }

  _updateNavButtons() {
    const nextBtn = document.getElementById('btn-onboarding-next');
    const backBtn = document.getElementById('btn-onboarding-back');

    if (backBtn) backBtn.style.visibility = this.step > 1 ? 'visible' : 'hidden';
    if (nextBtn) {
      nextBtn.disabled = !this._validateStep();
      const span = nextBtn.querySelector('.btn-text');
      if (span) span.textContent = this.step === 4 ? 'Start Adventure 🚀' : 'Next';
    }
  }

  _formatSubject(id) {
    const map = {
      mathematics: 'Mathematics', science: 'Science',
      english: 'English', 'social-science': 'Social Science', hindi: 'Hindi'
    };
    return map[id] || id;
  }
}
