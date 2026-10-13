/**
 * LearnQuest — Client-Side Router
 * 
 * Supports hash-based routing (#/path) and path-based routing (/path)
 * ensuring full compatibility with static hosting and single-page apps.
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentParams = {};
    this.beforeHooks = [];
    this.afterHooks = [];

    // Listen to hashchange and popstate events
    window.addEventListener('hashchange', () => this.handleNavigation());
    window.addEventListener('popstate', () => this.handleNavigation());
  }

  /**
   * Register a route handler
   * @param {string} path - e.g. '/', '/onboarding', '/map', '/play/:levelId'
   * @param {Function} handler - callback receiving params
   */
  register(path, handler) {
    // Convert path pattern to regex for param matching
    const paramNames = [];
    const regexPattern = path
      .replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    this.routes.set(path, { regex, paramNames, handler, rawPath: path });
  }

  /** Add middleware hook before route transition */
  beforeEach(hook) {
    this.beforeHooks.push(hook);
  }

  /** Add middleware hook after route transition */
  afterEach(hook) {
    this.afterHooks.push(hook);
  }

  /** Get current path from hash or pathname */
  getPath() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // e.g. '#/map' -> '/map'
      return hash.startsWith('/') ? hash : '/' + hash;
    }
    return window.location.pathname || '/';
  }

  /** Navigate to a new route */
  navigate(path, replace = false) {
    if (replace) {
      window.location.replace(`#${path}`);
    } else {
      window.location.hash = path;
    }
  }

  /** Process current location and execute matching route handler */
  handleNavigation() {
    let path = this.getPath();
    if (!path || path === '') path = '/';

    // Allow before hooks to redirect
    for (const hook of this.beforeHooks) {
      const redirect = hook(path);
      if (redirect && redirect !== path) {
        this.navigate(redirect, true);
        return;
      }
    }

    // Match against registered routes
    for (const [routePattern, route] of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        this.currentRoute = route.rawPath;
        this.currentParams = params;

        try {
          route.handler(params);
        } catch (err) {
          console.error(`Error executing route handler for ${path}:`, err);
        }

        for (const hook of this.afterHooks) {
          hook(path, params);
        }
        return;
      }
    }

    // Fallback: If no route matches, fallback to welcome or map
    console.warn(`No route matched for: ${path}. Falling back to /`);
    this.navigate('/', true);
  }

  /** Start router */
  start() {
    this.handleNavigation();
  }
}

export const router = new Router();
