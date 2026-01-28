import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface TableState {
  user: string;
  total: number;
  count: number;
  op: 'INSERT' | 'UPDATE';
}

const tableStates: TableState[] = [
  { user: 'Alice', total: 100, count: 1, op: 'INSERT' },
  { user: 'Bob', total: 50, count: 1, op: 'INSERT' },
  { user: 'Alice', total: 300, count: 2, op: 'UPDATE' },
  { user: 'Charlie', total: 200, count: 1, op: 'INSERT' }
];

interface ChangelogItem {
  type: 'insert' | 'update-before' | 'update-after';
  data: string;
}

@customElement('section-table-to-stream')
export class SectionTableToStream extends LitElement {
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

    .table-container { background: var(--bg-secondary); }
    table { width: 100%; border-collapse: collapse; }
    th { background: var(--accent-primary); color: white; padding: 14px 16px; text-align: left; font-weight: 500; font-size: 0.9em; }
    td { padding: 12px 16px; border-bottom: 1px solid var(--border-secondary); font-size: 0.95em; color: var(--text-primary); }
    tr:nth-child(even) { background: var(--bg-tertiary); }

    .row-insert { animation: rowInsert 0.5s; background: var(--color-insert) !important; }
    .row-update { animation: rowUpdate 0.5s; background: var(--color-update) !important; }

    @keyframes rowInsert { from { background: var(--color-insert-flash); } to { background: var(--color-insert); } }
    @keyframes rowUpdate { from { background: var(--color-update-flash); } to { background: var(--color-update); } }

    .changelog {
      padding: 15px;
      max-height: 280px;
      overflow-y: auto;
      background: var(--bg-code);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875em;
    }

    .changelog-entry {
      padding: 10px 14px;
      margin: 6px 0;
      border-radius: 6px;
      animation: slideInFromLeft 0.5s;
      border: 1px solid transparent;
    }

