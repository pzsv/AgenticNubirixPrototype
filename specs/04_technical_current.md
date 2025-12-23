# Nubirix - Technical Specification (Current System)

**Document ID**: TS-CUR-001  
**Date**: December 21, 2025  
**Status**: Current System Analysis  
**Version**: 1.0

---

## Executive Summary

This document describes the current technical architecture, technology stack, system design, and infrastructure approach for Nubirix.

---

## Technology Stack

### Backend

**Primary Framework**: Java Spring Boot (version 2.x or 3.x)

**Rationale**:
- Enterprise-grade, stable, well-supported
- Large ecosystem of libraries
- Excellent for microservices architecture
- Strong security and compliance features
- Good performance and scalability

**Key Dependencies**:
- Spring Data JPA (ORM, database access)
- Spring Security (authentication, authorization)
- Spring Web (REST API)
- Temporal Java SDK (workflow orchestration)
- Kafka/RabbitMQ (message queue)
- PostgreSQL Driver (database connectivity)
- Jackson (JSON processing)
- Lombok (code generation, reduces boilerplate)

**Build & Packaging**:
- Maven or Gradle (build automation)
- Docker (containerization)
- JAR/WAR deployment

### Frontend

**Current State**: Mixed Angular (legacy) and React (in progress)

**Angular** (Legacy):
- Version 10-12 (older versions)
- HTML templates
- TypeScript
- Known issues: difficult to enhance, limited reusability

**React** (In Progress):
- Version 16-18
- JavaScript/TypeScript
- Component-based architecture
- Modern tooling (Webpack, Babel)
- Status: Prepare phase migrated to React, other phases still Angular

**Migration Status**:
- Phase 1 (Prepare): React ✅
- Phase 2 (Map): Angular (legacy)
- Phase 3 (Plan): Angular (legacy)
- Phase 4 (Move): Angular (legacy)
- Phase 5 (Evaluate): Angular (legacy)

**Recommended**: Complete React migration (next phase)

**Frontend Libraries**:
- React Router (navigation)
- Redux or Context API (state management)
- Material-UI or Bootstrap (component library)
- D3.js (data visualization - planned)
- Axios or Fetch (HTTP requests)
- Testing Library (unit tests)
- Jest (test runner)

### Database

**Current**: PostgreSQL or Oracle (in evaluation)

**PostgreSQL**:
- Version 12+
- Open source, no licensing costs
- Excellent JSON/JSONB support
- Strong relational features
- Recommended choice

**Oracle**:
- Enterprise support available
- More advanced features
- Expensive licensing
- Good for very large datasets

**Key Features Used**:
- Transactions (ACID compliance)
- Foreign key constraints (referential integrity)
- Stored procedures (complex operations)
- Full-text search (optional)
- JSON storage (flexible attributes)
- UUID primary keys
- Audit triggers (change tracking)

### Message Queue

**Purpose**: Asynchronous task processing, event streaming

**Options** (TBD):
- **Kafka**: High-throughput streaming, distributed, complex
- **RabbitMQ**: Simple message queue, traditional pub/sub

**Current Status**: To be determined, decision pending

**Use Cases**:
- Data import processing (async, large files)
- Notification delivery (email, alerts)
- Reporting job queue
- Audit log streaming

### Cache

**Technology**: Redis

**Version**: 6.0+

**Purpose**:
- Cache query results (session data, lookups)
- Cache expensive computations
- Store temporary state
- Rate limiting

**Configuration**:
- Cluster mode (optional, for HA)
- TTL: 1 hour default, configurable
- Persistence: Optional (RDB, AOF)

### Workflow Orchestration

**Technology**: Temporal

**Version**: 1.15+

**Purpose**:
- Orchestrate multi-step migration processes
- Handle long-running operations (days/weeks)
- Implement retry logic and error handling
- Provide audit trail of execution
- Support human decisions (approvals)

**Example Workflows**:
- Migration execution (pre-checks → migrate → validate → cutover)
- Runbook execution
- Data import processing
- Report generation

