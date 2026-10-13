/**
 * LearnQuest — Sound Engine
 * 
 * Generates original sound effects using the Web Audio API.
 * No external audio files required — all sounds are synthesized programmatically.
 * 
 * All sounds are original creations for this project.
 */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.volume = 0.4;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
      this.enabled = false;
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
  }

  toggleMute() {
    this.enabled = !this.enabled;
    this.musicEnabled = this.enabled;
    return this.enabled;
  }

  /** Play a note with given frequency, duration, and waveform */
  playNote(freq, duration = 0.15, type = 'sine', vol = this.volume, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();

    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  /** Play a sequence of notes */
  playMelody(notes) {
    if (!this.enabled) return;
    let time = 0;
    notes.forEach(([freq, dur, type]) => {
      this.playNote(freq, dur || 0.15, type || 'sine', this.volume, time);
      time += (dur || 0.15) * 0.7;
    });
  }

  /** Play white noise burst (used for transitions) */
  playNoise(duration = 0.1, vol = 0.05) {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * vol;
    }

    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    src.buffer = buffer;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    src.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
  }

  // === Sound Effect Library ===

  /** Button click sound */
  click() {
    this.playNote(800, 0.06, 'sine', 0.15);
  }

  /** Navigation transition */
  navigate() {
    this.playMelody([
      [523, 0.08, 'sine'],
      [659, 0.08, 'sine'],
    ]);
  }

  /** Start adventure fanfare */
  startAdventure() {
    this.playMelody([
      [523, 0.15, 'square'],  // C
      [659, 0.15, 'square'],  // E
      [784, 0.15, 'square'],  // G
      [1047, 0.3, 'square'],  // C high
    ]);
  }

  /** Character footstep */
  footstep() {
    this.playNote(200 + Math.random() * 50, 0.05, 'triangle', 0.1);
  }

  /** Reach checkpoint */
  checkpoint() {
    this.playMelody([
      [660, 0.1, 'sine'],
      [880, 0.12, 'sine'],
    ]);
  }

  /** Select answer option */
  selectOption() {
    this.playNote(600, 0.06, 'sine', 0.12);
  }

  /** Correct answer celebration */
  correct() {
    this.playMelody([
      [523, 0.1, 'square'],
      [659, 0.1, 'square'],
      [784, 0.1, 'square'],
      [1047, 0.2, 'sine'],
    ]);
  }

  /** Wrong answer gentle feedback */
  incorrect() {
    this.playMelody([
      [350, 0.15, 'sine'],
      [300, 0.2, 'sine'],
    ]);
  }

  /** Hint reveal */
  hint() {
    this.playMelody([
      [440, 0.1, 'triangle'],
      [554, 0.1, 'triangle'],
      [440, 0.1, 'triangle'],
    ]);
  }

  /** Level unlock */
  levelUnlock() {
    this.playMelody([
      [392, 0.12, 'square'],
      [494, 0.12, 'square'],
      [587, 0.12, 'square'],
      [784, 0.25, 'sine'],
    ]);
  }

  /** Level complete - bigger celebration */
  levelComplete() {
    this.playMelody([
      [523, 0.12, 'square'],
      [587, 0.12, 'square'],
      [659, 0.12, 'square'],
      [784, 0.12, 'square'],
      [880, 0.12, 'square'],
      [1047, 0.35, 'sine'],
    ]);
  }

  /** XP earned ding */
  xpEarn() {
    this.playNote(1200, 0.08, 'sine', 0.2);
    this.playNote(1600, 0.12, 'sine', 0.15, 0.05);
  }

  /** Treasure chest opening */
  treasureOpen() {
    this.playMelody([
      [400, 0.1, 'triangle'],
      [500, 0.1, 'triangle'],
      [600, 0.1, 'triangle'],
      [800, 0.15, 'triangle'],
      [1000, 0.15, 'sine'],
      [1200, 0.3, 'sine'],
    ]);
  }

  /** Gift card reveal */
  giftCardReveal() {
    this.playMelody([
      [523, 0.15, 'sine'],
      [659, 0.15, 'sine'],
      [784, 0.15, 'sine'],
      [1047, 0.15, 'sine'],
      [1319, 0.3, 'sine'],
    ]);
    // Add shimmer
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        this.playNote(1500 + Math.random() * 1000, 0.1, 'sine', 0.05, i * 0.05);
      }
    }, 300);
  }

  /** Unit completion grand fanfare */
  unitComplete() {
    this.playMelody([
      [392, 0.1, 'square'],
      [494, 0.1, 'square'],
      [587, 0.1, 'square'],
      [784, 0.15, 'square'],
      [784, 0.1, 'sine'],
      [880, 0.1, 'sine'],
      [1047, 0.1, 'sine'],
      [1319, 0.4, 'sine'],
    ]);
  }

  /** Error / invalid action */
  error() {
    this.playNote(200, 0.15, 'sawtooth', 0.1);
  }

  /** Badge earned */
  badge() {
    this.playMelody([
      [880, 0.08, 'sine'],
      [1047, 0.08, 'sine'],
      [1319, 0.15, 'sine'],
    ]);
  }
  /** Lane switch whoosh/tone */
  laneSwitch() {
    this.playNote(520, 0.05, 'triangle', 0.12);
  }

  /** Gem pickup sparkle */
  gemPickup() {
    this.playMelody([
      [988, 0.08, 'sine'],
      [1319, 0.12, 'sine'],
    ]);
  }

  /** Powerup activation chime */
  powerup() {
    this.playMelody([
      [523, 0.08, 'sine'],
      [659, 0.08, 'sine'],
      [784, 0.1, 'triangle'],
      [1047, 0.2, 'sine'],
    ]);
  }

  /** Dodge hazard whoosh */
  dodge() {
    this.playNote(680, 0.06, 'sine', 0.14);
  }

  /** Generic play dispatcher — maps string name to method */
  play(name) {
    const map = {
      click:        () => this.click(),
      navigate:     () => this.navigate(),
      start:        () => this.startAdventure(),
      correct:      () => this.correct(),
      incorrect:    () => this.incorrect(),
      hint:         () => this.hint(),
      levelComplete:() => this.levelComplete(),
      reward:       () => this.giftCardReveal(),
      chestOpen:    () => this.treasureOpen(),
      xp:           () => this.xpEarn(),
      badge:        () => this.badge(),
      error:        () => this.error(),
      checkpoint:   () => this.checkpoint(),
      laneSwitch:   () => this.laneSwitch(),
      star:         () => this.click(),
      gem:          () => this.gemPickup(),
      powerup:      () => this.powerup(),
      dodge:        () => this.dodge(),
    };
    try { map[name]?.(); } catch {}
  }

  /** Muted state getter */
  get muted() { return !this.enabled; }

  /** Explicit mute/unmute */
  mute()   { this.enabled = false; }
  unmute() { this.enabled = true;  }
}

// Singleton
export const soundEngine = new SoundEngine();
