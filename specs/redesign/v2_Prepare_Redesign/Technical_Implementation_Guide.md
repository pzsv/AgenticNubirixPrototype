# Nubirix Prepare Module - Technical Implementation Guide

## PART 1: ARCHITECTURE OVERVIEW

### Technology Stack Recommendation

**Frontend:**
- React 18 with TypeScript
- State Management: Redux Toolkit or Zustand
- Data Fetching: React Query (TanStack Query)
- UI Components: Custom component library (based on design system)
- Styling: Tailwind CSS + CSS Modules
- File Handling: React Dropzone, XLSX, Papaparse (CSV)
- Virtualization: React Window (for large datasets)
- Real-time Updates: Socket.IO client

**Backend:**
- Node.js + Express.js OR Python + FastAPI
- ORM: Sequelize (Node) / SQLAlchemy (Python)
- Database: PostgreSQL 14+
- Async Jobs: Bull (Node) / Celery (Python)
- Real-time: Socket.IO
- Caching: Redis
- API Documentation: OpenAPI/Swagger

**Infrastructure:**
- Docker & Docker Compose (development)
- Kubernetes (production)
- CI/CD: GitHub Actions / GitLab CI
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack or similar

---

## PART 2: DATABASE SCHEMA

### Current Tables (Preserved)
- data_entities
- data_entity_fields
- mappings
- normalized_data

### New Tables Required

#### Table 1: data_sources
```sql
CREATE TABLE data_sources (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  type ENUM('excel', 'csv', 'manual', 'cmdb', 'network_discovery', 'cluster', 'api') NOT NULL,
  config JSONB, -- Source-specific config (file path, API endpoint, credentials, etc)
  status ENUM('active', 'paused', 'error', 'disabled') DEFAULT 'active',
  last_sync_at TIMESTAMP,
  sync_interval_minutes INT, -- NULL for one-time, number for recurring
  error_log TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID NOT NULL REFERENCES users(id),
  
  UNIQUE(project_id, name),
  INDEX idx_project_type (project_id, type),
  INDEX idx_status (status)
);
```

#### Table 2: staging_items
```sql
CREATE TABLE staging_items (
  id UUID PRIMARY KEY,
  data_source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  asset_type VARCHAR(100) NOT NULL, -- 'compute', 'database', 'storage', etc
  raw_data JSONB NOT NULL, -- Original ingested data
  quality_score DECIMAL(3,1), -- 0-100
  quality_details JSONB, -- {completeness, consistency, validity}
  status ENUM('pending_review', 'ready', 'conflict', 'mapped', 'published') DEFAULT 'pending_review',
  external_id VARCHAR(255), -- Source system ID for dedup
  conflict_with_id UUID REFERENCES staging_items(id), -- Linked duplicate
  conflict_resolution JSONB, -- Merge strategy applied
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  INDEX idx_data_source (data_source_id),
  INDEX idx_status (status),
  INDEX idx_asset_type (asset_type),
  INDEX idx_external_id (data_source_id, external_id),
  INDEX idx_quality_score (quality_score)
);
```

#### Table 3: mapping_profiles
```sql
CREATE TABLE mapping_profiles (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  data_source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(100) NOT NULL, -- 'compute', 'database', 'storage'
  version INT DEFAULT 1,
  mapping_rules JSONB NOT NULL, -- {raw_field: target_entity.target_field, transform: ...}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  
  UNIQUE(data_source_id, asset_type),
  INDEX idx_project (project_id),
  INDEX idx_data_source (data_source_id)
);
```

#### Table 4: transformation_rules
```sql
CREATE TABLE transformation_rules (
  id UUID PRIMARY KEY,
  mapping_profile_id UUID NOT NULL REFERENCES mapping_profiles(id) ON DELETE CASCADE,
  target_field_id UUID NOT NULL REFERENCES data_entity_fields(id),
  rule_type ENUM('direct', 'convert', 'normalize', 'validate', 'enrich', 'custom') NOT NULL,
  rule_config JSONB NOT NULL, -- {operation: 'lowercase', params: {...}}
  enabled BOOLEAN DEFAULT TRUE,
  order INT NOT NULL, -- Execution order
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_profile (mapping_profile_id),
  INDEX idx_enabled_order (enabled, order)
);
```

