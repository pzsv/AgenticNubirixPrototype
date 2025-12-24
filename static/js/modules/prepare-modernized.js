// --- Module: Prepare (Modernized) ---
let prepareState = {
    currentStep: 'overview',
    discoverSubview: 'sources'
};

async function renderPrepare() {
    const contentArea = document.getElementById('main-area');
    const html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Prepare</h2>
            <div class="stepper d-flex align-items-center">
                <div class="step ${prepareState.currentStep === 'overview' ? 'active' : ''}" onclick="window.setPrepareStep('overview')">
                    <i class="bi bi-speedometer2 me-1"></i> Overview
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'discover' ? 'active' : ''}" onclick="window.setPrepareStep('discover')">
                    <i class="bi bi-search me-1"></i> Discover
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'stage' ? 'active' : ''}" onclick="window.setPrepareStep('stage')">
                    <i class="bi bi-layers me-1"></i> Stage & Review
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'structure' ? 'active' : ''}" onclick="window.setPrepareStep('structure')">
                    <i class="bi bi-diagram-3 me-1"></i> Structure
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'transform' ? 'active' : ''}" onclick="window.setPrepareStep('transform')">
                    <i class="bi bi-magic me-1"></i> Transform
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'consolidate' ? 'active' : ''}" onclick="window.setPrepareStep('consolidate')">
                    <i class="bi bi-combine me-1"></i> Consolidate
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'publish' ? 'active' : ''}" onclick="window.setPrepareStep('publish')">
                    <i class="bi bi-cloud-upload me-1"></i> Publish
                </div>
            </div>
        </div>
        <div id="prepare-modern-content"></div>
    `;
    
    contentArea.innerHTML = html;
    renderPrepareStep();
}

window.setPrepareStep = (step) => {
    prepareState.currentStep = step;
    renderPrepareStep();
};

async function renderPrepareStep() {
    const stepArea = document.getElementById('prepare-modern-content');
    if (!stepArea) return;

    // Update stepper active state
    document.querySelectorAll('.stepper .step').forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        const step = prepareState.currentStep;
        let active = false;
        if (step === 'overview' && text.includes('overview')) active = true;
        else if (step === 'discover' && text.includes('discover')) active = true;
        else if (step === 'stage' && text.includes('stage')) active = true;
        else if (step === 'structure' && text.includes('structure')) active = true;
        else if (step === 'transform' && text.includes('transform')) active = true;
        else if (step === 'consolidate' && text.includes('consolidate')) active = true;
        else if (step === 'publish' && text.includes('publish')) active = true;
        
        el.classList.toggle('active', active);
    });

    switch(prepareState.currentStep) {
        case 'overview':
            renderPrepareModernOverview(stepArea);
            break;
        case 'discover':
            await renderPrepareDiscover(stepArea);
            break;
        case 'stage':
            renderPrepareStage(stepArea);
            break;
        case 'structure':
            renderPrepareStructure(stepArea);
            break;
        case 'transform':
            stepArea.innerHTML = '<h4>Transform</h4><p class="text-muted">Apply normalization and data cleaning rules.</p>';
            break;
        case 'consolidate':
            stepArea.innerHTML = '<h4>Consolidate</h4><p class="text-muted">Merge data from multiple sources and deduplicate.</p>';
            break;
        case 'publish':
            stepArea.innerHTML = '<h4>Publish</h4><p class="text-muted">Finalize and release data to the Map phase.</p>';
            break;
    }
}

function renderPrepareStage(container) {
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Stage & Review</h4>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-dark btn-sm">Filter</button>
                <button class="btn btn-primary btn-sm">Verify All Ready</button>
            </div>
        </div>
        
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 small">
                    <thead class="bg-light">
                        <tr>
                            <th>Item Name</th>
                            <th>Source</th>
                            <th>Type</th>
                            <th>Quality</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>APP-SERVER-01</strong></td>
                            <td class="text-muted">Excel Upload</td>
                            <td>Compute</td>
                            <td><div class="progress" style="height: 6px; width: 60px;"><div class="progress-bar bg-success" style="width: 95%"></div></div></td>
                            <td><span class="badge bg-success">Ready</span></td>
                            <td><button class="btn btn-link btn-sm p-0">Review</button></td>
                        </tr>
                        <tr>
                            <td><strong>DB-PROD-02</strong></td>
                            <td class="text-muted">CMDB Sync</td>
                            <td>Database</td>
                            <td><div class="progress" style="height: 6px; width: 60px;"><div class="progress-bar bg-warning" style="width: 65%"></div></div></td>
                            <td><span class="badge bg-warning text-dark">Pending</span></td>
                            <td><button class="btn btn-link btn-sm p-0">Review</button></td>
                        </tr>
                        <tr>
                            <td><strong>WEB-CLUSTER-01</strong></td>
                            <td class="text-muted">Excel Upload</td>
                            <td>Compute</td>
                            <td><div class="progress" style="height: 6px; width: 60px;"><div class="progress-bar bg-danger" style="width: 35%"></div></div></td>
                            <td><span class="badge bg-danger">Conflict</span></td>
                            <td><button class="btn btn-link btn-sm p-0">Resolve</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function renderPrepareStructure(container) {
    const [mappingsRes, entitiesRes] = await Promise.all([
        fetch('/prepare/field-mappings'),
        fetch('/data-dictionary/entities')
    ]);
    const mappings = await mappingsRes.json();
    const entities = await entitiesRes.json();

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Structure & Map Fields</h4>
            <div class="btn-group">
                <button class="btn btn-outline-dark btn-sm">Save Profile</button>
                <button class="btn btn-primary btn-sm">Apply Mappings</button>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-md-3">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Target Entities</h6>
                        <div class="list-group list-group-flush small">
                            ${entities.map(e => `
                                <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0">
                                    <span>${e}</span>
                                    <i class="bi bi-chevron-right text-muted"></i>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <table class="table table-hover mb-0 small">
                            <thead class="bg-light">
                                <tr>
                                    <th>Source Field</th>
                                    <th>Target Entity</th>
                                    <th>Target Field</th>
                                    <th>Transform</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mappings.slice(0, 10).map(m => `
                                    <tr>
                                        <td>${m.source_field}</td>
                                        <td>
                                            <select class="form-select form-select-sm" style="font-size: 0.75rem;">
                                                <option>${m.data_entity || 'None'}</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select class="form-select form-select-sm" style="font-size: 0.75rem;">
                                                <option>${m.target_field || 'None'}</option>
                                            </select>
                                        </td>
                                        <td><span class="text-muted italic">None</span></td>
                                        <td><span class="badge ${m.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}">${m.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPrepareModernOverview(container) {
    container.innerHTML = `
        <div class="row g-4">
            <div class="col-md-8">
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <h5 class="fw-bold mb-4">Ingestion Progress</h5>
                        <div class="row text-center">
                            <div class="col">
                                <div class="h3 fw-bold mb-0">5</div>
                                <div class="small text-muted text-uppercase">Sources Active</div>
                            </div>
                            <div class="col border-start">
                                <div class="h3 fw-bold mb-0">2,847</div>
                                <div class="small text-muted text-uppercase">Total Items</div>
                            </div>
                            <div class="col border-start">
                                <div class="h3 fw-bold mb-0">412</div>
                                <div class="small text-muted text-uppercase">In Staging</div>
                            </div>
                            <div class="col border-start">
                                <div class="h3 fw-bold mb-0 text-success">2,435</div>
                                <div class="small text-muted text-uppercase">Ready</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="fw-bold mb-3">Data Source Timeline (Last 24h)</h5>
                        <div class="timeline small">
                            <div class="d-flex mb-3">
                                <div class="me-3 text-muted">09:15</div>
                                <div class="flex-grow-1">
                                    <div class="fw-bold"><i class="bi bi-check-circle-fill text-success me-1"></i> CMDB Sync</div>
                                    <div class="text-muted">1,245 items synced <span class="text-success">+892 new</span></div>
                                </div>
                            </div>
                            <div class="d-flex mb-3">
                                <div class="me-3 text-muted">08:30</div>
                                <div class="flex-grow-1">
                                    <div class="fw-bold"><i class="bi bi-check-circle-fill text-success me-1"></i> Excel Upload</div>
                                    <div class="text-muted">487 items uploaded <span class="text-warning">+45 duplicates</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card shadow-sm mb-4 bg-primary text-white">
                    <div class="card-body">
                        <h5 class="fw-bold mb-3">Overall Quality Score</h5>
                        <div class="d-flex align-items-center gap-3">
                            <div class="display-4 fw-bold">86%</div>
                            <div class="flex-grow-1">
                                <div class="progress bg-white bg-opacity-25" style="height: 10px;">
                                    <div class="progress-bar bg-white" style="width: 86%"></div>
                                </div>
                            </div>
                        </div>
                        <hr class="bg-white bg-opacity-50">
                        <div class="small">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Completeness</span><span>78%</span>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>Consistency</span><span>92%</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Validity</span><span>88%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="fw-bold mb-3">Next Actions</h5>
                        <ul class="list-unstyled mb-0">
                            <li class="mb-3 d-flex align-items-start">
                                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                                <div>
                                    <div class="fw-bold small">Resolve 2 Conflicts</div>
                                    <div class="text-muted" style="font-size: 0.75rem;">Source overlap in CMDB & Excel</div>
                                </div>
                            </li>
                            <li class="mb-3 d-flex align-items-start">
                                <i class="bi bi-diagram-3-fill text-primary me-2"></i>
                                <div>
                                    <div class="fw-bold small">Map 45 Fields</div>
                                    <div class="text-muted" style="font-size: 0.75rem;">New fields detected in Excel upload</div>
                                </div>
                            </li>
                            <li class="d-flex align-items-start">
                                <i class="bi bi-people-fill text-info me-2"></i>
                                <div>
                                    <div class="fw-bold small">Review 12 Duplicates</div>
                                    <div class="text-muted" style="font-size: 0.75rem;">Potential duplicate servers detected</div>
                                </div>
                            </li>
                        </ul>
                        <button class="btn btn-dark btn-sm w-100 mt-4" onclick="window.setPrepareStep('discover')">Go to Discover</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderPrepareDiscover(container) {
    const activeSub = prepareState.discoverSubview || 'overview';
    
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Discover & Ingest</h4>
        </div>
        
        <div class="mb-5">
            <h6 class="fw-bold mb-3">Ingestion Methods</h6>
            <div class="row g-4">
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 cursor-pointer hover-shadow border-0" onclick="window.showUploadModalOld()">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-file-earmark-excel fs-1 text-success mb-2"></i>
                            <h6 class="mb-1">File Ingestion</h6>
                            <p class="small text-muted mb-0">Upload Excel or CSV files</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 cursor-pointer hover-shadow ${activeSub === 'scans' ? 'border border-primary' : 'border-0'}" onclick="window.setDiscoverSubview('scans')">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-broadcast fs-1 text-info mb-2"></i>
                            <h6 class="mb-1">Network Scan</h6>
                            <p class="small text-muted mb-0">Discover assets on network</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 border-0 opacity-75">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-database-fill fs-1 text-primary mb-2"></i>
                            <h6 class="mb-1">CMDB Connect</h6>
                            <p class="small text-muted mb-0">Sync from ServiceNow/Jira</p>
                            <span class="badge bg-light text-dark rounded-pill mt-2">Soon</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 border-0 opacity-75">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-pencil-square fs-1 text-warning mb-2"></i>
                            <h6 class="mb-1">Manual Entry</h6>
                            <p class="small text-muted mb-0">Add assets individually</p>
                            <span class="badge bg-light text-dark rounded-pill mt-2">v2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="method-details-container" class="mb-5" style="${activeSub === 'scans' ? '' : 'display: none;'}"></div>

        <div id="data-sources-container"></div>
    `;

    renderActiveSources(document.getElementById('data-sources-container'));
    
    if (activeSub === 'scans') {
        await window.renderNetworkScanView(document.getElementById('method-details-container'));
    }
}

window.setDiscoverSubview = async (subview) => {
    if (prepareState.discoverSubview === subview) {
        prepareState.discoverSubview = 'overview';
    } else {
        prepareState.discoverSubview = subview;
    }
    await renderPrepareStep();
};

async function renderActiveSources(container) {
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
    
    const response = await fetch('/prepare/data-sources');
    const sources = await response.json();
    
    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Active Data Sources</h6>
                <span class="badge bg-light text-dark rounded-pill">${sources.length} active</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 small">
                        <thead class="bg-light">
                            <tr>
                                <th>Source Name</th>
                                <th>Type</th>
                                <th>Data Ingested</th>
                                <th>Status</th>
                                <th>Items</th>
                                <th>Last Sync</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sources.map(src => `
                                <tr>
                                    <td><strong>${src.name}</strong></td>
                                    <td><span class="badge bg-light text-dark border font-monospace">${src.source_type}</span></td>
                                    <td>${src.data_ingested || 'N/A'}</td>
                                    <td>
                                        <span class="badge ${src.status === 'Success' ? 'bg-success' : (src.status === 'Syncing' ? 'bg-primary' : (src.status === 'Failed' ? 'bg-danger' : 'bg-secondary'))}">
                                            ${src.status === 'Syncing' ? '<i class="bi bi-arrow-repeat spin me-1"></i>' : ''} ${src.status}
                                        </span>
                                    </td>
                                    <td>${src.records.toLocaleString()}</td>
                                    <td>${src.last_sync}</td>
                                    <td><button class="btn btn-link btn-sm p-0 text-muted"><i class="bi bi-three-dots"></i></button></td>
                                </tr>
                            `).join('')}
                            ${sources.length === 0 ? '<tr><td colspan="7" class="text-center py-4 text-muted">No data sources found.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

window.renderNetworkScanView = async (container) => {
    const response = await fetch('/prepare/scans');
    const scans = await response.json();

    container.innerHTML = `
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Network Scans</h6>
                <button class="btn btn-dark btn-sm" onclick="window.showNewScanModal()"><i class="bi bi-plus-lg me-1"></i> New Scan</button>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0 small">
                    <thead class="bg-light">
                        <tr>
                            <th>Scan Name</th>
                            <th>Target Range</th>
                            <th>Status</th>
                            <th>Items</th>
                            <th>Last Run</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${scans.map(s => `
                            <tr>
                                <td><strong>${s.name}</strong></td>
                                <td><code>${s.target_range}</code></td>
                                <td>
                                    <span class="badge bg-${s.status === 'Completed' ? 'success' : (s.status === 'Failed' ? 'danger' : (s.status === 'Running' ? 'primary' : 'secondary'))}">
                                        ${s.status}
                                    </span>
                                </td>
                                <td>${s.discovered_items}</td>
                                <td>${s.end_time || s.start_time || 'Never'}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-primary btn-xs" onclick="window.runNetworkScan('${s.id}')" ${s.status === 'Running' ? 'disabled' : ''}>
                                            <i class="bi bi-play-fill"></i> Run
                                        </button>
                                        <button class="btn btn-outline-dark btn-xs" onclick="window.viewScanResults('${s.id}')">
                                            <i class="bi bi-eye"></i> Results
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div id="scan-results-container"></div>
    `;
}

window.showNewScanModal = () => {
    const modalHtml = `
        <div class="modal fade" id="newScanModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">New Network Scan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="new-scan-form">
                            <div class="mb-3">
                                <label class="form-label">Scan Name</label>
                                <input type="text" class="form-control" id="scan-name" placeholder="e.g. DC1 Subnet A" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Target Range (CIDR)</label>
                                <input type="text" class="form-control" id="scan-target" placeholder="e.g. 192.168.1.0/24" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="window.createNewScan()">Create Scan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    let modalEl = document.getElementById('newScanModal');
    if (modalEl) modalEl.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('newScanModal'));
    modal.show();
}

window.createNewScan = async () => {
    const name = document.getElementById('scan-name').value;
    const target_range = document.getElementById('scan-target').value;
    
    if (!name || !target_range) return;
    
    const response = await fetch('/prepare/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, target_range })
    });
    
    if (response.ok) {
        bootstrap.Modal.getInstance(document.getElementById('newScanModal')).hide();
        window.setDiscoverSubview('scans');
    }
}

window.runNetworkScan = async (scanId) => {
    const response = await fetch(`/prepare/scans/${scanId}/run`, { method: 'POST' });
    if (response.ok) {
        await window.setDiscoverSubview('scans');
        // View results of the run
        window.viewScanResults(scanId);
    }
}

window.viewScanResults = async (scanId) => {
    const response = await fetch(`/prepare/scans/${scanId}`);
    const scan = await response.json();
    
    const container = document.getElementById('scan-results-container');
    if (!container) return;
    
    if (!scan.results || scan.results.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">No results found for this scan. Run it first or check for errors.</div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
                <h6 class="fw-bold mb-0">Results for ${scan.name}</h6>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0 small">
                    <thead class="bg-light">
                        <tr>
                            <th>IP Address</th>
                            <th>Hostname</th>
                            <th>Detected Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${scan.results.map(r => `
                            <tr>
                                <td><code>${r.ip}</code></td>
                                <td>${r.hostname}</td>
                                <td><span class="badge bg-light text-dark border">${r.type}</span></td>
                                <td><button class="btn btn-link btn-sm p-0">Details</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.renderPrepare = renderPrepare;
