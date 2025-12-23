# Nubirix - Business Specification (Proposed SaaS Evolution)

**Document ID**: BS-SAA-001  
**Date**: December 21, 2025  
**Status**: Proposed SaaS Evolution  
**Version**: 1.0

---

## Executive Summary

This document describes the business model, market positioning, and financial strategy for evolving Nubirix from an internal consultant tool into a market-ready SaaS product. The opportunity exists to monetize the migration planning methodology through recurring SaaS revenue while enabling faster enterprise cloud migrations.

---

## SaaS Business Model

### Revenue Streams

**Primary: Per-Customer Subscription**
- Monthly/Annual subscription per organization
- Price based on customer size and feature tier
- Includes support and regular updates

**Secondary: Professional Services**
- Migration planning consulting
- Custom integrations and implementations
- Training and onboarding services
- Accelerated project delivery

**Tertiary: Marketplace & Extensions**
- Partner integrations (cloud providers, ITSM tools)
- Custom plugins and extensions
- Data source connectors
- Reporting templates

### Pricing Strategy

**Tiered Model (Recommended)**

**Tier 1: Starter** ($500-1,000/month)
- Single project
- Up to 500 configuration items
- Basic reports
- Community support
- Target: SMB with simple migrations

**Tier 2: Professional** ($2,000-5,000/month)
- Up to 3 concurrent projects
- Up to 5,000 configuration items
- Advanced reports and dashboards
- Real-time collaboration
- Priority email support
- Target: Mid-market enterprises

**Tier 3: Enterprise** ($10,000-25,000/month)
- Unlimited projects
- Unlimited configuration items
- All features including custom fields
- Real-time collaboration and AI agents
- Dedicated account manager
- SLA guarantees
- Multi-region deployment
- Target: Large enterprises with complex migrations

**Add-ons**
- Additional concurrent projects: $500/month
- Additional users: $50-100/month
- Premium support: $1,000-3,000/month
- Custom development: Time & materials

### Unit Economics (Projected)

**Customer Acquisition Cost (CAC)**: $5,000-10,000
- Sales and marketing spend
- Trial conversion support
- Onboarding services

**Lifetime Value (LTV)**: $50,000-100,000
- Average contract value: $3,000-5,000/month
- Average retention: 24-36 months
- Expansion revenue: 10-20% annually

**LTV:CAC Ratio**: 5-10x (healthy SaaS metrics)

**Gross Margin**: 70-80%
- COGS (infrastructure, support): 20-30%
- R&D and operations: Separate line item

---

## Market Positioning

### Target Markets

**Primary Market: Enterprise IT Leadership**
- CIOs and IT Directors planning cloud migrations
- Infrastructure teams executing large-scale projects
- Mid-market to enterprise organizations
- 100+ employees with complex IT infrastructure

**Secondary Market: Managed Service Providers (MSPs)**
- Offer Nubirix to their customers
- White-label or co-branded options
- Revenue sharing model

**Tertiary Market: Systems Integrators & Consultants**
- Consulting firms needing migration planning tools
- Include in consulting engagement offerings
- Build competitive advantage in migration services

### Competitive Differentiation

**vs. Generic Project Management (Jira, Asana)**
- Specialized for cloud/data centre migrations
- Built-in migration methodology
- Infrastructure-aware planning
- Pre-built runbooks and validation

**vs. Cloud Provider Tools (AWS Migration Accelerator, Azure Migrate)**
- Cloud-agnostic (works with any cloud provider)
- Not limited to specific vendor ecosystem
- Better UI/UX for planning phase
- Focus on migration strategy, not just execution

**vs. Custom/Manual Approaches**
- Dramatically faster planning (weeks → days)
- Reduced project risk (validated methodology)
- Lower consulting burn rate
- Better visibility and predictability

**Unique Value Propositions**
1. **AI-Powered Optimization**: Agentic features for automatic strategy generation
2. **Visual Planning**: Interactive graphs and timelines (vs tables)
3. **Integrated Analytics**: Native BI (no separate Metabase)
4. **Consulting Leverage**: Reduce project timelines while improving quality

