# Nubirix - Functional Specification (Proposed SaaS Evolution)

**Document ID**: FS-SAA-001  
**Date**: December 21, 2025  
**Status**: Proposed SaaS Evolution  
**Version**: 1.0

---

## Executive Summary

This document describes the enhanced functional capabilities for the SaaS evolution of Nubirix. The evolution focuses on automation through agentic features, visual enhancements for intuitive understanding, real-time collaboration, and multi-tenant capabilities that enable customer self-service and reduce consulting dependencies.

---

## Phase 1: Prepare - Enhanced Capabilities

### Current State (Recap)
- Manual file upload with fixed structure specification
- Table-based data grid view
- Manual conflict resolution
- Confidence-based conflict arbitration
- Basic data quality reporting

### Enhancement 1.1: Auto-Detection of File Structure

**Problem Solved**: Users currently must manually specify worksheet names, column headers, and data types - time-consuming and error-prone.

**Solution**: Intelligent file analysis engine detects structure automatically

**How It Works**:
1. User uploads Excel/CSV file
2. System analyzes file automatically:
   - Identifies worksheet names and content
   - Detects column header row (heuristic: looks for non-numeric values, distinct from data)
   - Infers data types (string, integer, date, enumeration)
   - Detects CI type from column names
3. Shows detected structure in preview UI with confidence scores
4. User can correct auto-detection if needed
5. System learns from corrections to improve future detection

**UI Changes**:
- File upload shows "Analyzing..." progress
- Preview displays detected structure with "Confidence: 95%" badges
- "Auto-detected columns" vs "Manual corrections" sections
- "Accept all", "Correct these", or "Manual override" options

**Benefits**:
- Time savings: 5-10 minutes per file → 30 seconds
- Error reduction: Fewer manual entry mistakes
- Better UX: Feels intelligent and responsive

---

### Enhancement 1.2: Agentic Data Mapping

**Problem Solved**: Manual normalization against data dictionary is repetitive; consultant must lookup mappings for ambiguous values.

**Solution**: Intelligent mapping agent suggests normalization

**How It Works**:
1. System analyzes ingested values against data dictionary
2. For exact matches: Auto-map without confirmation
3. For close matches: Agent suggests mapping with confidence score
   - Fuzzy matching (e.g., "windows 2019" → "Windows Server 2019")
   - Contextual hints ("OS" column suggests OS values)
   - Similarity scoring (edit distance, semantic similarity)
4. User reviews suggestions: Accept all, Accept some, Manual override
5. Learns from user corrections for future mappings

**Agent Logic Example**:
```
Input: "windows 2019" in "OS" column
Candidate mappings:
  1. "Windows Server 2019" (92% confidence) - Exact match
  2. "Windows Server 2016" (45% confidence) - Similar year
Suggestion: Accept #1 with 92% confidence
User action: Accept
Result: Mapping learned, applied to all similar values
```

**Benefits**:
- 90% of mappings require zero user intervention
- Consistency: Same values mapped uniformly
- Learning: Agent improves over time

---

### Enhancement 1.3: Smart Conflict Resolution UI

**Problem Solved**: Conflict resolution currently requires manual selection between conflicting values.

**Solution**: Agentic suggestion with confidence-based reasoning

**UI Flow**:
1. Conflict detected: "SRV-001" has OS="Windows Server 2019" (source: Inventory A, confidence: good) vs OS="Windows Server 2016" (source: Inventory B, confidence: poor)
2. Agent analyzes and suggests:
   - Recommended winner: "Windows Server 2019" (good confidence, recent source)
   - Reasoning: "Good confidence from primary source, Inventory A"
   - Alternative: "Windows Server 2016" (poor confidence)
3. User can:
   - Accept recommendation (one-click)
   - Select alternative
   - Merge/research (mark for investigation)

