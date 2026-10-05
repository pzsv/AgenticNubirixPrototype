# Nubirix – Simplify for Testing: Four Planning Briefs

**Status**: Planning briefs, not yet implemented
**Date**: 2026-10-05
**Scope**: Narrow the tested asset and scenario set, consolidate screens without losing functionality, and make Help usable. Nothing in this document changes code; each brief is sized so it can become its own branch and pull request.

---

## 0. Why this document exists

The pipeline shape (Prepare → Map → Plan → Move → Evaluate) is right. The data in the prototype is wide but not connected, and the break is in one place: Standardisation.

What the seeded `prototype.db` shows today:

| Stage | Records |
|---|---|
| Discovered entities ingested (Prepare → Ingestion) | 535 |
| Discovered field values | 3,514 |
| Field mappings, all status `Pending`, no target entity set | 53 |
| Published configuration items (`configuration_items`) | 0 |
| AWIs / S2Ts / MDGs / waves / runbooks | 0 |

The demo workbooks in `specs/Nubirix_4_Input/data/demo_data_files/` carry 12 entity classes (Group, Company, Business Unit, Application Package, Web, Database, Application Software, Virtual Servers, Physical Servers, Clusters, plus Providers). The seeded data dictionary defines 9 entities (Database, Virtual Server, Physical Server, Application, Web, Network Device, Storage, Environment, Migration). Only four overlap by name. Because the names do not line up, no record has ever travelled from upload to runbook.

Everything downstream of Standardisation runs on seed or mock data:

- `renderPrepareNormalisation`, `renderPrepareAggregation`, `renderPreparePublish` in `static/js/modules/prepare-modernized.js` are static HTML. `publishToMap` only navigates to Map.
- `app/api/evaluate.py` returns hard-coded progress, TCO and risk numbers.
- `app/api/plan.py` recommendation and `app/api/move.py` runbook generation are mocks.

The four briefs below are ordered by dependency. Brief 1 makes an end-to-end test possible. Brief 2 removes the duplication that causes detail overload. Brief 3 is independent and cheap. Brief 4 is a working session, not code.

---

## Brief 1 – Golden Path: one dataset that travels the whole pipeline

### Goal
A tester can upload one small workbook and, without any other preparation, reach a generated runbook. Every step of Prepare and Map operates on that data, not on seed data.

### Scope decisions (the "narrowing")

Keep three entities as the test set:

| Entity | Key field (anchor) | Fields kept |
|---|---|---|
| Application | Application Name | Business Unit, Business Criticality, Application Category, RPO, RTO |
| Virtual Server | Server Name | Operating System, CPU Core Count, RAM (GB), Environment, Power State, IPv4 |
| Database | Database Name | Database Technology, Database Type, Database Version, Size (GB) |

Two relationship types stay: **AWI composition** (Application → Virtual Server / Database, from the existing `AWI_ingest` template) and **Dependency Link** (Application → Application, from the existing `Dep_Links_ingest` template).

Demoted from entity to standard value or attribute: Environment (PROD / TEST / DEV / STAGE on the server), Move Principle (a decision recorded on the S2T, not an asset).

Shelved for now (kept in the data model, not in the test dataset): Physical Server, Web, Network Device, Storage, Cluster, Group, Company, Business Unit, Application Software, Providers. Nothing is deleted; they are simply absent from the golden-path workbook and dictionary seed.

### Deliverables

