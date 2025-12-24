// --- Module: Map ---
let mapState = {
    currentStep: 'awis',
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
    const html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Map</h2>
            <div class="d-flex align-items-center gap-3">
                <div class="stepper d-flex align-items-center">
                    <div class="step ${mapState.currentStep === 'awis' ? 'active' : ''}" onclick="window.setMapStep('awis')">
                        AWI
                    </div>
                    <div class="step-line"></div>
                    <div class="step ${mapState.currentStep === 'dependency-links' ? 'active' : ''}" onclick="window.setMapStep('dependency-links')">
                        Dependency Links
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
                                    <option value="PROD">PROD</option>
                                    <option value="UAT">UAT</option>
                                    <option value="DEV">DEV</option>
                                    <option value="DR">DR</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Hosting Model</label>
                                <input type="text" class="form-control" name="hosting_model" value="On-Premise">
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
                                <input type="text" class="form-control" name="environment" value="PROD">
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
    } else if (mapState.currentStep === 'awis') {
        await renderMapAWIs(stepArea);
    } else if (mapState.currentStep === 'dependency-links') {
        await renderMapDependencyLinks(stepArea);
    }
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
                            <th>Hosting Model</th>
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

async function renderMapGraph(container) {
    console.log("Rendering Map Graph...");
    container.innerHTML = `
        <div class="d-flex flex-column h-100">
            <div id="cy-map" style="flex-grow: 1; height: 650px; width: 100%; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6; position: relative;">
                <div id="cy-status" class="position-absolute top-50 start-50 translate-middle text-muted">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Loading graph data...
                </div>
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
            cytoscape({
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
        } catch (cyError) {
            console.error("Cytoscape initialization failed:", cyError);
        }
    }, 100);
}