**Display**:
- Side-by-side comparison with confidence color-coding (red=poor, yellow=average, green=good)
- Reasoning explanation in plain language
- "Accept" button highlights recommended option
- "Why?" link explains the logic

**Benefits**:
- 80-90% of conflicts resolved with single click
- Explainable AI: Users understand recommendations
- Quality assurance: Confidence-based decisions are auditable

---

### Enhancement 1.4: Visual Data Quality Dashboard

**Problem Solved**: Data quality is hidden in tables; hard to assess overall readiness.

**Solution**: Rich visual representations of data quality

**Dashboard Elements**:
1. **Quality Meter** (large)
   - Overall data readiness: "78% ready for Map phase"
   - Breakdo wn by quality dimension (completeness, accuracy, consistency)
   - Trend over time (improving as conflicts resolve)

2. **Confidence Heatmap**
   - Each CI type as row
   - Confidence level as color (red→yellow→green)
   - Shows which data is most/least reliable
   - Interactive: Click row to see details

3. **Gap Analysis**
   - "Missing attributes by CI type" bar chart
   - Shows which attributes are most commonly missing
   - Suggests highest-impact areas to fix

4. **Conflict Summary**
   - Number of unresolved conflicts (prominent alert if >0)
   - Types of conflicts (OS, RAM, database version, etc.)
   - Resolution progress indicator

5. **Data Lineage**
   - Where did this data come from? (Source file, date, etc.)
   - Which records were normalized/conflict-resolved
   - Audit trail of changes

**Benefits**:
- Visibility: Consultant can see quality at a glance
- Proactive: Flag quality issues early
- Professional: Charts and metrics look polished

---

## Phase 2: Map - Enhanced Capabilities

### Enhancement 2.1: Interactive Dependency Graph

**Problem Solved**: Table-based dependency list is hard to understand; complex relationships unclear.

**Solution**: Interactive visual graph with D3.js

**Visualization**:
- **Nodes**: AWIs (sized by criticality, colored by move method)
  - Small node = low criticality
  - Large node = critical
  - Blue = like-for-like, Green = rehost, Red = refactor
- **Edges**: Dependencies (arrows show direction)
  - Thick edge = hard dependency
  - Thin edge = soft dependency
  - Labels on hover: dependency type
- **Interactions**:
  - Click node: Highlight it and all its dependencies (in/out)
  - Hover node: Show tooltip with AWI details (name, CI count, criticality)
  - Drag to pan, scroll to zoom
  - Double-click node to view details
  - Color by attribute (move method, criticality, etc.)

**Analysis Features**:
- Critical path highlighted in red (longest dependency chain)
- Orphaned AWIs (no dependencies) shown separately
- Statistics panel: "35 AWIs, 47 dependencies, critical path: 8 steps"
- Export as image or SVG for presentations

**Benefits**:
- Immediate understanding of complexity
- Easy to communicate strategy to stakeholders
- Find dependencies and bottlenecks visually

---

### Enhancement 2.2: Agentic AWI Detection

**Problem Solved**: Manual AWI creation requires expertise in grouping related CIs; time-consuming to define logical workloads.

**Solution**: Intelligent agent suggests workload groupings

**How It Works**:
1. Agent analyzes dependency graph and CI attributes
2. Identifies natural clusters of interdependent CIs
3. Suggests AWI groupings with confidence scores
4. For each suggestion, explains rationale:
   - "These CIs are tightly coupled (3 inter-dependencies)"
   - "They share common infrastructure (same data centre)"
   - "They have same move method and criticality"

5. User can:
   - Accept suggestions (creates AWI)
   - Reject and ask for alternatives
   - Merge suggestions together
   - Manually adjust composition

**Example**:
```
Agent: "Found 5 natural workload clusters"
Cluster 1 (Confidence: 85%): ERP Application Servers (3 CIs)
  - Tightly coupled (all 3 depend on each other)
  - Shared database dependency
  - Same criticality (high)
  - Suggestion: Create "ERP System" AWI
  [Accept] [Alternative] [Adjust]
```

