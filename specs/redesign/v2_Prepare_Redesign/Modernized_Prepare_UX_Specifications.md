# Nubirix Prepare Module - Modernized UX/UI Specifications

## 1. STRATEGIC OVERVIEW

### Current State Problems
- Linear, sequential workflow unclear about what data is "ready"
- Single data ingestion method (upload/manual) limits discovery options
- Poor visibility into data quality and completeness
- Map Fields feels disconnected from data ingestion
- No clear staging/review mechanism before aggregation
- Future integrations (CMDB, network discovery, cluster services) have nowhere to fit

### Vision: Unified Data Discovery & Ingestion Hub
The modernized Prepare module transforms from a simple upload screen into a **flexible, progressive data discovery platform** that:
- Supports multiple simultaneous ingestion methods (current + future)
- Provides real-time data quality feedback
- Stages data for review before mapping/normalization
- Clearly shows workflow progress and data readiness
- Scales to enterprise discovery scenarios (CMDB, network discovery, cluster services)

---

## 2. INFORMATION ARCHITECTURE

### Workflow Levels (Revised Mental Model)

```
DISCOVER & INGEST
├─ Data Source Selection
├─ Single/Bulk Data Entry
├─ Source Configuration (for integrations)
└─ Real-time Sync Status

    ↓

STAGE & VALIDATE
├─ Raw Data Preview
├─ Data Quality Assessment
├─ Conflict Resolution
└─ Readiness Verification

    ↓

STRUCTURE & TRANSFORM
├─ Field Mapping (to Data Entities)
├─ Data Normalization
├─ Custom Transformations
└─ Entity Relationship Definition

    ↓

CONSOLIDATE & PUBLISH
├─ Multi-source Aggregation
├─ Deduplication
├─ Final Review Dashboard
└─ Publish to Map Phase
```

### Key Concepts

**Data Source**: Origin of configuration items (Excel file, CSV, manual entry, CMDB, network discovery, cluster service)

**Ingestion Method**: Mechanism for pulling data (file upload, real-time sync, scheduled sync, manual entry, API)

**Raw Data Staging**: Temporary storage zone where discovered/ingested data awaits review

**Data Quality Score**: Composite metric (completeness, consistency, validity) that gates progression

**Mapping Profile**: Rules set defining how raw fields map to target schema entities

**Aggregation Rules**: Conflict resolution and deduplication strategies

---

## 3. UPDATED WORKFLOW DESIGN

### 3.1 Main Prepare Screen - Revised Layout

**Top Navigation** (Preserved from original, updated labels):
- Overview (new dashboard view)
- Discover (renamed from Ingest)
- Mapping (replaces Stage & Review and Structure)
- Transform (renamed from Normalise)
- Consolidate (renamed from Aggregate)
- Publish (preserved)

---

## 4. SCREEN SPECIFICATIONS

### OVERVIEW - Data Readiness Dashboard

**Purpose**: At-a-glance view of ingestion progress and data health

```
┌─────────────────────────────────────────────────────────────┐
│ Prepare > Overview                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ INGESTION PROGRESS    DATA QUALITY      NEXT ACTIONS        │
│ • 5 sources active    • Completeness: 78%  • 2 conflicts    │
│ • 2,847 items         • Consistency: 92%   • Map 45 fields  │
│ • 412 staging         • Validity: 88%      • Review 12 dups │
│ • 2,435 ready         • Overall: 86% ✓     │                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ DATA SOURCE TIMELINE (Last 24 hours)                         │
│                                                              │
│ 09:15  ✓ CMDB Sync          1,245 items  +892 new          │
│ 08:30  ✓ Excel Upload       487 items    +45 duplicates    │
│ 07:45  ⚠ Network Discovery  515 items    [2 failures]      │
│ 06:20  ✓ Manual Entry       8 items      +1 updated        │
│ 05:10  ✓ Cluster Sync       592 items    +12 new           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ COMPLETION FUNNEL                                            │
│                                                              │
│ Discovered      ██████████░░░░░░  2,847 items (100%)       │
│ Staged          ████░░░░░░░░░░░░    412 items  (14%)       │
│ Mapped          █████████░░░░░░░  2,521 items  (89%)       │
│ Normalized      █████████░░░░░░░  2,498 items  (88%)       │
│ Consolidated    ████████░░░░░░░░░  2,435 items  (86%)       │
│ Ready to Publish ████████░░░░░░░░░  2,435 items  (86%)      │
│                                                              │
│                     [▶ Publish Now]                         │
└─────────────────────────────────────────────────────────────┘
```

