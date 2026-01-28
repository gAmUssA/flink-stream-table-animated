import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

const STORAGE_KEY = 'flink-tutorial-presentation-mode';

@customElement('presentation-toggle')
export class PresentationToggle extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }
    
    button {
      position: absolute;
      top: 12px;
      right: 56px;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      font-size: 1.1em;
      padding: 0;
      color: white;
    }
    
    button:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.05);
    }
    
    button:active {
      transform: scale(0.95);
    }
    
    button:focus-visible {
      outline: 3px solid var(--accent-primary, #0891b2);
      outline-offset: 3px;
    }
    
    :host([active]) button {
      background: var(--pres-cta, #F97316);
      border-color: var(--pres-cta, #F97316);
    }
    
    :host([active]) button:hover {
      background: #ea580c;
    }
    
    .icon {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    
    button:hover .icon {
      transform: scale(1.1);
    }
  `;

  @state()
  private _active = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this._loadPreference();
  }

  private _loadPreference(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      this._active = true;
      this._applyPresentationMode(true);
    }
  }

  private _toggle(): void {
    this._active = !this._active;
    this._applyPresentationMode(this._active);
    localStorage.setItem(STORAGE_KEY, String(this._active));
    
    this.dispatchEvent(new CustomEvent('presentation-change', {
      detail: { active: this._active },
      bubbles: true,
      composed: true
    }));
  }

  private _applyPresentationMode(active: boolean): void {
    if (active) {
      document.documentElement.setAttribute('data-presentation', 'true');
      this.setAttribute('active', '');
    } else {
      document.documentElement.removeAttribute('data-presentation');
      this.removeAttribute('active');
    }
  }

  override render() {
    return html`
      <button
        @click=${this._toggle}
        title=${this._active ? 'Exit presentation mode' : 'Enter presentation mode'}
        aria-label=${this._active ? 'Exit presentation mode' : 'Enter presentation mode'}
        aria-pressed=${this._active}
      >
        <span class="icon">${this._active ? '✕' : '▶'}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'presentation-toggle': PresentationToggle;
  }
}
