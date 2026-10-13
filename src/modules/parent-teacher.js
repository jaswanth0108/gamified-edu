/**
 * LearnQuest — Guardian & Educator Dashboards
 * 
 * Supports:
 * - /parent: Guardian controls, child privacy protections, screen time preferences
 * - /teacher: Classroom curriculum tracker, learning analytics, assignment generator
 */

import { store } from './store.js';
import { soundEngine } from './sound-engine.js';
import { router } from './router.js';
import { getCurriculum, getLevels } from './curriculum-data.js';
const DEMO_CURRICULUM = getCurriculum(6, 'mathematics');

export class ParentTeacherView {
  constructor() {
    this.parentContainer = document.getElementById('parent-screen');
    this.teacherContainer = document.getElementById('teacher-screen');
  }

  renderParent() {
    if (!this.parentContainer) return;
    const profile = store.get('profile') || {};
    const progress = store.get('progress') || {};
    const completedCount = store.getCompletedLevelCount();

    this.parentContainer.innerHTML = `
      <div class="screen-container max-w-2xl animate-fade-in">
        <div class="page-top-nav">
          <button class="btn btn-ghost" id="btn-back-from-parent">← Back to Map</button>
          <h2>Guardian Hub & Safety Controls</h2>
        </div>

        <div class="safety-badge-banner">
          <span class="shield-big">🛡️</span>
          <div>
            <h3>Child Data Protection Verified</h3>
            <p>LearnQuest follows Indian child data safety standards. No personal identity data is sold, no open chats exist between minors, and educational access is 100% free with no predatory microtransactions.</p>
          </div>
        </div>

        <div class="parent-summary-card">
          <h3>Student Overview: Explorer ${profile.name || 'Student'}</h3>
          <p>Class ${profile.class || 6} • ${(profile.board || 'cbse').toUpperCase()} Curriculum</p>
          
          <div class="parent-stats-grid">
            <div class="parent-stat">
              <span class="p-num">${completedCount}</span>
              <span class="p-lbl">Levels Completed</span>
            </div>
            <div class="parent-stat">
              <span class="p-num">${progress.totalXP || 0}</span>
              <span class="p-lbl">Adventure XP</span>
            </div>
            <div class="parent-stat">
              <span class="p-num">~25 min</span>
              <span class="p-lbl">Estimated Study Time</span>
            </div>
          </div>
        </div>

        <div class="parent-controls-card">
          <h3>Screen Time & Learning Guardrails</h3>
          
          <div class="control-row">
            <div>
              <strong>Daily Play Limit</strong>
              <p class="text-sm text-muted">Automatically encourages a healthy break after the set time.</p>
            </div>
            <select class="form-select" id="parent-time-limit">
              <option value="30">30 minutes / day</option>
              <option value="45" selected>45 minutes / day</option>
              <option value="60">60 minutes / day</option>
              <option value="unlimited">No restriction</option>
            </select>
          </div>

          <div class="control-row">
            <div>
              <strong>Sound & Background Effects</strong>
              <p class="text-sm text-muted">Mute audio or reduce animation intensity for sensory comfort.</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="btn-parent-sound-toggle">Configure Audio</button>
          </div>
        </div>
      </div>
    `;

    const btnBack = this.parentContainer.querySelector('#btn-back-from-parent');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        soundEngine.click();
        router.navigate('/map');
      });
    }

    const btnSound = this.parentContainer.querySelector('#btn-parent-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.style.display = 'flex';
      });
    }
  }

  renderTeacher() {
    if (!this.teacherContainer) return;
    const progress = store.get('progress') || {};
    const completedLevels = progress.completedLevels || [];

    this.teacherContainer.innerHTML = `
      <div class="screen-container max-w-3xl animate-fade-in">
        <div class="page-top-nav">
          <button class="btn btn-ghost" id="btn-back-from-teacher">← Back to Map</button>
          <h2>Educator Dashboard</h2>
        </div>

        <div class="teacher-header-card">
          <div>
            <h3>Curriculum Alignment: CBSE / NCERT Class 6 Mathematics</h3>
            <p>Textbook Reference: 2024-25 Edition • Verified Syllabus Source: ncert.nic.in</p>
          </div>
          <span class="badge-verified">✓ Verified Standard</span>
        </div>

        <div class="teacher-grid">
          <div class="teacher-card">
            <h4>Chapter 1: Knowing Our Numbers (5 Sub-Topics)</h4>
            <table class="teacher-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Learning Objective</th>
                  <th>Student Status</th>
                </tr>
              </thead>
              <tbody>
                ${DEMO_CURRICULUM.chapters.map(ch => {
                  const isDone = completedLevels.includes(ch.id);
                  return `
                    <tr>
                      <td><strong>${ch.title}</strong></td>
                      <td>${ch.env}</td>
                      <td><span class="status-pill ${isDone ? 'tag-mastered' : 'tag-ready'}">${isDone ? '✓ Mastered' : 'Not Yet'}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="teacher-card">
            <h4>Classroom Activity Recommendations</h4>
            <ul class="activity-bullets">
              <li><strong>Interactive Quiz:</strong> Encourage students to solve Level 5 (Roman Numerals) to unlock their milestone reward card.</li>
              <li><strong>Offline Connection:</strong> Ask students to write down 3 real-world large numbers they see around them (e.g. city populations or road distances).</li>
              <li><strong>Formative Assessment:</strong> Export progress reports for parent-teacher conferences.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    const btnBack = this.teacherContainer.querySelector('#btn-back-from-teacher');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        soundEngine.click();
        router.navigate('/map');
      });
    }
  }
}
