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
                                <a href="#migration-management" class="list-group-item list-group-item-action">Migration Management</a>
                                <a href="#data-management" class="list-group-item list-group-item-action">Data Management</a>
                                <a href="#configuration" class="list-group-item list-group-item-action">Configuration</a>
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
                            <p>The application provides a structured, linear workflow that guides migration teams from initial data discovery to final execution and evaluation. By centralizing all migration-related data and decisions, Nubirix ensures consistency, reduces risk, and provides clear visibility into the progress and impact of the migration project.</p>
                            <p>Key benefits include automated data validation, intelligent workload mapping, standardized runbook generation, and real-time progress tracking.</p>
                        </section>

                        <section id="migration-management" class="mb-5">
                            <h3>Migration Management</h3>
                            <p>The core workflow of your migration project is managed through these modules:</p>
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-house-door text-primary me-2"></i> Home</h5>
                                            <p class="small mb-0">Your central command center. Provides a high-level overview of the project status, including migration progress, workload distribution, and key performance indicators. It helps project managers quickly identify bottlenecks and track overall health.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-search text-primary me-2"></i> Prepare</h5>
                                            <p class="small mb-0">The foundation of any migration. Ingest data from multiple sources (Excel, CSV, CMDB, Network Scans), validate its quality against the Data Dictionary, and consolidate it into a single source of truth (Golden Records). This module handles data cleansing and normalization to ensure high-quality input for subsequent phases.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-diagram-3 text-primary me-2"></i> Map</h5>
                                            <p class="small mb-0">Group individual Configuration Items (CIs) into logical Application Workload Instances (AWIs). Define internal and external dependencies using visual mapping tools and calculate readiness scores through the Source-to-Target (S2T) mapping process.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-calendar-event text-primary me-2"></i> Plan</h5>
                                            <p class="small mb-0">Organize workloads into Migration Waves. Assign migration strategies (the 7 Rs) and schedule the move. Nubirix helps balance wave sizes and considers Move Dependency Groups (MDGs) to optimize the migration timeline.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-arrow-repeat text-primary me-2"></i> Move</h5>
                                            <p class="small mb-0">Generate and manage detailed Migration Runbooks. These step-by-step technical guides are customized for each workload and migration strategy, ensuring that execution teams follow a standardized, repeatable process during the actual migration window.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-bar-chart text-primary me-2"></i> Evaluate</h5>
                                            <p class="small mb-0">Analyze the outcomes of your migration. Track progress against targets, evaluate the Total Cost of Ownership (TCO) changes, assess ESG (Environmental, Social, and Governance) impact, and review migration risks through comprehensive, interactive dashboards.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="data-management" class="mb-5">
                            <h3>Data Management</h3>
                            <p>Tools for managing the underlying data architecture and discovery results:</p>
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-file-earmark-text text-primary me-2"></i> Discovered Data</h5>
                                            <p class="small mb-0">Access and manage raw data entities discovered during the initial phase. This module allows you to review the raw inputs before they are processed and consolidated into the main migration database.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-book text-primary me-2"></i> Data Dictionary</h5>
                                            <p class="small mb-0">Define the standardized fields, data types, and allowed values used across the entire application. The Data Dictionary ensures data consistency and provides the rules for automated data validation during the Prepare phase.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-diagram-2 text-primary me-2"></i> Data Entities</h5>
                                            <p class="small mb-0">Configure the high-level data models and relationships within Nubirix. Manage how different types of configuration items and workloads are structured and how they relate to each other.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="configuration" class="mb-5">
                            <h3>Configuration</h3>
                            <p>Global settings and frameworks that govern the migration logic:</p>
                            <div class="row g-4">
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-database text-primary me-2"></i> Environments</h5>
                                            <p class="small mb-0">Define the source and target environments for your migration (e.g., On-Premise Data Centre, AWS Production, Azure Staging). This helps in tracking where workloads are coming from and where they are going.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-journal-text text-primary me-2"></i> Move Principles</h5>
                                            <p class="small mb-0">Customize the "7 Rs" migration strategies. Define the rules and characteristics for Rehosting, Refactoring, Replatforming, etc., to align with your organization's specific cloud adoption framework.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5><i class="bi bi-check2-square text-primary me-2"></i> Score Card</h5>
                                            <p class="small mb-0">Configure the scoring system used to evaluate migration readiness and risk. Define factors (e.g., technical complexity, business criticality), assign weights, and set scoring options to provide a quantitative assessment of each workload.</p>
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
                                        <td>The smallest unit of discovery. Includes Servers, VMs, Databases, Storage volumes, and Network devices. Each CI has a set of attributes defined in the Data Dictionary.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Application Workload Instance (AWI)</strong></td>
                                        <td>A logical grouping of CIs that support a specific business application or service. AWIs (often referred to as Workloads) are the primary unit of migration and planning.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Dependency</strong></td>
                                        <td>A relationship between two entities (CIs or AWIs), indicating a network flow, data exchange, or architectural requirement that must be considered during migration.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Move Dependency Group (MDG)</strong></td>
                                        <td>A collection of AWIs that have strong inter-dependencies and should ideally be migrated together in the same wave.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Wave</strong></td>
                                        <td>A group of workloads (AWIs or MDGs) scheduled to be migrated during a specific time window. Waves help in managing resources and reducing risk.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Data Dictionary</strong></td>
                                        <td>The master schema that defines all possible fields and valid values for data ingested into Nubirix.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Move Principle (7 Rs)</strong></td>
                                        <td>A migration strategy assigned to a workload, determining the technical path it will take to the target environment.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Score Card Factor</strong></td>
                                        <td>A specific criterion (e.g., "Data Sovereignty", "Complexity") used to calculate a readiness or risk score for a workload.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section id="logic" class="mb-5">
                            <h3>App Logic & Data Pipeline</h3>
                            <h5>Background Logic: The Data Pipeline</h5>
                            <p>Nubirix follows a modernized 5-step pipeline for data processing in the Prepare module to ensure data integrity:</p>
                            <ol>
                                <li><strong>Ingestion:</strong> Collecting raw data from various sources like spreadsheets, CMDB exports, or discovery tools.</li>
                                <li><strong>Standardisation:</strong> Mapping source fields from different origins to the standard target entities and fields defined in the application.</li>
                                <li><strong>Normalisation:</strong> The system automatically validates and transforms data against the Data Dictionary rules (e.g., converting all memory values to GB).</li>
                                <li><strong>Aggregation:</strong> Merging data from multiple sources to create a "Golden Record" for each CI, resolving conflicts based on source priority.</li>
                                <li><strong>Publish:</strong> Moving the clean, consolidated "Golden Records" into the active migration database, making them available for mapping to AWIs.</li>
                            </ol>
                            <h5>System Correlations</h5>
                            <p>The application maintains strict referential integrity and logical flow:</p>
                            <ul>
                                <li><strong>CI to AWI:</strong> Every CI must be associated with an AWI to be included in the migration planning process.</li>
                                <li><strong>Source-to-Target (S2T):</strong> Each AWI is mapped to its target environment and migration principle, where it is also scored based on the Score Card configuration.</li>
                                <li><strong>MDG Formation:</strong> AWIs with critical dependencies are grouped into MDGs to ensure they are migrated as a single unit.</li>
                                <li><strong>Strategy-Driven Runbooks:</strong> The content of a Runbook is dynamically generated based on the AWI's properties and its assigned Move Principle.</li>
                            </ul>
                        </section>

                        <section id="migration-knowledge" class="mb-5">
                            <h3>Migration Knowledge</h3>
                            <h5>Why Migrate to the Cloud?</h5>
                            <ul>
                                <li><strong>Cost Optimization:</strong> Shift from heavy capital expenditure (CapEx) to a flexible operational expenditure (OpEx) model.</li>
                                <li><strong>Scalability:</strong> Dynamically adjust resources to meet demand, avoiding over-provisioning.</li>
                                <li><strong>Operational Agility:</strong> Rapidly deploy new applications and services to meet business needs.</li>
                                <li><strong>Modernization:</strong> Transition from legacy infrastructure to cloud-native services like containers, serverless, and managed databases.</li>
                            </ul>
                            <h5>The Criticality of Discovery</h5>
                            <p>Discovery is the foundation of a successful migration. Accurate data minimizes risks, prevents service disruptions, and ensures that the target environment is sized correctly. Common methods supported by Nubirix data ingestion include:</p>
                            <ul>
                                <li><strong>CMDB Integration:</strong> Leveraging existing asset management databases.</li>
                                <li><strong>Automated Scanning:</strong> Using network discovery tools to identify active assets and their communication patterns.</li>
                                <li><strong>Performance Profiling:</strong> Collecting CPU, memory, and disk usage data to right-size target cloud resources.</li>
                            </ul>
                        </section>

                        <section id="migration-principles" class="mb-5">
                            <h3>Migration Principles (The 7 Rs)</h3>
                            <p>Each workload is assigned a strategy from the "7 Rs" framework, which governs the technical approach to its migration:</p>
                            <div class="list-group">
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">1. Rehost (Lift & Shift)</h6>
                                    <p class="mb-1 small">Moving an application to the cloud as-is without any changes. This is the fastest method but doesn't take full advantage of cloud-native features.</p>
                                </div>
                                <div class="list-group-item border-primary bg-primary bg-opacity-10">
                                    <h6 class="mb-1 fw-bold text-primary">2. Relocate (The 7th R)</h6>
                                    <p class="mb-1 small">Moving infrastructure to the cloud (e.g., VMware Cloud on AWS) without functional changes, new hardware, or rewriting IP addresses. It's often the fastest path with minimal downtime.</p>
                                </div>
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">3. Replatform (Lift, Tinker & Shift)</h6>
                                    <p class="mb-1 small">Moving an application with minor optimizations—like switching to a managed database service—without changing the core architecture.</p>
                                </div>
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">4. Refactor / Rearchitect</h6>
                                    <p class="mb-1 small">Reimagining the application using cloud-native features like microservices and serverless. This offers the highest benefit but requires the most effort.</p>
                                </div>
                                <div class="list-group-item">
                                    <h6 class="mb-1 fw-bold text-primary">5. Repurchase (Drop & Shop)</h6>
                                    <p class="mb-1 small">Moving to a different product, typically a SaaS platform (e.g., moving from an on-premise email server to Microsoft 365).</p>
                                </div>
                                <div class="list-group-item text-muted">
                                    <h6 class="mb-1 fw-bold">6. Retire</h6>
                                    <p class="mb-1 small">Decommissioning applications that are no longer needed, saving costs and reducing the attack surface.</p>
                                </div>
                                <div class="list-group-item text-muted">
                                    <h6 class="mb-1 fw-bold">7. Retain</h6>
                                    <p class="mb-1 small">Keeping the application in its current environment, often due to technical complexity, regulatory requirements, or low business value.</p>
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
