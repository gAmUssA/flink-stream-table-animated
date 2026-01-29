import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface TerminalLine {
  type: 'prompt-command' | 'output' | 'success' | 'error' | 'warning' | 'info' | 'data' | 'cursor';
  prompt?: string;
  command?: string;
  text?: string;
  delay: number;
}

type TabId = 'ddl' | 'aggregation' | 'window' | 'table-api';

@customElement('section-code-examples')
export class SectionCodeExamples extends LitElement {
  override createRenderRoot() { return this; }

  @state()
  private currentCodeTab: TabId = 'ddl';

  private terminalTimeouts: number[] = [];

  private terminalAnimations: Record<TabId, TerminalLine[]> = {
    'ddl': [
      { type: 'prompt-command', prompt: 'Flink SQL>', command: ' CREATE TABLE orders (', delay: 0 },
      { type: 'output', text: '    order_id STRING,', delay: 100 },
      { type: 'output', text: '    user_id STRING,', delay: 100 },
      { type: 'output', text: '    amount DECIMAL(10,2),', delay: 100 },
      { type: 'output', text: '    order_time TIMESTAMP(3)', delay: 100 },
      { type: 'output', text: ') WITH (\'connector\' = \'kafka\', ...);', delay: 100 },
      { type: 'success', text: '[INFO] Execute statement succeed.', delay: 600 },
      { type: 'prompt-command', prompt: 'Flink SQL>', command: ' SHOW TABLES;', delay: 800 },
      { type: 'output', text: '+------------+', delay: 400 },
      { type: 'output', text: '| table name |', delay: 100 },
      { type: 'output', text: '+------------+', delay: 100 },
      { type: 'data', text: '| orders     |', delay: 300 },
      { type: 'output', text: '+------------+', delay: 100 },
      { type: 'success', text: '1 row in set', delay: 400 },
      { type: 'prompt-command', prompt: 'Flink SQL>', command: ' DESCRIBE orders;', delay: 800 },
      { type: 'output', text: '+------------+----------------+------+-----+', delay: 400 },
      { type: 'output', text: '|    name    |           type | null | key |', delay: 100 },
      { type: 'output', text: '+------------+----------------+------+-----+', delay: 100 },
      { type: 'data', text: '| order_id   |         STRING | TRUE |     |', delay: 200 },
      { type: 'data', text: '| user_id    |         STRING | TRUE |     |', delay: 200 },
      { type: 'data', text: '| amount     | DECIMAL(10, 2) | TRUE |     |', delay: 200 },
      { type: 'data', text: '| order_time |   TIMESTAMP(3) | TRUE |     |', delay: 200 },
      { type: 'output', text: '+------------+----------------+------+-----+', delay: 100 },
      { type: 'success', text: '[INFO] Table created and registered in catalog', delay: 500 },
      { type: 'cursor', delay: 300 }
    ],
    'aggregation': [
      { type: 'prompt-command', prompt: 'Flink SQL>', command: ' SELECT user_id, SUM(amount) AS total, COUNT(*) AS cnt', delay: 0 },
      { type: 'output', text: '  FROM orders GROUP BY user_id;', delay: 100 },
      { type: 'info', text: '[INFO] Submitting SQL query...', delay: 500 },
      { type: 'info', text: '[INFO] Result retrieval mode: changelog', delay: 400 },
      { type: 'output', text: '+---------+--------+-----+', delay: 600 },
      { type: 'output', text: '| user_id |  total | cnt |', delay: 100 },
      { type: 'output', text: '+---------+--------+-----+', delay: 100 },
      { type: 'data', text: '|      +I |  Alice |  100 |  1 |', delay: 800 },
      { type: 'data', text: '|      +I |    Bob |   50 |  1 |', delay: 600 },
      { type: 'data', text: '|      -U |  Alice |  100 |  1 |  ← retract old', delay: 700 },
      { type: 'data', text: '|      +U |  Alice |  250 |  2 |  ← update new', delay: 200 },
      { type: 'data', text: '|      +I |Charlie |  300 |  1 |', delay: 800 },
      { type: 'data', text: '|      -U |    Bob |   50 |  1 |', delay: 600 },
      { type: 'data', text: '|      +U |    Bob |  120 |  2 |', delay: 200 },
      { type: 'output', text: '+---------+--------+-----+', delay: 400 },
      { type: 'info', text: '[INFO] Continuous query running...', delay: 300 },
      { type: 'cursor', delay: 300 }
    ],
    'window': [
      { type: 'prompt-command', prompt: 'Flink SQL>', command: ' SELECT window_start, window_end, user_id, SUM(amount)', delay: 0 },
      { type: 'output', text: '  FROM TABLE(TUMBLE(TABLE orders, DESCRIPTOR(order_time),', delay: 100 },
      { type: 'output', text: '       INTERVAL \'10\' MINUTES))', delay: 100 },
      { type: 'output', text: '  GROUP BY window_start, window_end, user_id;', delay: 100 },
      { type: 'info', text: '[INFO] Submitting windowed aggregation...', delay: 500 },
      { type: 'info', text: '[INFO] Result retrieval mode: append-only', delay: 400 },
      { type: 'output', text: '+---------------------+---------------------+---------+-------+', delay: 600 },
      { type: 'output', text: '|        window_start |          window_end | user_id | total |', delay: 100 },
      { type: 'output', text: '+---------------------+---------------------+---------+-------+', delay: 100 },
      { type: 'info', text: '[INFO] Waiting for window to close...', delay: 1000 },
      { type: 'data', text: '| 2024-01-15 10:00:00 | 2024-01-15 10:10:00 |   Alice |   350 |', delay: 800 },
      { type: 'data', text: '| 2024-01-15 10:00:00 | 2024-01-15 10:10:00 |     Bob |   120 |', delay: 400 },
      { type: 'data', text: '| 2024-01-15 10:00:00 | 2024-01-15 10:10:00 | Charlie |   300 |', delay: 400 },
      { type: 'info', text: '[INFO] Window [10:00, 10:10) closed, emitting results', delay: 600 },
      { type: 'data', text: '| 2024-01-15 10:10:00 | 2024-01-15 10:20:00 |   Alice |   200 |', delay: 1000 },
      { type: 'data', text: '| 2024-01-15 10:10:00 | 2024-01-15 10:20:00 |     Bob |    75 |', delay: 400 },
      { type: 'output', text: '+---------------------+---------------------+---------+-------+', delay: 400 },
      { type: 'success', text: '[INFO] Window results are append-only (+I only)', delay: 500 },
      { type: 'cursor', delay: 300 }
    ],
    'table-api': [
      { type: 'prompt-command', prompt: '$', command: ' mvn compile exec:java -Dexec.mainClass="TableApiDemo"', delay: 0 },
      { type: 'output', text: '[INFO] Scanning for projects...', delay: 400 },
      { type: 'output', text: '[INFO] Building flink-table-api-demo 1.0.0', delay: 300 },
      { type: 'output', text: '[INFO] Compiling 1 source file...', delay: 400 },
      { type: 'success', text: '[INFO] BUILD SUCCESS', delay: 500 },
      { type: 'info', text: '[INFO] Starting Flink Table API job...', delay: 600 },
      { type: 'output', text: '', delay: 100 },
      { type: 'output', text: '+----+---------+--------+-----+', delay: 600 },
      { type: 'output', text: '| op | user_id |  total | cnt |', delay: 100 },
      { type: 'output', text: '+----+---------+--------+-----+', delay: 100 },
      { type: 'data', text: '| +I |   Alice |    100 |   1 |', delay: 800 },
      { type: 'data', text: '| +I |     Bob |     50 |   1 |', delay: 600 },
      { type: 'data', text: '| -U |   Alice |    100 |   1 |', delay: 700 },
      { type: 'data', text: '| +U |   Alice |    250 |   2 |', delay: 200 },
      { type: 'data', text: '| +I | Charlie |    300 |   1 |', delay: 800 },
      { type: 'output', text: '+----+---------+--------+-----+', delay: 400 },
      { type: 'success', text: '[INFO] Table API produces same changelog as SQL', delay: 600 },
      { type: 'cursor', delay: 300 }
    ]
  };

