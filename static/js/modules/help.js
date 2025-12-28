(function() {
    const granularHelpContent = {
        'help-prepare-ingestion': {
            title: 'Prepare: Ingestion',
            icon: 'bi-cloud-download',
            description: 'Ingestion is the first step in the Nubirix data pipeline. it involves collecting raw data from various discovery sources and bringing it into a centralized staging area.',
            significance: 'Accurate migration starts with comprehensive data. Ingestion ensures that every server, application, and database in your estate is accounted for before any decisions are made.',
            input: 'Excel spreadsheets, CSV files, CMDB exports, and automated outputs from discovery tools like RVTools, Movere, or Cloudamize.',
            dataUsed: 'Server inventories, application catalogs, database lists, and network communication logs.',
            output: 'Raw "Discovered Data" entities stored in the platform, maintaining a verbatim record of the source data.',
            correlation: 'Feeds raw data into the **Standardisation** phase. Without ingestion, there is no data to process.'
        },
        'help-prepare-ingestion-sources': {
            title: 'Ingestion: Active Data Sources',
            icon: 'bi-database',
            description: 'This screen shows all the data sources that have been successfully ingested and are now part of the discovery inventory.',
            details: [
                {
                    label: 'Active Sources',
                    content: 'A list of all discovery files, scans, and CMDB connections that are currently contributing data.'
                },
                {
                    label: 'Ingestion Methods',
                    content: 'You can use File Ingestion, Network Scans, CMDB Connect, or Manual Entry to bring data into the platform.'
                },
                {
                    label: 'Filtering',
                    content: 'Use the method cards at the top to filter the active sources list by their ingestion type.'
                }
            ]
        },
        'help-prepare-ingestion-discovered': {
            title: 'Ingestion: Discovered Data',
            icon: 'bi-file-earmark-text',
            description: 'This view provides a direct look at the raw discovery records across all ingestion methods.',
            details: [
                {
                    label: 'Raw Records',
                    content: 'Every server, application, and database record as it was initially discovered, before any standardisation.'
                },
                {
                    label: 'Source Tracking',
                    content: 'Shows exactly which file or scan produced each record, along with the timestamp of discovery.'
                }
            ]
        },
        'help-prepare-standardisation': {
            title: 'Prepare: Standardisation',
            icon: 'bi-diagram-3',
            description: 'Standardisation is the process of mapping disparate source fields to the unified Nubirix Data Dictionary schema.',
            significance: 'Different discovery tools use different naming conventions (e.g., "Memory", "RAM", "Physical Memory"). Standardisation ensures that the platform treats them as the same attribute, enabling consistent analysis.',
            input: 'Raw records collected during the Ingestion phase.',
            dataUsed: 'User-defined field mappings between source columns and Data Dictionary fields.',
            output: 'Standardized records where all attributes are aligned to the platform\'s internal data model.',
            correlation: 'Prerequisite for **Normalisation**. It bridges the gap between raw source data and internal data structures.'
        },
        'help-prepare-standardisation-sources': {
            title: 'Standardisation: Data Sources',
            icon: 'bi-database',
            description: 'This screen lists all the data sources that have been ingested into the platform and are awaiting standardisation.',
            details: [
                {
                    label: 'What are Data Sources?',
                    content: 'Data Sources represent the origins of your discovery data, such as RVTools exports, CMDB dumps, or cloud-native discovery tool outputs.'
                },
                {
                    label: 'Source Types',
                    content: 'Sources can be "File" (Excel/CSV), "Network" (scanned data), "CMDB" (connected databases), or "Manual" (direct entry).'
                },
                {
                    label: 'Worksheet/Data',
                    content: 'Indicates the specific sheet name from an Excel file or the data category for other source types.'
                },
                {
                    label: 'Quality Rating',
                    content: 'A visual indicator of the data\'s completeness and reliability. High quality means fewer missing fields and consistent formatting.'
                },
                {
                    label: 'Status',
                    content: 'Shows whether the data is "Success" (ready for mapping), "Warning" (needs attention), or "Failed" (ingestion error).'
                },
                {
                    label: 'Actions',
                    content: '"Review" allows you to see the raw data, while "Map Fields" takes you to the field-level standardisation screen.'
                }
            ]
        },
        'help-prepare-standardisation-entities': {
            title: 'Standardisation: Data Entities',
            icon: 'bi-diagram-2',
            description: 'Data Entities are the logical definitions of objects in Nubirix, such as Servers, Databases, or Applications.',
            details: [
                {
                    label: 'What are Entities?',
                    content: 'An entity is a collection of related fields that define a specific type of asset. For example, a "Server" entity includes Hostname, CPU, RAM, and OS.'
                },
                {
                    label: 'The Entity Button',
                    content: 'Clicking an entity name allows you to "Drill Down" into the specific fields and discovery records associated with that entity type.'
                },
                {
                    label: 'How to Drill Down',
                    content: 'Use the "View Fields" action to see all attributes defined for this entity and how many sources are providing data for them.'
                },
                {
                    label: 'Key Fields',
                    content: 'Key fields (marked with a key icon) are unique identifiers used to correlate the same asset across different data sources.'
                }
            ]
        },
        'help-prepare-standardisation-dictionary': {
            title: 'Standardisation: Data Dictionary',
            icon: 'bi-book',
            description: 'The Data Dictionary is the master catalog of every field known to the platform.',
            details: [
                {
                    label: 'Master Schema',
                    content: 'It defines the "target" structure that all source data must be mapped to during standardisation.'
                },
                {
                    label: 'Field Definitions',
                    content: 'Each entry includes the field name, data type (String, Integer, etc.), and which entities it belongs to.'
                },
                {
                    label: 'Standard Values',
                    content: 'Defines the allowed values for specific fields (e.g., OS types or Environment names) to ensure data consistency.'
                }
            ]
        },
        'help-prepare-standardisation-discovered': {
            title: 'Standardisation: Discovered Data',
            icon: 'bi-file-earmark-text',
            description: 'This view shows the raw, un-standardized records as they were received from the discovery sources.',
            details: [
                {
                    label: 'Verbatim Records',
                    content: 'It provides a "read-only" look at the raw input before any transformations or mappings are applied.'
                },
                {
                    label: 'Debugging Tools',
                    content: 'Use this to verify if a missing value in the "Golden Record" was actually present in the source data.'
                },
                {
                    label: 'Source Correlation',
                    content: 'Shows which specific discovery file or scan produced each record.'
                }
            ]
        },
        'help-prepare-normalisation': {
            title: 'Prepare: Normalisation',
            icon: 'bi-magic',
            description: 'Normalisation is the process of aligning inconsistent data values from different sources into a single, standardized format.',
            details: [
                {
                    label: 'Value Alignment',
                    content: 'Discovery tools often use different labels for the same thing (e.g., "PROD", "Production", "p"). Normalisation maps these all to a single standard value.'
                },
                {
                    label: 'Data Issues',
                    content: 'The platform identifies fields with inconsistent values that need your attention. You can see the frequency of each raw value to help decide on the correct mapping.'
                },
                {
                    label: 'Unit Conversion',
                    content: 'Normalisation also handles technical conversions, such as making sure all Memory values are in GB and all Storage values are in TB.'
                }
            ],
            significance: 'Calculations for TCO and right-sizing require uniform data. Normalisation converts values like "16384 MB" and "16 GB" into a single unit (e.g., GB) and validates values against allowed lists.',
            input: 'Standardized records from the previous phase.',
            dataUsed: 'Data Dictionary validation rules, transformation logic (unit conversions), and allowed value lists.',
            output: 'Clean, validated data records with consistent units across all sources.',
            correlation: 'Prepares clean data for **Aggregation**. It ensures that "apples-to-apples" comparisons can be made between sources.'
        },
        'help-prepare-aggregation': {
            title: 'Prepare: Aggregation',
            icon: 'bi-combine',
            description: 'Aggregation resolves conflicts when multiple data sources provide information about the same Configuration Item (CI).',
            details: [
                {
                    label: 'Conflict Resolution',
                    content: 'If Source A says a server has 4 CPUs and Source B says it has 8, Aggregation uses priority rules (Trust Scores) to determine the "Golden" value.'
                },
                {
                    label: 'Golden Records',
                    content: 'The output of this phase is a "Golden Record" — the most accurate, consolidated view of an asset across all known discovery data.'
                },
                {
                    label: 'Gaps & Overlaps',
                    content: 'Identifies where data is missing from preferred sources but available in secondary ones, allowing you to fill gaps in your estate knowledge.'
                }
            ],
            significance: 'Large estates often have overlapping discovery data. Aggregation resolves conflicts using intelligent source priority rules.',
            input: 'Multiple normalized records that refer to the same physical or logical asset.',
            dataUsed: 'Source priority rules (Trust Scores) and conflict resolution logic defined in the project settings.',
            output: 'A single, high-fidelity "Golden Record" for each Configuration Item, representing the most accurate known state.',
            correlation: 'Feeds the final records into the **Publish** phase. It is the step where "truth" is established.'
        },
        'help-prepare-publish': {
            title: 'Prepare: Publish',
            icon: 'bi-cloud-upload',
            description: 'Publishing promotes your validated Golden Records to the active migration inventory.',
            details: [
                {
                    label: 'Final Validation',
                    content: 'Ensures all mandatory fields are present and that the data meets the quality threshold required for migration planning.'
                },
                {
                    label: 'Data Lock',
                    content: 'Once published, the data is locked into the migration pipeline, ensuring that planners and engineers are working with a stable "point-in-time" snapshot.'
                },
                {
                    label: 'Hand-off',
                    content: 'Successfully published CIs immediately become available in the Map and Plan modules for technical and wave planning.'
                }
            ],
            significance: 'This step separates "data in preparation" from "data ready for planning". It provides a clean hand-off point for the migration architects.',
            input: 'Consolidated Golden Records from the Aggregation phase.',
            dataUsed: 'Final integrity checks and mandatory field validations.',
            output: 'Active Configuration Items (CIs) visible in the Map and Plan modules.',
            correlation: 'Enables the **Map** phase to begin. Once published, assets are locked in their "Golden" state for migration planning.'
        },
        'help-map-source-data': {
            title: 'Map: Source Data',
            icon: 'bi-database-check',
            description: 'This screen displays the Golden Records that have been published from the Prepare phase and are ready to be assigned to AWIs.',
            details: [
                {
                    label: 'Published CIs',
                    content: 'These are the "high-fidelity" records of your servers, databases, and other infrastructure assets.'
                },
                {
                    label: 'Mapping Status',
                    content: 'Indicates whether an asset has already been assigned to an Application Workload Instance (AWI).'
                },
                {
                    label: 'Technical Specs',
                    content: 'A summary of the hardware and software configuration of each asset, used to inform target sizing.'
                }
            ]
        },
        'help-map-awis': {
            title: 'Map: AWIs (Application Workload Instances)',
            icon: 'bi-box-seam',
            description: 'AWIs represent the logical grouping of Configuration Items (like servers and databases) into functional business units.',
            details: [
                {
                    label: 'What is an AWI?',
                    content: 'AWIs are the primary containers for migration. Instead of moving individual servers, we move applications and all their associated infrastructure together.'
                },
                {
                    label: 'AWI Components',
                    content: 'An AWI can contain multiple servers, databases, and other CIs. You can add or remove components to accurately reflect the application\'s footprint.'
                },
                {
                    label: 'Metadata',
                    content: 'AWIs include business-level information like Application Name, Criticality, Owner, and Business Unit.'
                }
            ],
            significance: 'We don\'t migrate servers; we migrate applications. Defining AWIs allows the team to plan around business services rather than just infrastructure.',
            input: 'Published CIs (Servers, DBs, etc.) and application metadata.',
            dataUsed: 'Application-to-Infrastructure relationship data, business service definitions.',
            output: 'Logical Workload containers (AWIs) that serve as the primary unit of migration.',
            correlation: 'Necessary foundation for **Dependency Mapping** and **S2T** planning. You cannot move a workload until you know what it consists of.'
        },
        'help-map-dependency-links': {
            title: 'Map: Dependency Links',
            icon: 'bi-diagram-3-fill',
            description: 'Dependency Links document the technical and logical relationships between different AWIs.',
            details: [
                {
                    label: 'Technical Dependencies',
                    content: 'Represent network-level communications between applications (e.g., App A talks to Database B over port 1433).'
                },
                {
                    label: 'Logical Dependencies',
                    content: 'Represent business-level relationships where one application requires another to function, even if there is no direct network traffic.'
                },
                {
                    label: 'Impact Analysis',
                    content: 'Understanding these links is crucial for determining which applications MUST move together to avoid service disruption.'
                }
            ],
            significance: 'Understanding dependencies is critical to avoiding "broken links" during migration. It identifies which applications talk to each other and must be considered together.',
            input: 'Defined AWIs and network traffic analysis (flows).',
            dataUsed: 'Port/protocol communications, API calls, and shared middleware dependencies.',
            output: 'A comprehensive dependency map (graph) showing the inter-connectivity of the estate.',
            correlation: 'Directly influences the formation of **Move Dependency Groups (MDGs)** and Wave planning.'
        },
        'help-map-s2ts': {
            title: 'Map: S2Ts (Source-to-Target)',
            icon: 'bi-arrow-right-circle',
            description: 'Source-to-Target mapping defines the destination environment and the technical strategy (7 Rs) for each AWI.',
            details: [
                {
                    label: 'The 7 Rs',
                    content: 'Each application is assigned a strategy: Rehost, Relocate, Replatform, Refactor, Repurchase, Retire, or Retain.'
                },
                {
                    label: 'Target Environment',
                    content: 'Specify where the application is moving to (e.g., AWS Production, Azure West Europe, or a new Internal Data Center).'
                },
                {
                    label: 'Right-sizing',
                    content: 'Compare source resource usage (CPU/RAM) with target instance types to optimize cost and performance.'
                }
            ],
            significance: 'S2T mapping turns a discovery record into a migration plan. It determines whether an app is being Rehosted, Replatformed, or Retired.',
            input: 'AWIs and available Target Environments.',
            dataUsed: 'Migration Principles (7 Rs), Target Cloud capabilities, and cost/effort estimates.',
            output: 'A defined migration path and target destination for every workload.',
            correlation: 'Feeds into the **Score Card** for readiness assessment and provides the basis for **Wave Planning**.'
        },
        'help-map-mdgs': {
            title: 'Map: MDGs (Move Dependency Groups)',
            icon: 'bi-intersect',
            description: 'MDGs are clusters of AWIs with high inter-dependency that should ideally be migrated in the same wave.',
            details: [
                {
                    label: 'Move Units',
                    content: 'MDGs represent the "minimum viable move unit". Moving an entire MDG together ensures all internal dependencies are preserved.'
                },
                {
                    label: 'Bundling Logic',
                    content: 'Applications are bundled into MDGs based on their technical dependency strength and shared infrastructure (e.g., a shared database cluster).'
                },
                {
                    label: 'Wave Input',
                    content: 'MDGs are the primary building blocks used during the Wave Planning phase.'
                }
            ],
            significance: 'MDGs minimize risk and post-migration performance issues by ensuring that tightly coupled systems move together, maintaining their low-latency connections.',
            input: 'AWIs and their associated Dependency Links.',
            dataUsed: 'Dependency strength algorithms and shared infrastructure constraints.',
            output: 'Migration-ready groups of workloads that act as a single "move unit".',
            correlation: 'Serves as the primary input for **Wave Planning** in the Plan phase. MDGs ensure that "no app is left behind".'
        },
        'help-plan': {
            title: 'Plan: Migration Waves',
            icon: 'bi-calendar-event',
            description: 'The Plan phase involves organizing AWIs and MDGs into Migration Waves (scheduled move windows).',
            details: [
                {
                    label: 'Wave Scheduling',
                    content: 'Define specific date windows for migrations. Waves can be organized by business unit, technical criticality, or location.'
                },
                {
                    label: 'Capacity Planning',
                    content: 'Ensure that the number of servers and applications in a wave doesn\'t exceed the available network bandwidth or engineering resources.'
                },
                {
                    label: 'Blackout Dates',
                    content: 'Mark periods where migrations are prohibited due to business events (e.g., end-of-quarter or holiday sales).'
                }
            ],
            significance: 'Effective planning balances the migration workload over time, ensuring that technical resources (like network bandwidth and migration engineers) are not overwhelmed.',
            input: 'AWIs, MDGs, and target migration dates.',
            dataUsed: 'Resource availability, business blackout dates, and workload priority.',
            output: 'A scheduled Migration Wave plan with assigned workloads for each window.',
            correlation: 'Feeds into the **Move** phase, where runbooks are generated for each planned wave.'
        },
        'help-move': {
            title: 'Move: Execution Runbooks',
            icon: 'bi-arrow-repeat',
            description: 'The Move phase focuses on generating and executing detailed technical runbooks for the migration window.',
            details: [
                {
                    label: 'Technical Runbooks',
                    content: 'Step-by-step task lists for the migration team, including pre-flight checks, data replication, and cutover activities.'
                },
                {
                    label: 'Execution Tracking',
                    content: 'Monitor the real-time status of each task in the runbook, allowing project managers to track progress during the migration window.'
                },
                {
                    label: 'Rollback Procedures',
                    content: 'Pre-defined steps to safely revert the migration in case of critical failures.'
                }
            ],
            significance: 'Runbooks provide a repeatable, standardized process for the technical move, reducing the chance of human error during high-pressure migration windows.',
            input: 'Planned Migration Waves and AWIs.',
            dataUsed: 'Technical migration templates based on the assigned 7 Rs strategy.',
            output: 'Task-level execution guides and real-time status of the migration progress.',
            correlation: 'The results of the Move phase are analyzed in the **Evaluate** module.'
        },
        'help-evaluate': {
            title: 'Evaluate: Post-Migration Analysis',
            icon: 'bi-bar-chart',
            description: 'Evaluate is the final phase where the outcomes of the migration are analyzed and reported.',
            details: [
                {
                    label: 'Success Metrics',
                    content: 'Analyze whether the migration met its targets for time, budget, and performance.'
                },
                {
                    label: 'TCO & ROI',
                    content: 'Calculate the actual cost savings and return on investment achieved by moving to the target environment.'
                },
                {
                    label: 'ESG Reporting',
                    content: 'Measure improvements in energy efficiency and carbon footprint reduction post-migration.'
                }
            ],
            significance: 'It proves the success of the project by showing TCO savings, ESG improvements, and verifying that all workloads reached their target destination safely.',
            input: 'Completed Migration Runbooks and post-migration asset state.',
            dataUsed: 'Financial models (CapEx vs OpEx), carbon footprint data, and project milestones.',
            output: 'Executive dashboards, savings reports, and lessons learned.',
            correlation: 'Provides feedback for future migration projects and validates the initial business case.'
        },
        'help-environments': {
            title: 'Configuration: Environments',
            icon: 'bi-database',
            description: 'Define and manage the source and target environments for your migration project.',
            details: [
                {
                    label: 'Source Environments',
                    content: 'Where your data is currently hosted (e.g., London DC1, Azure Legacy, On-prem VMware).'
                },
                {
                    label: 'Target Environments',
                    content: 'The destinations for your workloads (e.g., AWS Landing Zone, GCP Production, New Co-lo Facility).'
                },
                {
                    label: 'Environment Metadata',
                    content: 'Store specific details about each environment, such as location, security level, and contact person.'
                }
            ]
        },
        'help-move-principles': {
            title: 'Configuration: Move Principles',
            icon: 'bi-journal-text',
            description: 'The Move Principles (7 Rs) define the technical strategy for migrating each application.',
            details: [
                {
                    label: '7 Rs Strategy',
                    content: 'Standard strategies include Rehost, Relocate, Replatform, Refactor, Repurchase, Retire, and Retain.'
                },
                {
                    label: 'Customizing Strategies',
                    content: 'You can customize the descriptions and rules for each strategy to match your organization\'s cloud framework.'
                },
                {
                    label: 'Impact on Runbooks',
                    content: 'The chosen strategy for an AWI determines which task templates are used to generate its migration runbook.'
                }
            ]
        },
        'help-score-card': {
            title: 'Configuration: Score Card',
            icon: 'bi-check2-square',
            description: 'The Score Card is a quantitative framework for assessing migration readiness and risk.',
            details: [
                {
                    label: 'Scoring Factors',
                    content: 'Define the criteria used to judge readiness, such as "Business Criticality", "Technical Complexity", and "Data Sensitivity".'
                },
                {
                    label: 'Weighting',
                    content: 'Assign importance to different factors to calculate an overall readiness score (0-100%).'
                },
                {
                    label: 'Readiness Thresholds',
                    content: 'Set targets that an AWI must meet before it can be scheduled for a migration wave.'
                }
            ]
        },
        'help-discovered-data': {
            title: 'Data Management: Discovered Data',
            icon: 'bi-file-earmark-text',
            description: 'The master inventory of all raw data records discovered across all sources.',
            details: [
                {
                    label: 'Cross-Source View',
                    content: 'A unified list of every asset record discovered, regardless of the ingestion method used.'
                },
                {
                    label: 'Data Integrity',
                    content: 'Review the original source values before any platform-level transformations have been applied.'
                },
                {
                    label: 'Search & Export',
                    content: 'Search across all discovery results and export raw data for external analysis or reporting.'
                }
            ]
        },
        'help-data-dictionary': {
            title: 'Data Management: Data Dictionary',
            icon: 'bi-book',
            description: 'The central definition of all data structures and validation rules in the project.',
            details: [
                {
                    label: 'Schema Definition',
                    content: 'Manage the fields, types, and descriptions for every asset attribute known to the platform.'
                },
                {
                    label: 'Validation Rules',
                    content: 'Define which values are allowed and how they should be formatted to ensure high data quality.'
                },
                {
                    label: 'Lookup Lists',
                    content: 'Maintain standardized sets of values for dropdowns and automated normalisation.'
                }
            ]
        },
        'help-data-entities': {
            title: 'Data Management: Data Entities',
            icon: 'bi-diagram-2',
            description: 'Define the logical models for different types of migration assets.',
            details: [
                {
                    label: 'Entity Modeling',
                    content: 'Configure entities like Servers, Applications, Databases, and Storage Volumes.'
                },
                {
                    label: 'Attribute Assignment',
                    content: 'Group fields from the Data Dictionary into specific entities to build their comprehensive data profiles.'
                },
                {
                    label: 'Relationship Mapping',
                    content: 'Define how different entities relate to each other (e.g., "Database runs on Server").'
                }
            ]
        },
        'help-admin-project': {
            title: 'Admin: Project Management',
            icon: 'bi-kanban',
            description: 'Project Management allows administrators to control the high-level lifecycle of migration projects.',
            details: [
                {
                    label: 'Project Creation',
                    content: 'Set up new projects for different clients or internal migration initiatives.'
                },
                {
                    label: 'Global Settings',
                    content: 'Configure parameters that apply to all modules within the project.'
                },
                {
                    label: 'Archiving',
                    content: 'Safely archive completed projects to maintain platform performance while preserving historical data.'
                }
            ],
            significance: 'Ensures that multiple migrations can be managed within the same platform without data contamination.',
            input: 'Project names, client details, and global parameters.',
            dataUsed: 'Project metadata and archiving settings.',
            output: 'Isolated project environments for migration teams.',
            correlation: 'The root of all data in the platform. Every CI and AWI belongs to a specific project.'
        },
        'help-admin-users': {
            title: 'Admin: User Management',
            icon: 'bi-people',
            description: 'User Management controls who can access the platform and what actions they can perform.',
            details: [
                {
                    label: 'User Roles',
                    content: 'Assign roles like Super Admin, Architect, Analyst, or Viewer to restrict access based on job function.'
                },
                {
                    label: 'Feature Access',
                    content: 'Fine-grained control over who can read, write, or delete data in specific modules (e.g., Prepare vs. Move).'
                },
                {
                    label: 'Audit Trails',
                    content: 'Track user activity across the platform for security and compliance reporting.'
                }
            ],
            significance: 'Secures sensitive migration data by ensuring only authorized personnel can view or edit project information.',
            input: 'User credentials and role assignments.',
            dataUsed: 'Role-Based Access Control (RBAC) definitions.',
            output: 'Secure user sessions and audit logs.',
            correlation: 'Governs access across all modules in the platform.'
        },
        'help-admin-failures': {
            title: 'Admin: Process Failures',
            icon: 'bi-exclamation-triangle',
            description: 'Process Failures is a troubleshooting module that tracks background errors and task failures.',
            details: [
                {
                    label: 'Error Tracking',
                    content: 'View detailed logs and stack traces for failed data ingestions, normalization jobs, or network scans.'
                },
                {
                    label: 'Retry Mechanisms',
                    content: 'Attempt to re-run failed processes after correcting data issues or resolving system timeouts.'
                },
                {
                    label: 'System Health',
                    content: 'Get a high-level view of the platform\'s processing pipeline health and identify recurring bottlenecks.'
                }
            ],
            significance: 'Critical for maintaining data integrity during complex automated pipelines like Normalisation and Aggregation.',
            input: 'Error logs and system exceptions.',
            dataUsed: 'Background job metadata and stack traces.',
            output: 'Actionable alerts for system administrators to resolve data processing issues.',
            correlation: 'Monitors the health of the **Prepare** pipeline and other automated services.'
        }
    };

    window.renderHelp = function(sectionId) {
        const contentArea = document.getElementById('main-area');
        
        // Check if we should render a granular detail page
        if (sectionId && granularHelpContent[sectionId]) {
            renderGranularPage(sectionId);
            return;
        }

        // Standard Help Center Overview
        contentArea.innerHTML = `
            <div class="container-fluid">
                <div class="row mb-4">
                    <div class="col d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h2">Help Center</h1>
                            <p class="text-muted">Comprehensive guide to Nubirix and Cloud Migration principles.</p>
                        </div>
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
                                <a href="#admin-panel" class="list-group-item list-group-item-action">Admin Panel</a>
                                <a href="#data-structures" class="list-group-item list-group-item-action">Data Structures</a>
                                <a href="#logic" class="list-group-item list-group-item-action">App Logic & Pipeline</a>
                                <a href="#migration-knowledge" class="list-group-item list-group-item-action">Migration Knowledge</a>
                                <a href="#migration-principles" class="list-group-item list-group-item-action">Migration Principles (7 Rs)</a>
                            </div>
                        </div>
                        
                        <div class="card border-0 bg-primary bg-opacity-10 shadow-sm">
                            <div class="card-body">
                                <h6 class="fw-bold text-primary"><i class="bi bi-info-circle me-2"></i> Quick Tip</h6>
                                <p class="small mb-0 text-dark">Click the <i class="bi bi-question-circle"></i> icon on any screen to be brought directly to the relevant help page for that specific step.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Help Content -->
                    <div class="col-md-9" id="help-content-container" style="height: calc(100vh - 200px); overflow-y: auto; padding-right: 20px;">
                        <section id="introduction" class="mb-5">
                            <h3>Introduction to Nubirix</h3>
                            <p>Nubirix is an enterprise-grade Data Centre Migration platform designed to streamline the complex process of moving workloads from on-premises environments to the cloud or between data centres.</p>
                            <p>The application provides a structured, linear workflow that guides migration teams from initial data discovery to final execution and evaluation. By centralizing all migration-related data and decisions, Nubirix ensures consistency, reduces risk, and provides clear visibility into the progress and impact of the migration project.</p>
                            <p>Key benefits include automated data validation, intelligent workload mapping, standardized runbook generation, and real-time progress tracking.</p>
                        </section>

                        <section id="migration-management" class="mb-5">
                            <h3>Migration Management</h3>
                            <p>The core workflow of your migration project is managed through these modules:</p>
                            
                            <!-- Home -->
                            <div class="card mb-4 border-0 bg-light">
                                <div class="card-body">
                                    <h5 id="help-home"><i class="bi bi-house-door text-primary me-2"></i> Home</h5>
                                    <p>Your central command center. Provides a high-level overview of the project status, including migration progress, workload distribution, and key performance indicators. It helps project managers quickly identify bottlenecks and track overall health.</p>
                                </div>
                            </div>

                            <!-- Prepare Section -->
                            <div class="card mb-4 border-0 bg-light">
                                <div class="card-body">
                                    <h5 id="help-prepare"><i class="bi bi-search text-primary me-2"></i> Prepare</h5>
                                    <p>The foundation of any migration. Ingest data from multiple sources, validate its quality, and consolidate it into "Golden Records".</p>
                                    
                                    <div class="ms-4 mt-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-prepare-ingestion" class="fw-bold mb-0">1. Ingestion</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-prepare-ingestion'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">Upload files (Excel, CSV) or connect to discovery tools to bring raw data into the platform.</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-prepare-standardisation" class="fw-bold mb-0">2. Standardisation</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-prepare-standardisation'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">Map the fields from your source data to the standardized Nubirix Data Dictionary.</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-prepare-normalisation" class="fw-bold mb-0">3. Normalisation</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-prepare-normalisation'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">The system automatically transforms data into standard units and validates values.</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-prepare-aggregation" class="fw-bold mb-0">4. Aggregation</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-prepare-aggregation'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">Combine data from multiple sources to create a single, accurate "Golden Record".</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-prepare-publish" class="fw-bold mb-0">5. Publish</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-prepare-publish'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted">Finalize the prepared data and move it into the active migration inventory.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Map Section -->
                            <div class="card mb-4 border-0 bg-light">
                                <div class="card-body">
                                    <h5 id="help-map"><i class="bi bi-diagram-3 text-primary me-2"></i> Map</h5>
                                    <p>Group individual Configuration Items (CIs) into logical Application Workload Instances (AWIs) and define dependencies.</p>
                                    
                                    <div class="ms-4 mt-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-map-awis" class="fw-bold mb-0">1. AWIs (Application Workload Instances)</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-map-awis'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">Create and manage logical groupings of CIs. An AWI typically represents a single business application.</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-map-dependency-links" class="fw-bold mb-0">2. Dependency Links</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-map-dependency-links'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">Define relationships between AWIs to identify Move Dependency Groups.</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-map-s2ts" class="fw-bold mb-0">3. S2Ts (Source-to-Target)</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-map-s2ts'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted mb-3">Map each AWI from its source environment to a target environment and assign a strategy.</p>
                                        
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 id="help-map-mdgs" class="fw-bold mb-0">4. MDGs (Move Dependency Groups)</h6>
                                            <a href="#" class="btn btn-sm btn-link p-0 text-decoration-none" onclick="window.renderHelp('help-map-mdgs'); return false;">Learn More &rarr;</a>
                                        </div>
                                        <p class="small text-muted">The system automatically groups AWIs with strong inter-dependencies.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-4">
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-plan"><i class="bi bi-calendar-event text-primary me-2"></i> Plan</h5>
                                            <p class="small mb-2">Organize workloads into Migration Waves. Schedule the move and balance wave sizes while considering MDGs to optimize the migration timeline.</p>
                                            <ul class="small ps-3 mb-0 text-muted">
                                                <li><strong>Wave Creation:</strong> Manually group AWIs and MDGs into scheduled windows.</li>
                                                <li><strong>Bulk Ingestion:</strong> Import pre-defined wave plans from Excel or CSV.</li>
                                                <li><strong>Strategy Recommendations:</strong> Get AI-driven advice on the best migration strategy for each workload.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-move"><i class="bi bi-arrow-repeat text-primary me-2"></i> Move</h5>
                                            <p class="small mb-2">Generate and manage detailed Migration Runbooks. These provide step-by-step technical guides customized for each workload and migration strategy.</p>
                                            <ul class="small ps-3 mb-0 text-muted">
                                                <li><strong>Runbook Generation:</strong> Automatically create task lists based on the assigned 7 Rs strategy.</li>
                                                <li><strong>Execution Tracking:</strong> Monitor the status of each task during the migration window.</li>
                                                <li><strong>Template Management:</strong> Standardize the technical steps for different types of migrations.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-evaluate"><i class="bi bi-bar-chart text-primary me-2"></i> Evaluate</h5>
                                            <p class="small mb-2">Analyze outcomes through interactive dashboards. Track progress, TCO savings, ESG impact, and migration risks.</p>
                                            <ul class="small ps-3 mb-0 text-muted">
                                                <li><strong>Progress Dashboard:</strong> Real-time tracking of migrated vs. remaining workloads.</li>
                                                <li><strong>Financial Impact:</strong> Analysis of TCO changes and migration ROI.</li>
                                                <li><strong>Risk Summary:</strong> Identification of high-risk items that need immediate attention.</li>
                                            </ul>
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
                                            <h5 id="help-discovered-data"><i class="bi bi-file-earmark-text text-primary me-2"></i> Discovered Data</h5>
                                            <p class="small mb-0">Access and manage raw data entities discovered during the initial phase. This module allows you to review the raw inputs before they are processed and consolidated into the main migration database.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-data-dictionary"><i class="bi bi-book text-primary me-2"></i> Data Dictionary</h5>
                                            <p class="small mb-0">Define the standardized fields, data types, and allowed values used across the entire application. The Data Dictionary ensures data consistency and provides the rules for automated data validation during the Prepare phase.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-data-entities"><i class="bi bi-diagram-2 text-primary me-2"></i> Data Entities</h5>
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
                                            <h5 id="help-environments"><i class="bi bi-database text-primary me-2"></i> Environments</h5>
                                            <p class="small mb-0">Define the source and target environments for your migration (e.g., On-Premise Data Centre, AWS Production, Azure Staging). This helps in tracking where workloads are coming from and where they are going.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-move-principles"><i class="bi bi-journal-text text-primary me-2"></i> Move Principles</h5>
                                            <p class="small mb-0">Customize the "7 Rs" migration strategies. Define the rules and characteristics for Rehosting, Refactoring, Replatforming, etc., to align with your organization's specific cloud adoption framework.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-score-card"><i class="bi bi-check2-square text-primary me-2"></i> Score Card</h5>
                                            <p class="small mb-0">Configure the scoring system used to evaluate migration readiness and risk. Define factors (e.g., technical complexity, business criticality), assign weights, and set scoring options to provide a quantitative assessment of each workload.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="admin-panel" class="mb-5">
                            <h3>Admin Panel</h3>
                            <p>Administrative tools for platform management:</p>
                            <div class="row g-4">
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-admin-project"><i class="bi bi-kanban text-primary me-2"></i> Project Management</h5>
                                            <p class="small mb-0">Manage the lifecycle of your migration projects. Create new projects, set global project parameters, and archive completed migrations.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-admin-users"><i class="bi bi-people text-primary me-2"></i> User Management</h5>
                                            <p class="small mb-0">Control access to the Nubirix platform. Manage user accounts, assign roles (Admin, Editor, Viewer), and define permissions for different modules.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-0 bg-light">
                                        <div class="card-body">
                                            <h5 id="help-admin-failures"><i class="bi bi-exclamation-triangle text-primary me-2"></i> Process Failures</h5>
                                            <p class="small mb-0">Monitor and troubleshoot background tasks and automated processes. View logs of failed data ingestions, normalization errors, or runbook generation issues.</p>
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

        // Contextual scrolling
        if (sectionId) {
            setTimeout(() => {
                const targetElement = document.getElementById(sectionId);
                const container = document.getElementById('help-content-container');
                if (targetElement && container) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Highlight the section briefly
                    const card = targetElement.closest('.card');
                    if (card) {
                        card.classList.add('border-primary', 'shadow');
                        setTimeout(() => {
                            card.classList.remove('border-primary', 'shadow');
                        }, 2000);
                    }
                }
            }, 100);
        }
    };

    function renderGranularPage(pageId) {
        const contentArea = document.getElementById('main-area');
        const content = granularHelpContent[pageId];
        
        contentArea.innerHTML = `
            <div class="container py-4">
                <nav aria-label="breadcrumb" class="mb-4">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#" onclick="window.renderHelp(); return false;">Help Center</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${content.title}</li>
                    </ol>
                </nav>

                <div class="row">
                    <div class="col-lg-8">
                        <div class="d-flex align-items-center mb-4">
                            <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                                <i class="bi ${content.icon} fs-3"></i>
                            </div>
                            <h1 class="display-6 fw-bold mb-0">${content.title}</h1>
                        </div>

                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-body p-4">
                                <h4 class="fw-bold mb-3">What does this mean?</h4>
                                <p class="lead text-muted">${content.description}</p>
                                
                                ${content.significance ? `
                                    <hr class="my-4">
                                    <h4 class="fw-bold mb-3">Significance</h4>
                                    <p>${content.significance}</p>
                                ` : ''}

                                ${content.details ? `
                                    <hr class="my-4">
                                    <h4 class="fw-bold mb-4">Detailed Breakdown</h4>
                                    <div class="row g-4">
                                        ${content.details.map(detail => `
                                            <div class="col-12">
                                                <h6 class="fw-bold text-primary mb-2">${detail.label}</h6>
                                                <p class="text-muted small mb-0">${detail.content}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        ${content.input ? `
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="fw-bold text-primary mb-3"><i class="bi bi-box-arrow-in-right me-2"></i> Input</h5>
                                        <p class="small text-muted mb-0">${content.input}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="fw-bold text-primary mb-3"><i class="bi bi-box-arrow-right me-2"></i> Output</h5>
                                        <p class="small text-muted mb-0">${content.output}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="fw-bold text-success mb-3"><i class="bi bi-database me-2"></i> Data Involved</h5>
                                        <p class="small text-muted mb-0">${content.dataUsed}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="fw-bold text-warning mb-3"><i class="bi bi-link-45deg me-2"></i> Correlation</h5>
                                        <p class="small text-muted mb-0">${content.correlation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <div class="col-lg-4">
                        <div class="card border-0 shadow-sm sticky-top" style="top: 20px;">
                            <div class="card-body p-4">
                                <h5 class="fw-bold mb-3">Related Steps</h5>
                                <div class="list-group list-group-flush">
                                    ${Object.keys(granularHelpContent)
                                        .filter(id => id !== pageId && (id.includes(pageId.split('-')[1])))
                                        .map(id => `
                                            <a href="#" class="list-group-item list-group-item-action border-0 px-0 d-flex justify-content-between align-items-center" onclick="window.renderHelp('${id}'); return false;">
                                                <span><i class="bi ${granularHelpContent[id].icon} me-2 text-muted"></i> ${granularHelpContent[id].title.split(': ')[1]}</span>
                                                <i class="bi bi-chevron-right small text-muted"></i>
                                            </a>
                                        `).join('')}
                                </div>
                                <hr>
                                <a href="#" class="btn btn-outline-dark w-100" onclick="window.renderHelp(); return false;">
                                    <i class="bi bi-arrow-left me-2"></i> Back to Overview
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
})();
