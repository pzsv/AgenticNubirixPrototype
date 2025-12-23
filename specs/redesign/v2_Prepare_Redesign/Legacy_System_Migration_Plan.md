# Nubirix Prepare Module - Legacy System & Migration Plan

## SECTION 1: LEGACY SYSTEM PRESERVATION STRATEGY

### 1.1 Overview

The existing Prepare module will be preserved as **Prepare_OLD** to:
- Enable A/B testing between v1 and v2
- Provide fallback if v2 has critical issues
- Allow gradual user migration
- Support compliance/audit trail requirements
- Enable side-by-side comparison for 6-month evaluation period

### 1.2 Implementation Approach

#### Option A: Code Branching (Recommended)

```
Prepare/
├── pages/
│   ├── v1/ (Prepare_OLD)
│   │   ├── IngestV1.tsx
│   │   ├── MapFieldsV1.tsx
│   │   └── AggregateV1.tsx
│   └── v2/ (New Modernized)
│       ├── Overview.tsx
│       ├── Discover.tsx
│       ├── StageReview.tsx
│       └── ...
├── routes/
│   ├── prepare-v1.routes.ts  (Old routes)
│   └── prepare-v2.routes.ts  (New routes)
└── types/
    ├── v1.types.ts
    └── v2.types.ts
```

#### Option B: Feature Flags (Most Flexible)

```typescript
// featureFlags.ts
export const PREPARE_VERSION = {
  ENABLE_V2: process.env.REACT_APP_ENABLE_PREPARE_V2 === 'true',
  ENABLE_V1: process.env.REACT_APP_ENABLE_PREPARE_V1 === 'true',
  DEFAULT_VERSION: 'v2', // or 'v1'
  ENABLE_AB_TESTING: process.env.REACT_APP_AB_TESTING === 'true'
};

// In routes or components
const PrepareComponent = PREPARE_VERSION.DEFAULT_VERSION === 'v2' 
  ? <PrepareV2 /> 
  : <PrepareV1 />;
```

**Recommended: Use Feature Flags for maximum flexibility.**

#### Option C: Separate URL Paths

```
/prepare          → Routes to v2 (default)
/prepare-v2       → Explicit v2 access
/prepare-legacy   → Explicit v1 access
/prepare-v1       → Alternative alias to legacy
```

---

## SECTION 2: DATABASE MIGRATION STRATEGY

### 2.1 Data Coexistence

Both v1 and v2 can coexist in same database:

```sql
-- V1 Tables (Unchanged)
- raw_data
- mappings
- normalized_data
- aggregated_data

-- V2 Tables (New)
- data_sources
- staging_items
- mapping_profiles
- transformation_rules
- consolidation_rules
- ingestion_jobs
- quality_metrics
- data_lineage
- audit_log
```

### 2.2 Data Synchronization Strategy

**During Parallel Operation (First Month):**

```
┌─────────────────────────────────────────┐
│ User Upload/Manual Entry (Shared)       │
└──────┬──────────────────────────────────┘
       │
       ├─→ V1 Pipeline: → raw_data → mappings → normalized_data
       │
       └─→ V2 Pipeline: → data_sources → staging_items → mapping_profiles
                        → staging_items → transformation_rules
```

**Configuration:**
- Single upload endpoint accepts data
- Background sync job writes to BOTH v1 and v2 tables
- Prevents data loss, enables comparison testing
- Adds ~50ms overhead per upload (acceptable)

```python
# Backend: Post-upload synchronization
async def sync_upload_to_both_versions(upload_id, file_data):
    """Ensure data exists in both v1 and v2 systems"""
    
    # V1 path
    await create_raw_data_v1(file_data)
    
    # V2 path
    await create_data_source_v2(file_data)
    await create_staging_items_v2(file_data)
    
    # Log sync event for audit
    await audit_log({
        action: 'sync_upload',
        source_upload_id: upload_id,
        v1_created: True,
        v2_created: True,
        timestamp: now()
    })
```

### 2.3 Data Migration Path (Long-term)

**After 6-month evaluation period:**

```
IF v2_adoption_rate >= 85% AND no_critical_issues:
    → Complete migration to v2
    → Archive v1 data to historical storage
    → Disable v1 endpoints
    → Keep v1 as read-only reference for 1 year
ELSE:
    → Continue v1 as primary
    → Deprecate v2 or redesign
```

---

## SECTION 3: A/B TESTING FRAMEWORK

### 3.1 Test Design

**Primary Test: Workflow Time**

