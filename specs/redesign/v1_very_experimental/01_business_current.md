# Nubirix - Business Specification (Current System)

**Document ID**: BS-CUR-001  
**Date**: December 21, 2025  
**Status**: Current System Analysis  
**Version**: 1.0

---

## Executive Summary

This document describes the current business model, market positioning, and value proposition of Nubirix as an internal consultant tool for enterprise cloud migration planning. It identifies the existing business drivers, customer segments, revenue model, and strategic opportunities.

---

## Product Definition

### What is Nubirix?

Nubirix is an enterprise software platform that helps IT organizations plan and execute large-scale cloud migrations. It provides a structured methodology across 5 phases (Prepare, Map, Plan, Move, Evaluate) with tools to manage data, dependencies, and migration strategy.

**Current Use Case**: Internal tool used by consulting organization to accelerate migration planning engagements and improve delivery quality.

### Core Value Proposition

**For IT Organizations**:
- Reduce migration planning cycles from months to weeks
- Improve visibility and traceability of migration dependencies
- Manage complex multi-application migrations systematically
- Reduce project risk through validated methodology
- Enable faster cloud adoption at lower cost

**Current Positioning**: "Migration Planning Platform that Accelerates Cloud Transformation"

---

## Current Business Model

### Revenue Model (Indirect)

Nubirix is **NOT directly monetized** in the current model. Instead, it generates value indirectly:

**Primary Benefit**: Enables consulting organization to:
- Deliver migration engagements faster (reduce billable hours)
- Improve project quality (reduce rework and overruns)
- Handle more projects with same team size
- Differentiate from competitors in migration consulting market
- Support larger, more complex migration deals

**Secondary Benefits**:
- Demonstrate migration expertise and capability
- Reduce delivery risk on large projects
- Attract and retain top consulting talent
- Create repeatable, scalable methodology

### Current Customers

**Internal Use Only**:
- Used by internal consulting teams for customer engagements
- Not sold or licensed to external customers
- No direct revenue from Nubirix
- Embedded in consulting delivery model

**Customer Profiles** (indirect):
- Large enterprises (500+ employees) planning cloud migrations
- Mid-market organizations with complex IT infrastructure
- Global companies with multi-region deployments
- Organizations with 500+ configuration items to migrate

---

## Target Market Analysis

### Market Opportunity

**Total Addressable Market (TAM)**: $10B+ annually
- Global cloud migration spending: $50B+/year (IDC)
- Migration planning = 10-20% of total engagement cost
- Applies to 10,000+ organizations planning migrations annually

**Serviceable Addressable Market (SAM)**: $500M+
- Enterprise organizations (500+ employees) in North America/EU
- Organizations planning cloud migrations in next 2-3 years
- Can be reached through consulting partnerships

**Serviceable Obtainable Market (SOM)**: $10-50M (as SaaS)
- 50-100 enterprise customers at $2-5K/month average
- Achievable in 3-5 years with proper execution

### Market Dynamics

**Cloud Migration Trends** (2025+):
- 78% of enterprises plan major cloud migrations (Gartner)
- Average migration project: 12-24 months, $2-10M budget
- Planning phase: 8-12 weeks (can be reduced to 2-4 weeks with tools)
- Migration complexity increasing (hybrid, multi-cloud strategies)

**Competitive Landscape**:
- **AWS Migration Accelerator**: AWS-specific, limited planning phase
- **Azure Migrate**: Azure ecosystem, basic dependency mapping
- **Jira/Asana**: Generic project management, no migration methodology
- **Custom solutions**: Many enterprises build internal tools
- **Consulting firms**: Use manual spreadsheets and custom processes
- **No specialized SaaS competitor**: Market opportunity for focused solution

---

## Current Capabilities by Phase

### Phase 1: Prepare (Data Ingestion)
- File upload (Excel, CSV) with manual structure specification
- Data ingestion and normalization
- Confidence-based conflict detection and resolution
- Data quality reporting
- Non-blocking gap identification

