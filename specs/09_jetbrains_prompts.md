# JetBrains AI Prompts for Nubirix SaaS Prototype Development

**Document ID**: PROMPTS-001  
**Date**: December 21, 2025  
**Status**: Ready for IDE Use  
**Version**: 1.0

---

## How to Use These Prompts

### In JetBrains IDE (IntelliJ IDEA, WebStorm, etc.)

1. **Open AI Assistant**:
   - IntelliJ IDEA: `Tools` → `AI Assistant` or `Ctrl+Shift+A`
   - WebStorm: `Tools` → `AI Assistant` or keyboard shortcut
   - Alternative: Use GitHub Copilot plugin if installed

2. **Copy-Paste Prompt**:
   - Select prompt below (entire block including context)
   - Paste into AI Assistant chat
   - Press Enter or "Send"

3. **Review & Iterate**:
   - AI generates code
   - Review for correctness
   - Ask follow-up questions if needed
   - Refine until satisfied

4. **Insert Generated Code**:
   - Copy from chat output
   - Paste into your IDE
   - Run tests to verify

---

## REACT FRONTEND COMPONENT PROMPTS

### Prompt 1: Interactive Dependency Graph Component

**Copy from here to "===" line:**

```
I need a React component that displays an interactive dependency graph for a cloud migration system. Here are the requirements:

Data structure:
- Nodes: Application workloads (AWIs) with properties: id, name, criticality (low/medium/high), moveMethod (like-for-like/rehost/refactor), ciCount
- Edges: Dependencies between AWIs with properties: source, target, type (hard/soft), label

Visualization requirements:
- Use D3.js for visualization
- Nodes: Size by criticality (larger = more critical), color by move method (blue=like-for-like, green=rehost, red=refactor)
- Edges: Thickness by dependency type (hard=thick, soft=thin), arrows showing direction
- Critical path: Highlight longest dependency chain in red/bold

Interactive features:
- Click node: Highlight selected node and all its dependencies (incoming and outgoing) in different colors
- Hover node: Show tooltip with name, criticality, move method, CI count
- Hover edge: Show dependency type
- Drag to pan, scroll to zoom
- Double-click node: Open detail panel (can be stub for now)
- "Fit to view" button: Auto-zoom to show all nodes
- "Highlight critical path" toggle button

Analysis features:
- Statistics panel showing: Total AWIs, Total dependencies, Critical path length
- Export as SVG button
- Legend explaining colors and sizes

Include sample data with 8 AWIs and 10 dependencies for testing. Make it responsive and performance-optimized for graphs up to 100 nodes.

Provide the full React component with hooks (useState, useEffect) and include D3.js library imports.
```

===

### Prompt 2: Gantt Chart for Migration Waves

**Copy from here to "===" line:**

```
Create a React Gantt chart component for migration waves. Requirements:

Data structure:
- Waves: Array with id, waveNumber, startDate, endDate, mdgs
- MDGs (Move Dependency Groups): id, name, awiCount, moveMethod, dependencies (list of other MDG IDs)

Visualization:
- X-axis: Timeline from project start to end, labeled in weeks
- Y-axis: Wave numbers (Wave 1, Wave 2, etc.)
- Bars for each MDG within its wave: Color by move method (blue=like-for-like, green=rehost, red=refactor), width by duration, tooltip on hover

Dependencies:
- Show arrows between MDGs indicating dependencies
- Highlight critical path in red
- Warn if dependencies aren't respected (MDG before its predecessor)

Features:
- Drag MDG bars to reschedule (updates wave assignment)
- "Compress timeline" button: Minimize gaps between waves
- "Add buffer" button: Add safety margin between waves
- "What if?" mode: Show impact of delaying selected MDG
- Resource utilization overlay (optional): Show if team is overbooked
- Export to PDF button

Include sample data with 3 waves and 8 MDGs with some dependencies. Make it responsive and performance-optimized.

Use a Gantt chart library like Frappe Gantt or Plotly, or build with D3.js. Provide full React component code.
```

===

### Prompt 3: Conflict Resolution Smart Suggester

**Copy from here to "===" line:**

