// --- Module: Project Management ---
window.renderAdminProject = async () => {
    const contentArea = document.getElementById('main-area');
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold mb-0">Project Management</h3>
                <p class="text-muted">Manage migration projects and system initialization.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <div class="bg-soft-primary p-3 rounded-3 me-3" style="background-color: rgba(13, 110, 253, 0.1);">
                                <i class="bi bi-plus-circle fs-3 text-primary"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold">Create New Project</h5>
                                <p class="text-muted small">This will clear all current project data (AWIs, Ingested Data, Plans, etc.) and initialize a fresh, empty project.</p>
                            </div>
                        </div>
                        <p class="small text-warning mb-4">
                            <i class="bi bi-exclamation-triangle me-1"></i> 
                            <strong>Note:</strong> Data Dictionary and Data Entities will be preserved. All other data will be permanently deleted.
                        </p>
                        <button class="btn btn-primary px-4" id="btn-create-new-project">
                            <i class="bi bi-plus-lg me-1"></i> Create New Project
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div class="modal fade" id="confirmResetModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold text-danger">Confirm Project Reset</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <p>Are you sure you want to create a new project? This action <strong>cannot be undone</strong>.</p>
                        <p>All current workloads, dependencies, ingested data, and migration plans will be lost.</p>
                        <div class="alert alert-warning border-0 small">
                            Only <strong>Data Dictionary</strong> and <strong>Data Entities</strong> configuration will be kept.
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" id="confirm-reset-btn" class="btn btn-danger px-4">Yes, Create New Project</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;

    const confirmModal = new bootstrap.Modal(document.getElementById('confirmResetModal'));
    
    document.getElementById('btn-create-new-project').addEventListener('click', () => {
        confirmModal.show();
    });

    document.getElementById('confirm-reset-btn').addEventListener('click', async () => {
        const btn = document.getElementById('confirm-reset-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Resetting...';

        try {
            const response = await fetch('/admin/project/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                confirmModal.hide();
                // Show success message and redirect or refresh
                contentArea.innerHTML = `
                    <div class="container py-5 text-center">
                        <div class="mb-4">
                            <i class="bi bi-check-circle-fill text-success display-1"></i>
                        </div>
                        <h2 class="fw-bold">New Project Created Successfully</h2>
                        <p class="text-muted mb-4">The system has been reset and is ready for a new migration project.</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            <i class="bi bi-arrow-clockwise me-1"></i> Reload Application
                        </button>
                    </div>
                `;
            } else {
                const err = await response.json();
                alert('Error: ' + (err.detail || 'Failed to reset project'));
                btn.disabled = false;
                btn.innerHTML = 'Yes, Create New Project';
            }
        } catch (error) {
            alert('Connection error');
            btn.disabled = false;
            btn.innerHTML = 'Yes, Create New Project';
        }
    });
};