1. **Golden-path workbook** `specs/Nubirix_4_Input/data/golden_path/golden_path_inventory.xlsx` with three sheets named exactly `Application`, `Virtual Server`, `Database`. Target sizes: ~10 applications, ~30 virtual servers, ~10 databases. Column headers follow the existing `Entity | Field` convention so the current ingest parser works unchanged. Anchors must be consistent across sheets and across the AWI and dependency templates (e.g. every server referenced by an AWI row exists in the Virtual Server sheet).
2. **Matching AWI and dependency files** `golden_path_awis.xlsx` and `golden_path_dep_links.xlsx` using the existing template column layouts. About 10 AWIs and 6 to 8 dependency links, enough for at least two MDGs to form.
3. **Dictionary seed aligned to the workbook**. In `app/services/storage.py`, `_seed_data_dictionary` seeds the three entities above with the listed fields and key flags, and standard values for Environment, Operating System, Database Technology, Business Criticality and Move Principle. The other six entities move to a second, opt-in seed function so they can be re-enabled later.
4. **Auto-match on field mapping**. When a data source is ingested, `field_mappings` rows whose `source_field` matches `Entity | Field` against a dictionary field of the same entity and name are created with `data_entity`, `target_field` and `status = 'Resolved'` already set. Exact match only; no fuzzy logic in this brief. This removes the 53-row manual mapping chore for the golden path while leaving manual mapping available for anything that does not match.
5. **Publish becomes real**. `POST /prepare/publish` reads discovered entities whose source has fully resolved mappings, builds one `ConfigurationItem` per discovered entity (`name` = anchor value, `type` = entity name in snake case, `properties` = mapped field values keyed by target field name), marks the discovered entities `Published`, and returns counts. `renderPreparePublish` shows live counts (entities, resolved mappings, CIs to be created, unresolved mappings blocking publish) instead of the hard-coded 1,245 / 12 / 100% / 0. `publishToMap` calls the endpoint and then navigates.
6. **Map → Source Data shows the published CIs**. `renderSourceData` in `static/js/modules/map.js` already groups CIs by type and matches them to entity names; verify the snake-case key matches and that the three entity tables render.
7. **One end-to-end test** in `tests/test_prototype.py`: ingest golden-path workbook → assert mappings auto-resolved → publish → assert CI count → ingest AWIs → ingest dependency links → create S2T → create MDG → create wave → generate runbook → dashboard counts ≥ 1.

### Out of scope
Normalisation and Aggregation logic (they stay as Preview screens, see Brief 2). Fuzzy field matching. Any change to Plan, Move or Evaluate mocks.

### Acceptance
- A fresh database plus the three golden-path files produces CIs, AWIs, S2Ts, MDGs, a wave and a runbook with no manual field mapping.
- The existing demo workbooks still ingest; their unmatched fields appear as `Pending` mappings as today.

### Size
Half a day to one day.

---

## Brief 2 – Navigation and module consolidation

### Goal
Every screen a tester sees has one purpose, appears in one place, and tells them where they are in the pipeline. No functionality is removed; duplicates are merged and mocked screens are labelled.

### Current duplication (what the code shows)

- **Old Menu** in `static/index.html` exposes a second Prepare (`prepare-legacy.js`, 710 lines). The modern upload path still depends on it: `showUploadModalModern` calls `window.showUploadModalOld`. The legacy module cannot simply be removed.
- **Discovered Data, Data Dictionary, Data Entities** exist three ways: as tabs inside Prepare → Standardisation, as routes in `static/js/app.js` (`case 'discovered-data'` etc.), and as a "Data Management" group in Help, even though the sidebar no longer lists them.
- **Data Entities and Data Dictionary are one concept stored twice.** `data_entities` + `data_entity_fields` (entity, field, anchor flag) and `data_fields` + `standard_values` (field, entity name as a string, allowed values). The mapping UI selects by entity name and field name while `field_mappings.data_dictionary_field_id` links to `data_fields`. The two can drift.
- **Home** is five static cards; it does not read any state.
- **Mocked screens** (Normalisation, Aggregation, Evaluate dashboard, Plan recommendation, Move runbook) look identical to real ones.

### Deliverables

1. **Shared upload modal.** Move the upload modal and its ingest call out of `prepare-legacy.js` into a new `static/js/modules/upload.js` exposed as `window.showUploadModal(onDone)`. Both Prepare flows call it. Legacy Prepare then has no callers from the modern path.
2. **Legacy flow behind a toggle.** The Old Menu block in `index.html` renders only when `localStorage.nubirix_show_legacy === 'true'` (or a config flag). Keep the `prepare-old` route and access-right feature so nothing breaks; it is just hidden by default.
3. **One Data Model screen.** Merge Data Entities and Data Dictionary into a single screen with the hierarchy Entity → Fields (key flag) → Allowed Values. Backend: keep both table sets for now but make `data_fields` rows derive from `data_entity_fields` (one-to-one, same id) so there is a single source of truth; `standard_values` hangs off that. The two existing API routers stay for compatibility; a new `GET /data-model` returns the nested structure the screen needs. Migration step in `_migrate_db` back-fills the link for existing rows.
4. **Three-section sidebar.**
   - *Workflow*: Home, Prepare, Map, Plan, Move, Evaluate
   - *Reference Data*: Data Model, Environments, Move Principles, Score Card
   - *Admin*: Project Management, User Management, Process Failures
   - Help stays at the top.
   Update the `features` list in `_seed_users` and `helpMapping` in `app.js` to match the new module keys; keep the old keys as aliases so existing access-right rows still apply.