```
Create a React component for smart conflict resolution in data normalization. Here's what I need:

Conflict data structure:
{
  conflictId: string,
  ciId: string,
  attribute: string,
  value1: { value: string, source: string, confidence: 'poor' | 'average' | 'good' | 'excellent' },
  value2: { value: string, source: string, confidence: 'poor' | 'average' | 'good' | 'excellent' }
}

Component features:
1. Display both conflicting values side-by-side
2. Show confidence level for each (color-coded: red=poor, yellow=average, green=good)
3. Show source file for each value
4. Display recommendation with reasoning (e.g., "Recommended: value1 (good confidence, more recent source)")
5. Action buttons: "Accept recommendation", "Choose alternative", "Mark for research"
6. Optional: Show confidence scores as percentage (0-100%)

UI design:
- Two columns: "Option A" vs "Option B"
- Highlight recommended option with subtle background color
- Show reasoning in plain English below recommendation
- Large "Accept" button (primary action)
- "Choose other" and "Research" buttons (secondary)

Track user decisions:
- Log if user accepted or rejected recommendation (for ML model training)
- Show feedback: "You accepted agent recommendation 87% of the time"

Include sample data with 3-4 conflict scenarios. Make it visually polished and easy to understand at a glance.

Provide full React component with TypeScript interfaces.
```

===

### Prompt 4: Configurable Dashboard Builder

**Copy from here to "===" line:**

```
Create a React dashboard builder component that lets customers build their own KPI dashboards. Requirements:

Data structure:
- Dashboard: id, name, widgets[], description
- Widget: id, type, metricId, title, position (x, y, width, height), configuration

Widget types:
- KPI Card: Single metric value with sparkline
- Bar Chart: Compare values across categories
- Line Chart: Trend over time
- Heatmap: 2D distribution
- Table: Data grid with sorting/filtering
- Metric Gauge: Dial showing progress toward goal

Available metrics (pre-defined):
- Total Cost, Cost by Wave, Cost by Move Method
- Project Progress %, Days Behind/Ahead Schedule
- Risk Score (0-10), Number of Unresolved Issues
- Resource Utilization %, Team Capacity
- Critical Path Length, Dependencies At Risk

Features:
1. Left sidebar: Available metrics (searchable) and widget types
2. Main canvas: Grid layout showing dashboard widgets
3. Drag-drop to add widgets to canvas
4. Drag to reorder widgets
5. Click widget: Configuration panel opens (change title, metric, date range, filters)
6. "Save dashboard" button (saves configuration)
7. "Load template" dropdown: Pre-built templates (Executive, Technical, Compliance, Finance)
8. "Export as PDF" button
9. "Share dashboard" button (generates shareable link)
10. Real-time data: Widgets update as data changes

UI:
- Clean, modern interface
- Widget borders on hover show resize handles
- "+" button inside empty spaces to add widget
- Responsive to screen size

Include sample data and 2-3 pre-configured dashboards. Provide full React component with drag-drop library (React Beautiful DnD or similar).
```

===

### Prompt 5: File Format Auto-Detection with Preview

**Copy from here to "===" line:**

```
Create a React component for intelligent file upload with auto-detection and preview. Requirements:

Features:
1. File upload input (accepts Excel .xlsx and CSV)
2. Auto-detection process:
   - Analyze file structure (worksheet names, columns, data types)
   - Detect column header row
   - Infer CI type from column names
   - Assign confidence score to detection (0-100%)
3. Preview display:
   - Show detected structure: "Worksheet: 'Servers', Columns: 'Name', 'OS', 'RAM', ..."
   - For each column: name, detected type, example values
   - Confidence badges ("95% confident")
4. User corrections:
   - Show "Auto-detected" vs "Correct these" sections
   - Allow user to:
     * Accept all detections
     * Override specific columns
     * Manually specify worksheet/header row
5. CI type suggestion:
   - Suggest CI type based on columns ("Detected as: Server")
   - Allow user to change

UI flow:
- File upload: "Drop file here or click to browse"
- Loading state: "Analyzing file structure..."
- Results: Show preview with confidence scores
- Action buttons: "Accept all", "Make corrections", "Manual mode"
- Optional: Show first 5 rows of data as preview

Include validation:
- Warn if no header row detected
- Alert if mixed data types in column
- Suggest missing attributes based on CI type

Provide full React component with progress indicators and error handling.
```