### Phase 2: Map (Relationship Mapping)
- Application Workload Instance (AWI) creation
- Dependency mapping between workloads
- Dependency graph visualization (table-based, limited)
- Critical path analysis
- Data quality metrics

### Phase 3: Plan (Migration Strategy)
- Move method definition (like-for-like, rehost, refactor, move)
- Move Dependency Group (MDG) creation and sequencing
- Cost and duration estimation
- Wave scheduling and prioritization

### Phase 4: Move (Execution Planning)
- Wave scheduling and time sequencing
- Runbook template system (technical and governance)
- Runbook generation and customization
- Execution handoff packages
- (Note: No actual migration execution)

### Phase 5: Evaluate (Reporting)
- Basic reporting (Status, Cost, Risk, Compliance)
- Metabase integration for BI and analytics
- Data export capabilities
- Limited analytics depth

---

## Current Business Challenges

### Operational Challenges

1. **Consultant Dependency**
   - Heavy reliance on expert consultants for planning phase
   - Inconsistent quality if expert unavailable
   - High labor costs for data analysis and planning
   - Difficult to scale consulting team

2. **Data Quality Issues**
   - Manual data entry error-prone
   - Conflicting data from multiple sources hard to reconcile
   - No automated validation or quality scoring
   - Time-consuming conflict resolution

3. **User Experience Limitations**
   - Table-based UI hard to understand complex dependencies
   - No interactive visualizations for stakeholder communication
   - Limited dashboard customization
   - Manual process for most planning activities

4. **Scalability Constraints**
   - Current architecture single-tenant (one customer per deployment)
   - Difficult to manage multiple customer instances
   - High operational overhead per customer
   - Not suitable for SaaS delivery model

### Market Challenges

1. **Market Awareness**
   - Migration planning tools not well-known to IT leadership
   - Perceived as "nice to have" vs "need to have"
   - Difficult to reach target customers through marketing
   - Requires education about methodology and benefits

2. **Competitive Pressure**
   - Cloud providers (AWS, Azure) building native tools
   - Generic project management platforms adding migration features
   - Consulting firms building proprietary tools
   - Price pressure from free/open-source alternatives

3. **Customer Acquisition**
   - Currently only acquired through consulting engagements
   - No direct sales or marketing capability
   - Limited visibility to potential customers
   - High customer acquisition cost

---

## Strategic Opportunities

### Immediate Opportunities (Next 12 months)

1. **Improve Internal Delivery**
   - Enhanced automation (agentic features)
   - Better visualizations for stakeholder communication
   - More accurate cost/risk estimation
   - Faster planning cycles (2-4 weeks → 1-2 weeks)

2. **Customer Success**
   - Better training and onboarding
   - Proactive project health monitoring
   - Improved reporting and insights
   - Customer advisory board for feedback

3. **Market Positioning**
   - Create content on migration best practices
   - Host webinars on cloud migration planning
   - Publish case studies from successful engagements
   - Build analyst relationships (Gartner, Forrester)

### Medium-Term Opportunities (12-24 months)

1. **SaaS Productization** (Primary)
   - Convert to multi-tenant SaaS platform
   - Build self-service onboarding
   - Develop pricing and packaging model
   - Launch to market with go-to-market strategy

2. **Feature Expansion**
   - AI-powered automation (agentic features)
   - Advanced visualizations (interactive graphs, Gantt charts)
   - Native analytics (replace Metabase)
   - Real-time collaboration
   - Execution monitoring (if applicable)

3. **Partner Ecosystem**
   - Integration with cloud provider APIs
   - ITSM tool integrations (ServiceNow, Jira)
   - Consulting partner program
   - White-label options for MSPs

### Long-Term Opportunities (2+ years)

1. **Market Leadership**
   - Become the standard migration planning platform
   - Build community and user base
   - Establish brand recognition
   - Industry analyst recognition