5. **Prepare → Standardisation keeps two tabs** (Data Sources, Field Mapping). The Discovered Data view moves to Ingestion where it already appears as a tab; Data Entities and Data Dictionary tabs become a link to the Data Model screen.
6. **Pipeline-status Home.** Replace the five static cards with a stage strip that reads live counts: Data Sources, Resolved / Pending mappings, Published CIs, AWIs, Dependency Links, S2Ts, MDGs, Waves, Runbooks. Each stage shows its count, a status colour (empty / partial / complete) and the single next action ("Map 12 fields", "Publish 48 CIs", "Create first AWI"). One new endpoint `GET /pipeline/status` aggregates the counts from existing storage getters.
7. **Preview labels.** A small reusable badge `Preview – illustrative data` rendered at the top of Normalisation, Aggregation, Evaluate, and next to the Plan recommendation and Move runbook generator. Help pages for those steps get the same note.
8. **One screen pattern.** A shared `renderStepHeader(title, summary, primaryAction, helpId)` helper used by every step screen in Prepare and Map: title, one-sentence summary (from the Help content model, see Brief 3), one primary button, help link. Secondary actions go in a dropdown.

### Out of scope
Changing what any step does. Deleting the legacy module or legacy tables. Visual redesign beyond the shared header.

### Acceptance
- Sidebar shows exactly the three sections plus Help; Old Menu is hidden unless the toggle is set.
- Modern upload works with legacy scripts removed from `index.html` (temporary test, then restore behind the toggle).
- Data Model screen edits are reflected in Field Mapping dropdowns immediately.
- Home counts change after each pipeline action in the Brief 1 end-to-end test.

### Size
One to two days. Items 1, 2, 6 and 7 can ship first as a half-day slice; items 3 to 5 and 8 follow.

---

## Brief 3 – Help content model, glossary linking and short-plus-more

### Goal
Help is short by default, expandable on demand, searchable, cross-linked by explicit relationships and by glossary terms, and never drifts from the app because the app reads the same content.

### Current state (`static/js/modules/help.js`, 1,149 lines)
- `granularHelpContent` holds about 30 page objects with free-form keys (`description`, `significance`, `details[]`, `input`, `output`, `dataUsed`, `correlation`).
- The overview is ~400 lines of hand-written HTML duplicating the page summaries.
- "Related Steps" are computed by matching the second token of the page id (`pageId.split('-')[1]`). Pages such as `help-plan`, `help-move`, `help-evaluate` therefore show no related pages, and the Data Structures, App Logic, Migration Knowledge and 7 Rs sections cannot be linked to from any granular page.
- `helpMapping` in `app.js` sends several modules to anchors that only exist in the overview, not to granular pages.
- There is no search and no glossary.

### Deliverables

1. **Content model** in a new `static/js/help-content.js` (data only, no rendering):
   ```js
   {
     id: 'map-awis',
     module: 'map',            // for grouping and contextual help
     title: 'AWIs (Application Workload Instances)',
     icon: 'bi-box-seam',
     summary: 'One or two sentences. Shown everywhere by default.',
     sections: [ { heading, body } ],     // the "More…" content
     io: { input, output, data, next },   // optional, replaces input/output/dataUsed/correlation
     related: ['map-dependency-links', 'prepare-publish'],
     terms: ['AWI', 'CI', 'Golden Record'],
     preview: false                        // true for mocked steps (Brief 2)
   }
   ```
   Knowledge pages (Data Structures, App Logic, Migration Knowledge, each of the 7 Rs) become ordinary entries with `module: 'knowledge'` so they can be related and searched like everything else.
2. **Glossary** in the same file: `terms = { AWI: { full, short, pageId }, MDG: …, S2T: …, CI: …, 'Golden Record': …, Anchor: …, 'Standard Value': …, 'Data Entity': …, 'Move Principle': …, Wave: …, Runbook: …, 'Data Source': … }`. A renderer helper links the first occurrence of each term in a page body to its page and shows the `short` text as a tooltip.
3. **Short plus More.** Every page renders `summary` first, then a "More…" control that expands `sections` and `io`. The expanded state is remembered per page in `localStorage`. The overview page is generated from the content model (one card per module, summaries only, "Learn more" per page) and the hand-written HTML is deleted.
4. **Explicit related pages.** Replace the id-token heuristic with the `related` list, plus an automatic "Also in this module" list from `module`.
5. **Search.** A search box on the Help landing page filtering on title, summary, terms and section headings. Results show the summary with a link.
6. **Contextual help uses the model.** `helpMapping` in `app.js` becomes `module + step → page id`, so every screen opens a granular page. The shared step header from Brief 2 shows the page `summary` inline with a "Learn more" link; the question-mark icon in the navbar keeps working.
7. **Data Structures generated live.** The Data Structures knowledge page reads `GET /data-entities` (or `GET /data-model` after Brief 2) and renders the real entities, fields and key flags, with the written explanation above it.

