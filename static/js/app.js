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
            case 'data-dictionary':
                await renderDataDictionary();
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
    let prepareState = {
        currentStep: 'overview'
    };

    async function renderPrepare() {
        const html = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Prepare</h2>
                <div class="stepper d-flex align-items-center">
                    <div class="step ${prepareState.currentStep === 'overview' ? 'active' : ''}" onclick="window.setPrepareStep('overview')">
                        <i class="bi bi-window me-1"></i> Overview
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${prepareState.currentStep === 'ingest' ? 'active' : ''}" onclick="window.setPrepareStep('ingest')">
                        <i class="bi bi-arrow-repeat me-1"></i> Ingest
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${prepareState.currentStep === 'map' ? 'active' : ''}" onclick="window.setPrepareStep('map')">
                        <i class="bi bi-diagram-3 me-1"></i> Map Fields
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${prepareState.currentStep === 'normalise' ? 'active' : ''}" onclick="window.setPrepareStep('normalise')">
                        <i class="bi bi-gear me-1"></i> Normalise
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${prepareState.currentStep === 'aggregate' ? 'active' : ''}" onclick="window.setPrepareStep('aggregate')">
                        <i class="bi bi-intersect me-1"></i> Aggregate
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${prepareState.currentStep === 'publish' ? 'active' : ''}" onclick="window.setPrepareStep('publish')">
                        <i class="bi bi-file-earmark-check me-1"></i> Publish
                    </div>
                </div>
            </div>
            <div id="prepare-content"></div>
        `;
        
        contentArea.innerHTML = html;
        renderPrepareStep();
    }

    window.setPrepareStep = (step) => {
        prepareState.currentStep = step;
        renderPrepareStep();
    };

    async function renderPrepareStep() {
        const stepArea = document.getElementById('prepare-content');
        if (!stepArea) return;

        // Update stepper active state
        document.querySelectorAll('.stepper .step').forEach(el => {
            el.classList.toggle('active', el.textContent.trim().toLowerCase().includes(prepareState.currentStep.toLowerCase()));
        });

        switch(prepareState.currentStep) {
            case 'overview':
                renderPrepareOverview(stepArea);
                break;
            case 'ingest':
                await renderPrepareIngest(stepArea);
                break;
            case 'map':
                await renderPrepareMap(stepArea);
                break;
            case 'normalise':
                stepArea.innerHTML = '<h4>Normalise</h4><p>Coming soon...</p>';
                break;
            case 'aggregate':
                stepArea.innerHTML = '<h4>Aggregate</h4><p>Coming soon...</p>';
                break;
            case 'publish':
                stepArea.innerHTML = '<h4>Publish</h4><p>Coming soon...</p>';
                break;
        }
    }

    function renderPrepareOverview(container) {
        container.innerHTML = `
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-arrow-repeat fs-4 me-2"></i>
                                <h5 class="card-title mb-0">Ingest</h5>
                            </div>
                            <p class="card-text text-muted small">Upload your spreadsheet file or manually input configuration items.</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-dark btn-sm"><i class="bi bi-download me-1"></i> Template</button>
                                <button class="btn btn-dark btn-sm" onclick="window.showUploadModal()"><i class="bi bi-paperclip me-1"></i> Upload File</button>
                                <button class="btn btn-outline-primary btn-sm" onclick="window.setPrepareStep('ingest')">View Data</button>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-primary btn-sm w-100" onclick="window.showManualInputModal()">Manual Input</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-diagram-3 fs-4 me-2"></i>
                                <h5 class="card-title mb-0">Map Fields</h5>
                            </div>
                            <p class="card-text text-muted small">Map your source fields to target schema fields. Required fields must be mapped.</p>
                            <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareStep('map')">Map Fields</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-gear fs-4 me-2"></i>
                                <h5 class="card-title mb-0">Normalise</h5>
                            </div>
                            <p class="card-text text-muted small">Map uploaded values to standard values in the data dictionary to ensure data consistency.</p>
                            <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareStep('normalise')">Normalise Data</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-intersect fs-4 me-2"></i>
                                <h5 class="card-title mb-0">Aggregate</h5>
                            </div>
                            <p class="card-text text-muted small">Review and resolve data conflicts before publishing.</p>
                            <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareStep('aggregate')">Aggregate Data</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-file-earmark-check fs-4 me-2"></i>
                                <h5 class="card-title mb-0">Publish</h5>
                            </div>
                            <p class="card-text text-muted small">Review and publish changes.</p>
                            <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareStep('publish')">Publish</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async function renderPrepareIngest(container) {
        const response = await fetch('/prepare/datasets');
        const datasets = await response.json();
        
        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                    <i class="bi bi-arrow-repeat fs-4 me-2"></i>
                    <h4 class="mb-0">Ingest</h4>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-dark btn-sm" onclick="window.showUploadModal()">Upload Files</button>
                    <button class="btn btn-outline-dark btn-sm">Download Template</button>
                    <button class="btn btn-primary btn-sm" onclick="window.setPrepareStep('map')">Map Fields</button>
                </div>
            </div>
            
            <div class="card shadow-sm">
                <div class="card-body p-0">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th>Ingest Name <i class="bi bi-arrow-up"></i></th>
                                <th>Last Uploaded</th>
                                <th>Records</th>
                                <th>Upload Count</th>
                                <th>Process</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${datasets.map(ds => `
                                <tr>
                                    <td>${ds.name}</td>
                                    <td>${ds.last_uploaded}</td>
                                    <td>${ds.records}</td>
                                    <td>${ds.upload_count}</td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" ${ds.process ? 'checked' : ''}>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async function renderPrepareMap(container) {
        const [mappingsRes, entitiesRes, datasetsRes] = await Promise.all([
            fetch('/prepare/field-mappings'),
            fetch('/data-dictionary/entities'),
            fetch('/prepare/datasets')
        ]);
        const mappings = await mappingsRes.json();
        const entities = await entitiesRes.json();
        const datasets = await datasetsRes.json();
        
        // Filter logic
        const searchTerm = (prepareState.mapSearch || '').toLowerCase();
        const filterSource = prepareState.mapFilterSource || 'Data Source';
        const filterStatus = prepareState.mapFilterStatus || 'Status';

        const filteredMappings = mappings.filter(m => {
            const matchesSearch = !searchTerm || m.source_field.toLowerCase().includes(searchTerm);
            const matchesSource = filterSource === 'Data Source' || m.data_source === filterSource;
            const matchesStatus = filterStatus === 'Status' || m.status === filterStatus;
            return matchesSearch && matchesSource && matchesStatus;
        });

        const resolvedCount = mappings.filter(m => m.status === 'Resolved').length;
        const totalCount = mappings.length;
        const percent = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                    <i class="bi bi-diagram-3 fs-4 me-2"></i>
                    <div>
                        <h4 class="mb-0">Map Fields</h4>
                        <small class="text-muted">Map your source fields to target schema fields.</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-end">
                        <small class="d-block text-muted">${resolvedCount}/${totalCount} resolved</small>
                        <div class="progress" style="height: 5px; width: 100px;">
                            <div class="progress-bar bg-primary" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <span class="fw-bold">${percent}%</span>
                    <button class="btn btn-primary btn-sm" onclick="window.setPrepareStep('normalise')">Normalise</button>
                </div>
            </div>

            <div class="row g-2 mb-3">
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control border-start-0" placeholder="Search" value="${prepareState.mapSearch || ''}" oninput="window.setMapFilter('mapSearch', this.value)">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select form-select-sm" onchange="window.setMapFilter('mapFilterSource', this.value)">
                        <option>Data Source</option>
                        ${[...new Set(mappings.map(m => m.data_source))].map(ds => `<option ${filterSource === ds ? 'selected' : ''}>${ds}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select form-select-sm">
                        <option>Worksheet</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select form-select-sm" onchange="window.setMapFilter('mapFilterStatus', this.value)">
                        <option>Status</option>
                        <option ${filterStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option ${filterStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-body p-0">
                    <table class="table table-hover mb-0" style="font-size: 0.85rem;">
                        <thead class="bg-light">
                            <tr>
                                <th>Source Field</th>
                                <th>Data Source</th>
                                <th>Worksheet</th>
                                <th>Data Entity</th>
                                <th>Target Field</th>
                                <th>Status</th>
                                <th>Process</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredMappings.map(m => `
                                <tr>
                                    <td>${m.source_field}</td>
                                    <td class="text-muted">${m.data_source}</td>
                                    <td class="text-muted">${m.worksheet}</td>
                                    <td>
                                        <select class="form-select form-select-sm" onchange="window.updateMapping('${m.id}', 'data_entity', this.value)">
                                            <option value="">Choose Data Entity</option>
                                            ${entities.map(e => `<option value="${e}" ${m.data_entity === e ? 'selected' : ''}>${e}</option>`).join('')}
                                        </select>
                                    </td>
                                    <td>
                                        <select class="form-select form-select-sm" id="target-field-${m.id}" onchange="window.updateMapping('${m.id}', 'target_field', this.value)">
                                            <option value="">Choose field</option>
                                            ${m.target_field ? `<option value="${m.target_field}" selected>${m.target_field}</option>` : ''}
                                        </select>
                                    </td>
                                    <td>
                                        <span class="badge ${m.status === 'Resolved' ? 'bg-success' : m.status === 'Pending' ? 'bg-danger' : 'bg-secondary'}">
                                            ${m.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" ${m.process ? 'checked' : ''} onchange="window.updateMapping('${m.id}', 'process', this.checked)">
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                            ${filteredMappings.length === 0 ? '<tr><td colspan="7" class="text-center py-4 text-muted">No mappings found matching filters.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Add event listeners for entity selection to load fields
        for (const m of filteredMappings) {
            if (m.data_entity) {
                await window.updateTargetFieldsDropdown(m.id, m.data_entity, m.target_field);
            }
        }
    }

    window.setMapFilter = (key, value) => {
        prepareState[key] = value;
        renderPrepareStep();
    };

    window.updateMapping = async (id, field, value) => {
        const updates = { [field]: value };
        if (field === 'data_entity') {
            updates.target_field = null;
            await window.updateTargetFieldsDropdown(id, value);
        }
        
        // Auto-resolve if both entity and field are selected
        if (field === 'target_field' && value) {
            updates.status = 'Resolved';
        } else if (field === 'data_entity' && !value) {
            updates.status = 'Pending';
        }
        
        await fetch(`/prepare/field-mappings/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        
        renderPrepareStep();
    };

    window.updateTargetFieldsDropdown = async (mappingId, entity, selectedField = null) => {
        const select = document.getElementById(`target-field-${mappingId}`);
        if (!select) return;

        if (!entity) {
            select.innerHTML = '<option value="">Choose field</option>';
            return;
        }

        const response = await fetch(`/data-dictionary/fields?entity=${encodeURIComponent(entity)}`);
        const fields = await response.json();
        
        select.innerHTML = '<option value="">Choose field</option>' + 
            fields.map(f => `<option value="${f.name}" ${selectedField === f.name ? 'selected' : ''}>${f.name}</option>`).join('');
    };

    window.showUploadModal = () => {
        const modalHtml = `
            <div class="modal fade" id="uploadModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-bold">Upload Files</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-muted small">Select and upload your spreadsheet files.</p>
                            
                            <form id="upload-form">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-3">
                                            <h6 class="fw-bold mb-0">Upload File 1</h6>
                                            <i class="bi bi-trash text-muted"></i>
                                        </div>
                                        
                                        <div class="d-flex gap-4 mb-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="sourceType" id="newSource" value="new" checked>
                                                <label class="form-check-label small" for="newSource">Create new data source</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="sourceType" id="existingSource" value="existing">
                                                <label class="form-check-label small" for="existingSource">Choose an existing data source</label>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label small fw-bold">Data Source *</label>
                                            <input type="text" class="form-control form-control-sm" name="name" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label small fw-bold">Ingestion Rating *</label>
                                            <select class="form-select form-select-sm" name="rating">
                                                <option value="Bronze">Bronze</option>
                                                <option value="Silver">Silver</option>
                                                <option value="Gold">Gold</option>
                                            </select>
                                        </div>

                                        <div class="upload-zone p-4 mb-3 text-center border border-dashed rounded bg-light">
                                            <i class="bi bi-file-earmark-arrow-up fs-2 mb-2 d-block"></i>
                                            <span class="small">Drop files to attach or <label for="fileInput" class="text-primary cursor-pointer" style="cursor:pointer">Browse</label></span>
                                            <input type="file" id="fileInput" name="file" class="d-none" accept=".csv,.xlsx,.xls" required>
                                            <div id="file-name" class="small mt-2 text-success"></div>
                                        </div>

                                        <div class="row g-2 mb-3">
                                            <div class="col">
                                                <label class="form-label small fw-bold">Worksheet Name *</label>
                                                <input type="text" class="form-control form-control-sm" name="worksheet" placeholder="Case sensitive" required>
                                            </div>
                                            <div class="col">
                                                <label class="form-label small fw-bold">Header Location *</label>
                                                <input type="number" class="form-control form-control-sm" name="header_row" value="1" required>
                                            </div>
                                        </div>
                                        
                                        <button type="button" class="btn btn-link btn-sm p-0 text-decoration-none">+ Add Worksheet</button>
                                    </div>
                                </div>
                                
                                <button type="button" class="btn btn-outline-dark btn-sm">+ Add Upload</button>
                                
                                <div class="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-dark btn-sm px-4">Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existing = document.getElementById('uploadModal');
        if (existing) existing.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
        modal.show();

        document.getElementById('fileInput').onchange = (e) => {
            const fileName = e.target.files[0]?.name;
            document.getElementById('file-name').textContent = fileName || '';
        };

        document.getElementById('upload-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const res = await fetch('/prepare/upload', {
                method: 'POST',
                body: formData
            });
            
            if (res.ok) {
                modal.hide();
                prepareState.currentStep = 'ingest';
                renderPrepare();
            } else {
                const err = await res.json();
                alert('Upload failed: ' + err.detail);
            }
        };
    }

    window.showManualInputModal = async () => {
        const entitiesRes = await fetch('/data-dictionary/entities');
        const entities = await entitiesRes.json();

        const modalHtml = `
            <div class="modal fade" id="manualInputModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title fw-bold">Manual CI Input</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="manual-ci-form">
                                <div class="mb-3">
                                    <label class="form-label small fw-bold">Name</label>
                                    <input type="text" class="form-control form-control-sm" name="name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label small fw-bold">Entity Type</label>
                                    <select class="form-select form-select-sm" name="type" required>
                                        ${entities.map(e => `<option value="${e.toLowerCase().replace(' ', '_')}">${e}</option>`).join('')}
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label small fw-bold">Description</label>
                                    <textarea class="form-control form-control-sm" name="description"></textarea>
                                </div>
                                <div class="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-dark btn-sm px-4">Create CI</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existing = document.getElementById('manualInputModal');
        if (existing) existing.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('manualInputModal'));
        modal.show();

        document.getElementById('manual-ci-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.properties = {};
            
            const res = await fetch('/prepare/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                modal.hide();
                alert('CI created successfully!');
                renderPrepare();
            }
        };
    }

    // --- Module: Map ---

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

    // --- Module: Data Dictionary ---
    window.renderDataDictionary = async (entityFilter = '', searchFilter = '') => {
        const url = new URL('/data-dictionary/fields', window.location.origin);
        if (entityFilter) url.searchParams.append('entity', entityFilter);
        if (searchFilter) url.searchParams.append('search', searchFilter);
        
        const response = await fetch(url);
        const fields = await response.json();
        
        const entitiesResponse = await fetch('/data-dictionary/entities');
        const entities = await entitiesResponse.json();

        let html = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold">Data Dictionary</h3>
                <button class="btn btn-primary" id="btn-add-standard-value">
                    <i class="bi bi-plus-lg me-1"></i> Add Standard Value
                </button>
            </div>

            <div class="card mb-4 border-0 shadow-sm">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                                <input type="text" id="dictionary-search" class="form-control border-start-0" placeholder="Search Field Names, Data Entities and Standard Values..." value="${searchFilter}">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <select id="dictionary-entity-filter" class="form-select">
                                <option value="">All Data Entities</option>
                                ${entities.map(e => `<option value="${e}" ${e === entityFilter ? 'selected' : ''}>${e}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Field Name</th>
                                <th>Data Entity</th>
                                <th>Standard Values</th>
                                <th width="50"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fields.map(field => `
                                <tr style="cursor: pointer" onclick="window.renderFieldStandardValues('${field.id}')">
                                    <td class="ps-4 fw-bold text-primary">${field.name}</td>
                                    <td>${field.entity}</td>
                                    <td>
                                        <div class="text-truncate" style="max-width: 400px;">
                                            ${field.standard_values.map(sv => `<span class="badge bg-light text-dark border me-1 fw-normal">${sv.value}</span>`).join('')}
                                        </div>
                                    </td>
                                    <td class="text-end pe-4"><i class="bi bi-chevron-right text-muted"></i></td>
                                </tr>
                            `).join('')}
                            ${fields.length === 0 ? '<tr><td colspan="4" class="text-center py-5 text-muted">No fields found matching your criteria.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="addStandardValueModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-bottom-0 pt-4 px-4">
                            <h5 class="modal-title fw-bold">Add Standard Value</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body px-4">
                            <form id="add-standard-value-form">
                                <div class="mb-3">
                                    <label class="form-label text-muted small text-uppercase">Data Field</label>
                                    <select class="form-select" name="field_id" required>
                                        <option value="" disabled selected>Select a field...</option>
                                        ${fields.map(f => `<option value="${f.id}">${f.entity} - ${f.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label text-muted small text-uppercase">Standard Value</label>
                                    <input type="text" class="form-control" name="value" placeholder="Enter standard value..." required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-top-0 pb-4 px-4">
                            <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" form="add-standard-value-form" class="btn btn-primary px-4">Add Value</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

        // Add event listeners
        document.getElementById('dictionary-search').addEventListener('input', debounce((e) => {
            window.renderDataDictionary(document.getElementById('dictionary-entity-filter').value, e.target.value);
        }, 500));

        document.getElementById('dictionary-entity-filter').addEventListener('change', (e) => {
            window.renderDataDictionary(e.target.value, document.getElementById('dictionary-search').value);
        });

        const modalElement = document.getElementById('addStandardValueModal');
        const modal = new bootstrap.Modal(modalElement);

        document.getElementById('btn-add-standard-value').addEventListener('click', () => {
            modal.show();
        });

        document.getElementById('add-standard-value-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            const response = await fetch('/data-dictionary/standard-values', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                modal.hide();
                // Wait for modal animation
                setTimeout(() => window.renderDataDictionary(entityFilter, searchFilter), 300);
            }
        });
    }

    window.renderFieldStandardValues = async (fieldId) => {
        const response = await fetch(`/data-dictionary/fields?field_id=${fieldId}`);
        const fields = await response.json();
        if (fields.length === 0) return;
        const field = fields[0];

        let html = `
            <div class="mb-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#" onclick="window.renderDataDictionary(); return false;">Data Dictionary</a></li>
                        <li class="breadcrumb-item active text-muted">${field.entity}</li>
                    </ol>
                </nav>
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="fw-bold">${field.name}</h3>
                    <button class="btn btn-primary" id="btn-add-sv-direct">
                        <i class="bi bi-plus-lg me-1"></i> Add Standard Value
                    </button>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Standard Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${field.standard_values.map(sv => `
                                <tr>
                                    <td class="ps-4">${sv.value}</td>
                                </tr>
                            `).join('')}
                            ${field.standard_values.length === 0 ? '<tr><td class="text-center py-5 text-muted">No standard values added yet.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal -->
             <div class="modal fade" id="addStandardValueModalDirect" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-bottom-0 pt-4 px-4">
                            <h5 class="modal-title fw-bold">Add Standard Value to ${field.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body px-4">
                            <form id="add-sv-form-direct">
                                <input type="hidden" name="field_id" value="${field.id}">
                                <div class="mb-4">
                                    <label class="form-label text-muted small text-uppercase">Standard Value</label>
                                    <input type="text" class="form-control" name="value" placeholder="Enter standard value..." required autofocus>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-top-0 pb-4 px-4">
                            <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" form="add-sv-form-direct" class="btn btn-primary px-4">Add Value</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

        const modalElement = document.getElementById('addStandardValueModalDirect');
        const modal = new bootstrap.Modal(modalElement);
        document.getElementById('btn-add-sv-direct').addEventListener('click', () => modal.show());
        
        document.getElementById('add-sv-form-direct').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            const response = await fetch('/data-dictionary/standard-values', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                modal.hide();
                setTimeout(() => window.renderFieldStandardValues(fieldId), 300);
            }
        });
    }

    // Helper: Debounce
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