**Benefits**:
- 70-80% of AWIs created automatically
- Suggestions educate user on dependencies
- Faster mapping phase completion

---

### Enhancement 2.3: Dependency Validation & Quality Metrics

**Problem Solved**: Incomplete dependency mapping leads to sequencing errors and failed migrations.

**Solution**: Agentic validation and quality scoring

**Validation Checks**:
1. **Completeness**: Are all known dependencies captured?
   - Agent analyzes CI attributes to find likely dependencies
   - Flags potential missing dependencies
   - Suggests discovery sources (documentation, network analysis)

2. **Consistency**: Are dependencies logically consistent?
   - Checks for unusual patterns (e.g., A→B, B→A creates cycle)
   - Flags "soft" dependencies that might be "hard"
   - Validates against industry patterns

3. **Validation Status**:
   - Unverified: Found but not confirmed
   - Verified: SME confirmed
   - False: Confirmed as not a real dependency

**Quality Dashboard**:
- Dependency coverage: "45/50 known dependencies identified (90%)"
- Verification status: "30 verified, 15 unverified"
- Risk assessment: "Low risk: 90%+ coverage and verification"
- Confidence score per dependency

**Benefits**:
- Catch missing dependencies before planning
- Reduce sequencing errors in Move phase
- Provide confidence in migration strategy

---

## Phase 3: Plan - Enhanced Capabilities

### Enhancement 3.1: Agentic MDG Optimization

**Problem Solved**: Manual MDG grouping is complex; consultant must balance dependencies, move methods, resources, timeline.

**Solution**: Intelligent agent suggests optimal groupings

**How It Works**:
1. Agent takes as input:
   - AWI list with dependencies
   - Move method for each AWI
   - Resource constraints (team capacity: 5 people)
   - Timeline constraint (complete in 12 weeks)
2. Agent runs optimization algorithm:
   - Minimize cross-group dependencies (high cohesion)
   - Group AWIs with same move method together
   - Balance group sizes (avoid huge groups)
   - Respect dependencies (provider before consumer)
3. Returns N suggestions (e.g., 3 alternatives):
   - "Aggressive": 3 MDGs, 12 weeks, higher risk
   - "Moderate": 5 MDGs, 16 weeks, medium risk
   - "Conservative": 7 MDGs, 20 weeks, low risk

**For Each MDG**:
- Composition (AWI list)
- Rationale (why grouped together)
- Dependencies on other MDGs
- Estimated complexity and risk

**Benefits**:
- Removes manual optimization effort
- Explores multiple scenarios (what-if)
- Data-driven decisions with clear trade-offs

---

### Enhancement 3.2: Visual Migration Timeline (Gantt Chart)

**Problem Solved**: Wave schedule is hard to visualize; dependencies between waves unclear.

**Solution**: Interactive Gantt chart with dependencies

**Visualization**:
- **X-axis**: Timeline (weeks/months)
- **Y-axis**: Migration waves (Wave 1, Wave 2, etc.)
- **Bars**: MDGs scheduled in waves
  - Color by move method
  - Length by estimated duration
  - Height shows number of AWIs
  - Tooltip shows MDG name, AWI count, dependencies

**Features**:
- Drag to reschedule MDGs (updates downstream dependencies)
- Critical path highlighted in red
- "At-risk" waves (on critical path) warned with icon
- Resource utilization overlay (shows if team is overbooked)
- What-if mode: "What if this wave completes 2 weeks late?"

**Interactions**:
- Click MDG to see details and assumptions
- Hover wave to show resource utilization
- "Compress" button: Minimize overlaps, show earliest schedule
- "Expand" button: Add buffer time for safety
- Export as PDF or image for stakeholder presentations

**Benefits**:
- Stakeholders immediately understand timeline
- Identify risk points (dependencies, critical path)
- Easy to adjust and compare scenarios
- Professional-looking charts for presentations

