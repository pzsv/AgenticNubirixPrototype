# Nubirix Prepare Module v2 - Screen Mockups & Design System

## PART 1: DESIGN SYSTEM SPECIFICATIONS

### Color Palette

**Primary Colors:**
```
Primary Blue:     #0052CC  (Actions, links, highlights)
Primary Dark:     #003A9F  (Darker variant for hover states)
Primary Light:    #E6F2FF  (Background for highlighted sections)

Success Green:    #2D7E3E  (Checkmarks, success states)
Warning Orange:   #B87300  (Warnings, caution states)
Error Red:        #E63946  (Errors, destructive actions)
Info Teal:        #0693E3  (Information, help text)
```

**Neutral Colors:**
```
White:            #FFFFFF  (Backgrounds)
Gray 50:          #F8F9FA  (Light backgrounds, borders)
Gray 100:         #F1F3F5  (Slightly darker backgrounds)
Gray 200:         #E9ECEF  (Subtle borders)
Gray 300:         #DEE2E6  (Standard borders)
Gray 400:         #ADB5BD  (Disabled text, placeholders)
Gray 500:         #868E96  (Secondary text)
Gray 600:         #495057  (Body text)
Gray 700:         #343A40  (Headings, dark text)
Black:            #212529  (Dark text, very dark backgrounds)
```

### Typography

**Font Stack:**
```
Primary:    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Monospace:  "Monaco", "Courier New", monospace
```

**Sizes & Weights:**
```
Heading 1:  32px, weight 700, line-height 1.25
Heading 2:  24px, weight 700, line-height 1.3
Heading 3:  20px, weight 600, line-height 1.35
Heading 4:  16px, weight 600, line-height 1.5
Body:       14px, weight 400, line-height 1.5
Small:      12px, weight 400, line-height 1.5
Tiny:       11px, weight 400, line-height 1.4
Label:      12px, weight 600, line-height 1.5
```

### Spacing Scale

```
xs: 4px    (smallest padding/margin)
sm: 8px    (button padding, minor spacing)
md: 12px   (standard padding)
lg: 16px   (section padding, major spacing)
xl: 24px   (container padding)
2xl: 32px  (top-level spacing)
3xl: 48px  (page sections)
```

### Border Radius

```
sharp: 0px
sm: 4px    (inputs, small components)
md: 6px    (buttons, cards)
lg: 8px    (containers)
full: 9999px (fully rounded)
```

### Shadows

```
sm: 0 1px 3px rgba(0,0,0,0.1)
md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
none: none
```

---

## PART 2: COMPONENT LIBRARY

### Buttons

**Primary Button:**
```
Background:     #0052CC
Text Color:     #FFFFFF
Padding:        8px 16px (sm) | 12px 24px (lg)
Border Radius:  6px
Font Weight:    600
Hover:          Background #003A9F
Disabled:       Opacity 50%, cursor not-allowed
Active:         Background #002B7C
```

**Secondary Button:**
```
Background:     #E6F2FF
Text Color:     #0052CC
Border:         1px solid #0052CC
Padding:        8px 16px
Hover:          Background #D6E8FF
Active:         Background #C7DEFF
```

**Tertiary/Ghost Button:**
```
Background:     transparent
Text Color:     #0052CC
Border:         1px solid #DEE2E6
Padding:        8px 16px
Hover:          Background #F8F9FA
Active:         Background #F1F3F5
```

### Form Elements

**Text Input:**
```
Background:     #FFFFFF
Border:         1px solid #DEE2E6
Padding:        8px 12px
Border Radius:  4px
Font Size:      14px
Focus:          Border #0052CC, shadow: 0 0 0 3px rgba(0,82,204,0.1)
Disabled:       Background #F8F9FA, color #ADB5BD
Error:          Border #E63946
```

**Select Dropdown:**
```
Same as input, with down arrow icon
Arrow Color:    #495057
Hover Arrow:    #212529
```

