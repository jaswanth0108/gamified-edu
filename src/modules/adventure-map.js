/**
 * LearnQuest — Adventure Map v3 (Candy Crush Style)
 *
 * The map uses a tall illustrated background image that the user scrolls
 * vertically. Level nodes are positioned along a winding S-curve path
 * overlaid on top of the image. Clicking a node opens a detail bottom
 * sheet and then launches the runner game.
 */

import { getCurriculum, getLevels, WORLD_THEMES } from './curriculum-data.js';

export class AdventureMap {
  constructor(store, callbacks = {}) {
    this.store     = store;
    this.callbacks = callbacks; // { onLevelSelect }
    this.levels    = [];
  }

  getLevelData(id) { return this.levels.find(l => l.id === id); }

  getNextLevel(currentId) {
    const idx = this.levels.findIndex(l => l.id === currentId);
    return this.levels[idx + 1] || null;
  }

  /* ── Public render ────────────────────────────────────────── */
  render() {
    const profile = this.store.get('profile');
    if (!profile) return;

    const { classNum, subjectId } = profile;
    this.levels = getLevels(classNum, subjectId);

    const progress  = this.store.get('progress') || {};
    const completed = new Set(progress.completedLevels || []);
    const currentId = progress.currentLevelId || this.levels[0]?.id;

    this._buildNodes(this.levels, completed, currentId, profile);
    this._updateHUD(profile, progress);
    this._updateFooter(this.levels, completed, currentId);
    this._scrollToCurrentLevel(currentId);
  }

  /* ── Build level nodes on the map image ───────────────────── */
  _buildNodes(levels, completed, currentId, profile) {
    const wrap  = document.getElementById('map-canvas-wrap');
    const nodes = document.getElementById('map-nodes-layer');
    const svg   = document.getElementById('map-path-svg');
    if (!wrap || !nodes) return;

    const count = levels.length;
    wrap.style.height = ''; // Ensure full-screen responsive height

    // Generate normalized points along the illustrated yellow road
    const pts = this._generatePoints(count);

    // Draw SVG animated road path
    if (svg) this._drawPath(svg, pts);

    // Create level nodes
    nodes.innerHTML = '';
    levels.forEach((lvl, i) => {
      const [nx, ny] = pts[i];
      const state = completed.has(lvl.id) ? 'completed'
                  : lvl.id === currentId   ? 'current'
                  :                          'locked';

      const node = document.createElement('div');
      node.className = `map-level-node map-node-${state}${lvl.isMilestone ? ' map-node-milestone' : ''}`;
      node.id = `map-node-${lvl.id}`;
      node.style.left = `${(nx * 100).toFixed(2)}%`;
      node.style.top  = `${(ny * 100).toFixed(2)}%`;

      const icon = state === 'completed' ? '✅' : state === 'current' ? (i + 1) : '🔒';
      const shortName = lvl.title.length > 18 ? lvl.title.slice(0, 16) + '…' : lvl.title;

      node.innerHTML = `
        ${state === 'current' ? '<div class="map-node-glow"></div>' : ''}
        <div class="map-node-circle">${icon}</div>
        <div class="map-node-label" title="${lvl.title}">${shortName}</div>
        ${lvl.isMilestone && state !== 'completed' ? '<div class="map-node-gift">🎁</div>' : ''}
        ${state === 'current' ? '<div class="map-node-arrow">▼</div>' : ''}
      `;

      if (state !== 'locked') {
        node.style.cursor = 'pointer';
        node.addEventListener('click', () => this._showDetail(lvl, state, profile));
      }
      nodes.appendChild(node);
    });

    if (!this._resizeAttached) {
      window.addEventListener('resize', () => {
        const p = this.store.get('profile');
        if (p && document.getElementById('map-screen')?.classList.contains('active')) {
          this.render();
        }
      });
      this._resizeAttached = true;
    }
  }

