// --- Module: Prepare (Modernized) ---
let prepareState = {
    currentStep: 'ingestion',
    ingestionSubview: 'sources',
    ingestionTab: 'sources',
    standardisationSubview: 'sources',
    standardisationTab: 'sources',
    ingestionFilters: {
        file: true,
        network: true,
        cmdb: true,
        manual: true
    }
};

async function renderPrepare() {
    const contentArea = document.getElementById('main-area');
    const html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Prepare</h2>
            <div class="stepper d-flex align-items-center">
                <div class="step ${prepareState.currentStep === 'ingestion' ? 'active' : ''}" onclick="window.setPrepareStep('ingestion')">
                    <i class="bi bi-cloud-download me-1"></i> 1. Ingestion
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'standardisation' ? 'active' : ''}" onclick="window.setPrepareStep('standardisation')">
                    <i class="bi bi-diagram-3 me-1"></i> 2. Standardisation
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'normalisation' ? 'active' : ''}" onclick="window.setPrepareStep('normalisation')">
                    <i class="bi bi-magic me-1"></i> 3. Normalisation
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'aggregation' ? 'active' : ''}" onclick="window.setPrepareStep('aggregation')">
                    <i class="bi bi-combine me-1"></i> 4. Aggregation
                </div>
                <div class="step-line"></div>
                <div class="step ${prepareState.currentStep === 'publish' ? 'active' : ''}" onclick="window.setPrepareStep('publish')">
                    <i class="bi bi-cloud-upload me-1"></i> 5. Publish
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
    if (step === 'standardisation' && !prepareState.standardisationSubview) {
        prepareState.standardisationSubview = 'sources';
    }
    renderPrepareStep();
};

window.goToStandardisation = (sourceName) => {
    prepareState.standardisationSource = sourceName;
    prepareState.standardisationSubview = 'fields';
    prepareState.standardisationTab = 'sources';
    window.setPrepareStep('standardisation');
};

async function renderPrepareStep() {
    const stepArea = document.getElementById('prepare-modern-content');
    if (!stepArea) return;

    // Update granular help section
    if (window.setHelpSection) {
        let section = `help-prepare-${prepareState.currentStep}`;
        if (prepareState.currentStep === 'standardisation') {
            section += `-${prepareState.standardisationTab || 'sources'}`;
        } else if (prepareState.currentStep === 'ingestion') {
            section += `-${prepareState.ingestionTab || 'sources'}`;
        }
        window.setHelpSection(section);
    }

    // Update stepper active state
    document.querySelectorAll('.stepper .step').forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        const step = prepareState.currentStep;
        let active = false;
        if (step === 'ingestion' && text.includes('ingestion')) active = true;
        else if (step === 'standardisation' && text.includes('standardisation')) active = true;
        else if (step === 'normalisation' && text.includes('normalisation')) active = true;
        else if (step === 'aggregation' && text.includes('aggregation')) active = true;
        else if (step === 'publish' && text.includes('publish')) active = true;
        
        el.classList.toggle('active', active);
    });

    switch(prepareState.currentStep) {
        case 'ingestion':
            await renderPrepareIngestion(stepArea);
            break;
        case 'data-entities':
            prepareState.currentStep = 'standardisation';
            prepareState.standardisationTab = 'entities';
            await renderStandardisation(stepArea);
            break;
        case 'data-dictionary':
            prepareState.currentStep = 'standardisation';
            prepareState.standardisationTab = 'dictionary';
            await renderStandardisation(stepArea);
            break;
        case 'standardisation':
            await renderStandardisation(stepArea);
            break;
        case 'normalisation':
            renderPrepareNormalisation(stepArea);
            break;
        case 'aggregation':
            renderPrepareAggregation(stepArea);
            break;
        case 'publish':
            renderPreparePublish(stepArea);
            break;
    }
}

window.setStandardisationTab = (tab) => {
    prepareState.standardisationTab = tab;
    if (tab !== 'sources') {
        prepareState.standardisationSubview = 'sources'; // Reset subview if switching away from sources
    }
    renderPrepareStep();
};

