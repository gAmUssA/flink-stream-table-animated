import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

const STORAGE_KEY = 'theme-preference';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

type Theme = typeof THEME_LIGHT | typeof THEME_DARK;

@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @state()
  private currentTheme: Theme = THEME_LIGHT;

  override connectedCallback(): void {
    super.connectedCallback();
    this.currentTheme = this.getCurrentTheme();
    this.applyTheme(this.currentTheme);
    this.watchSystemTheme();
  }

  private getCurrentTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === THEME_LIGHT || saved === THEME_DARK) {
        return saved;
      } else if (saved !== null) {
        console.warn(`Invalid theme value "${saved}" found in localStorage. Clearing...`);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('localStorage not available, theme preference will not persist');
    }
    return this.getSystemTheme();
  }

  private getSystemTheme(): Theme {
    if (!window.matchMedia) {
      return THEME_LIGHT;
    }
    try {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return darkModeQuery.matches ? THEME_DARK : THEME_LIGHT;
    } catch {
      return THEME_LIGHT;
    }
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }

  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference to localStorage');
    }
  }

  private toggleTheme(): void {
    const newTheme = this.currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  private watchSystemTheme(): void {
    if (!window.matchMedia) return;

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!saved) {
            const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
            this.applyTheme(newTheme);
          }
        } catch {
          // Ignore localStorage errors
        }
      });
    } catch {
      // Ignore matchMedia errors
    }
  }

  override render() {
    const icon = this.currentTheme === THEME_DARK ? '☀️' : '🌙';
    return html`
      <button
        class="theme-toggle"
        @click=${this.toggleTheme}
        aria-label="Toggle theme"
        id="theme-toggle"
      >
        <span class="theme-icon">${icon}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-toggle': ThemeToggle;
  }
}