### Market Positioning Statement

> "Nubirix is the AI-powered cloud migration planning platform that helps enterprises cut planning cycles from weeks to days while dramatically reducing project risk. Unlike generic project tools or cloud-specific platforms, Nubirix combines specialized migration methodology, intelligent automation, and beautiful visualizations to accelerate cloud transformations."

### Go-to-Market Strategy

**Phase 1: Bottom-Up (Months 1-6)**
- Target SMB and mid-market segments
- Low-cost customer acquisition (content, community, community)
- Build product-market fit evidence
- Generate customer testimonials and case studies

**Phase 2: Top-Down (Months 6-12)**
- Enterprise sales team and partnerships
- System integrators and consulting firms
- Cloud provider partnerships (AWS, Azure, GCP)
- Industry analyst engagement

**Phase 3: Scale (Year 2+)**
- Sales development representatives (SDRs)
- Account executives for enterprise
- Customer success and retention focus
- Ecosystem and marketplace

### Customer Acquisition Channels

1. **Content Marketing** (Low cost, high impact)
   - Blog on cloud migration trends
   - Whitepapers on migration best practices
   - Case studies from internal projects
   - Migration planning frameworks

2. **Community & Events** (Moderate cost)
   - Cloud migration conferences (AWS re:Invent, Azure Ignite, Google Cloud Summit)
   - Industry analyst reports (Gartner, Forrester)
   - Webinars and workshops
   - User conferences and community

3. **Partnerships** (Strategic)
   - System integrators (Accenture, Deloitte, Cognizant)
   - Cloud providers (AWS, Azure, GCP)
   - Managed service providers (MSPs)
   - ITSM platforms (ServiceNow integrations)

4. **Direct Sales** (For enterprise)
   - LinkedIn outreach to target accounts
   - Sales development representatives (SDRs)
   - Account executives for enterprise deals
   - Technical sales engineers for POCs

5. **Product-Led Growth** (Optional)
   - Free trial with limited project
   - Freemium tier (small migrations)
   - Community edition (non-commercial)
   - Self-serve onboarding and documentation

### Customer Success & Retention

**Onboarding Program** (Critical for SaaS success)
- Welcome call and discovery
- Data import from customer systems
- Guided walkthrough of planning process
- First report and dashboard setup
- Success criteria definition
- 30-day check-in

**Health Metrics & Engagement**
- Monthly active users per account
- Number of projects created
- Runbook completion rate
- Dashboard usage and customization
- Time-to-first-migration

**Retention Strategies**
- Quarterly business reviews (QBRs) with customers
- Proactive alerts on migration bottlenecks
- New feature announcements and training
- Customer advisory board for feature input
- Loyalty discounts for multi-year commitments

**Expansion Revenue Opportunities**
- Upsell to higher tiers (more projects, users)
- Cross-sell professional services
- Add-on modules (execution monitoring, if implemented)
- Marketplace extensions and integrations

---

## MVP Feature Prioritization

### Must-Have for MVP (Launch with these)

**Core Platform**
- ✅ All 5 phases (Prepare, Map, Plan, Move, Evaluate)
- ✅ Multi-project support
- ✅ Multi-tenancy (customer isolation)
- ✅ Role-based access control (project and global)
- ✅ Basic reporting (Status, Cost, Risk, Compliance)

**Key Enhancements**
- ✅ Interactive dependency graphs (high UI impact)
- ✅ Gantt charts for wave timelines
- ✅ Agentic MDG optimization (automated suggestions)
- ✅ Agentic conflict resolution (confidence-based)
- ✅ Configurable dashboards (customer self-service reporting)

**Infrastructure & Operations**
- ✅ Cloud deployment (AWS, Azure, or GCP)
- ✅ Multi-user collaboration (real-time)
- ✅ Audit logging and compliance
- ✅ API for integrations
- ✅ Basic SLA and uptime monitoring

### Nice-to-Have for MVP (Phase 1 or Phase 2)

