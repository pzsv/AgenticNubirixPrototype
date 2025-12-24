// --- Module: Data Dictionary ---
window.renderDataDictionary = async (entityFilter = '', searchFilter = '') => {
    const contentArea = document.getElementById('main-area');
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
    const contentArea = document.getElementById('main-area');
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
