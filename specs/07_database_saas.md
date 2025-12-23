# Nubirix - Database Specification (Proposed SaaS Evolution)

**Document ID**: DS-SAA-001  
**Date**: December 21, 2025  
**Status**: Proposed SaaS Evolution  
**Version**: 1.0

---

## Executive Summary

This document describes the database design evolution for the SaaS version of Nubirix, focusing on multi-tenancy support, analytics capabilities, compliance requirements, and scalability enhancements.

---

## Multi-Tenancy Architecture

### Current State Challenge

The current single-tenant schema requires significant changes to support multiple customers in a shared database while ensuring data isolation and compliance.

### Design Approach: Row-Level Security (RLS)

**Selected Pattern**: Shared database with Row-Level Security (RLS)
- All tables include `tenant_id` column
- PostgreSQL RLS policies enforce tenant isolation at database level
- No application-level data filtering needed (handled by DB)
- Performance benefits (single database instance scales better than per-tenant databases)

### Implementation

**Tenant Isolation Functions** (PostgreSQL):

```sql
-- Set current tenant for session
CREATE FUNCTION set_current_tenant(tenant_uuid UUID) 
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_uuid::text, false);
END;
$$ LANGUAGE plpgsql;

-- Get current tenant
CREATE FUNCTION get_current_tenant() 
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id')::UUID;
END;
$$ LANGUAGE plpgsql;
```

**Example RLS Policy** (applied to all tenant-specific tables):

```sql
-- Enable RLS
ALTER TABLE configuration_item ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation ON configuration_item
  USING (tenant_id = get_current_tenant());

-- Apply to DML operations
ALTER TABLE configuration_item FORCE ROW LEVEL SECURITY;
```

**Tables Requiring tenant_id Column**:
- configuration_item
- ci_attribute
- ci_conflict
- data_gap
- data_dictionary_entry
- application_workload_instance
- dependency
- dependency_validation
- move_dependency_group
- migration_wave
- runbook_template
- project
- user_project_access

**Shared Tables** (no tenant isolation needed):
- user (user accounts)
- role (system roles)
- audit_log (with tenant_id for filtering)

---

## Schema Enhancements for SaaS

### New Tables for Per-Tenant Customization

**Table: tenant_configuration**

```sql
CREATE TABLE tenant_configuration (
  tenant_config_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(1000),
  primary_color VARCHAR(7), -- Hex color for UI
  secondary_color VARCHAR(7),
  custom_terminology JSON, -- e.g., {"awi": "Workload", "ci": "Asset"}
  timezone VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
);
```

**Table: tenant_data_dictionary**

```sql
CREATE TABLE tenant_data_dictionary (
  data_dict_entry_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  attribute_name VARCHAR(100) NOT NULL,
  canonical_values JSON, -- {value: string, count: int, last_used: date}
  created_at TIMESTAMP,
  UNIQUE(tenant_id, attribute_name),
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
);
```

**Table: tenant_custom_fields**

```sql
CREATE TABLE tenant_custom_fields (
  custom_field_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(20), -- string, number, date, enum
  entity_type VARCHAR(50), -- ci, awi, dependency
  enum_values JSON, -- if field_type = enum
  required BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP,
  UNIQUE(tenant_id, entity_type, field_name),
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
);
```

**Table: tenant_runbook_templates**

```sql
CREATE TABLE tenant_runbook_templates (
  template_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  description TEXT,
  move_method VARCHAR(50), -- like-for-like, rehost, refactor, etc.
  content TEXT, -- FreeMarker template
  variables JSON, -- {variable_name: description}
  created_by UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
);
```

---

## Analytics Data Mart

### Dimension Tables

**Table: dim_time** (Pre-populated)

```sql
CREATE TABLE dim_time (
  date_id INT PRIMARY KEY,
  date DATE UNIQUE,
  year INT,
  quarter INT,
  month INT,
  week INT,
  day_of_week INT,
  day_name VARCHAR(10),
  is_weekend BOOLEAN
);
```

**Table: dim_ci_type**

```sql
CREATE TABLE dim_ci_type (
  ci_type_id INT PRIMARY KEY,
  ci_type_name VARCHAR(50) UNIQUE,
  category VARCHAR(50), -- compute, storage, database, network
  description TEXT,
  created_at TIMESTAMP
);
```

