import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface NavItem {
  icon: string;
  label: string;
  hash: string;
}

const defaultNavItems: NavItem[] = [
  { icon: '◈', label: 'Core Concept', hash: 'concept' },
  { icon: '↓', label: 'Stream → Table', hash: 'stream-to-table' },
  { icon: '↑', label: 'Table → Stream', hash: 'table-to-stream' },
  { icon: '±', label: 'Changelog Types', hash: 'stream-types' },
  { icon: '▶', label: 'Live SQL', hash: 'live-aggregation' },
  { icon: '{ }', label: 'Code Examples', hash: 'code-examples' },
];

@customElement('nav-bar')
export class NavBar extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @property({ type: Array })
  items: NavItem[] = defaultNavItems;

  @property({ type: Number })
  activeIndex = 0;

  private boundHashChange = this.handleHashChange.bind(this);

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('hashchange', this.boundHashChange);
    // Defer initial hash check to avoid update-during-update warning
    requestAnimationFrame(() => this.handleHashChange());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.boundHashChange);
  }

  private handleHashChange(): void {
    const hash = window.location.hash.slice(1);
    const index = this.items.findIndex(item => item.hash === hash);
    if (index !== -1) {
      this.activeIndex = index;
    } else if (!hash) {
      this.activeIndex = 0;
    }
    this.dispatchEvent(new CustomEvent('section-change', {
      detail: { index: this.activeIndex },
      bubbles: true,
      composed: true
    }));
  }

  private handleClick(index: number): void {
    this.activeIndex = index;
    window.location.hash = this.items[index].hash;
    this.dispatchEvent(new CustomEvent('section-change', {
      detail: { index },
      bubbles: true,
      composed: true
    }));
  }

  override render() {
    return html`
      <div class="navigation">
        ${this.items.map((item, index) => html`
          <button
            class="nav-btn ${index === this.activeIndex ? 'active' : ''}"
            @click=${() => this.handleClick(index)}
          >
            <span class="nav-btn-icon">${item.icon}</span>
            ${item.label}
          </button>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nav-bar': NavBar;
  }
}
