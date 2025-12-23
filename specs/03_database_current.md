# Nubirix - Database Specification (Current System)

**Document ID**: DS-CUR-001  
**Date**: December 21, 2025  
**Status**: Current System Analysis  
**Version**: 1.0

---

## Executive Summary

This document describes the current database schema, design patterns, relationships, and data models used in Nubirix. It provides the blueprint for the system's data storage and retrieval.

---

## Database Technology

**Current Database**: PostgreSQL or Oracle (TBD, in evaluation)

**Rationale**:
- PostgreSQL: Open source, excellent JSON support, JSONB data type
- Oracle: Enterprise support, advanced features, expensive licensing
- Both support: transactions, constraints, audit trails, backup/recovery

**Schema Design Approach**: 3rd Normal Form (3NF) for relational data with JSON flexibility for extensible attributes

---

## Core Entity Models

### Configuration Item (CI)

**Purpose**: Represents a single infrastructure component (server, database, network device, etc.)

```sql
CREATE TABLE configuration_item (
  ci_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  ci_type VARCHAR(50) NOT NULL, -- server, database, storage, network, etc.
  ci_name VARCHAR(255) NOT NULL,
  description TEXT,
  criticality VARCHAR(20), -- low, medium, high
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  status VARCHAR(50), -- active, planned, retired, etc.
  source_file VARCHAR(255), -- which file was this imported from
  confidence DECIMAL(3,2), -- 0.00-1.00, how confident is this data
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  UNIQUE(project_id, ci_name, ci_type)
);

CREATE INDEX idx_ci_project ON configuration_item(project_id);
CREATE INDEX idx_ci_type ON configuration_item(ci_type);
CREATE INDEX idx_ci_criticality ON configuration_item(criticality);
```

### CI Attribute (Flexible Attributes)

**Purpose**: Store flexible key-value attributes for CIs (EAV model)

```sql
CREATE TABLE ci_attribute (
  attribute_id UUID PRIMARY KEY,
  ci_id UUID NOT NULL,
  attribute_name VARCHAR(100) NOT NULL, -- OS, RAM, CPU, Database, etc.
  attribute_value VARCHAR(1000),
  data_type VARCHAR(20), -- string, integer, date, enum
  canonical_value VARCHAR(1000), -- normalized value from data dictionary
  confidence DECIMAL(3,2), -- 0.00-1.00, confidence in this attribute
  source VARCHAR(255), -- where this attribute came from
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (ci_id) REFERENCES configuration_item(ci_id) ON DELETE CASCADE,
  UNIQUE(ci_id, attribute_name)
);

CREATE INDEX idx_attr_ci ON ci_attribute(ci_id);
CREATE INDEX idx_attr_name ON ci_attribute(attribute_name);
```

### CI Conflict

**Purpose**: Track conflicts when same CI has different values from different sources

```sql
CREATE TABLE ci_conflict (
  conflict_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  ci_id UUID NOT NULL,
  attribute_name VARCHAR(100),
  value1 VARCHAR(1000),
  source1 VARCHAR(255),
  confidence1 DECIMAL(3,2),
  value2 VARCHAR(1000),
  source2 VARCHAR(255),
  confidence2 DECIMAL(3,2),
  status VARCHAR(50), -- unresolved, resolved, accepted_gap
  resolved_value VARCHAR(1000),
  resolved_by UUID, -- user who resolved conflict
  resolved_at TIMESTAMP,
  reason TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (ci_id) REFERENCES configuration_item(ci_id)
);

CREATE INDEX idx_conflict_project ON ci_conflict(project_id);
CREATE INDEX idx_conflict_ci ON ci_conflict(ci_id);
CREATE INDEX idx_conflict_status ON ci_conflict(status);
```

### Data Gap

**Purpose**: Track missing attributes or incomplete data

