// --- Module: Score Card ---
(function() {
    if (typeof window === 'undefined') return;

async function renderScoreCard() {
    const contentArea = document.getElementById('main-area');
    
    try {
        const response = await fetch('/score-card/factors');
        const factors = await response.json();
        
        const html = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Score Card Configuration</h2>
                <button class="btn btn-dark" onclick="window.showAddFactorModal()">
                    <i class="bi bi-plus-lg me-1"></i> Add Factor
                </button>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4 py-3 text-muted small text-uppercase" style="width: 25%">Factor Name</th>
                                    <th class="py-3 text-muted small text-uppercase" style="width: 10%">Weight</th>
                                    <th class="py-3 text-muted small text-uppercase">Description</th>
                                    <th class="py-3 text-muted small text-uppercase">Options</th>
                                    <th class="pe-4 py-3 text-end text-muted small text-uppercase" style="width: 10%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${factors.map(f => `
                                    <tr>
                                        <td class="ps-4 fw-medium">${f.name}</td>
                                        <td><span class="badge bg-secondary">${f.weight}</span></td>
                                        <td class="text-muted small">${f.description || ''}</td>
                                        <td>
                                            ${f.options.map(o => `
                                                <div class="small d-flex justify-content-between border-bottom py-1">
                                                    <span>${o.name}</span>
                                                    <span class="text-primary fw-bold">${o.score}</span>
                                                </div>
                                            `).join('')}
                                            <button class="btn btn-link btn-sm p-0 mt-1" onclick="window.showAddOptionModal('${f.id}', '${f.name}')">
                                                <i class="bi bi-plus-circle"></i> Add Option
                                            </button>
                                        </td>
                                        <td class="pe-4 text-end">
                                            <button class="btn btn-sm btn-outline-danger border-0">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${factors.length === 0 ? '<tr><td colspan="5" class="text-center py-5 text-muted">No factors configured yet.</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Add Factor Modal -->
            <div class="modal fade" id="addFactorModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-bottom-0 pt-4 px-4">
                            <h5 class="modal-title fw-bold">Add Score Card Factor</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body px-4">
                            <form id="add-factor-form">
                                <div class="mb-3">
                                    <label class="form-label text-muted small text-uppercase">Factor Name</label>
                                    <input type="text" class="form-control" name="name" placeholder="e.g. Technical Risk" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small text-uppercase">Weight (1-10)</label>
                                    <input type="number" class="form-control" name="weight" value="1" min="1" max="10" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small text-uppercase">Description</label>
                                    <textarea class="form-control" name="description" rows="2"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-top-0 pb-4 px-4">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-dark" onclick="window.saveFactor()">Save Factor</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Option Modal -->
            <div class="modal fade" id="addOptionModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-bottom-0 pt-4 px-4">
                            <h5 class="modal-title fw-bold">Add Option for <span id="modal-factor-name"></span></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body px-4">
                            <form id="add-option-form">
                                <input type="hidden" name="factor_id" id="modal-factor-id">
                                <div class="mb-3">
                                    <label class="form-label text-muted small text-uppercase">Option Name</label>
                                    <input type="text" class="form-control" name="name" placeholder="e.g. High" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small text-uppercase">Score (0-10)</label>
                                    <input type="number" class="form-control" name="score" value="1" min="0" max="10" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-top-0 pb-4 px-4">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-dark" onclick="window.saveOption()">Save Option</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;
        
    } catch (e) {
        console.error("Error rendering score card:", e);
        contentArea.innerHTML = `<div class="alert alert-danger">Error loading score card configuration: ${e.message}</div>`;
    }
}

window.showAddFactorModal = () => {
    new bootstrap.Modal(document.getElementById('addFactorModal')).show();
};

window.saveFactor = async () => {
    const form = document.getElementById('add-factor-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.weight = parseInt(data.weight);
    
    try {
        const response = await fetch('/score-card/factors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addFactorModal')).hide();
            renderScoreCard();
        } else {
            alert("Failed to save factor");
        }
    } catch (e) {
        console.error("Error saving factor:", e);
    }
};

window.showAddOptionModal = (factorId, factorName) => {
    document.getElementById('modal-factor-id').value = factorId;
    document.getElementById('modal-factor-name').innerText = factorName;
    new bootstrap.Modal(document.getElementById('addOptionModal')).show();
};

window.saveOption = async () => {
    const form = document.getElementById('add-option-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.score = parseInt(data.score);
    
    try {
        const response = await fetch('/score-card/options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addOptionModal')).hide();
            renderScoreCard();
        } else {
            alert("Failed to save option");
        }
    } catch (e) {
        console.error("Error saving option:", e);
    }
};

// Register module
window.modules = window.modules || {};
window.modules['score-card'] = renderScoreCard;
})();