### Content rules for authors
- Summary ≤ 40 words, plain language, names the output of the step.
- Each section ≤ 120 words; split rather than lengthen.
- Prefer a term from the glossary over an inline definition; define each term once, in the glossary.
- Every page has at least one `related` entry pointing forward and one pointing backward in the pipeline.

### Out of scope
Rewriting the substance of the help text beyond trimming to the length rules. Server-side help storage.

### Acceptance
- `help.js` shrinks to rendering only; all text lives in `help-content.js`.
- Every sidebar module and every Prepare / Map step opens a granular help page from the question-mark icon.
- Searching "golden" returns Aggregation, Publish and the Golden Record glossary entry.
- No page has an empty Related list.

### Size
One day.

---

## Brief 4 – Asset and scenario scoring worksheet

### Goal
A repeatable, written method for deciding which asset types and which migration scenarios Nubirix targets, so the test set in Brief 1 is a defensible choice rather than a guess, and so future additions must pass the same bar.

### Method
Score each candidate asset type and each candidate scenario against five questions. The first three are gates: a candidate that fails any of them is shelved regardless of the rest.

| # | Question | Gate? | Scale |
|---|---|---|---|
| 1 | Does a standard discovery export carry it? (RVTools, CMDB dump, app inventory) | Yes | 0 = never, 1 = sometimes, 2 = always |
| 2 | Is it needed to make a migration decision? (sizing, move principle, wave assignment) | Yes | 0 / 1 / 2 |
| 3 | Does it have a deterministic move path? (the 7 Rs answer is usually obvious) | Yes | 0 / 1 / 2 |
| 4 | How often does it appear in real engagements? | No | 0 / 1 / 2 |
| 5 | Does the Nubirix pipeline already handle it end to end? | No | 0 / 1 / 2 |

### Candidate asset types to score
Application (Package), Virtual Server, Database, Physical Server, Web, Application Software, Cluster, Network Device, Storage, Environment, Business Unit / Company / Group hierarchy, Provider / Service.

Working hypothesis to validate in the session: Application, Virtual Server and Database score 2 on all three gates; Physical Server fails gate 3 in a cloud-target scenario (it usually needs virtualising first); Web and Application Software fail gate 2 as stand-alone entities but survive as fields on Application; the organisational hierarchy fails gate 1 and becomes attributes on Application; Network Device and Storage fail gate 3.

### Candidate scenarios to score
- VMware-virtualised on-premises estate → single public cloud, rehost / replatform dominant
- Data centre → data centre (relocate), same virtualisation platform
- On-premises → hybrid (part cloud, part retained)
- Multi-cloud consolidation
- Mainframe / legacy application refactor

Working hypothesis: the first scenario scores highest on gates 1 to 3 and on frequency. The second is close and reuses the same entities. The last three fail gate 3.

### Inputs for the session
- The last five to ten engagement wave plans or runbooks: list which CI types actually appeared in the final plans.
- The discovery exports those engagements started from: list which columns were present in every one of them.
- The business spec `specs/redesign/v1_very_experimental/01_business_current.md`, section "Current Capabilities by Phase", for the capability baseline.

### Output
A filled scoring table checked into `specs/redesign/v3_Simplify_For_Testing/ASSET_SCENARIO_SCORING.md`, plus a one-paragraph decision: the asset set and the scenario the prototype targets for the next phase, and the list of shelved candidates with the gate each one failed. Brief 1 is updated if the outcome differs from its working set.

### Size
A half-day working session. No code.

---

## Suggested sequencing

| Order | Brief | Depends on | Why this position |
|---|---|---|---|
| 1 | Golden Path | – | Makes end-to-end testing possible at all |
| 2 | Navigation consolidation | Brief 1 for the Home counts | Removes the duplication causing detail overload |
| 3 | Help content model | Brief 2 for the shared step header (optional) | Independent and cheap; can run in parallel with 2 |
| 4 | Scoring worksheet | – | Can happen any time; confirms or adjusts Brief 1's set |

Each brief is intended to become one branch and one pull request.