2. **Platform Expansion**
   - Execution automation (move data, validate, cutover)
   - Continuous monitoring post-migration
   - Optimization recommendations
   - Multi-cloud management

3. **Adjacent Markets**
   - Data center consolidation
   - Application rationalization
   - Infrastructure optimization
   - Cost management

---

## Financial Analysis

### Current Cost Structure

**Development**:
- Engineering team: 4-6 people, $400-500K/year
- Product management: 1-2 people, $150-200K/year
- DevOps/Infrastructure: 1-2 people, $100-150K/year

**Operations**:
- Cloud infrastructure (AWS/Azure): $30-50K/year
- Tools and licenses: $20-30K/year
- Support and documentation: $50-100K/year

**Total Annual Cost**: $750K-1.1M

### Current Value Created

**Consulting Engagement Benefit**:
- Typical engagement: $500K-2M budget
- Nubirix impact: Saves 4-8 weeks planning (10-20% of total engagement)
- Value per engagement: $50-400K (reduced labor + improved quality + faster delivery)
- Engagements per year: 10-20

**Estimated Annual Value**: $500K-8M (depending on engagement volume)

**ROI**: Positive, with value creation significantly exceeding development costs

---

## Success Metrics

### Current Metrics

**Usage Metrics**:
- Number of projects per year
- Average project complexity (# of CIs, AWIs, dependencies)
- Planning cycle time reduction
- Data quality (% conflicts resolved, % gaps filled)

**Quality Metrics**:
- Project risk reduction
- Accuracy of cost/duration estimates
- Scope creep reduction
- Customer satisfaction (internal)

**Delivery Metrics**:
- Consultant productivity improvement
- Billable hour reduction per project
- Project on-time delivery rate
- Customer feedback and testimonials

### Future Metrics (for SaaS)

**Business Metrics**:
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Net Revenue Retention

**Product Metrics**:
- Feature adoption rate
- User engagement
- NPS score
- Customer satisfaction (CSAT)

---

## Risk Assessment

### Market Risks

**Risk**: Cloud providers launch competitive products
- **Likelihood**: High (AWS, Azure already have basic tools)
- **Impact**: High (could commoditize market)
- **Mitigation**: Differentiate through specialization, ease of use, community

**Risk**: Generic project management platforms add migration features
- **Likelihood**: High (Jira, Asana likely to add)
- **Impact**: Medium (not specialized but may reduce differentiation)
- **Mitigation**: Focus on depth vs breadth, build expert community

### Technology Risks

**Risk**: Architecture not suitable for multi-tenancy
- **Likelihood**: Low (can be redesigned)
- **Impact**: High (required for SaaS)
- **Mitigation**: Plan multi-tenant migration carefully, test thoroughly

**Risk**: Scalability issues at large customer scale
- **Likelihood**: Low (database can be optimized)
- **Impact**: High (affects SaaS reliability)
- **Mitigation**: Load test, plan sharding strategy, scale infrastructure

### Organizational Risks

**Risk**: Consulting culture resistant to product revenue
- **Likelihood**: Medium (cultural shift required)
- **Impact**: High (affects investment and strategy)
- **Mitigation**: Separate P&L, dedicated product leadership, clear roadmap

**Risk**: Talent retention for product team
- **Likelihood**: Medium (consulting salaries competitive)
- **Impact**: High (affects execution velocity)
- **Mitigation**: Equity incentives, clear career path, product autonomy

---

## Regulatory & Compliance Considerations

### Data Privacy

**GDPR Compliance** (if EU customers):
- Data residency requirements
- Right to be forgotten
- Data export capabilities
- Privacy policy and consent management

**CCPA/CPRA** (if US customers):
- Data disclosure requirements
- Opt-out mechanisms
- Data deletion capabilities

### Security & Compliance

**SOC2 Type II** (for enterprise sales):
- Security controls
- Availability and uptime SLA
- Confidentiality of customer data
- Change management procedures

**Industry Standards**:
- ISO 27001 (information security)
- HIPAA (if healthcare customers)
- PCI DSS (if payment processing)

---

## Competitive Landscape

### Direct Competitors

**AWS Migration Accelerator**:
- Strength: AWS integration, free/low cost
- Weakness: AWS-specific, limited planning phase
- Position: Cloud provider advantage, but limited scope

**Azure Migrate**:
- Strength: Azure integration, dependency discovery
- Weakness: Azure-specific, basic features
- Position: Cloud provider advantage, but limited scope

### Indirect Competitors

**Jira + Plugins**:
- Strength: Familiar interface, extensible
- Weakness: Not migration-specific, manual planning
- Position: Generic tool, not specialized

**Asana/Monday.com**:
- Strength: Popular project management
- Weakness: No migration domain expertise
- Position: Generic tool, no differentiation

**Consulting Spreadsheets**:
- Strength: Low cost, familiar
- Weakness: Manual, error-prone, unscalable
- Position: Current de facto standard

### Competitive Advantages

1. **Migration Methodology**: Proven 5-phase approach
2. **Ease of Use**: Designed for IT professionals, not generic PM
3. **Specialized Features**: Dependency mapping, move methods, MDGs
4. **Quality**: Conflict resolution, data validation, confidence scoring
5. **Consulting Support**: Backed by expertise and best practices

---

## Recommendations

### For Internal Business

1. **Improve Delivery Efficiency**
   - Invest in agentic automation features
   - Enhance visualizations for stakeholder communication
   - Improve data quality and validation
   - Measure and optimize planning cycle time

2. **Build Thought Leadership**
   - Publish on migration best practices
   - Host customer advisory board
   - Speak at industry conferences
   - Create case studies and ROI calculator

3. **Prepare for Product Transition**
   - Plan multi-tenant architecture
   - Establish product management discipline
   - Build go-to-market capabilities
   - Define pricing and packaging strategy

### For SaaS Opportunity

1. **Validate Market**
   - Conduct customer discovery interviews
   - Validate pricing assumptions
   - Test go-to-market channels
   - Build investor pitch based on data

2. **Plan Product Evolution**
   - Define MVP scope (must-have features)
   - Plan agentic feature roadmap
   - Design multi-tenant architecture
   - Establish quality and performance targets

3. **Organize for Growth**
   - Separate product P&L from consulting
   - Hire product and GTM leadership
   - Define go-to-market strategy
   - Plan sales and marketing organization

---

## Appendices

### A. Definition of Terms

**AWI** (Application Workload Instance): A logical grouping of related configuration items that migrate together

**MDG** (Move Dependency Group): A group of AWIs scheduled to migrate in the same wave

**Move Method**: Migration approach (like-for-like, rehost, refactor, move)

**Wave**: A time period during which one or more MDGs migrate

**Confidence**: A score (0-100%) indicating data quality and reliability

**Critical Path**: The longest chain of dependencies in the migration plan

### B. Market Statistics

- **Cloud Migration Market**: $50B+ annually
- **Planning Phase Cost**: 10-20% of total migration cost
- **Planning Cycle Duration**: 8-12 weeks (can be reduced to 2-4 weeks)
- **Number of Organizations Planning Migrations**: 10,000+ annually
- **Enterprise IT Budget Growth**: 3-5% annually
- **Cloud Adoption Rate**: 78% of enterprises (Gartner)

### C. Technology Stack (Current)

- Backend: Java, Spring Boot
- Frontend: Angular (legacy), React (in transition)
- Database: PostgreSQL or Oracle (TBD)
- Message Queue: Kafka or RabbitMQ (TBD)
- Cache: Redis
- Analytics: Metabase (integrated)
- Deployment: Docker, cloud-native (AWS/Azure)

---

