# Nubirix - Complete Junie Prompts for PyCharm AI Assistant
**Ready-to-Copy Prompts for Building Python Prototype**

**Document ID**: JUNIE-PROMPTS-001  
**Date**: December 21, 2025  
**Status**: Development Guide  
**Version**: 1.0

---

## 📋 How to Use This File

1. **Open PyCharm** with your `nubirix-python` project
2. **Create empty file** (e.g., `app/main.py`)
3. **Open Junie** with keyboard shortcut:
   - **Windows/Linux**: `Ctrl+\`
   - **Mac**: `Cmd+\`
4. **Copy entire prompt** from section below (everything between `---START PROMPT---` and `---END PROMPT---`)
5. **Paste into Junie chat**
6. **Review generated code** and accept
7. **Move to next file**

**Estimated Time**: 13-19 hours total for all 21 prompts

---

## 🗂️ Generation Order

Follow this sequence for best results:

1. `app/config.py` → PROMPT 13
2. `app/database.py` → PROMPT 2
3. `app/models/configuration_item.py` → PROMPT 4
4. `app/models/application_workload.py` → PROMPT 7
5. `app/schemas/ci_schema.py` → PROMPT 3
6. `app/services/ci_service.py` → PROMPT 6
7. `app/services/dependency_service.py` → PROMPT 8
8. `app/services/quality_service.py` → PROMPT 9
9. `app/services/planning_service.py` → PROMPT 10
10. `app/services/import_service.py` → PROMPT 11
11. `app/main.py` → PROMPT 1
12. `app/api/routers/configuration_items.py` → PROMPT 5
13. `tests/test_api.py` → PROMPT 12
14. `app/middleware/auth.py` → PROMPT 14
15. `docker-compose.yml` → PROMPT 15
16. `migrations/env.py` → PROMPT 16
17. `app/utils/cache.py` → PROMPT 17
18. `app/api/openapi_schema.py` → PROMPT 18
19. `app/utils/exceptions.py` → PROMPT 19
20. `app/utils/logging.py` → PROMPT 20
21. `app/scripts/seed_db.py` → PROMPT 21

---

## ✅ PROMPT 1: FastAPI Main Application Setup
**Location**: `app/main.py`

---START PROMPT---

Generate a FastAPI application skeleton for a cloud migration planning tool called Nubirix. 

Include:
1. FastAPI app initialization with title "Nubirix API", version "1.0.0"
2. CORS middleware configuration (allow localhost:3000 for frontend)
3. Health check endpoint (GET /health) that returns {"status": "ok"}
4. API version prefix /api/v1 for all routes
5. Error handlers for HTTPException
6. Request logging middleware that logs method, path, and status code
7. Dependency injection setup for database session
8. Documentation at /docs (Swagger UI)

Use async functions and modern FastAPI patterns. Include comprehensive docstrings.

---END PROMPT---

**Expected Output**: ~60 lines

---

## ✅ PROMPT 2: Database Configuration & Models Base
**Location**: `app/database.py`

---START PROMPT---

Create a SQLAlchemy database module for PostgreSQL that includes:

1. Database connection string from environment variables
2. SQLAlchemy engine creation with echo=False for production
3. SessionLocal for creating database sessions
4. Base class for all models (declarative_base)
5. get_db() async generator function as dependency
6. Connection pooling configuration (pool_size=20, max_overflow=0)
7. Error handling for database connection failures
8. Optional async support with create_async_engine for asyncio

Include docstrings explaining each component.
Make it compatible with FastAPI dependency injection.

---END PROMPT---

**Expected Output**: ~70 lines

---

## ✅ PROMPT 3: Pydantic Schema for Configuration Item
**Location**: `app/schemas/ci_schema.py`

---START PROMPT---

Create Pydantic schemas for Configuration Item (CI) entity with:

1. CICreate: Request schema with fields:
   - ci_name: str (required, max 255 chars)
   - ci_type: str (required, enum: server, database, storage, network, other)
   - description: str | None
   - criticality: str (enum: low, medium, high, required)
   - owner_name: str | None
   - owner_email: EmailStr | None
   - status: str (enum: active, planned, retired, default="active")

2. CIUpdate: Schema for PATCH requests (all fields optional)

3. CIResponse: Schema for API responses (includes id, created_at, updated_at, project_id)

4. CIList: Pagination wrapper with:
   - items: List[CIResponse]
   - total: int
   - page: int
   - page_size: int

Include validation rules:
- Email validation for owner_email
- String length constraints
- Enum validation for ci_type, criticality, status

Add Config class with orm_mode=True for SQLAlchemy compatibility.

---END PROMPT---

**Expected Output**: ~80 lines

---

## ✅ PROMPT 4: SQLAlchemy Model for Configuration Item
**Location**: `app/models/configuration_item.py`

---START PROMPT---

Create SQLAlchemy model for Configuration Item with:

1. Table name: "configuration_item"
2. Columns:
   - ci_id: UUID primary key (default=uuid4())
   - project_id: UUID foreign key (not null)
   - ci_type: VARCHAR(50) (not null)
   - ci_name: VARCHAR(255) (not null)
   - description: TEXT (nullable)
   - criticality: VARCHAR(20) (not null)
   - owner_name: VARCHAR(255) (nullable)
   - owner_email: VARCHAR(255) (nullable)
   - status: VARCHAR(50) (default="active")
   - confidence: DECIMAL(3,2) (default=1.0)
   - source_file: VARCHAR(255) (nullable)
   - created_at: DateTime (default=datetime.utcnow)
   - updated_at: DateTime (default=datetime.utcnow, onupdate=datetime.utcnow)

3. Relationships:
   - project: relationship to Project model
   - attributes: relationship to CIAttribute (one-to-many)
   - conflicts: relationship to CIConflict (one-to-many)

4. Indexes:
   - Composite unique index on (project_id, ci_name, ci_type)
   - Index on (project_id, criticality)
   - Index on (ci_type)

5. Methods:
   - __repr__ for debugging

Import from sqlalchemy, use declarative base pattern.
Add docstring explaining entity purpose.

---END PROMPT---

**Expected Output**: ~70 lines

---

## ✅ PROMPT 5: API Router for Configuration Items
**Location**: `app/api/routers/configuration_items.py`

---START PROMPT---

Create FastAPI router for Configuration Item endpoints:

1. Async endpoints with proper error handling:

   GET /projects/{project_id}/cis
   - List all CIs in project
   - Query params: page (default 1), page_size (default 50), ci_type (optional filter)
   - Return: CIList schema with pagination
   - Error: 404 if project not found

   POST /projects/{project_id}/cis
   - Create new CI
   - Request body: CICreate schema
   - Return: CIResponse with 201 status
   - Error: 400 for validation, 409 for duplicate

   GET /projects/{project_id}/cis/{ci_id}
   - Get single CI
   - Return: CIResponse
   - Error: 404 if not found

   PUT /projects/{project_id}/cis/{ci_id}
   - Update CI
   - Request body: CIUpdate schema
   - Return: CIResponse
   - Error: 404, 400

   DELETE /projects/{project_id}/cis/{ci_id}
   - Delete CI
   - Return: 204 No Content
   - Error: 404

2. Dependency injection for:
   - db: Session (from get_db)
   - Current user (stub for now)

3. Request logging and error handling
4. Validation of project_id and ci_id (must be valid UUIDs)

Use async def, SQLAlchemy ORM queries with session.
Add comprehensive docstrings for each endpoint.

---END PROMPT---

**Expected Output**: ~120 lines

---

## ✅ PROMPT 6: Service Layer for CI Operations
**Location**: `app/services/ci_service.py`

---START PROMPT---

Create service class CIService with methods:

1. __init__(self, db: Session)
   - Store database session

2. async def get_ci(self, project_id: UUID, ci_id: UUID) -> ConfigurationItem | None
   - Query single CI by project and ID
   - Return None if not found

3. async def get_cis(self, project_id: UUID, skip: int = 0, limit: int = 50, ci_type: str = None) -> tuple[List[ConfigurationItem], int]
   - Query CIs with pagination
   - Optional filter by ci_type
   - Return tuple of (list, total_count)

4. async def create_ci(self, project_id: UUID, ci_data: CICreate) -> ConfigurationItem
   - Create new CI
   - Validate project exists
   - Raise ValueError if project not found
   - Raise IntegrityError if duplicate name

5. async def update_ci(self, project_id: UUID, ci_id: UUID, ci_data: CIUpdate) -> ConfigurationItem
   - Update CI fields
   - Only update provided fields
   - Return updated CI
   - Raise 404 if not found

6. async def delete_ci(self, project_id: UUID, ci_id: UUID) -> bool
   - Delete CI
   - Return True if deleted, False if not found

7. async def list_by_criticality(self, project_id: UUID, criticality: str) -> List[ConfigurationItem]
   - Filter CIs by criticality level
   - Return list of matching CIs

Include error handling, logging, and docstrings.
Use SQLAlchemy ORM queries with proper session management.

---END PROMPT---

**Expected Output**: ~120 lines

---

## ✅ PROMPT 7: SQLAlchemy Model for Application Workload Instance
**Location**: `app/models/application_workload.py`

---START PROMPT---

Create SQLAlchemy model for Application Workload Instance (AWI):

1. Table name: "application_workload_instance"
2. Columns:
   - awi_id: UUID primary key
   - project_id: UUID foreign key (not null)
   - awi_name: VARCHAR(255) (not null)
   - description: TEXT (nullable)
   - awi_type: VARCHAR(50) (enum: application, database, infrastructure)
   - criticality: VARCHAR(20) (enum: low, medium, high)
   - owner_name: VARCHAR(255) (nullable)
   - created_at: DateTime (default now)
   - updated_at: DateTime (default now, onupdate)

3. Relationships:
   - project: ForeignKey to Project
   - cis: many-to-many through awi_ci_mapping table
   - outgoing_dependencies: one-to-many to Dependency (source_awi_id)
   - incoming_dependencies: one-to-many to Dependency (target_awi_id)
   - mdg_mappings: one-to-many to MDGAWIMapping

4. Indexes:
   - Composite unique on (project_id, awi_name)
   - Index on (project_id, criticality)

5. Methods:
   - get_ci_count(): return count of associated CIs
   - get_dependencies_count(): return count of dependencies
   - __repr__()

Use association proxy for many-to-many with extra data.
Add comprehensive docstrings.

---END PROMPT---

**Expected Output**: ~80 lines

---

## ✅ PROMPT 8: Dependency Detection & Analysis Service
**Location**: `app/services/dependency_service.py`

---START PROMPT---

Create DependencyService class for analyzing AWI dependencies:

1. __init__(self, db: Session)
   - Store session

2. async def detect_missing_dependencies(self, project_id: UUID) -> List[Dict]:
   - Find AWIs that should have dependencies but don't
   - Return list of recommendations with reasoning
   - Example: {"awi_id": "...", "suggestion": "...", "confidence": 0.85}

3. async def calculate_critical_path(self, project_id: UUID) -> List[UUID]:
   - Find longest dependency chain in project
   - Use depth-first search
   - Return ordered list of AWI IDs representing critical path
   - Return empty list if no dependencies

4. async def detect_circular_dependencies(self, project_id: UUID) -> List[List[UUID]]:
   - Find all circular dependency chains
   - Return list of cycles (each cycle is list of AWI IDs)
   - Return empty list if no cycles

5. async def validate_dependency_graph(self, project_id: UUID) -> Dict:
   - Run all validations
   - Return dict with:
     - is_valid: bool
     - cycles: List of cycles
     - missing: List of missing dependencies
     - warnings: List of warnings

6. async def get_dependency_tree(self, awi_id: UUID) -> Dict:
   - Return tree structure showing all dependencies
   - Include depth information
   - Include circular dependency warnings

Include algorithms, error handling, and extensive docstrings.
Handle large graphs efficiently (up to 10,000 AWIs).

---END PROMPT---

**Expected Output**: ~150 lines

---

## ✅ PROMPT 9: Data Quality & Validation Service
**Location**: `app/services/quality_service.py`

---START PROMPT---

Create DataQualityService class:

1. __init__(self, db: Session)

2. async def calculate_ci_confidence(self, ci_id: UUID) -> float
   - Score 0.0-1.0 based on:
     - All required attributes present (+0.3)
     - All attributes have canonical values (+0.3)
     - No conflicting values (+0.2)
     - From reliable source (+0.15)
     - Recent data (+0.05)
   - Return final score

3. async def detect_data_conflicts(self, project_id: UUID) -> List[Dict]:
   - Find CIs with conflicting attribute values from different sources
   - Return list with conflict details
   - Each conflict includes: ci_id, attribute, value1, value2, sources

4. async def identify_data_gaps(self, project_id: UUID) -> List[Dict]:
   - Find missing required attributes
   - Return list with gap details
   - Each gap includes: ci_id, ci_type, missing_attributes

5. async def get_quality_metrics(self, project_id: UUID) -> Dict:
   - Return quality dashboard data:
     - overall_quality: float (0-1)
     - completeness: float (% attributes present)
     - consistency: float (% values match patterns)
     - confidence_distribution: Dict (low/medium/high counts)
     - conflicts_count: int
     - gaps_count: int

6. async def suggest_conflict_resolution(self, conflict_id: UUID) -> Dict:
   - Recommend which value to keep based on confidence scoring
   - Return suggestion with reasoning

Use heuristics and confidence scoring algorithms.
Include comprehensive logging for debugging.

---END PROMPT---

**Expected Output**: ~140 lines

---

## ✅ PROMPT 10: Migration Wave & MDG Service
**Location**: `app/services/planning_service.py`

---START PROMPT---

Create PlanningService class for wave scheduling:

1. __init__(self, db: Session)

2. async def create_wave(self, project_id: UUID, wave_number: int, description: str = None) -> MigrationWave
   - Create new migration wave
   - Validate wave_number is not duplicate
   - Return created wave

3. async def add_mdg_to_wave(self, project_id: UUID, wave_id: UUID, mdg_id: UUID) -> MigrationWave
   - Add MDG to wave
   - Validate dependencies (all provider MDGs in earlier waves)
   - Return updated wave
   - Raise error if violates dependency order

4. async def suggest_wave_schedule(self, project_id: UUID) -> List[Dict]:
   - Analyze all MDGs and dependencies
   - Return suggested wave schedule
   - Each wave includes: wave_number, suggested_mdgs, estimated_duration, resource_requirements

5. async def estimate_wave_cost(self, wave_id: UUID) -> Dict:
   - Calculate total cost for wave
   - Break down by: labor, infrastructure, tools, contingency
   - Return cost estimates

6. async def estimate_wave_duration(self, wave_id: UUID) -> Dict:
   - Estimate duration based on MDGs in wave
   - Return: estimated_weeks, confidence_level

7. async def validate_wave_schedule(self, project_id: UUID) -> List[str]:
   - Check for schedule conflicts
   - Check for dependency violations
   - Check for resource over-allocation
   - Return list of issues found

Use dependency graph analysis, cost estimation algorithms.
Include realistic estimates based on move methods.

---END PROMPT---

**Expected Output**: ~130 lines

---

## ✅ PROMPT 11: File Upload & Data Import Service
**Location**: `app/services/import_service.py`

---START PROMPT---

Create DataImportService for handling file uploads:

1. __init__(self, db: Session)

2. async def parse_excel_file(self, file_path: str, worksheet_name: str, header_row: int = 0) -> List[Dict]:
   - Parse Excel file
   - Extract data from specified worksheet
   - Return list of dictionaries (header -> value mapping)
   - Handle errors gracefully

3. async def parse_csv_file(self, file_path: str, delimiter: str = ',', encoding: str = 'utf-8') -> List[Dict]:
   - Parse CSV file
   - Return list of dictionaries
   - Handle encoding issues

4. async def validate_data_structure(self, data: List[Dict], expected_fields: List[str]) -> Dict:
   - Validate each record has required fields
   - Return: {is_valid: bool, errors: List[str], warnings: List[str]}

5. async def normalize_ci_data(self, raw_data: List[Dict], data_dictionary: Dict) -> List[Dict]:
   - Apply data dictionary mappings
   - Normalize field names and values
   - Calculate confidence for each field
   - Return normalized data

6. async def import_cis(self, project_id: UUID, ci_data: List[Dict]) -> Dict:
   - Create CIs in database from normalized data
   - Detect and flag conflicts
   - Calculate overall import quality
   - Return: {imported_count, conflict_count, gap_count, quality_score}

7. async def detect_conflicts(self, existing_ci: ConfigurationItem, new_data: Dict) -> List[Dict]:
   - Compare existing CI with new data
   - Return list of conflicting fields with details

Use openpyxl for Excel, csv module for CSV.
Include comprehensive error handling and logging.
Support batch operations for large files.

---END PROMPT---

**Expected Output**: ~140 lines

---

## ✅ PROMPT 12: Pytest Test Suite Setup
**Location**: `tests/test_api.py`

---START PROMPT---

Create pytest test suite for CI endpoints with:

1. Fixtures:
   - test_db: In-memory SQLite database for testing
   - test_client: TestClient for FastAPI app
   - test_project_id: Valid UUID for project
   - test_user: Mock user for auth

2. Test cases for GET /projects/{project_id}/cis:
   - test_list_cis_success: Returns 200 with list
   - test_list_cis_pagination: Test page and page_size params
   - test_list_cis_filter_by_type: Test ci_type filter
   - test_list_cis_empty: Returns 200 with empty list when no CIs

3. Test cases for POST /projects/{project_id}/cis:
   - test_create_ci_success: Returns 201 with created CI
   - test_create_ci_validation_error: Returns 400 for missing fields
   - test_create_ci_duplicate_name: Returns 409 for duplicate
   - test_create_ci_invalid_project: Returns 404 for invalid project

4. Test cases for GET /projects/{project_id}/cis/{ci_id}:
   - test_get_ci_success: Returns 200 with CI details
   - test_get_ci_not_found: Returns 404

5. Test cases for PUT /projects/{project_id}/cis/{ci_id}:
   - test_update_ci_success: Returns 200 with updated CI
   - test_update_ci_partial: Test partial updates

6. Test cases for DELETE /projects/{project_id}/cis/{ci_id}:
   - test_delete_ci_success: Returns 204

Use pytest.mark.asyncio for async tests.
Use conftest.py for shared fixtures.
Aim for >80% code coverage.
Include comprehensive docstrings.

---END PROMPT---

**Expected Output**: ~150 lines

---

## ✅ PROMPT 13: Configuration & Environment Setup
**Location**: `app/config.py`

---START PROMPT---

Create configuration module with:

1. Settings class using pydantic Settings:
   - DATABASE_URL: str (PostgreSQL connection, from env)
   - REDIS_URL: str (Redis connection, from env, default="redis://localhost:6379/0")
   - API_TITLE: str = "Nubirix API"
   - API_VERSION: str = "1.0.0"
   - API_DESCRIPTION: str
   - ENVIRONMENT: str (dev, staging, prod, from env, default="dev")
   - DEBUG: bool (from env, default=False)
   - LOG_LEVEL: str (from env, default="INFO")
   - CORS_ORIGINS: List[str] (from env, default=["http://localhost:3000"])
   - JWT_SECRET_KEY: str (from env, required)
   - JWT_ALGORITHM: str = "HS256"
   - ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

2. Database configuration:
   - SQLALCHEMY_POOL_SIZE: int = 20
   - SQLALCHEMY_MAX_OVERFLOW: int = 0
   - SQLALCHEMY_ECHO: bool (True in dev, False in prod)

3. Logging configuration:
   - Setup structured logging in JSON format
   - Use Python logging module
   - Log to console in dev, file in prod

4. Methods:
   - get_settings() -> Settings (cached singleton)
   - validate_database_url(): Validate PostgreSQL connection string
   - validate_jwt_secret(): Ensure secret is >32 chars

Use environment variables via .env file (python-dotenv).
Include validation and error messages.
Add docstrings.

Create .env.example with all required variables.

---END PROMPT---

**Expected Output**: ~90 lines

---

## ✅ PROMPT 14: Authentication & Authorization Middleware
**Location**: `app/middleware/auth.py`

---START PROMPT---

Create authentication middleware:

1. verify_jwt_token(token: str) -> Dict:
   - Verify JWT token signature
   - Extract claims (user_id, email, role, project_access)
   - Return decoded claims
   - Raise exception if invalid/expired

2. get_current_user(token: str = Depends(HTTPBearer())) -> Dict:
   - Extract and verify JWT from Authorization header
   - Return current user claims
   - Dependency for protecting routes

3. get_user_projects(user_claims: Dict = Depends(get_current_user)) -> List[UUID]:
   - Extract list of projects user has access to
   - Return list of project IDs
   - Dependency for filtering by user access

4. require_role(required_role: str) -> callable:
   - Create dependency that requires specific role
   - Return callable that verifies role
   - Use with Depends()

5. require_project_access(required_access: str = "editor") -> callable:
   - Create dependency that requires project access level
   - Options: viewer, editor, owner
   - Return callable that verifies access

Use PyJWT for token operations.
Use HTTPBearer from fastapi.security.
Include comprehensive error handling.
Add logging for auth attempts.

Example usage:
@router.get("/projects")
async def list_projects(current_user: Dict = Depends(get_current_user)):
    # Only authenticated users

---END PROMPT---

**Expected Output**: ~100 lines

---

## ✅ PROMPT 15: Docker Compose for Local Development
**Location**: `docker-compose.yml`

---START PROMPT---

Create docker-compose.yml with services:

1. PostgreSQL:
   - Image: postgres:15-alpine
   - Environment:
     - POSTGRES_DB: nubirix_dev
     - POSTGRES_USER: nubirix
     - POSTGRES_PASSWORD: nubirix_dev_password
   - Ports: 5432:5432
   - Volumes: postgres_data:/var/lib/postgresql/data
   - Health check: psql command every 10s

2. Redis:
   - Image: redis:7-alpine
   - Ports: 6379:6379
   - Volumes: redis_data:/data
   - Health check: redis-cli ping every 10s

3. PgAdmin (optional, for DB browsing):
   - Image: dpage/pgadmin4:latest
   - Environment:
     - PGADMIN_DEFAULT_EMAIL: admin@local.dev
     - PGADMIN_DEFAULT_PASSWORD: admin
   - Ports: 5050:80

4. Network:
   - Create custom network "nubirix-net"
   - Connect all services

Volumes:
   - postgres_data
   - redis_data

Add comments with instructions:
- How to start: docker-compose up
- How to access: localhost:5432 (postgres), localhost:6379 (redis)
- How to stop: docker-compose down
- How to reset: docker-compose down -v

Use version: '3.8'

---END PROMPT---

**Expected Output**: ~60 lines

---

## ✅ PROMPT 16: Database Migrations with Alembic
**Location**: `migrations/env.py` (after alembic init)

---START PROMPT---

Configure Alembic for database migrations:

1. Set sqlalchemy.url in alembic.ini:
   - sqlalchemy.url = driver://user:password@localhost/dbname
   - Use environment variables from .env

2. In env.py, configure:
   - target_metadata = Base.metadata (from app.models)
   - Run migrations in context manager
   - Support both online (against DB) and offline (generate SQL)

3. Create initial migration:
   - Detect all SQLAlchemy models
   - Auto-generate CREATE TABLE statements

4. Document migration commands:
   ```
   # Create migration
   alembic revision --autogenerate -m "Initial schema"
   
   # Run migrations
   alembic upgrade head
   
   # Rollback
   alembic downgrade -1
   ```

Include comprehensive docstrings explaining migration process.
Set up proper error handling.
Include logging of migration operations.

---END PROMPT---

**Expected Output**: ~80 lines

---

## ✅ PROMPT 17: Caching Layer with Redis
**Location**: `app/utils/cache.py`

---START PROMPT---

Create caching utility using Redis:

1. CacheManager class:
   - __init__(self, redis_url: str)
   - Connect to Redis on init

2. Methods:
   - async def set(self, key: str, value: Any, ttl: int = 3600) -> None
     Store value with TTL (default 1 hour)
   
   - async def get(self, key: str) -> Any | None
     Retrieve value, return None if not found
   
   - async def delete(self, key: str) -> None
     Remove key from cache
   
   - async def clear_pattern(self, pattern: str) -> None
     Delete all keys matching pattern (e.g., "project:123:*")
   
   - async def get_or_set(self, key: str, fetch_func: callable, ttl: int = 3600) -> Any
     Get from cache or fetch and cache

3. Decorator:
   - @cached(ttl=3600, key_prefix="ci")
     Decorator for caching function results
     Usage: @cached(ttl=3600) on service methods

4. Cache key conventions:
   - project:{project_id}:cis
   - project:{project_id}:ci:{ci_id}
   - project:{project_id}:awis
   - etc.

Use redis-py async support (redis.asyncio).
Include error handling (cache failures should not crash app).
Include cache statistics (hits, misses, size).
Add docstrings with examples.

---END PROMPT---

**Expected Output**: ~110 lines

---

## ✅ PROMPT 18: API Documentation & OpenAPI Schema
**Location**: `app/api/openapi_schema.py`

---START PROMPT---

Create custom OpenAPI schema with:

1. Override get_openapi_schema function to customize:
   - Title: "Nubirix API"
   - Version: "1.0.0"
   - Description: "Cloud migration planning and execution platform"
   
2. Add security scheme:
   - Type: http
   - Scheme: bearer
   - Bearer format: JWT
   
3. Add tags for API documentation:
   - "Configuration Items": CRUD operations on CIs
   - "AWIs": Application workload management
   - "Dependencies": Dependency mapping and analysis
   - "Migration Planning": Wave scheduling, MDG creation
   - "Data Quality": Quality metrics and validation
   - "Health": Health checks
   
4. Add example responses in schemas:
   - Success examples (200, 201)
   - Error examples (400, 404, 409, 500)
   
5. Add descriptions:
   - For each endpoint
   - For each parameter
   - For each response code

Use pydantic BaseModel with Field descriptions.
Use Swagger UI for interactive documentation.
Include response examples in docstrings.

---END PROMPT---

**Expected Output**: ~90 lines

---

## ✅ PROMPT 19: Error Handling & Custom Exceptions
**Location**: `app/utils/exceptions.py`

---START PROMPT---

Create custom exception classes:

1. Base exception: NubirixException(Exception)
   - message: str
   - code: str
   - status_code: int
   - details: Dict = None

2. Specific exceptions:
   - ResourceNotFound(NubirixException) - 404
   - ValidationError(NubirixException) - 400
   - DuplicateResource(NubirixException) - 409
   - UnauthorizedError(NubirixException) - 401
   - ForbiddenError(NubirixException) - 403
   - DatabaseError(NubirixException) - 500
   - ExternalServiceError(NubirixException) - 502

3. Exception handler in main.py:
   - Catch NubirixException
   - Return JSON response with error details
   - Log error with context
   - Don't expose internal details in 500 errors

4. Utility functions:
   - raise_not_found(resource: str, resource_id: str)
   - raise_validation_error(field: str, message: str)
   - raise_duplicate(resource: str, field: str)

Include proper error messages suitable for API responses.
Use logging for internal details.
Include request ID in errors for tracing.
Add comprehensive docstrings.

---END PROMPT---

**Expected Output**: ~90 lines

---

## ✅ PROMPT 20: Logging Configuration
**Location**: `app/utils/logging.py`

---START PROMPT---

Create structured logging configuration:

1. Setup logging in JSON format:
   - Include timestamp, level, message
   - Include context (request_id, user_id, resource_id)
   - Include performance metrics (duration, DB queries)

2. Create get_logger(name: str) -> logging.Logger:
   - Return configured logger
   - Add JSON formatter
   - Add console and file handlers (based on env)

3. Create logging middleware:
   - Log all HTTP requests
   - Log method, path, status_code, duration
   - Log errors with full context
   - Capture request/response bodies (in dev only)

4. Context variables for correlation:
   - request_id: UUID (generated or from header)
   - user_id: UUID (from JWT)
   - resource_type: str (ci, awi, wave, etc.)
   - resource_id: UUID

5. Log levels:
   - INFO: Normal operations
   - WARNING: Potential issues
   - ERROR: Failures that should be investigated
   - DEBUG: Detailed info for development

Use Python logging module with JSON formatter.
Use pythonjsonlogger or similar for JSON output.
Include performance tracking (slow queries > 1s).
Include exception logging with tracebacks.

---END PROMPT---

**Expected Output**: ~100 lines

---

## ✅ PROMPT 21: Database Seeding for Development
**Location**: `app/scripts/seed_db.py`

---START PROMPT---

Create database seeding script:

1. Script that populates dev database with sample data:
   - 1 project: "Cloud Migration Initiative"
   - 20 Configuration Items of various types (server, db, storage, network)
   - 5 AWIs grouping the CIs
   - 10 dependencies between AWIs
   - 3 migration waves
   - Various conflicts and gaps for testing

2. Functions:
   - create_sample_project() -> Project
   - create_sample_cis(project_id, count=20) -> List[CI]
   - create_sample_awis(project_id, cis, count=5) -> List[AWI]
   - create_sample_dependencies(awis, count=10) -> List[Dependency]
   - create_sample_waves(project_id, count=3) -> List[Wave]

3. Main function:
   - Check if data already exists (avoid duplicates)
   - Create all sample data
   - Print summary

4. Usage:
   ```
   python -m app.scripts.seed_db
   ```

Include realistic data reflecting actual migration projects.
Use proper UUIDs and relationships.
Include comments explaining sample data.
Make it idempotent (safe to run multiple times).

---END PROMPT---

**Expected Output**: ~120 lines

---

## 🎯 Quick Reference Summary

| # | File | Prompt | Time |
|---|------|--------|------|
| 1 | app/main.py | PROMPT 1 | 5-10 min |
| 2 | app/database.py | PROMPT 2 | 5-10 min |
| 3 | app/schemas/ci_schema.py | PROMPT 3 | 5-10 min |
| 4 | app/models/configuration_item.py | PROMPT 4 | 5-10 min |
| 5 | app/models/application_workload.py | PROMPT 7 | 5-10 min |
| 6 | app/services/ci_service.py | PROMPT 6 | 10-15 min |
| 7 | app/services/dependency_service.py | PROMPT 8 | 10-15 min |
| 8 | app/services/quality_service.py | PROMPT 9 | 10-15 min |
| 9 | app/services/planning_service.py | PROMPT 10 | 10-15 min |
| 10 | app/services/import_service.py | PROMPT 11 | 10-15 min |
| 11 | app/api/routers/configuration_items.py | PROMPT 5 | 10-15 min |
| 12 | tests/test_api.py | PROMPT 12 | 15-20 min |
| 13 | app/config.py | PROMPT 13 | 5-10 min |
| 14 | app/middleware/auth.py | PROMPT 14 | 10-15 min |
| 15 | docker-compose.yml | PROMPT 15 | 5 min |
| 16 | migrations/env.py | PROMPT 16 | 5-10 min |
| 17 | app/utils/cache.py | PROMPT 17 | 10-15 min |
| 18 | app/api/openapi_schema.py | PROMPT 18 | 10-15 min |
| 19 | app/utils/exceptions.py | PROMPT 19 | 10-15 min |
| 20 | app/utils/logging.py | PROMPT 20 | 10-15 min |
| 21 | app/scripts/seed_db.py | PROMPT 21 | 15-20 min |

**TOTAL TIME: 13-19 hours**

---

## 💡 Pro Tips for Maximum Efficiency

### Before You Start
- ✅ Have all 9 specification files open for reference
- ✅ Read through the Python Prototype Guide (PYTHON_PROTOTYPE_GUIDE.md)
- ✅ Set up PyCharm with Junie AI enabled
- ✅ Create project directory structure

### While Generating Code
- ✅ Accept first-pass code, don't nitpick
- ✅ Review for obvious errors only
- ✅ Keep git commits atomic (one per file)
- ✅ If code is 80% right, ask Junie to improve rather than regenerate

### Follow-Up Prompts
If generated code needs improvement, use these:
```
"Add comprehensive error handling to this function"
"Add validation for the following fields: [list]"
"Add logging statements to trace execution"
"Improve the algorithm for better performance"
"Add docstrings to all methods"
"Add pagination support to this query"
```

### Testing Your Generated Code
```bash
# After each 3-4 files, run:
pytest tests/test_api.py -v
flake8 app/
black app/ --check
```

---

## 📝 Using This File Effectively

**METHOD 1: Copy-Paste Prompts**
1. Find prompt section above
2. Copy entire prompt (START to END)
3. Paste into Junie chat
4. Accept generated code

**METHOD 2: Keep This File Open**
1. Open this file in split view with editor
2. Scroll to needed prompt
3. Copy-paste while working
4. Reference expected output to validate

**METHOD 3: Terminal Reference**
```bash
# Print specific prompt to terminal
cat JUNIE_PROMPTS.md | grep -A 30 "PROMPT 1:"
```

---

## ✨ What You'll Have After All 21 Prompts

✅ FastAPI backend with async support  
✅ PostgreSQL database with SQLAlchemy ORM  
✅ Complete CRUD operations for CI, AWI, dependencies  
✅ Business logic services (dependency analysis, quality scoring, planning)  
✅ File import service (Excel/CSV parsing)  
✅ Authentication & authorization middleware  
✅ Comprehensive pytest test suite  
✅ Redis caching layer  
✅ Structured logging (JSON format)  
✅ Custom error handling  
✅ Docker Compose for local development  
✅ Database migrations with Alembic  
✅ Interactive Swagger API docs  
✅ Development database seeding  

**Result**: A fully functional Python prototype of Nubirix in 13-19 hours

---

## 🚀 Next Steps After Completion

1. **Test locally** - Run all tests, verify APIs work
2. **Deploy to staging** - Use Docker to deploy somewhere
3. **Get feedback** - Show to stakeholders and team
4. **Iterate** - Use follow-up Junie prompts to improve
5. **Scale up** - Add more features, optimize performance
6. **Production** - Harden security, add monitoring, scale infrastructure

---

**Created**: December 21, 2025, 4:03 AM CET  
**For**: Nubirix Cloud Migration Platform  
**Version**: 1.0  
**Status**: Ready to Use

---

