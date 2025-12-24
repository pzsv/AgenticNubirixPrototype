// --- Module: Environments ---
window.renderEnvironments = async () => {
    const contentArea = document.getElementById('main-area');
    
    const response = await fetch('/environments/');
    const environments = await response.json();
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold mb-0">Environments</h3>
                <p class="text-muted">Manage available environments for workloads and mapping.</p>
            </div>
            <button class="btn btn-primary" id="btn-add-environment">
                <i class="bi bi-plus-lg me-1"></i> Add Environment
            </button>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Environment Name</th>
                            <th>Description</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${environments.map(env => `
                            <tr>
                                <td class="ps-4">
                                    <span class="badge bg-light text-dark border fw-medium px-3 py-2">${env.name}</span>
                                </td>
                                <td class="text-muted">${env.description || 'Standard environment for project workloads.'}</td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-primary border-0 me-2 btn-edit-env" data-id="${env.id}" data-name="${env.name}" data-description="${env.description || ''}">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger border-0 btn-delete-env" data-id="${env.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                        ${environments.length === 0 ? '<tr><td colspan="3" class="text-center py-5 text-muted">No environments defined.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add/Edit Environment Modal -->
        <div class="modal fade" id="envModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold" id="envModalTitle">Add Environment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="env-form">
                            <input type="hidden" id="env-id" name="id">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Environment Name</label>
                                <input type="text" class="form-control" id="env-name" name="name" placeholder="e.g. STAGE, UAT, SANDBOX" required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small text-uppercase">Description</label>
                                <textarea class="form-control" id="env-description" name="description" rows="3" placeholder="Environment description..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="env-form" class="btn btn-primary px-4">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;

    const modal = new bootstrap.Modal(document.getElementById('envModal'));
    
    document.getElementById('btn-add-environment').addEventListener('click', () => {
        document.getElementById('envModalTitle').innerText = 'Add Environment';
        document.getElementById('env-form').reset();
        document.getElementById('env-id').value = '';
        modal.show();
    });

    // Edit button click
    document.querySelectorAll('.btn-edit-env').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('envModalTitle').innerText = 'Edit Environment';
            document.getElementById('env-id').value = btn.dataset.id;
            document.getElementById('env-name').value = btn.dataset.name;
            document.getElementById('env-description').value = btn.dataset.description;
            modal.show();
        });
    });

    // Delete button click
    document.querySelectorAll('.btn-delete-env').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this environment?')) {
                const response = await fetch(`/environments/${btn.dataset.id}`, { method: 'DELETE' });
                if (response.ok) {
                    await window.renderEnvironments();
                } else {
                    alert('Failed to delete environment');
                }
            }
        });
    });

    document.getElementById('env-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const envId = data.id;
        delete data.id;

        let response;
        if (envId) {
            // Update
            response = await fetch(`/environments/${envId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create
            response = await fetch('/environments/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            modal.hide();
            await window.renderEnvironments();
        } else {
            alert('Failed to save environment');
        }
    });
};
