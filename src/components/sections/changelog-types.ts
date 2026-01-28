import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

type PanelId = 'insert' | 'retract' | 'upsert' | 'upsert-source';

@customElement('section-changelog-types')
export class SectionChangelogTypes extends LitElement {
  override createRenderRoot() { return this; }

  @state()
  private expandedPanels: Set<PanelId> = new Set(['insert', 'retract', 'upsert', 'upsert-source']);

  private togglePanel(panelId: PanelId) {
    const newSet = new Set(this.expandedPanels);
    if (newSet.has(panelId)) {
      newSet.delete(panelId);
    } else {
      newSet.add(panelId);
    }
    this.expandedPanels = newSet;
  }

  private isPanelExpanded(panelId: PanelId): boolean {
    return this.expandedPanels.has(panelId);
  }

  // Styles in theme.css
  private _unused = `
    :host { display: block; }

    .section-title {
      font-size: 1.5em;
      color: var(--text-heading);
      margin-bottom: 20px;
      text-align: center;
      font-weight: 700;
    }

    .description {
      background: var(--bg-tertiary);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
      font-size: 0.95em;
      color: var(--text-secondary);
      text-align: center;
      border: 1px solid var(--border-primary);
    }

    .visualization {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      padding: 30px;
    }

    .stream-types-grid {
      display: grid;
      gap: 20px;
    }

    .stream-type-card {
      background: var(--ide-bg);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--ide-border);
    }

    .stream-type-header {
      display: flex;
      align-items: center;
      background: var(--ide-tab-bg);
      padding: 10px 14px;
      border-bottom: 1px solid var(--ide-border);
      gap: 12px;
    }

    .stream-type-header .buttons {
      display: flex;
      gap: 6px;
    }

    .stream-type-header .window-btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      padding: 0;
    }

    .stream-type-header .window-btn.close { background: #ff5f56; }
    .stream-type-header .window-btn.minimize { background: #ffbd2e; }
    .stream-type-header .window-btn.maximize { background: #27c93f; }

    .stream-type-header .title {
      flex: 1;
      text-align: center;
      font-size: 0.8em;
      color: var(--ide-text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .stream-type-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 600px) {
      .stream-type-content {
        grid-template-columns: 1fr;
      }
    }

    .code-panel {
      padding: 16px;
      background: var(--bg-code);
      border-right: 1px solid var(--bg-code-border);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      line-height: 1.6;
    }

    .code-line {
      white-space: pre;
      color: var(--code-text);
    }

    .keyword { color: var(--code-keyword); }
    .function { color: var(--code-function); }

    .output-panel {
      padding: 16px;
      background: var(--bg-code);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
    }

    .output-line {
      margin: 4px 0;
    }

    .insert-color { color: var(--legend-insert); }
    .update-before-color { color: var(--legend-update-before); }
    .update-after-color { color: var(--legend-update-after); }
    .delete-color { color: #f85149; }

    .stream-type-footer {
      padding: 12px 16px;
      font-size: 0.85em;
      border-top: 1px solid var(--ide-border);
    }

    .stream-type-footer strong {
      font-weight: 600;
    }

    .footer-insert {
      background: var(--stream-insert-bg);
      color: var(--stream-insert-heading);
    }

    .footer-retract {
      background: var(--stream-retract-bg);
      color: var(--stream-retract-heading);
    }

    .footer-upsert {
      background: var(--stream-upsert-bg);
      color: var(--stream-upsert-heading);
    }

    .info-box {
      background: var(--info-bg);
      border-left: 3px solid var(--info-border);
      padding: 12px 16px;
      margin-top: 25px;
      border-radius: 6px;
      font-size: 0.9em;
      color: var(--text-secondary);
    }

    .info-box strong {
      color: var(--info-text);
    }
  `;

