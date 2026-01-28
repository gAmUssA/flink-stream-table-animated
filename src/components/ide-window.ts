import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ide-window')
export class IdeWindow extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @property({ type: String })
  title = '';

  private _initialized = false;
  private _originalChildren: Node[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this._initialized) {
      // Capture original children before first render
      this._originalChildren = Array.from(this.childNodes);
      this._initialized = true;
    }
  }

  override firstUpdated(): void {
    // Move original children into ide-content
    const content = this.querySelector('.ide-content');
    if (content && this._originalChildren.length > 0) {
      this._originalChildren.forEach(child => {
        content.appendChild(child);
      });
    }
  }

  override render() {
    return html`
      <div class="ide-window">
        <div class="ide-titlebar">
          <div class="ide-titlebar-buttons">
            <span class="ide-titlebar-btn close"></span>
            <span class="ide-titlebar-btn minimize"></span>
            <span class="ide-titlebar-btn maximize"></span>
          </div>
          <span class="ide-titlebar-title">${this.title}</span>
        </div>
        <div class="ide-content"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ide-window': IdeWindow;
  }
}