**Table: dim_move_method**

```sql
CREATE TABLE dim_move_method (
  move_method_id INT PRIMARY KEY,
  method_name VARCHAR(50) UNIQUE,
  description TEXT,
  complexity_level INT, -- 1-5, 1=simple, 5=complex
  created_at TIMESTAMP
);
```

**Table: dim_status**

```sql
CREATE TABLE dim_status (
  status_id INT PRIMARY KEY,
  status_name VARCHAR(50) UNIQUE,
  category VARCHAR(50), -- completed, in_progress, blocked, not_started
  created_at TIMESTAMP
);
```

### Fact Tables

**Table: fact_migrations**

```sql
CREATE TABLE fact_migrations (
  migration_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  project_id UUID NOT NULL,
  wave_id UUID NOT NULL,
  mdg_id UUID NOT NULL,
  awi_id UUID NOT NULL,
  ci_type_id INT,
  move_method_id INT,
  status_id INT,
  start_date_id INT,
  actual_end_date_id INT,
  planned_end_date_id INT,
  duration_days INT,
  days_behind_schedule INT,
  complexity_score INT,
  risk_score INT,
  created_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id),
  FOREIGN KEY (ci_type_id) REFERENCES dim_ci_type(ci_type_id),
  FOREIGN KEY (move_method_id) REFERENCES dim_move_method(move_method_id),
  FOREIGN KEY (status_id) REFERENCES dim_status(status_id),
  FOREIGN KEY (start_date_id) REFERENCES dim_time(date_id),
  FOREIGN KEY (actual_end_date_id) REFERENCES dim_time(date_id),
  FOREIGN KEY (planned_end_date_id) REFERENCES dim_time(date_id)
);

CREATE INDEX idx_fact_migrations_project ON fact_migrations(tenant_id, project_id);
CREATE INDEX idx_fact_migrations_wave ON fact_migrations(tenant_id, wave_id);
CREATE INDEX idx_fact_migrations_method ON fact_migrations(move_method_id);
```

**Table: fact_costs**

```sql
CREATE TABLE fact_costs (
  cost_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  project_id UUID NOT NULL,
  wave_id UUID,
  mdg_id UUID,
  cost_date_id INT,
  infrastructure_cost DECIMAL(10,2),
  labor_cost DECIMAL(10,2),
  tool_cost DECIMAL(10,2),
  testing_cost DECIMAL(10,2),
  contingency_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  budgeted_cost DECIMAL(10,2),
  cost_variance DECIMAL(10,2), -- actual - budgeted
  created_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id),
  FOREIGN KEY (cost_date_id) REFERENCES dim_time(date_id)
);

CREATE INDEX idx_fact_costs_project ON fact_costs(tenant_id, project_id);
CREATE INDEX idx_fact_costs_wave ON fact_costs(tenant_id, wave_id);
```

**Table: fact_risks**

```sql
CREATE TABLE fact_risks (
  risk_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  project_id UUID NOT NULL,
  wave_id UUID,
  mdg_id UUID,
  awi_id UUID,
  risk_date_id INT,
  risk_type VARCHAR(50), -- technical, schedule, resource, organizational
  risk_category VARCHAR(100),
  risk_score INT, -- 0-10
  probability INT, -- 0-100
  impact INT, -- 0-100
  mitigation_status VARCHAR(50), -- open, mitigated, accepted
  mitigation_description TEXT,
  owner_name VARCHAR(255),
  created_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id),
  FOREIGN KEY (risk_date_id) REFERENCES dim_time(date_id)
);

CREATE INDEX idx_fact_risks_project ON fact_risks(tenant_id, project_id);
```

---

## Materialized Views for Performance

### Common Reporting Queries

**View: mv_cost_summary_by_wave**

