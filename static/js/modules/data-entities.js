// --- Module: Data Entities ---
window.renderDataEntities = async function(searchFilter = '', sortCol = 'name', sortDir = 'asc', currentPage = 1, containerId = null) {
    const contentArea = containerId ? document.getElementById(containerId) : document.getElementById('main-area');
    const isNested = containerId && containerId !== 'main-area';
    const response = await fetch('/data-entities');
    let entities = await response.json();

    if (searchFilter) {
        const s = searchFilter.toLowerCase();
        entities = entities.filter(e => 
            e.name.toLowerCase().includes(s) || 
            e.id.toLowerCase().includes(s)
        );
    }

    // Sorting logic
    entities.sort((a, b) => {
        let valA = (a[sortCol] || '').toString().toLowerCase();
        let valB = (b[sortCol] || '').toString().toLowerCase();
        if (sortCol === 'fields_count') {
            valA = a.fields.length;
            valB = b.fields.length;
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const itemsPerPage = 10;
    const totalItems = entities.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedEntities = entities.slice(start, start + itemsPerPage);

    let html = '';
    
    if (!isNested) {
        html += `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold">Data Entities</h3>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary" id="btn-download-entities">
                        <i class="bi bi-download me-1"></i> Download Data Entities
                    </button>
                    <button class="btn btn-outline-primary" id="btn-upload-entities">
                        <i class="bi bi-upload me-1"></i> Upload Data Entities
                    </button>
                    <button class="btn btn-primary" id="btn-add-entity">
                        <i class="bi bi-plus-lg me-1"></i> Add Entity
                    </button>
                    <input type="file" id="input-upload-entities" style="display:none" accept=".xlsx">
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">Data Entities</h4>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm" id="btn-download-entities">
                        <i class="bi bi-download me-1"></i> Download
                    </button>
                    <button class="btn btn-outline-primary btn-sm" id="btn-upload-entities">
                        <i class="bi bi-upload me-1"></i> Upload
                    </button>
                    <button class="btn btn-primary btn-sm" id="btn-add-entity">
                        <i class="bi bi-plus-lg me-1"></i> Add Entity
                    </button>
                    <input type="file" id="input-upload-entities" style="display:none" accept=".xlsx">
                </div>
            </div>
        `;
    }

    html += `
        <div class="card mb-4 border-0 shadow-sm">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" id="entity-search" class="form-control border-start-0" placeholder="Search Entities..." value="${searchFilter}">
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4" style="cursor:pointer" onclick="window.renderDataEntities('${searchFilter}', 'name', '${sortCol === 'name' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, ${containerId ? "'"+containerId+"'" : 'null'})">
                                Name ${sortCol === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderDataEntities('${searchFilter}', 'id', '${sortCol === 'id' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, ${containerId ? "'"+containerId+"'" : 'null'})">
                                ID ${sortCol === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th>Key Field</th>
                            <th style="cursor:pointer" onclick="window.renderDataEntities('${searchFilter}', 'fields_count', '${sortCol === 'fields_count' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, ${containerId ? "'"+containerId+"'" : 'null'})">
                                Fields Count ${sortCol === 'fields_count' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th width="150" class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedEntities.map(entity => {
                            const keyField = entity.fields.find(f => f.id === entity.key_field_id);
                            return `
                                <tr>
                                    <td class="ps-4 fw-bold text-primary" style="cursor: pointer" onclick="window.renderDataEntityFields('${entity.id}', '', 'field_name', 'asc', 1, ${containerId ? "'"+containerId+"'" : 'null'})">${entity.name}</td>
                                    <td><small class="text-muted">${entity.id}</small></td>
                                    <td>${keyField ? keyField.name : '<span class="text-muted">None</span>'}</td>
                                    <td><span class="badge bg-light text-dark border">${entity.fields.length}</span></td>
                                    <td class="text-end pe-4">
                                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editEntity('${entity.id}')"><i class="bi bi-pencil"></i></button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteEntity('${entity.id}')"><i class="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        ${entities.length === 0 ? '<tr><td colspan="5" class="text-center py-5 text-muted">No entities found.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
            ${totalItems > itemsPerPage ? `
            <div class="card-footer bg-white border-top-0 py-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination pagination-sm mb-0 justify-content-center">
                        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage - 1}, ${containerId ? "'"+containerId+"'" : 'null'}); return false;">Previous</a>
                        </li>
                        ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                            <li class="page-item ${p === currentPage ? 'active' : ''}">
                                <a class="page-link" href="#" onclick="window.renderDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${p}, ${containerId ? "'"+containerId+"'" : 'null'}); return false;">${p}</a>
                            </li>
                        `).join('')}
                        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage + 1}, ${containerId ? "'"+containerId+"'" : 'null'}); return false;">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            ` : ''}
        </div>

        <!-- Add/Edit Entity Modal -->
        <div class="modal fade" id="entityModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold" id="entityModalLabel">Add Entity</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="entity-form">
                            <input type="hidden" name="id" id="entity-id-input">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Entity Name</label>
                                <input type="text" class="form-control" name="name" id="entity-name-input" placeholder="Enter entity name..." required>
                            </div>
                            <div class="mb-4" id="key-field-select-container" style="display:none">
                                <label class="form-label text-muted small text-uppercase">Key Field</label>
                                <select class="form-select" name="key_field_id" id="entity-key-field-input">
                                    <option value="">None</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="entity-form" class="btn btn-primary px-4">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;

    const searchInput = document.getElementById('entity-search');
    if (searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchFilter.length, searchFilter.length);
        searchInput.addEventListener('input', debounce((e) => {
            window.renderDataEntities(e.target.value, sortCol, sortDir, 1, containerId);
        }, 500));
    }

    const modalElement = document.getElementById('entityModal');
    const modal = new bootstrap.Modal(modalElement);

    document.getElementById('btn-add-entity').addEventListener('click', () => {
        document.getElementById('entityModalLabel').textContent = 'Add Entity';
        document.getElementById('entity-form').reset();
        document.getElementById('entity-id-input').value = '';
        document.getElementById('key-field-select-container').style.display = 'none';
        modal.show();
    });

    document.getElementById('btn-download-entities').addEventListener('click', () => {
        window.location.href = '/data-entities/download';
    });

    document.getElementById('btn-upload-entities').addEventListener('click', () => {
        document.getElementById('input-upload-entities').click();
    });

    document.getElementById('input-upload-entities').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!confirm('This will override ALL existing Data Entities and Fields. Are you sure?')) {
            e.target.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/data-entities/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Data Entities uploaded successfully');
                window.renderDataEntities(searchFilter, sortCol, sortDir, currentPage, containerId);
            } else {
                const error = await response.json();
                alert('Upload failed: ' + (error.detail || 'Unknown error'));
            }
        } catch (error) {
            alert('Upload failed: ' + error.message);
        }
        e.target.value = '';
    });

    document.getElementById('entity-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        let response;
        if (id) {
            response = await fetch(`/data-entities/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch('/data-entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            modal.hide();
            setTimeout(() => window.renderDataEntities(searchFilter, sortCol, sortDir, currentPage, containerId), 300);
        }
    });

    window.editEntity = async (id) => {
        const entity = entities.find(e => e.id === id);
        if (entity) {
            document.getElementById('entityModalLabel').textContent = 'Edit Entity';
            document.getElementById('entity-id-input').value = entity.id;
            document.getElementById('entity-name-input').value = entity.name;
            
            const keyFieldSelect = document.getElementById('entity-key-field-input');
            keyFieldSelect.innerHTML = '<option value="">None</option>' + 
                entity.fields.map(f => `<option value="${f.id}" ${f.id === entity.key_field_id ? 'selected' : ''}>${f.name}</option>`).join('');
            
            document.getElementById('key-field-select-container').style.display = 'block';
            modal.show();
        }
    };

    window.deleteEntity = async (id) => {
        if (confirm('Are you sure you want to delete this entity? Associated fields will lose their entity reference.')) {
            const response = await fetch(`/data-entities/${id}`, { method: 'DELETE' });
            if (response.ok) {
                window.renderDataEntities(searchFilter, sortCol, sortDir, currentPage, containerId);
            }
        }
    };
};

window.renderDataEntityFields = async function(entityId, searchFilter = '', sortCol = 'name', sortDir = 'asc', currentPage = 1, containerId = null) {
    const contentArea = containerId ? document.getElementById(containerId) : document.getElementById('main-area');
    const entityResponse = await fetch(`/data-entities/${entityId}`);
    const entity = await entityResponse.json();
    
    let fields = entity.fields;

    if (searchFilter) {
        const s = searchFilter.toLowerCase();
        fields = fields.filter(f => 
            f.name.toLowerCase().includes(s) || 
            (f.anchor && f.anchor.toLowerCase().includes(s)) ||
            f.id.toLowerCase().includes(s)
        );
    }

    // Sorting logic
    fields.sort((a, b) => {
        let valA = (a[sortCol] || '').toString().toLowerCase();
        let valB = (b[sortCol] || '').toString().toLowerCase();
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const itemsPerPage = 10;
    const totalItems = fields.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedFields = fields.slice(start, start + itemsPerPage);

    let html = `
        <div class="mb-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#" onclick="window.renderDataEntities('', 'name', 'asc', 1, ${containerId ? "'"+containerId+"'" : 'null'})">Data Entities</a></li>
                    <li class="breadcrumb-item active">${entity.name} Fields</li>
                </ol>
            </nav>
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="fw-bold">${entity.name} Fields</h3>
                <button class="btn btn-primary" id="btn-add-field">
                    <i class="bi bi-plus-lg me-1"></i> Add Field
                </button>
            </div>
        </div>

        <div class="card mb-4 border-0 shadow-sm">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" id="field-search" class="form-control border-start-0" placeholder="Search Fields..." value="${searchFilter}">
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4" style="cursor:pointer" onclick="window.renderDataEntityFields('${entityId}', '${searchFilter}', 'name', '${sortCol === 'name' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, ${containerId ? "'"+containerId+"'" : 'null'})">
                                Name ${sortCol === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderDataEntityFields('${entityId}', '${searchFilter}', 'anchor', '${sortCol === 'anchor' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, ${containerId ? "'"+containerId+"'" : 'null'})">
                                Anchor ${sortCol === 'anchor' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderDataEntityFields('${entityId}', '${searchFilter}', 'id', '${sortCol === 'id' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, ${containerId ? "'"+containerId+"'" : 'null'})">
                                ID ${sortCol === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th width="150" class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedFields.map(field => `
                            <tr>
                                <td class="ps-4 fw-bold">${field.name} ${field.id === entity.key_field_id ? '<span class="badge bg-primary ms-1">Key</span>' : ''}</td>
                                <td><code>${field.anchor || ''}</code></td>
                                <td><small class="text-muted">${field.id}</small></td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editField('${field.id}')"><i class="bi bi-pencil"></i></button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteField('${field.id}')"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                        ${fields.length === 0 ? '<tr><td colspan="4" class="text-center py-5 text-muted">No fields found.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
            ${totalItems > itemsPerPage ? `
            <div class="card-footer bg-white border-top-0 py-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination pagination-sm mb-0 justify-content-center">
                        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage - 1}, ${containerId ? "'"+containerId+"'" : 'null'}); return false;">Previous</a>
                        </li>
                        ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                            <li class="page-item ${p === currentPage ? 'active' : ''}">
                                <a class="page-link" href="#" onclick="window.renderDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${p}, ${containerId ? "'"+containerId+"'" : 'null'}); return false;">${p}</a>
                            </li>
                        `).join('')}
                        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage + 1}, ${containerId ? "'"+containerId+"'" : 'null'}); return false;">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            ` : ''}
        </div>

        <!-- Add/Edit Field Modal -->
        <div class="modal fade" id="fieldModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold" id="fieldModalLabel">Add Field</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="field-form">
                            <input type="hidden" name="id" id="field-id-input">
                            <input type="hidden" name="entity_id" value="${entityId}">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Field Name</label>
                                <input type="text" class="form-control" name="name" id="field-name-input" placeholder="Enter field name..." required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small text-uppercase">Anchor</label>
                                <input type="text" class="form-control" name="anchor" id="field-anchor-input" placeholder="Enter anchor (optional)...">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="field-form" class="btn btn-primary px-4">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;

    const searchInput = document.getElementById('field-search');
    if (searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchFilter.length, searchFilter.length);
        searchInput.addEventListener('input', debounce((e) => {
            window.renderDataEntityFields(entityId, e.target.value, sortCol, sortDir, 1, containerId);
        }, 500));
    }

    const modalElement = document.getElementById('fieldModal');
    const modal = new bootstrap.Modal(modalElement);

    document.getElementById('btn-add-field').addEventListener('click', () => {
        document.getElementById('fieldModalLabel').textContent = 'Add Field';
        document.getElementById('field-form').reset();
        document.getElementById('field-id-input').value = '';
        modal.show();
    });

    document.getElementById('field-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        let response;
        if (id) {
            response = await fetch(`/data-entities/fields/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`/data-entities/${entityId}/fields`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            modal.hide();
            setTimeout(() => window.renderDataEntityFields(entityId, searchFilter, sortCol, sortDir), 300);
        }
    });

    window.editField = (id) => {
        const field = fields.find(f => f.id === id);
        if (field) {
            document.getElementById('fieldModalLabel').textContent = 'Edit Field';
            document.getElementById('field-id-input').value = field.id;
            document.getElementById('field-name-input').value = field.name;
            document.getElementById('field-anchor-input').value = field.anchor || '';
            modal.show();
        }
    };

    window.deleteField = async (id) => {
        if (confirm('Are you sure you want to delete this field?')) {
            const response = await fetch(`/data-entities/fields/${id}`, { method: 'DELETE' });
            if (response.ok) {
                window.renderDataEntityFields(entityId, searchFilter, sortCol, sortDir);
            }
        }
    };
};
