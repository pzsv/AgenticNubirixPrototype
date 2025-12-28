// --- Module: User Management ---
window.renderAdminUsers = async () => {
    const contentArea = document.getElementById('main-area');
    
    const response = await fetch('/users/');
    const users = await response.json();
    
    const rolesResponse = await fetch('/users/roles');
    const roles = await rolesResponse.json();
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold mb-0">User Management</h3>
                <p class="text-muted">Manage system users, roles, and access rights.</p>
            </div>
            <button class="btn btn-primary" id="btn-add-user">
                <i class="bi bi-person-plus me-1"></i> Add User
            </button>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Username</th>
                            <th>Role</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-sm bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                                            <i class="bi bi-person"></i>
                                        </div>
                                        <span class="fw-medium">${user.username}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-soft-primary text-primary px-3 py-2" style="background-color: rgba(13, 110, 253, 0.1);">${user.role ? user.role.name : 'No Role'}</span>
                                </td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-primary border-0 me-2 btn-view-rights" data-id="${user.role_id}" data-username="${user.username}" data-role="${user.role ? user.role.name : ''}">
                                        <i class="bi bi-shield-check"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add User Modal -->
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold">Add New User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <form id="user-form">
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Username</label>
                                <input type="text" class="form-control" name="username" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small text-uppercase">Password</label>
                                <input type="password" class="form-control" name="password" required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small text-uppercase">Role</label>
                                <select class="form-select" name="role_id" required>
                                    ${roles.map(role => `<option value="${role.id}">${role.name}</option>`).join('')}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="user-form" class="btn btn-primary px-4">Create User</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Access Rights Modal -->
        <div class="modal fade" id="rightsModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold" id="rightsModalTitle">Access Rights</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4">
                        <div id="rights-container">
                            <div class="text-center py-4">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 pb-4 px-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;

    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    const rightsModal = new bootstrap.Modal(document.getElementById('rightsModal'));
    
    document.getElementById('btn-add-user').addEventListener('click', () => {
        document.getElementById('user-form').reset();
        userModal.show();
    });

    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.role_id = parseInt(data.role_id);

        const response = await fetch('/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            userModal.hide();
            await window.renderAdminUsers();
        } else {
            alert('Failed to create user');
        }
    });

    document.querySelectorAll('.btn-view-rights').forEach(btn => {
        btn.addEventListener('click', async () => {
            const roleId = btn.dataset.id;
            const username = btn.dataset.username;
            const roleName = btn.dataset.role;
            
            document.getElementById('rightsModalTitle').innerText = `Access Rights: ${username} (${roleName})`;
            rightsModal.show();
            
            const rightsResponse = await fetch(`/users/access-rights/${roleId}`);
            const rights = await rightsResponse.json();
            
            const rightsHtml = `
                <table class="table table-sm table-borderless">
                    <thead>
                        <tr class="text-muted small text-uppercase">
                            <th>Feature</th>
                            <th class="text-center">Read</th>
                            <th class="text-center">Write</th>
                            <th class="text-center">Delete</th>
                            <th class="text-center">Execute</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rights.map(r => `
                            <tr class="border-bottom">
                                <td class="py-2 fw-medium">${r.feature}</td>
                                <td class="text-center"><i class="bi ${r.read ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'}"></i></td>
                                <td class="text-center"><i class="bi ${r.write ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'}"></i></td>
                                <td class="text-center"><i class="bi ${r.delete ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'}"></i></td>
                                <td class="text-center"><i class="bi ${r.execute ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'}"></i></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('rights-container').innerHTML = rightsHtml;
        });
    });
};
