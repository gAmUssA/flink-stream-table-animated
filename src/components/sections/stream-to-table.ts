import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface StreamEvent {
  user: string;
  product: string;
  amount: number;
  time: string;
}

const streamEvents: StreamEvent[] = [
  { user: 'Alice', product: 'Laptop', amount: 1000, time: '10:01:15' },
  { user: 'Bob', product: 'Mouse', amount: 50, time: '10:01:18' },
  { user: 'Alice', product: 'Keyboard', amount: 100, time: '10:01:22' },
  { user: 'Charlie', product: 'Monitor', amount: 300, time: '10:01:25' },
  { user: 'Diana', product: 'Webcam', amount: 80, time: '10:01:30' },
  { user: 'Bob', product: 'Headset', amount: 150, time: '10:01:35' },
  { user: 'Eve', product: 'SSD', amount: 200, time: '10:01:40' },
  { user: 'Alice', product: 'USB Hub', amount: 45, time: '10:01:45' },
  { user: 'Charlie', product: 'Mousepad', amount: 25, time: '10:01:50' },
  { user: 'Diana', product: 'Cable', amount: 15, time: '10:01:55' }
];

@customElement('section-stream-to-table')
export class SectionStreamToTable extends LitElement {
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

    .btn-primary {
      background: var(--accent-primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--accent-hover);
    }

    .btn-secondary {
      background: var(--border-secondary);
      color: var(--text-label);
      border: 1px solid var(--border-primary);
    }

    .btn-secondary:hover {
      background: var(--border-primary);
    }

    .visualization {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      padding: 30px;
    }

    .conversion-arrow {
      text-align: center;
      font-size: 3em;
      color: var(--accent-primary);
      margin: 20px 0;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .kafka-messages {
      display: flex;
      flex-direction: column;
      padding: 12px;
      gap: 8px;
      min-height: 120px;
      max-height: 200px;
      overflow-y: auto;
      background: var(--ide-bg-editor);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8em;
    }

    .kafka-message {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      background: var(--ide-bg-secondary);
      border: 1px solid var(--ide-border);
      border-radius: 6px;
      animation: messageSlideIn 0.4s ease-out forwards;
    }

    @keyframes messageSlideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .kafka-message .offset {
      color: var(--ide-text-muted);
      font-size: 0.85em;
      min-width: 60px;
    }

    .kafka-message .payload {
      flex: 1;
      color: var(--ide-code-text);
    }

    .kafka-message .key {
      color: var(--ide-code-keyword);
    }

    .kafka-message .value {
      color: var(--ide-code-string);
    }

    .kafka-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: var(--ide-text-muted);
      font-style: italic;
    }

