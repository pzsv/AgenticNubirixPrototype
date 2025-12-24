// --- Module: Move Principles ---
window.renderMovePrinciples = async () => {
    const contentArea = document.getElementById('main-area');
    
    const response = await fetch('/move-principles/');
    const principles = await response.json();
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold mb-0">Move Principles</h3>
                <p class="text-muted">Define the migration approaches used in the project.</p>
            </div>
            <button class="btn btn-primary" id="btn-add-principle">
                <i class="bi bi-plus-lg me-1"></i> Add Principle
            </button>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Move Principle</th>
                            <th>Description</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${principles.map(p => `
                            <tr>
                                <td class="ps-4">
                                    <span class="badge bg-light text-primary border fw-medium px-3 py-2">${p.name}</span>
                                </td>
                                <td class="text-muted">${p.description || 'Standard migration principle.'}</td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-primary border-0 me-2 btn-edit-principle" data-id="${p.id}" data-name="${p.name}" data-description="${p.description || ''}">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger border-0 btn-delete-principle" data-id="${p.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                        ${principles.length === 0 ? '<tr><td colspan="3" class="text-center py-5 text-muted">No move principles defined.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add/Edit Principle Modal -->
        <div class="modal fade" id="principleModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold" id="principleModalTitle">Add Move Principle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="principle-form">
                            <input type="hidden" id="principle-id" name="id">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Principle Name</label>
                                <input type="text" class="form-control" id="principle-name" name="name" placeholder="e.g. Rehost, Refactor" required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small text-uppercase">Description</label>
                                <textarea class="form-control" id="principle-description" name="description" rows="3" placeholder="Principle description..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="principle-form" class="btn btn-primary px-4">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;

    const modal = new bootstrap.Modal(document.getElementById('principleModal'));
    
    document.getElementById('btn-add-principle').addEventListener('click', () => {
        document.getElementById('principleModalTitle').innerText = 'Add Move Principle';
        document.getElementById('principle-form').reset();
        document.getElementById('principle-id').value = '';
        modal.show();
    });

    // Edit button click
    document.querySelectorAll('.btn-edit-principle').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('principleModalTitle').innerText = 'Edit Move Principle';
            document.getElementById('principle-id').value = btn.dataset.id;
            document.getElementById('principle-name').value = btn.dataset.name;
            document.getElementById('principle-description').value = btn.dataset.description;
            modal.show();
        });
    });

    // Delete button click
    document.querySelectorAll('.btn-delete-principle').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this move principle?')) {
                const response = await fetch(`/move-principles/${btn.dataset.id}`, { method: 'DELETE' });
                if (response.ok) {
                    await window.renderMovePrinciples();
                } else {
                    alert('Failed to delete move principle');
                }
            }
        });
    });

    document.getElementById('principle-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const principleId = data.id;
        delete data.id;

        let response;
        if (principleId) {
            // Update
            response = await fetch(`/move-principles/${principleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create
            response = await fetch('/move-principles/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            modal.hide();
            await window.renderMovePrinciples();
        } else {
            alert('Failed to save move principle');
        }
    });
};