===

## JAVA/SPRING BACKEND SERVICE PROMPTS

### Prompt 6: Agentic MDG Optimizer Service

**Copy from here to "===" line:**

```
Create a Java/Spring Boot service that optimizes Move Dependency Group (MDG) creation using intelligent algorithms. Here's what I need:

Service: MDGOptimizerService

Input:
- List<AWI> awis (workloads with dependencies)
- Dependency graph (edges between AWIs)
- Constraints:
  * maxTeamCapacity: int (people)
  * maxDurationWeeks: int
  * moveMethodCompatibility: Map<MoveMethod, Set<MoveMethod>>

Output:
- List<MDGSuggestion> (multiple suggestions, each with):
  * List<MDG> mdgs (groupings)
  * Metrics: complexity score, estimated cost, duration, risk level
  * Rationale: "3 MDGs can complete in 12 weeks with moderate risk"
  * Alternative scenarios: "Aggressive (12 weeks, high risk)", "Conservative (20 weeks, low risk)"

Algorithm:
1. Build dependency graph from AWIs
2. Identify natural clusters using hierarchical clustering or modularity-based algorithm
3. For each cluster, create MDG grouping
4. Validate: respect dependencies, group similar move methods
5. Generate multiple scenarios (aggressive/moderate/conservative)
6. Score each based on: complexity, duration, cost, risk

API endpoint:
- POST /api/projects/{projectId}/mdg/optimize
- Request body: AWI list, dependencies, constraints
- Response: List of MDG suggestions with scores

Implementation details:
- Use async/Spring @Async for long-running optimization
- Return Job ID immediately, client polls for results
- Cache results (same input = same output)
- Include logging and metrics

Use graph algorithms library (JGraphT or similar). Provide service class with dependencies injection, REST endpoint, and error handling.
```

===

### Prompt 7: Conflict Detection & Auto-Resolution Engine

**Copy from here to "===" line:**

```
Create a Java service for intelligent conflict detection and resolution in data ingestion. Requirements:

Service: ConflictResolutionService

Methods:

1. detectConflicts(List<ConfigurationItem> existing, List<ConfigurationItem> imported) → List<Conflict>
   - Compare CIs by ID
   - Find attribute mismatches
   - Create Conflict objects with both values
   - Return list for user review

2. suggestResolution(Conflict conflict) → ConflictResolution
   - Analyze confidence levels
   - Score alternative resolutions
   - Return recommended winner with reasoning:
     * "Recommend value1 (good confidence, more recent)"
   - Return confidence score of recommendation (0-100%)

3. autoResolveByConfidence(List<Conflict> conflicts) → List<ConflictResolution>
   - For each conflict, auto-resolve using confidence levels
   - Only auto-resolve if recommended value has >80% confidence
   - Return unresolved conflicts for manual review

4. auditTrail(ConflictResolution resolution) → void
   - Log resolution with timestamp, user, reasoning
   - Enable rollback

Data model:
```
class Conflict {
  String conflictId;
  String ciId;
  String attribute;
  CIValue value1; // {value, source, confidence}
  CIValue value2;
  ConflictStatus status; // unresolved, auto_resolved, manual_resolved
}

class ConflictResolution {
  Conflict conflict;
  CIValue recommendedValue;
  double confidence; // 0-100
  String reasoning;
  List<CIValue> alternatives;
}
```

Scoring logic:
- Confidence-weighted: Higher confidence value wins
- If tied: Prefer more recent source
- Pattern-based: Known mappings (e.g., "windows 2019" → "Windows Server 2019")

Provide service with unit tests covering 5-10 conflict scenarios. Include REST endpoints for UI integration.
```

===

### Prompt 8: Runbook Generation Service

**Copy from here to "===" line:**

