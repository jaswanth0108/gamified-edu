/**
 * LearnQuest — Profile & Avatar Customizer
 * 
 * Allows students to switch their adventurer avatar (Arjun / Priya / Neutral)
 * at any time without resetting progress, update their nickname, and view
 * current academic details.
 */

import { store } from './store.js';
import { soundEngine } from './sound-engine.js';
import { router } from './router.js';

export class ProfileView {
  constructor() {
    this.container = document.getElementById('profile-screen');
    this.init();
  }

  init() {
    store.on('profile', () => this.render());
  }

  render() {
    if (!this.container) return;
    const profile = store.get('profile') || {};
    const progress = store.get('progress') || {};

    this.container.innerHTML = `
      <div class="screen-container max-w-xl animate-fade-in">
        <div class="page-top-nav">
          <button class="btn btn-ghost" id="btn-back-from-profile">← Back to Map</button>
          <h2>Explorer Profile</h2>
        </div>

        <div class="profile-card-main">
          <div class="profile-avatar-display">
            <img src="/assets/characters/${profile.avatar === 'girl' ? 'girl-adventurer.jpg' : profile.avatar === 'neutral' ? '../mascots/sparky-robot.jpg' : 'boy-adventurer.jpg'}" alt="Avatar" class="profile-avatar-large" />
            <div class="profile-level-badge">Explorer</div>
          </div>

          <div class="profile-fields">
            <div class="form-group">
              <label for="profile-name-input" class="form-label">Adventurer Nickname</label>
              <div class="input-with-button">
                <input type="text" id="profile-name-input" class="form-input" value="${profile.name || 'Explorer'}" maxlength="20" />
                <button class="btn btn-primary btn-sm" id="btn-save-name">Save</button>
              </div>
            </div>

            <div class="meta-row">
              <div class="meta-box">
                <span class="meta-title">Class</span>
                <span class="meta-val">Class ${profile.class || 6}</span>
              </div>
              <div class="meta-box">
                <span class="meta-title">Board</span>
                <span class="meta-val">${(profile.board || 'cbse').toUpperCase()}</span>
              </div>
              <div class="meta-box">
                <span class="meta-title">Total XP</span>
                <span class="meta-val">${progress.totalXP || 0} ⭐</span>
              </div>
            </div>
          </div>
        </div>

        <div class="avatar-switch-section">
          <h3>Change Your Playable Adventurer</h3>
          <p class="section-sub">Switch anytime! Your levels, stars, gift cards, and XP are 100% preserved.</p>

          <div class="avatar-selection-grid">
            <div class="avatar-card ${profile.avatar === 'boy' ? 'selected' : ''}" data-avatar="boy">
              <div class="avatar-card-image-wrap">
                <img src="/assets/characters/boy-adventurer.jpg" alt="Arjun" class="avatar-img" />
              </div>
              <div class="avatar-info">
                <h4>Arjun</h4>
                <p>Curious Adventurer</p>
              </div>
            </div>

            <div class="avatar-card ${profile.avatar === 'girl' ? 'selected' : ''}" data-avatar="girl">
              <div class="avatar-card-image-wrap">
                <img src="/assets/characters/girl-adventurer.jpg" alt="Priya" class="avatar-img" />
              </div>
              <div class="avatar-info">
                <h4>Priya</h4>
                <p>Innovative Explorer</p>
              </div>
            </div>

            <div class="avatar-card ${profile.avatar === 'neutral' ? 'selected' : ''}" data-avatar="neutral">
              <div class="avatar-card-image-wrap avatar-neutral-wrap">
                <img src="/assets/mascots/sparky-robot.jpg" alt="Sparky" class="avatar-img" />
              </div>
              <div class="avatar-info">
                <h4>Sparky & Team</h4>
                <p>Robot Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Listeners
    const btnBack = this.container.querySelector('#btn-back-from-profile');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        soundEngine.click();
        router.navigate('/map');
      });
    }

    const btnSaveName = this.container.querySelector('#btn-save-name');
    const inputName = this.container.querySelector('#profile-name-input');
    if (btnSaveName && inputName) {
      btnSaveName.addEventListener('click', () => {
        const val = inputName.value.trim();
        if (val.length >= 2) {
          soundEngine.click();
          store.set('profile.name', val);
          alert('Nickname saved successfully! 🎉');
        }
      });
    }

    const avatarCards = this.container.querySelectorAll('.avatar-card');
    avatarCards.forEach((card) => {
      card.addEventListener('click', () => {
        soundEngine.selectOption();
        const newAvatar = card.getAttribute('data-avatar');
        store.set('profile.avatar', newAvatar);
        this.render();
      });
    });
  }
}