#### Table 5: consolidation_rules
```sql
CREATE TABLE consolidation_rules (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  asset_type VARCHAR(100) NOT NULL,
  primary_key_fields TEXT[] NOT NULL, -- Fields that define uniqueness
  field_merge_strategy JSONB NOT NULL, -- {field_name: 'most_recent'|'max'|'min'|'priority'}
  source_priority TEXT[], -- Source order for conflict resolution
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  
  UNIQUE(project_id, asset_type),
  INDEX idx_project (project_id)
);
```

#### Table 6: ingestion_jobs
```sql
CREATE TABLE ingestion_jobs (
  id UUID PRIMARY KEY,
  data_source_id UUID NOT NULL REFERENCES data_sources(id),
  job_type ENUM('upload', 'sync', 'validation', 'mapping', 'transformation', 'consolidation', 'publication') NOT NULL,
  status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  progress_percent INT DEFAULT 0,
  total_items INT,
  processed_items INT DEFAULT 0,
  error_items INT DEFAULT 0,
  error_log TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  
  INDEX idx_data_source (data_source_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);
```

#### Table 7: quality_metrics
```sql
CREATE TABLE quality_metrics (
  id UUID PRIMARY KEY,
  staging_item_id UUID NOT NULL REFERENCES staging_items(id) ON DELETE CASCADE,
  metric_type ENUM('completeness', 'consistency', 'validity', 'deduplication') NOT NULL,
  score DECIMAL(3,1),
  details JSONB, -- Issues/warnings
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_staging_item (staging_item_id),
  INDEX idx_metric_type (metric_type)
);
```

#### Table 8: data_lineage
```sql
CREATE TABLE data_lineage (
  id UUID PRIMARY KEY,
  staging_item_id UUID NOT NULL REFERENCES staging_items(id) ON DELETE CASCADE,
  source_item_id UUID REFERENCES staging_items(id), -- If consolidated from another
  transformation_applied JSONB, -- What was changed
  timestamp TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100), -- 'created', 'mapped', 'normalized', 'consolidated', 'published'
  
  INDEX idx_staging_item (staging_item_id),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp)
);
```

#### Table 9: audit_log
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  entity_type VARCHAR(100), -- 'data_source', 'mapping_profile', 'consolidation_rule'
  entity_id UUID,
  action VARCHAR(50), -- 'create', 'update', 'delete'
  changes JSONB, -- What changed {old_value, new_value}
  user_id UUID NOT NULL REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
  ip_address INET,
  
  INDEX idx_project (project_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_user (user_id),
  INDEX idx_timestamp (timestamp)
);
```

---

## PART 3: REST API ENDPOINTS

### Authentication & Authorization
All endpoints require JWT token in Authorization header.

### Data Sources Endpoints

```
POST   /api/projects/:projectId/data-sources
       Create new data source
       {
         name, type, config (source-specific),
         sync_interval_minutes (optional)
       }

GET    /api/projects/:projectId/data-sources
       List all data sources with sync status

GET    /api/projects/:projectId/data-sources/:sourceId
       Get specific source + recent sync history

PUT    /api/projects/:projectId/data-sources/:sourceId
       Update source config or schedule

DELETE /api/projects/:projectId/data-sources/:sourceId
       Remove source (staging items cascade)

POST   /api/projects/:projectId/data-sources/:sourceId/trigger-sync
       Manually trigger sync for scheduled sources

GET    /api/projects/:projectId/data-sources/:sourceId/sync-history
       Get sync attempt history with errors
```

### File Upload Endpoints

```
POST   /api/projects/:projectId/upload
       Upload Excel/CSV file
       Returns: uploadId, preview (first 100 rows), field detection

POST   /api/projects/:projectId/upload/:uploadId/confirm
       Confirm upload, create staging items
       {asset_type, sheet_mapping (for Excel)}

GET    /api/projects/:projectId/upload/:uploadId/preview
       Get preview of upload with field suggestions
```

### Staging Items Endpoints

```
GET    /api/projects/:projectId/staging-items
       List all staging items with filters
       ?status=pending_review&assetType=compute&sourceId=X

GET    /api/projects/:projectId/staging-items/:itemId
       Get detailed staging item with quality metrics

PUT    /api/projects/:projectId/staging-items/:itemId
       Update item status or raw_data
       {status, raw_data (partial update)}

