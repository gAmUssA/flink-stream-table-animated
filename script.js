        // Theme Management
        const ThemeManager = {
            STORAGE_KEY: 'theme-preference',
            THEME_LIGHT: 'light',
            THEME_DARK: 'dark',
            
            init() {
                const theme = this.getCurrentTheme();
                this.applyTheme(theme);
                this.watchSystemTheme();
                
                // Set up toggle button listener
                const toggleBtn = document.getElementById('theme-toggle');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', () => this.toggleTheme());
                }
            },
            
            getCurrentTheme() {
                // Try to get saved theme from localStorage with validation
                try {
                    const saved = localStorage.getItem(this.STORAGE_KEY);
                    
                    // Validate stored theme value
                    if (saved === this.THEME_LIGHT || saved === this.THEME_DARK) {
                        return saved;
                    } else if (saved !== null) {
                        // Invalid value found - clear it
                        console.warn(`Invalid theme value "${saved}" found in localStorage. Clearing...`);
                        localStorage.removeItem(this.STORAGE_KEY);
                    }
                } catch (e) {
                    // localStorage access failed (private browsing, quota exceeded, etc.)
                    console.warn('localStorage not available, theme preference will not persist:', e.message);
                }
                
                // Fall back to system preference
                return this.getSystemTheme();
            },
            
            getSystemTheme() {
                // Feature detection for matchMedia API
                if (!window.matchMedia) {
                    console.warn('matchMedia API not supported, defaulting to light theme');
                    return this.THEME_LIGHT;
                }
                
                try {
                    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    if (darkModeQuery.matches) {
                        return this.THEME_DARK;
                    }
                } catch (e) {
                    console.warn('Error detecting system theme preference:', e.message);
                }
                
                return this.THEME_LIGHT;
            },
            
            applyTheme(theme) {
                // Validate theme parameter
                const validTheme = (theme === this.THEME_DARK) ? this.THEME_DARK : this.THEME_LIGHT;
                
                if (theme !== validTheme) {
                    console.warn(`Invalid theme "${theme}" provided, using "${validTheme}" instead`);
                }
                
                document.documentElement.setAttribute('data-theme', validTheme);
                
                // Update toggle button icon
                const toggleBtn = document.getElementById('theme-toggle');
                if (toggleBtn) {
                    const icon = toggleBtn.querySelector('.theme-icon');
                    if (icon) {
                        icon.textContent = validTheme === this.THEME_DARK ? '☀️' : '🌙';
                    }
                }
            },
            
            toggleTheme() {
                const current = document.documentElement.getAttribute('data-theme') || this.THEME_LIGHT;
                const newTheme = current === this.THEME_DARK ? this.THEME_LIGHT : this.THEME_DARK;
                this.applyTheme(newTheme);
                this.saveTheme(newTheme);
            },
            
            saveTheme(theme) {
                try {
                    localStorage.setItem(this.STORAGE_KEY, theme);
                } catch (e) {
                    // Handle localStorage errors (quota exceeded, private browsing, etc.)
                    console.warn('Could not save theme preference to localStorage:', e.message);
                }
            },
            
            watchSystemTheme() {
                // Feature detection for matchMedia API
                if (!window.matchMedia) {
                    console.warn('matchMedia API not supported, system theme changes will not be detected');
                    return;
                }
                
                try {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    const handler = (e) => {
                        // Only apply system theme if no manual preference is saved
                        try {
                            const saved = localStorage.getItem(this.STORAGE_KEY);
                            if (!saved) {
                                const newTheme = e.matches ? this.THEME_DARK : this.THEME_LIGHT;
                                this.applyTheme(newTheme);
                            }
                        } catch (err) {
                            console.warn('Could not check theme preference during system change:', err.message);
                        }
                    };
                    
                    // Use addEventListener (modern browsers)
                    if (mediaQuery.addEventListener) {
                        mediaQuery.addEventListener('change', handler);
                    } else {
                        console.warn('MediaQueryList.addEventListener not supported, system theme changes will not be detected');
                    }
                } catch (e) {
                    console.warn('Error setting up system theme watcher:', e.message);
                }
            }
        };

        // Navigation
        const sectionHashes = ['concept', 'stream-to-table', 'table-to-stream', 'stream-types', 'live-aggregation', 'code-examples'];
        
        function showSection(index) {
            const sections = document.querySelectorAll('.demo-section');
            const buttons = document.querySelectorAll('.nav-btn');
            
            sections.forEach(s => s.classList.remove('active'));
            buttons.forEach(b => b.classList.remove('active'));
            
            sections[index].classList.add('active');
            buttons[index].classList.add('active');
            
            // Update URL hash
            window.location.hash = sectionHashes[index];
        }
        
        // Handle hash changes
        function handleHashChange() {
            const hash = window.location.hash.slice(1); // Remove the #
            const index = sectionHashes.indexOf(hash);
            
            if (index !== -1) {
                showSection(index);
            } else if (!hash) {
                showSection(0); // Default to first section
            }
        }
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        
        // Handle initial load
        window.addEventListener('DOMContentLoaded', () => {
            ThemeManager.init();
            handleHashChange();
        });

        // Section 1: Stream to Table
        let streamEvents = [
            { user: 'Alice', product: 'Laptop', amount: 1000, time: '10:01:15' },
            { user: 'Bob', product: 'Mouse', amount: 50, time: '10:01:18' },
            { user: 'Alice', product: 'Keyboard', amount: 100, time: '10:01:22' },
            { user: 'Charlie', product: 'Monitor', amount: 300, time: '10:01:25' }
        ];

        function streamToTable() {
            const streamContainer = document.getElementById('stream-events');
            const tableBody = document.getElementById('append-table-body');
            
            streamContainer.innerHTML = '';
            tableBody.innerHTML = '';
            
            streamEvents.forEach((event, index) => {
                setTimeout(() => {
                    // Add Kafka message to consumer view
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'kafka-message';
                    msgDiv.innerHTML = `
                        <span class="offset">offset: ${index}</span>
                        <span class="payload">
                            {<span class="key">"user"</span>: <span class="value">"${event.user}"</span>, 
                            <span class="key">"product"</span>: <span class="value">"${event.product}"</span>, 
                            <span class="key">"amount"</span>: ${event.amount}}
                        </span>
                    `;
                    streamContainer.appendChild(msgDiv);
                    streamContainer.scrollTop = streamContainer.scrollHeight;
                    
                    // Add row to table
                    setTimeout(() => {
                        const row = tableBody.insertRow();
                        row.className = 'row-insert';
                        row.innerHTML = `
                            <td>${event.user}</td>
                            <td>${event.product}</td>
                            <td>$${event.amount}</td>
                            <td>${event.time}</td>
                        `;
                    }, 400);
                }, index * 1000);
            });
        }

        function resetStreamToTable() {
            document.getElementById('stream-events').innerHTML = '<div class="kafka-empty">Waiting for messages...</div>';
            document.getElementById('append-table-body').innerHTML = 
                '<tr><td colspan="4" style="text-align: center; color: var(--ide-text-muted);">Run to see data flow</td></tr>';
        }

        // Section 2: Table to Stream
        let tableStates = [
            { user: 'Alice', total: 100, count: 1, op: 'INSERT' },
            { user: 'Bob', total: 50, count: 1, op: 'INSERT' },
            { user: 'Alice', total: 300, count: 2, op: 'UPDATE' },
            { user: 'Charlie', total: 200, count: 1, op: 'INSERT' }
        ];

        function tableToStream() {
            const tableBody = document.getElementById('dynamic-table-body');
            const changelog = document.getElementById('changelog');
            
            tableBody.innerHTML = '';
            changelog.innerHTML = '';
            
            let currentState = {};
            
            tableStates.forEach((state, index) => {
                setTimeout(() => {
                    // Update table
                    if (state.op === 'INSERT') {
                        const row = tableBody.insertRow();
                        row.id = `row-${state.user}`;
                        row.className = 'row-insert';
                        row.innerHTML = `
                            <td>${state.user}</td>
                            <td>${state.total}</td>
                            <td>${state.count}</td>
                        `;
                        currentState[state.user] = { total: state.total, count: state.count };
                        
                        // Changelog
                        const entry = document.createElement('div');
                        entry.className = 'changelog-entry insert';
                        entry.innerHTML = `<span class="badge badge-insert">+I</span>[${state.user}, ${state.total}, ${state.count}]`;
                        changelog.appendChild(entry);
                        
                        setTimeout(() => row.className = '', 500);
                    } else if (state.op === 'UPDATE') {
                        const row = document.getElementById(`row-${state.user}`);
                        const oldState = currentState[state.user];
                        
                        row.className = 'row-update';
                        
                        // Changelog - retract old
                        const retract = document.createElement('div');
                        retract.className = 'changelog-entry update-before';
                        retract.innerHTML = `<span class="badge badge-update">-U</span>[${state.user}, ${oldState.total}, ${oldState.count}]`;
                        changelog.appendChild(retract);
                        
                        setTimeout(() => {
                            // Update row
                            row.innerHTML = `
                                <td>${state.user}</td>
                                <td>${state.total}</td>
                                <td>${state.count}</td>
                            `;
                            currentState[state.user] = { total: state.total, count: state.count };
                            
                            // Changelog - add new
                            const update = document.createElement('div');
                            update.className = 'changelog-entry update-after';
                            update.innerHTML = `<span class="badge badge-update">+U</span>[${state.user}, ${state.total}, ${state.count}]`;
                            changelog.appendChild(update);
                            
                            setTimeout(() => row.className = '', 500);
                        }, 300);
                    }
                    
                    changelog.scrollTop = changelog.scrollHeight;
                }, index * 2000);
            });
        }

        function resetTableToStream() {
            document.getElementById('dynamic-table-body').innerHTML = 
                '<tr><td colspan="3" style="text-align: center; color: #999;">Start animation</td></tr>';
            document.getElementById('changelog').innerHTML = 
                '<div style="text-align: center; color: #999;">Waiting for changes...</div>';
        }

        // Section 4: Live Aggregation
        let aggInterval = null;
        let aggState = {};
        let aggEventCount = 0;

        const users = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const amounts = [50, 100, 150, 200, 250];

        function startAggregation() {
            if (aggInterval) return;
            
            const inputDiv = document.getElementById('agg-input');
            const resultBody = document.getElementById('agg-result-body');
            const changelogDiv = document.getElementById('agg-changelog');
            
            if (aggEventCount === 0) {
                inputDiv.innerHTML = '';
                resultBody.innerHTML = '';
                changelogDiv.innerHTML = '';
            }
            
            aggInterval = setInterval(() => {
                const user = users[Math.floor(Math.random() * users.length)];
                const amount = amounts[Math.floor(Math.random() * amounts.length)];
                
                aggEventCount++;
                
                // Add to input stream
                const event = document.createElement('div');
                event.style.cssText = 'padding: 8px; margin: 5px 0; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 5px; animation: slideInFromLeft 0.3s; color: var(--text-primary); font-family: "JetBrains Mono", monospace; font-size: 0.875em;';
                event.innerHTML = `<strong>#${aggEventCount}</strong> Order{user: "${user}", amount: ${amount}}`;
                inputDiv.insertBefore(event, inputDiv.firstChild);
                
                // Update aggregation
                if (!aggState[user]) {
                    aggState[user] = { total: 0, count: 0 };
                    
                    // Insert
                    const row = resultBody.insertRow();
                    row.id = `agg-row-${user}`;
                    row.className = 'row-insert';
                    row.innerHTML = `<td>${user}</td><td>${amount}</td><td>1</td>`;
                    aggState[user] = { total: amount, count: 1 };
                    
                    const change = document.createElement('div');
                    change.className = 'changelog-entry insert';
                    change.innerHTML = `<span class="badge badge-insert">+I</span>[${user}, ${amount}, 1]`;
                    changelogDiv.insertBefore(change, changelogDiv.firstChild);
                    
                    setTimeout(() => row.className = '', 500);
                } else {
                    // Update
                    const oldTotal = aggState[user].total;
                    const oldCount = aggState[user].count;
                    aggState[user].total += amount;
                    aggState[user].count += 1;
                    
                    const row = document.getElementById(`agg-row-${user}`);
                    row.className = 'row-update';
                    
                    const retract = document.createElement('div');
                    retract.className = 'changelog-entry update-before';
                    retract.innerHTML = `<span class="badge badge-update">-U</span>[${user}, ${oldTotal}, ${oldCount}]`;
                    changelogDiv.insertBefore(retract, changelogDiv.firstChild);
                    
                    setTimeout(() => {
                        row.innerHTML = `<td>${user}</td><td>${aggState[user].total}</td><td>${aggState[user].count}</td>`;
                        
                        const update = document.createElement('div');
                        update.className = 'changelog-entry update-after';
                        update.innerHTML = `<span class="badge badge-update">+U</span>[${user}, ${aggState[user].total}, ${aggState[user].count}]`;
                        changelogDiv.insertBefore(update, changelogDiv.firstChild);
                        
                        setTimeout(() => row.className = '', 500);
                    }, 200);
                }
                
                // Keep scroll reasonable
                if (inputDiv.children.length > 20) {
                    inputDiv.removeChild(inputDiv.lastChild);
                }
                if (changelogDiv.children.length > 30) {
                    changelogDiv.removeChild(changelogDiv.lastChild);
                }
                
            }, 1500);
        }

        function stopAggregation() {
            if (aggInterval) {
                clearInterval(aggInterval);
                aggInterval = null;
            }
        }

        function resetAggregation() {
            stopAggregation();
            aggState = {};
            aggEventCount = 0;
            document.getElementById('agg-input').innerHTML = 
                '<div style="text-align: center; color: var(--ui-muted-text); padding: 50px 0;">Waiting for events...</div>';
            document.getElementById('agg-result-body').innerHTML = 
                '<tr><td colspan="3" style="text-align: center; color: var(--ui-muted-text);">No data yet</td></tr>';
            document.getElementById('agg-changelog').innerHTML = 
                '<div style="text-align: center; color: var(--ui-muted-text);">Changelog will appear here...</div>';
        }

        // Section 5: IDE Components
        
        // Track current active tab
        let currentCodeTab = 'ddl';
        
        // Show code tab and update active states
        function showCodeTab(tabId) {
            currentCodeTab = tabId;
            
            // Hide all code panels
            const panels = document.querySelectorAll('[id^="code-panel-"]');
            panels.forEach(panel => panel.style.display = 'none');
            
            // Show selected panel
            const selectedPanel = document.getElementById(`code-panel-${tabId}`);
            if (selectedPanel) {
                selectedPanel.style.display = 'flex';
            }
            
            // Update tab active states
            const tabs = document.querySelectorAll('.ide-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Find and activate the clicked tab
            tabs.forEach(tab => {
                if (tab.onclick && tab.onclick.toString().includes(tabId)) {
                    tab.classList.add('active');
                }
            });
            
            // Update file tree active states
            const fileItems = document.querySelectorAll('.file-tree-item');
            fileItems.forEach(item => item.classList.remove('active'));
            
            fileItems.forEach(item => {
                if (item.onclick && item.onclick.toString().includes(tabId)) {
                    item.classList.add('active');
                }
            });
            
            // Update status bar
            const statusBar = document.querySelector('.ide-statusbar-left .ide-statusbar-item');
            if (statusBar) {
                statusBar.textContent = tabId === 'table-api' ? 'Java' : 'SQL';
            }
        }
        
        // Terminal animations for each SQL file type
        const terminalAnimations = {
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
        
        // Terminal demo with typing animation
        let terminalTimeouts = [];
        
        function runTerminalDemo() {
            const terminal = document.getElementById('terminal-output');
            terminal.innerHTML = '';
            
            // Clear any existing timeouts
            terminalTimeouts.forEach(t => clearTimeout(t));
            terminalTimeouts = [];
            
            // Get animation for current tab
            const lines = terminalAnimations[currentCodeTab] || terminalAnimations['ddl'];
            
            let totalDelay = 0;
            
            lines.forEach((line, index) => {
                totalDelay += line.delay;
                
                const timeout = setTimeout(() => {
                    const lineDiv = document.createElement('div');
                    lineDiv.className = 'terminal-line';
                    lineDiv.style.animation = 'fadeInLine 0.2s ease forwards';
                    
                    if (line.type === 'prompt-command') {
                        lineDiv.innerHTML = `<span class="terminal-prompt">${line.prompt}</span><span class="terminal-command">${line.command}</span>`;
                    } else if (line.type === 'cursor') {
                        const prompt = currentCodeTab === 'table-api' ? '$' : 'Flink SQL>';
                        lineDiv.innerHTML = `<span class="terminal-prompt">${prompt}</span><span class="terminal-cursor"></span>`;
                    } else {
                        const colorClass = {
                            'output': 'terminal-output',
                            'success': 'terminal-success',
                            'error': 'terminal-error',
                            'warning': 'terminal-warning',
                            'info': 'terminal-info',
                            'data': 'terminal-success'
                        }[line.type] || 'terminal-output';
                        
                        lineDiv.classList.add(colorClass);
                        lineDiv.textContent = line.text;
                    }
                    
                    terminal.appendChild(lineDiv);
                    terminal.scrollTop = terminal.scrollHeight;
                }, totalDelay);
                
                terminalTimeouts.push(timeout);
            });
        }
        
        function resetTerminalDemo() {
            // Clear all timeouts
            terminalTimeouts.forEach(t => clearTimeout(t));
            terminalTimeouts = [];
            
            const terminal = document.getElementById('terminal-output');
            const prompt = currentCodeTab === 'table-api' ? '$' : 'Flink SQL&gt;';
            const hint = currentCodeTab === 'table-api' 
                ? 'mvn exec:java to run Table API demo'
                : 'Click Run Demo to execute ' + currentCodeTab + '.sql';
            
            terminal.innerHTML = `
                <div class="terminal-line">
                    <span class="terminal-prompt">${prompt}</span>
                    <span class="terminal-cursor"></span>
                </div>
                <div class="terminal-line terminal-info">[INFO] ${hint}</div>
            `;
        }
