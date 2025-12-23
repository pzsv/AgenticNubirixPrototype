# Nubirix - Functional Specification (Current System)

**Document ID**: FS-CUR-001  
**Date**: December 21, 2025  
**Status**: Current System Analysis  
**Version**: 1.0

---

## Executive Summary

This document describes the current functional capabilities of Nubirix across all 5 phases of cloud migration planning (Prepare, Map, Plan, Move, Evaluate). It details the features, workflows, data models, and user interactions in the existing system.

---

## Phase 1: Prepare (Data Ingestion & Normalization)

### Overview

The Prepare phase handles ingestion of infrastructure data from various sources (Excel, CSV) and normalizes it into a canonical format using a configurable data dictionary.

### File Upload & Import

**User Actions**:
1. User uploads Excel or CSV file
2. Specifies structure (worksheet names, header rows, column mappings)
3. System validates file and imports data
4. User reviews imported data and resolves issues

**Supported Formats**:
- Excel (.xlsx, .xls)
- CSV (.csv)
- Maximum file size: 100 MB
- Maximum rows: 500,000 per sheet

**Data Import Process**:
1. Parse file based on user-specified structure
2. Validate data types and format
3. Create Configuration Items (CIs) with attributes
4. Assign confidence level (based on data completeness)
5. Detect conflicts (same CI, different attribute values)
6. Flag data gaps (missing expected attributes)

### Data Dictionary & Normalization

**Data Dictionary Purpose**: Define canonical values for attributes across the organization

**Dictionary Components**:
- **Attribute**: OS, Database, CPU, RAM, Storage, Criticality, Status, etc.
- **Canonical Values**: Enumerated acceptable values for attribute
- **Aliases**: Mappings from user values to canonical values
- **Example**: "windows 2019" → "Windows Server 2019"

**Normalization Rules**:
- Manual mapping: User specifies which user value maps to canonical value
- Learned mappings: System learns from previous mappings
- Fuzzy matching: Partial matches suggested to user (e.g., "win2019" → "Windows Server 2019")

**Data Quality Metrics**:
- **Completeness**: % of CIs with all expected attributes
- **Accuracy**: % of CIs with valid canonical values
- **Consistency**: % of similar CIs with same attribute values

### Conflict Detection & Resolution

**Conflict Type**: Same CI, different attribute values from different sources

**Example**:
```
CI: SRV-001
Source A says: OS = "Windows Server 2019", RAM = "16 GB"
Source B says: OS = "Windows Server 2016", RAM = "8 GB"
```

**Conflict Detection Process**:
1. Identify CIs with same ID from multiple sources
2. Compare attribute values
3. Flag mismatches as conflicts
4. Calculate confidence for each value

**Confidence Assessment**:
- **Data Source Quality**: Is source known to be reliable?
- **Recency**: How recent is the data?
- **Completeness**: Does source have other attributes?
- **Consistency**: Do other CIs from same source match expected patterns?

**Conflict Resolution Options**:
1. **Accept Recommendation**: Take higher-confidence value
2. **Manual Selection**: User chooses which value to keep
3. **Mark for Investigation**: Flag for expert review (blocking)
4. **Manual Entry**: User enters custom value

**Resolution Outcome**:
- One canonical value chosen for each conflict
- Conflict marked as resolved
- Audit trail records decision and reasoning
- Confidence of final value noted

### Data Gap Identification

**Gap Types**:
- **Missing Attribute**: CI lacks attribute expected for CI type
- **Incomplete Data**: Attribute value is partial or placeholder
- **Unknown Value**: Attribute marked as unknown/TBD

**Gap Management**:
- Flagged for user attention (non-blocking)
- User can fill in manually or mark as acceptable
- System tracks which gaps were filled vs accepted
- Gaps do not prevent phase progression

**Example**:
```
Server SRV-001 missing Database attribute
(expected: name, version, criticality, license)
Current: none
User action: Mark as not applicable (no database on server)
```

### Data Quality Reporting

**Quality Dashboard**:
- Overall data readiness: 60% complete
- Completeness by CI type: Servers 80%, Databases 45%, Networks 70%
- Conflicts by type: OS conflicts (5), RAM conflicts (3), Database conflicts (2)
- Gaps by attribute: Missing OS (2), Missing RAM (5), Missing Criticality (10)

**Quality Thresholds**:
- Green (ready): 80%+ completeness, <5% conflicts
- Yellow (in progress): 60-80% completeness, 5-15% conflicts
- Red (at risk): <60% completeness, >15% conflicts

### Multi-Source Data Aggregation