**Checkbox & Radio:**
```
Size:           16px × 16px
Border:         2px solid #DEE2E6
Checked:        Background #0052CC, border #0052CC
Focus:          Outline #0052CC 2px offset 2px
```

**Toggle Switch:**
```
Size:           40px width × 24px height
Background Off: #E9ECEF
Background On:  #2D7E3E
Circle:         4px padding, white
Transition:     200ms ease
```

### Cards

```
Background:     #FFFFFF
Border:         1px solid #E9ECEF
Border Radius:  8px
Padding:        16px
Shadow:         sm
Hover:          Shadow md (optional)
```

### Progress Indicators

**Progress Bar:**
```
Height:         8px
Background:     #E9ECEF
Foreground:     #0052CC
Border Radius:  4px
```

**Step Indicator (for 6-phase workflow):**
```
┌─ Step 1 ─┬─ Step 2 ─┬─ Step 3 ─┐
│ ✓        │ ✓        │ ⟳        │
└──────────┴──────────┴──────────┘

Completed:      #2D7E3E with ✓
Current:        #0052CC with ⟳ (animated)
Upcoming:       #DEE2E6 with number
Label:          12px, weight 600, #495057
```

### Badges

```
Success:   Background #E8F5E9, text #2D7E3E, border 1px solid #C8E6C9
Warning:   Background #FFF3E0, text #B87300, border 1px solid #FFE0B2
Error:     Background #FFEBEE, text #E63946, border 1px solid #FFCDD2
Info:      Background #E0F2FF, text #0693E3, border 1px solid #B3E5FC
```

### Data Tables

```
Header Row:     Background #F8F9FA, font-weight 600
Row Height:     40px (standard), 48px (compact)
Cell Padding:   12px
Borders:        1px solid #E9ECEF (horizontal)
Hover Row:      Background #F8F9FA
Sort Indicator: Gray 500, becomes Blue on hover
Column Resize:  Cursor col-resize, visual separator
```

---

## PART 3: SCREEN MOCKUPS