### Analytics & BI

**Technology**: Metabase (integrated)

**Version**: Latest

**Purpose**:
- Ad-hoc SQL queries
- Dashboard creation
- Report generation
- Data visualization

**Rationale**:
- Easy to integrate with PostgreSQL
- No additional infrastructure
- Self-service BI for users
- Metadata management

**Limitation**: Not specialized for migration domain (future: replace with native analytics)

---

## System Architecture

### Microservices Pattern

**Architecture Style**: Microservices with API Gateway

**Benefits**:
- Independent scaling of services
- Technology flexibility per service
- Team autonomy and parallel development
- Resilience (failure isolation)

**Core Services**:

1. **API Gateway**
   - Entry point for all client requests
   - Request routing to services
   - Authentication/authorization
   - Rate limiting
   - Request logging

2. **Data Service**
   - CRUD operations on all entities
   - Data validation
   - Conflict detection
   - Data dictionary management

3. **Prepare Service**
   - File upload and parsing
   - Data normalization
   - Conflict resolution algorithms
   - Data quality calculation

4. **Map Service**
   - AWI creation and management
   - Dependency mapping
   - Dependency graph analysis
   - Critical path calculation

5. **Plan Service**
   - Move method definition
   - MDG creation and optimization
   - Wave scheduling
   - Cost/duration estimation

6. **Move Service**
   - Runbook generation
   - Wave sequencing
   - Execution planning
   - Handoff package creation

7. **Evaluate Service**
   - Report generation
   - Analytics queries
   - Cost/risk analysis
   - Compliance reporting

8. **Workflow Service**
   - Temporal client
   - Workflow execution
   - Task coordination
   - Event processing

9. **Authentication & Authorization Service**
   - JWT token generation
   - User authentication
   - Permission verification
   - RBAC enforcement

---

## Frontend Architecture

### Current React Component Structure

**Component Hierarchy**:

```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── ProjectSelector
├── Pages
│   ├── PreparePage (React, ✅)
│   │   ├── FileUpload
│   │   ├── DataGrid
│   │   ├── ConflictResolver
│   │   └── QualityDashboard
│   ├── MapPage (Angular, legacy)
│   ├── PlanPage (Angular, legacy)
│   ├── MovePage (Angular, legacy)
│   └── EvaluatePage (Angular, legacy)
└── Common
    ├── Modal
    ├── DataTable
    ├── Forms
    └── Charts
```

### State Management

**Current**: Mixed approaches (needs consolidation)
- **Proposed**: Redux or Context API

**State Structure**:
```javascript
{
  app: {
    currentProject: { id, name, status, ... },
    user: { id, email, role, ... },
    loading: boolean,
    error: string
  },
  data: {
    cis: { [id]: CI },
    awis: { [id]: AWI },
    dependencies: { [id]: Dependency },
    waves: { [id]: Wave },
    mdgs: { [id]: MDG }
  },
  ui: {
    selectedCIs: [id, ...],
    expandedSections: { sectionName: boolean },
    filters: { type, status, criticality },
    sortBy: { field, direction }
  }
}
```

---

## API Design

### REST API Conventions

**Base URL**: `/api/v1`

**Endpoints Pattern**:
```
GET    /projects                     # List projects
POST   /projects                     # Create project
GET    /projects/{projectId}         # Get project details
PUT    /projects/{projectId}         # Update project
DELETE /projects/{projectId}         # Delete project

GET    /projects/{projectId}/cis     # List CIs in project
POST   /projects/{projectId}/cis     # Create CI
GET    /projects/{projectId}/cis/{ciId}
PUT    /projects/{projectId}/cis/{ciId}
DELETE /projects/{projectId}/cis/{ciId}

GET    /projects/{projectId}/awis
POST   /projects/{projectId}/awis
...

GET    /projects/{projectId}/dependencies
POST   /projects/{projectId}/dependencies
...
```

### Request/Response Format