```sql
CREATE TABLE data_gap (
  gap_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  ci_id UUID NOT NULL,
  attribute_name VARCHAR(100),
  gap_type VARCHAR(50), -- missing_attribute, incomplete_value
  criticality VARCHAR(20), -- how important is this gap
  status VARCHAR(50), -- open, filled_manually, accepted_gap
  filled_by UUID, -- user who filled gap
  filled_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (ci_id) REFERENCES configuration_item(ci_id)
);

CREATE INDEX idx_gap_project ON data_gap(project_id);
CREATE INDEX idx_gap_ci ON data_gap(ci_id);
```

### Data Dictionary Entry

**Purpose**: Define canonical values and mappings for attributes

```sql
CREATE TABLE data_dictionary_entry (
  entry_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  attribute_name VARCHAR(100),
  user_value VARCHAR(1000), -- what user enters
  canonical_value VARCHAR(1000), -- what system normalizes to
  confidence DECIMAL(3,2), -- how confident is this mapping
  frequency INT, -- how often this mapping used
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(project_id, attribute_name, user_value),
  FOREIGN KEY (project_id) REFERENCES project(project_id)
);

CREATE INDEX idx_dict_project ON data_dictionary_entry(project_id);
CREATE INDEX idx_dict_attribute ON data_dictionary_entry(attribute_name);
```

### Application Workload Instance (AWI)

**Purpose**: Logical grouping of CIs that migrate together

```sql
CREATE TABLE application_workload_instance (
  awi_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  awi_name VARCHAR(255) NOT NULL,
  description TEXT,
  awi_type VARCHAR(50), -- application, database, infrastructure
  criticality VARCHAR(20), -- low, medium, high
  owner_name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  UNIQUE(project_id, awi_name)
);

CREATE INDEX idx_awi_project ON application_workload_instance(project_id);
```

### AWI to CI Mapping (Many-to-Many)

**Purpose**: Map which CIs belong to which AWIs

```sql
CREATE TABLE awi_ci_mapping (
  mapping_id UUID PRIMARY KEY,
  awi_id UUID NOT NULL,
  ci_id UUID NOT NULL,
  role VARCHAR(50), -- provider, consumer, supporting
  created_at TIMESTAMP,
  FOREIGN KEY (awi_id) REFERENCES application_workload_instance(awi_id),
  FOREIGN KEY (ci_id) REFERENCES configuration_item(ci_id),
  UNIQUE(awi_id, ci_id)
);

CREATE INDEX idx_mapping_awi ON awi_ci_mapping(awi_id);
CREATE INDEX idx_mapping_ci ON awi_ci_mapping(ci_id);
```

### Dependency

**Purpose**: Track dependencies between AWIs and CIs

```sql
CREATE TABLE dependency (
  dependency_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  source_awi_id UUID NOT NULL,
  target_awi_id UUID NOT NULL,
  dependency_type VARCHAR(50), -- hard, soft
  description TEXT,
  validation_status VARCHAR(50), -- unverified, verified, false
  source_info VARCHAR(255), -- how was this dependency discovered
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (source_awi_id) REFERENCES application_workload_instance(awi_id),
  FOREIGN KEY (target_awi_id) REFERENCES application_workload_instance(awi_id)
);

CREATE INDEX idx_dep_project ON dependency(project_id);
CREATE INDEX idx_dep_source ON dependency(source_awi_id);
CREATE INDEX idx_dep_target ON dependency(target_awi_id);
```

### Dependency Validation

**Purpose**: Track validation status and quality of dependencies

```sql
CREATE TABLE dependency_validation (
  validation_id UUID PRIMARY KEY,
  dependency_id UUID NOT NULL,
  validation_rule VARCHAR(100), -- no_cycles, complete_mapping, pattern_match
  pass BOOLEAN,
  severity VARCHAR(20), -- info, warning, error
  message TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (dependency_id) REFERENCES dependency(dependency_id)
);

CREATE INDEX idx_validation_dep ON dependency_validation(dependency_id);
```

### Move Method

**Purpose**: Define how each AWI will be migrated