### Screen 1: OVERVIEW Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > OVERVIEW                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INGESTION PROGRESS        DATA QUALITY SCORE       NEXT ACTIONS│
│  ┌──────────────┐         ┌────────────────┐      ┌────────────┐│
│  │ 5 sources    │         │ 86% Overall    │      │ 2 conflicts│
│  │ active       │         │ ✓ (Gate Pass)  │      │ ready to   │
│  │ 2,847 items  │         │                │      │ review     │
│  │ discovered   │         │ Completeness:  │      │            │
│  │              │         │ 78%            │      │ Map 45     │
│  │ [View all]   │         │ Consistency:   │      │ fields     │
│  │              │         │ 92%            │      │            │
│  │              │         │ Validity:      │      │ Review 12  │
│  │              │         │ 88%            │      │ duplicates │
│  └──────────────┘         └────────────────┘      └────────────┘
│
├──────────────────────────────────────────────────────────────────┤
│ DATA SOURCE TIMELINE (Last 24 hours)                             │
│                                                                  │
│  09:15  ✓ CMDB Sync               1,245 items   +892 new       │
│  08:30  ✓ Excel Upload (prod)       487 items   +45 duplicates │
│  07:45  ⚠ Network Discovery         515 items   2 errors       │
│  06:20  ✓ Manual Entry               8 items    +1 updated     │
│  05:10  ✓ Cluster K8s Sync          592 items   +12 new        │
│
│  [More history...]
│
├──────────────────────────────────────────────────────────────────┤
│ COMPLETION FUNNEL                                                │
│                                                                  │
│  Discovered      ██████████░░░░░░  2,847 items (100%)           │
│  Staged          ████░░░░░░░░░░░░    412 items  (14%)           │
│  Mapped          █████████░░░░░░░  2,521 items  (89%)           │
│  Normalized      █████████░░░░░░░  2,498 items  (88%)           │
│  Consolidated    ████████░░░░░░░░░  2,435 items  (86%)          │
│  Ready to Publish ████████░░░░░░░░░  2,435 items  (86%)         │
│                                                                  │
│                   [▶ Proceed to Publish]                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Screen 2: DISCOVER - Data Source Management

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > DISCOVER                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SELECT DATA SOURCE TYPE:                                        │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ 📄           │ │ 📊           │ │ 📝           │             │
│  │ FILE UPLOAD  │ │ SPREADSHEET  │ │ MANUAL ENTRY │             │
│  │              │ │ (Excel/CSV)  │ │              │             │
│  │ Single or    │ │ Multi-sheet  │ │ Individual   │             │
│  │ batch files  │ │ support      │ │ or bulk add  │             │
│  │              │ │              │ │              │             │
│  │ [CONFIGURE]  │ │ [CONFIGURE]  │ │ [CONFIGURE]  │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ 🔗           │ │ 📡           │ │ 🔍           │             │
│  │ CMDB (SOON)  │ │ CLUSTER      │ │ NETWORK      │             │
│  │              │ │ SERVICES     │ │ DISCOVERY    │             │
│  │ Real-time    │ │ (FUTURE)     │ │ (FUTURE)     │             │
│  │ sync         │ │              │ │              │             │
│  │ OAuth2       │ │ K8s, Docker  │ │ Active scan  │             │
│  │ [COMING]     │ │ [SOON]       │ │ [SOON]       │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ ACTIVE DATA SOURCES                                              │
│                                                                  │
│ Name          Type     Status    Items   Last Updated      Actions
│─────────────────────────────────────────────────────────────────│
│ prod-excel    Excel    ✓ Active   487    2m ago       [Setup] [Stop]
│ prod-cmdb     CMDB     ✓ Active 1,245    5m ago       [Setup] [Stop]
│ prod-network  Network  ⚠ Error    515    Failed       [Retry] [Stop]
│ prod-manual   Manual   ✓ Active     8    30m ago      [Setup] [Stop]
│ k8s-cluster   Cluster  ✓ Active   592    1m ago       [Setup] [Stop]
│                                                                  │
│                      [+ Add Data Source]                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Screen 3: STAGE & REVIEW - Validation & Conflicts

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > STAGE & REVIEW                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STAGING ITEMS TO REVIEW                                         │
│  Filters: [All Sources ▼] [All Types ▼] [Show: All ▼]           │
│  Search: [_________________________] [⚙ Advanced]                │
│                                                                  │
│  ISSUES SUMMARY: 412 items staged | 34 need action              │
│  ⚠ Critical: 3 items | ⚠ Warnings: 34 items | ✓ Ready: 375      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Item Name      Source    Type   Quality Score  Status      Action
│────────────────────────────────────────────────────────────────── │
│ prod-app01     prod-excel Server    95% ✓    Ready      [Review] │
│ prod-app02     prod-excel Server    92% ✓    Ready      [Review] │
│ prod-db01      prod-excel DB        88% ⚠    Review     [Details]│
│ prod-storage   network   Storage    78% ⚠    Review     [Details]│
│ ⚠ prod-web01   prod-excel Server    45% ✗    Conflict   [Resolve]│
│ ⚠ prod-web02   prod-excel Server    ⚠ ✗    Conflict   [Resolve]│
│ ⚠ test-app01   prod-manual App      38% ✗    Error      [Details]│
│                                                                  │
│  [View More]                           [Mark All Ready] [Next →] │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

