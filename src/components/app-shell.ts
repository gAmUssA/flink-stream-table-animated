import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './theme-toggle.js';
import './nav-bar.js';
import './slide-controls.js';
import './ide-window.js';
import './changelog-entry.js';
import './sections/core-concept.js';
import './sections/stream-to-table.js';
import './sections/table-to-stream.js';
import './sections/changelog-types.js';
import './sections/live-aggregation.js';
import './sections/code-examples.js';

const TOTAL_SECTIONS = 6;

@customElement('app-shell')
export class AppShell extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @state()
  private activeSection = 0;

  private _boundKeyHandler: ((e: KeyboardEvent) => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._boundKeyHandler = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);
    
    // Handle initial hash routing
    this._handleInitialHash();
    window.addEventListener('hashchange', () => this._handleInitialHash());
  }

  private _handleInitialHash(): void {
    const hash = window.location.hash.slice(1);
    const hashes = ['concept', 'stream-to-table', 'table-to-stream', 'stream-types', 'live-aggregation', 'code-examples'];
    const index = hashes.indexOf(hash);
    if (index >= 0) {
      this.activeSection = index;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
    }
  }

  private _handleKeydown(e: KeyboardEvent): void {
    // Ignore if user is typing in an input or contenteditable
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)) {
      return;
    }

    // Number keys 1-6: Jump to specific section (works in any mode)
    if (e.key >= '1' && e.key <= '6') {
      const sectionIndex = parseInt(e.key, 10) - 1;
      if (sectionIndex < TOTAL_SECTIONS) {
        e.preventDefault();
        this._navigateToSection(sectionIndex);
      }
      return;
    }

    // Home/End: Jump to first/last section (works in any mode)
    if (e.key === 'Home') {
      e.preventDefault();
      this._navigateToSection(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      this._navigateToSection(TOTAL_SECTIONS - 1);
      return;
    }

    // Arrow keys: Sequential navigation (works in any mode)
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this._navigateNext();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this._navigatePrev();
      return;
    }

    // Additional navigation keys (Space, PageDown, PageUp)
    switch (e.key) {
      case ' ':
      case 'PageDown':
        e.preventDefault();
        this._navigateNext();
        break;
      case 'PageUp':
        e.preventDefault();
        this._navigatePrev();
        break;
    }
  }

  private _navigateToSection(index: number): void {
    if (index >= 0 && index < TOTAL_SECTIONS) {
      this.activeSection = index;
      this._updateUrlHash(index);
      this._showUIElements();
    }
  }

  private _updateUrlHash(index: number): void {
    const hashes = ['concept', 'stream-to-table', 'table-to-stream', 'stream-types', 'live-aggregation', 'code-examples'];
    if (index >= 0 && index < hashes.length) {
      window.location.hash = hashes[index];
    }
  }

  private _navigateNext(): void {
    if (this.activeSection < TOTAL_SECTIONS - 1) {
      this.activeSection++;
      this._updateUrlHash(this.activeSection);
      this._showUIElements();
    }
  }

  private _navigatePrev(): void {
    if (this.activeSection > 0) {
      this.activeSection--;
      this._updateUrlHash(this.activeSection);
      this._showUIElements();
    }
  }

  private _showUIElements(): void {
    // Show slide controls
    const controls = this.querySelector('slide-controls') as any;
    if (controls?.showControls) {
      controls.showControls();
    }
  }

  private handleSectionChange(e: CustomEvent<{ index: number }>): void {
    this.activeSection = e.detail.index;
  }

  private handleSlideNavigate(e: CustomEvent<{ direction: 'prev' | 'next' }>): void {
    if (e.detail.direction === 'next') {
      this._navigateNext();
    } else {
      this._navigatePrev();
    }
  }

  override render() {
    return html`
      <div class="container">
        <header class="header">
          <div class="header-content">
            <h1>Flink SQL &amp; Table API</h1>
            <p>Interactive Tutorial: Dynamic Tables and Changelog Streams</p>
          </div>
          <theme-toggle></theme-toggle>
        </header>

        <nav-bar
          @section-change=${this.handleSectionChange}
        ></nav-bar>

        <div class="content">
          <div id="section-0" class="demo-section ${this.activeSection === 0 ? 'active' : ''}">
            <section-core-concept></section-core-concept>
          </div>
          <div id="section-1" class="demo-section ${this.activeSection === 1 ? 'active' : ''}">
            <section-stream-to-table></section-stream-to-table>
          </div>
          <div id="section-2" class="demo-section ${this.activeSection === 2 ? 'active' : ''}">
            <section-table-to-stream></section-table-to-stream>
          </div>
          <div id="section-3" class="demo-section ${this.activeSection === 3 ? 'active' : ''}">
            <section-changelog-types></section-changelog-types>
          </div>
          <div id="section-4" class="demo-section ${this.activeSection === 4 ? 'active' : ''}">
            <section-live-aggregation></section-live-aggregation>
          </div>
          <div id="section-5" class="demo-section ${this.activeSection === 5 ? 'active' : ''}">
            <section-code-examples></section-code-examples>
          </div>
        </div>

        <slide-controls
          .current=${this.activeSection}
          .total=${TOTAL_SECTIONS}
          visible
          @slide-navigate=${this.handleSlideNavigate}
        ></slide-controls>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShell;
  }
}