```
Create a Java service for intelligent runbook generation. Requirements:

Service: RunbookGenerationService

Method: generateRunbook(MigrationWave wave) → Runbook

Input context:
- Wave: waveNumber, startDate, duration
- MDGs: List of Move Dependency Groups
- AWIs: Application workloads with details
- Move methods: Specific approach for each AWI
- Dependencies: Execution order constraints
- Risk level: High/Medium/Low

Generation process:
1. Load template (FreeMarker or similar)
2. Build context for template:
   - Wave details
   - For each MDG:
     * Name, description, AWI count
     * Move method (determines step type)
     * Dependencies (mention blocking tasks)
     * Risk level (determines extra validation steps)
3. For each move method, add method-specific steps:
   - Like-for-like: Replicate config, validate connectivity
   - Rehost: Resize VMs, adjust resources, test performance
   - Refactor: Build new infrastructure, migrate/transform data
4. Add governance sections based on risk:
   - Low-risk: Standard approval gates
   - Medium-risk: Detailed testing required
   - High-risk: Multiple approvals, extra validation, rollback plan
5. Add dependencies note: "Dependent on Wave 1; cannot start until Wave 1 complete"
6. Generate success criteria based on move method
7. Generate rollback procedure (reverse of migration steps)

Output:
```
class Runbook {
  String runbookId;
  String waveId;
  String title; // "Wave 2: ERP System Migration"
  List<RunbookSection> sections;
  String successCriteria;
  String rollbackProcedure;
  ResourceRequirements resources;
}

class RunbookSection {
  String title;
  List<Step> steps;
  List<ApprovalGate> approvals;
  String description;
}
```

Features:
- Replace placeholders with actual values (AWI names, CI details, move methods)
- Include resource requirements (team size, duration, skills)
- Include contact/escalation info
- Format for PDF/HTML export

Use FreeMarker or Velocity for templating. Provide service, data models, and unit tests.
```

===

### Prompt 9: Analytics Query Builder Service

**Copy from here to "===" line:**

```
Create a Java service for flexible analytics and reporting with caching. Requirements:

Service: AnalyticsService

Methods:

1. executeAnalyticsQuery(QueryDefinition query) → AnalyticsResult
   - Supports: Filter, aggregate, group-by, order-by operations
   - Caching: Check Redis before executing query
   - If cached (TTL not expired): Return cached result
   - If not cached: Execute SQL query, cache result, return
   - Return: Result set + metadata (rows, columns, execution time)

2. getMetric(String metricName, Map<String, Object> filters) → MetricValue
   - Pre-defined metrics:
     * totalCost, costByWave, costByMoveMethod
     * projectProgress%, daysOffSchedule
     * riskScore, unresolved Issues
     * resourceUtilization%, teamCapacity
   - Build query for metric with filters
   - Use caching for performance

3. createDashboard(DashboardDefinition dashboard) → Dashboard
   - Save dashboard definition (SQL widgets, metric selections)
   - Enable sharing and versioning

4. refreshAnalytics(String projectId) → void
   - Invalidate cache for project
   - Rebuild materialized views if used
   - Optional: Run overnight batch job

Data structure:
```
class QueryDefinition {
  String name;
  String description;
  List<String> dimensions; // time, ci_type, move_method
  List<String> metrics; // cost, duration, count
  Map<String, Object> filters; // {wave_id: 1, move_method: 'rehost'}
  String groupBy;
  String orderBy;
}

class AnalyticsResult {
  List<String> columns;
  List<List<Object>> rows;
  Map<String, Object> metadata; // {totalRows: 1000, executionTime: 234}
}
```

Implementation:
- Spring Data JPA for data access
- JPA Query by Example or Specification for dynamic queries
- Redis for caching with TTL (default 1 hour)
- Materialized views for common reports (optional)

SQL schema (assume dimension/fact tables exist):
- Dimensions: dim_time, dim_ci_type, dim_move_method, dim_status
- Facts: fact_migrations, fact_costs, fact_risks

Provide service with unit tests, REST endpoints, and caching configuration.
```

===

## DATABASE & QUERY PROMPTS

### Prompt 10: Multi-Tenancy Schema Design

**Copy from here to "===" line:**