    .table-container {
      background: var(--bg-secondary);
      border-radius: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: var(--accent-primary);
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-weight: 500;
      font-size: 0.9em;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-secondary);
      font-size: 0.95em;
      color: var(--text-primary);
    }

    tr:nth-child(even) {
      background: var(--bg-tertiary);
    }

    .row-insert {
      animation: rowInsert 0.5s;
      background: var(--color-insert) !important;
    }

    @keyframes rowInsert {
      from { background: var(--color-insert-flash); transform: scale(1.02); }
      to { background: var(--color-insert); transform: scale(1); }
    }

    .info-box {
      background: var(--info-bg);
      border-left: 3px solid var(--info-border);
      padding: 12px 16px;
      margin-top: 20px;
      border-radius: 6px;
      font-size: 0.9em;
      color: var(--text-secondary);
    }

    .info-box strong {
      color: var(--info-text);
    }

    .info-box code {
      background: rgba(0,0,0,0.1);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
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

    .ide-code-content {
      flex: 1;
      padding: 16px;
    }

    .ide-code-line {
      white-space: pre;
      color: var(--code-text);
    }

    .keyword { color: var(--code-keyword); }
    .string { color: var(--code-string); }
    .function { color: var(--code-function); }
  `;

  @state()
  private messages: Array<{ offset: number; event: StreamEvent }> = [];

  @state()
  private tableRows: StreamEvent[] = [];

  @state()
  private isRunning = false;

  @state()
  private isPaused = false;

  private timeouts: number[] = [];
  private currentEventIndex = 0;

  private runDemo(): void {
    if (this.isRunning && !this.isPaused) return;
    
    if (this.isPaused) {
      // Resume from paused state
      this.isPaused = false;
      this.continueDemo();
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this.messages = [];
    this.tableRows = [];
    this.currentEventIndex = 0;
    this.continueDemo();
  }

  private continueDemo(): void {
    const remainingEvents = streamEvents.slice(this.currentEventIndex);
    
    remainingEvents.forEach((event, index) => {
      const actualIndex = this.currentEventIndex + index;
      const timeout = window.setTimeout(() => {
        if (this.isPaused) return;
        
        this.messages = [...this.messages, { offset: actualIndex, event }];
        this.currentEventIndex = actualIndex + 1;
        
        // Auto-scroll Kafka messages container
        requestAnimationFrame(() => {
          const kafkaContainer = document.querySelector('.kafka-messages');
          if (kafkaContainer) {
            kafkaContainer.scrollTop = kafkaContainer.scrollHeight;
          }
        });
        
        const rowTimeout = window.setTimeout(() => {
          if (this.isPaused) return;
          this.tableRows = [...this.tableRows, event];
        }, 400);
        this.timeouts.push(rowTimeout);
      }, index * 1000);
      this.timeouts.push(timeout);
    });

    const finalTimeout = window.setTimeout(() => {
      if (!this.isPaused) {
        this.isRunning = false;
      }
    }, remainingEvents.length * 1000 + 500);
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
    this.messages = [];
    this.tableRows = [];
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
      <h2 class="section-title">Creating Dynamic Tables</h2>
      <div class="description">
        Define a table from a streaming source using SQL DDL. Each incoming event becomes a row in the dynamic table.
      </div>

      <div class="visualization">
        <!-- Kafka Console with IDE Toolbar -->
        <div class="ide-window">
          <div class="ide-titlebar">
            <div class="ide-titlebar-buttons">
              <span class="ide-titlebar-btn close"></span>
              <span class="ide-titlebar-btn minimize"></span>
              <span class="ide-titlebar-btn maximize"></span>
            </div>
            <span class="ide-titlebar-title">kafka-console-consumer --topic orders</span>
          </div>
          <!-- IDE Toolbar with Run/Pause/Reset buttons -->
          <div class="ide-toolbar">
            <div class="ide-toolbar-left">
              <button 
                class="ide-toolbar-btn run ${this.isRunning && !this.isPaused ? 'disabled' : ''}" 
                @click=${this.runDemo}
                title="${this.isPaused ? 'Resume' : 'Run Demo'}"
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
              <span class="ide-toolbar-label">Stream Demo</span>
            </div>
            <div class="ide-toolbar-right">
              <span class="ide-toolbar-status ${this.isRunning ? (this.isPaused ? 'paused' : 'running') : 'ready'}">
                ${this.isRunning ? (this.isPaused ? '⏸ Paused' : '● Running') : '○ Ready'}
              </span>
            </div>
          </div>
          <div class="ide-content">
            <div class="kafka-messages">
            ${this.messages.length === 0 
              ? html`<div class="kafka-empty">Waiting for messages...</div>`
              : this.messages.map(m => html`
                  <div class="kafka-message">
                    <span class="offset">offset: ${m.offset}</span>
                    <span class="payload">
                      {<span class="key">"user"</span>: <span class="value">"${m.event.user}"</span>, 
                      <span class="key">"product"</span>: <span class="value">"${m.event.product}"</span>, 
                      <span class="key">"amount"</span>: ${m.event.amount}}
                    </span>
                  </div>
                `)
            }
            </div>
          </div>
        </div>

        <div class="conversion-arrow">↓</div>

        <ide-window title="create_table.sql">
          <div class="ide-editor">
            <div class="ide-line-numbers">
              ${[1,2,3,4,5,6,7,8].map(n => html`<div class="ide-line-number">${n}</div>`)}
            </div>
            <div class="ide-code-content">
              <div class="ide-code-line"><span class="keyword">CREATE TABLE</span> orders (</div>
              <div class="ide-code-line">    user_id    <span class="function">STRING</span>,</div>
              <div class="ide-code-line">    product    <span class="function">STRING</span>,</div>
              <div class="ide-code-line">    amount     <span class="function">DECIMAL</span>(10, 2),</div>
              <div class="ide-code-line">    order_time <span class="function">TIMESTAMP</span>(3)</div>
              <div class="ide-code-line">) <span class="keyword">WITH</span> (</div>
              <div class="ide-code-line">    <span class="string">'connector'</span> = <span class="string">'kafka'</span></div>
              <div class="ide-code-line">);</div>
            </div>
          </div>
        </ide-window>

        <div class="conversion-arrow">↓</div>

        <ide-window title="Dynamic Table: orders">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>user_id</th>
                  <th>product</th>
                  <th>amount</th>
                  <th>order_time</th>
                </tr>
              </thead>
              <tbody id="append-table-body">
                ${this.tableRows.length === 0
                  ? html`<tr><td colspan="4" style="text-align: center; color: var(--ui-muted-text);">Run to see data flow</td></tr>`
                  : this.tableRows.map((row, i) => html`
                      <tr class="${i === this.tableRows.length - 1 ? 'row-insert' : ''}">
                        <td>${row.user}</td>
                        <td>${row.product}</td>
                        <td>$${row.amount}</td>
                        <td>${row.time}</td>
                      </tr>
                    `)
                }
              </tbody>
            </table>
          </div>
        </ide-window>

        <div class="info-box">
          <strong>Append-Only:</strong> Each Kafka message becomes a new row (+I insert). 
          The dynamic table grows continuously. Query it with <code>SELECT * FROM orders</code>.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-stream-to-table': SectionStreamToTable;
  }
}