DELETE /api/projects/:projectId/staging-items/:itemId
       Delete staging item

POST   /api/projects/:projectId/staging-items/:itemId/resolve-conflict
       Resolve conflict between duplicates
       {strategy: 'keep_primary'|'merge'|'manual', manual_data: {}}

GET    /api/projects/:projectId/staging-items/:itemId/quality
       Get detailed quality assessment
```

### Mapping Profile Endpoints

```
POST   /api/projects/:projectId/mapping-profiles
       Create mapping profile
       {dataSourceId, assetType, mappingRules: {...}}

GET    /api/projects/:projectId/mapping-profiles
       List all mapping profiles

GET    /api/projects/:projectId/mapping-profiles/:profileId
       Get mapping profile detail

PUT    /api/projects/:projectId/mapping-profiles/:profileId
       Update mapping rules

DELETE /api/projects/:projectId/mapping-profiles/:profileId
       Delete profile (disables for existing mappings)

POST   /api/projects/:projectId/mapping-profiles/:profileId/apply
       Apply mapping to staging items
       {stagingItemIds: [...] or targetStatus: 'pending_review'}

POST   /api/projects/:projectId/mapping-profiles/:profileId/validate
       Validate mapping rules against sample data
```

### Transformation Endpoints

```
POST   /api/projects/:projectId/mapping-profiles/:profileId/transformations
       Create transformation rule
       {targetFieldId, ruleType, ruleConfig, order}

GET    /api/projects/:projectId/mapping-profiles/:profileId/transformations
       List transformation rules

PUT    /api/projects/:projectId/mapping-profiles/:profileId/transformations/:ruleId
       Update transformation rule

DELETE /api/projects/:projectId/mapping-profiles/:profileId/transformations/:ruleId
       Delete transformation rule

POST   /api/projects/:projectId/mapping-profiles/:profileId/preview-transformation
       Preview transformation on sample data
       {stagingItemIds: [...], ruleIds: [...]}
```

### Consolidation Endpoints

```
POST   /api/projects/:projectId/consolidation-rules
       Create consolidation rule
       {assetType, primaryKeyFields, fieldMergeStrategy, sourcePriority}

GET    /api/projects/:projectId/consolidation-rules
       List consolidation rules

PUT    /api/projects/:projectId/consolidation-rules/:ruleId
       Update consolidation rule

POST   /api/projects/:projectId/consolidation-rules/:ruleId/apply
       Apply consolidation
       {stagingItemIds: [...]}

GET    /api/projects/:projectId/consolidation-rules/:ruleId/conflicts
       Get detected conflicts with recommended resolution
```

### Job Management Endpoints

```
GET    /api/projects/:projectId/jobs
       List ingestion jobs (paginated)
       ?status=running&type=validation&limit=20

GET    /api/projects/:projectId/jobs/:jobId
       Get job status and progress

POST   /api/projects/:projectId/jobs/:jobId/cancel
       Cancel running job

GET    /api/projects/:projectId/jobs/:jobId/errors
       Get detailed error log for failed job
```

### Dashboard/Analytics Endpoints

```
GET    /api/projects/:projectId/dashboard
       Overview metrics
       Returns: {
         ingestionProgress: {...},
         dataQuality: {...},
         sourceSummary: {...},
         completionFunnel: {...}
       }

GET    /api/projects/:projectId/quality-report
       Quality metrics by source, asset type, field
       ?groupBy=source&assetType=compute

GET    /api/projects/:projectId/lineage/:stagingItemId
       Data lineage for item (audit trail)