```
Design and implement a PostgreSQL schema for multi-tenant SaaS with row-level security. Requirements:

Schema design:
1. Add tenant_id UUID column to all existing tables (configuration_item, application_workload_instance, dependency, etc.)
2. Create RLS (Row Level Security) policies that:
   - Filter queries to only show current tenant's data
   - Prevent cross-tenant data access
   - Apply to all SELECT, UPDATE, DELETE operations
3. Create tenant isolation:
   - tenant_id in all primary and foreign keys where appropriate
   - Unique constraints include tenant_id: UNIQUE(tenant_id, ci_name)

PostgreSQL RLS policy example:
```
CREATE POLICY tenant_isolation ON configuration_item
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

ALTER TABLE configuration_item ENABLE ROW LEVEL SECURITY;
```

4. Per-tenant data dictionary:
   - data_dictionary_entry table already exists
   - Add tenant_id column
   - Each tenant has own canonical values for OS, database types, etc.

5. Create helper functions:
   - set_current_tenant(tenant_uuid) - called at session start
   - get_current_tenant() - returns current tenant ID

Implementation:
- Migration script (alter existing tables)
- RLS policy creation for all tables
- Helper function creation
- Test queries to verify isolation

Provide:
1. Migration SQL script
2. RLS policy definitions for all tables
3. Helper function definitions
4. Test cases showing isolation works
5. Performance impact analysis (indexes with tenant_id prefix)
```

===

### Prompt 11: Analytics Data Mart

**Copy from here to "===" line:**

```
Create a PostgreSQL data mart schema for analytics and reporting. Requirements:

Dimension tables:
1. dim_time (time dimension for date-based analytics)
   - date_id (PK), date, week, month, quarter, year
   
2. dim_ci_type
   - ci_type_id (PK), ci_type_name, category, description

3. dim_move_method
   - move_method_id (PK), method_name, description

4. dim_status
   - status_id (PK), status_name, category (completed/in_progress/blocked/etc)

5. dim_project
   - project_id (PK), project_name, customer_id, creation_date

Fact tables:
1. fact_migrations
   - migration_id (PK), project_id, wave_id, mdg_id, awi_id
   - start_date_id, end_date_id, actual_end_date_id
   - ci_type_id, move_method_id, status_id
   - duration_days, days_behind_schedule

2. fact_costs
   - cost_id (PK), project_id, wave_id, mdg_id
   - cost_date_id
   - infrastructure_cost, labor_cost, tool_cost, contingency_cost
   - cost_vs_budget (delta)

3. fact_risks
   - risk_id (PK), project_id, wave_id, mdg_id, awi_id
   - risk_date_id
   - risk_type (technical/schedule/resource/etc)
   - risk_score (0-10), mitigation_status

Materialized views (for performance):
1. mv_cost_by_wave
   - project_id, wave_id, total_cost, cost_per_awi
   - Refresh nightly
   
2. mv_progress_by_wave
   - project_id, wave_id, completed_awis, total_awis, progress_%
   - Refresh hourly

3. mv_risk_dashboard
   - project_id, high_risk_count, medium_risk_count, total_risk_score

Migration process:
- Load data from operational tables
- Run nightly ETL to populate fact/dimension tables
- Ensure fact tables include tenant_id for multi-tenancy

Provide:
1. Complete DDL for dimension and fact tables
2. Materialized view definitions
3. ETL/transformation logic (SQL)
4. Common queries using the data mart
5. Performance indexes (star schema optimized)
6. Refresh schedule definition
```

===

## VISUALIZATION PROMPTS

### Prompt 12: D3.js Dependency Graph

**Copy from here to "===" line:**

