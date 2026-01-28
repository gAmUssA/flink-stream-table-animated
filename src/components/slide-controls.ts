import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('slide-controls')
export class SlideControls extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
    
    :host([visible]) {
      display: flex;
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
      gap: 20px;
      z-index: 1000;
      
      /* Glassmorphism */
      background: rgba(15, 15, 35, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 14px 28px;
      border-radius: 60px;
      border: 1px solid rgba(129, 140, 248, 0.3);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 60px rgba(79, 70, 229, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      
      /* Auto-hide animation */
      opacity: 1;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    :host([visible][hidden-controls]) {
      opacity: 0;
      pointer-events: none;
      transform: translateX(-50%) translateY(20px);
    }
    
    button {
      width: 52px;
      height: 52px;
      border: none;
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 
        0 4px 15px rgba(79, 70, 229, 0.4),
        0 0 20px rgba(79, 70, 229, 0.2);
      position: relative;
      overflow: hidden;
    }
    
    /* Glow ring effect */
    button::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: linear-gradient(135deg, #818CF8, #F97316, #818CF8);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
    }
    
    button:hover:not(:disabled)::before {
      opacity: 1;
      animation: rotate-glow 2s linear infinite;
    }
    
    @keyframes rotate-glow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    button:hover:not(:disabled) {
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      transform: scale(1.15);
      box-shadow: 
        0 6px 25px rgba(99, 102, 241, 0.5),
        0 0 40px rgba(139, 92, 246, 0.3);
    }
    
    button:active:not(:disabled) {
      transform: scale(0.95);
      box-shadow: 
        0 2px 10px rgba(79, 70, 229, 0.4),
        inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    button:disabled {
      opacity: 0.25;
      cursor: not-allowed;
      background: rgba(100, 100, 120, 0.5);
      box-shadow: none;
    }
    
    button:focus-visible {
      outline: 3px solid #F97316;
      outline-offset: 4px;
    }
    
    .progress {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 700;
      min-width: 70px;
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
      text-shadow: 0 0 10px rgba(129, 140, 248, 0.5);
      letter-spacing: 2px;
    }
    
    .arrow {
      display: inline-block;
      line-height: 1;
      font-weight: bold;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
    }
    
    @media (prefers-reduced-motion: reduce) {
      button:hover:not(:disabled) {
        transform: none;
      }
      button::before {
        animation: none;
      }
      :host([visible]) {
        transition: opacity 0.2s ease;
      }
    }
    
    @media (max-width: 768px) {
      :host([visible]) {
        bottom: 20px;
        padding: 10px 20px;
        gap: 14px;
      }
      
      button {
        width: 44px;
        height: 44px;
        font-size: 1.2rem;
      }
      
      .progress {
        font-size: 0.95rem;
        min-width: 55px;
      }
    }
  `;

  @property({ type: Number })
  current = 0;

  @property({ type: Number })
  total = 0;

  @property({ type: Boolean, reflect: true })
  visible = false;

  @property({ type: Boolean, reflect: true, attribute: 'hidden-controls' })
  hiddenControls = false;

  @state()
  private _hideTimeout: number | null = null;

  @state()
  private _isHovering = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this._handleMouseEnter);
    this.addEventListener('mouseleave', this._handleMouseLeave);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this._handleMouseEnter);
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    this._clearHideTimeout();
  }

  private _handleMouseEnter = (): void => {
    this._isHovering = true;
    this._clearHideTimeout();
    this.hiddenControls = false;
  };

  private _handleMouseLeave = (): void => {
    this._isHovering = false;
    this._startHideTimeout();
  };

  private _clearHideTimeout(): void {
    if (this._hideTimeout !== null) {
      window.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }
  }

  private _startHideTimeout(): void {
    this._clearHideTimeout();
    this._hideTimeout = window.setTimeout(() => {
      if (!this._isHovering) {
        this.hiddenControls = true;
      }
    }, 3000);
  }

  public showControls(): void {
    this.hiddenControls = false;
    this._startHideTimeout();
  }

  private _emitNavigate(direction: 'prev' | 'next'): void {
    this.dispatchEvent(new CustomEvent('slide-navigate', {
      detail: { direction },
      bubbles: true,
      composed: true
    }));
    // Reset hide timeout on navigation
    this._startHideTimeout();
  }

  override render() {
    const isFirst = this.current <= 0;
    const isLast = this.current >= this.total - 1;

    return html`
      <button
        @click=${() => this._emitNavigate('prev')}
        ?disabled=${isFirst}
        title="Previous slide (←)"
        aria-label="Previous slide"
      >
        <span class="arrow">←</span>
      </button>
      
      <span class="progress" aria-live="polite">
        ${this.current + 1} / ${this.total}
      </span>
      
      <button
        @click=${() => this._emitNavigate('next')}
        ?disabled=${isLast}
        title="Next slide (→)"
        aria-label="Next slide"
      >
        <span class="arrow">→</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'slide-controls': SlideControls;
  }
}