```
Hypothesis:
V2 average workflow time = 28 minutes
V1 average workflow time = 45 minutes
Expected reduction: 38%

Sample size: 50 users per version (100 total)
Duration: 30 days
Success criteria: p < 0.05, actual reduction ≥ 30%
```

**Secondary Tests:**

| Metric | V1 Baseline | V2 Target | Success Criteria |
|--------|-------------|-----------|------------------|
| Error Rate | 3.2% | 0.8% | < 1.5% |
| Abandonment | 8% | 2% | < 4% |
| Data Quality | 81% | 88% | ≥ 85% |
| User Satisfaction | 3.2/5 | 4.6/5 | ≥ 4.0/5 |
| Support Tickets | 47/month | 15/month | ≤ 25/month |

### 3.2 Test Implementation

```typescript
// User assignment to test variant
interface UserTestAssignment {
  userId: string;
  prepareVersion: 'v1' | 'v2';
  assignedAt: Date;
  cohort: 'control' | 'treatment';
}

// Create deterministic assignment
function assignUserToVersion(userId: string): 'v1' | 'v2' {
  // Hash-based assignment ensures consistency
  const hash = hashUserId(userId);
  return hash % 2 === 0 ? 'v1' : 'v2';
}

// Track all actions for analysis
interface WorkflowEvent {
  userId: string;
  version: 'v1' | 'v2';
  action: string; // 'started', 'completed', 'error', 'abandoned'
  timestamp: Date;
  metadata: {
    itemsProcessed: number;
    timeSpentSeconds: number;
    dataSource: string;
    errorMessage?: string;
  };
}
```

### 3.3 Metrics Collection

**Real-time Dashboard (Grafana):**

```
V1 vs V2 Comparison (Live)

METRIC              V1 (Control)   V2 (Treatment)   Improvement
─────────────────────────────────────────────────────────────
Active Users        23             27               +17%
Avg Workflow Time   42 min         25 min           -40% ✓
Error Rate          2.8%           0.7%             -75% ✓
Abandonment Rate    7.2%           2.1%             -71% ✓
Avg Quality Score   81%            87%              +7% ✓
User Satisfaction   3.4/5          4.5/5            +33% ✓

Statistical Significance:
  Workflow Time: p = 0.002 (SIGNIFICANT)
  Error Rate: p = 0.015 (SIGNIFICANT)
  Abandonment: p = 0.008 (SIGNIFICANT)
```

---

## SECTION 4: FEATURE FLAG MANAGEMENT

### 4.1 Flag Configuration

```javascript
// flags.config.js
module.exports = {
  'prepare.enable_v2': {
    description: 'Enable Prepare V2 (Modernized)',
    type: 'boolean',
    defaultValue: false,
    rollout: {
      enabled: true,
      percentage: 0, // Start at 0%, increase gradually
      targetRollout: {
        day1: 5,
        day3: 15,
        week1: 50,
        week2: 100
      }
    }
  },
  'prepare.enable_v1': {
    description: 'Enable Prepare V1 (Legacy)',
    type: 'boolean',
    defaultValue: true,
    rollout: {
      enabled: true,
      percentage: 100
    }
  },
  'prepare.ab_test_enabled': {
    description: 'Enable A/B testing',
    type: 'boolean',
    defaultValue: true
  },
  'prepare.default_version': {
    description: 'Default version for new users',
    type: 'string',
    options: ['v1', 'v2'],
    defaultValue: 'v1'
  }
};
```

### 4.2 Runtime Flag Evaluation

```typescript
// hooks/useFeatureFlags.ts
export function usePrepareVersion(): 'v1' | 'v2' {
  const user = useAuth().user;
  const flags = useFeatureFlags();
  
  // Check explicit user assignment
  if (user.prepareVersion) {
    return user.prepareVersion;
  }
  
  // Check A/B test assignment
  if (flags['prepare.ab_test_enabled']) {
    return assignUserToVersion(user.id);
  }
  
  // Use default version
  const defaultVersion = flags['prepare.default_version'];
  
  // Verify enabled
  if (defaultVersion === 'v1' && !flags['prepare.enable_v1']) {
    return 'v2';
  }
  if (defaultVersion === 'v2' && !flags['prepare.enable_v2']) {
    return 'v1';
  }
  
  return defaultVersion;
}
```

---

## SECTION 5: ROLLOUT PLAN

### 5.1 Phased Rollout (16 Weeks)

