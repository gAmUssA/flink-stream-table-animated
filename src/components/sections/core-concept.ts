import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('section-core-concept')
export class SectionCoreConcept extends LitElement {
  override createRenderRoot() { return this; }

  // Styles in theme.css
  private _unused = `
    :host {
      display: block;
    }

    .section-title {
      font-size: 1.5em;
      color: var(--text-heading);
      margin-bottom: 20px;
      text-align: center;
      font-weight: 700;
      letter-spacing: -0.02em;
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
      min-height: 400px;
      margin-bottom: 30px;
    }

    .duality-container {
      padding: 30px;
      text-align: center;
    }

    .duality-box {
      display: inline-block;
      padding: 25px 35px;
      border-radius: 10px;
      margin: 15px;
      border: 1px solid var(--border-primary);
    }

    .stream-box {
      background: var(--feature-stream-bg);
    }

    .stream-box h3 {
      color: var(--feature-stream-heading);
      margin-bottom: 12px;
      font-size: 1.1em;
    }

    .table-box {
      background: var(--feature-table-bg);
    }

    .table-box h3 {
      color: var(--feature-table-heading);
      margin-bottom: 12px;
      font-size: 1.1em;
    }

    .duality-box p {
      color: var(--ui-neutral-text);
      font-size: 0.9em;
    }

    .duality-box code {
      display: block;
      margin-top: 10px;
      font-size: 0.8em;
      color: var(--code-comment);
    }

    .duality-arrow {
      display: inline-block;
      font-size: 2.5em;
      color: var(--ui-duality-arrow);
      margin: 0 25px;
      vertical-align: middle;
    }

    .info-box {
      background: var(--info-bg);
      border-left: 3px solid var(--info-border);
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 6px;
      font-size: 0.9em;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    .info-box strong {
      color: var(--info-text);
      font-weight: 600;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 15px;
      margin-top: 30px;
    }

    .feature-card {
      background: var(--ide-bg);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--ide-border);
    }

    .feature-card-header {
      background: var(--ide-tab-bg);
      padding: 8px 12px;
      font-size: 0.75em;
      color: var(--ide-text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .feature-card-body {
      padding: 15px;
    }

    .feature-card-body p {
      color: var(--ui-neutral-text);
      font-size: 0.9em;
    }

    .ide-editor {
      display: flex;
      background: var(--bg-code);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      line-height: 1.6;
    }

    .ide-line-numbers {
      padding: 16px 0;
      text-align: right;
      user-select: none;
      min-width: 40px;
      background: var(--bg-code);
      border-right: 1px solid var(--bg-code-border);
    }

    .ide-line-number {
      padding: 0 12px;
      color: var(--ide-text-muted);
      font-size: 0.85em;
    }

    .ide-line-number.highlighted {
      background: rgba(255, 255, 255, 0.05);
    }

    .ide-code-content {
      flex: 1;
      padding: 16px;
      overflow-x: auto;
    }

    .ide-code-line {
      white-space: pre;
      color: var(--code-text);
    }

    .ide-code-line.highlighted {
      background: rgba(255, 255, 255, 0.05);
      margin: 0 -16px;
      padding: 0 16px;
    }

    .keyword { color: var(--code-keyword); }
    .string { color: var(--code-string); }
    .function { color: var(--code-function); }
    .comment { color: var(--code-comment); }

    @media (max-width: 768px) {
      .duality-box {
        display: block;
        margin: 15px auto;
        max-width: 280px;
      }

      .duality-arrow {
        display: block;
        margin: 10px auto;
        transform: rotate(90deg);
      }
    }
  `;

  override render() {
    return html`
      <h2 class="section-title">Dynamic Tables &amp; Changelog Streams</h2>
      <div class="description">
        In Flink SQL, a Dynamic Table is the core abstraction. It represents data that changes over time,
        and can be queried continuously using standard SQL.
      </div>

      <div class="visualization">
        <!-- First IDE Window - Duality Visualization -->
        <div class="ide-window">
          <div class="ide-titlebar">
            <div class="ide-titlebar-buttons">
              <span class="ide-titlebar-btn close"></span>
              <span class="ide-titlebar-btn minimize"></span>
              <span class="ide-titlebar-btn maximize"></span>
            </div>
            <span class="ide-titlebar-title">concept.md — Table-Stream Duality</span>
          </div>
          <div class="ide-content">
            <div class="duality-container">
              <div class="duality-box stream-box">
                <h3>CHANGELOG STREAM</h3>
                <p>Sequence of changes</p>
                <code>+I, -U, +U, -D</code>
              </div>
              <span class="duality-arrow">⇄</span>
              <div class="duality-box table-box">
                <h3>DYNAMIC TABLE</h3>
                <p>Queryable snapshot</p>
                <code>SELECT * FROM ...</code>
              </div>
            </div>
          </div>
        </div>

        <!-- Second IDE Window - SQL Example -->
        <div class="ide-window">
          <div class="ide-titlebar">
            <div class="ide-titlebar-buttons">
              <span class="ide-titlebar-btn close"></span>
              <span class="ide-titlebar-btn minimize"></span>
              <span class="ide-titlebar-btn maximize"></span>
            </div>
            <span class="ide-titlebar-title">example.sql</span>
          </div>
          <div class="ide-content">
            <div class="ide-editor">
              <div class="ide-line-numbers">
                <div class="ide-line-number">1</div>
                <div class="ide-line-number">2</div>
                <div class="ide-line-number highlighted">3</div>
                <div class="ide-line-number highlighted">4</div>
                <div class="ide-line-number highlighted">5</div>
              </div>
              <div class="ide-code-content">
                <div class="ide-code-line"><span class="comment">-- Query a dynamic table with standard SQL</span></div>
                <div class="ide-code-line"><span class="comment">-- Results update continuously as data arrives</span></div>
                <div class="ide-code-line highlighted"><span class="keyword">SELECT</span> user_id, <span class="function">SUM</span>(amount) <span class="keyword">AS</span> total</div>
                <div class="ide-code-line highlighted"><span class="keyword">FROM</span> orders</div>
                <div class="ide-code-line highlighted"><span class="keyword">GROUP BY</span> user_id;</div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-box">
          <strong>Key Insight:</strong> Every SQL query on a dynamic table produces a changelog stream.
          Aggregations emit updates (-U, +U), while simple projections emit inserts (+I) only.
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-card-header">SQL Queries</div>
            <div class="feature-card-body">
              <p>Write standard SQL on streaming data</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-header">Table API</div>
            <div class="feature-card-body">
              <p>Fluent Java/Scala/Python API</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-card-header">Unified Batch & Stream</div>
            <div class="feature-card-body">
              <p>Same queries for both modes</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-core-concept': SectionCoreConcept;
  }
}
