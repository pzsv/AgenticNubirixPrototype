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
                            <button class="btn btn-dark btn-sm" onclick="window.showUploadModalOld()"><i class="bi bi-paperclip me-1"></i> Upload File</button>
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
                <button class="btn btn-outline-dark btn-sm" onclick="window.showUploadModalOld()">Upload Files</button>
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
    const [mappingsRes, entitiesRes, datasetsRes, fieldsRes] = await Promise.all([
        fetch('/prepare/field-mappings'),
        fetch('/data-dictionary/entities'),
        fetch('/prepare/datasets'),
        fetch('/data-dictionary/fields')
    ]);
    const mappings = await mappingsRes.json();
    const entities = await entitiesRes.json();
    const datasets = await datasetsRes.json();
    const allFields = await fieldsRes.json();
    
    // Filter logic
    const searchTerm = (prepareOldState.mapSearch || '').toLowerCase();
    const filterSource = prepareOldState.mapFilterSource || 'Data Source';
    const filterStatus = prepareOldState.mapFilterStatus || 'Status';
    const filterWorksheet = prepareOldState.mapFilterWorksheet || 'Worksheet';

    const filteredMappings = mappings.filter(m => {
        const matchesSearch = !searchTerm || m.source_field.toLowerCase().includes(searchTerm);
        const matchesSource = filterSource === 'Data Source' || m.data_source === filterSource;
        const matchesStatus = filterStatus === 'Status' || m.status === filterStatus;
        const matchesWorksheet = filterWorksheet === 'Worksheet' || m.worksheet === filterWorksheet;
        return matchesSearch && matchesSource && matchesStatus && matchesWorksheet;
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
                <select class="form-select form-select-sm" onchange="window.setMapOldFilter('mapFilterWorksheet', this.value)">
                    <option>Worksheet</option>
                    ${[...new Set(mappings.filter(m => filterSource === 'Data Source' || m.data_source === filterSource).map(m => m.worksheet))].map(ws => `<option ${prepareOldState.mapFilterWorksheet === ws ? 'selected' : ''}>${ws}</option>`).join('')}
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
                        ${filteredMappings.map(m => {
                            const entityFields = allFields.filter(f => f.entity === m.data_entity);
                            return `
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
                                        ${entityFields.map(f => `<option value="${f.name}" ${m.target_field === f.name ? 'selected' : ''}>${f.name}</option>`).join('')}
                                    </select>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="badge ${m.status === 'Resolved' ? 'bg-success' : m.status === 'Pending' ? 'bg-danger' : 'bg-secondary'}">
                                            ${m.status}
                                        </span>
                                        ${m.status === 'Pending' && m.data_entity && m.target_field ? 
                                            `<button class="btn btn-link btn-sm p-0 ms-2" onclick="window.updateMappingOld('${m.id}', 'status', 'Resolved')" title="Approve Recommendation">
                                                <i class="bi bi-check-circle text-success"></i>
                                            </button>` : ''
                                        }
                                    </div>
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" ${m.process ? 'checked' : ''} onchange="window.updateMappingOld('${m.id}', 'process', this.checked)">
                                    </div>
                                </td>
                            </tr>
                        `;}).join('')}
                        ${filteredMappings.length === 0 ? '<tr><td colspan="7" class="text-center py-4 text-muted">No mappings found matching filters.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
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

window.showWorksheetPreviewModal = (workbook, sheetName, onSelect) => {
    if (!workbook) {
        alert('Please select a file first');
        return;
    }
    
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
        alert(`Sheet "${sheetName}" not found in workbook`);
        return;
    }

    // Get first 15 rows
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: '' }).slice(0, 15);
    
    const modalHtml = `
        <div class="modal fade" id="previewHeaderModal" tabindex="-1" style="z-index: 1070;">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content shadow-lg">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold">Select Header Row: ${sheetName}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="small text-muted mb-3">Click on the row that contains the column headers (ingested field names).</p>
                        <div class="table-responsive">
                            <table class="table table-sm table-hover table-bordered small">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 60px;" class="text-center">Row #</th>
                                        ${data[0] ? data[0].map((_, i) => `<th>Column ${i+1}</th>`).join('') : '<th>No data found</th>'}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.map((row, rowIndex) => `
                                        <tr style="cursor: pointer;" onclick="window.selectHeaderRow(${rowIndex + 1})">
                                            <td class="bg-light fw-bold text-center">${rowIndex + 1}</td>
                                            ${row.map(cell => `<td>${cell === undefined || cell === null ? '' : cell}</td>`).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existing = document.getElementById('previewHeaderModal');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('previewHeaderModal'));
    
    window.selectHeaderRow = (rowNum) => {
        onSelect(rowNum);
        modal.hide();
    };
    
    modal.show();
};