### DISCOVER - Multi-Source Data Ingestion Hub

**Purpose**: Unified interface for adding data from any source, managing integrations, monitoring sync status

```
Select Data Source Type:

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐
│ 📄           │ │ 📊           │ │ 📝           │ │ 🔗        │
│ FILE UPLOAD  │ │ SPREADSHEET  │ │ MANUAL ENTRY │ │ CMDB      │
│              │ │ (Excel/CSV)  │ │              │ │ (FUTURE)  │
│ Single or    │ │              │ │ Individual   │ │           │
│ batch files  │ │ Multi-sheet  │ │ or bulk add  │ │ Real-time │
│              │ │ support      │ │              │ │ sync      │
│ [CONFIGURE]  │ │ [CONFIGURE]  │ │ [CONFIGURE]  │ │ [SOON]    │
└──────────────┘ └──────────────┘ └──────────────┘ └────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐
│ 🌐           │ │ 📡           │ │ 🔍           │ │ 🏢        │
│ API          │ │ CLUSTER      │ │ NETWORK      │ │ SERVICENOW│
│ INTEGRATION  │ │ SERVICES     │ │ DISCOVERY    │ │ CMDB      │
│ (FUTURE)     │ │ (FUTURE)     │ │ (FUTURE)     │ │ (FUTURE)  │
│              │ │              │ │              │ │           │
│ REST/GraphQL │ │ K8s, Docker  │ │ Active scan  │ │ OAuth2    │
│ webhooks     │ │ Swarm, etc   │ │ discovery    │ │ sync      │
│ [SOON]       │ │ [SOON]       │ │ [SOON]       │ │ [SOON]    │
└──────────────┘ └──────────────┘ └──────────────┘ └────────────┘
```

### STAGE & REVIEW - Validation & Conflict Resolution

**Purpose**: Inspect discovered data, resolve issues, verify readiness before mapping

```
STAGING ZONE (Items awaiting review & mapping)

Filter: [All Sources ▼] [All Item Types ▼] [Show: All ▼]
Search: [_______________________]

┌──────────────────────────────────────────────┐
│ Item         │ Source    │ Type   │ Quality  │
├──────────────────────────────────────────────┤
│ prod-app01   │ prod-excel│ Server │ 95% ✓   │
│ prod-app02   │ prod-excel│ Server │ 92% ✓   │
│ prod-db01    │ prod-excel│ DB     │ 88% ⚠   │
│ prod-storage │ network   │ Storage│ 78% ⚠   │
└──────────────────────────────────────────────┘

QUALITY ISSUES SUMMARY: 412 items staged, 3 require action
◼ Issues blocking review: 3
◼ Warnings: 47
◼ All systems nominal: 362
```

### STRUCTURE - Field Mapping to Data Entities

**Purpose**: Define which raw fields map to target schema