**Advanced Agentic Features**
- 📅 AWI auto-detection (suggest workload groupings)
- 📅 Move method recommendations (based on workload characteristics)
- 📅 Cost estimation with ML model
- 📅 Risk scoring and mitigation suggestions
- 📅 Predictive analytics (completion date forecasts)

**Advanced Visualizations**
- 📅 Data quality heatmaps (by phase, by CI type)
- 📅 Resource utilization forecasts
- 📅 Cost breakdown visualizations (by phase, by service)
- 📅 Critical path highlighting on Gantt charts
- 📅 What-if scenario modeling (interactive planning)

**Advanced Collaboration**
- 📅 Real-time collaborative editing (comments, suggestions)
- 📅 Approval workflows (with notifications)
- 📅 Change tracking and rollback
- 📅 Team notifications and alerts

**Integrations & Extensions**
- 📅 Cloud provider integrations (AWS, Azure, GCP APIs)
- 📅 ITSM system integrations (ServiceNow, Jira)
- 📅 Custom webhook system
- 📅 Marketplace for plugins and extensions
- 📅 White-label options

**Execution Support** (If roadmap includes)
- 📅 Real-time migration execution monitoring
- 📅 Automated migration orchestration
- 📅 Data validation and testing automation
- 📅 Cutover automation
- 📅 Rollback automation

### Post-MVP Roadmap (Year 2+)

- Mobile app (iOS, Android)
- Multi-language support (internationalization)
- Advanced ML features (demand forecasting, cost optimization)
- Execution platform (migrate data end-to-end)
- Marketplace ecosystem

---

## Financial Model & Projections

### Revenue Projections (3-Year)

**Year 1: Foundation**
- Months 1-3: Closed beta with friendly customers (no revenue)
- Months 4-12: General availability, ramp up
- Target: 5-10 paying customers, $300K-500K ARR

**Year 2: Growth**
- Expand sales and marketing
- Build partnerships with systems integrators
- Target: 30-50 customers, $2-3M ARR

**Year 3: Scale**
- Enterprise sales team in place
- Multiple channel partnerships
- Target: 80-100 customers, $5-7M ARR

### Cost Structure

**Fixed Costs** (Year 1)
- Product team (engineering, design, product): $400-500K
- Sales and marketing: $150-200K
- Customer success and support: $100-150K
- Finance, legal, admin: $80-100K
- Infrastructure and operations: $50-100K
- **Total: $780K-1.05M**

**Variable Costs** (Per customer, average)
- Cloud infrastructure (AWS/Azure): $50-100/month
- Support and success services: $100-200/month
- Payment processing (Stripe, etc.): 2-3% of revenue
- **Total: $150-300/month per customer**

**Gross Margin** (at Tier 2 average, $3,500/month)
- Revenue: $3,500
- COGS: $250
- Gross Margin: 93%

**Path to Profitability**
- Break-even: ~20-30 customers (depending on tier mix)
- Target: Profitability by end of Year 2
- Reinvest early profits into product and GTM

---

## Organizational Structure for SaaS

### Core Team (MVP Launch)

**Product & Engineering** (4-5 people)
- VP Product & Strategy
- Lead Backend Engineer
- Lead Frontend Engineer
- QA/Testing Engineer
- Product Designer

**Go-to-Market** (2-3 people)
- VP Sales & Marketing (or Head of GTM)
- Content/Marketing Manager
- Sales Development Representative (SDR)

**Operations & Finance** (1-2 people)
- Finance Manager
- Customer Success Manager (part-time)

**Total: 7-10 people for MVP launch**

### Organization by Phase

**Phase 1 (Year 1)**: 7-10 people
- Focus: Product-market fit, customer traction
- Lean operations, efficient spend

**Phase 2 (Year 2)**: 15-20 people
- Add: Enterprise sales team, customer success
- Focus: Revenue growth, customer retention

**Phase 3 (Year 3)**: 25-35 people
- Add: Dedicated support team, sales engineers
- Focus: Scale, efficiency, profitability

---

## Feasibility Assessment

### Technical Feasibility: ✅ HIGH