DETAIL PANEL (On Item Selection):
┌──────────────────────────────────────────────────────────────────┐
│ prod-db01                          [Close]                       │
├──────────────────────────────────────────────────────────────────┤
│ QUALITY ASSESSMENT:                                              │
│ Completeness: 92% (missing: owner_email, backup_schedule)       │
│ Consistency: 88% (os_version format inconsistent)                │
│ Validity:    85% (cpu_cores > max allowed for instance type)    │
│ Overall:     88% ⚠ (Gateway: ≥75%)                              │
│                                                                  │
│ QUALITY ISSUES (Click to resolve):                              │
│ □ owner_email is required (missing)                             │
│ □ os_version should be one of [RHEL 7, RHEL 8, Ubuntu 20.04]  │
│ □ cpu_cores (32) exceeds max (16) for instance_type             │
│                                                                  │
│ CONFLICT RESOLUTION:                                             │
│ □ Potential duplicate with: prod-db01-uat                      │
│   Suggested action: Merge                                       │
│   CMDB says: prod-db01 (primary), Network Discovery says: dev   │
│   Resolution: Keep CMDB value ✓                                 │
│                                                                  │
│ RAW DATA PREVIEW:                                                │
│ {                                                               │
│   "hostname": "prod-db01",                                      │
│   "ip_address": "10.50.1.15",                                   │
│   "os": "RedHat RHEL 8",                                        │
│   "cpu_cores": 32,                                              │
│   ...                                                           │
│ }                                                               │
│                                                                  │
│                     [← Back] [Save Changes] [Mark Ready →]      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Screen 4: STRUCTURE - Field Mapping

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > STRUCTURE                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ MAPPING PROFILE: prod-excel (Servers)                            │
│                                                                  │
│ FIELD MAPPING TABLE:                                             │
│                                                                  │
│ Raw Field       → Target Entity/Field         Required Validation
│─────────────────────────────────────────────────────────────────│
│ hostname        → ComputeInstance.hostname    ✓ Required   ✓    │
│ ip_address      → NetworkInterface.address   ✓ Required   ✓    │
│ os              → ComputeInstance.osType     ✓ Required   ✓    │
│ cpu_cores       → ComputeInstance.vcpus      ✓ Required   ✓    │
│ ram_gb          → ComputeInstance.memory     ✓ Required   ✓    │
│ location        → Asset.location             ✓ Required   ✓    │
│ owner           → Asset.owner                ✗ Optional   ✓    │
│ notes           → Asset.notes                ✗ Optional   ✓    │
│ ⚠ serial        → [Select Target...] ▼       ✗ Optional   ⚠    │
│ ⚠ warranty      → [Select Target...] ▼       ✗ Optional   ⚠    │
│                                                                  │
│ MAPPING SUMMARY:                                                 │
│ ✓ 8 fields mapped to required targets                           │
│ ⚠ 2 fields unmapped (serial_number, warranty_exp)              │
│ ✓ 0 mapping conflicts                                           │
│                                                                  │
│ PREVIEW (Mapped values from first 3 items):                     │
│ hostname     ip_address      osType          vcpus  memory      │
│ prod-app01   10.50.1.10      RHEL 8          16     64GB        │
│ prod-app02   10.50.1.11      RHEL 8          16     64GB        │
│ prod-db01    10.50.1.15      RHEL 7          32     256GB       │
│                                                                  │
│                   [Save Mapping] [Next →]                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Screen 5: TRANSFORM - Normalization Rules

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > TRANSFORM                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ NORMALIZATION RULES: prod-excel (Servers)                        │
│                                                                  │
│ Target Field    Normalization Rule              Coverage   Status
│────────────────────────────────────────────────────────────────── │
│ hostname        Lowercase, Trim whitespace      487/487    ✓     │
│ osType          Standardize to [list]           487/487    ✓     │
│ vcpus           Convert to Integer              486/487    ⚠     │
│ memory          Convert to Integer (GB)         486/487    ⚠     │
│ location        Validate against Config list    487/487    ✓     │
│                                                                  │
│ TRANSFORMATION PREVIEW:                                          │
│                                                                  │
│ RAW DATA              AFTER TRANSFORMATION       ISSUES           │
│─────────────────────────────────────────────────────────────────│
│ HOSTNAME: "PROD-APP01"  hostname: "prod-app01"   ✓              │
│ OSTYPE: "RHEL8"         osType: "RHEL 8"         ✓              │
│ CPUS: "16"              vcpus: 16 (int)          ✓              │
│ RAM: "64"               memory: 64 (int)         ✓              │
│ LOC: " USA-NY "         location: "USA-NY"       ✓              │
│ OWNER: "john@co"        (mapped)                 ✓              │
│ SERIAL: "ABC-123"       (unmapped, preserved)    ⚠ INFO         │
│ WARRANTY: "2025-12-31"  (unmapped, preserved)    ⚠ INFO         │
│                                                                  │
│ ITEM 4/487              ⚠ ERROR: cpu value "X" cannot convert   │
│                                                                  │
│ ┌─────────────────────────────────────────────────────┐         │
│ │ [Prev] [1] [2] [3] [4] ← [Next]                    │         │
│ └─────────────────────────────────────────────────────┘         │
│                                                                  │
│                   [Review Errors] [Apply All] [Next →]          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Screen 6: CONSOLIDATE - Multi-Source Aggregation

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > CONSOLIDATE                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ CONSOLIDATION RULES: All Sources                                 │
│ Aggregated Items: 2,435 | Unique Assets: 2,312 | Conflicts: 34  │
│                                                                  │
│ PRIMARY KEY (Uniqueness):                                        │
│ [ComputeInstance.hostname] + [Asset.location]                   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ FIELD-LEVEL MERGE RULES:                                         │
│                                                                  │
│ Field          Merge Strategy      Source Priority    Conflicts  
│─────────────────────────────────────────────────────────────────│
│ hostname       Primary Key         N/A                0          │
│ osType         Most recent         CMDB > Excel > Net 0          │
│ vcpus          Maximum             CMDB > Excel       0          │
│ memory         Maximum             CMDB > Excel       0          │
│ location       Most complete       CMDB > Manual      4 ⚠       │
│ owner          Source priority     CMDB > Excel       2 ⚠       │
│ last_update    Most recent         CMDB > Excel > Net 0          │
│                                                                  │
│ [Edit Rules]                                                     │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ DETECTED CONFLICTS (34 items) - Click to resolve:               │
│                                                                  │
│ Hostname  Source1 Value1        Source2 Value2         Status   
│────────────────────────────────────────────────────────────────── │
│ prod-app01 CMDB: 16 vcpus      Excel: 8 vcpus      Keep CMDB ✓ │
│ prod-db02  Excel: owner=DBA   CMDB: owner=DBA      Merge ✓    │
│ net-dev01  Network: EU-DC1    Manual: EU-DC2       ⚠ Review   │
│ prod-web02 CMDB: 2022-11-15   Excel: 2022-10-20    Keep newer ✓ │
│ prod-cache Network: 128GB      Excel: 64GB          Keep max ✓  │
│                                                                  │
│ [Resolve All with Defaults]          [Custom Resolutions]       │
│                                                                  │
│                   [Review Consolidated Data] [Next →]           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Screen 7: PUBLISH - Quality Gates & Publication