```
MAPPING PROFILE: prod-excel (Servers)

RAW FIELD          →  TARGET ENTITY/FIELD         TRANSFORM
────────────────────────────────────────────────────────────
hostname           →  ComputeInstance.hostname    Direct ✓
ip_address         →  NetworkInterface.address    Direct ✓
os                 →  ComputeInstance.osType      Normalize ✓
cpu_cores          →  ComputeInstance.vcpus       Convert ✓
ram_gb             →  ComputeInstance.memory      Direct ✓
location           →  Asset.location              Direct ✓
owner              →  Asset.owner                 Direct ✓
notes              →  Asset.notes                 Direct ✓
[unmapped: serial] →  [Select Target...]          [Assign]
[unmapped: warranty]→  [Select Target...]          [Assign]

MAPPING SUMMARY:
✓ 8 fields mapped to required targets
⚠ 2 fields unmapped (serial_number, warranty_exp)
ℹ 1 field optional and unmapped
```

### TRANSFORM - Normalization & Data Cleanup

**Purpose**: Apply standardization rules, transformations, and enrichment

```
NORMALIZATION RULES: prod-excel (Servers)

TARGET FIELD       │ NORMALIZATION RULE        │ COVERAGE
───────────────────┼──────────────────────────┼─────────
hostname           │ Lowercase, Trim           │ 1,245
osType             │ Standardize values        │ 1,245
vcpus              │ Convert to Integer        │ 1,234
memory             │ Convert to Integer        │ 1,234
location           │ Validate against list     │ 1,245

PREVIEW (Sample of 5 items after normalization):
hostname     │ osType           │ vcpus │ memory  │ Valid
─────────────┼──────────────────┼───────┼─────────┼──────
prod-app01   │ RedHat RHEL 8    │  16   │  64 GB  │ ✓
prod-app02   │ RedHat RHEL 8    │  16   │  64 GB  │ ✓
prod-db01    │ RedHat RHEL 7    │  32   │ 256 GB  │ ✓
prod-storage │ RedHat RHEL 8    │   8   │ 128 GB  │ ✓
test-app01   │ ⚠ INVALID        │  12   │  48 GB  │ ⚠
```

### CONSOLIDATE - Multi-Source Aggregation

**Purpose**: Merge data from multiple sources, handle deduplication

```
AGGREGATION RULES: All Sources
Aggregated Items: 2,435  |  Unique Assets: 2,312  |  Conflicts: 34

PRIMARY KEY (Uniqueness):
[ComputeInstance.hostname ▼] + [Asset.location ▼]

FIELD-LEVEL MERGE RULES:

hostname           │ Primary Key           │ ✓
osType             │ Most recent value     │ ✓
vcpus              │ Maximum value         │ ✓
memory             │ Maximum value         │ ✓
location           │ Most complete value   │ ⚠ 4 Conflicts
owner              │ Source priority       │ ✓

DETECTED CONFLICTS (34 items):

Hostname  │ Source1/Value1     │ Source2/Value2    │ Resolution
──────────┼────────────────────┼───────────────────┼────────────
prod-app01│ CMDB: 16 vcpus     │ Excel: 8 vcpus    │ Keep 16 ✓
prod-db02 │ Excel: owner=DBA   │ CMDB: owner=DBA   │ Merge ✓
net-dev01 │ Network: EU-DC1    │ Manual: EU-DC2    │ ⚠ Review
```

### PUBLISH - Final Review & Quality Gates

**Purpose**: Final verification, quality gates, publication to Map phase

