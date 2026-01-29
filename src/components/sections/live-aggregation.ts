import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface AggRow {
  user: string;
  total: number;
  count: number;
}

const demoEvents = [
  { user: 'Alice', amount: 100 },
  { user: 'Bob', amount: 50 },
  { user: 'Alice', amount: 200 },
  { user: 'Charlie', amount: 150 },
  { user: 'Bob', amount: 100 },
  { user: 'Alice', amount: 50 },
  { user: 'Diana', amount: 80 },
  { user: 'Charlie', amount: 200 },
  { user: 'Bob', amount: 75 },
  { user: 'Diana', amount: 120 }
];

@customElement('section-live-aggregation')
export class SectionLiveAggregation extends LitElement {
  override createRenderRoot() { return this; }

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

    .controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 30px;
    }

    .btn {
      padding: 10px 24px;
      font-size: 0.95em;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
      min-height: 44px;
    }

    .btn-primary { background: var(--accent-primary); color: white; }
    .btn-primary:hover { background: var(--accent-hover); }
    .btn-secondary { background: var(--border-secondary); color: var(--text-label); border: 1px solid var(--border-primary); }
    .btn-secondary:hover { background: var(--border-primary); }

    .visualization {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      padding: 30px;
    }

    .split-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .split-view { grid-template-columns: 1fr; }
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
      min-width: 40px;
      background: var(--bg-code);
      border-right: 1px solid var(--bg-code-border);
    }

    .ide-line-number {
      padding: 0 12px;
      color: var(--ide-text-muted);
      font-size: 0.85em;
    }

    .ide-code-content {
      flex: 1;
      padding: 16px;
    }

    .ide-code-line {
      white-space: pre;
      color: var(--code-text);
    }

    .keyword { color: var(--code-keyword); }
    .function { color: var(--code-function); }
    .comment { color: var(--code-comment); }

    .stream-events {
      padding: 15px;
      background: var(--bg-code);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      max-height: 180px;
      overflow-y: auto;
    }

    .stream-event {
      padding: 8px 12px;
      margin: 4px 0;
      background: var(--ide-bg-secondary);
      border-radius: 4px;
      border: 1px solid var(--ide-border);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .event-label { color: var(--color-insert-badge); margin-right: 10px; }
    .event-data { color: var(--code-text); }

    .table-container { background: var(--bg-secondary); }
    table { width: 100%; border-collapse: collapse; }
    th { background: var(--accent-primary); color: white; padding: 14px 16px; text-align: left; font-weight: 500; font-size: 0.9em; }
    td { padding: 12px 16px; border-bottom: 1px solid var(--border-secondary); font-size: 0.95em; color: var(--text-primary); }
    tr:nth-child(even) { background: var(--bg-tertiary); }

    .row-update { animation: rowUpdate 0.5s; background: var(--color-update) !important; }
    @keyframes rowUpdate { from { background: var(--color-update-flash); } to { background: var(--color-update); } }

    .row-insert { animation: rowInsert 0.5s; background: var(--color-insert) !important; }
    @keyframes rowInsert { from { background: var(--color-insert-flash); } to { background: var(--color-insert); } }

    .info-box {
      background: var(--info-bg);
      border-left: 3px solid var(--info-border);
      padding: 12px 16px;
      margin-top: 20px;
      border-radius: 6px;
      font-size: 0.9em;
      color: var(--text-secondary);
    }

    .info-box strong { color: var(--info-text); }
  `;

  @state() private events: Array<{ user: string; amount: number }> = [];
  @state() private aggData: Map<string, AggRow> = new Map();
  @state() private rowAnimations: Map<string, string> = new Map();
  @state() private isRunning = false;
  @state() private isPaused = false;
  private timeouts: number[] = [];
  private currentEventIndex = 0;

  private runDemo(): void {
    if (this.isRunning && !this.isPaused) return;
    
    if (this.isPaused) {
      this.isPaused = false;
      this.continueDemo();
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this.events = [];
    this.aggData = new Map();
    this.rowAnimations = new Map();
    this.currentEventIndex = 0;
    this.continueDemo();
  }

  private continueDemo(): void {
    const remainingEvents = demoEvents.slice(this.currentEventIndex);
    
    remainingEvents.forEach((evt, index) => {
      const actualIndex = this.currentEventIndex + index;
      const timeout = window.setTimeout(() => {
        if (this.isPaused) return;
        
        this.currentEventIndex = actualIndex + 1;
        this.events = [...this.events, evt];
        
        // Auto-scroll Input Stream container
        requestAnimationFrame(() => {
          const inputStream = document.getElementById('agg-input');
          if (inputStream) {
            inputStream.scrollTop = inputStream.scrollHeight;
          }
        });
        
        const existing = this.aggData.get(evt.user);
        if (existing) {
          this.aggData = new Map(this.aggData).set(evt.user, {
            user: evt.user,
            total: existing.total + evt.amount,
            count: existing.count + 1
          });
          this.rowAnimations = new Map(this.rowAnimations).set(evt.user, 'row-update');
        } else {
          this.aggData = new Map(this.aggData).set(evt.user, {
            user: evt.user,
            total: evt.amount,
            count: 1
          });
          this.rowAnimations = new Map(this.rowAnimations).set(evt.user, 'row-insert');
        }
        
        setTimeout(() => {
          if (!this.isPaused) this.rowAnimations = new Map(this.rowAnimations).set(evt.user, '');
        }, 500);
      }, index * 1200);
      this.timeouts.push(timeout);
    });

    const finalTimeout = window.setTimeout(() => { 
      if (!this.isPaused) this.isRunning = false; 
    }, remainingEvents.length * 1200 + 500);
    this.timeouts.push(finalTimeout);
  }

  private pauseDemo(): void {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
  }

  private reset(): void {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    this.events = [];
    this.aggData = new Map();
    this.rowAnimations = new Map();
    this.isRunning = false;
    this.isPaused = false;
    this.currentEventIndex = 0;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.timeouts.forEach(t => clearTimeout(t));
  }

  override render() {
    return html`
      <h2 class="section-title">Live SQL Aggregation</h2>
      <div class="description">
        Watch a continuous SQL query update in real-time as new events arrive.
      </div>

      <div class="visualization">
        <!-- SQL Editor with IDE Toolbar -->
        <div class="ide-window">
          <div class="ide-titlebar">
            <div class="ide-titlebar-buttons">
              <span class="ide-titlebar-btn close"></span>
              <span class="ide-titlebar-btn minimize"></span>
              <span class="ide-titlebar-btn maximize"></span>
            </div>
            <span class="ide-titlebar-title">live_aggregation.sql</span>
          </div>
          <!-- IDE Toolbar with Run/Pause/Reset buttons -->
          <div class="ide-toolbar">
            <div class="ide-toolbar-left">
              <button 
                class="ide-toolbar-btn run ${this.isRunning && !this.isPaused ? 'disabled' : ''}" 
                @click=${this.runDemo}
                title="${this.isPaused ? 'Resume' : 'Start Query'}"
                ?disabled=${this.isRunning && !this.isPaused}
              >
                <span class="ide-toolbar-icon">▶</span>
              </button>
              <button 
                class="ide-toolbar-btn pause ${!this.isRunning || this.isPaused ? 'disabled' : ''}" 
                @click=${this.pauseDemo}
                title="Pause"
                ?disabled=${!this.isRunning || this.isPaused}
              >
                <span class="ide-toolbar-icon">⏸</span>
              </button>
              <button 
                class="ide-toolbar-btn stop" 
                @click=${this.reset}
                title="Reset"
              >
                <span class="ide-toolbar-icon">↻</span>
              </button>
              <span class="ide-toolbar-separator"></span>
              <span class="ide-toolbar-label">live_aggregation.sql</span>
            </div>
            <div class="ide-toolbar-right">
              <span class="ide-toolbar-status ${this.isRunning ? (this.isPaused ? 'paused' : 'running') : 'ready'}">
                ${this.isRunning ? (this.isPaused ? '⏸ Paused' : '● Running') : '○ Ready'}
              </span>
            </div>
          </div>
          <div class="ide-content">
            <div class="ide-editor">
              <div class="ide-line-numbers">
                ${[1,2,3,4].map(n => html`<div class="ide-line-number">${n}</div>`)}
              </div>
              <div class="ide-code-content">
                <div class="ide-code-line"><span class="comment">-- Continuous aggregation query</span></div>
                <div class="ide-code-line"><span class="keyword">SELECT</span> user_id, <span class="function">SUM</span>(amount) <span class="keyword">AS</span> total, <span class="function">COUNT</span>(*) <span class="keyword">AS</span> cnt</div>
                <div class="ide-code-line"><span class="keyword">FROM</span> orders</div>
                <div class="ide-code-line"><span class="keyword">GROUP BY</span> user_id;</div>
              </div>
            </div>
          </div>
        </div>

        <div class="split-view">
          <div>
            <ide-window title="Input Stream (orders)">
              <div id="agg-input" class="stream-events">
                ${this.events.length === 0
                  ? html`<div style="color: var(--ui-muted-text); text-align: center;">Waiting for events...</div>`
                  : this.events.map(e => html`
                      <div class="stream-event">
                        <span class="event-label">+I</span>
                        <span class="event-data">{user: "${e.user}", amount: ${e.amount}}</span>
                      </div>
                    `)
                }
              </div>
            </ide-window>
          </div>
          <div>
            <ide-window title="Query Result (live updating)">
              <div class="table-container">
                <table>
                  <thead><tr><th>user_id</th><th>total</th><th>cnt</th></tr></thead>
                  <tbody id="agg-result-body">
                    ${this.aggData.size === 0
                      ? html`<tr><td colspan="3" style="text-align: center; color: var(--ui-muted-text);">Run to see results</td></tr>`
                      : Array.from(this.aggData.values()).map(row => html`
                          <tr class="${this.rowAnimations.get(row.user) || ''}">
                            <td>${row.user}</td><td>$${row.total}</td><td>${row.count}</td>
                          </tr>
                        `)
                    }
                  </tbody>
                </table>
              </div>
            </ide-window>
          </div>
        </div>

        <div class="info-box">
          <strong>Continuous Query:</strong> The aggregation result updates instantly as each new event arrives.
          In production, this query runs 24/7 with sub-second latency.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-live-aggregation': SectionLiveAggregation;
  }
}