  /**
   * Road waypoints normalized across the 1920x1080 landscape map
   * Winding path from meadow bottom-left -> bridge -> village -> windmills -> castle summit.
   */
  _generatePoints(count) {
    const WAYPOINTS = [
      [0.08, 0.88], // 1. Start in bottom-left meadow
      [0.15, 0.77], // 2. Wildflower meadow path
      [0.21, 0.65], // 3. Near wooden signpost
      [0.24, 0.53], // 4. Riverside bend approaching bridge
      [0.34, 0.47], // 5. Stone bridge left entrance
      [0.44, 0.43], // 6. Crest of the stone bridge arch
      [0.54, 0.48], // 7. Stone bridge exit into village
      [0.63, 0.55], // 8. Village market lane
      [0.73, 0.54], // 9. Village square near cottages
      [0.77, 0.46], // 10. Village bend turning toward hill
      [0.68, 0.40], // 11. Green rolling hill ascent
      [0.58, 0.35], // 12. Approaching the colorful windmills
      [0.53, 0.28], // 13. Windmills summit
      [0.66, 0.30], // 14. Mountain foot crossing
      [0.77, 0.26], // 15. Mountain winding road
      [0.84, 0.20], // 16. Mountain ridge switchback
      [0.86, 0.14]  // 17. Royal Castle gates at mountain peak!
    ];

    if (count <= 1) return [[WAYPOINTS[0][0], WAYPOINTS[0][1]]];

    // Compute cumulative distance along the polyline with aspect-ratio weighting
    const dists = [0];
    let totalDist = 0;
    for (let i = 1; i < WAYPOINTS.length; i++) {
      const dx = (WAYPOINTS[i][0] - WAYPOINTS[i-1][0]) * 1.78;
      const dy = WAYPOINTS[i][1] - WAYPOINTS[i-1][1];
      const d = Math.sqrt(dx * dx + dy * dy);
      totalDist += d;
      dists.push(totalDist);
    }

    const pts = [];
    for (let i = 0; i < count; i++) {
      const targetDist = (i / (count - 1)) * totalDist;
      let seg = 0;
      while (seg < dists.length - 1 && dists[seg + 1] < targetDist) {
        seg++;
      }
      const d0 = dists[seg];
      const d1 = dists[seg + 1] || d0;
      const t = d1 > d0 ? (targetDist - d0) / (d1 - d0) : 0;
      const p0 = WAYPOINTS[seg];
      const p1 = WAYPOINTS[Math.min(seg + 1, WAYPOINTS.length - 1)];
      const x = p0[0] + (p1[0] - p0[0]) * t;
      const y = p0[1] + (p1[1] - p0[1]) * t;
      pts.push([x, y]);
    }
    return pts;
  }