```
┌──────────────────────────────────────────────────────────────────┐
│ PREPARE > PUBLISH                                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ PUBLICATION CHECKLIST:                                           │
│                                                                  │
│ ☑ All data sources connected (5 active)                         │
│ ☑ 2,847 items discovered & ingested                             │
│ ☑ 412 items staged & reviewed                                   │
│ ☑ Field mappings complete (89%, 2 unmapped fields)              │
│ ☑ Data normalized & standardized (486/487 valid)                │
│ ☑ Duplicates resolved (34 conflicts resolved)                   │
│ ☑ Data consolidated (2,312 unique assets)                       │
│ ☑ Quality gates verified (8/8 passing)                          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ QUALITY GATE STATUS:                                             │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Metric              Threshold  Actual  Status     Impact    │  │
│ │────────────────────────────────────────────────────────────│  │
│ │ Completeness        ≥ 75%      78%    ✓ PASS      OK        │  │
│ │ Consistency         ≥ 85%      92%    ✓ PASS      GOOD      │  │
│ │ Validity            ≥ 80%      88%    ✓ PASS      GOOD      │  │
│ │ Duplicate Rate      ≤ 5%       1.2%   ✓ PASS      GOOD      │  │
│ │ Mapping Coverage    ≥ 85%      89%    ✓ PASS      GOOD      │  │
│ │ Error Items         ≤ 2%       0.2%   ✓ PASS      GOOD      │  │
│ │ Source Validation   100%       100%   ✓ PASS      GOOD      │  │
│ │ Overall Quality     ≥ 80%      86%    ✓ PASS      READY ✓   │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ GATE RESULT: ✓✓✓ ALL GATES PASSED - READY FOR PUBLICATION       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ DATA SUMMARY FOR MAP PHASE:                                      │
│                                                                  │
│ Asset Type         Total   Fully Mapped   Ready for Map   Ready  
│────────────────────────────────────────────────────────────────── │
│ Compute Instance   1,245     1,203 (97%)    1,203 (97%)   ✓     │
│ Database           567       512 (90%)      512 (90%)     ✓     │
│ Network Interface  456       398 (87%)      398 (87%)     ✓     │
│ Storage            89        73 (82%)       73 (82%)      ✓     │
│ Application        78        51 (65%)       51 (65%)      ⚠     │
│                                                                  │
│ TOTAL ITEMS:       2,435     2,237 (92%)    2,237 (92%)   READY  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [◀ Back to Review]  [Re-run Quality Checks]  [▶ PUBLISH TO MAP] │
│                                                                  │
│ Note: Publishing will snapshot data and send to Map phase.      │
│ Data will become read-only here until new cycle begins.         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## PART 4: INTERACTIVE ELEMENTS & DIALOGS

### Conflict Resolution Modal

```
┌──────────────────────────────────────────────────────┐
│ RESOLVE CONFLICT                              [×]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Item: prod-app01                                    │
│ Detected Duplicate With: prod-app01-copy            │
│ Field in Conflict: location                         │
│                                                      │
│ SOURCE 1 (CMDB):                                    │
│ ✓ hostname: prod-app01                             │
│ ✓ osType: RHEL 8                                   │
│ ✓ location: USA-NY-DC1    ← Different              │
│ ✓ owner: john@company.com                          │
│                                                      │
│ SOURCE 2 (Excel - prod):                            │
│ ✓ hostname: prod-app01                             │
│ ✓ osType: RHEL 8                                   │
│ ✓ location: USA-NJ-DC1    ← Different              │
│ ○ owner: (not specified)                           │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ RESOLUTION OPTIONS:                                 │
│                                                      │
│ ○ KEEP CMDB VALUE                                  │
│   location: USA-NY-DC1 (Source: CMDB)              │
│   Reason: CMDB is authoritative source             │
│                                                      │
│ ○ KEEP EXCEL VALUE                                 │
│   location: USA-NJ-DC1 (Source: Excel - prod)      │
│                                                      │
│ ○ MANUAL ENTRY                                      │
│   location: [_____________]                        │
│                                                      │
│ ○ MERGE (Keep both as array)                        │
│   location: [USA-NY-DC1, USA-NJ-DC1]               │
│                                                      │
│ ○ MARK FOR REVIEW                                   │
│   (Manual review required later)                   │
│                                                      │
│ ℹ Recommended: Keep CMDB value                      │
│   (CMDB is source of truth per consolidation rules) │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ [Cancel]  [Apply to All Similar]  [Resolve]        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### File Upload Wizard