---

### Enhancement 3.3: Risk & Cost Estimation

**Problem Solved**: Estimates are rough; no visibility into what drives cost and risk.

**Solution**: Detailed estimation with agentic reasoning

**Cost Estimation**:
- Per-MDG breakdown:
  - Migration infrastructure costs (VMs, storage, bandwidth)
  - Labor costs (team size × duration × rate)
  - Tool costs (licenses, services)
  - Testing and validation costs
- Total project cost with confidence interval
- Cost by dimension (visible in chart)

**Risk Scoring** (0-10 scale):
- Technical risk: Depends on move method, CI complexity
  - Refactor = higher risk than rehost
  - Complex dependencies = higher risk
- Schedule risk: Depends on duration, dependencies, team capacity
- Resource risk: Team skills and availability
- Overall risk = weighted average

**Agent Reasoning Example**:
```
MDG "Database Cluster" (Confidence: 75%)
Cost Estimate: $150K-180K
  - Infrastructure: $50K (VM, storage, network)
  - Labor: $80K (team of 2, 8 weeks)
  - Testing: $20K (validation, rollback prep)
  - Contingency: 15% for unknowns

Risk Assessment: 7/10 (Moderate-High)
  - Technical risk: 8/10 (Refactor required, high complexity)
  - Schedule risk: 5/10 (8-week duration, dependent tasks)
  - Resource risk: 6/10 (Need specialized DB admin)
Mitigation: Plan extra testing, hire experienced DBA
```

**Benefits**:
- Data-driven cost estimates
- Transparency: Understand what drives costs
- Risk management: Identify mitigation needs
- Negotiation: Show detailed basis for project scope

---

## Phase 4: Move - Enhanced Capabilities

### Enhancement 4.1: Agentic Runbook Generation

**Problem Solved**: Generic runbook templates don't fit specific wave/MDG needs; heavy manual customization required.

**Solution**: Intelligent runbook generation with context awareness

**How It Works**:
1. Agent generates runbook from template + context:
   - Template sections (pre-migration, execution, validation, rollback)
   - Wave/MDG specifics (workload names, CI details, dependencies)
   - Move method (different steps for like-for-like vs refactor)
   - Risk level (more validation for high-risk)
   - Dependency order (mention dependent tasks)

2. Customization by move method:
   - **Like-for-like**: Replicate config, test connectivity, cutover
   - **Rehost**: Resize VMs, adjust network, test performance
   - **Refactor**: Build new infrastructure, migrate/transform data, test functionality

3. Risk-aware steps:
   - High-risk: Add extra testing, approval gates, rollback checks
   - Medium-risk: Standard validation
   - Low-risk: Streamlined steps