**Request**:
```json
{
  "name": "ERP System",
  "description": "Enterprise Resource Planning",
  "criticality": "high",
  "owner": "john.doe@company.com"
}
```

**Response**:
```json
{
  "id": "awi-123",
  "name": "ERP System",
  "description": "Enterprise Resource Planning",
  "criticality": "high",
  "owner": "john.doe@company.com",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### Error Handling

**Error Response**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "CI name already exists in project",
    "details": [
      {
        "field": "name",
        "message": "Name must be unique within project"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "path": "/api/v1/projects/proj-1/cis"
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (not authorized)
- 404: Not found
- 409: Conflict (e.g., duplicate name)
- 500: Internal server error

---

## Deployment Architecture

### Containerization

**Docker**:
- Each microservice in separate container
- Alpine Linux base image (small)
- Multi-stage build (optimize image size)
- Health checks configured

**Docker Compose** (development):
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nubirix
      POSTGRES_PASSWORD: password
  
  redis:
    image: redis:7-alpine
  
  kafka:
    image: confluentinc/cp-kafka:7.5
  
  api:
    build: ./api
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
      - kafka
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - api
```

### Current Deployment

**Environment**: Cloud-native (AWS, Azure, or GCP)

**Current Approach**:
- Docker containers
- Manual deployment or basic CI/CD
- Single instance or basic load balancing
- Single database instance

**Limitations**:
- Not optimized for multi-tenancy
- Limited auto-scaling capability
- No disaster recovery
- Single point of failure

### Infrastructure (Proposed Improvements)

**Target**: Kubernetes-based (see SaaS spec for details)

---

## Security Model

### Authentication

**JWT (JSON Web Tokens)**:
- Issued on login
- Contains user ID, email, role, project access
- Signed with private key
- Token expiration (1 hour typical)
- Refresh token for renewal (7 days)

**OAuth2** (optional):
- Integration with company SSO
- Support for multi-factor authentication
- Centralized user management

### Authorization

**Role-Based Access Control (RBAC)**:
- **Admin**: All access, user management
- **Consultant**: Create and edit projects
- **Viewer**: Read-only access

**Project-Level Access**:
- Owner (full access)
- Editor (can modify)
- Viewer (read-only)

**Implementation**:
- Spring Security with annotations
- Database-driven permissions
- Per-request authorization check

### Data Security

**Encryption**:
- In-transit: HTTPS/TLS (all connections)
- At-rest: Database encryption (optional)
- Sensitive fields: No additional encryption (future enhancement)

**Data Protection**:
- No credentials stored in clear text
- Password hashing (bcrypt)
- API keys rotated regularly
- Audit logging of access

---

## Monitoring & Observability

### Logging

**Approach**: Structured logging (JSON format)

**Tools**:
- Logback (Java logging)
- ELK Stack (Elasticsearch, Logstash, Kibana) or similar
- Centralized log aggregation
- Log retention: 30 days production, 7 days dev

**Log Levels**:
- ERROR: Failures that need attention
- WARN: Potential issues
- INFO: Normal operations
- DEBUG: Detailed information (dev only)

### Metrics

**Approach**: Application metrics collection

**Tools**:
- Micrometer (Java metrics)
- Prometheus (time-series database)
- Grafana (visualization)

**Key Metrics**:
- HTTP request count and duration
- Database query duration
- Cache hit/miss rates
- Error rates by type
- Business metrics (CIs imported, AWIs created, etc.)

### Health Checks

**Endpoints**:
- `/health` (basic liveness)
- `/health/live` (is service running)
- `/health/ready` (is service ready for requests)

**Checks**:
- Database connectivity
- Redis connectivity
- Disk space
- Memory usage

### Alerting

**Basic Alerts**:
- High error rate (>1% requests failing)
- Slow response time (p99 >2s)
- Database down
- Low disk space
- Memory leak indicators

---

## Performance Considerations

### Query Optimization

**Database Indexing Strategy**:
- Indexes on all foreign keys
- Indexes on commonly filtered columns
- Covering indexes for frequent queries
- Composite indexes for multi-column filters

