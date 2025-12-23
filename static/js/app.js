document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#sidebar a[data-module]');
    const contentArea = document.getElementById('main-area');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.getAttribute('data-module');
            
            // Update active link
            document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            loadModule(module);
        });
    });

    async function loadModule(module) {
        contentArea.innerHTML = '<div class="text-center mt-5"><div class="spinner-border" role="status"></div><p>Loading...</p></div>';
        
        switch(module) {
            case 'home':
                renderHome();
                break;
            case 'prepare':
                await renderPrepare();
                break;
            case 'map':
                await renderMap();
                break;
            case 'plan':
                await renderPlan();
                break;
            case 'move':
                await renderMove();
                break;
            case 'evaluate':
                await renderEvaluate();
                break;
            default:
                contentArea.innerHTML = '<h2>Module not found</h2>';
        }
    }

    // Initial load
    renderHome();

    // --- Module: Home ---
    function renderHome() {
        const html = `
            <div class="container text-center py-5">
                <h1 class="fw-bold">Workload Overview</h1>
                <p class="text-muted mb-5">Understand your data centre estate in five structured phases.<br>Follow the process from discovery to evaluation.</p>
                
                <div class="row g-4 mb-5">
                    <div class="col">
                        <div class="phase-card prepare">
                            <div class="phase-icon"><i class="bi bi-search"></i></div>
                            <h5 class="fw-bold">Prepare</h5>
                            <p class="small text-muted">Discover, inventory and normalise your data assets.</p>
                            <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'prepare\\']').click()">Start Phase &rarr;</a>
                        </div>
                    </div>
                    <div class="col">
                        <div class="phase-card map">
                            <div class="phase-icon"><i class="bi bi-diagram-3"></i></div>
                            <h5 class="fw-bold">Map</h5>
                            <p class="small text-muted">Create a visual system map and validate dependencies.</p>
                            <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'map\\']').click()">Start Phase &rarr;</a>
                        </div>
                    </div>
                    <div class="col">
                        <div class="phase-card plan">
                            <div class="phase-icon"><i class="bi bi-calendar-event"></i></div>
                            <h5 class="fw-bold">Plan</h5>
                            <p class="small text-muted">Define migration strategies, waves and schedules.</p>
                            <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'plan\\']').click()">Start Phase &rarr;</a>
                        </div>
                    </div>
                    <div class="col">
                        <div class="phase-card move">
                            <div class="phase-icon"><i class="bi bi-arrow-repeat"></i></div>
                            <h5 class="fw-bold">Move</h5>
                            <p class="small text-muted">Execute the migration plan and track progress.</p>
                            <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'move\\']').click()">Start Phase &rarr;</a>
                        </div>
                    </div>
                    <div class="col">
                        <div class="phase-card evaluate">
                            <div class="phase-icon"><i class="bi bi-bar-chart"></i></div>
                            <h5 class="fw-bold">Evaluate</h5>
                            <p class="small text-muted">Assess results and optimise for the future.</p>
                            <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'evaluate\\']').click()">Start Phase &rarr;</a>
                        </div>
                    </div>
                </div>

                <hr class="my-5">

                <div class="py-4">
                    <h4 class="fw-bold">Get in touch</h4>
                    <p class="text-muted">Have questions, feedback, or need support?</p>
                    <button class="btn btn-outline-dark px-4 py-2">Contact Us &rarr;</button>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;
    }

    // --- Module: Prepare ---
    async function renderPrepare() {
        const response = await fetch('/prepare/items');
        const cis = await response.json();
        
        let html = `
            <h3>1. Prepare: Configuration Items</h3>
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Add New CI</h5>
                            <form id="create-ci-form">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Type</label>
                                    <select class="form-select" name="type">
                                        <option value="server">Server</option>
                                        <option value="virtual_server">Virtual Server</option>
                                        <option value="database">Database</option>
                                        <option value="cluster">Cluster</option>
                                        <option value="application">Application</option>
                                        <option value="network_device">Network Device</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" name="description"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Create CI</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Ingest from File</h5>
                            <form id="ingest-ci-form">
                                <div class="mb-3">
                                    <label class="form-label">CSV or Excel File</label>
                                    <input type="file" class="form-control" name="file" accept=".csv,.xlsx,.xls" required>
                                </div>
                                <button type="submit" class="btn btn-success">Upload & Ingest</button>
                            </form>
                            <small class="text-muted mt-2 d-block">Columns: name, type, description, properties (JSON string)</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <h4>Existing CIs</h4>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${cis.map(ci => `
                        <tr>
                            <td>${ci.id}</td>
                            <td>${ci.name}</td>
                            <td><span class="badge bg-secondary">${ci.type}</span></td>
                            <td>${ci.description || '-'}</td>
                        </tr>
                    `).join('')}
                    ${cis.length === 0 ? '<tr><td colspan="4" class="text-center">No CIs found.</td></tr>' : ''}
                </tbody>
            </table>
        `;
        
        contentArea.innerHTML = html;
        
        // Form handlers
        document.getElementById('create-ci-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.properties = {}; // Default for now
            
            const res = await fetch('/prepare/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert('CI created successfully!');
                renderPrepare();
            }
        };
        
        document.getElementById('ingest-ci-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const res = await fetch('/prepare/ingest', {
                method: 'POST',
                body: formData
            });
            
            if (res.ok) {
                const result = await res.json();
                alert(result.message);
                renderPrepare();
            } else {
                alert('Failed to ingest file.');
            }
        };
    }

    // --- Module: Map ---
    async function renderMap() {
        const [cisRes, workloadsRes] = await Promise.all([
            fetch('/prepare/items'),
            fetch('/map/workloads')
        ]);
        const cis = await cisRes.json();
        const workloads = await workloadsRes.json();
        
        let html = `
            <h3>2. Map: Workloads and Dependencies</h3>
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Create Workload</h5>
                            <form id="create-workload-form">
                                <div class="mb-3">
                                    <label class="form-label">Workload Name</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" name="description"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Select CIs</label>
                                    <select class="form-select" name="ci_ids" multiple required>
                                        ${cis.map(ci => `<option value="${ci.id}">${ci.name} (${ci.type})</option>`).join('')}
                                    </select>
                                    <small class="text-muted">Hold Ctrl/Cmd to select multiple</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Create Workload</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Ingest Workloads</h5>
                            <form id="ingest-workload-form">
                                <div class="mb-3">
                                    <label class="form-label">CSV or Excel File</label>
                                    <input type="file" class="form-control" name="file" accept=".csv,.xlsx,.xls" required>
                                </div>
                                <button type="submit" class="btn btn-success">Upload & Ingest</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <h4>Existing Workloads</h4>
            <div class="row">
                ${workloads.map(w => `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${w.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">CIs: ${w.ci_ids.length}</h6>
                                <p class="card-text">${w.description || 'No description'}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
                ${workloads.length === 0 ? '<p class="text-center">No workloads found.</p>' : ''}
            </div>
        `;
        
        contentArea.innerHTML = html;
        
        document.getElementById('create-workload-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const selectedCIs = Array.from(e.target.ci_ids.selectedOptions).map(opt => opt.value);
            
            const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                ci_ids: selectedCIs,
                relationships: []
            };
            
            const res = await fetch('/map/workloads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert('Workload created!');
                renderMap();
            }
        };

        document.getElementById('ingest-workload-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/map/ingest/workloads', { method: 'POST', body: formData });
            if (res.ok) { alert((await res.json()).message); renderMap(); }
        };
    }

    // --- Module: Plan ---
    async function renderPlan() {
        const [workloadsRes, wavesRes] = await Promise.all([
            fetch('/map/workloads'),
            fetch('/plan/waves')
        ]);
        const workloads = await workloadsRes.json();
        const waves = await wavesRes.json();
        
        let html = `
            <h3>3. Plan: Migration Waves</h3>
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Create Migration Wave</h5>
                            <form id="create-wave-form">
                                <div class="mb-3">
                                    <label class="form-label">Wave Name</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Start Date</label>
                                        <input type="date" class="form-control" name="start_date">
                                    </div>
                                    <div class="col">
                                        <label class="form-label">End Date</label>
                                        <input type="date" class="form-control" name="end_date">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Select Workloads</label>
                                    <select class="form-select" name="workload_ids" multiple required>
                                        ${workloads.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary">Create Wave</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Ingest Waves</h5>
                            <form id="ingest-wave-form">
                                <div class="mb-3">
                                    <label class="form-label">CSV or Excel File</label>
                                    <input type="file" class="form-control" name="file" accept=".csv,.xlsx,.xls" required>
                                </div>
                                <button type="submit" class="btn btn-success">Upload & Ingest</button>
                            </form>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Strategy Recommendations</h5>
                            <p>Select a workload to get a migration strategy recommendation.</p>
                            <div class="input-group mb-3">
                                <select class="form-select" id="rec-workload-id">
                                    ${workloads.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                </select>
                                <button class="btn btn-outline-secondary" type="button" id="get-rec-btn">Get Recommendation</button>
                            </div>
                            <div id="recommendation-result"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <h4>Migration Waves</h4>
            <div class="list-group">
                ${waves.map(wave => `
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${wave.name}</h5>
                            <small>${wave.start_date || ''} to ${wave.end_date || ''}</small>
                        </div>
                        <p class="mb-1">Workloads: ${wave.workload_ids.length}</p>
                    </div>
                `).join('')}
                ${waves.length === 0 ? '<p class="text-center">No waves planned yet.</p>' : ''}
            </div>
        `;
        
        contentArea.innerHTML = html;
        
        document.getElementById('create-wave-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const selectedWorkloads = Array.from(e.target.workload_ids.selectedOptions).map(opt => opt.value);
            
            const data = {
                name: formData.get('name'),
                start_date: formData.get('start_date'),
                end_date: formData.get('end_date'),
                workload_ids: selectedWorkloads
            };
            
            const res = await fetch('/plan/waves', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (res.ok) { alert('Wave created!'); renderPlan(); }
        };

        document.getElementById('ingest-wave-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/plan/ingest/waves', { method: 'POST', body: formData });
            if (res.ok) { alert((await res.json()).message); renderPlan(); }
        };

        document.getElementById('get-rec-btn').onclick = async () => {
            const id = document.getElementById('rec-workload-id').value;
            if (!id) return;
            const res = await fetch(`/plan/recommendations/${id}`);
            const rec = await res.json();
            document.getElementById('recommendation-result').innerHTML = `
                <div class="alert alert-info">
                    <strong>Recommended Strategy:</strong> ${rec.recommended_strategy}<br>
                    <strong>Reasoning:</strong> ${rec.reasoning}
                </div>
            `;
        };
    }

    // --- Module: Move ---
    async function renderMove() {
        const [workloadsRes, runbooksRes] = await Promise.all([
            fetch('/map/workloads'),
            fetch('/move/runbooks')
        ]);
        const workloads = await workloadsRes.json();
        const runbooks = await runbooksRes.json();
        
        let html = `
            <h3>4. Move: Execution Runbooks</h3>
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Generate Runbook from Template</h5>
                            <div class="input-group mb-3">
                                <select class="form-select" id="gen-runbook-workload-id">
                                    ${workloads.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                </select>
                                <button class="btn btn-primary" type="button" id="gen-runbook-btn">Generate Runbook</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Ingest Runbooks</h5>
                            <form id="ingest-runbook-form">
                                <div class="mb-3">
                                    <label class="form-label">CSV or Excel File</label>
                                    <input type="file" class="form-control" name="file" accept=".csv,.xlsx,.xls" required>
                                </div>
                                <button type="submit" class="btn btn-success">Upload & Ingest</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <h4>Generated Runbooks</h4>
            <div class="accordion" id="runbookAccordion">
                ${runbooks.map((rb, index) => `
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                                ${rb.name} (Workload: ${rb.workload_id})
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#runbookAccordion">
                            <div class="accordion-body">
                                <table class="table table-sm">
                                    <thead>
                                        <tr><th>Order</th><th>Task</th><th>Owner</th><th>Status</th></tr>
                                    </thead>
                                    <tbody>
                                        ${rb.steps.map(step => `
                                            <tr>
                                                <td>${step.order}</td>
                                                <td>${step.task}</td>
                                                <td>${step.owner}</td>
                                                <td><span class="badge bg-info">${step.status}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `).join('')}
                ${runbooks.length === 0 ? '<p class="text-center">No runbooks generated yet.</p>' : ''}
            </div>
        `;
        
        contentArea.innerHTML = html;
        
        document.getElementById('gen-runbook-btn').onclick = async () => {
            const id = document.getElementById('gen-runbook-workload-id').value;
            if (!id) return;
            const res = await fetch(`/move/generate/${id}`, { method: 'POST' });
            if (res.ok) { alert('Runbook generated!'); renderMove(); }
        };

        document.getElementById('ingest-runbook-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/move/ingest/runbooks', { method: 'POST', body: formData });
            if (res.ok) { alert((await res.json()).message); renderMove(); }
        };
    }

    // --- Module: Evaluate ---
    async function renderEvaluate() {
        const [dashRes, reportsRes] = await Promise.all([
            fetch('/evaluate/dashboard'),
            fetch('/evaluate/reports')
        ]);
        const dash = await dashRes.json();
        const reports = await reportsRes.json();
        
        let html = `
            <h3>5. Evaluate: Dashboard & Reports</h3>
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card text-center bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Total CIs</h5>
                            <p class="display-6">${dash.total_cis}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Workloads</h5>
                            <p class="display-6">${dash.total_workloads}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Waves</h5>
                            <p class="display-6">${dash.total_waves}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center bg-primary text-white">
                        <div class="card-body">
                            <h5 class="card-title">Progress</h5>
                            <p class="display-6">${(dash.migration_progress * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Financial & ESG</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    TCO Savings
                                    <span class="badge bg-success rounded-pill">$${dash.total_estimated_tco_savings.toLocaleString()}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    ESG Score
                                    <span class="badge bg-info rounded-pill">${dash.esg_impact_score}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Risk Summary</h5>
                            <div class="d-flex justify-content-around">
                                <div class="text-center">
                                    <div class="text-danger fw-bold">${dash.risk_summary.high}</div>
                                    <small>High</small>
                                </div>
                                <div class="text-center">
                                    <div class="text-warning fw-bold">${dash.risk_summary.medium}</div>
                                    <small>Medium</small>
                                </div>
                                <div class="text-center">
                                    <div class="text-success fw-bold">${dash.risk_summary.low}</div>
                                    <small>Low</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h4>Reports</h4>
            <div class="row">
                ${reports.map(report => `
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-header">${report.title}</div>
                            <div class="card-body">
                                <pre>${JSON.stringify(report.data, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        contentArea.innerHTML = html;
    }
});