  override render() {
    return html`
      <h2 class="section-title">Changelog Modes</h2>
      <div class="description">
        Flink SQL automatically determines the changelog mode based on your query semantics.
      </div>

      <div class="visualization">
        <div class="stream-types-grid">
          <!-- Insert-Only -->
          <div class="stream-type-card">
            <div class="stream-type-header collapsible-header" @click=${() => this.togglePanel('insert')}>
              <div class="buttons">
                <span class="window-btn close"></span>
                <span class="window-btn minimize"></span>
                <span class="window-btn maximize"></span>
              </div>
              <span class="title">Insert-Only (Append)</span>
              <span class="collapse-icon ${this.isPanelExpanded('insert') ? 'expanded' : ''}">&rsaquo;</span>
            </div>
            <div class="collapsible-content ${this.isPanelExpanded('insert') ? 'expanded' : ''}">
              <div class="collapsible-inner">
                <div class="stream-type-content">
                  <div class="code-panel">
                    <div class="code-line"><span class="keyword">SELECT</span> * <span class="keyword">FROM</span> orders</div>
                    <div class="code-line"><span class="keyword">WHERE</span> amount > 100;</div>
                  </div>
                  <div class="output-panel">
                    <div class="output-line insert-color">+I[Alice, 150]</div>
                    <div class="output-line insert-color">+I[Bob, 200]</div>
                    <div class="output-line insert-color">+I[Alice, 300]</div>
                  </div>
                </div>
                <div class="stream-type-footer footer-insert">
                  <strong>Use Case:</strong> Filters, projections, simple transforms
                </div>
              </div>
            </div>
          </div>

          <!-- Retract -->
          <div class="stream-type-card">
            <div class="stream-type-header collapsible-header" @click=${() => this.togglePanel('retract')}>
              <div class="buttons">
                <span class="window-btn close"></span>
                <span class="window-btn minimize"></span>
                <span class="window-btn maximize"></span>
              </div>
              <span class="title">Retract Stream</span>
              <span class="collapse-icon ${this.isPanelExpanded('retract') ? 'expanded' : ''}">&rsaquo;</span>
            </div>
            <div class="collapsible-content ${this.isPanelExpanded('retract') ? 'expanded' : ''}">
              <div class="collapsible-inner">
                <div class="stream-type-content">
                  <div class="code-panel">
                    <div class="code-line"><span class="keyword">SELECT</span> user_id, <span class="function">SUM</span>(amount)</div>
                    <div class="code-line"><span class="keyword">FROM</span> orders</div>
                    <div class="code-line"><span class="keyword">GROUP BY</span> user_id;</div>
                  </div>
                  <div class="output-panel">
                    <div class="output-line insert-color">+I[Alice, 100]</div>
                    <div class="output-line update-before-color">-U[Alice, 100]</div>
                    <div class="output-line update-after-color">+U[Alice, 300]</div>
                  </div>
                </div>
                <div class="stream-type-footer footer-retract">
                  <strong>Use Case:</strong> Aggregations (SUM, COUNT, AVG)
                </div>
              </div>
            </div>
          </div>

          <!-- Upsert -->
          <div class="stream-type-card">
            <div class="stream-type-header collapsible-header" @click=${() => this.togglePanel('upsert')}>
              <div class="buttons">
                <span class="window-btn close"></span>
                <span class="window-btn minimize"></span>
                <span class="window-btn maximize"></span>
              </div>
              <span class="title">Upsert Stream (with Primary Key)</span>
              <span class="collapse-icon ${this.isPanelExpanded('upsert') ? 'expanded' : ''}">&rsaquo;</span>
            </div>
            <div class="collapsible-content ${this.isPanelExpanded('upsert') ? 'expanded' : ''}">
              <div class="collapsible-inner">
                <div class="stream-type-content">
                  <div class="code-panel">
                    <div class="code-line"><span class="keyword">INSERT INTO</span> user_totals</div>
                    <div class="code-line"><span class="keyword">SELECT</span> user_id, <span class="function">SUM</span>(amount)</div>
                    <div class="code-line"><span class="keyword">FROM</span> orders</div>
                    <div class="code-line"><span class="keyword">GROUP BY</span> user_id;</div>
                  </div>
                  <div class="output-panel">
                    <div class="output-line insert-color">+I[Alice, 100]</div>
                    <div class="output-line update-after-color">+U[Alice, 300]</div>
                    <div class="output-line delete-color">-D[Bob, 50]</div>
                  </div>
                </div>
                <div class="stream-type-footer footer-upsert">
                  <strong>Use Case:</strong> Sink with primary key, CDC, upsert-kafka connector
                </div>
              </div>
            </div>
          </div>

          <!-- Upsert Source -->
          <div class="stream-type-card">
            <div class="stream-type-header collapsible-header" @click=${() => this.togglePanel('upsert-source')}>
              <div class="buttons">
                <span class="window-btn close"></span>
                <span class="window-btn minimize"></span>
                <span class="window-btn maximize"></span>
              </div>
              <span class="title">Upsert Source (Compacted Topic)</span>
              <span class="collapse-icon ${this.isPanelExpanded('upsert-source') ? 'expanded' : ''}">&rsaquo;</span>
            </div>
            <div class="collapsible-content ${this.isPanelExpanded('upsert-source') ? 'expanded' : ''}">
              <div class="collapsible-inner">
                <div class="stream-type-content">
                  <div class="code-panel">
                    <div class="code-line"><span class="keyword">CREATE TABLE</span> users (</div>
                    <div class="code-line">  user_id <span class="function">STRING</span>,</div>
                    <div class="code-line">  product <span class="function">STRING</span>,</div>
                    <div class="code-line">  <span class="keyword">PRIMARY KEY</span> (user_id)</div>
                    <div class="code-line">) <span class="keyword">WITH</span> (</div>
                    <div class="code-line">  <span class="string">'connector'</span> = <span class="string">'upsert-kafka'</span></div>
                    <div class="code-line">);</div>
                  </div>
                  <div class="output-panel">
                    <div class="output-line comment-color">-- Kafka messages:</div>
                    <div class="output-line muted-color">{Alice, Laptop}</div>
                    <div class="output-line muted-color">{Bob, Mouse}</div>
                    <div class="output-line muted-color">{Alice, Keyboard}</div>
                    <div class="output-line muted-color">{Bob, null}</div>
                    <div class="output-line comment-color">-- Changelog:</div>
                    <div class="output-line insert-color">+I[Alice, Laptop]</div>
                    <div class="output-line insert-color">+I[Bob, Mouse]</div>
                    <div class="output-line update-after-color">+U[Alice, Keyboard]</div>
                    <div class="output-line delete-color">-D[Bob, null]</div>
                  </div>
                </div>
                <div class="stream-type-footer footer-upsert">
                  <strong>Use Case:</strong> Compacted Kafka topics as source - same key replaces previous value (+U), tombstones produce deletes (-D)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-box">
          <strong>Automatic Mode Selection:</strong> Flink determines the changelog mode from your query. 
          Sinks with primary keys enable upsert mode; otherwise retract mode is used for aggregations.
        </div>

        <div class="docs-links">
          <strong>Learn More:</strong>
          <div class="docs-links-list">
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/docs/connectors/table/upsert-kafka/" target="_blank" rel="noopener">Upsert Kafka Connector</a>
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/docs/dev/table/concepts/dynamic_tables/#table-to-stream-conversion" target="_blank" rel="noopener">Table-to-Stream Conversion</a>
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/api/java/org/apache/flink/types/RowKind.html" target="_blank" rel="noopener">RowKind API</a>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-changelog-types': SectionChangelogTypes;
  }
}