```
STEP 1: SELECT FILE
┌──────────────────────────────────────────────────────┐
│ Select Excel or CSV File                             │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Drag file here or [Browse]                      │ │
│ │                                                  │ │
│ │ Supported: .xlsx, .xls, .csv                     │ │
│ │ Max size: 100 MB                                 │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ [Next]                                              │
└──────────────────────────────────────────────────────┘

STEP 2: CONFIGURE IMPORT
┌──────────────────────────────────────────────────────┐
│ Configure Import Settings                            │
│                                                      │
│ File: production-servers.xlsx                        │
│ Sheet: [Servers ▼]                                  │
│ Header Row: [1 ▼] (Uses row 1 for field names)     │
│ Item Type: [Compute Instance ▼]                     │
│ Skip Rows: [_____]  (Skip first N rows)             │
│                                                      │
│ [Detect Headers] [Advanced Options ▼]               │
│                                                      │
│ [Previous] [Next]                                   │
└──────────────────────────────────────────────────────┘

STEP 3: PREVIEW DATA
┌──────────────────────────────────────────────────────┐
│ Preview & Field Mapping                              │
│                                                      │
│ Preview of first 5 rows:                             │
│                                                      │
│ hostname     │ ip_address  │ os          │ cpu │ ram
│──────────────┼─────────────┼─────────────┼─────┼────
│ prod-app01   │ 10.50.1.10  │ RHEL 8      │ 16  │ 64
│ prod-app02   │ 10.50.1.11  │ RHEL 8      │ 16  │ 64
│ prod-db01    │ 10.50.1.15  │ RHEL 7      │ 32  │ 256
│ prod-web01   │ 10.50.2.10  │ Ubuntu 20.04│ 8   │ 32
│ prod-web02   │ 10.50.2.11  │ Ubuntu 20.04│ 8   │ 32
│                                                      │
│ Detected 487 items total                             │
│ [✓] 485 valid items                                  │
│ [⚠] 2 items with issues (preview)                   │
│                                                      │
│ [Review Issues] [Map Fields Manually]                │
│                                                      │
│ [Previous] [Upload]                                  │
└──────────────────────────────────────────────────────┘

STEP 4: CONFIRMATION
┌──────────────────────────────────────────────────────┐
│ Upload Complete                                      │
│                                                      │
│ ✓ 487 items imported successfully                   │
│ ⚠ 2 items have warnings (review recommended)        │
│                                                      │
│ Upload ID: uploads_20240101_prod_excel_001           │
│ Upload Time: 2024-01-15 09:15:30 UTC                 │
│                                                      │
│ Next Step: Items are now in Staging.                │
│ Review quality metrics and conflicts in Stage & Review.
│                                                      │
│ [View in Stage & Review] [Start New Upload]          │
└──────────────────────────────────────────────────────┘
```

