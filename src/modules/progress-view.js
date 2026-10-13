/**
 * LearnQuest — Progress Dashboard v2
 */

import { getLevels, getCurriculum } from './curriculum-data.js';

export class ProgressView {
  constructor(store) {
    this.store = store;
  }

  render() {
    const body = document.getElementById('progress-body');
    if (!body) return;

    const profile = this.store.get('profile') || {};
    const prog    = this.store.get('progress') || {};
    const levels  = getLevels(profile.classNum, profile.subjectId);
    const done    = prog.completedLevels || [];
    const total   = levels.length;
    const xp      = prog.totalXP || 0;
    const cards   = (prog.giftCards || []).length;

    const avatarSrc = profile.gender === 'girl'
      ? '/assets/characters/girl-adventurer.jpg'
      : '/assets/characters/boy-adventurer.jpg';

    const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;

    // Mastered topics from completed levels
    const masteredLevels = levels.filter(l => done.includes(l.id));
    const nextLevels     = levels.filter(l => !done.includes(l.id)).slice(0, 3);

    body.innerHTML = `
      <!-- Hero card -->
      <div class="progress-hero-card">
        <div class="progress-hero-avatar">
          <img src="${avatarSrc}" alt="${profile.nickname}" />
        </div>
        <div class="progress-hero-text">
          <h2>${profile.nickname || 'Explorer'}</h2>
          <p>Class ${profile.classNum} • ${this._subjectName(profile.subjectId)}</p>
          <p style="color:var(--brand-yellow);font-weight:800;">⭐ ${xp} XP Earned</p>
          <span class="streak-badge">🔥 ${prog.streakDays || 0} Day Streak</span>
        </div>
      </div>

      <!-- Metrics grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-icon">🗺️</span>
          <div>
            <span class="metric-value">${done.length}/${total}</span>
            <span class="metric-label">Levels Done</span>
          </div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">⭐</span>
          <div>
            <span class="metric-value">${xp}</span>
            <span class="metric-label">Total XP</span>
          </div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">🃏</span>
          <div>
            <span class="metric-value">${cards}</span>
            <span class="metric-label">Gift Cards</span>
          </div>
        </div>
        <div class="metric-card">
          <span class="metric-icon">📊</span>
          <div>
            <span class="metric-value">${pct}%</span>
            <span class="metric-label">Complete</span>
          </div>
        </div>
      </div>

      <!-- Overall progress bar -->
      <div class="mastery-section">
        <div class="section-title-row">
          <h3>Overall Progress</h3>
          <span class="status-pill mastered-pill">${pct}% done</span>
        </div>
        <div style="height:12px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;margin-bottom:0.5rem;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--brand-purple),var(--brand-pink));border-radius:999px;transition:width 1s ease;"></div>
        </div>
        <p class="section-sub">${done.length} of ${total} chapters mastered in ${this._subjectName(profile.subjectId)}</p>
      </div>

      <!-- Mastered chapters -->
      ${masteredLevels.length > 0 ? `
      <div class="mastery-section">
        <div class="section-title-row">
          <h3>Mastered Chapters ✓</h3>
        </div>
        <div class="topics-checklist">
          ${masteredLevels.map(l => `
            <div class="topic-row topic-mastered">
              <div class="topic-check">✓</div>
              <div>
                <span class="topic-title">Ch ${l.levelNumber}: ${l.title}</span>
                <span class="topic-obj">${l.env}</span>
              </div>
              <span class="tag-mastered">✓ Done</span>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Next up -->
      ${nextLevels.length > 0 ? `
      <div class="mastery-section">
        <div class="section-title-row">
          <h3>Up Next</h3>
        </div>
        <div class="topics-checklist">
          ${nextLevels.map((l, i) => `
            <div class="topic-row">
              <div class="topic-check" style="color:var(--brand-purple);font-weight:900;">${l.levelNumber}</div>
              <div>
                <span class="topic-title">Ch ${l.levelNumber}: ${l.title}</span>
                <span class="topic-obj">${l.env}</span>
              </div>
              <span class="tag-ready">${i === 0 ? '▶ Next' : 'Upcoming'}</span>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Recommendation box -->
      <div class="recommendations-box">
        <div class="rec-header">
          <span class="rec-icon">🤖</span>
          <h4>Sparky's Recommendation</h4>
        </div>
        <div class="rec-content">
          ${done.length === 0
            ? `<p>Welcome, ${profile.nickname || 'Explorer'}! Start with <strong>Chapter 1</strong> to begin your adventure. Every expert was once a beginner! 🚀</p>`
            : done.length < total
            ? `<p>Great progress, ${profile.nickname || 'Explorer'}! You've completed <strong>${done.length} chapters</strong>. Keep going — you're doing brilliantly! The next chapter awaits! 🌟</p>`
            : `<p>🏆 Incredible! You've completed ALL ${total} chapters of ${this._subjectName(profile.subjectId)} for Class ${profile.classNum}! You are a true LearnQuest Champion!</p>`
          }
          <button class="btn-ghost-sm" style="margin-top:0.5rem;" onclick="document.getElementById('btn-back-from-progress').click()">
            Back to Map 🗺️
          </button>
        </div>
      </div>
    `;
  }

  _subjectName(id) {
    const map = {
      mathematics: 'Mathematics', science: 'Science',
      english: 'English', 'social-science': 'Social Science', hindi: 'Hindi'
    };
    return map[id] || id || 'Subject';
  }
}