  private showCodeTab(tabId: TabId): void {
    this.currentCodeTab = tabId;
  }

  private handleRun(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.runTerminalDemo();
  }

  private handleStop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.terminalTimeouts.forEach(t => clearTimeout(t));
    this.terminalTimeouts = [];
    
    const terminal = this.querySelector('#terminal-output') as HTMLElement;
    if (terminal) {
      const stopLine = document.createElement('div');
      stopLine.className = 'terminal-line terminal-warning';
      stopLine.textContent = '[INFO] Execution stopped by user';
      terminal.appendChild(stopLine);
      
      const cursorLine = document.createElement('div');
      cursorLine.className = 'terminal-line';
      const prompt = this.currentCodeTab === 'table-api' ? '$' : 'Flink SQL>';
      cursorLine.innerHTML = `<span class="terminal-prompt">${prompt}</span><span class="terminal-cursor"></span>`;
      terminal.appendChild(cursorLine);
    }
  }

  private handleRestart(): void {
    this.handleStop();
    setTimeout(() => {
      this.handleRun();
    }, 100);
  }

  private runTerminalDemo(): void {
    const terminal = this.querySelector('#terminal-output') as HTMLElement;
    if (!terminal) return;
    
    terminal.innerHTML = '';
    
    this.terminalTimeouts.forEach(t => clearTimeout(t));
    this.terminalTimeouts = [];
    
    const lines = this.terminalAnimations[this.currentCodeTab];
    let totalDelay = 0;
    
    lines.forEach((line) => {
      totalDelay += line.delay;
      
      const timeout = window.setTimeout(() => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'terminal-line';
        lineDiv.style.animation = 'fadeInLine 0.2s ease forwards';
        
        if (line.type === 'prompt-command') {
          lineDiv.innerHTML = `<span class="terminal-prompt">${line.prompt}</span><span class="terminal-command">${line.command}</span>`;
        } else if (line.type === 'cursor') {
          const prompt = this.currentCodeTab === 'table-api' ? '$' : 'Flink SQL>';
          lineDiv.innerHTML = `<span class="terminal-prompt">${prompt}</span><span class="terminal-cursor"></span>`;
          this.isRunning = false;
        } else {
          const colorClass: Record<string, string> = {
            'output': 'terminal-output',
            'success': 'terminal-success',
            'error': 'terminal-error',
            'warning': 'terminal-warning',
            'info': 'terminal-info',
            'data': 'terminal-success'
          };
          
          lineDiv.classList.add(colorClass[line.type] || 'terminal-output');
          lineDiv.textContent = line.text || '';
        }
        
        terminal.appendChild(lineDiv);
        terminal.scrollTop = terminal.scrollHeight;
      }, totalDelay);
      
      this.terminalTimeouts.push(timeout);
    });
  }

  private resetTerminalDemo(): void {
    this.terminalTimeouts.forEach(t => clearTimeout(t));
    this.terminalTimeouts = [];
    
    const terminal = this.querySelector('#terminal-output') as HTMLElement;
    if (!terminal) return;
    
    const prompt = this.currentCodeTab === 'table-api' ? '$' : 'Flink SQL&gt;';
    const hint = this.currentCodeTab === 'table-api' 
      ? 'mvn exec:java to run Table API demo'
      : `Click Run Demo to execute ${this.currentCodeTab}.sql`;
    
    terminal.innerHTML = `
      <div class="terminal-line">
        <span class="terminal-prompt">${prompt}</span>
        <span class="terminal-cursor"></span>
      </div>
      <div class="terminal-line terminal-info">[INFO] ${hint}</div>
    `;
  }

  @state()
  private isRunning = false;

  override render() {
    return html`
      <h2 class="section-title">SQL &amp; Table API Examples</h2>
      <div class="description">
        Complete examples using Flink SQL and the fluent Table API
      </div>

      <div class="visualization">
        <!-- IDE Layout with File Tree -->
        <div class="ide-layout">
          <!-- File Tree Sidebar -->
          <div class="file-tree">
            <div class="file-tree-header">
              <span>Explorer</span>
            </div>
            <div class="file-tree-content">
              <div class="file-tree-item folder">
                <span class="file-tree-icon folder">📁</span>
                <span class="file-tree-name">flink-sql-demo</span>
              </div>
              <div class="file-tree-item folder" style="padding-left: 28px;">
                <span class="file-tree-icon folder">📁</span>
                <span class="file-tree-name">sql</span>
              </div>
              <div class="file-tree-item ${this.currentCodeTab === 'ddl' ? 'active' : ''}" style="padding-left: 42px;" @click=${() => this.showCodeTab('ddl')}>
                <span class="file-tree-icon sql">📄</span>
                <span class="file-tree-name">create_tables.sql</span>
              </div>
              <div class="file-tree-item ${this.currentCodeTab === 'aggregation' ? 'active' : ''}" style="padding-left: 42px;" @click=${() => this.showCodeTab('aggregation')}>
                <span class="file-tree-icon sql">📄</span>
                <span class="file-tree-name">aggregation.sql</span>
              </div>
              <div class="file-tree-item ${this.currentCodeTab === 'window' ? 'active' : ''}" style="padding-left: 42px;" @click=${() => this.showCodeTab('window')}>
                <span class="file-tree-icon sql">📄</span>
                <span class="file-tree-name">window_agg.sql</span>
              </div>
              <div class="file-tree-item folder" style="padding-left: 28px;">
                <span class="file-tree-icon folder">📁</span>
                <span class="file-tree-name">src/main/java</span>
              </div>
              <div class="file-tree-item ${this.currentCodeTab === 'table-api' ? 'active' : ''}" style="padding-left: 42px;" @click=${() => this.showCodeTab('table-api')}>
                <span class="file-tree-icon java">☕</span>
                <span class="file-tree-name">TableApiDemo.java</span>
              </div>
              <div class="file-tree-item" style="padding-left: 14px;">
                <span class="file-tree-icon xml">📄</span>
                <span class="file-tree-name">pom.xml</span>
              </div>
            </div>
          </div>

          <!-- Main IDE Area -->
          <div class="ide-main">
            <!-- IDE Toolbar -->
            <div class="ide-toolbar">
              <div class="ide-toolbar-left">
                <button 
                  class="ide-toolbar-btn run ${this.isRunning ? 'disabled' : ''}" 
                  @click=${() => this.handleRun()}
                  title="Run ${this.currentCodeTab === 'table-api' ? 'TableApiDemo' : this.currentCodeTab + '.sql'}"
                  ?disabled=${this.isRunning}
                >
                  <span class="ide-toolbar-icon">▶</span>
                </button>
                <button 
                  class="ide-toolbar-btn stop ${!this.isRunning ? 'disabled' : ''}" 
                  @click=${() => this.handleStop()}
                  title="Stop"
                  ?disabled=${!this.isRunning}
                >
                  <span class="ide-toolbar-icon">■</span>
                </button>
                <button 
                  class="ide-toolbar-btn restart" 
                  @click=${() => this.handleRestart()}
                  title="Restart"
                >
                  <span class="ide-toolbar-icon">↻</span>
                </button>
                <span class="ide-toolbar-separator"></span>
                <span class="ide-toolbar-label">${this.currentCodeTab === 'table-api' ? 'TableApiDemo' : this.currentCodeTab + '.sql'}</span>
              </div>
              <div class="ide-toolbar-right">
                <span class="ide-toolbar-status ${this.isRunning ? 'running' : 'ready'}">
                  ${this.isRunning ? '● Running' : '○ Ready'}
                </span>
              </div>
            </div>

            <!-- IDE Tabs -->
            <div class="ide-tabs">
              <button class="ide-tab ${this.currentCodeTab === 'ddl' ? 'active' : ''}" @click=${() => this.showCodeTab('ddl')}>
                <span class="ide-tab-icon sql">📄</span>
                create_tables.sql
              </button>
              <button class="ide-tab ${this.currentCodeTab === 'aggregation' ? 'active' : ''}" @click=${() => this.showCodeTab('aggregation')}>
                <span class="ide-tab-icon sql">📄</span>
                aggregation.sql
              </button>
              <button class="ide-tab ${this.currentCodeTab === 'window' ? 'active' : ''}" @click=${() => this.showCodeTab('window')}>
                <span class="ide-tab-icon sql">📄</span>
                window_agg.sql
              </button>
              <button class="ide-tab ${this.currentCodeTab === 'table-api' ? 'active' : ''}" @click=${() => this.showCodeTab('table-api')}>
                <span class="ide-tab-icon java">☕</span>
                TableApiDemo.java
              </button>
            </div>

            <!-- Code Editor Panels -->
            ${this.renderCodePanel('ddl')}
            ${this.renderCodePanel('aggregation')}
            ${this.renderCodePanel('window')}
            ${this.renderCodePanel('table-api')}

            <!-- Status Bar -->
            <div class="ide-statusbar">
              <div class="ide-statusbar-left">
                <span class="ide-statusbar-item">${this.currentCodeTab === 'table-api' ? 'Java' : 'SQL'}</span>
                <span class="ide-statusbar-item">UTF-8</span>
              </div>
              <div class="ide-statusbar-right">
                <span class="ide-statusbar-item">Flink 2.2.0</span>
                <span class="ide-statusbar-item">Ln 3, Col 1</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Terminal Window -->
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-header-buttons">
              <span class="terminal-header-btn close"></span>
              <span class="terminal-header-btn minimize"></span>
              <span class="terminal-header-btn maximize"></span>
            </div>
            <span class="terminal-header-title">Flink SQL Client</span>
          </div>
          <div class="terminal-body" id="terminal-output">
            <div class="terminal-line terminal-info">Welcome to Flink SQL Client 2.2.0</div>
            <div class="terminal-line terminal-output"></div>
            <div class="terminal-line terminal-output">Command Line Interface for Apache Flink SQL</div>
            <div class="terminal-line terminal-output">Type 'HELP;' for available commands or click Run Demo above</div>
            <div class="terminal-line terminal-output"></div>
            <div class="terminal-line"><span class="terminal-prompt">Flink SQL&gt;</span><span class="terminal-cursor"></span></div>
          </div>
        </div>

        <div class="info-box" style="margin-top: 20px;">
          <strong>SQL vs Table API:</strong> Both produce identical execution plans and changelog semantics.
          Use SQL for ad-hoc queries and Table API for programmatic pipelines in Java/Scala/Python.
        </div>

        <div class="docs-links">
          <strong>Learn More:</strong>
          <div class="docs-links-list">
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/docs/dev/table/tableApi/" target="_blank" rel="noopener">Table API</a>
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/docs/dev/table/sql/overview/" target="_blank" rel="noopener">Flink SQL</a>
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/docs/connectors/table/kafka/" target="_blank" rel="noopener">Kafka Connector</a>
            <a href="https://nightlies.apache.org/flink/flink-docs-release-2.2/docs/dev/table/sql/queries/window-agg/" target="_blank" rel="noopener">Window Aggregations</a>
          </div>
        </div>
      </div>
    `;
  }

  private renderCodePanel(tabId: TabId) {
    const panels: Record<TabId, { lines: number[]; highlighted: number[]; content: string[] }> = {
      'ddl': {
        lines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        highlighted: [],
        content: [
          '<span class="comment">-- Source table from Kafka</span>',
          '<span class="keyword">CREATE TABLE</span> orders (',
          '    order_id    <span class="function">STRING</span>,',
          '    user_id     <span class="function">STRING</span>,',
          '    amount      <span class="function">DECIMAL</span>(10, 2),',
          '    order_time  <span class="function">TIMESTAMP</span>(3),',
          '    <span class="keyword">WATERMARK FOR</span> order_time <span class="keyword">AS</span> order_time - <span class="function">INTERVAL</span> <span class="string">\'5\'</span> <span class="function">SECOND</span>',
          ') <span class="keyword">WITH</span> (',
          '    <span class="string">\'connector\'</span> = <span class="string">\'kafka\'</span>,',
          '    <span class="string">\'topic\'</span> = <span class="string">\'orders\'</span>,',
          '    <span class="string">\'properties.bootstrap.servers\'</span> = <span class="string">\'localhost:9092\'</span>,',
          '    <span class="string">\'format\'</span> = <span class="string">\'json\'</span>,',
          '    <span class="string">\'scan.startup.mode\'</span> = <span class="string">\'earliest-offset\'</span>',
          ');'
        ]
      },
      'aggregation': {
        lines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        highlighted: [3, 4, 5, 6],
        content: [
          '<span class="comment">-- Continuous aggregation with changelog output</span>',
          '<span class="comment">-- Produces: +I (insert), -U/+U (update), -D (delete)</span>',
          '<span class="keyword">SELECT</span>',
          '    user_id,',
          '    <span class="function">SUM</span>(amount) <span class="keyword">AS</span> total_amount,',
          '    <span class="function">COUNT</span>(*) <span class="keyword">AS</span> order_count',
          '<span class="keyword">FROM</span> orders',
          '<span class="keyword">GROUP BY</span> user_id;',
          '',
          '<span class="comment">-- Output: +I[Alice, 100, 1] → -U[Alice, 100, 1] → +U[Alice, 250, 2]</span>',
          '<span class="comment">-- Each new order updates the running total</span>'
        ]
      },
      'window': {
        lines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        highlighted: [3, 4, 5, 6, 7],
        content: [
          '<span class="comment">-- Tumbling window aggregation (10-minute windows)</span>',
          '<span class="comment">-- Window results are append-only (+I only)</span>',
          '<span class="keyword">SELECT</span>',
          '    window_start, window_end,',
          '    user_id,',
          '    <span class="function">SUM</span>(amount) <span class="keyword">AS</span> window_total',
          '<span class="keyword">FROM TABLE</span>(<span class="function">TUMBLE</span>(<span class="keyword">TABLE</span> orders, <span class="function">DESCRIPTOR</span>(order_time), <span class="function">INTERVAL</span> <span class="string">\'10\'</span> <span class="function">MINUTES</span>))',
          '<span class="keyword">GROUP BY</span> window_start, window_end, user_id;',
          ''
        ]
      },
      'table-api': {
        lines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        highlighted: [8, 9, 10, 11, 12],
        content: [
          '<span class="keyword">import static</span> org.apache.flink.table.api.Expressions.$;',
          '<span class="keyword">import static</span> org.apache.flink.table.api.Expressions.lit;',
          '',
          'TableEnvironment tableEnv = TableEnvironment.<span class="function">create</span>(',
          '    EnvironmentSettings.<span class="function">inStreamingMode</span>());',
          '',
          '<span class="comment">// Fluent Table API - same semantics as SQL</span>',
          'Table result = tableEnv.<span class="function">from</span>(<span class="string">"orders"</span>)',
          '    .<span class="function">groupBy</span>($(<span class="string">"user_id"</span>))',
          '    .<span class="function">select</span>(',
          '        $(<span class="string">"user_id"</span>),',
          '        $(<span class="string">"amount"</span>).<span class="function">sum</span>().<span class="function">as</span>(<span class="string">"total"</span>),',
          '        lit(1).<span class="function">count</span>().<span class="function">as</span>(<span class="string">"cnt"</span>));',
          'result.<span class="function">execute</span>().<span class="function">print</span>();'
        ]
      }
    };

    const panel = panels[tabId];
    const isActive = this.currentCodeTab === tabId;

    return html`
      <div id="code-panel-${tabId}" class="ide-editor" style="display: ${isActive ? 'flex' : 'none'};">
        <div class="ide-line-numbers">
          ${panel.lines.map((num, i) => html`
            <div class="ide-line-number ${panel.highlighted.includes(num) ? 'highlighted' : ''}">${num}</div>
          `)}
        </div>
        <div class="ide-code-content">
          ${panel.content.map((line, i) => html`
            <div class="ide-code-line ${panel.highlighted.includes(i + 1) ? 'highlighted' : ''}" .innerHTML=${line}></div>
          `)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-code-examples': SectionCodeExamples;
  }
}
