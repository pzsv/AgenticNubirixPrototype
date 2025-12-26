// --- Module: Home ---
(function() {
    if (typeof window === 'undefined') return;

function renderHome(context = 'modern') {
    const contentArea = document.getElementById('main-area');
    const prepareModule = context === 'old' ? 'prepare-old' : 'prepare';
    const prepareDesc = context === 'old' 
        ? 'Legacy data discovery and ingestion workflow.' 
        : 'Modernized data discovery and ingestion platform.';
    const prepareIcon = context === 'old' ? 'bi-search' : 'bi-speedometer2';

    const html = `
        <div class="container text-center py-5">
            <h1 class="fw-bold">Workload Overview</h1>
            <p class="text-muted mb-5">Understand your data centre estate in five structured phases.<br>Follow the process from discovery to evaluation.</p>
            
            <div class="row g-4 mb-5">
                <div class="col">
                    <div class="phase-card prepare">
                        <div class="phase-icon"><i class="bi ${prepareIcon}"></i></div>
                        <h5 class="fw-bold">Prepare</h5>
                        <p class="small text-muted">${prepareDesc}</p>
                        <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'${prepareModule}\\']').click()">Start Phase &rarr;</a>
                    </div>
                </div>
                <div class="col">
                    <div class="phase-card map">
                        <div class="phase-icon"><i class="bi bi-diagram-3"></i></div>
                        <h5 class="fw-bold">Map</h5>
                        <p class="small text-muted">Create a visual system map and validate dependencies.</p>
                        <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'map\\']').click()">Start Phase &rarr;</a>
                    </div>
                </div>
                <div class="col">
                    <div class="phase-card plan">
                        <div class="phase-icon"><i class="bi bi-calendar-event"></i></div>
                        <h5 class="fw-bold">Plan</h5>
                        <p class="small text-muted">Define migration strategies, waves and schedules.</p>
                        <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'plan\\']').click()">Start Phase &rarr;</a>
                    </div>
                </div>
                <div class="col">
                    <div class="phase-card move">
                        <div class="phase-icon"><i class="bi bi-arrow-repeat"></i></div>
                        <h5 class="fw-bold">Move</h5>
                        <p class="small text-muted">Execute the migration plan and track progress.</p>
                        <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'move\\']').click()">Start Phase &rarr;</a>
                    </div>
                </div>
                <div class="col">
                    <div class="phase-card evaluate">
                        <div class="phase-icon"><i class="bi bi-bar-chart"></i></div>
                        <h5 class="fw-bold">Evaluate</h5>
                        <p class="small text-muted">Assess results and optimise for the future.</p>
                        <a href="#" class="btn-start-phase" onclick="document.querySelector('[data-module=\\'evaluate\\']').click()">Start Phase &rarr;</a>
                    </div>
                </div>
            </div>

            <hr class="my-5">

            <div class="py-4">
                <h4 class="fw-bold">Get in touch</h4>
                <p class="text-muted">Have questions, feedback, or need support?</p>
                <button class="btn btn-outline-dark px-4 py-2">Contact Us &rarr;</button>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;
}

window.renderHome = renderHome;
})();
