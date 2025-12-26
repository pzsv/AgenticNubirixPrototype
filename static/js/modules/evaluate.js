// --- Module: Evaluate ---
(function() {
    if (typeof window === 'undefined') return;

async function renderEvaluate() {
    const contentArea = document.getElementById('main-area');
    const [dashRes, reportsRes] = await Promise.all([
        fetch('/evaluate/dashboard'),
        fetch('/evaluate/reports')
    ]);
    const dash = await dashRes.json();
    const reports = await reportsRes.json();
    
    let html = `
        <h3>5. Evaluate: Dashboard & Reports</h3>
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-center bg-light">
                    <div class="card-body">
                        <h5 class="card-title">Total CIs</h5>
                        <p class="display-6">${dash.total_cis}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center bg-light">
                    <div class="card-body">
                        <h5 class="card-title">Workloads</h5>
                        <p class="display-6">${dash.total_workloads}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center bg-light">
                    <div class="card-body">
                        <h5 class="card-title">Waves</h5>
                        <p class="display-6">${dash.total_waves}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title">Progress</h5>
                        <p class="display-6">${(dash.migration_progress * 100).toFixed(0)}%</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Financial & ESG</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                TCO Savings
                                <span class="badge bg-success rounded-pill">$${dash.total_estimated_tco_savings.toLocaleString()}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                ESG Score
                                <span class="badge bg-info rounded-pill">${dash.esg_impact_score}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Risk Summary</h5>
                        <div class="d-flex justify-content-around">
                            <div class="text-center">
                                <div class="text-danger fw-bold">${dash.risk_summary.high}</div>
                                <small>High</small>
                            </div>
                            <div class="text-center">
                                <div class="text-warning fw-bold">${dash.risk_summary.medium}</div>
                                <small>Medium</small>
                            </div>
                            <div class="text-center">
                                <div class="text-success fw-bold">${dash.risk_summary.low}</div>
                                <small>Low</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h4>Reports</h4>
        <div class="row">
            ${reports.map(report => `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-header">${report.title}</div>
                        <div class="card-body">
                            <pre>${JSON.stringify(report.data, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    contentArea.innerHTML = html;
}

window.renderEvaluate = renderEvaluate;
})();
