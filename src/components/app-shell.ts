import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './theme-toggle.js';
import './nav-bar.js';
import './ide-window.js';
import './changelog-entry.js';
import './sections/core-concept.js';
import './sections/stream-to-table.js';
import './sections/table-to-stream.js';
import './sections/changelog-types.js';
import './sections/live-aggregation.js';
import './sections/code-examples.js';

@customElement('app-shell')
export class AppShell extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @state()
  private activeSection = 0;

  private handleSectionChange(e: CustomEvent<{ index: number }>): void {
    this.activeSection = e.detail.index;
  }

  override render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>Flink SQL &amp; Table API</h1>
          <p>Interactive Tutorial: Dynamic Tables and Changelog Streams</p>
          <theme-toggle></theme-toggle>
        </div>

        <nav-bar @section-change=${this.handleSectionChange}></nav-bar>

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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShell;
  }
}
