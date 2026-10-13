/**
 * LearnQuest — State Store
 * 
 * Manages all application state with localStorage persistence.
 * Handles student profile, progress, XP, rewards, and settings.
 * Uses a simple reactive store pattern.
 */

const STORAGE_KEY = 'learnquest_state';

const DEFAULT_STATE = {
  // Student profile
  profile: {
    name: '',
    avatar: 'boy', // 'boy', 'girl', 'neutral'
    class: null,
    board: null,
    subject: null,
    language: 'en',
    onboardingComplete: false,
  },

  // Progress tracking
  progress: {
    currentChapter: 'ch1',
    currentLevel: 'ch1-l1',
    completedLevels: [],      // Array of level IDs
    levelAttempts: {},         // { levelId: { attempts: N, bestScore: N } }
    totalXP: 0,
    unlockedLevels: ['ch1-l1'],
  },

  // Rewards
  rewards: {
    giftCards: [],         // Array of { id, milestone, title, earnedAt }
    badges: [],            // Array of { id, name, earnedAt }
    totalStars: 0,
    claimedMilestones: [], // Array of milestone numbers already claimed
  },

  // Settings
  settings: {
    sfxEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
  },

  // Current gameplay state (not persisted between sessions for simplicity)
  gameplay: {
    currentLevelId: null,
    currentQuestionIndex: 0,
    questionsAnswered: 0,
    correctInLevel: 0,
    xpEarnedInLevel: 0,
    hintsUsed: 0,
    selectedAnswer: null,
    levelStarted: false,
  },
};

export class Store {
  constructor() {
    this.state = this.load();
    this.listeners = new Map();
  }

  /** Load state from localStorage or return defaults */
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults to handle new fields
        return this.deepMerge(structuredClone(DEFAULT_STATE), parsed);
      }
    } catch (e) {
      console.warn('Failed to load saved state:', e);
    }
    return structuredClone(DEFAULT_STATE);
  }

  /** Save state to localStorage */
  save() {
    try {
      // Don't persist gameplay state
      const toSave = { ...this.state };
      toSave.gameplay = DEFAULT_STATE.gameplay;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  /** Deep merge two objects */
  deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  /** Get a value from state by dot-path */
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  /** Set a value in state by dot-path */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.state);
    target[lastKey] = value;
    this.save();
    this.notify(path);
  }

  /** Update multiple values at once */
  update(updates) {
    for (const [path, value] of Object.entries(updates)) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((obj, key) => {
        if (!obj[key]) obj[key] = {};
        return obj[key];
      }, this.state);
      target[lastKey] = value;
    }
    this.save();
    for (const path of Object.keys(updates)) {
      this.notify(path);
    }
  }

  /** Subscribe to state changes */
  on(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path).add(callback);
    return () => this.listeners.get(path)?.delete(callback);
  }

  /** Notify listeners of change */
  notify(changedPath) {
    for (const [path, callbacks] of this.listeners) {
      if (changedPath.startsWith(path) || path.startsWith(changedPath)) {
        for (const cb of callbacks) {
          try { cb(this.get(path)); } catch (e) { console.error('Listener error:', e); }
        }
      }
    }
  }

  // === Profile helpers ===

  setProfile(data) {
    this.update({
      'profile.name': data.name || this.state.profile.name,
      'profile.avatar': data.avatar || this.state.profile.avatar,
      'profile.class': data.class ?? this.state.profile.class,
      'profile.board': data.board || this.state.profile.board,
      'profile.subject': data.subject || this.state.profile.subject,
      'profile.language': data.language || this.state.profile.language,
    });
  }

  completeOnboarding() {
    this.set('profile.onboardingComplete', true);
  }

  // === Progress helpers ===

  isLevelCompleted(levelId) {
    return this.state.progress.completedLevels.includes(levelId);
  }

  isLevelUnlocked(levelId) {
    return this.state.progress.unlockedLevels.includes(levelId);
  }

  completeLevel(levelId, xpEarned, correctAnswers, totalQuestions) {
    const progress = this.state.progress;
    
    // Add to completed if not already
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
    }

    // Update attempts
    if (!progress.levelAttempts[levelId]) {
      progress.levelAttempts[levelId] = { attempts: 0, bestScore: 0 };
    }
    progress.levelAttempts[levelId].attempts++;
    progress.levelAttempts[levelId].bestScore = Math.max(
      progress.levelAttempts[levelId].bestScore,
      correctAnswers
    );

    // Award XP (only for first completion, replays don't award full XP)
    progress.totalXP += xpEarned;

    this.save();
    this.notify('progress');
  }

  unlockLevel(levelId) {
    if (!this.state.progress.unlockedLevels.includes(levelId)) {
      this.state.progress.unlockedLevels.push(levelId);
      this.save();
      this.notify('progress');
    }
  }

  getCompletedLevelCount() {
    return this.state.progress.completedLevels.length;
  }

  // === Reward helpers ===

  /**
   * Check if a gift card milestone has been reached and not yet claimed.
   * Returns the milestone number if eligible, null otherwise.
   */
  checkGiftCardEligibility() {
    const completedCount = this.getCompletedLevelCount();
    const claimed = this.state.rewards.claimedMilestones;
    
    // Check every 5th level
    for (let m = 5; m <= completedCount; m += 5) {
      if (!claimed.includes(m)) {
        return m;
      }
    }
    return null;
  }

  claimGiftCard(milestone, cardData) {
    const rewards = this.state.rewards;
    
    // Prevent duplicate claims
    if (rewards.claimedMilestones.includes(milestone)) {
      return false;
    }

    rewards.claimedMilestones.push(milestone);
    rewards.giftCards.push({
      ...cardData,
      milestone,
      earnedAt: new Date().toISOString(),
    });

    this.save();
    this.notify('rewards');
    return true;
  }

  addBadge(badge) {
    if (!this.state.rewards.badges.find(b => b.id === badge.id)) {
      this.state.rewards.badges.push({
        ...badge,
        earnedAt: new Date().toISOString(),
      });
      this.save();
      this.notify('rewards');
    }
  }

  // === Reset / Clear ===

  reset() {
    this.state = structuredClone(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    this.notify('');
  }

  /** Alias for reset — used by new modules */
  clear() { this.reset(); }
}

export const store = new Store();