```sql
CREATE MATERIALIZED VIEW mv_cost_summary_by_wave AS
SELECT
  fc.tenant_id,
  fc.project_id,
  fc.wave_id,
  SUM(fc.total_cost) as total_cost,
  SUM(fc.budgeted_cost) as budgeted_cost,
  SUM(fc.cost_variance) as total_variance,
  COUNT(*) as mdg_count,
  AVG(fc.total_cost) as avg_cost_per_mdg
FROM fact_costs fc
WHERE fc.wave_id IS NOT NULL
GROUP BY fc.tenant_id, fc.project_id, fc.wave_id;

CREATE INDEX idx_mv_cost_wave ON mv_cost_summary_by_wave(tenant_id, project_id);
```

**View: mv_progress_by_wave**

```sql
CREATE MATERIALIZED VIEW mv_progress_by_wave AS
SELECT
  fm.tenant_id,
  fm.project_id,
  fm.wave_id,
  COUNT(*) as total_awis,
  SUM(CASE WHEN fm.status_id = (SELECT status_id FROM dim_status WHERE status_name = 'completed') THEN 1 ELSE 0 END) as completed_awis,
  ROUND(100.0 * SUM(CASE WHEN fm.status_id = (SELECT status_id FROM dim_status WHERE status_name = 'completed') THEN 1 ELSE 0 END) / COUNT(*), 2) as progress_percent
FROM fact_migrations fm
WHERE fm.wave_id IS NOT NULL
GROUP BY fm.tenant_id, fm.project_id, fm.wave_id;

CREATE INDEX idx_mv_progress_wave ON mv_progress_by_wave(tenant_id, project_id);
```

**View: mv_risk_dashboard**

```sql
CREATE MATERIALIZED VIEW mv_risk_dashboard AS
SELECT
  fr.tenant_id,
  fr.project_id,
  COUNT(*) as total_risks,
  SUM(CASE WHEN fr.risk_score >= 7 THEN 1 ELSE 0 END) as high_risk_count,
  SUM(CASE WHEN fr.risk_score >= 5 AND fr.risk_score < 7 THEN 1 ELSE 0 END) as medium_risk_count,
  SUM(CASE WHEN fr.risk_score < 5 THEN 1 ELSE 0 END) as low_risk_count,
  ROUND(AVG(fr.risk_score), 2) as avg_risk_score
FROM fact_risks fr
WHERE fr.mitigation_status != 'mitigated'
GROUP BY fr.tenant_id, fr.project_id;
```

**Refresh Schedule**:
- Nightly (00:00 UTC): Full refresh of all materialized views
- On-demand: Available via API endpoint

---

## Compliance & Audit Requirements

### GDPR & Data Residency

**Table: data_residency_requirement**

```sql
CREATE TABLE data_residency_requirement (
  requirement_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL UNIQUE,
  region VARCHAR(50), -- eu, us, ap, etc.
  compliance_framework VARCHAR(50), -- gdpr, hipaa, sox, ccpa
  data_encryption_required BOOLEAN,
  created_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id)
);
```

### Comprehensive Audit Logging

**Table: audit_log** (Enhanced)

```sql
CREATE TABLE audit_log (
  log_id UUID PRIMARY KEY,
  tenant_id UUID,
  user_id UUID,
  action VARCHAR(50), -- create, update, delete, export, approve
  entity_type VARCHAR(50), -- ci, awi, dependency, etc.
  entity_id UUID,
  old_values JSONB, -- Previous values for updates
  new_values JSONB, -- New values
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP NOT NULL,
  result VARCHAR(20) -- success, failure
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
```

### GDPR Right to Be Forgotten

**Procedure: anonymize_tenant_data()**

```sql
CREATE PROCEDURE anonymize_tenant_data(tenant_uuid UUID)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Anonymize user personal data
  UPDATE "user" SET email = 'deleted@example.com' WHERE tenant_id = tenant_uuid;
  
  -- Delete project data (compliance requirement)
  DELETE FROM project WHERE tenant_id = tenant_uuid AND created_at < NOW() - INTERVAL '90 days';
  
  -- Keep audit log for compliance but anonymize user references
  UPDATE audit_log SET user_id = NULL WHERE tenant_id = tenant_uuid;
END;
$$;
```

---

## Scalability Enhancements

### Database Sharding Strategy (Future)

**Sharding Key**: `tenant_id`