**Week 1-2: Internal Testing**
- Dev/QA team uses v2 exclusively
- Feature flags: v2 = 0%, v1 = 100%
- Collect feedback, fix critical bugs
- Setup monitoring and alerting

**Week 3-4: Alpha (Early Adopters)**
- Select 5-10 power users who requested early access
- Feature flags: v2 = 5%, v1 = 95%
- Enable detailed logging for analysis
- Daily feedback sync

**Week 5-6: Beta (Early Adopters)**
- Expand to 50 users (~10% of user base)
- Feature flags: v2 = 15%, v1 = 85%
- A/B test metrics collection begins
- Weekly review meetings

**Week 7-8: Wider Beta**
- Expand to 150 users (~30% of user base)
- Feature flags: v2 = 50%, v1 = 50%
- Monitor server performance under load
- Optimize for identified bottlenecks

**Week 9-10: Extended Rollout**
- Expand to 80% of user base
- Feature flags: v2 = 70%, v1 = 30%
- Provide training/documentation to wider audience
- Establish support procedures

**Week 11-14: General Availability**
- Feature flags: v2 = 95%, v1 = 5% (opt-in legacy)
- v1 available only via explicit selection
- Monitor v1 usage and issues
- Plan for eventual sunset

**Week 15-16: Stabilization**
- Feature flags: v2 = 100% (default)
- v1 available as read-only reference
- Prepare sunset timeline
- Archive/cleanup old v1 data

### 5.2 Rollout Decision Gates

**Gate 1 (End of Week 4):**
- [ ] No P0 bugs in alpha testing
- [ ] Performance acceptable under load
- [ ] Data quality ≥ 85%
- → Decision: Proceed to Beta or delay 1 week?

**Gate 2 (End of Week 8):**
- [ ] Error rate < 1.5% (target: 0.8%)
- [ ] User satisfaction ≥ 3.8/5 (target: 4.6/5)
- [ ] No data loss incidents
- [ ] Support queue manageable
- → Decision: Proceed to GA or rollback?

**Gate 3 (End of Week 12):**
- [ ] Adoption rate ≥ 70%
- [ ] User satisfaction ≥ 4.0/5
- [ ] Workflow time improvements measured
- [ ] No recurring issues
- → Decision: Sunset v1 at week 26 or extend support?

---

## SECTION 6: ROLLBACK PROCEDURES

### 6.1 Quick Rollback (If Critical Issue Detected)

**Trigger: P0 bug affecting > 5% of users**

```
Action Plan (Execute within 30 minutes):

1. Activate Feature Flag Rollback:
   prepare.enable_v2 = false
   prepare.default_version = 'v1'
   → All new sessions route to v1

2. Clear Caches:
   redis-cli FLUSHDB
   CDN cache purge
   → Ensure old v2 code not served

3. Notify Users:
   Send in-app notification:
   "Temporary switch to legacy system for stability.
    We're investigating and will resume shortly."

4. Rollback Database (if data corruption):
   pg_restore from 1-hour-old snapshot
   → Sync any new v2 data to v1 tables

5. Incident Review:
   - Root cause analysis
   - Fix implementation
   - Testing in isolated environment

6. Resume Rollout:
   Only after fix verified + tested
```

### 6.2 Gradual Rollback

**Trigger: Performance degradation or high error rate**

```
1. Pause Flag Rollout:
   Freeze v2 percentage at current level
   → Stop increasing new users to v2

2. Reduce v2 Percentage:
   Day 1: 50% → 30%
   Day 2: 30% → 10%
   Day 3: 10% → 0% (if needed)
   → Existing v2 sessions continue
   → New sessions go to v1

3. Deep Investigation:
   - Analyze logs for error patterns
   - Database performance analysis
   - Memory/CPU profiling
   - Compare v1 vs v2 metrics

4. Fix & Retesting:
   - Implement fixes
   - Run integration tests
   - Load test with 50% v2 traffic
   - Verify no new issues

5. Resume Rollout:
   - Start from 5-10% again
   - Slower rollout curve
   - More frequent check-ins
```

---

## SECTION 7: MONITORING & ALERTING

### 7.1 Key Metrics to Monitor

```
PERFORMANCE METRICS:
├─ API Response Time (p50, p95, p99)
├─ Page Load Time
├─ Database Query Performance
├─ File Upload Speed
└─ Job Queue Processing Time

BUSINESS METRICS:
├─ Users per version (v1 vs v2 ratio)
├─ Workflow completion rate
├─ Average workflow time
├─ Error rate
├─ Abandonment rate
└─ User satisfaction scores

SYSTEM HEALTH:
├─ CPU/Memory usage by service
├─ Disk space (especially staging)
├─ Network I/O
├─ Database connections
├─ Cache hit rate
└─ Job queue depth
```