---

## PART 5: RESPONSIVE DESIGN

### Mobile Layout (< 768px)

The 7-phase workflow tabs collapse to a scrollable list:

```
┌─────────────────────────────────┐
│ PREPARE              [≡]        │
├─────────────────────────────────┤
│ Stages ▼                         │
│ ↓                               │
│ 1. Overview (current)           │
│ 2. Discover                     │
│ 3. Stage & Review               │
│ 4. Structure                    │
│ 5. Transform                    │
│ 6. Consolidate                  │
│ 7. Publish                      │
│                                 │
│ CURRENT: OVERVIEW               │
│                                 │
│ [Show metrics in stacked cards] │
│                                 │
│ [Progress to Discover →]        │
│                                 │
└─────────────────────────────────┘
```

Data tables switch to card view on mobile:

```
┌─────────────────────────────┐
│ prod-app01                  │
├─────────────────────────────┤
│ Source: prod-excel          │
│ Type: Server                │
│ Quality: 95% ✓              │
│ Status: Ready               │
│ [Review] [Details]          │
└─────────────────────────────┘
```

---

## PART 6: ACCESSIBILITY FEATURES

- **Keyboard Navigation**: All interactive elements accessible via Tab
- **Focus States**: Clear 2px outline on all focusable elements
- **Color Contrast**: WCAG AA compliant (4.5:1 for normal text)
- **ARIA Labels**: Proper labels on all form inputs, buttons
- **Screen Reader Support**: Logical reading order, semantic HTML
- **Status Updates**: Progress indicators announced via ARIA live regions

---

This design system provides a complete foundation for implementing the modernized Prepare module UI consistently across all screens and components.
