// --- Module: Move ---
(function() {
    if (typeof window === 'undefined') return;

async function renderMove() {
    const contentArea = document.getElementById('main-area');
    if (window.setHelpSection) window.setHelpSection('help-move');
    const [workloadsRes, runbooksRes] = await Promise.all([
        fetch('/map/workloads'),
        fetch('/move/runbooks')
    ]);
    const workloads = await workloadsRes.json();
    const runbooks = await runbooksRes.json();
    
    let html = `
        <h3>4. Move: Execution Runbooks</h3>
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Generate Runbook from Template</h5>
                        <div class="input-group mb-3">
                            <select class="form-select" id="gen-runbook-workload-id">
                                ${workloads.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                            </select>
                            <button class="btn btn-primary" type="button" id="gen-runbook-btn">Generate Runbook</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Ingest Runbooks</h5>
                        <form id="ingest-runbook-form">
                            <div class="mb-3">
                                <label class="form-label">CSV or Excel File</label>
                                <input type="file" class="form-control" name="file" accept=".csv,.xlsx,.xls" required>
                            </div>
                            <button type="submit" class="btn btn-success">Upload & Ingest</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <h4>Generated Runbooks</h4>
        <div class="accordion" id="runbookAccordion">
            ${runbooks.map((rb, index) => `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                            ${rb.name} (Workload: ${rb.workload_id})
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#runbookAccordion">
                        <div class="accordion-body">
                            <table class="table table-sm">
                                <thead>
                                    <tr><th>Order</th><th>Task</th><th>Owner</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${rb.steps.map(step => `
                                        <tr>
                                            <td>${step.order}</td>
                                            <td>${step.task}</td>
                                            <td>${step.owner}</td>
                                            <td><span class="badge bg-info">${step.status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `).join('')}
            ${runbooks.length === 0 ? '<p class="text-center">No runbooks generated yet.</p>' : ''}
        </div>
    `;
    
    contentArea.innerHTML = html;
    
    document.getElementById('gen-runbook-btn').onclick = async () => {
        const id = document.getElementById('gen-runbook-workload-id').value;
        if (!id) return;
        const res = await fetch(`/move/generate/${id}`, { method: 'POST' });
        if (res.ok) { alert('Runbook generated!'); renderMove(); }
    };

    document.getElementById('ingest-runbook-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('/move/ingest/runbooks', { method: 'POST', body: formData });
        if (res.ok) { alert((await res.json()).message); renderMove(); }
    };
}

window.renderMove = renderMove;
})();