4. **Generated Runbook Includes**:
   - Step-by-step procedures (technical)
   - Approval workflows (governance)
   - Resource requirements (team roles, duration)
   - Success criteria (how to know it's working)
   - Rollback procedure (step-by-step reverse)
   - Contact and escalation info

**Example Generated Section**:
```
Wave 2, MDG "ERP System" (Rehost, High-Risk)

PRE-MIGRATION VALIDATION (Day 1)
1. Verify all source systems accessible
2. Backup ERP database (use existing backup solution)
3. Verify network connectivity to Azure (test all protocols needed)
4. Verify team readiness (all members trained, equipment configured)

MIGRATION EXECUTION (Days 2-3)
1. Resize VM templates to match Azure VM types
2. Create Azure VMs (4x application servers, size D4s_v3)
3. Configure networking (vNets, NSGs, ExpressRoute)
4. Restore ERP database from backup
5. Validate connectivity and data integrity
6. Performance test (run standard load test)

SUCCESS CRITERIA
- All VMs running and responding
- Database restored and queries working
- Network latency <50ms
- Load test completes successfully
- No data loss or corruption

APPROVAL GATE: Ready for cutover? [Approved by CIO]
```

**Benefits**:
- 80-90% of runbook generated automatically
- Context-aware and move-method-specific
- Compliance and governance integrated
- Less manual editing required

---

### Enhancement 4.2: Dynamic Runbook Adjustment

**Problem Solved**: Runbooks are static; if migration deviates from plan, runbook becomes outdated.

**Solution**: Agent monitors execution and suggests adjustments

**How It Works** (if execution capability added):
1. During migration, agent monitors:
   - Actual vs planned duration per step
   - Issues encountered (database slow, network latency)
   - Team capacity and availability
2. If deviations detected:
   - Alert: "This step is taking 30% longer than planned"
   - Suggestion: "Consider running validation in parallel"
   - Adjustment: "Recommend shifting cutover to next day"
3. User can:
   - Accept suggestion (modifies runbook and timeline)
   - Override (mark as expected)
   - Investigate (flag for manual analysis)

**Benefits**:
- Responsive to real-world conditions
- Reduces cascading delays
- Maintains schedule integrity

---

## Phase 5: Evaluate - Enhanced Capabilities

### Enhancement 5.1: Native Analytics & BI Platform

**Problem Solved**: Reporting fragmented between Nubirix (basic reports) and Metabase (advanced analytics); customers need BI tool training.

**Solution**: Integrated analytics and dashboard builder in Nubirix

**Analytics Engine**:
- SQL query builder (visual + text modes)
- Common metrics pre-built (cost, timeline, risk, progress)
- Dimension tables: Time, CI type, move method, criticality, status
- Fact tables: Migrations, costs, risks, completions
- Real-time data (no ETL lag)

**Dashboard Builder**:
- Drag-drop widgets (charts, tables, metrics)
- Widget types: KPI card, bar chart, line chart, heatmap, table
- Pre-built templates:
  - Executive dashboard (high-level metrics)
  - Technical dashboard (detailed metrics)
  - Compliance dashboard (audit and compliance metrics)
  - Finance dashboard (cost analysis)
  - Project dashboard (progress and timeline)
- Save and share dashboards
- Schedule email reports (daily, weekly, monthly)

**Customization**:
- Custom metrics (define new KPIs via SQL)
- Custom dimensions (add organization-specific attributes)
- White-label (customer branding)
- Embedded dashboards (in customer portals)

**Benefits**:
- No need for separate BI tool
- Lower total cost of ownership
- Faster time-to-insight
- Customer self-service (less support burden)

---

### Enhancement 5.2: Agentic Insight Generation

**Problem Solved**: Raw data doesn't tell story; customers must manually analyze data to extract insights.

**Solution**: Intelligent agent generates insights from data

**How It Works**:
1. Agent queries data and looks for:
   - Anomalies (costs 2x expected, timeline behind schedule)
   - Trends (daily progress rate, cost burn rate)
   - Risks (dependencies at risk, resource bottlenecks)
   - Recommendations (based on similar migrations)

2. Generates English-language insights:
   - "Wave 2 is 3 days behind schedule. Recommend accelerating Wave 3 or adding resources."
   - "Cost per AWI is 15% higher than typical. Investigate high labor costs."
   - "Database migration is on critical path. Any delay will delay entire project."

3. Displays in "Insights" section:
   - Key findings (highlighted in color by severity)
   - Supporting data (chart or table)
   - Recommended action
   - Confidence level

**Example Insights**:
```
🔴 CRITICAL: Schedule Risk
Wave 2 is 5 days behind plan (15% delay)
Current pace: 2 AWIs/week, need 3 AWIs/week to stay on track
Recommendation: Reduce scope of Wave 3 or add resources
Impact: If not corrected, project will be 2-3 weeks late

🟡 WARNING: Cost Overrun
Current costs are $180K vs budget $150K (20% over)
Primary drivers: Unexpected refactor complexity (8% impact), extended testing (12% impact)
Recommendation: Review and adjust remaining phases; consider accelerating timeline
Confidence: 85%

🟢 INFO: Trend - Velocity Improving
Daily AWI completion rate improving: Week 1: 0.4 AWIs/day → Week 3: 0.7 AWIs/day
Projection: At current velocity, project will complete on-time
```

**Benefits**:
- Automated insight generation (no manual analysis needed)
- Early warning system (catch problems before they escalate)
- Actionable recommendations
- Reduces cognitive load on consultants

---

### Enhancement 5.3: Predictive Analytics

**Problem Solved**: Cannot forecast project completion, costs, or risks.

**Solution**: ML models predict outcomes based on current progress

**Predictions**:
1. **Completion Date** (with confidence interval)
   - Based on current velocity and remaining work
   - Example: "Project will complete June 15 ±3 days (85% confidence)"
   - Accounts for dependencies and resource constraints

2. **Final Cost** (with range)
   - Based on burn rate and remaining scope
   - Example: "Final cost will be $185K-$210K (75% confidence)"
   - Sensitivity analysis: "If refactors exceed 30%, cost could reach $250K"

3. **Risk Escalation Probability**
   - Based on pattern matching with similar migrations
   - Example: "15% probability of critical issue (vs 5% average)"
   - Risk factors: High refactor %, long dependencies, resource constraints

4. **AWI Completion Probability**
   - For each remaining AWI, predict probability of on-time completion
   - Identify high-risk AWIs early

**Benefits**:
- Stakeholder confidence: Credible forecasts
- Proactive management: Adjust timeline before too late
- Data-driven: Based on actual project data, not guesses

---

## Multi-Tenancy & Customization

### Per-Customer Configuration

**Data Dictionary**:
- Each customer has own canonical values
- Example: Customer A uses "Windows Server 2019", Customer B uses "WinSrv2019"
- No interference between customers

**Custom Fields**:
- Add custom attributes to CIs (e.g., "Application Owner", "Business Unit")
- Add custom dimensions to reporting

**Custom Move Methods**:
- Define organization-specific migration approaches
- Example: "Refactor to Kubernetes" or "Move to Azure Stack"

**Custom Runbook Templates**:
- Organization-specific procedures
- Compliance and approval workflow templates
- Custom success criteria

**Branding**:
- Logo, colors, terminology
- White-label reports and dashboards

---

## Real-Time Collaboration

### Current State
- Batch operations, no real-time visibility

### Enhancement
- Real-time updates: See changes from other users immediately
- Live cursors: See where other team members are working
- Comments & annotations: Add notes to AWIs, MDGs, waves
- Approval workflows: Request and grant approval in-app
- Notifications: Alert users to important changes or decisions

---

## Integration & API

### REST API for Integrations
- CRUD operations on all entities
- Webhook support for event notifications
- OAuth2 for third-party apps
- Rate limiting and usage quotas

### Partner Integrations
- AWS, Azure, GCP cloud provider integrations
- ServiceNow, Jira ITSM integrations
- Data import from CMDB and configuration management
- Real-time cost data from cloud providers

---

## Appendices

### A. Feature Adoption Roadmap

**MVP (Month 0)**:
- ✅ All 5 phases with current functionality
- ✅ Multi-tenancy support
- ✅ Basic agentic features (auto-detection, suggestions)
- ✅ Interactive dependency graph
- ✅ Gantt chart timeline
- ✅ Configurable dashboard builder
- ✅ REST API basics

**Phase 1 (Months 1-3)**:
- ✅ Advanced agentic features (MDG optimization, risk scoring)
- ✅ Native analytics and BI
- ✅ Real-time collaboration
- ✅ Custom fields and data dictionary
- ✅ Runbook customization improvements

**Phase 2 (Months 4-6)**:
- ✅ Predictive analytics
- ✅ Advanced integrations (cloud providers, ITSM)
- ✅ Marketplace and plugins
- ✅ Execution monitoring (if in roadmap)

---