```
PUBLICATION CHECKLIST

☑ All data sources connected
☑ 2,847 items discovered & ingested
☑ 412 items staged & reviewed
☑ Field mappings complete (89%)
☑ Data normalized & standardized
☑ Duplicates resolved & consolidated
☑ Quality gates verified

QUALITY GATE STATUS:

Metric              │ Threshold  │ Actual │ Status │ Impact
────────────────────┼────────────┼────────┼────────┼────────
Completeness        │ ≥ 75%      │ 78%   │ ✓PASS  │ OK
Consistency         │ ≥ 85%      │ 92%   │ ✓PASS  │ GOOD
Validity            │ ≥ 80%      │ 88%   │ ✓PASS  │ GOOD
Duplicate Rate      │ ≤ 5%       │ 1.2%  │ ✓PASS  │ GOOD
Overall Quality     │ ≥ 80%      │ 86%   │ ✓PASS  │ READY

GATE RESULT: ✓ ALL GATES PASSED - READY FOR PUBLICATION

DATA SUMMARY FOR MAP PHASE:

Asset Type       │ Total │ Fully Mapped │ Ready
─────────────────┼───────┼──────────────┼───────
Compute Instance │1,245  │ 1,203 (97%)  │1,203 ✓
Database         │  567  │  512 (90%)   │ 512 ✓
Network Interface│  456  │  398 (87%)   │ 398 ✓
Storage          │   89  │   73 (82%)   │  73 ✓
Other            │   78  │   51 (65%)   │  51 ⚠

TOTAL ITEMS:     │2,435  │ 2,237 (92%)  │2,237 READY

[◀ Back to Review]  [Re-run Quality Checks]  
[▶ PUBLISH TO MAP PHASE]
```

---

## 5. DETAILED SPECIFICATIONS

### Data Quality Metrics

```
COMPLETENESS:
- % of required fields with non-null values
- Calculation: (Total non-null fields) / (Total required fields) × 100
- Threshold: ≥ 75%

CONSISTENCY:
- Data format consistency, value standardization
- Checks: Data types match, format patterns, values in allowed list
- Threshold: ≥ 85%

VALIDITY:
- Values conform to business rules and constraints
- Checks: Range validation, relational integrity, domain membership
- Threshold: ≥ 80%

OVERALL SCORE:
- Weighted average: (Completeness × 0.4) + (Consistency × 0.35) + (Validity × 0.25)
- Gate threshold: ≥ 80%
```

### User Journey Map

```
PHASE 1: DISCOVERY (1-4 hours)
├─ User lands on Overview dashboard
├─ Selects data source type(s)
├─ Configures source(s)
└─ Data lands in Staging zone

PHASE 2: VALIDATION (1-2 hours)
├─ Views quality issues and conflicts
├─ Resolves items one-by-one or batch
└─ Items move to "Ready" state

PHASE 3: STRUCTURE (30 min - 1 hour)
├─ Reviews field mappings
├─ Adjusts if needed
└─ Mapping applied to all items

PHASE 4: TRANSFORMATION (30 minutes)
├─ Applies normalization rules
├─ Previews transformed data
└─ Applies transformations

PHASE 5: CONSOLIDATION (15-30 minutes)
├─ Reviews deduplication strategy
├─ Resolves multi-source conflicts
└─ Items consolidated to unified view

PHASE 6: PUBLICATION (5 minutes)
├─ Verifies quality gate status
└─ Publishes to Map phase
```

---

## 6. IMPLEMENTATION ROADMAP

### Phase 1: Core Refactoring (Weeks 1-4)
- Refactor existing Prepare to Prepare_OLD
- Create new navigation structure
- Build data_sources and staging_items schema
- Implement Overview dashboard

### Phase 2: Staging & Mapping (Weeks 5-8)
- Implement Stage & Review tab
- Build Structure tab with field mapping
- Build Transform tab with normalization
- Add validation and preview functionality

### Phase 3: Consolidation & Publishing (Weeks 9-12)
- Implement Consolidate tab
- Build Publish tab with quality gates
- Create comprehensive logging
- Add data source management

### Phase 4: Enterprise Features (Future)
- CMDB integration module
- Network discovery scanner
- Cluster service discovery
- API integration framework
- Scheduled sync and webhook support

---

## 7. KEY DIFFERENTIATORS

The modernized Prepare module will:

✓ Support current + future data sources
✓ Provide progressive disclosure of complexity
✓ Show real-time quality feedback
✓ Enable multi-source aggregation
✓ Include complete audit & lineage
✓ Support template reuse
✓ Enable parallel workflows
✓ Scale to enterprise level
