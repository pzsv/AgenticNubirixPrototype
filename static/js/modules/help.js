(function() {
    window.renderHelp = function() {
        const contentArea = document.getElementById('main-area');
        contentArea.innerHTML = `
            <div class="container-fluid">
                <div class="row mb-4">
                    <div class="col">
                        <h1 class="h2">Help Center</h1>
                        <p class="text-muted">Comprehensive guide to Nubirix and Cloud Migration principles.</p>
                    </div>
                </div>

                <div class="row">
                    <!-- Navigation Sidebar for Help -->
                    <div class="col-md-3">
                        <div class="card shadow-sm mb-4">
                            <div class="list-group list-group-flush" id="help-nav">
                                <a href="#introduction" class="list-group-item list-group-item-action active">Introduction</a>
                                <a href="#features" class="list-group-item list-group-item-action">Core Features</a>
                                <a href="#data-structures" class="list-group-item list-group-item-action">Data Structures</a>
                                <a href="#logic" class="list-group-item list-group-item-action">App Logic & Pipeline</a>
                                <a href="#migration-knowledge" class="list-group-item list-group-item-action">Migration Knowledge</a>
                                <a href="#migration-principles" class="list-group-item list-group-item-action">Migration Principles (7 Rs)</a>
                            </div>
                        </div>
                    </div>

                    <!-- Help Content -->
                    <div class="col-md-9" style="height: calc(100vh - 200px); overflow-y: auto; padding-right: 20px;">
                        <section id="introduction" class="mb-5">
                            <h3>Introduction to Nubirix</h3>
                            <p>Nubirix is an enterprise-grade Data Centre Migration platform designed to streamline the complex process of moving workloads from on-premises environments to the cloud or between data centres.</p>
                            <p>The application provides a structured, linear workflow that guides migration teams from initial data discovery to final execution and evaluation.</p>
                        </section>

                        <section id="features" class="mb-5">
                            <h3>Core Features</h3>
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-search text-primary me-2"></i> Prepare</h5>
                                            <p class="small mb-0">The foundation of any migration. Ingest data from multiple sources (Excel, CSV, CMDB, Network Scans), validate its quality, and consolidate it into a single source of truth.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-diagram-3 text-primary me-2"></i> Map</h5>
                                            <p class="small mb-0">Group individual Configuration Items (CIs) into logical Workloads. Define internal and external dependencies to ensure migration waves don't break application functionality.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-calendar-event text-primary me-2"></i> Plan</h5>
                                            <p class="small mb-0">Organize workloads into Migration Waves. Nubirix provides strategy recommendations based on workload characteristics and business requirements.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-arrow-repeat text-primary me-2"></i> Move</h5>
                                            <p class="small mb-0">Generate detailed Migration Runbooks. These step-by-step guides ensure that technical teams follow a standardized process during the actual move.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-bar-chart text-primary me-2"></i> Evaluate</h5>
                                            <p class="small mb-0">Track migration progress in real-time. Analyze Total Cost of Ownership (TCO), ESG impact, and migration risks through comprehensive dashboards.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-gear text-primary me-2"></i> Configuration</h5>
                                            <p class="small mb-0">Manage global settings like Environments and Move Principles (the 7 Rs) that govern how the migration is planned and executed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="data-structures" class="mb-5">
                            <h3>Data Structures</h3>
                            <table class="table table-hover border">
                                <thead class="table-light">
                                    <tr>
                                        <th>Entity</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Configuration Item (CI)</strong></td>
                                        <td>The smallest unit of discovery. Includes Servers, VMs, Databases, Storage volumes, and Network devices.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Workload</strong></td>
                                        <td>A logical grouping of CIs that support a specific business application or service. These are migrated together.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Dependency</strong></td>
                                        <td>A relationship between two workloads or CIs, indicating a network or data flow requirement.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Wave</strong></td>
                                        <td>A group of workloads scheduled to be migrated during a specific time window.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Data Dictionary</strong></td>
                                        <td>Defines the standardized fields and values used across the application to ensure data consistency.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section id="logic" class="mb-5">
                            <h3>App Logic & Data Pipeline</h3>
                            <h5>Background Logic: The Data Pipeline</h5>
                            <p>Nubirix follows a 7-phase pipeline for data processing in the Prepare module:</p>
                            <ol>
                                <li><strong>Ingestion:</strong> Collecting raw data from various sources.</li>
                                <li><strong>Staging:</strong> Holding area for raw data before validation.</li>
                                <li><strong>Validation:</strong> Checking data against the Data Dictionary for errors or missing values.</li>
                                <li><strong>Transformation:</strong> Normalizing data formats (e.g., date formats, unit conversions).</li>
                                <li><strong>Consolidation:</strong> Merging duplicate records from different sources into a "Golden Record".</li>
                                <li><strong>Publishing:</strong> Moving consolidated data into the active migration database.</li>
                                <li><strong>Mapping:</strong> Linking published CIs to Workloads.</li>
                            </ol>
                            <h5>Correlations</h5>
                            <p>The app maintains strict referential integrity between entities:</p>
                            <ul>
                                <li>A <strong>Workload</strong> consists of one or more <strong>CIs</strong>.</li>
                                <li><strong>Dependencies</strong> link a Source Workload to a Target Workload.</li>
                                <li>A <strong>Wave</strong> contains multiple <strong>Workloads</strong>.</li>
                                <li>A <strong>Runbook</strong> is uniquely generated for a specific <strong>Workload</strong> based on its properties and chosen Migration Principle.</li>
                            </ul>
                        </section>

                        <section id="migration-knowledge" class="mb-5">
                            <h3>Migration Knowledge</h3>
                            <h5>Why Migrate to the Cloud?</h5>
                            <ul>
                                <li><strong>Cost Optimization:</strong> Move from CapEx to OpEx models.</li>
                                <li><strong>Scalability:</strong> Instantly scale resources up or down based on demand.</li>
                                <li><strong>Agility:</strong> Faster time-to-market for new features and applications.</li>
                                <li><strong>Modernization:</strong> Leverage cloud-native services like Serverless, Managed DBs, and AI.</li>
                            </ul>
                            <h5>The Discovery Phase</h5>
                            <p>Discovery is the most critical part of a migration. Without accurate data about your current environment, migration risks increase exponentially. Key discovery methods include:</p>
                            <ul>
                                <li><strong>CMDB Export:</strong> Using existing asset management data.</li>
                                <li><strong>Network Scanning:</strong> Identifying active assets and communication flows.</li>
                                <li><strong>Agent-based Discovery:</strong> Installing software on servers for deep performance and dependency insights.</li>
                            </ul>
                        </section>

                        <section id="migration-principles" class="mb-5">
                            <h3>Migration Principles (The 7 Rs)</h3>
                            <p>When planning a migration, each workload is assigned a strategy. Nubirix supports the modern "7 Rs" framework:</p>
                            <div class="list-group">
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">1. Rehost (Lift & Shift)</h6>
                                    <p class="mb-1 small">Moving an application to the cloud as-is without any changes. Fast but doesn't leverage cloud-native benefits.</p>
                                </div>
                                <div class="list-group-item border-primary bg-primary bg-opacity-10">
                                    <h6 class="mb-1 fw-bold text-primary">2. Relocate (The 7th R)</h6>
                                    <p class="mb-1 small">Moving infrastructure to the cloud without functional changes, new hardware, or rewriting IP addresses. Common in VMware Cloud on AWS scenarios. It offers the fastest path to the cloud with zero application downtime.</p>
                                </div>
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">3. Replatform (Lift, Tinker & Shift)</h6>
                                    <p class="mb-1 small">Moving an application with minor optimizations (e.g., moving to a managed database service) without changing the core architecture.</p>
                                </div>
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">4. Refactor / Rearchitect</h6>
                                    <p class="mb-1 small">Reimagining how an application is architected using cloud-native features like microservices and serverless.</p>
                                </div>
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">5. Repurchase (Drop & Shop)</h6>
                                    <p class="mb-1 small">Moving to a different product, typically a SaaS platform (e.g., moving from on-prem Exchange to Microsoft 365).</p>
                                </div>
                                <div class="list-group-item text-muted">
                                    <h6 class="mb-1 fw-bold">6. Retire</h6>
                                    <p class="mb-1 small">Decommissioning applications that are no longer needed.</p>
                                </div>
                                <div class="list-group-item text-muted">
                                    <h6 class="mb-1 fw-bold">7. Retain</h6>
                                    <p class="mb-1 small">Keeping the application in its current environment (usually because it's too complex to move or has low business value).</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        `;

        // Add scrollspy or manual navigation logic
        const navLinks = document.querySelectorAll('#help-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                targetElement.scrollIntoView({ behavior: 'smooth' });
            });
        });
    };
})();