```sql
CREATE TABLE move_method (
  method_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  awi_id UUID NOT NULL,
  method_name VARCHAR(50), -- like-for-like, rehost, refactor, move
  description TEXT,
  estimated_duration_days INT,
  estimated_cost DECIMAL(12,2),
  risk_level VARCHAR(20), -- low, medium, high
  required_skills TEXT, -- JSON array of required skill set
  created_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (awi_id) REFERENCES application_workload_instance(awi_id)
);

CREATE INDEX idx_method_project ON move_method(project_id);
CREATE INDEX idx_method_awi ON move_method(awi_id);
```

### Move Dependency Group (MDG)

**Purpose**: Group of AWIs scheduled to migrate together

```sql
CREATE TABLE move_dependency_group (
  mdg_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  mdg_name VARCHAR(255),
  description TEXT,
  wave_id UUID,
  estimated_start_date DATE,
  estimated_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  status VARCHAR(50), -- planned, in_progress, complete, blocked
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (wave_id) REFERENCES migration_wave(wave_id)
);

CREATE INDEX idx_mdg_project ON move_dependency_group(project_id);
CREATE INDEX idx_mdg_wave ON move_dependency_group(wave_id);
```

### MDG to AWI Mapping

**Purpose**: Map which AWIs belong to which MDG

```sql
CREATE TABLE mdg_awi_mapping (
  mapping_id UUID PRIMARY KEY,
  mdg_id UUID NOT NULL,
  awi_id UUID NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (mdg_id) REFERENCES move_dependency_group(mdg_id),
  FOREIGN KEY (awi_id) REFERENCES application_workload_instance(awi_id),
  UNIQUE(mdg_id, awi_id)
);

CREATE INDEX idx_mdg_mapping_mdg ON mdg_awi_mapping(mdg_id);
CREATE INDEX idx_mdg_mapping_awi ON mdg_awi_mapping(awi_id);
```

### Migration Wave

**Purpose**: Time period during which migration occurs

```sql
CREATE TABLE migration_wave (
  wave_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  wave_number INT,
  description TEXT,
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  status VARCHAR(50), -- planned, in_progress, complete
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  UNIQUE(project_id, wave_number)
);

CREATE INDEX idx_wave_project ON migration_wave(project_id);
CREATE INDEX idx_wave_status ON migration_wave(status);
```

### Runbook Template

**Purpose**: Template for migration procedures

```sql
CREATE TABLE runbook_template (
  template_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  template_name VARCHAR(255),
  description TEXT,
  template_type VARCHAR(50), -- technical, governance, testing
  move_method VARCHAR(50), -- which move method this applies to
  content TEXT, -- FreeMarker template content
  variables JSONB, -- {variable_name: description, ...}
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id)
);

CREATE INDEX idx_runbook_project ON runbook_template(project_id);
```

### Runbook (Generated)

**Purpose**: Actual generated runbook for migration execution

```sql
CREATE TABLE runbook (
  runbook_id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  wave_id UUID,
  mdg_id UUID,
  runbook_name VARCHAR(255),
  description TEXT,
  content TEXT, -- Rendered runbook (not template)
  status VARCHAR(50), -- draft, approved, executed, archived
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (wave_id) REFERENCES migration_wave(wave_id),
  FOREIGN KEY (mdg_id) REFERENCES move_dependency_group(mdg_id)
);

CREATE INDEX idx_runbook_project ON runbook(project_id);
CREATE INDEX idx_runbook_wave ON runbook(wave_id);
CREATE INDEX idx_runbook_mdg ON runbook(mdg_id);
```

### Project

**Purpose**: Container for entire migration project

```sql
CREATE TABLE project (
  project_id UUID PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  target_cloud VARCHAR(50), -- AWS, Azure, GCP, Hybrid
  status VARCHAR(50), -- planning, in_progress, complete, archived
  start_date DATE,
  end_date DATE,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(project_name)
);

CREATE INDEX idx_project_status ON project(status);
```

### User & Access Control

**Purpose**: User accounts and project access