```

---

## PART 4: FRONTEND ARCHITECTURE

### Component Structure

```
Prepare/
├── pages/
│   ├── Overview.tsx
│   ├── Discover.tsx
│   ├── StageReview.tsx
│   ├── Structure.tsx
│   ├── Transform.tsx
│   ├── Consolidate.tsx
│   └── Publish.tsx
├── components/
│   ├── DataSourceSelector.tsx
│   ├── FileUploadWizard.tsx
│   ├── StagingItemsList.tsx
│   ├── QualityScoreBadge.tsx
│   ├── ConflictResolutionModal.tsx
│   ├── MappingProfileForm.tsx
│   ├── TransformationRuleEditor.tsx
│   ├── ConsolidationRuleForm.tsx
│   ├── DataPreviewTable.tsx
│   ├── JobProgress.tsx
│   └── ... (20+ components)
├── hooks/
│   ├── useDataSources.ts
│   ├── useStagingItems.ts
│   ├── useMappingProfiles.ts
│   ├── useQualityMetrics.ts
│   └── ... (custom hooks)
├── services/
│   ├── api.ts
│   ├── fileParser.ts
│   └── qualityCalculator.ts
├── store/
│   ├── slices/
│   │   ├── dataSources.slice.ts
│   │   ├── stagingItems.slice.ts
│   │   ├── mappingProfiles.slice.ts
│   │   └── jobs.slice.ts
│   └── store.ts
├── types/
│   ├── index.ts (all TypeScript interfaces)
└── styles/
    └── prepare.module.css
```

### Redux Store Structure

```typescript
interface PrepareState {
  dataSources: {
    byId: Record<string, DataSource>;
    allIds: string[];
    loading: boolean;
    error: string | null;
  };
  stagingItems: {
    byId: Record<string, StagingItem>;
    allIds: string[];
    filters: {status, assetType, sourceId};
    loading: boolean;
    error: string | null;
  };
  mappingProfiles: {
    byId: Record<string, MappingProfile>;
    allIds: string[];
    loading: boolean;
  };
  jobs: {
    byId: Record<string, IngestionJob>;
    allIds: string[];
    activeJobId: string | null;
  };
  ui: {
    selectedDataSourceId: string | null;
    selectedStagingItemId: string | null;
    uploadModalOpen: boolean;
    conflictModalOpen: boolean;
  };
}
```

---

## PART 5: ASYNCHRONOUS PROCESSING

### Job Queue Architecture

Uses Bull (Node.js) or Celery (Python) for async job processing:

```javascript
// Example: Node.js with Bull
const uploadQueue = new Queue('uploads', {
  connection: { host: 'localhost', port: 6379 }
});

uploadQueue.process(async (job) => {
  // 1. Parse file
  // 2. Create staging items in DB
  // 3. Calculate quality scores
  // 4. Emit progress updates via WebSocket
  // 5. Return summary
  
  job.progress(25);
  // ... parsing
  
  job.progress(50);
  // ... creating staging items
  
  job.progress(75);
  // ... calculating metrics
  
  return {itemsCreated, itemsWithErrors};
});
```

### Real-time Updates via WebSocket

```javascript
// Server: Emit progress updates
socket.emit('job:progress', {jobId, progress, message});

// Client: Listen for updates
socket.on('job:progress', ({jobId, progress, message}) => {
  dispatch(updateJobProgress({jobId, progress}));
});
```

---

## PART 6: DEPLOYMENT

### Docker Compose (Development)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: nubirix_prepare
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:dev_password@postgres:5432/nubirix_prepare
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001
    depends_on:
      - api
```

### Kubernetes Deployment (Production)

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nubirix-prepare-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nubirix-prepare-api
  template:
    metadata:
      labels:
        app: nubirix-prepare-api
    spec:
      containers:
      - name: api
        image: nubirix/prepare-api:v2.0.0
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: prepare-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: nubirix-prepare-api
spec:
  selector:
    app: nubirix-prepare-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: LoadBalancer
```

---

## PART 7: TESTING STRATEGY

### Unit Tests
- API endpoint tests (Jest + Supertest)
- Reducer/store tests (Redux)
- Component tests (React Testing Library)
- Utility function tests

### Integration Tests
- End-to-end workflows (file upload → mapping → publication)
- Database operations
- API interactions

### Performance Tests
- Load testing with 10,000+ items
- Query performance benchmarks
- Memory profiling

---

## PART 8: SUCCESS METRICS

**Performance:**
- Page load time: < 2 seconds
- API response (p95): < 500ms
- File upload preview: < 3 seconds for 10,000 rows
- Quality metrics calculation: < 1 second per 1,000 items

**User Experience:**
- Workflow time: 45 min (v1) → 28 min (v2)
- Error rate: 3.2% (v1) → 0.8% (v2)
- User satisfaction: 3.2/5 (v1) → 4.6/5 (v2)
- Adoption rate: Target 85% of users using v2 within 30 days

This technical guide provides the comprehensive foundation for implementation.