```
Create a reusable D3.js component for interactive dependency graphs. Provide:

1. Standalone HTML file that can load JSON data and render graph
2. Features:
   - Nodes: Size by criticality, color by move method
   - Edges: Thickness by dependency type, arrows for direction
   - Interactive: Click to highlight, hover for tooltip, drag to pan, scroll to zoom
   - Critical path: Highlight longest chain in red
   - Statistics: Show node count, edge count, critical path length
   - Legend: Explain colors and sizing
   - Export: Download as SVG

3. Sample JSON data:
   ```json
   {
     "nodes": [
       {"id": "awi-1", "name": "ERP System", "criticality": "high", "moveMethod": "rehost", "ciCount": 5},
       {"id": "awi-2", "name": "Database Cluster", "criticality": "high", "moveMethod": "like-for-like", "ciCount": 3}
     ],
     "links": [
       {"source": "awi-1", "target": "awi-2", "type": "hard"},
       {"source": "awi-2", "target": "awi-3", "type": "soft"}
     ]
   }
   ```

4. D3.js implementation:
   - Force simulation for node layout
   - Zoom/pan behavior
   - Highlight on click (show 1-hop neighbors)
   - Tooltip on hover
   - Critical path algorithm (DFS to find longest path)
   - Color scale for move methods
   - Size scale for criticality

5. Styling:
   - Modern, clean design
   - High contrast colors
   - Responsive SVG
   - Legend and statistics panel

Provide complete standalone HTML file with embedded D3.js that can render the sample data. Include documentation on how to integrate with web application.
```

===

### Prompt 13: Gantt Chart with Dependencies

**Copy from here to "===" line:**

```
Create a reusable Gantt chart component using Plotly or Frappe Gantt. Provide:

1. Sample HTML file showing migration waves as Gantt chart
2. Data structure:
   ```json
   {
     "waves": [
       {"id": "w1", "waveNumber": 1, "startDate": "2025-01-15", "endDate": "2025-02-15"},
       {"id": "w2", "waveNumber": 2, "startDate": "2025-02-16", "endDate": "2025-03-15"}
     ],
     "mdgs": [
       {"id": "mdg-1", "name": "ERP System", "waveId": "w1", "startDate": "2025-01-15", "endDate": "2025-02-05", "moveMethod": "rehost", "dependencies": []},
       {"id": "mdg-2", "name": "Database", "waveId": "w1", "startDate": "2025-02-01", "endDate": "2025-02-15", "moveMethod": "like-for-like", "dependencies": ["mdg-1"]}
     ]
   }
   ```

3. Features:
   - Bars for each MDG within wave
   - Color by move method (blue/green/red)
   - Dependencies shown as connecting lines/arrows
   - Critical path highlighted
   - Hover tooltip: MDG name, dates, dependencies
   - Drag to reschedule (update dates)
   - Resource utilization overlay (optional)
   - Export to PDF

4. Dependency validation:
   - Warn if MDG starts before its dependencies end
   - Highlight violations in red

5. Styling:
   - Professional, readable
   - Responsive to screen size
   - Print-friendly

Provide using either:
- Frappe Gantt (simple, good for SaaS)
- Plotly (JavaScript, flexible)
- D3.js (most control, most complex)

Include sample data and full HTML file that renders the chart.
```

===

## COMPARISON & DIFFERENCE HIGHLIGHTING PROMPTS

### Prompt 14: Current vs Enhanced UI Comparison - Prepare Phase

**Copy from here to "===" line:**

```
Create a side-by-side comparison visualization showing Prepare phase current vs enhanced UI. Show:

LEFT SIDE (Current):
- "Manual File Upload"
- User specifies: "Worksheet name: 'Servers', Header row: 3"
- Table grid showing raw data with columns: Name, OS, RAM
- Manual buttons: "Add mapping", "Resolve conflict"
- Conflicts table showing: SRV-001 has "Windows 2019" vs "Windows Server 2019"
- User manually selects which value to keep
- Basic text report: "45 CIs loaded, 5 conflicts, 10 gaps"

RIGHT SIDE (Enhanced):
- "Smart File Upload"
- System shows: "File analyzed: Worksheet 'Servers', 50 rows, auto-detected 5 columns (95% confidence)"
- Same table but with:
  * Confidence badges on columns ("95% confident: Server")
  * Auto-highlighted mappings ("windows 2019" → "Windows Server 2019" highlighted)
  * Conflict with suggestion: "Recommended: Windows Server 2019 (good confidence, recent source)"
- Beautiful data quality dashboard:
  * Confidence gauge (78% ready)
  * Heatmap of data quality by CI type
  * Gap analysis chart

METRICS:
- Time savings: 15 min → 2 min (87% faster)
- Error reduction: 3 manual errors → 0 (100% reduction)
- Conflicts resolved: 2 min each → 10 seconds each (92% faster)

Include visual mockups or screenshots showing layout differences. Highlight which features are automated (green) vs manual (red).
```

