// --- Module: Discovered Data ---
window.renderDiscoveredDataEntities = async function(searchFilter = '', sortCol = 'created_time', sortDir = 'desc', currentPage = 1, containerId = null, dataSourceFilter = '', ingestionFilters = null) {
    const contentArea = (typeof containerId === 'string') ? document.getElementById(containerId) : (containerId || document.getElementById('main-area'));
    const containerIdStr = (typeof containerId === 'string') ? containerId : (containerId ? containerId.id : 'main-area');
    const isNested = containerIdStr !== 'main-area';
    
    try {
        const response = await fetch('/discovered-data');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let entities = await response.json();

        if (!Array.isArray(entities)) {
            throw new Error('Expected an array of entities');
        }

        if (ingestionFilters) {
            entities = entities.filter(e => {
                const type = (e.source_type || '').toLowerCase();
                if (type === 'file' || type === 'excel' || type === 'csv') return ingestionFilters.file;
                if (type === 'network_scan' || type === 'network scan') return ingestionFilters.network;
                if (type === 'cmdb') return ingestionFilters.cmdb;
                if (type === 'manual') return ingestionFilters.manual;
                return true;
            });
        }

        if (dataSourceFilter) {
            const ds = dataSourceFilter.toLowerCase();
            entities = entities.filter(e => 
                (e.source_name || '').toLowerCase() === ds || 
                (e.source_type || '').toLowerCase() === ds ||
                (e.data_entity_name || '').toLowerCase() === ds
            );
        }

        if (searchFilter) {
            const s = searchFilter.toLowerCase();
            entities = entities.filter(e => 
                (e.data_entity_name || '').toLowerCase().includes(s) || 
                (e.user || '').toLowerCase().includes(s) ||
                (e.source_type || '').toLowerCase().includes(s) ||
                (e.source_name || '').toLowerCase().includes(s) ||
                (e.fields || []).some(f => (f.field_value || '').toLowerCase().includes(s))
            );
        }

        // Gather all field names if we are in a filtered view or searching
        const fieldSet = new Set();
        if (dataSourceFilter || searchFilter) {
            entities.forEach(e => {
                (e.fields || []).forEach(f => fieldSet.add(f.field_name));
            });
        }
        const allFieldNames = Array.from(fieldSet);
        const useGridView = dataSourceFilter && allFieldNames.length > 0;

        // Sorting logic
        entities.sort((a, b) => {
            let valA, valB;
            if (sortCol === 'fields_count') {
                valA = (a.fields || []).length;
                valB = (b.fields || []).length;
            } else if (allFieldNames.includes(sortCol)) {
                const fA = (a.fields || []).find(f => f.field_name === sortCol);
                const fB = (b.fields || []).find(f => f.field_name === sortCol);
                valA = (fA ? fA.field_value : '').toString().toLowerCase();
                valB = (fB ? fB.field_value : '').toString().toLowerCase();
            } else {
                valA = (a[sortCol] || '').toString().toLowerCase();
                valB = (b[sortCol] || '').toString().toLowerCase();
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

        const filterJson = ingestionFilters ? JSON.stringify(ingestionFilters).replace(/"/g, '&quot;') : 'null';

        let html = '';
        
        if (!isNested) {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="fw-bold">Discovered Data Entities</h3>
                </div>
            `;
        }

        html += `
            <div class="card mb-4 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group" style="max-width: 400px;">
                            <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                            <input type="text" id="discovered-entity-search" class="form-control border-start-0" placeholder="Search Discovered Data..." value="${searchFilter}">
                        </div>
                        ${dataSourceFilter ? `<div class="text-muted small">Filtered by: <strong>${dataSourceFilter}</strong> <button class="btn btn-link btn-sm p-0" onclick="${window.clearDiscoveredDataSourceFilter ? 'window.clearDiscoveredDataSourceFilter()' : `window.renderDiscoveredDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', 1, '${containerIdStr}', '', ${filterJson})`}">Clear Filter</button></div>` : ''}
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle ${useGridView ? 'small' : ''}">
                        <thead class="bg-light">
                            <tr>
                                ${useGridView ? `
                                    <th class="ps-4">#</th>
                                    ${allFieldNames.map(name => `
                                        <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', '${name}', '${sortCol === name && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                            ${name} ${sortCol === name ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                        </th>
                                    `).join('')}
                                ` : `
                                    <th class="ps-4" style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', 'data_entity_name', '${sortCol === 'data_entity_name' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                        Entity Name ${sortCol === 'data_entity_name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                    </th>
                                    <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', 'source_type', '${sortCol === 'source_type' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                        Source ${sortCol === 'source_type' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                    </th>
                                    <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', 'user', '${sortCol === 'user' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                        User ${sortCol === 'user' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                    </th>
                                    <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', 'created_time', '${sortCol === 'created_time' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                        Created Time ${sortCol === 'created_time' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                    </th>
                                    <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', 'fields_count', '${sortCol === 'fields_count' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                        Fields Count ${sortCol === 'fields_count' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                    </th>
                                    <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntities('${searchFilter}', 'status', '${sortCol === 'status' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson})">
                                        Status ${sortCol === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                    </th>
                                `}
                                <th width="100" class="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedEntities.map((entity, idx) => {
                                if (useGridView) {
                                    const fieldMap = {};
                                    (entity.fields || []).forEach(f => fieldMap[f.field_name] = f.field_value);
                                    return `
                                        <tr>
                                            <td class="ps-4 text-muted small">${start + idx + 1}</td>
                                            ${allFieldNames.map(name => `<td>${fieldMap[name] || '-'}</td>`).join('')}
                                            <td class="text-end pe-4">
                                                <button class="btn btn-xs btn-outline-danger" onclick="window.deleteDiscoveredDataEntity('${entity.id}')"><i class="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    `;
                                } else {
                                    return `
                                        <tr>
                                            <td class="ps-4 fw-bold text-primary" style="cursor: pointer" onclick="window.renderDiscoveredDataEntityFields('${entity.id}', '', 'field_name', 'asc', 1, '${containerIdStr}')">${entity.data_entity_name}</td>
                                            <td>
                                                <div class="d-flex flex-column">
                                                    <span class="badge ${entity.source_type === 'manual' ? 'bg-info' : 'bg-success'} mb-1">${entity.source_type}</span>
                                                    <small class="text-muted" style="font-size: 0.7rem">${entity.source_name || ''}</small>
                                                </div>
                                            </td>
                                            <td>${entity.user}</td>
                                            <td><small class="text-muted">${entity.created_time}</small></td>
                                            <td><span class="badge bg-light text-dark border">${(entity.fields || []).length}</span></td>
                                            <td><span class="badge bg-secondary">${entity.status || 'Ingested'}</span></td>
                                            <td class="text-end pe-4">
                                                <button class="btn btn-sm btn-outline-danger" onclick="window.deleteDiscoveredDataEntity('${entity.id}')"><i class="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    `;
                                }
                            }).join('')}
                            ${entities.length === 0 ? `<tr><td colspan="${useGridView ? allFieldNames.length + 2 : 7}" class="text-center py-5 text-muted">No discovered data entities found.</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
                ${totalItems > itemsPerPage ? `
                <div class="card-footer bg-white border-top-0 py-3">
                    <nav aria-label="Page navigation">
                        <ul class="pagination pagination-sm mb-0 justify-content-center">
                            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="window.renderDiscoveredDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage - 1}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson}); return false;">Previous</a>
                            </li>
                            ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                                <li class="page-item ${p === currentPage ? 'active' : ''}">
                                    <a class="page-link" href="#" onclick="window.renderDiscoveredDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${p}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson}); return false;">${p}</a>
                                </li>
                            `).join('')}
                            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="window.renderDiscoveredDataEntities('${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage + 1}, '${containerIdStr}', '${dataSourceFilter}', ${filterJson}); return false;">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                ` : ''}
            </div>
        `;

        contentArea.innerHTML = html;

        const searchInput = document.getElementById('discovered-entity-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.setSelectionRange(searchFilter.length, searchFilter.length);
            searchInput.addEventListener('input', debounce((e) => {
                window.renderDiscoveredDataEntities(e.target.value, sortCol, sortDir, 1, containerIdStr, dataSourceFilter, ingestionFilters);
            }, 500));
        }

        window.deleteDiscoveredDataEntity = async (id) => {
            if (confirm('Are you sure you want to delete this discovered data entity?')) {
                const response = await fetch(`/discovered-data/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    window.renderDiscoveredDataEntities(searchFilter, sortCol, sortDir, currentPage, containerIdStr, dataSourceFilter, ingestionFilters);
                }
            }
        };
    } catch (error) {
        console.error('Error rendering discovered data entities:', error);
        if (contentArea) contentArea.innerHTML = `<div class="alert alert-danger">Error loading discovered data: ${error.message}</div>`;
    }
};

window.renderDiscoveredDataEntityFields = async function(entityId, searchFilter = '', sortCol = 'field_name', sortDir = 'asc', currentPage = 1, containerId = null) {
    const contentArea = (typeof containerId === 'string') ? document.getElementById(containerId) : (containerId || document.getElementById('main-area'));
    const containerIdStr = (typeof containerId === 'string') ? containerId : (containerId ? containerId.id : 'main-area');
    
    try {
        const response = await fetch(`/discovered-data/${entityId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const entity = await response.json();
        let fields = entity.fields || [];

        if (searchFilter) {
            const s = searchFilter.toLowerCase();
            fields = fields.filter(f => 
                (f.field_name || '').toLowerCase().includes(s) || 
                (f.field_value || '').toLowerCase().includes(s)
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
                        <li class="breadcrumb-item"><a href="#" onclick="window.renderDiscoveredDataEntities('', 'created_time', 'desc', 1, '${containerIdStr}')">Discovered Data</a></li>
                        <li class="breadcrumb-item active">${entity.data_entity_name}</li>
                    </ol>
                </nav>
                <h3 class="fw-bold">Discovered Data Fields</h3>
            </div>

            <div class="card mb-4 border-0 shadow-sm">
                <div class="card-body">
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" id="discovered-field-search" class="form-control border-start-0" placeholder="Search Fields..." value="${searchFilter}">
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4" style="cursor:pointer" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', 'field_name', '${sortCol === 'field_name' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}')">
                                    Field Name ${sortCol === 'field_name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', 'field_value', '${sortCol === 'field_value' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}')">
                                    Field Value ${sortCol === 'field_value' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', 'rating', '${sortCol === 'rating' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}')">
                                    Rating ${sortCol === 'rating' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th style="cursor:pointer" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', 'created_time', '${sortCol === 'created_time' && sortDir === 'asc' ? 'desc' : 'asc'}', ${currentPage}, '${containerIdStr}')">
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
                                <a class="page-link" href="#" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage - 1}, '${containerIdStr}'); return false;">Previous</a>
                            </li>
                            ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                                <li class="page-item ${p === currentPage ? 'active' : ''}">
                                    <a class="page-link" href="#" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${p}, '${containerIdStr}'); return false;">${p}</a>
                                </li>
                            `).join('')}
                            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="window.renderDiscoveredDataEntityFields('${entityId}', '${searchFilter}', '${sortCol}', '${sortDir}', ${currentPage + 1}, '${containerIdStr}'); return false;">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                ` : ''}
            </div>
        `;

        contentArea.innerHTML = html;

        const searchInput = document.getElementById('discovered-field-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.setSelectionRange(searchFilter.length, searchFilter.length);
            searchInput.addEventListener('input', debounce((e) => {
                window.renderDiscoveredDataEntityFields(entityId, e.target.value, sortCol, sortDir, 1, containerIdStr);
            }, 500));
        }
    } catch (error) {
        console.error('Error rendering discovered data fields:', error);
        if (contentArea) contentArea.innerHTML = `<div class="alert alert-danger">Error loading fields: ${error.message}</div>`;
    }
};