window.showUploadModalOld = (callback) => {
    let currentWorkbook = null;

    const addWorksheetRow = (name = '', headerRow = 1) => {
        const container = document.getElementById('worksheets-container');
        const rowId = 'ws-' + Math.random().toString(36).substr(2, 9);
        const rowHtml = `
            <div class="row g-2 mb-2 worksheet-row align-items-end" id="${rowId}">
                <div class="col-6">
                    <label class="form-label small fw-bold mb-1">Worksheet Name *</label>
                    <input type="text" class="form-control form-control-sm" name="worksheet[]" placeholder="Case sensitive" value="${name}" required>
                </div>
                <div class="col-4">
                    <label class="form-label small fw-bold mb-1">Header Row *</label>
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control form-control-sm" name="header_row[]" value="${headerRow}" required>
                        <button class="btn btn-outline-secondary btn-preview-header" type="button" title="Select Header Row from Preview">
                            <i class="bi bi-table"></i>
                        </button>
                    </div>
                </div>
                <div class="col-2">
                    <button type="button" class="btn btn-outline-danger btn-sm border-0 remove-worksheet" onclick="this.closest('.worksheet-row').remove()" title="Remove Worksheet">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', rowHtml);
        
        const rowElement = document.getElementById(rowId);
        rowElement.querySelector('.btn-preview-header').onclick = () => {
            const worksheetName = rowElement.querySelector('input[name="worksheet[]"]').value;
            if (!worksheetName) {
                alert('Please enter or select a worksheet name first');
                return;
            }
            window.showWorksheetPreviewModal(currentWorkbook, worksheetName, (selectedRow) => {
                rowElement.querySelector('input[name="header_row[]"]').value = selectedRow;
            });
        };
    };

    const modalHtml = `
        <div class="modal fade" id="uploadModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold">Upload Files</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body pt-2">
                        <p class="text-muted small mb-4">Select an Excel or CSV file. Sheet names will be automatically detected.</p>
                        
                        <form id="upload-form">
                            <div class="card border-0 bg-light mb-4">
                                <div class="card-body">
                                    <div class="mb-4">
                                        <label class="form-label small fw-bold">Data Source Name *</label>
                                        <input type="text" class="form-control" name="name" placeholder="e.g. CMDB Export 2024" required>
                                    </div>

                                    <div class="row g-3 mb-4">
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold">Ingestion Rating *</label>
                                            <select class="form-select" name="rating">
                                                <option value="Bronze">Bronze (Raw/Untrusted)</option>
                                                <option value="Silver">Silver (Validated)</option>
                                                <option value="Gold">Gold (Authoritative)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="upload-zone p-4 mb-4 text-center border border-dashed rounded bg-white cursor-pointer" onclick="document.getElementById('fileInput').click()">
                                        <i class="bi bi-file-earmark-arrow-up fs-1 text-primary mb-2 d-block"></i>
                                        <div class="fw-bold">Click to Browse or Drag & Drop</div>
                                        <div class="small text-muted">Supports .xlsx, .xls, .csv</div>
                                        <input type="file" id="fileInput" name="file" class="d-none" accept=".csv,.xlsx,.xls" required>
                                        <div id="file-name" class="fw-bold mt-2 text-success"></div>
                                    </div>

                                    <div id="worksheets-section" style="display: none;">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 class="fw-bold mb-0">Worksheets to Ingest</h6>
                                            <button type="button" class="btn btn-link btn-sm p-0 text-decoration-none" id="btn-add-worksheet">+ Add Worksheet</button>
                                        </div>
                                        <div id="worksheets-container" class="mb-3">
                                            <!-- Worksheet rows will be added here -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary px-5">Upload & Process</button>
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

    document.getElementById('btn-add-worksheet').onclick = () => addWorksheetRow();

    document.getElementById('fileInput').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('worksheets-section').style.display = 'block';
        
        // Clear existing rows
        document.getElementById('worksheets-container').innerHTML = '';

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            currentWorkbook = XLSX.read(data, { type: 'array' });
            
            if (currentWorkbook.SheetNames.length > 0) {
                currentWorkbook.SheetNames.forEach(sheet => {
                    addWorksheetRow(sheet, 1);
                });
            } else {
                addWorksheetRow(file.name, 1);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    document.getElementById('upload-form').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Collect worksheets and header rows
        const worksheetInputs = form.querySelectorAll('input[name="worksheet[]"]');
        const headerRowInputs = form.querySelectorAll('input[name="header_row[]"]');
        
        const worksheets = [];
        for (let i = 0; i < worksheetInputs.length; i++) {
            worksheets.push({
                name: worksheetInputs[i].value,
                header_row: parseInt(headerRowInputs[i].value) || 1
            });
        }
        
        formData.append('worksheets_json', JSON.stringify(worksheets));
        
        // Remove individual worksheet/header_row from formData as we are using JSON
        formData.delete('worksheet[]');
        formData.delete('header_row[]');
        
        const res = await fetch('/prepare/upload', {
            method: 'POST',
            body: formData
        });
        
        if (res.ok) {
            modal.hide();
            const data = await res.json();
            if (callback) {
                callback(data);
            } else if (window.currentModule === 'prepare') {
                window.renderPrepare();
            } else {
                window.renderPrepareOld();
                window.setPrepareOldStep('map');
            }
        } else {
            const err = await res.json();
            alert('Upload failed: ' + err.detail);
        }
    };
};

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
            if (window.currentModule === 'prepare') {
                window.renderPrepare();
            } else {
                window.renderPrepareOld();
            }
        }
    };
}

window.renderPrepareOld = renderPrepareOld;