```sql
CREATE TABLE "user" (
  user_id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50), -- admin, consultant, viewer
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

CREATE TABLE user_project_access (
  access_id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID NOT NULL,
  access_level VARCHAR(50), -- owner, editor, viewer
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id),
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  UNIQUE(user_id, project_id)
);

CREATE INDEX idx_access_user ON user_project_access(user_id);
CREATE INDEX idx_access_project ON user_project_access(project_id);
```

### Audit Log

**Purpose**: Track all changes for compliance and debugging

```sql
CREATE TABLE audit_log (
  log_id UUID PRIMARY KEY,
  user_id UUID,
  project_id UUID,
  action VARCHAR(50), -- create, update, delete, export
  entity_type VARCHAR(50), -- ci, awi, dependency, mdg, etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  timestamp TIMESTAMP,
  result VARCHAR(20) -- success, failure,
  error_message TEXT
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_project ON audit_log(project_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
```

---

## Data Model Diagram

```
Project (1)
  ├─ (1:N) Configuration Item
  │   ├─ (1:N) CI Attribute
  │   ├─ (0:N) CI Conflict
  │   └─ (0:N) Data Gap
  ├─ (1:N) Application Workload Instance
  │   ├─ (N:M) CI (via awi_ci_mapping)
  │   └─ (1:N) Move Method
  ├─ (1:N) Dependency (between AWIs)
  │   └─ (1:N) Dependency Validation
  ├─ (1:N) Migration Wave
  │   └─ (1:N) Move Dependency Group
  │       └─ (N:M) AWI (via mdg_awi_mapping)
  └─ (1:N) Runbook Template
      └─ (1:N) Runbook (generated)

Data Dictionary Entry
  └─ (references) Project + Attribute Name
  └─ (references) Canonical Values

User (1:N) User Project Access
  └─ (N:1) Project
```

---

## Key Indexes

**Performance Optimization Indexes**:

```sql
-- Foreign key indexes (automatic in most DBs)
CREATE INDEX idx_ci_project ON configuration_item(project_id);
CREATE INDEX idx_awi_project ON application_workload_instance(project_id);
CREATE INDEX idx_dep_project ON dependency(project_id);

-- Common filter indexes
CREATE INDEX idx_ci_criticality ON configuration_item(criticality);
CREATE INDEX idx_ci_type ON configuration_item(ci_type);
CREATE INDEX idx_wave_status ON migration_wave(status);
CREATE INDEX idx_mdg_wave ON move_dependency_group(wave_id);

-- Audit indexes (for compliance)
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
```

---

## Data Constraints & Validation

**Referential Integrity**:
- Foreign keys enforce relationships
- CASCADE delete for dependent records
- UNIQUE constraints prevent duplicates

**Business Rules**:
- Project name must be unique
- CI name must be unique within project
- AWI name must be unique within project
- No circular dependencies allowed
- Wave number must be sequential within project

---

## Data Volume Estimates

| Entity | Typical Count | Size |
|--------|--------------|------|
| Project | 1 | N/A |
| Configuration Item | 5,000 | 25 MB |
| CI Attribute | 40,000 | 40 MB |
| CI Conflict | 500 | 2 MB |
| Data Gap | 1,000 | 3 MB |
| AWI | 100 | 1 MB |
| Dependency | 200 | 2 MB |
| Migration Wave | 5 | <1 MB |
| MDG | 25 | 1 MB |
| Audit Log (1 year) | 500,000 | 250 MB |
| **Total** | **~550K** | **~325 MB** |

---

## Scalability Considerations

**Current Limits**:
- Single-tenant per database instance
- Supports up to 50,000 CIs per project
- Supports up to 1,000 AWIs per project
- Supports up to 100,000 dependencies
- Supports concurrent users: <50

**Scaling Strategy** (if needed):
- Vertical scaling: Larger database instance
- Sharding: By project_id (future)
- Read replicas: For reporting and analytics
- Archive old projects: Move to separate storage

---