  /* ── Draw SVG golden path connecting nodes ────────────────── */
  _drawPath(svg, pts) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('width',  '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top      = '0';
    svg.style.left     = '0';
    svg.style.pointerEvents = 'none';

    if (pts.length < 2) return;

    const scaledPts = pts.map(([x, y]) => [x * 1000, y * 1000]);

    // Build smooth cubic bezier curve
    let d = `M ${scaledPts[0][0].toFixed(1)} ${scaledPts[0][1].toFixed(1)}`;
    for (let i = 1; i < scaledPts.length; i++) {
      const [p0x, p0y] = scaledPts[i - 1];
      const [p1x, p1y] = scaledPts[i];
      const c1x = p0x + (p1x - p0x) * 0.5;
      const c1y = p0y;
      const c2x = p0x + (p1x - p0x) * 0.5;
      const c2y = p1y;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p1x.toFixed(1)} ${p1y.toFixed(1)}`;
    }

    // Glow aura
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('fill', 'none');
    glow.setAttribute('stroke', 'rgba(255, 215, 0, 0.4)');
    glow.setAttribute('stroke-width', '16');
    glow.setAttribute('stroke-linecap', 'round');

    // Main road track
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    track.setAttribute('d', d);
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
    track.setAttribute('stroke-width', '8');
    track.setAttribute('stroke-linecap', 'round');

    // Animated dashed track
    const dots = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    dots.setAttribute('d', d);
    dots.setAttribute('fill', 'none');
    dots.setAttribute('stroke', '#FFD93D');
    dots.setAttribute('stroke-width', '4');
    dots.setAttribute('stroke-dasharray', '8 14');
    dots.setAttribute('stroke-linecap', 'round');

    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anim.setAttribute('attributeName', 'stroke-dashoffset');
    anim.setAttribute('from', '0');
    anim.setAttribute('to', '44');
    anim.setAttribute('dur', '2s');
    anim.setAttribute('repeatCount', 'indefinite');
    dots.appendChild(anim);

    svg.appendChild(glow);
    svg.appendChild(track);
    svg.appendChild(dots);
  }

  /* ── Scroll to current level ──────────────────────────────── */
  _scrollToCurrentLevel(currentId) {
    setTimeout(() => {
      const node   = document.getElementById(`map-node-${currentId}`);
      const scroll = document.getElementById('map-scroll-world');
      if (node && scroll) {
        if (scroll.scrollWidth > scroll.clientWidth || scroll.scrollHeight > scroll.clientHeight) {
          const nodeLeft = node.offsetLeft;
          const nodeTop  = node.offsetTop;
          scroll.scrollTo({
            left: Math.max(0, nodeLeft - scroll.clientWidth / 2),
            top:  Math.max(0, nodeTop - scroll.clientHeight / 2),
            behavior: 'smooth'
          });
        }
      }
    }, 200);
  }

  /* ── Level detail bottom sheet ─────────────────────────────── */
  _showDetail(lvl, state, profile) {
    document.querySelector('.level-detail-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'level-detail-modal';
    modal.innerHTML = `
      <div class="ldm-backdrop"></div>
      <div class="ldm-card" role="dialog" aria-modal="true">
        <button class="ldm-close" aria-label="Close">✕</button>
        <div class="ldm-level-pill" style="background:${lvl.color}22; color:${lvl.color}; border:1px solid ${lvl.color}55;">
          Level ${lvl.levelNumber} • ${lvl.env}
        </div>
        <h2 class="ldm-title">${lvl.title}</h2>
        <p class="ldm-chapter">NCERT Class ${profile.classNum} ${this._fmtSub(profile.subjectId)} • Chapter ${lvl.levelNumber}</p>
        <div class="ldm-info-grid">
          <div class="ldm-info-box">
            <span class="ldm-info-val">5</span>
            <span class="ldm-info-lbl">Questions</span>
          </div>
          <div class="ldm-info-box">
            <span class="ldm-info-val">+50 XP</span>
            <span class="ldm-info-lbl">Reward</span>
          </div>
          <div class="ldm-info-box">
            <span class="ldm-info-val">${state === 'completed' ? '✅ Done' : '▶ Play'}</span>
            <span class="ldm-info-lbl">Status</span>
          </div>
        </div>
        <div class="ldm-objective">
          🎯 <strong>Objective:</strong> Master <em>${lvl.title}</em> through an exciting runner adventure with quiz checkpoints!
        </div>
        ${lvl.isMilestone ? '<div class="ldm-milestone-banner">🎁 Complete to unlock a <strong>Gift Card Reward!</strong></div>' : ''}
        <button class="btn-primary-pill btn-xl ldm-play-btn" ${state === 'locked' ? 'disabled' : ''}>
          ${state === 'completed' ? '🔄 Replay Level' : '🚀 Play Now'}
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.ldm-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('.ldm-backdrop')?.addEventListener('click', () => modal.remove());
    modal.querySelector('.ldm-play-btn')?.addEventListener('click', () => {
      modal.remove();
      this.callbacks.onLevelSelect?.(lvl.id, lvl);
    });
  }

  /* ── HUD ──────────────────────────────────────────────────── */
  _updateHUD(profile, progress) {
    const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    el('hud-xp',   progress.totalXP || 0);
    el('hud-name', profile.nickname || 'Explorer');
    el('hud-class', `Class ${profile.classNum} • ${this._fmtSub(profile.subjectId)}`);

    const av = document.getElementById('hud-avatar');
    if (av) {
      const src = profile.gender === 'girl' ? '/assets/characters/girl-adventurer.jpg' : '/assets/characters/boy-adventurer.jpg';
      av.innerHTML = `<img src="${src}" alt="${profile.nickname}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`;
    }
  }

  /* ── Footer ───────────────────────────────────────────────── */
  _updateFooter(levels, completed, currentId) {
    const curr = levels.find(l => l.id === currentId);
    const el   = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    if (curr) el('footer-chapter-title', `Ch ${curr.levelNumber}: ${curr.title}`);
    const pct = levels.length ? Math.round((completed.size / levels.length) * 100) : 0;
    const fill = document.getElementById('footer-progress-fill');
    if (fill) fill.style.width = pct + '%';
    el('footer-progress-text', `${completed.size}/${levels.length} levels`);
  }

  _fmtSub(id) {
    return { mathematics:'Mathematics', science:'Science', english:'English', 'social-science':'Social Science', hindi:'Hindi' }[id] || id;
  }
}
