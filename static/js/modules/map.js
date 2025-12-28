// --- Module: Map ---
(function() {
    if (typeof window === 'undefined') return;

let mapState = {
    currentStep: 'source-data',
    viewType: 'table' // 'table' or 'graph'
};

window.setMapViewType = (type) => {
    mapState.viewType = type;
    renderMap();
};

window.setMapStep = (step) => {
    mapState.currentStep = step;
    renderMap();
};

async function renderMap() {
    const contentArea = document.getElementById('main-area');
    
    // Update granular help section
    if (window.setHelpSection) {
        window.setHelpSection(`help-map-${mapState.currentStep}`);
    }

    // Fetch environments and move principles
    let environments = ['PROD', 'TEST', 'DEV', 'STAGE'];
    let movePrinciples = ['Rehost', 'Relocate', 'Replatform', 'Refactor', 'Repurchase', 'Retire', 'Retain'];
    
    try {
        const envResponse = await fetch('/environments/');
        const envs = await envResponse.json();
        if (envs && envs.length > 0) {
            environments = envs.map(e => e.name);
        }

        const moveResponse = await fetch('/move-principles/');
        const principles = await moveResponse.json();
        if (principles && principles.length > 0) {
            movePrinciples = principles.map(p => p.name);
        }
    } catch (e) {
        console.error("Error fetching configuration:", e);
    }

    const html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Map</h2>
            <div class="d-flex align-items-center gap-3">
                <div class="stepper d-flex align-items-center">
                    <div class="step ${mapState.currentStep === 'source-data' ? 'active' : ''}" onclick="window.setMapStep('source-data')">
                        1) Source Data
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${mapState.currentStep === 'awis' ? 'active' : ''}" onclick="window.setMapStep('awis')">
                        2) AWIs
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${mapState.currentStep === 'dependency-links' ? 'active' : ''}" onclick="window.setMapStep('dependency-links')">
                        3) Dependency Links
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${mapState.currentStep === 's2ts' ? 'active' : ''}" onclick="window.setMapStep('s2ts')">
                        4) S2Ts
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${mapState.currentStep === 'mdgs' ? 'active' : ''}" onclick="window.setMapStep('mdgs')">
                        5) MDGs
                    </div>
                </div>

                <div class="btn-group ms-2">
                    <button class="btn btn-outline-secondary ${mapState.viewType === 'table' ? 'active' : ''}" onclick="window.setMapViewType('table')">
                        <i class="bi bi-table me-1"></i> Table
                    </button>
                    <button class="btn btn-outline-secondary ${mapState.viewType === 'graph' ? 'active' : ''}" onclick="window.setMapViewType('graph')">
                        <i class="bi bi-diagram-3 me-1"></i> Graph
                    </button>
                </div>
                
                <div class="dropdown">
                    <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-plus-lg me-1"></i> Add
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                        <li><a class="dropdown-item py-2" href="#" onclick="window.showUploadAWIModal()"><i class="bi bi-file-earmark-excel me-2 text-success"></i> Application Workload Instances (Excel)</a></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="window.showUploadDependencyModal()"><i class="bi bi-file-earmark-excel me-2 text-primary"></i> Dependency Links (Excel)</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="window.showAddAWIModal()"><i class="bi bi-plus-circle me-2"></i> Application Workload Instance (Manual)</a></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="window.showAddDependencyModal()"><i class="bi bi-plus-circle me-2"></i> Dependency Link (Manual)</a></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="window.showAddMDGModal()"><i class="bi bi-plus-circle me-2"></i> Move Dependency Group (Manual)</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="map-content"></div>
        
        <!-- Modals for Map -->
        <div class="modal fade" id="addAWIModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Add Application Workload Instance</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="add-awi-form">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">AWI Name</label>
                                <input type="text" class="form-control" name="name" placeholder="e.g. Jira" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Environment</label>
                                <select class="form-select" name="environment">
                                    ${environments.map(env => `<option value="${env}">${env}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Move Principle</label>
                                <select class="form-select" name="hosting_model">
                                    ${movePrinciples.map(mp => `<option value="${mp}">${mp}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Description</label>
                                <textarea class="form-control" name="description" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="add-awi-form" class="btn btn-primary px-4">Create AWI</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="addDependencyModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Add Dependency Link</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="add-dependency-form">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Source AWI</label>
                                <select class="form-select" name="source_workload_id" id="source-awi-select" required></select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Target AWI</label>
                                <select class="form-select" name="target_workload_id" id="target-awi-select" required></select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Environment</label>
                                <select class="form-select" name="environment">
                                    ${environments.map(env => `<option value="${env}">${env}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Dependency Level</label>
                                <select class="form-select" name="level">
                                    <option value="High">High</option>
                                    <option value="Medium" selected>Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="Undefined">Undefined</option>
                                </select>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" name="latency_sensitive" id="latency-check">
                                <label class="form-check-label" for="latency-check">Latency Sensitive</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="add-dependency-form" class="btn btn-primary px-4">Add Dependency</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="uploadAWIModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Upload Application Workload Instances</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="upload-awi-form">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Select Excel File</label>
                                <input type="file" class="form-control" name="file" accept=".xlsx,.xls" required>
                            </div>
                            <div class="bg-light p-3 rounded small text-muted mb-3">
                                <i class="bi bi-info-circle me-2"></i>
                                Use the standard AWI ingestion template.
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="upload-awi-form" class="btn btn-primary px-4">Upload & Ingest</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="uploadDependencyModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Upload Dependency Links</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="upload-dependency-form">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Select Excel File</label>
                                <input type="file" class="form-control" name="file" accept=".xlsx,.xls" required>
                            </div>
                            <div class="bg-light p-3 rounded small text-muted mb-3">
                                <i class="bi bi-info-circle me-2"></i>
                                Use the standard Dependency Link ingestion template.
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="upload-dependency-form" class="btn btn-primary px-4">Upload & Ingest</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="addMDGModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Create Move Dependency Group (MDG)</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="add-mdg-form">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">MDG Name</label>
                                <input type="text" class="form-control" name="name" placeholder="e.g. Core Banking Batch" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Description</label>
                                <textarea class="form-control" name="description" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Include AWIs</label>
                                <div id="mdg-awi-list" class="border rounded p-3" style="max-height: 200px; overflow-y: auto;">
                                    <!-- Workloads will be listed here with checkboxes -->
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="add-mdg-form" class="btn btn-primary px-4">Create MDG</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editS2TModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Source-to-Target Mapping: <span id="s2t-awi-name"></span></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="edit-s2t-form">
                            <input type="hidden" name="mapping_id" id="s2t-mapping-id">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-muted small text-uppercase">Target Move Principle</label>
                                    <select class="form-select" name="move_principle_id" id="s2t-move-principle">
                                        ${movePrinciples.map(mp => `<option value="${mp}">${mp}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-muted small text-uppercase">Target Environment</label>
                                    <select class="form-select" name="target_environment_id" id="s2t-target-env">
                                        ${environments.map(env => `<option value="${env}">${env}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Target Location / Cloud</label>
                                <input type="text" class="form-control" name="target_location" id="s2t-target-location" placeholder="e.g. AWS Ireland">
                            </div>
                            
                            <hr class="my-4">
                            <h6 class="fw-bold mb-3">Score Card Assessment</h6>
                            <div id="s2t-score-card-factors">
                                <!-- Factors will be loaded here -->
                            </div>
                            
                            <div class="bg-light p-3 rounded mt-3 d-flex justify-content-between align-items-center">
                                <span class="fw-bold">Total Decision Score:</span>
                                <span id="s2t-total-score" class="fs-4 fw-bold text-primary">0</span>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-dark px-4" onclick="window.saveS2TMapping()">Save Mapping</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = html;
    await renderMapStep();

    // Setup form handlers
    const addAWIForm = document.getElementById('add-awi-form');
    if (addAWIForm) {
        addAWIForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const res = await fetch('/map/workloads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                bootstrap.Modal.getInstance(document.getElementById('addAWIModal')).hide();
                renderMap();
            }
        };
    }

    const addDepForm = document.getElementById('add-dependency-form');
    if (addDepForm) {
        addDepForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.latency_sensitive = e.target.latency_sensitive.checked;
            const res = await fetch('/map/dependencies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                bootstrap.Modal.getInstance(document.getElementById('addDependencyModal')).hide();
                renderMap();
            }
        };
    }
    const uploadAWIForm = document.getElementById('upload-awi-form');
    if (uploadAWIForm) {
        uploadAWIForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/map/ingest/workloads', { method: 'POST', body: formData });
            if (res.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('uploadAWIModal'));
                modal.hide();
                alert((await res.json()).message);
                renderMap();
            }
        };
    }

    const uploadDepForm = document.getElementById('upload-dependency-form');
    if (uploadDepForm) {
        uploadDepForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/map/ingest/dependencies', { method: 'POST', body: formData });
            if (res.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('uploadDependencyModal'));
                modal.hide();
                alert((await res.json()).message);
                renderMap();
            }
        };
    }

    const addMDGForm = document.getElementById('add-mdg-form');
    if (addMDGForm) {
        addMDGForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.workload_ids = Array.from(formData.getAll('workload_ids'));
            const res = await fetch('/map/mdgs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                bootstrap.Modal.getInstance(document.getElementById('addMDGModal')).hide();
                renderMap();
            }
        };
    }
}

window.showAddAWIModal = () => {
    const modal = new bootstrap.Modal(document.getElementById('addAWIModal'));
    modal.show();
};

window.showAddDependencyModal = async () => {
    const res = await fetch('/map/workloads');
    const workloads = await res.json();
    
    const srcSelect = document.getElementById('source-awi-select');
    const targetSelect = document.getElementById('target-awi-select');
    
    const options = workloads.map(w => `<option value="${w.id}">${w.name} (${w.environment})</option>`).join('');
    srcSelect.innerHTML = options;
    targetSelect.innerHTML = options;

    const modal = new bootstrap.Modal(document.getElementById('addDependencyModal'));
    modal.show();
};

window.showUploadAWIModal = () => {
    const modal = new bootstrap.Modal(document.getElementById('uploadAWIModal'));
    modal.show();
};

window.showUploadDependencyModal = () => {
    const modal = new bootstrap.Modal(document.getElementById('uploadDependencyModal'));
    modal.show();
};

async function renderMapStep() {
    const stepArea = document.getElementById('map-content');
    if (!stepArea) return;

    if (mapState.viewType === 'graph') {
        await renderMapGraph(stepArea);
    } else if (mapState.currentStep === 'source-data') {
        await renderSourceData(stepArea);
    } else if (mapState.currentStep === 'awis') {
        await renderMapAWIs(stepArea);
    } else if (mapState.currentStep === 'dependency-links') {
        await renderMapDependencyLinks(stepArea);
    } else if (mapState.currentStep === 's2ts') {
        await renderMapS2Ts(stepArea);
    } else if (mapState.currentStep === 'mdgs') {
        await renderMapMDGs(stepArea);
    }
}

async function renderSourceData(container) {
    const [entitiesRes, cisRes] = await Promise.all([
        fetch('/data-entities'),
        fetch('/prepare/items')
    ]);
    const entities = await entitiesRes.json();
    const cis = await cisRes.json();

    // Group CIs by type
    const groupedCis = {};
    cis.forEach(ci => {
        const type = ci.type.toLowerCase();
        if (!groupedCis[type]) {
            groupedCis[type] = [];
        }
        groupedCis[type].push(ci);
    });

    container.innerHTML = `
        <div class="alert alert-info border-0 shadow-sm mb-4">
            <div class="d-flex align-items-center">
                <i class="bi bi-info-circle-fill fs-4 me-3"></i>
                <div>
                    <strong>Promoted Source Data:</strong> This screen displays the standardized, normalized, and published data from the <strong>Prepare</strong> phase. 
                    The data is now presented in the structure of internal <strong>Data Entities and Fields</strong>, providing a solid foundation for creating AWIs and dependency links.
                </div>
            </div>
        </div>
        
        ${entities.map(entity => {
            const entityName = entity.name.toLowerCase();
            // Try to match entity name with CI type
            // e.g. "Virtual Server" -> "virtual_server"
            const matchKey = entityName.replace(/\s+/g, '_');
            const entityCis = groupedCis[matchKey] || groupedCis[entityName] || [];
            
            if (entityCis.length === 0) return '';
            
            return `
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white py-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold text-dark">
                                <i class="bi bi-database me-2 text-primary"></i>${entity.name}
                            </h5>
                            <span class="badge bg-light text-dark border">${entityCis.length} Records</span>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 small">
                            <thead class="bg-light text-muted text-uppercase" style="font-size: 0.75rem;">
                                <tr>
                                    <th class="ps-4">Entity Anchor</th>
                                    ${entity.fields.map(f => `<th>${f.name}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${entityCis.map(ci => `
                                    <tr>
                                        <td class="ps-4 fw-bold text-dark">${ci.name}</td>
                                        ${entity.fields.map(f => {
                                            const val = ci.properties[f.name] || '-';
                                            return `<td>${val}</td>`;
                                        }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }).join('')}
        
        ${Object.keys(groupedCis).length === 0 ? `
            <div class="text-center py-5">
                <i class="bi bi-cloud-slash text-muted mb-3" style="font-size: 3rem;"></i>
                <h5 class="text-muted">No promoted data found</h5>
                <p class="text-muted small">Please complete the Publish step in the Prepare phase to promote data to Map.</p>
                <button class="btn btn-outline-primary btn-sm mt-2" onclick="window.navigate('prepare')">Go to Prepare</button>
            </div>
        ` : ''}
    `;
}

async function renderMapS2Ts(container) {
    const workloadsRes = await fetch('/map/workloads');
    const workloads = await workloadsRes.json();
    const s2tRes = await fetch('/map/s2t');
    const s2ts = await s2tRes.json();
    
    const s2tMap = Object.fromEntries(s2ts.map(s => [s.workload_id, s]));

    container.innerHTML = `
        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">AWI Name</th>
                            <th>Environment</th>
                            <th>Target Principle</th>
                            <th>Target Location</th>
                            <th>Total Score</th>
                            <th>Status</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workloads.map(w => {
                            const s2t = s2tMap[w.id] || { status: 'Not Started', total_score: 0 };
                            return `
                                <tr>
                                    <td class="ps-4 fw-bold">${w.name}</td>
                                    <td><span class="badge bg-light text-dark border">${w.environment}</span></td>
                                    <td>${s2t.move_principle_id || '-'}</td>
                                    <td>${s2t.target_location || '-'}</td>
                                    <td><span class="fw-bold ${s2t.total_score > 0 ? 'text-primary' : 'text-muted'}">${s2t.total_score}</span></td>
                                    <td><span class="badge ${s2t.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}">${s2t.status}</span></td>
                                    <td class="text-end pe-4">
                                        <button class="btn btn-sm btn-dark" onclick="window.showEditS2TModal('${w.id}', '${w.name}')">
                                            <i class="bi bi-pencil-square me-1"></i> Map to Target
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function renderMapMDGs(container) {
    const mdgRes = await fetch('/map/mdgs');
    const mdgs = await mdgRes.json();
    
    container.innerHTML = `
        <div class="row g-4">
            ${mdgs.map(m => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title fw-bold mb-0">${m.name}</h5>
                                <span class="badge bg-primary">${m.workload_ids ? m.workload_ids.length : 0} AWIs</span>
                            </div>
                            <p class="text-muted small mb-3">${m.description || 'No description'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="small">
                                    <span class="text-muted">Status:</span> 
                                    <span class="fw-medium">${m.status}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-dark" onclick="window.editMDG('${m.id}')">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            ${mdgs.length === 0 ? '<div class="col-12 text-center py-5 text-muted">No MDGs defined. Create one to group related AWIs.</div>' : ''}
        </div>
    `;
}

async function renderMapAWIs(container) {
    const res = await fetch('/map/workloads');
    const workloads = await res.json();
    
    container.innerHTML = `
        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">AWI Name</th>
                            <th>Environment</th>
                            <th>Move Principle</th>
                            <th>Asset Count</th>
                            <th>Description</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workloads.map(w => `
                            <tr>
                                <td class="ps-4 fw-bold">${w.name}</td>
                                <td><span class="badge bg-info text-dark">${w.environment}</span></td>
                                <td>${w.hosting_model}</td>
                                <td>${w.ci_ids ? w.ci_ids.length : 0} assets</td>
                                <td class="text-muted small">${w.description || ''}</td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="window.viewAWIGraph('${w.id}')" title="View in Graph"><i class="bi bi-eye"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                        ${workloads.length === 0 ? '<tr><td colspan="6" class="text-center py-5 text-muted">No AWIs found. Ingest from Excel or add manually.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function renderMapDependencyLinks(container) {
    const res = await fetch('/map/dependencies');
    const deps = await res.json();
    const workloadsRes = await fetch('/map/workloads');
    const workloads = await workloadsRes.json();
    const wlMap = Object.fromEntries(workloads.map(w => [w.id, w.name]));

    container.innerHTML = `
        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Source AWI</th>
                            <th>Target AWI</th>
                            <th>Environment</th>
                            <th>Level</th>
                            <th>Latency Sensitive</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${deps.map(d => `
                            <tr>
                                <td class="ps-4">${wlMap[d.source_workload_id] || d.source_workload_id}</td>
                                <td>${wlMap[d.target_workload_id] || d.target_workload_id}</td>
                                <td><span class="badge bg-info text-dark">${d.environment}</span></td>
                                <td>${d.level}</td>
                                <td>${d.latency_sensitive ? '<span class="text-danger"><i class="bi bi-lightning-fill"></i> Yes</span>' : 'No'}</td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                        ${deps.length === 0 ? '<tr><td colspan="6" class="text-center py-5 text-muted">No dependency links found. Ingest from Excel or add manually.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.viewAWIGraph = (awiId) => {
    mapState.viewType = 'graph';
    renderMap();
};

window.showAddMDGModal = async () => {
    const res = await fetch('/map/workloads');
    const workloads = await res.json();
    
    const listArea = document.getElementById('mdg-awi-list');
    if (listArea) {
        listArea.innerHTML = workloads.map(w => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${w.id}" id="mdg-awi-${w.id}" name="workload_ids">
                <label class="form-check-label small" for="mdg-awi-${w.id}">
                    ${w.name} <span class="text-muted">(${w.environment})</span>
                </label>
            </div>
        `).join('');
    }
    
    new bootstrap.Modal(document.getElementById('addMDGModal')).show();
};

window.showEditS2TModal = async (awiId, awiName) => {
    document.getElementById('s2t-awi-name').innerText = awiName;
    
    const res = await fetch(`/map/s2t/${awiId}`);
    const mapping = await res.json();
    
    document.getElementById('s2t-mapping-id').value = mapping.id;
    document.getElementById('s2t-move-principle').value = mapping.move_principle_id || 'Rehost';
    document.getElementById('s2t-target-env').value = mapping.target_environment_id || 'PROD';
    document.getElementById('s2t-target-location').value = mapping.target_location || '';
    
    // Load score card factors
    const factorsRes = await fetch('/score-card/factors');
    if (!factorsRes.ok) {
        console.error("Failed to fetch score card factors");
        return;
    }
    const factors = await factorsRes.json();
    
    const factorsArea = document.getElementById('s2t-score-card-factors');
    if (factorsArea && Array.isArray(factors)) {
        factorsArea.innerHTML = factors.map(f => `
            <div class="mb-3">
                <label class="form-label small text-muted text-uppercase mb-1">${f.name || 'Unnamed Factor'}</label>
                <select class="form-select form-select-sm score-card-input" data-factor-id="${f.id}" data-weight="${f.weight || 1}" onchange="window.calculateS2TScore()">
                    <option value="">-- Select --</option>
                    ${(f.options || []).map(o => `
                        <option value="${o.id}" data-score="${o.score}" ${mapping.score_card_results && mapping.score_card_results[f.id] === o.id ? 'selected' : ''}>${o.name} (Score: ${o.score})</option>
                    `).join('')}
                </select>
            </div>
        `).join('');
    }
    
    window.calculateS2TScore();
    new bootstrap.Modal(document.getElementById('editS2TModal')).show();
};

window.calculateS2TScore = () => {
    let total = 0;
    document.querySelectorAll('.score-card-input').forEach(select => {
        const option = select.selectedOptions[0];
        if (option && option.value) {
            const score = parseInt(option.getAttribute('data-score'));
            const weight = parseInt(select.getAttribute('data-weight'));
            total += score * weight;
        }
    });
    const totalEl = document.getElementById('s2t-total-score');
    if (totalEl) totalEl.innerText = total;
};

window.saveS2TMapping = async () => {
    const mappingId = document.getElementById('s2t-mapping-id').value;
    const results = {};
    document.querySelectorAll('.score-card-input').forEach(select => {
        if (select.value) {
            results[select.getAttribute('data-factor-id')] = select.value;
        }
    });
    
    const updates = {
        move_principle_id: document.getElementById('s2t-move-principle').value,
        target_environment_id: document.getElementById('s2t-target-env').value,
        target_location: document.getElementById('s2t-target-location').value,
        score_card_results: results,
        total_score: parseInt(document.getElementById('s2t-total-score').innerText),
        status: 'Completed'
    };
    
    const res = await fetch(`/map/s2t/${mappingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    
    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('editS2TModal')).hide();
        renderMap();
    }
};

window.editMDG = (id) => {
    console.log("Edit MDG", id);
    // For prototype, we just log it or we could implement another modal
};

async function renderMapGraph(container) {
    console.log("Rendering Map Graph...");
    container.innerHTML = `
        <div class="d-flex flex-column h-100 position-relative">
            <div id="cy-map" style="flex-grow: 1; height: 650px; width: 100%; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6; position: relative;">
                <div id="cy-status" class="position-absolute top-50 start-50 translate-middle text-muted">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Loading graph data...
                </div>
            </div>
            
            <!-- Graph Controls -->
            <div class="graph-controls position-absolute top-0 end-0 m-3 d-flex flex-column gap-2" style="z-index: 10;">
                <button class="btn btn-white shadow-sm border" id="zoom-in" title="Zoom In"><i class="bi bi-plus-lg"></i></button>
                <button class="btn btn-white shadow-sm border" id="zoom-out" title="Zoom Out"><i class="bi bi-dash-lg"></i></button>
                <button class="btn btn-white shadow-sm border" id="zoom-reset" title="Default Zoom / Center"><i class="bi bi-arrows-fullscreen"></i></button>
            </div>

            <!-- Mini Map / Navigator -->
            <div id="cy-navigator-container" class="position-absolute bottom-0 start-0 m-3 shadow-sm border bg-white" style="width: 150px; height: 120px; z-index: 10; border-radius: 4px; overflow: hidden; display: none;">
                <div id="cy-navigator" style="width: 100%; height: 100%;"></div>
                <div id="cy-navigator-overlay" style="position: absolute; top: 0; left: 0; border: 1px solid #0d6efd; background: rgba(13, 110, 253, 0.1); pointer-events: none;"></div>
            </div>
        </div>
    `;
    
    try {
        console.log("Fetching workloads, items, and dependencies...");
        const [wlRes, ciRes, depRes] = await Promise.all([
            fetch('/map/workloads'),
            fetch('/prepare/items'),
            fetch('/map/dependencies')
        ]);
        
        if (!wlRes.ok || !ciRes.ok || !depRes.ok) {
            throw new Error(`Failed to fetch graph data: ${wlRes.status} / ${ciRes.status} / ${depRes.status}`);
        }

        const workloads = await wlRes.json();
        const cis = await ciRes.json();
        const dependencies = await depRes.json();
        
        console.log(`Data loaded: ${workloads.length} workloads, ${cis.length} CIs, ${dependencies.length} dependencies`);

        const elements = [];
        
        // Create Workload parent nodes
        workloads.forEach(wl => {
            elements.push({
                data: { id: `wl-${wl.id}`, label: `${wl.name}\n(${wl.environment})`, type: 'workload' }
            });
            
            // Add CIs that belong to this workload
            if (wl.ci_ids) {
                wl.ci_ids.forEach(ciId => {
                    const ci = cis.find(c => c.id === ciId);
                    if (ci) {
                        elements.push({
                            data: { 
                                id: `ci-${ci.id}-wl-${wl.id}`, // Unique ID per workload instance
                                label: ci.name, 
                                parent: `wl-${wl.id}`,
                                type: 'ci'
                            }
                        });
                    }
                });
            }
        });

        // Add dependencies between workloads
        dependencies.forEach((dep, index) => {
            const sourceExists = workloads.some(w => w.id === dep.source_workload_id);
            const targetExists = workloads.some(w => w.id === dep.target_workload_id);
            
            if (sourceExists && targetExists) {
                elements.push({
                    data: { 
                        id: `dep-${index}`, 
                        source: `wl-${dep.source_workload_id}`, 
                        target: `wl-${dep.target_workload_id}`,
                        label: dep.level
                    }
                });
            } else {
                console.warn(`Skipping dependency ${index}: source or target workload not found`, dep);
            }
        });

        const statusElem = document.getElementById('cy-status');
        if (elements.length === 0) {
            if (statusElem) statusElem.innerHTML = `<i class="bi bi-info-circle me-2"></i> No data available to display in graph.`;
            return;
        }

        if (statusElem) statusElem.remove();
        initCytoscape(elements);
    } catch (error) {
        console.error("Error rendering graph:", error);
        const cyMap = document.getElementById('cy-map');
        if (cyMap) {
            cyMap.innerHTML = `<div class="alert alert-danger m-3">
                <h6 class="alert-heading fw-bold"><i class="bi bi-exclamation-octagon-fill me-2"></i>Graph Loading Error</h6>
                <p class="mb-0 small">${error.message}</p>
                <hr>
                <button class="btn btn-sm btn-outline-danger" onclick="renderMap()">Retry</button>
            </div>`;
        }
    }
}

window.renderMap = renderMap;

function initCytoscape(elements) {
    if (typeof cytoscape === 'undefined') {
        console.error("Cytoscape library not found!");
        const container = document.getElementById('cy-map');
        if (container) {
            container.innerHTML = `<div class="p-5 text-center text-danger">
                <i class="bi bi-exclamation-triangle fs-1"></i>
                <p class="mt-3">Visualization library (Cytoscape) could not be loaded. Please check your internet connection.</p>
            </div>`;
        }
        return;
    }

    setTimeout(() => {
        const cyContainer = document.getElementById('cy-map');
        if (!cyContainer) {
            console.error("Graph container not found in DOM");
            return;
        }

        try {
            const cy = window.cy = cytoscape({
                container: cyContainer,
                elements: elements,
                style: [
                    {
                        selector: 'node[type="workload"]',
                        style: {
                            'label': 'data(label)',
                            'background-color': '#f8f9fa',
                            'border-width': 2,
                            'border-color': '#0d6efd',
                            'shape': 'round-rectangle',
                            'text-valign': 'top',
                            'text-halign': 'center',
                            'text-margin-y': -10,
                            'font-size': '12px',
                            'font-weight': 'bold',
                            'padding': '20px',
                            'color': '#0d6efd',
                            'text-wrap': 'wrap'
                        }
                    },
                    {
                        selector: 'node[type="ci"]',
                        style: {
                            'label': 'data(label)',
                            'background-color': '#fff',
                            'border-width': 1,
                            'border-color': '#dee2e6',
                            'shape': 'round-rectangle',
                            'font-size': '10px',
                            'text-valign': 'center',
                            'width': '100px',
                            'height': '35px',
                            'color': '#495057'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'line-color': '#6c757d',
                            'target-arrow-color': '#6c757d',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier',
                            'label': 'data(label)',
                            'font-size': '8px',
                            'text-rotation': 'autorotate'
                        }
                    }
                ],
                layout: {
                    name: 'cose',
                    padding: 30,
                    nodeRepulsion: 4000
                }
            });
            console.log("Cytoscape initialized successfully");
            
            initGraphControls(cy);
            initGraphNavigator(cy, elements);

        } catch (cyError) {
            console.error("Cytoscape initialization failed:", cyError);
        }
    }, 100);
}

function initGraphControls(cy) {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    if (zoomInBtn) {
        zoomInBtn.onclick = () => {
            cy.zoom(cy.zoom() * 1.2);
        };
    }

    if (zoomOutBtn) {
        zoomOutBtn.onclick = () => {
            cy.zoom(cy.zoom() / 1.2);
        };
    }

    if (zoomResetBtn) {
        zoomResetBtn.onclick = () => {
            cy.fit();
            cy.center();
        };
    }
}

function initGraphNavigator(mainCy, elements) {
    const navContainer = document.getElementById('cy-navigator');
    const navWrapper = document.getElementById('cy-navigator-container');
    const overlay = document.getElementById('cy-navigator-overlay');
    
    if (!navContainer || !navWrapper) return;

    // Show the navigator container
    navWrapper.style.display = 'block';

    const navCy = cytoscape({
        container: navContainer,
        elements: JSON.parse(JSON.stringify(elements)),
        style: mainCy.style().json(),
        userZoomingEnabled: false,
        userPanningEnabled: false,
        boxSelectionEnabled: false,
        autoungrabify: true,
        layout: { name: 'preset' }
    });

    const updateNavPositions = () => {
        mainCy.nodes().forEach(node => {
            const navNode = navCy.getElementById(node.id());
            if (navNode.length) {
                navNode.position(node.position());
            }
        });
        navCy.fit();
        updateOverlay();
    };

    const updateOverlay = () => {
        const extent = mainCy.extent();
        
        // Convert model coordinates to nav container coordinates
        const zoom = navCy.zoom();
        const pan = navCy.pan();

        const x1 = extent.x1 * zoom + pan.x;
        const y1 = extent.y1 * zoom + pan.y;
        const x2 = extent.x2 * zoom + pan.x;
        const y2 = extent.y2 * zoom + pan.y;

        const navWidth = navContainer.clientWidth;
        const navHeight = navContainer.clientHeight;

        const left = Math.max(0, x1);
        const top = Math.max(0, y1);
        const width = Math.min(navWidth - left, x2 - x1);
        const height = Math.min(navHeight - top, y2 - y1);

        overlay.style.left = left + 'px';
        overlay.style.top = top + 'px';
        overlay.style.width = Math.max(0, width) + 'px';
        overlay.style.height = Math.max(0, height) + 'px';
    };

    mainCy.on('layoutstop', () => {
        updateNavPositions();
        updateOverlay();
    });

    mainCy.on('viewport', updateOverlay);
    mainCy.on('position', 'node', updateNavPositions);
    
    // Initial update if layout already finished
    updateNavPositions();
    updateOverlay();
}
})();