    @keyframes slideInFromLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .insert { background: var(--color-insert); color: var(--color-insert-text); border-color: var(--color-insert-border); }
    .update-before { background: var(--color-update); color: var(--color-update-text); border-color: var(--color-update-border); }
    .update-after { background: var(--color-update-after); color: var(--color-update-after-text); border-color: var(--color-update-after-border); }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: 500;
      margin-right: 8px;
      color: white;
    }
    .badge-insert { background: var(--color-insert-badge); }
    .badge-update { background: var(--color-update-badge); }

    .legend { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
    .legend-item { display: flex; align-items: center; gap: 8px; color: var(--text-primary); }
    .legend-color { width: 20px; height: 20px; border-radius: 4px; }

    .ide-editor { display: flex; background: var(--bg-code); font-family: 'JetBrains Mono', monospace; font-size: 0.85em; line-height: 1.6; }
    .ide-line-numbers { padding: 16px 0; text-align: right; min-width: 40px; background: var(--bg-code); border-right: 1px solid var(--bg-code-border); }
    .ide-line-number { padding: 0 12px; color: var(--ide-text-muted); font-size: 0.85em; }
    .ide-line-number.highlighted { background: rgba(255, 255, 255, 0.05); }
    .ide-code-content { flex: 1; padding: 16px; }
    .ide-code-line { white-space: pre; color: var(--code-text); }
    .ide-code-line.highlighted { background: rgba(255, 255, 255, 0.05); margin: 0 -16px; padding: 0 16px; }
    .keyword { color: var(--code-keyword); }
    .function { color: var(--code-function); }
    .comment { color: var(--code-comment); }
  `;

  @state() private tableData: Map<string, { total: number; count: number }> = new Map();
  @state() private changelog: ChangelogItem[] = [];
  @state() private rowAnimations: Map<string, string> = new Map();
  @state() private isRunning = false;
  @state() private isPaused = false;
  private timeouts: number[] = [];
  private currentStateIndex = 0;

  private runDemo(): void {
    if (this.isRunning && !this.isPaused) return;
    
    if (this.isPaused) {
      this.isPaused = false;
      this.continueDemo();
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this.tableData = new Map();
    this.changelog = [];
    this.rowAnimations = new Map();
    this.currentStateIndex = 0;
    this.continueDemo();
  }

  private continueDemo(): void {
    const remainingStates = tableStates.slice(this.currentStateIndex);
    
    remainingStates.forEach((state, index) => {
      const actualIndex = this.currentStateIndex + index;
      const timeout = window.setTimeout(() => {
        if (this.isPaused) return;
        
        this.currentStateIndex = actualIndex + 1;
        
        if (state.op === 'INSERT') {
          this.tableData = new Map(this.tableData).set(state.user, { total: state.total, count: state.count });
          this.changelog = [...this.changelog, { type: 'insert', data: `[${state.user}, ${state.total}, ${state.count}]` }];
          this.rowAnimations = new Map(this.rowAnimations).set(state.user, 'row-insert');
          setTimeout(() => { 
            if (!this.isPaused) this.rowAnimations = new Map(this.rowAnimations).set(state.user, ''); 
          }, 500);
        } else {
          const old = this.tableData.get(state.user);
          if (old) {
            this.changelog = [...this.changelog, { type: 'update-before', data: `[${state.user}, ${old.total}, ${old.count}]` }];
            this.rowAnimations = new Map(this.rowAnimations).set(state.user, 'row-update');
            setTimeout(() => {
              if (this.isPaused) return;
              this.tableData = new Map(this.tableData).set(state.user, { total: state.total, count: state.count });
              this.changelog = [...this.changelog, { type: 'update-after', data: `[${state.user}, ${state.total}, ${state.count}]` }];
              setTimeout(() => { 
                if (!this.isPaused) this.rowAnimations = new Map(this.rowAnimations).set(state.user, ''); 
              }, 500);
            }, 300);
          }
        }
      }, index * 2000);
      this.timeouts.push(timeout);
    });

    const finalTimeout = window.setTimeout(() => { 
      if (!this.isPaused) this.isRunning = false; 
    }, remainingStates.length * 2000 + 500);
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
    this.tableData = new Map();
    this.changelog = [];
    this.rowAnimations = new Map();
    this.isRunning = false;
    this.isPaused = false;
    this.currentStateIndex = 0;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.timeouts.forEach(t => clearTimeout(t));
  }

  override render() {
    return html`
      <h2 class="section-title">Aggregations &amp; Changelog Output</h2>
      <div class="description">SQL aggregations produce updating results. Each update emits changelog events that downstream systems can consume.</div>

      <div class="visualization">
        <!-- SQL Editor with IDE Toolbar -->
        <div class="ide-window">
          <div class="ide-titlebar">
            <div class="ide-titlebar-buttons">
              <span class="ide-titlebar-btn close"></span>
              <span class="ide-titlebar-btn minimize"></span>
              <span class="ide-titlebar-btn maximize"></span>
            </div>
            <span class="ide-titlebar-title">aggregation.sql</span>
          </div>
          <!-- IDE Toolbar with Run/Pause/Reset buttons -->
          <div class="ide-toolbar">
            <div class="ide-toolbar-left">
              <button 
                class="ide-toolbar-btn run ${this.isRunning && !this.isPaused ? 'disabled' : ''}" 
                @click=${this.runDemo}
                title="${this.isPaused ? 'Resume' : 'Run Query'}"
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
              <span class="ide-toolbar-label">aggregation.sql</span>
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
                <div class="ide-line-number">1</div>
                <div class="ide-line-number highlighted">2</div>
                <div class="ide-line-number highlighted">3</div>
                <div class="ide-line-number highlighted">4</div>
              </div>
              <div class="ide-code-content">
                <div class="ide-code-line"><span class="comment">-- Aggregation produces changelog with updates</span></div>
                <div class="ide-code-line highlighted"><span class="keyword">SELECT</span> user_id, <span class="function">SUM</span>(amount) <span class="keyword">AS</span> total, <span class="function">COUNT</span>(*) <span class="keyword">AS</span> cnt</div>
                <div class="ide-code-line highlighted"><span class="keyword">FROM</span> orders</div>
                <div class="ide-code-line highlighted"><span class="keyword">GROUP BY</span> user_id;</div>
              </div>
            </div>
          </div>
        </div>

        <div class="split-view">
          <div>
            <ide-window title="Result Table (Updating)">
              <div class="table-container">
                <table>
                  <thead><tr><th>user_id</th><th>total</th><th>cnt</th></tr></thead>
                  <tbody>
                    ${this.tableData.size === 0
                      ? html`<tr><td colspan="3" style="text-align: center; color: var(--ui-muted-text);">Run query</td></tr>`
                      : Array.from(this.tableData.entries()).map(([user, data]) => html`
                          <tr class="${this.rowAnimations.get(user) || ''}">
                            <td>${user}</td><td>${data.total}</td><td>${data.count}</td>
                          </tr>
                        `)
                    }
                  </tbody>
                </table>
              </div>
            </ide-window>
          </div>
          <div>
            <ide-window title="Changelog Stream">
              <div class="changelog">
                ${this.changelog.length === 0
                  ? html`<div style="text-align: center; color: var(--ui-muted-text);">Waiting...</div>`
                  : this.changelog.map(entry => html`
                      <div class="changelog-entry ${entry.type}">
                        <span class="badge ${entry.type === 'insert' ? 'badge-insert' : 'badge-update'}">
                          ${entry.type === 'insert' ? '+I' : entry.type === 'update-before' ? '-U' : '+U'}
                        </span>${entry.data}
                      </div>
                    `)
                }
              </div>
            </ide-window>
          </div>
        </div>

        <div class="legend">
          <div class="legend-item"><div class="legend-color" style="background: var(--legend-insert);"></div><span>+I Insert</span></div>
          <div class="legend-item"><div class="legend-color" style="background: var(--legend-update-before);"></div><span>-U Retract</span></div>
          <div class="legend-item"><div class="legend-color" style="background: var(--legend-update-after);"></div><span>+U Update</span></div>
          <div class="legend-item"><div class="legend-color" style="background: var(--legend-delete);"></div><span>-D Delete</span></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-table-to-stream': SectionTableToStream;
  }
}
