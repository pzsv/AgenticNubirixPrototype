// --- Module: Raw Data ---
window.renderRawDataEntities = async function(searchFilter = '', sortCol = 'created_time', sortDir = 'desc', currentPage = 1) {
    const contentArea = document.getElementById('main-area');
    const response = await fetch('/raw-data');
    let entities = await response.json();

    if (searchFilter) {
        const s = searchFilter.toLowerCase();
        entities = entities.filter(e => 
            e.data_entity_name.toLowerCase().includes(s) || 
            e.user.toLowerCase().includes(s) ||
            e.source_type.toLowerCase().includes(s)
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

    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold">Raw Data Entities</h3>
        </div>

        <div class="card mb-4 border-0 shadow-sm">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" id="raw-entity-search" class="form-control border-start-0" placeholder="Search Raw Data..." value="${searchFilter}">
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4" style="cursor:pointer" onclick="window.renderRawDataEntities('${searchFilter}', 'data_entity_name', '${sortCol === 'data_entity_name' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Entity Name ${sortCol === 'data_entity_name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntities('${searchFilter}', 'source_type', '${sortCol === 'source_type' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Source ${sortCol === 'source_type' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntities('${searchFilter}', 'user', '${sortCol === 'user' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                User ${sortCol === 'user' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntities('${searchFilter}', 'created_time', '${sortCol === 'created_time' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Created Time ${sortCol === 'created_time' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntities('${searchFilter}', 'fields_count', '${sortCol === 'fields_count' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Fields Count ${sortCol === 'fields_count' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th width="100" class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedEntities.map(entity => `
                            <tr>
                                <td class="ps-4 fw-bold text-primary" style="cursor: pointer" onclick="window.renderRawDataEntityFields('${entity.id}')">${entity.data_entity_name}</td>
                                <td><span class="badge ${entity.source_type === 'manual' ? 'bg-info' : 'bg-success'}">${entity.source_type}</span></td>
                                <td>${entity.user}</td>
                                <td><small class="text-muted">${entity.created_time}</small></td>
                                <td><span class="badge bg-light text-dark border">${entity.fields.length}</span></td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteRawDataEntity('${entity.id}')"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                        ${entities.length === 0 ? '<tr><td colspan="6" class="text-center py-5 text-muted">No raw data entities found.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
            ${totalItems > itemsPerPage ? `
            <div class="card-footer bg-white border-top-0 py-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination pagination-sm mb-0 justify-content-center">
                        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderRawDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage - 1}); return false;">Previous</a>
                        </li>
                        ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                            <li class="page-item ${p === currentPage ? 'active' : ''}">
                                <a class="page-link" href="#" onclick="window.renderRawDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${p}); return false;">${p}</a>
                            </li>
                        `).join('')}
                        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderRawDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage + 1}); return false;">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            ` : ''}
        </div>
    `;

    contentArea.innerHTML = html;

    const searchInput = document.getElementById('raw-entity-search');
    if (searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchFilter.length, searchFilter.length);
        searchInput.addEventListener('input', debounce((e) => {
            window.renderRawDataEntities(e.target.value, sortCol, sortDir);
        }, 500));
    }

    window.deleteRawDataEntity = async (id) => {
        if (confirm('Are you sure you want to delete this raw data entity?')) {
            const response = await fetch(`/raw-data/${id}`, { method: 'DELETE' });
            if (response.ok) {
                window.renderRawDataEntities(searchFilter, sortCol, sortDir, currentPage);
            }
        }
    };
};

window.renderRawDataEntityFields = async function(entityId, searchFilter = '', sortCol = 'field_name', sortDir = 'asc', currentPage = 1) {
    const contentArea = document.getElementById('main-area');
    const response = await fetch(`/raw-data/${entityId}`);
    const entity = await response.json();
    let fields = entity.fields;

    if (searchFilter) {
        const s = searchFilter.toLowerCase();
        fields = fields.filter(f => 
            f.field_name.toLowerCase().includes(s) || 
            f.field_value.toLowerCase().includes(s)
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
    const itemsPerPage = 15;
    const totalItems = fields.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedFields = fields.slice(start, start + itemsPerPage);

    let html = `
        <div class="mb-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1">
                    <li class="breadcrumb-item"><a href="#" onclick="window.renderRawDataEntities()">Raw Data</a></li>
                    <li class="breadcrumb-item active">${entity.data_entity_name}</li>
                </ol>
            </nav>
            <h3 class="fw-bold">Raw Data Fields</h3>
        </div>

        <div class="card mb-4 border-0 shadow-sm">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" id="raw-field-search" class="form-control border-start-0" placeholder="Search Fields..." value="${searchFilter}">
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4" style="cursor:pointer" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', 'field_name', '${sortCol === 'field_name' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Field Name ${sortCol === 'field_name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', 'field_value', '${sortCol === 'field_value' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Field Value ${sortCol === 'field_value' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', 'rating', '${sortCol === 'rating' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Rating ${sortCol === 'rating' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style="cursor:pointer" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', 'created_time', '${sortCol === 'created_time' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage})">
                                Created Time ${sortCol === 'created_time' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedFields.map(field => `
                            <tr>
                                <td class="ps-4 fw-bold">${field.field_name}</td>
                                <td>${field.field_value}</td>
                                <td><span class="badge bg-light text-dark border">${field.rating || 'N/A'}</span></td>
                                <td><small class="text-muted">${field.created_time}</small></td>
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
                            <a class="page-link" href="#" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage - 1}); return false;">Previous</a>
                        </li>
                        ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                            <li class="page-item ${p === currentPage ? 'active' : ''}">
                                <a class="page-link" href="#" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${p}); return false;">${p}</a>
                            </li>
                        `).join('')}
                        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="window.renderRawDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage + 1}); return false;">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            ` : ''}
        </div>
    `;

    contentArea.innerHTML = html;

    const searchInput = document.getElementById('raw-field-search');
    if (searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchFilter.length, searchFilter.length);
        searchInput.addEventListener('input', debounce((e) => {
            window.renderRawDataEntityFields(entityId, e.target.value, sortCol, sortDir);
        }, 500));
    }
};