**Capability**: Import from multiple sources and resolve conflicts

**Workflow**:
1. Import source 1 (e.g., CMDB)
2. Import source 2 (e.g., Active Directory)
3. Import source 3 (e.g., Application ownership spreadsheet)
4. System detects overlaps (same CI, different sources)
5. Resolves conflicts using confidence algorithm
6. Presents unified view of infrastructure

**Confidence-Based Arbitration**:
- Higher confidence value wins automatically
- Equal confidence: User chooses or marks for review
- System learns which sources are most reliable

---

## Phase 2: Map (Relationship Mapping)

### Overview

The Map phase creates logical Application Workload Instances (AWIs) from Configuration Items and maps dependencies between them.

### Application Workload Instance (AWI) Creation

**AWI Definition**: Logical grouping of related CIs that typically migrate together

**AWI Composition**:
- Name: "ERP System", "Database Cluster", "Web Tier"
- Description: Business purpose
- CIs: List of associated configuration items
- Attributes: Criticality, Owner, SLA, etc.

**AWI Creation Process**:
1. User selects CIs to group
2. System analyzes dependencies between CIs
3. Suggests logical boundaries
4. User creates AWI and names it
5. System validates that AWI has internal dependencies

**Example**:
```
AWI: "ERP System"
CIs: [ERP-APP-1, ERP-APP-2, ERP-DB-1, ERP-STORAGE-1]
Dependencies: ERP-APP-1 depends on ERP-DB-1
             ERP-APP-2 depends on ERP-DB-1
             ERP-DB-1 depends on ERP-STORAGE-1
```

### Dependency Mapping

**Dependency Type**: Relationship where one CI depends on another for function

**Dependency Attributes**:
- Source: CI that depends on target
- Target: CI that is depended upon
- Type: Hard (blocking) or Soft (recommended)
- Description: Why dependency exists
- Validation Status: Unverified, Verified, or False

**Dependency Sources**:
- User specification (manual)
- Discovered from CMDB
- Inferred from data (e.g., database connections)
- Learned from similar systems

**Dependency Graph**:
- Visualizes all dependencies as directed graph
- Nodes: AWIs
- Edges: Dependencies
- Shows direction and criticality

### Dependency Validation

**Validation Process**:
1. System analyzes dependency graph for issues
2. Checks for cycles (A→B→C→A), which are errors
3. Validates against known patterns
4. Flags suspicious or unusual patterns
5. Provides suggestions for missing dependencies

**Quality Checks**:
- **Completeness**: Are all known dependencies captured?
- **Consistency**: Are similar CIs treated similarly?
- **Cycles**: Are there any circular dependencies?
- **Orphans**: Are there CIs with no dependencies?

**Example Issues**:
```
WARNING: SRV-005 has no outbound dependencies but connects to 3 databases
SUGGESTION: May be missing dependencies

WARNING: CYCLE DETECTED: APP-1 → DB-1 → APP-2 → DB-1
ERROR: Circular dependency must be resolved
```

### Critical Path Analysis

**Critical Path Definition**: Longest chain of dependencies in the system

**Purpose**: Identifies which dependencies, if delayed, delay entire project

**Calculation**:
1. Build dependency graph
2. Identify all paths from sources to sinks
3. Calculate path length (sum of durations)
4. Return longest path(s)

**Display**:
- Highlighted in red on dependency graph
- Shows sequence of AWIs on critical path
- Indicates total path length
- Allows filtering to show only critical path

**Example**:
```
Critical Path: Database → ERP App-1 → ERP App-2 → Load Balancer
Length: 4 hops
Duration (estimated): 8 weeks
```

---

## Phase 3: Plan (Migration Strategy)

### Overview

The Plan phase develops migration strategy by defining move methods, grouping AWIs into move dependency groups (MDGs), and scheduling migration waves.

### Move Method Definition

**Move Methods** (4 categories):

1. **Like-for-Like**
   - Replicate exact configuration on cloud infrastructure
   - No changes to application, OS, or configuration
   - Fastest, lowest risk
   - Example: Copy Windows 2019 server to Azure VM

2. **Rehost**
   - Move to cloud infrastructure but may resize/adjust
   - Same OS and application but optimized for cloud
   - Moderate speed, moderate risk
   - Example: Move to Azure VM optimized for cloud

3. **Refactor**
   - Redesign application architecture for cloud
   - May change OS, runtime, libraries
   - Longer, higher risk
   - Example: Move to containerized microservices

4. **Move/Other**
   - Non-standard migration approaches
   - Example: Move to cloud provider's managed service