### 7.2 Alert Configuration

```yaml
alerts:
  - name: "prepare_v2_error_rate_high"
    condition: "error_rate_v2 > 2%"
    duration: "5m"
    severity: "critical"
    action: "page_oncall"
    notification: "Slack #prepare-incidents"
    
  - name: "prepare_v2_api_latency_high"
    condition: "api_latency_p95_v2 > 1000ms"
    duration: "5m"
    severity: "warning"
    action: "slack_notification"
    
  - name: "prepare_v2_abandonment_high"
    condition: "abandonment_rate_v2 > 5%"
    duration: "1h"
    severity: "warning"
    action: "slack_notification"
    
  - name: "prepare_database_staging_full"
    condition: "staging_items_count > 500000"
    duration: "immediate"
    severity: "critical"
    action: "page_oncall"
```

---

## SECTION 8: SUPPORT & DOCUMENTATION

### 8.1 User Documentation

**For Prepare v1 Users:**
- Link to v2 overview and benefits
- Migration guide (how to switch)
- FAQ comparing v1 vs v2
- Support contact for any issues

**For Prepare v2 Users:**
- Feature overview and quick start
- Video tutorials for each screen
- Troubleshooting guide
- Advanced topics (custom transformations, etc)

**For Administrators:**
- Feature flag management guide
- Monitoring dashboard access
- Incident response procedures
- A/B test results dashboard

### 8.2 Support Ticket Routing

```
If user reports issue:
  → Check reported version (v1 or v2)
  → Route to appropriate team
  → Tag for metrics collection
  → Include in post-issue A/B analysis

Support Queue Tracking:
  - V1 issues: Track separately
  - V2 issues: Categorize by type
  - Compare resolution times
  - Identify training gaps
```

---

## SECTION 9: POST-ROLLOUT TIMELINE

### Months 1-2 (Weeks 1-8)
- ✓ Parallel operation of v1 & v2
- ✓ A/B testing active
- ✓ Daily metrics review
- ✓ Weekly team sync
- Action: Optimize v2 based on feedback

### Months 3-4 (Weeks 9-16)
- ✓ V2 as default, v1 available as legacy
- ✓ Continued A/B testing with opt-in users
- ✓ Bi-weekly metrics review
- Action: Plan v1 sunset if v2 metrics favorable

### Months 5-6 (Weeks 17-26)
- ✓ V1 available read-only for reference
- ✓ Archive old v1 data
- ✓ Training phase for remaining v1 users
- Action: Decide on v1 final sunset date

### Months 7-12 (Weeks 27-52)
- ✓ V1 completely deprecated
- ✓ v2 as single system of record
- ✓ Cleanup of legacy code
- ✓ Performance optimization round
- Action: Plan for next modernization cycle

---

## SECTION 10: SUCCESS CRITERIA SUMMARY

### Minimum Criteria to Declare v2 Successful
```
✓ Adoption rate ≥ 70% (willing to stay on v2)
✓ Error rate < 1.5%
✓ Data quality ≥ 85%
✓ User satisfaction ≥ 4.0/5
✓ Workflow time reduction ≥ 30%
✓ No data loss incidents
✓ Support load < v1 baseline
```

### Conditions for Keeping v1 Long-term
```
IF v2_metrics < success_criteria:
  → Extend v1 support 6 more months
  → Redesign v2 or rollback
  → Conduct post-mortem review
  → Plan recovery strategy
```

---

## DEPLOYMENT CHECKLIST

**Pre-Launch (Week 1-2):**
- [ ] Feature flags configured
- [ ] Monitoring/alerting active
- [ ] Database sync working (both v1 & v2)
- [ ] A/B test configuration finalized
- [ ] Support team trained
- [ ] Rollback procedure tested
- [ ] Infrastructure capacity verified

**Launch Day:**
- [ ] All teams on standby
- [ ] Incident commander identified
- [ ] Slack channels active
- [ ] Monitoring dashboards live
- [ ] Feature flag set to 5% for alpha
- [ ] Notifications sent to alpha users
- [ ] Metrics baseline established

**Post-Launch (Daily for first week):**
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Collect user feedback
- [ ] Update risk register
- [ ] Executive summary prepared

This comprehensive plan ensures a safe, measured transition from v1 to v2 while maintaining system stability and user trust.