**Strengths**
- Current system has solid architecture foundation
- Microservices pattern supports SaaS multi-tenancy
- Temporal workflow engine ready for agentic features
- React migration positions frontend for enhancement

**Challenges**
- Multi-tenancy requires architectural changes (manageable)
- Database scalability needs planning (solve with sharding)
- Real-time features require WebSocket implementation (standard)
- AI/ML integration needs framework selection (LangChain available)

**Timeline**: 3-4 months for MVP with experienced team

**Risk Level**: LOW-MODERATE

### Market Feasibility: ✅ HIGH

**Strengths**
- Large TAM (cloud migrations are standard)
- Clear customer pain points (planning cycles, visibility)
- Differentiation through AI and visualization
- Multiple go-to-market channels available

**Challenges**
- Enterprise sales cycles are long (6-12 months)
- Competition from cloud providers (AWS, Azure services)
- Category education needed (migration planning is not standard)
- Pricing pressure from consulting discounting

**Risk Level**: MODERATE (market education required)

### Organizational Feasibility: ✅ MODERATE-HIGH

**Strengths**
- Existing consultant user base for feedback
- Internal use case validates product
- Team has migration methodology expertise
- Lean startup experience available

**Challenges**
- Requires different skill set (SaaS vs consulting)
- Sales expertise may be limited (need to hire)
- Organizational culture shift (product vs services)
- Consulting revenue protection (potential conflict)

**Risk Level**: MODERATE (organizational change required)

---

## Risk Factors & Mitigation

### Market Risks

**Risk**: Competition from cloud providers or new entrants
- **Mitigation**: Build moat through customer data, integrations, community

**Risk**: Customers prefer consulting services over self-service product
- **Mitigation**: Offer both (SaaS + premium consulting); show ROI

**Risk**: Long enterprise sales cycles reduce cash flow
- **Mitigation**: Target SMB segment first; build usage-based metrics

### Technical Risks

**Risk**: Multi-tenancy implementation delays MVP
- **Mitigation**: Start with single-tenant MVP, migrate existing customers after

**Risk**: AI/agentic features don't deliver expected value
- **Mitigation**: Phase agentic features post-MVP; validate with customers first

**Risk**: Scalability issues as customer base grows
- **Mitigation**: Build scalability into architecture from day 1 (Kubernetes, sharding plan)

### Business Risks

**Risk**: Customer acquisition costs too high
- **Mitigation**: Focus on product-led growth, partnerships, content marketing

**Risk**: Churn rate higher than projected
- **Mitigation**: Invest in onboarding, customer success, product engagement

**Risk**: Cannibalization of consulting revenue
- **Mitigation**: Position SaaS as augmentation to consulting, not replacement

### Mitigation Strategy Summary

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Competition | Moderate | High | Differentiation via AI, community, integrations |
| Sales cycle delays | Moderate | Moderate | Target SMB first, usage-based pricing |
| Multi-tenancy delays | Low | High | Single-tenant MVP approach |
| Agentic features flop | Moderate | Moderate | Phase post-MVP, validate customer value |
| Scalability issues | Low | High | Architecture planning, Kubernetes ready |
| High CAC | Moderate | Moderate | Product-led growth, partnerships |
| Churn | Moderate | High | Customer success investment |

---

## Success Metrics & KPIs

### Business Metrics

**Growth**
- Monthly Recurring Revenue (MRR) Growth: Target 10-15% MoM year 1
- Annual Recurring Revenue (ARR): $500K by end of Year 1
- Customer Count: 10-15 by end of Year 1
- Net Revenue Retention: >110% (expansion revenue)

**Efficiency**
- Customer Acquisition Cost (CAC): <$5,000
- CAC Payback Period: <12 months
- Lifetime Value (LTV): >$50,000
- LTV:CAC Ratio: >5x

**Retention**
- Monthly Churn Rate: <5%
- Annual Retention Rate: >80%
- Net Revenue Churn: Negative (expansion exceeds churn)