**Query Patterns**:
- Batch loading relationships (N+1 problem avoidance)
- Query result caching
- Pagination for large result sets
- Partial indexes for common filters

### Caching Strategy

**Cache Layers**:
1. **Application-level**: In-memory cache (expensive computations)
2. **Distributed**: Redis (shared cache across instances)
3. **HTTP**: Browser caching for static assets

**Cached Data**:
- User sessions
- Project metadata
- Data dictionary entries
- Dimension lookups
- Computation results

### Frontend Performance

**Optimizations**:
- Code splitting (lazy load routes)
- Tree shaking (remove unused code)
- Minification and compression
- Image optimization
- Virtual scrolling (large lists)
- Memoization (React.memo, useMemo)

---

## Development Workflow

### Version Control

**Git**:
- Central repository (GitHub, GitLab)
- Branching strategy: Git Flow or Trunk-based
- Code reviews required (pull requests)
- Main branch is production-ready

### CI/CD Pipeline

**Build**:
1. Lint code (checkstyle, eslint)
2. Unit tests
3. Build Docker image
4. Push to registry

**Test**:
5. Integration tests
6. E2E tests
7. Performance tests
8. Security scanning

**Deploy**:
9. Staging deployment
10. Smoke tests
11. Production deployment (manual approval)
12. Health checks and monitoring

**Tools**: GitHub Actions, GitLab CI, or Jenkins

### Code Quality

**Standards**:
- Sonarqube for code quality analysis
- Code coverage target: 70%+
- Automated testing required
- Security scanning (SAST, dependency check)

---

## Known Issues & Technical Debt

### UI/UX Issues

1. **Angular Legacy Code**
   - Difficult to maintain and enhance
   - Inconsistent with React migration
   - Performance issues in complex phases
   - Recommendation: Complete React migration

2. **Table-Based Visualizations**
   - Difficult to understand complex relationships
   - No interactive graph visualization
   - Limited mobile support
   - Recommendation: Add D3.js graphs

3. **Limited Customization**
   - Dashboards not customizable
   - Reports are fixed format
   - Recommendation: Add drag-drop dashboard builder

### Architecture Issues

1. **Single-Tenant Design**
   - Not suitable for multi-tenant SaaS
   - High operational overhead per customer
   - Difficult to share resources
   - Recommendation: Redesign for multi-tenancy

2. **Manual Processes**
   - Data mapping is manual
   - Conflict resolution is manual
   - AWI grouping is manual
   - Recommendation: Add agentic automation

3. **Analytics Fragmented**
   - Separate Metabase tool
   - Requires separate login
   - Not domain-optimized
   - Recommendation: Native analytics

### Performance Limitations

1. **Scalability**
   - Limited to ~50,000 CIs per project
   - Not optimized for large graphs
   - Concurrency limited to <50 users
   - Recommendation: Optimize queries, add caching

2. **Real-Time Features**
   - No WebSocket support for live updates
   - No collaborative editing
   - Limited dashboard interactivity
   - Recommendation: Add real-time features

---

## Technology Decisions

### Database Choice

**Recommendation**: PostgreSQL

**Rationale**:
- Open source (no licensing)
- Strong relational features + JSON support
- Excellent for current use case
- Can be migrated to managed service (AWS RDS)

### Framework & Languages

**Recommendations** (maintain current):
- Java/Spring Boot: Proven, stable, good for enterprises
- React: Modern, popular, good developer experience
- PostgreSQL: As above

**Potential Changes**:
- Add GraphQL as alternative to REST API
- Consider Kotlin for backend (JVM, safer syntax)
- TypeScript for all frontend code (type safety)

---

## Migration Path to SaaS

See **08_technical_specification_saas.md** for detailed SaaS architecture.

**Key Changes**:
- Multi-tenancy (RLS in database)
- Microservices refinement
- Real-time features (WebSocket)
- Agentic AI/ML integration
- Native analytics and BI
- Kubernetes deployment
- Multi-region support

---