async function renderStandardisation(container) {
    const tabs = [
        { id: 'sources', label: 'Data Sources', icon: 'bi-database' },
        { id: 'entities', label: 'Data Entities', icon: 'bi-diagram-2' },
        { id: 'dictionary', label: 'Data Dictionary', icon: 'bi-book' },
        { id: 'discovered', label: 'Discovered Data', icon: 'bi-file-earmark-text' }
    ];
    
    const activeTab = prepareState.standardisationTab || 'sources';
    
    container.innerHTML = `
        <div class="mb-4">
            <ul class="nav nav-tabs" id="standardisation-tabs">
                ${tabs.map(tab => `
                    <li class="nav-item">
                        <a class="nav-link ${activeTab === tab.id ? 'active fw-bold' : ''}" 
                           href="#" onclick="window.setStandardisationTab('${tab.id}'); return false;">
                            <i class="bi ${tab.icon} me-1"></i> ${tab.label}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div id="standardisation-tab-content" class="mt-4"></div>
    `;
    
    const tabContent = document.getElementById('standardisation-tab-content');
    if (activeTab === 'sources') {
        if (prepareState.standardisationSubview === 'fields') {
            await renderStandardisationFields(tabContent);
        } else {
            await renderStandardisationSources(tabContent);
        }
    } else if (activeTab === 'entities') {
        if (window.renderDataEntities) await window.renderDataEntities('', 'name', 'asc', 1, 'standardisation-tab-content');
    } else if (activeTab === 'dictionary') {
        if (window.renderDataDictionary) await window.renderDataDictionary('', '', 'standardisation-tab-content');
    } else if (activeTab === 'discovered') {
        if (window.renderDiscoveredDataEntities) await window.renderDiscoveredDataEntities('', 'created_time', 'desc', 1, 'standardisation-tab-content');
    }
}

async function renderStandardisationSources(container) {
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
    
    const response = await fetch('/prepare/data-sources');
    const sources = await response.json();

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Standardisation</h4>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-dark btn-sm">Filter</button>
                <button class="btn btn-primary btn-sm">Verify All Ready</button>
            </div>
        </div>
        
        <div id="standardisation-sources-container">
            <div class="card shadow-sm">
                <div class="card-header bg-white py-3">
                    <h6 class="fw-bold mb-0">Ingested Data Sources</h6>
                </div>
                <div class="card-body p-0">
                    <table class="table table-hover mb-0 small">
                        <thead class="bg-light">
                            <tr>
                                <th>Source Name</th>
                                <th>Type</th>
                                <th>Worksheet/Data</th>
                                <th>Quality</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sources.map(src => `
                                <tr>
                                    <td>
                                        <button class="btn btn-link btn-sm p-0 fw-bold text-decoration-none" onclick="window.viewDataSourceDetails('${src.id}', '${src.name}')">
                                            ${src.name}
                                        </button>
                                    </td>
                                    <td class="text-muted">${src.source_type}</td>
                                    <td>${src.data_ingested || 'N/A'}</td>
                                    <td>
                                        <div class="progress" style="height: 6px; width: 60px;">
                                            <div class="progress-bar ${src.rating === 'high' ? 'bg-success' : (src.rating === 'medium' ? 'bg-warning' : 'bg-danger')}" 
                                                 style="width: ${src.rating === 'high' ? '95%' : (src.rating === 'medium' ? '70%' : '40%')}"></div>
                                        </div>
                                    </td>
                                    <td><span class="badge ${src.status === 'Success' ? 'bg-success' : 'bg-warning text-dark'}">${src.status}</span></td>
                                    <td>
                                        <button class="btn btn-link btn-sm p-0 me-2" onclick="window.viewDataSourceDetails('${src.id}', '${src.name}')">Review</button>
                                        <button class="btn btn-link btn-sm p-0" onclick="window.goToStandardisation('${src.name}')">Map Fields</button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${sources.length === 0 ? '<tr><td colspan="6" class="text-center py-4 text-muted">No data sources found.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function renderStandardisationFields(container) {
    const [mappingsRes, entitiesRes, ddFieldsRes] = await Promise.all([
        fetch('/prepare/field-mappings'),
        fetch('/data-entities'),
        fetch('/data-dictionary/fields')
    ]);
    const mappings = await mappingsRes.json();
    const entities = await entitiesRes.json();
    const ddFields = await ddFieldsRes.json();

    // Group mappings by data source
    const sources = [...new Set(mappings.map(m => m.data_source))];
    const currentSource = prepareState.standardisationSource || (sources.length > 0 ? sources[0] : 'all');

    const filteredMappings = currentSource === 'all' ? mappings : mappings.filter(m => m.data_source === currentSource);

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Field Mapping (Standardisation)</h4>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-dark btn-sm" onclick="window.setStandardisationSubview('sources')">
                    <i class="bi bi-arrow-left me-1"></i> Back to List
                </button>
                <select class="form-select form-select-sm" onchange="window.setStandardisationSource(this.value)">
                    <option value="all" ${currentSource === 'all' ? 'selected' : ''}>All Data Sources</option>
                    ${sources.map(s => `<option value="${s}" ${s === currentSource ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <div class="btn-group">
                    <button class="btn btn-outline-dark btn-sm">Save Profile</button>
                    <button class="btn btn-primary btn-sm">Apply Mappings</button>
                </div>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-md-3">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Target Entities</h6>
                        <div class="list-group list-group-flush small">
                            ${entities.map(e => `
                                <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>${e.name}</span>
                                    <span class="badge bg-light text-dark rounded-pill">${e.fields.length} fields</span>
                                </div>
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
                                    <th>Worksheet</th>
                                    <th>Target Entity</th>
                                    <th>Target Field</th>
                                    <th>Data Dictionary</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredMappings.map(m => {
        const selectedEntity = entities.find(e => e.name === m.data_entity);
        const availableFields = selectedEntity ? selectedEntity.fields : [];

        return `
                                    <tr>
                                        <td class="fw-bold">${m.source_field}</td>
                                        <td class="text-muted small">${m.worksheet}</td>
                                        <td>
                                            <select class="form-select form-select-sm" style="font-size: 0.75rem;" 
                                                onchange="window.updateStandardisationMapping('${m.id}', {data_entity: this.value, target_field: null})">
                                                <option value="">None</option>
                                                ${entities.map(e => `<option value="${e.name}" ${m.data_entity === e.name ? 'selected' : ''}>${e.name}</option>`).join('')}
                                            </select>
                                        </td>
                                        <td>
                                            <select class="form-select form-select-sm" style="font-size: 0.75rem;" 
                                                ${!m.data_entity ? 'disabled' : ''}
                                                onchange="window.updateStandardisationMapping('${m.id}', {target_field: this.value, status: 'Resolved'})">
                                                <option value="">None</option>
                                                ${availableFields.map(f => `<option value="${f.name}" ${m.target_field === f.name ? 'selected' : ''}>${f.name}</option>`).join('')}
                                            </select>
                                        </td>
                                        <td>
                                            <select class="form-select form-select-sm" style="font-size: 0.75rem;"
                                                onchange="window.updateStandardisationMapping('${m.id}', {data_dictionary_field_id: this.value})">
                                                <option value="">None</option>
                                                ${ddFields.map(df => `<option value="${df.id}" ${m.data_dictionary_field_id === df.id ? 'selected' : ''}>${df.entity} - ${df.name}</option>`).join('')}
                                            </select>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <span class="badge ${m.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}">${m.status}</span>
                                                ${m.status === 'Pending' && m.data_entity && m.target_field ? 
                                                    `<button class="btn btn-link btn-sm p-0 ms-2" onclick="window.updateStandardisationMapping('${m.id}', {status: 'Resolved'})" title="Approve Recommendation">
                                                        <i class="bi bi-check-circle text-success"></i>
                                                    </button>` : ''
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    `;
    }).join('')}
                                ${filteredMappings.length === 0 ? '<tr><td colspan="6" class="text-center py-4 text-muted">Select a data source or no fields found.</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.setStandardisationSource = (source) => {
    prepareState.standardisationSource = source;
    renderPrepareStep();
};

window.setStandardisationSubview = (subview) => {
    prepareState.standardisationSubview = subview;
    renderPrepareStep();
};

window.updateStandardisationMapping = async (id, updates) => {
    await fetch(`/prepare/field-mappings/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    renderPrepareStep();
};

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
                            <li class="mb-3 d-flex align-items-start" style="cursor: pointer;" onclick="window.goToStandardisation()">
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
                        <button class="btn btn-dark btn-sm w-100 mt-4" onclick="window.setPrepareStep('ingestion')">Go to Ingestion</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderPrepareIngestion(container) {
    const activeSub = prepareState.ingestionSubview || 'overview';
    const activeTab = prepareState.ingestionTab || 'sources';
    
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Ingestion</h4>
        </div>
        
        <div class="mb-5">
            <h6 class="fw-bold mb-3">Ingestion Methods</h6>
            <div class="row g-4">
                <!-- File Ingestion -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 cursor-pointer hover-shadow ${prepareState.ingestionFilters.file ? 'selected-filter' : 'border-0'}" onclick="window.toggleIngestionFilter('file')">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-file-earmark-excel fs-1 text-success mb-2"></i>
                            <h6 class="mb-1">File Ingestion</h6>
                            <p class="small text-muted mb-0">Upload Excel or CSV files</p>
                        </div>
                        <div class="card-footer bg-white border-0 pt-0 pb-3 text-center">
                            <div class="d-flex flex-wrap justify-content-center gap-1">
                                <button class="btn btn-outline-primary btn-xs" onclick="event.stopPropagation(); window.showUploadModalModern()">Upload New</button>
                                <button class="btn btn-outline-secondary btn-xs" onclick="event.stopPropagation(); window.switchIngestionTabAndFilter('discovered', 'file')">Show Files</button>
                                <button class="btn btn-outline-secondary btn-xs btn-toggle-filter" onclick="event.stopPropagation(); window.toggleIngestionFilter('file')">Show Data Sources</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Network Scan -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 cursor-pointer hover-shadow ${prepareState.ingestionFilters.network ? 'selected-filter' : 'border-0'}" onclick="window.toggleIngestionFilter('network')">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-broadcast fs-1 text-info mb-2"></i>
                            <h6 class="mb-1">Network Scan</h6>
                            <p class="small text-muted mb-0">Discover assets on network</p>
                        </div>
                        <div class="card-footer bg-white border-0 pt-0 pb-3 text-center">
                            <div class="d-flex flex-wrap justify-content-center gap-1">
                                <button class="btn btn-outline-primary btn-xs" onclick="event.stopPropagation(); window.setIngestionSubview('scans')">Configure Scan</button>
                                <button class="btn btn-outline-secondary btn-xs btn-toggle-filter" onclick="event.stopPropagation(); window.toggleIngestionFilter('network')">Show Data Sources</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- CMDB Connect -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 cursor-pointer hover-shadow ${prepareState.ingestionFilters.cmdb ? 'selected-filter' : 'border-0'}" onclick="window.toggleIngestionFilter('cmdb')">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-database-fill fs-1 text-primary mb-2"></i>
                            <h6 class="mb-1">CMDB Connect</h6>
                            <p class="small text-muted mb-0">Sync from ServiceNow/Jira</p>
                        </div>
                        <div class="card-footer bg-white border-0 pt-0 pb-3 text-center">
                            <div class="d-flex flex-wrap justify-content-center gap-1">
                                <button class="btn btn-outline-primary btn-xs" onclick="event.stopPropagation()">Configure CMDB</button>
                                <button class="btn btn-outline-secondary btn-xs btn-toggle-filter" onclick="event.stopPropagation(); window.toggleIngestionFilter('cmdb')">Show Data Sources</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Manual Entry -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 cursor-pointer hover-shadow ${prepareState.ingestionFilters.manual ? 'selected-filter' : 'border-0'}" onclick="window.toggleIngestionFilter('manual')">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-pencil-square fs-1 text-warning mb-2"></i>
                            <h6 class="mb-1">Manual Entry</h6>
                            <p class="small text-muted mb-0">Add assets individually</p>
                        </div>
                        <div class="card-footer bg-white border-0 pt-0 pb-3 text-center">
                            <div class="d-flex flex-wrap justify-content-center gap-1">
                                <button class="btn btn-outline-primary btn-xs" onclick="event.stopPropagation()">Add Manual</button>
                                <button class="btn btn-outline-secondary btn-xs btn-toggle-filter" onclick="event.stopPropagation(); window.toggleIngestionFilter('manual')">Show Data Sources</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="method-details-container" class="mb-5" style="${activeSub === 'scans' ? '' : 'display: none;'}"></div>

        <ul class="nav nav-tabs mb-4" id="ingestionTabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link ${activeTab === 'sources' ? 'active' : ''}" onclick="window.setIngestionTab('sources')">Active Data Sources</button>
            </li>
            <li class="nav-item">
                <button class="nav-link ${activeTab === 'discovered' ? 'active' : ''}" onclick="window.setIngestionTab('discovered')">Discovered Data</button>
            </li>
        </ul>

        <div id="ingestion-tab-content"></div>
    `;

    if (activeTab === 'sources') {
        renderActiveSources(document.getElementById('ingestion-tab-content'));
    } else {
        if (window.renderDiscoveredDataEntities) {
            await window.renderDiscoveredDataEntities(
                prepareState.discoveredSearch || '', 
                'created_time', 'desc', 1, 
                'ingestion-tab-content',
                prepareState.discoveredDataSourceFilter || '',
                prepareState.ingestionFilters
            );
        }
    }
    
    if (activeSub === 'scans') {
        await window.renderNetworkScanView(document.getElementById('method-details-container'));
    }
}

window.setIngestionTab = (tab) => {
    prepareState.ingestionTab = tab;
    if (tab === 'sources') {
        prepareState.discoveredDataSourceFilter = '';
    }
    // Hide subview when switching tabs to avoid it being "always there"
    prepareState.ingestionSubview = 'overview';
    renderPrepareStep();
};

window.clearDiscoveredDataSourceFilter = () => {
    prepareState.discoveredDataSourceFilter = '';
    renderPrepareStep();
};

window.setIngestionSubview = async (subview) => {
    if (prepareState.ingestionSubview === subview) {
        prepareState.ingestionSubview = 'overview';
    } else {
        prepareState.ingestionSubview = subview;
        // When showing a specific subview, ensure the corresponding filter is ON
        if (subview === 'scans') {
            prepareState.ingestionFilters.network = true;
        }
    }
    await renderPrepareStep();
};

window.toggleIngestionFilter = (type) => {
    prepareState.ingestionFilters[type] = !prepareState.ingestionFilters[type];
    // If we turned off the network filter, hide the scans subview if it was open
    if (type === 'network' && !prepareState.ingestionFilters.network && prepareState.ingestionSubview === 'scans') {
        prepareState.ingestionSubview = 'overview';
    }
    renderPrepareStep();
};

window.switchIngestionTabAndFilter = (tab, type) => {
    prepareState.ingestionTab = tab;
    // When explicitly clicking "Show Files" or similar, we might want to ensure that filter is ON
    prepareState.ingestionFilters[type] = true;
    // Hide any open subviews when switching focus
    prepareState.ingestionSubview = 'overview';
    renderPrepareStep();
};

async function renderActiveSources(container) {
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
    
    const response = await fetch('/prepare/data-sources');
    const sources = await response.json();
    
    const filters = prepareState.ingestionFilters;
    const filteredSources = sources.filter(src => {
        const type = src.source_type;
        if (type === 'Excel' || type === 'CSV') return filters.file;
        if (type === 'Network Scan') return filters.network;
        if (type === 'CMDB') return filters.cmdb;
        if (type === 'Manual') return filters.manual;
        return true;
    });

    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Active Data Sources</h6>
                <span class="badge bg-light text-dark rounded-pill">${filteredSources.length} active</span>
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
                            ${filteredSources.map(src => `
                                <tr>
                                    <td>
                                        <button class="btn btn-link btn-sm p-0 fw-bold text-decoration-none" onclick="window.viewDataSourceDetails('${src.id}', '${src.name}')">
                                            ${src.name}
                                        </button>
                                    </td>
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
                            ${filteredSources.length === 0 ? '<tr><td colspan="7" class="text-center py-4 text-muted">No data sources found.</td></tr>' : ''}
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
        window.setIngestionSubview('scans');
    }
}

window.runNetworkScan = async (scanId) => {
    const response = await fetch(`/prepare/scans/${scanId}/run`, { method: 'POST' });
    if (response.ok) {
        await window.setIngestionSubview('scans');
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
                            <th>Protocols</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${scan.results.map(r => `
                            <tr>
                                <td><code>${r.ip}</code></td>
                                <td>${r.hostname}</td>
                                <td><span class="badge bg-light text-dark border">${r.type}</span></td>
                                <td><small class="text-muted">${r.protocols || 'ICMP, TCP/SNMP'}</small></td>
                                <td><button class="btn btn-link btn-sm p-0">Details</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.viewDataSourceDetails = async (sourceId, sourceName) => {
    prepareState.ingestionTab = 'discovered';
    prepareState.discoveredDataSourceFilter = sourceName;
    await renderPrepareStep();
}

async function renderPrepareNormalisation(container) {
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Normalisation</h4>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-dark btn-sm">Auto-Normalise</button>
                <button class="btn btn-primary btn-sm">Validate Values</button>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white py-3">
                        <h6 class="fw-bold mb-0">Fields for Normalisation</h6>
                    </div>
                    <div class="list-group list-group-flush">
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center active">
                            <span>Environment</span>
                            <span class="badge bg-white text-primary rounded-pill">12 issues</span>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <span>Operating System</span>
                            <span class="badge bg-light text-dark rounded-pill">5 issues</span>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <span>Location</span>
                            <span class="badge bg-light text-dark rounded-pill">0 issues</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-white py-3">
                        <h6 class="fw-bold mb-0">Value Alignment: Environment</h6>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover mb-0 small">
                            <thead class="bg-light">
                                <tr>
                                    <th>Raw Value</th>
                                    <th>Frequency</th>
                                    <th>Standard Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>PROD-UK</code></td>
                                    <td>45</td>
                                    <td>
                                        <select class="form-select form-select-sm">
                                            <option>Production</option>
                                            <option>Development</option>
                                            <option>Testing</option>
                                            <option selected>Production</option>
                                        </select>
                                    </td>
                                    <td><button class="btn btn-outline-success btn-sm">Confirm</button></td>
                                </tr>
                                <tr>
                                    <td><code>development_env</code></td>
                                    <td>12</td>
                                    <td>
                                        <select class="form-select form-select-sm">
                                            <option selected>Development</option>
                                            <option>Production</option>
                                        </select>
                                    </td>
                                    <td><button class="btn btn-outline-success btn-sm">Confirm</button></td>
                                </tr>
                                <tr class="table-warning">
                                    <td><code>legacy-dmz</code></td>
                                    <td>3</td>
                                    <td>
                                        <div class="input-group input-group-sm">
                                            <select class="form-select">
                                                <option selected disabled>Select Standard...</option>
                                                <option>Production</option>
                                                <option>Development</option>
                                            </select>
                                            <button class="btn btn-outline-primary">+ New</button>
                                        </div>
                                    </td>
                                    <td><button class="btn btn-outline-success btn-sm" disabled>Confirm</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderPrepareAggregation(container) {
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Aggregation</h4>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-dark btn-sm">Find Duplicates</button>
                <button class="btn btn-primary btn-sm">Resolve All Conflicts</button>
            </div>
        </div>
        
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
                <h6 class="fw-bold mb-0">Data Entity Conflicts & Gaps</h6>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0 small">
                    <thead class="bg-light">
                        <tr>
                            <th>Entity (Anchor)</th>
                            <th>Conflict/Gap Type</th>
                            <th>Sources</th>
                            <th>Details</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-danger">
                            <td><code>WEB-SRV-01</code></td>
                            <td><span class="badge bg-danger">Conflict</span> Value mismatch</td>
                            <td>Excel Upload, CMDB Sync</td>
                            <td>IP Address: 192.168.1.10 vs 10.0.0.50</td>
                            <td><button class="btn btn-sm btn-primary">Resolve</button></td>
                        </tr>
                        <tr class="table-warning">
                            <td><code>DB-SRV-99</code></td>
                            <td><span class="badge bg-warning text-dark">Gap</span> Missing required field</td>
                            <td>Network Scan</td>
                            <td>Owner field is empty</td>
                            <td><button class="btn btn-sm btn-outline-dark">Fill Gap</button></td>
                        </tr>
                        <tr>
                            <td><code>APP-PORTAL-01</code></td>
                            <td><span class="badge bg-success">Resolved</span> Duplicate merged</td>
                            <td>Excel Upload, Manual Entry</td>
                            <td>3 sources consolidated</td>
                            <td><button class="btn btn-sm btn-outline-secondary">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function renderPreparePublish(container) {
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Publish</h4>
        </div>
        
        <div class="row justify-content-center">
            <div class="col-md-8 text-center py-5">
                <div class="mb-4">
                    <i class="bi bi-check-circle text-success" style="font-size: 4rem;"></i>
                </div>
                <h3>Ready for Map Phase</h3>
                <p class="text-muted mb-5">
                    All standardisation, normalisation and aggregation issues have been resolved.<br>
                    The data set is now ready to be promoted to the Map phase.
                </p>
                
                <div class="card shadow-sm mb-5 text-start">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Publish Summary</h6>
                        <div class="row g-3">
                            <div class="col-6 col-md-3">
                                <div class="p-3 bg-light rounded text-center">
                                    <h4 class="mb-0">1,245</h4>
                                    <small class="text-muted">Total CIs</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="p-3 bg-light rounded text-center">
                                    <h4 class="mb-0">12</h4>
                                    <small class="text-muted">Entities</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="p-3 bg-light rounded text-center">
                                    <h4 class="mb-0">100%</h4>
                                    <small class="text-muted">Standardised</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="p-3 bg-light rounded text-center">
                                    <h4 class="mb-0">0</h4>
                                    <small class="text-muted">Conflicts</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-lg px-5" onclick="window.publishToMap()">
                    Promote to Map Phase
                </button>
            </div>
        </div>
    `;
}

window.publishToMap = async () => {
    if (confirm('Are you sure you want to promote all data to the Map phase?')) {
        // In a real app, this would trigger a backend process to mark data as published
        // For this prototype, we'll navigate directly to the Map phase
        if (window.navigate) {
            window.navigate('map');
        } else {
            alert('Data successfully promoted to Map phase!');
        }
    }
};

window.showUploadModalModern = () => {
    if (window.showUploadModalOld) {
        window.showUploadModalOld((data) => {
            // After successful upload in modernized view
            prepareState.currentStep = 'standardisation';
            prepareState.standardisationSubview = 'fields';
            if (data && data.source_name) {
                prepareState.standardisationSource = data.source_name;
            } else {
                prepareState.standardisationSource = 'all'; 
            }
            renderPrepareStep();
        });
    } else {
        alert('Upload module not loaded');
    }
};

window.renderPrepareStep = renderPrepareStep;
window.renderPrepare = renderPrepare;