**Implementation** (when database exceeds capacity):
1. Identify sharding boundaries (hash tenant_id to shard #)
2. Distribute tenants across shards
3. Router layer in application directs queries to correct shard

**Current Design** (single database):
- Supports 100+ customers with millions of CIs per tenant
- Vertical scaling (larger database instance) handles growth

### Indexing Strategy

**Primary Indexes** (already defined above):
- Tenant + entity: `(tenant_id, entity_id)`
- Foreign keys: Indexed automatically
- Timestamp: For time-range queries

**Secondary Indexes** (performance optimization):

```sql
-- For filtering and sorting
CREATE INDEX idx_ci_criticality ON configuration_item(tenant_id, criticality);
CREATE INDEX idx_awi_move_method ON application_workload_instance(tenant_id, move_method_id);
CREATE INDEX idx_dependency_type ON dependency(tenant_id, dependency_type);

-- For reporting
CREATE INDEX idx_migration_status ON fact_migrations(tenant_id, status_id);
CREATE INDEX idx_cost_project_date ON fact_costs(tenant_id, project_id, cost_date_id);
```

### Connection Pooling

**Configuration** (via application):
- Pool size: 20-50 connections (depends on traffic)
- Max idle: 5 minutes
- Connection timeout: 30 seconds
- Test on borrow: `SELECT 1`

---

## Data Encryption

### At-Rest Encryption

- PostgreSQL native encryption (pgcrypto extension)
- Sensitive fields: `encrypted_column bytea = pgp_sym_encrypt(data, encryption_key)`
- Encryption key: Stored in application secrets manager (AWS KMS, HashiCorp Vault)

**Encrypted Fields**:
- user email and phone
- api_key values
- custom_field values (if marked sensitive)

### In-Transit Encryption

- TLS 1.3 for database connections
- SSL certificates for application-to-database
- Certificate pinning (optional, for high-security environments)

---

## Performance Optimization

### Query Optimization

**Common Query Patterns**:

1. **Get project progress**:
```sql
SELECT
  w.wave_number,
  COUNT(*) as total_awis,
  SUM(CASE WHEN fm.status_id = ? THEN 1 ELSE 0 END) as completed
FROM migration_wave w
LEFT JOIN fact_migrations fm ON fm.wave_id = w.wave_id
WHERE w.project_id = ? AND fm.tenant_id = ?
GROUP BY w.wave_number;
```
**Index**: `(tenant_id, project_id, wave_id, status_id)`

2. **Get cost summary by move method**:
```sql
SELECT
  dm.method_name,
  SUM(fc.total_cost) as cost,
  COUNT(*) as mdg_count
FROM fact_costs fc
JOIN dim_move_method dm ON fc.move_method_id = dm.move_method_id
WHERE fc.project_id = ? AND fc.tenant_id = ?
GROUP BY dm.method_name;
```
**Index**: `(tenant_id, project_id, move_method_id)`

### Caching Strategy

- **Redis cache** for:
  - Dimension tables (ci_types, move_methods, statuses)
  - User project access (permissions)
  - Dashboard definitions
  - Common aggregations

- **TTL**: 1 hour for most data, 24 hours for dimensions

---

## Appendices

### A. Schema Diagram

[ASCII diagram would show relationships between all tables, omitted for brevity but would include:
- Tenant relationship to all tables
- RLS policies
- Fact/dimension relationships for analytics]

### B. Migration Script

```sql
-- Add tenant_id to existing tables
ALTER TABLE configuration_item ADD COLUMN tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE configuration_item ADD CONSTRAINT fk_ci_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(tenant_id);

-- Enable RLS
ALTER TABLE configuration_item ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_ci ON configuration_item USING (tenant_id = get_current_tenant());

-- Create indexes
CREATE INDEX idx_ci_tenant ON configuration_item(tenant_id);
```

### C. Data Volume Estimates

| Table | Rows (Single Tenant) | Size (Approx) |
|-------|----------------------|---------------|
| configuration_item | 10,000 | 50 MB |
| dependency | 15,000 | 20 MB |
| fact_migrations | 5,000 | 15 MB |
| fact_costs | 10,000 | 20 MB |
| audit_log (1 year) | 1,000,000 | 500 MB |
| **Total per tenant** | **~1.04M** | **~605 MB** |

---

