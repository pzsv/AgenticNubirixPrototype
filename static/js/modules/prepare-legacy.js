// --- Module: Prepare (Legacy) ---
let prepareOldState = {
    currentStep: 'overview'
};

async function renderPrepareOld() {
    const contentArea = document.getElementById('main-area');
    const html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Prepare</h2>
            <div class="stepper d-flex align-items-center">
                <div class="step ${prepareOldState.currentStep === 'overview' ? 'active' : ''}" onclick="window.setPrepareOldStep('overview')">
                    <i class="bi bi-window me-1"></i> Overview
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareOldState.currentStep === 'ingest' ? 'active' : ''}" onclick="window.setPrepareOldStep('ingest')">
                    <i class="bi bi-arrow-repeat me-1"></i> Ingest
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareOldState.currentStep === 'map' ? 'active' : ''}" onclick="window.setPrepareOldStep('map')">
                    <i class="bi bi-diagram-3 me-1"></i> Map Fields
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareOldState.currentStep === 'normalise' ? 'active' : ''}" onclick="window.setPrepareOldStep('normalise')">
                    <i class="bi bi-gear me-1"></i> Normalise
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareOldState.currentStep === 'aggregate' ? 'active' : ''}" onclick="window.setPrepareOldStep('aggregate')">
                    <i class="bi bi-intersect me-1"></i> Aggregate
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareOldState.currentStep === 'publish' ? 'active' : ''}" onclick="window.setPrepareOldStep('publish')">
                    <i class="bi bi-file-earmark-check me-1"></i> Publish
                </div>
            </div>
        </div>
        <div id="prepare-old-content"></div>
    `;
    
    contentArea.innerHTML = html;
    renderPrepareOldStep();
}

window.setPrepareOldStep = (step) => {
    prepareOldState.currentStep = step;
    renderPrepareOldStep();
};

async function renderPrepareOldStep() {
    const stepArea = document.getElementById('prepare-old-content');
    if (!stepArea) return;

    // Update stepper active state
    document.querySelectorAll('.stepper .step').forEach(el => {
        el.classList.toggle('active', el.textContent.trim().toLowerCase().includes(prepareOldState.currentStep.toLowerCase()));
    });

    switch(prepareOldState.currentStep) {
        case 'overview':
            renderPrepareOldOverview(stepArea);
            break;
        case 'ingest':
            await renderPrepareOldIngest(stepArea);
            break;
        case 'map':
            await renderPrepareOldMap(stepArea);
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

function renderPrepareOldOverview(container) {
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
                            <button class="btn btn-outline-primary btn-sm" onclick="window.setPrepareOldStep('ingest')">View Data</button>
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
                        <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareOldStep('map')">Map Fields</button>
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
                        <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareOldStep('normalise')">Normalise Data</button>
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
                        <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareOldStep('aggregate')">Aggregate Data</button>
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
                        <button class="btn btn-dark btn-sm w-100" onclick="window.setPrepareOldStep('publish')">Publish</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderPrepareOldIngest(container) {
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
                <button class="btn btn-primary btn-sm" onclick="window.setPrepareOldStep('map')">Map Fields</button>
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

async function renderPrepareOldMap(container) {
    const [mappingsRes, entitiesRes, datasetsRes] = await Promise.all([
        fetch('/prepare/field-mappings'),
        fetch('/data-dictionary/entities'),
        fetch('/prepare/datasets')
    ]);
    const mappings = await mappingsRes.json();
    const entities = await entitiesRes.json();
    const datasets = await datasetsRes.json();
    
    // Filter logic
    const searchTerm = (prepareOldState.mapSearch || '').toLowerCase();
    const filterSource = prepareOldState.mapFilterSource || 'Data Source';
    const filterStatus = prepareOldState.mapFilterStatus || 'Status';

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
                <button class="btn btn-primary btn-sm" onclick="window.setPrepareOldStep('normalise')">Normalise</button>
            </div>
        </div>

        <div class="row g-2 mb-3">
            <div class="col-md-3">
                <div class="input-group input-group-sm">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-start-0" placeholder="Search" value="${prepareOldState.mapSearch || ''}" oninput="window.setMapOldFilter('mapSearch', this.value)">
                </div>
            </div>
            <div class="col-md-2">
                <select class="form-select form-select-sm" onchange="window.setMapOldFilter('mapFilterSource', this.value)">
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
                <select class="form-select form-select-sm" onchange="window.setMapOldFilter('mapFilterStatus', this.value)">
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
                                    <select class="form-select form-select-sm" onchange="window.updateMappingOld('${m.id}', 'data_entity', this.value)">
                                        <option value="">Choose Data Entity</option>
                                        ${entities.map(e => `<option value="${e}" ${m.data_entity === e ? 'selected' : ''}>${e}</option>`).join('')}
                                    </select>
                                </td>
                                <td>
                                    <select class="form-select form-select-sm" id="target-field-${m.id}" onchange="window.updateMappingOld('${m.id}', 'target_field', this.value)">
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
                                        <input class="form-check-input" type="checkbox" ${m.process ? 'checked' : ''} onchange="window.updateMappingOld('${m.id}', 'process', this.checked)">
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
            await window.updateTargetFieldsDropdownOld(m.id, m.data_entity, m.target_field);
        }
    }
}

window.setMapOldFilter = (key, value) => {
    prepareOldState[key] = value;
    renderPrepareOldStep();
};

window.updateMappingOld = async (id, field, value) => {
    const updates = { [field]: value };
    if (field === 'data_entity') {
        updates.target_field = null;
        await window.updateTargetFieldsDropdownOld(id, value);
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
    
    renderPrepareOldStep();
};

window.updateTargetFieldsDropdownOld = async (mappingId, entity, selectedField = null) => {
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

window.showUploadModalOld = () => {
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
            // Note: This relies on renderPrepare from prepare-modernized.js
            if (window.renderPrepare) {
                window.renderPrepare();
            } else {
                window.renderPrepareOld();
            }
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
            if (window.renderPrepare) {
                window.renderPrepare();
            } else {
                window.renderPrepareOld();
            }
        }
    };
}

window.renderPrepareOld = renderPrepareOld;