**Move Method Assignment**:
- Assigned to each AWI
- Based on application type, criticality, skills
- Influences: Risk, Cost, Duration, Resource Requirements
- Determines which migration tools and team skills needed

### Move Dependency Group (MDG) Creation

**MDG Definition**: Group of AWIs scheduled to migrate together in a wave

**MDG Composition**:
- AWIs with strong dependencies (should migrate together)
- Similar move methods (can use same team/tools)
- Compatible duration and resource requirements

**MDG Grouping Constraints**:
- Respect dependencies (don't put consumer before provider)
- Minimize inter-group dependencies (high cohesion)
- Balance group sizes (not too large or small)
- Group by move method when possible

**Example MDGs**:
```
MDG-1: "Database Infrastructure" (Like-for-like)
  - Database Cluster (DB-1, DB-2, DB-3)
  - Storage (STORAGE-1)
  Move Method: Like-for-like
  Size: Small
  Duration: 2 weeks

MDG-2: "ERP Application" (Rehost)
  - ERP App Servers (APP-1, APP-2, APP-3)
  - Depends on: MDG-1
  Move Method: Rehost
  Size: Medium
  Duration: 3 weeks

MDG-3: "Web Tier" (Refactor)
  - Web Servers (WEB-1, WEB-2)
  - Load Balancer (LB-1)
  - Depends on: MDG-1, MDG-2
  Move Method: Refactor
  Size: Medium
  Duration: 4 weeks
```

### Sequencing & Wave Scheduling

**Wave Definition**: Time period during which one or more MDGs migrate

**Wave Attributes**:
- Wave number: 1, 2, 3, ...
- Start date
- End date
- Duration (weeks)
- MDGs in wave
- Resources required (team size, skills)

**Sequencing Rules**:
- Respect dependencies (provide before consumer)
- Balance wave sizes (not too large)
- Minimize concurrent migration (resource constraints)
- Account for team capacity and skills

**Wave Planning**:
1. List all MDGs and their dependencies
2. Identify possible orderings
3. Create waves respecting dependencies
4. Balance wave sizes and durations
5. Adjust for team capacity

**Example Wave Schedule**:
```
Wave 1 (Weeks 1-2):
  - MDG-1: Database Infrastructure (2 weeks)
  Resources: 2 DBAs, 1 Storage engineer

Wave 2 (Weeks 2-5):
  - MDG-2: ERP Application (3 weeks, overlaps wave 1 week 2)
  - Depends on: MDG-1
  Resources: 3 App engineers, 1 Infrastructure engineer

Wave 3 (Weeks 5-9):
  - MDG-3: Web Tier (4 weeks)
  - Depends on: MDG-1, MDG-2
  Resources: 2 Web engineers, 1 QA

Total Project: 9 weeks
```

### Cost & Duration Estimation

**Cost Estimation Components**:
- Infrastructure costs (cloud resources)
- Labor costs (team hours × rate)
- Tool costs (licenses, services)
- Testing and validation costs
- Contingency (15-20% for unknowns)

**Duration Estimation Factors**:
- Move method (like-for-like fastest, refactor slowest)
- Complexity (number of dependencies, number of CIs)
- Team size and skills
- Parallel execution capability
- Risk factors (unknowns, dependencies)

**Estimation Methods**:
- Historical data (similar projects)
- Expert judgment (consulting experience)
- Data-driven (based on CI attributes)
- Confidence scoring (low/medium/high)

**Output**:
- Cost range (best case - worst case)
- Duration range (optimistic - pessimistic)
- Cost by dimension (labor, infrastructure, tools)
- Cost by wave/MDG
- Break-even analysis

---

## Phase 4: Move (Execution Planning)

### Overview

The Move phase prepares detailed execution plans including runbooks, validation procedures, and cutover plans.

### Wave Scheduling & Sequencing

**Detailed Wave Plan**:
- Which MDGs in wave
- Which CIs in each MDG
- Migration sequence within MDG
- Dependencies between CIs
- Parallel vs sequential execution

**Resource Allocation**:
- Team members assigned to wave
- Skills required (DBA, app engineer, infrastructure, QA)
- Hours allocated
- Timeline and deadlines

**Cutover Planning**:
- Pre-cutover validation
- Cutover procedure
- Rollback plan
- Post-cutover validation
- Success criteria

### Runbook Templates

**Runbook Types**:

1. **Technical Runbook**
   - Step-by-step technical procedures
   - Commands to execute
   - Configuration to apply
   - Validation checks
   - Troubleshooting steps

2. **Governance Runbook**
   - Approval gates
   - Change management procedures
   - Communication plan
   - Stakeholder notifications
   - Risk escalation

**Runbook Template Structure**:

```
Title: [MDG Name] Migration Runbook
Objective: Migrate [description] to cloud
Scope: [list of CIs/AWIs affected]
Duration: [estimated hours/days]

PRE-MIGRATION (Day 0):
1. Notify stakeholders
2. Create backups
3. Validate connectivity
4. Prepare cloud resources
5. Approval gate: [requires CIO approval]

MIGRATION (Days 1-N):
1. Shut down source systems
2. Perform final backup
3. Migrate data/configuration
4. Start target systems
5. Validate connectivity
6. Run smoke tests

POST-MIGRATION (Days N+1-N+3):
1. Extended validation period (72 hours)
2. Monitor performance
3. Run full test suite
4. Performance baseline
5. Approval gate: [requires business sign-off]

ROLLBACK (if needed):
1. Stop target systems
2. Restore from backup
3. Start source systems
4. Validate rollback success

SUCCESS CRITERIA:
- All systems healthy and responding
- Data integrity validated
- Performance within SLA
- No high-priority issues
```

### Runbook Customization

**Template Customization**:
- Modify steps based on specific MDG/move method
- Add custom steps for special requirements
- Set approval gates and stakeholders
- Define success criteria
- Add team member assignments and contact info

**Version Control**:
- Runbooks are versioned
- Changes tracked and auditable
- Previous versions accessible
- Approval workflow for changes

### Execution Handoff Packages

**Handoff Components**:
1. Runbook (technical + governance)
2. Infrastructure requirements (VMs, storage, network)
3. Configuration details (IPs, hostnames, ports)
4. Team member assignments and contact info
5. Support escalation procedures
6. Links to relevant documentation
7. Backup and recovery procedures

**Delivery Format**:
- PDF download
- HTML for web viewing
- Embedded in project management system
- Shared via email or link

---

## Phase 5: Evaluate (Reporting & Insights)

### Overview

The Evaluate phase provides visibility into project status, costs, risks, and compliance through reports and analytics.

### Status Reporting

**Project Status Dimensions**:
- **Progress**: % of project complete
- **Schedule**: Days ahead/behind plan
- **Cost**: Actual vs budget
- **Risk**: Overall risk score
- **Quality**: Data quality, issue count

**Status Dashboard**:
```
Project: Cloud Migration Initiative
Status: In Progress (35% complete, 2 weeks ahead schedule)

Progress:
  Waves Complete: 1/3
  MDGs Complete: 2/8
  CIs Complete: 150/500
  Progress: 30%

Schedule:
  Start: Jan 1, 2025 (on time)
  Current: Feb 15, 2025 (2 weeks ahead)
  End: May 31, 2025 (projected)

Cost:
  Budget: $2,000,000
  Spend: $450,000 (22.5%)
  Projected: $1,950,000 (97.5% of budget)
  Status: On budget

Risk Score: 6/10 (Moderate)
  - 2 high-risk items
  - 3 medium-risk items
  - Mitigation plans in place

Issues: 8 open
  - 1 critical
  - 3 high
  - 4 medium
```

### Cost Reporting

**Cost Breakdown**:
- **Infrastructure**: Cloud resource costs ($X)
- **Labor**: Team hours × rate ($Y)
- **Tools & Software**: Licenses and services ($Z)
- **Testing**: QA and validation ($A)
- **Contingency**: 15-20% for unknowns ($B)

**Cost Analysis**:
- Cost by wave (which wave most expensive?)
- Cost by move method (which method most expensive?)
- Cost by activity (migration, testing, cutover)
- Cost per AWI (divide total by number of AWIs)
- Cost trend (are we on pace to budget?)

**Cost Forecasting**:
- Actual spend to date
- Projected spend based on current burn rate
- Variance from budget (over/under)
- Recommended actions if off track

### Risk Reporting

**Risk Categories**:
- **Technical**: Technology challenges, compatibility issues
- **Schedule**: Delays, resource constraints
- **Resource**: Team availability, skills gaps
- **Organizational**: Stakeholder resistance, change management
- **External**: Vendor delays, compliance issues

**Risk Assessment** (for each risk):
- Description: What could go wrong
- Probability: Likelihood (0-100%)
- Impact: Consequence if happens (0-100%)
- Risk Score: Probability × Impact
- Mitigation: What are we doing about it
- Owner: Who is responsible

**Risk Dashboard**:
```
Total Risks: 15
  - High Risk (Score 70+): 2
  - Medium Risk (Score 40-70): 5
  - Low Risk (Score <40): 8

High Risks:
1. Database performance unknown on cloud (Score: 85)
   Mitigation: Load testing plan in place
   Owner: Database Team

2. Complex application dependencies (Score: 80)
   Mitigation: Dependency mapping detailed
   Owner: Application Architect

Medium Risks:
[...]
```

### Compliance Reporting

**Compliance Dimensions**:
- **Data Privacy**: GDPR, CCPA, regional compliance
- **Security**: Access controls, encryption, audit trails
- **Industry**: Healthcare (HIPAA), Finance (SOX), Government (FedRAMP)
- **Company**: Internal policies and standards

**Compliance Checklist**:
- Encryption implemented (yes/no)
- Access controls in place (yes/no)
- Audit logging enabled (yes/no)
- Backups configured (yes/no)
- Disaster recovery tested (yes/no)
- Compliance assessment completed (yes/no)

**Compliance Report**:
```
Overall Compliance: PASSING (18/20 controls)

Control: Data Encryption
Status: PASSING - AES-256 encryption enabled

Control: Multi-factor Authentication
Status: PASSING - MFA required for cloud access

Control: Audit Logging
Status: PASSING - Cloudtrail enabled, 1-year retention

Control: Backup & Disaster Recovery
Status: WARNING - Backup tested, DR not yet tested
Action: Schedule DR test for next quarter

Control: Incident Response Plan
Status: FAILING - Plan not yet updated for cloud
Action: Create cloud incident response plan
```

### Metabase Integration

**Current BI Tool**: Metabase (separate from Nubirix)

**Metabase Integration**:
- Nubirix exports data to Metabase
- Metabase creates dashboards and reports
- Can query Nubirix data directly
- Custom reports and ad-hoc analysis

**Metabase Capabilities**:
- Ad-hoc SQL query builder
- Drag-and-drop dashboard creation
- Scheduled report delivery (email)
- Data export (Excel, CSV)
- Visualization library (charts, maps, tables)

**Limitations**:
- Separate tool (not integrated in Nubirix UI)
- Requires Metabase knowledge
- Limited real-time updates
- Not customized for migration domain

### Data Export

**Export Formats**:
- Excel (.xlsx) - tables and basic charts
- CSV (.csv) - for data import to other tools
- PDF (.pdf) - for sharing and printing
- JSON - for integration with other systems

**Export Scope**:
- Project summary
- List of CIs with attributes
- List of AWIs and dependencies
- Migration waves and MDGs
- Cost and risk assessments
- All project metadata

---

## Cross-Phase Features

### Multi-Project Support

**Project Management**:
- Create multiple independent projects
- Switch between projects
- Share resources across projects (optional)
- Project-level permissions and access control

**Project Attributes**:
- Name
- Description
- Owner
- Start/end dates
- Target cloud (AWS, Azure, GCP)
- Status (Planning, In Progress, Complete, Archived)

### Data Persistence

**Database Features**:
- All data persisted to PostgreSQL/Oracle database
- Version history for all entities
- Audit trail of all changes
- Change tracking (who changed what when)

**Backup & Recovery**:
- Automated daily backups
- Point-in-time recovery capability
- Archive old projects for compliance

### User Permissions & Roles

**Role Types**:
- **Admin**: Full access, user management, system configuration
- **Project Manager**: Can create and manage projects
- **Consultant**: Can view and edit projects
- **Viewer**: Read-only access to view reports

**Project-Level Permissions**:
- Owner (creator)
- Editors (can modify)
- Viewers (read-only)
- Restricted access (specific phases only)

### Performance Characteristics

**Scalability Limits** (current system):
- Projects: <100 (per instance)/
- CIs per project: <50,000
- AWIs per project: <1,000
- Dependencies: <100,000
- Concurrent users: <50 per instance

**Response Times**:
- List operations: <1 second
- Dependency graph rendering: <5 seconds (for 500 AWIs)
- Report generation: <30 seconds
- Data import: <5 minutes (10,000 rows)

### Known Limitations

1. **UI/UX**:
   - Table-based interface limits complex relationships visualization
   - No interactive dependency graph (tables only)
   - Limited mobile support
   - No real-time collaboration

2. **Automation**:
   - Manual data mapping required
   - Manual conflict resolution
   - Manual AWI grouping
   - No intelligent suggestions

3. **Analytics**:
   - Basic reporting only
   - Fragmented BI (requires Metabase)
   - No predictive analytics
   - Limited insight generation

4. **Architecture**:
   - Single-tenant (one customer per instance)
   - Not optimized for multi-tenant SaaS
   - Limited scalability beyond current limits
   - High operational overhead

---