**Product**
- Feature Adoption Rate: >60% of paying customers
- User Engagement: >2 logins/week per active user
- NPS Score: >50
- Customer Satisfaction (CSAT): >4.0/5.0

### Product Metrics

**Usage**
- Active projects per customer: Average 2-3
- CIs imported: 1,000-5,000 per project
- Reports generated: Monthly per customer
- Dashboard customizations: 50%+ of users

**Quality**
- System uptime: 99.9%
- Mean time to resolution (MTTR): <1 hour for critical issues
- Security incidents: Zero (target)
- Data loss incidents: Zero (target)

---

## Success Criteria for SaaS Launch

**MVP Success = Product-Market Fit Evidence**

1. ✅ 10+ paying customers in closed beta/Year 1
2. ✅ Net Promoter Score (NPS) >50
3. ✅ Monthly churn rate <5%
4. ✅ CAC payback within 12 months
5. ✅ Positive customer testimonials and case studies
6. ✅ $500K ARR by end of Year 1
7. ✅ >80% customer retention
8. ✅ Feature adoption >60% of customer base
9. ✅ Zero security incidents
10. ✅ 99.9% system uptime

---

## Next Steps

### Immediate (Next 30 days)
1. Executive approval of SaaS business case
2. Finalize pricing and packaging
3. Identify founding customers for early access
4. Organize sales and marketing team
5. Approve MVP scope and timeline

### Short-term (Months 1-3)
1. Build MVP with prioritized features
2. Recruit founding customers for closed beta
3. Develop go-to-market strategy and collateral
4. Set up SaaS infrastructure and operations
5. Implement analytics and metrics tracking

### Medium-term (Months 4-6)
1. Launch public beta with 5-10 customers
2. Gather feedback and iterate
3. Build case studies and testimonials
4. Launch limited marketing campaign
5. Establish partnerships (systems integrators)

### Long-term (Months 6-12)
1. General availability launch
2. Ramp up sales and marketing
3. Achieve 10-15 paying customers
4. Establish recurring revenue (MRR >$30K)
5. Plan Year 2 expansion

---

## Appendices

### A. Customer Personas

**Persona 1: Enterprise CIO**
- Title: Chief Information Officer
- Organization size: 500+ employees, complex infrastructure
- Pain point: Need to migrate 1000+ servers to cloud
- Value sought: Reduce project timeline, improve visibility
- Budget: $5,000-10,000/month per project
- Buying process: RFP, committee approval, vendor evaluation

**Persona 2: Mid-market IT Director**
- Title: Director of Infrastructure
- Organization size: 100-500 employees
- Pain point: Migrate to cloud but limited staff
- Value sought: Reduce manual planning, accelerate timeline
- Budget: $1,000-5,000/month
- Buying process: Direct purchase, vendor demos, POC

**Persona 3: Systems Integrator PM**
- Title: Program Manager, Migration Lead
- Organization size: 50-100 person consulting firm
- Pain point: Deliver faster migrations, reduce delivery costs
- Value sought: Accelerate delivery, reduce overhead
- Budget: $2,000-5,000/month (passed through to customer)
- Buying process: Vendor partnership, white-label options

### B. Competitive Analysis Matrix

| Factor | Nubirix | AWS Migrate | Azure Migrate | Jira | Custom |
|--------|---------|-------------|---------------|------|--------|
| Cloud-agnostic | ✅ | ❌ | ❌ | N/A | ✅ |
| Migration methodology | ✅ | ❌ | ❌ | N/A | ✅ |
| Beautiful UI | ✅ | Moderate | Moderate | Moderate | ❌ |
| AI automation | ✅ | Limited | Limited | ❌ | ❌ |
| Integrated analytics | ✅ | Limited | Limited | Limited | ❌ |
| Cost | Moderate | Free (usage) | Free (usage) | Low | High |
| Support | Excellent | Good | Good | Community | Varies |

### C. Financial Model Templates

[See separate financial model spreadsheet]
- Revenue projections (3-year)
- Cost structure and profitability analysis
- Cash flow projections
- Break-even analysis
- Unit economics and customer cohort analysis

---

