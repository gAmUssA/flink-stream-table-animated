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
            { user: 'Alice', product: 'Laptop', amount: 1000, time: 'T1' },
            { user: 'Bob', product: 'Mouse', amount: 50, time: 'T2' },
            { user: 'Alice', product: 'Keyboard', amount: 100, time: 'T3' },
            { user: 'Charlie', product: 'Monitor', amount: 300, time: 'T4' }
        ];

        function streamToTable() {
            const streamContainer = document.getElementById('stream-events');
            const tableBody = document.getElementById('append-table-body');
            
            streamContainer.innerHTML = '';
            tableBody.innerHTML = '';
            
            streamEvents.forEach((event, index) => {
                setTimeout(() => {
                    // Add event to stream
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'event';
                    eventDiv.style.setProperty('--final-position', `${80 + index * 150}px`);
                    eventDiv.innerHTML = `{user: "${event.user}", amount: ${event.amount}}`;
                    streamContainer.appendChild(eventDiv);
                    
                    // Add row to table
                    setTimeout(() => {
                        const row = tableBody.insertRow();
                        row.className = 'row-insert';
                        row.innerHTML = `
                            <td>${event.user}</td>
                            <td>${event.product}</td>
                            <td>${event.amount}</td>
                            <td>${event.time}</td>
                        `;
                        
                        setTimeout(() => {
                            row.className = '';
                        }, 500);
                    }, 1500);
                }, index * 2500);
            });
        }

        function resetStreamToTable() {
            document.getElementById('stream-events').innerHTML = '';
            document.getElementById('append-table-body').innerHTML = 
                '<tr><td colspan="4" style="text-align: center; color: #999;">Table is empty - Start animation to see data</td></tr>';
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