===

### Prompt 15: Current vs Enhanced - Map Phase

**Copy from here to "===" line:**

```
Create side-by-side comparison of Map phase current vs enhanced. Show:

LEFT SIDE (Current):
- "Relationships - Table View"
- Two tables:
  1. AWI table: columns AWI ID, Name, CI Count, Status
  2. Dependency table: columns Source AWI, Target AWI, Type, Status
- User views tables, hard to see complex relationships
- Manual AWI creation form (add CIs one by one)
- Dependency creation requires understanding whole system
- Quality metrics: "Incomplete - 10 unverified dependencies"

RIGHT SIDE (Enhanced):
- "Interactive Dependency Graph" + Table view
- Beautiful D3.js graph showing:
  * 25 AWIs as nodes (colored by move method, sized by criticality)
  * 30 dependencies as arrows
  * Critical path highlighted in red (8-step chain)
  * Orphaned AWIs flagged with warning icon
- Click on node: Highlights dependencies (incoming/outgoing)
- Agent suggestion panel: "Found 5 natural clusters. Create 'ERP System' AWI? [Accept] [Alternative]"
- Quality metrics: "Excellent - 100% coverage, 85% verified dependencies"
- Can switch between graph and table views

IMPROVEMENTS:
- Visualization: Tables → Interactive graph (much faster understanding)
- AWI creation: Manual → Agentic suggestions (70-80% automated)
- Quality: Hard to assess → Clear metrics and risk indicators
- Understanding: 30 min to grasp → 5 min at a glance

Include visual mockups showing the dramatic difference between table and graph views. Highlight how agent suggestions accelerate AWI creation.
```

===

## TIPS FOR USING JETBRAINS AI ASSISTANT

### Best Practices

1. **Be Specific**:
   - Don't: "Create a component"
   - Do: "Create a React component with D3.js that displays an interactive graph with..."

2. **Provide Context**:
   - Include data structures and example data
   - Mention frameworks and libraries to use
   - Specify requirements and constraints

3. **Iterate**:
   - First response generates code
   - Ask follow-up: "Add error handling", "Make it responsive", "Add unit tests"
   - Refine until satisfied

4. **Review Generated Code**:
   - Check for logic correctness
   - Verify it matches your coding standards
   - Test before integrating

5. **Use for Scaffolding**:
   - AI generates boilerplate code
   - You fill in business logic
   - Much faster than starting from scratch

6. **Document Patterns**:
   - Save working prompts
   - Build library of tested prompts
   - Reuse and refine for similar tasks

---

## SUCCESS METRICS FOR PROMPTS

When using these prompts, measure:

1. **Productivity**:
   - Time to working feature (with AI assistance)
   - Compare to traditional development
   - Target: 70-80% time savings for CRUD/boilerplate

2. **Quality**:
   - Code review feedback (number of issues)
   - Test coverage achieved
   - Bug rate post-launch

3. **Learning**:
   - How well generated code aligns with your patterns
   - How many iterations needed before acceptance
   - Team feedback on code quality

---

## TROUBLESHOOTING

**Problem**: AI generates incomplete or incorrect code
**Solution**: Be more specific in prompt, provide more context, ask AI to add validation

**Problem**: Generated code doesn't follow your patterns
**Solution**: Ask AI to "Follow this pattern..." and provide example

**Problem**: AI suggests libraries you don't want to use
**Solution**: Specify libraries in prompt: "Use React Beautiful DnD for drag-drop, not React DnD"

**Problem**: Code is hard to understand
**Solution**: Ask AI to "Add comments explaining the logic" and "Use descriptive variable names"

---

## NEXT STEPS

1. Copy prompt relevant to task you're working on
2. Paste into JetBrains AI Assistant
3. Review generated code
4. Iterate with follow-up prompts
5. Test and integrate
6. Document patterns for reuse

---

**Created**: December 21, 2025  
**Status**: Ready to use in JetBrains IDE  
**Updated**: As new components and services are developed

