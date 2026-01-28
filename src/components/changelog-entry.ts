import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ChangelogOperation = 'insert' | 'update-before' | 'update-after' | 'delete';

@customElement('changelog-entry')
export class ChangelogEntry extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @property({ type: String })
  operation: ChangelogOperation = 'insert';

  @property({ type: String })
  data = '';

  private getBadgeText(): string {
    switch (this.operation) {
      case 'insert': return '+I';
      case 'update-before': return '-U';
      case 'update-after': return '+U';
      case 'delete': return '-D';
    }
  }

  private getBadgeClass(): string {
    switch (this.operation) {
      case 'insert': return 'badge-insert';
      case 'update-before':
      case 'update-after': return 'badge-update';
      case 'delete': return 'badge-delete';
    }
  }

  override render() {
    return html`
      <div class="changelog-entry ${this.operation}">
        <span class="badge ${this.getBadgeClass()}">${this.getBadgeText()}</span>${this.data}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'changelog-entry': ChangelogEntry;
  }
}
