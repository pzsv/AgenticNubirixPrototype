// --- Module: Plan ---
async function renderPlan() {
    const contentArea = document.getElementById('main-area');
    const [workloadsRes, wavesRes] = await Promise.all([
        fetch('/map/workloads'),
        fetch('/plan/waves')
    ]);
    const workloads = await workloadsRes.json();
    const waves = await wavesRes.json();
    
    let html = `
        <h3>3. Plan: Migration Waves</h3>
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Create Migration Wave</h5>
                        <form id="create-wave-form">
                            <div class="mb-3">
                                <label class="form-label">Wave Name</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Start Date</label>
                                    <input type="date" class="form-control" name="start_date">
                                </div>
                                <div class="col">
                                    <label class="form-label">End Date</label>
                                    <input type="date" class="form-control" name="end_date">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Select Workloads</label>
                                <select class="form-select" name="workload_ids" multiple required>
                                    ${workloads.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Create Wave</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Ingest Waves</h5>
                        <form id="ingest-wave-form">
                            <div class="mb-3">
                                <label class="form-label">CSV or Excel File</label>
                                <input type="file" class="form-control" name="file" accept=".csv,.xlsx,.xls" required>
                            </div>
                            <button type="submit" class="btn btn-success">Upload & Ingest</button>
                        </form>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Strategy Recommendations</h5>
                        <p>Select a workload to get a migration strategy recommendation.</p>
                        <div class="input-group mb-3">
                            <select class="form-select" id="rec-workload-id">
                                ${workloads.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                            </select>
                            <button class="btn btn-outline-secondary" type="button" id="get-rec-btn">Get Recommendation</button>
                        </div>
                        <div id="recommendation-result"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <h4>Migration Waves</h4>
        <div class="list-group">
            ${waves.map(wave => `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${wave.name}</h5>
                        <small>${wave.start_date || ''} to ${wave.end_date || ''}</small>
                    </div>
                    <p class="mb-1">Workloads: ${wave.workload_ids.length}</p>
                </div>
            `).join('')}
            ${waves.length === 0 ? '<p class="text-center">No waves planned yet.</p>' : ''}
        </div>
    `;
    
    contentArea.innerHTML = html;
    
    document.getElementById('create-wave-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedWorkloads = Array.from(e.target.workload_ids.selectedOptions).map(opt => opt.value);
        
        const data = {
            name: formData.get('name'),
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            workload_ids: selectedWorkloads
        };
        
        const res = await fetch('/plan/waves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) { alert('Wave created!'); renderPlan(); }
    };

    document.getElementById('ingest-wave-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('/plan/ingest/waves', { method: 'POST', body: formData });
        if (res.ok) { alert((await res.json()).message); renderPlan(); }
    };

    document.getElementById('get-rec-btn').onclick = async () => {
        const id = document.getElementById('rec-workload-id').value;
        if (!id) return;
        const res = await fetch(`/plan/recommendations/${id}`);
        const rec = await res.json();
        document.getElementById('recommendation-result').innerHTML = `
            <div class="alert alert-info">
                <strong>Recommended Strategy:</strong> ${rec.recommended_strategy}<br>
                <strong>Reasoning:</strong> ${rec.reasoning}
            </div>
        `;
    };
}

window.renderPlan = renderPlan;
