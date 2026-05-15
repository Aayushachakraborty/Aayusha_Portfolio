# Datanirnaya UI and Full-Stack Analysis

## Scope

This document analyzes `F:\Portfolio\PORTFOLIO\datanirnaya-react-v2\datanirnaya` from three angles:

- UI structure and visual system
- User journey and interaction model
- Frontend architecture, data model, and practical full-stack implications

The project is a single-page React dashboard for supply-chain and commerce analytics. It is built as a read-only insight console rather than a transactional app.

## Product Summary

The app presents business issues across four decision domains:

- Revenue
- Stock
- Marketing
- Product Health

It supports two market views:

- USA
- India

The user starts on an overview dashboard, then drills into issue-level detail, then into SKU-level detail through a modal. The entire experience is built around identifying flagged items, quantifying opportunity loss, and explaining likely root causes using a 4-Why pattern.

## Core UI Architecture

The interface is organized into three persistent regions:

1. Topbar
2. Sidebar
3. Main content area

### 1. Topbar

Purpose:

- Establish brand and product context
- Switch site/market
- Display environment metadata

Visible elements:

- Brand mark: `DataNirnaya`
- Tagline: `Supply Chain Intelligence`
- Site toggle tabs: `USA` and `India`
- Currency badges: `USD`, `INR`
- Demo indicator: `Demo Mode`
- Small operational summary: `270 SKUs · 4 Decision Engines`

User value:

- Immediately communicates this is a decision-support dashboard
- Lets users compare markets without leaving context
- Reinforces that data is demo/sample-driven

Implementation notes:

- Stateless presentation component
- Receives `site` and `onSiteChange`
- Site switch resets the user back to overview state in the parent app

### 2. Sidebar

Purpose:

- Act as the primary navigation tree
- Provide at-a-glance issue counts by domain and issue type

Navigation model:

- One top-level `Overview` item
- Four domain sections
- Each domain contains issue-level buttons

Domain grouping:

- Revenue
- Stock
- Marketing
- Product Health

Each section displays:

- Domain icon
- Domain label
- Total flagged count
- Issue rows with badge counts

User value:

- Fast drill-down into a specific business problem
- Good information scent because counts are visible before clicking
- Active state clearly shows the current selection

Implementation notes:

- Domain list is driven from shared constants
- Counts are computed from the loaded JSON
- Active item styling is color-coded by domain

### 3. Main Content Area

Purpose:

- Render either the strategic overview or the tactical issue investigation view

Behavior:

- Default state shows `Overview`
- Selecting a specific issue shows `IssueView`
- There is lazy loading with suspense fallback for both major views
- The app also handles loading and error states for data bootstrapping

## Screen and Interaction Mapping

## A. Overview Screen

This is the executive summary screen.

### A1. KPI Row

The top row uses six KPI cards:

- Total SKUs
- Revenue 30D
- OOS SKUs
- Ad Spend 30D
- Low Rating SKUs
- Avg DOS

Why it works:

- Gives a quick scan of business health
- Covers financial, inventory, marketing, and product quality signals
- Uses icons and domain-accent colors to reduce cognitive load

Data meaning:

- The cards are derived from `summary` data for the selected market
- Revenue trend compares 30-day revenue against a 90-day average

### A2. Charts Row

There are three chart panels:

- Opportunity Loss by Domain
- Flag Distribution
- Issue Count by Domain

Interpretation:

- First chart answers: where is money leaking?
- Second chart answers: how are issues distributed?
- Third chart answers: where is operational pressure highest?

Why this is useful:

- Creates a balanced view between financial risk and issue volume
- Encourages domain-based prioritization

### A3. Top Issues by Opportunity Loss

This is the highest-value interaction block in the overview.

Each row shows:

- Rank
- Issue name
- Domain label
- Relative loss bar
- Opportunity loss value
- SKU count

Interaction:

- Clicking a row drills directly into that issue

User value:

- Helps teams prioritize by business impact, not just count
- Converts summary analytics into actionable investigation

### A4. Domain Summary Cards

Each domain card displays:

- Domain name and icon
- Total flags
- Total opportunity loss
- Relative progress bar

Interaction:

- Clicking a domain calls selection with an empty issue

Practical note:

- In the current app logic, the detailed issue page only renders when both domain and issue are set
- So the domain card click updates navigation state, but it does not open a domain-only detail screen
- From a product perspective this creates a small UX gap

## B. Issue Detail Screen

This is the investigation workspace for one issue within one domain.

### B1. Header Summary

The header shows:

- Domain icon
- Issue title
- Item count
- Issue opportunity loss
- Domain opportunity loss reference
- Severity chips
- Chart toggle button

Why it matters:

- Gives context before the user scans the table
- Positions the issue within the wider domain impact

### B2. Category Breakdown Chart

Optional chart view toggled by the `Chart` button.

Purpose:

- Shows how the issue is distributed across product categories

User value:

- Helps identify whether the issue is broad or concentrated

### B3. Search and Sort Controls

Controls include:

- Free-text search
- Sort by opportunity loss
- Sort by revenue rank
- Sort by SKU
- Row count feedback

Search matches against:

- SKU
- Description
- Category
- Any 4-Why root cause text

User value:

- Strong for analyst workflows
- Search across root-cause text is especially useful

### B4. Data Table

This is the main work surface.

Shared columns:

- SKU
- Description
- Category
- Root Cause (4-Why)
- Opportunity Loss 30D
- Severity

Domain-specific extra columns:

Revenue:

- Rev 30D
- Rev 7D
- 30v90D%
- Rank
- Amz Stk

Stock:

- DOS
- Fill Rate
- OOS Days
- On Hand
- Fcst 30D

Marketing:

- Spend 30D
- CTR 30D
- CVR 30D
- ROAS
- TACoS

Product Health:

- Rating
- # Reviews
- Return%
- Unplanned%
- A+ Page

User value:

- Same table mental model across all domains
- Domain-specific metrics prevent clutter while keeping context relevant
- The 4-Why pills turn raw data into narrative reasoning

### B5. SKU Detail Modal

Clicking any table row opens a modal with deeper detail.

Modal sections:

- SKU identity and description
- Category badges
- Severity and opportunity loss
- Top extra metrics
- Full 4-Why root cause timeline
- Expanded key metrics grid
- Customer sentiment explanation when present

User value:

- Gives a focused inspection view without leaving the issue page
- Good for analyst review, stakeholder walkthroughs, and decision support

## Visual Design System

## Theme

The product uses a dark operations-dashboard aesthetic:

- Background-heavy layout
- Low-glare cards
- Small, dense typography
- Domain colors used as semantic signals

Primary semantic colors:

- Accent / healthy state: teal
- Revenue: red
- Stock: amber
- Marketing: blue
- Product Health: violet

## Typography

- `DM Sans` for interface text
- `DM Mono` for numeric and code-like values

Why this works:

- Sans-serif keeps the dashboard modern and readable
- Monospace improves scanning of metrics, IDs, and badges

## Interaction Style

- Subtle hover states
- Bordered cards
- Soft rounded corners
- Minimal animation
- Modal scale-in transition

This keeps the product feeling analytical and controlled rather than flashy.

## Responsiveness

Responsive behavior exists in parts of the app:

- KPI cards collapse from 6 columns to 3, then 2
- Chart row collapses to single-column
- Topbar hides some metadata on smaller screens
- The data table allows horizontal scrolling

Strength:

- Core content remains accessible on smaller screens

Limitation:

- This still behaves like a desktop-first analyst dashboard
- Sidebar persistence and dense tables will be harder on mobile users

## User Journey

Typical user path:

1. Open dashboard on `USA` or `India`
2. Review KPI and chart summary
3. Identify highest-loss issue from the ranked list
4. Drill into issue detail
5. Filter or sort rows
6. Open SKU modal
7. Read 4-Why reasoning and supporting metrics
8. Decide what action to take outside the app

This is a diagnosis workflow, not an execution workflow.

## Full-Stack Understanding

## Frontend Stack

- Vite
- React 19
- CSS Modules
- Lucide React icons
- Recharts for charts

Architecture characteristics:

- Single-page client-rendered dashboard
- No server-side rendering
- No live API layer
- No backend mutations
- No authentication or role logic

## Data Loading Strategy

The app loads a single file at runtime:

- `public/data/pipeline_slim.json`

Important implication:

- The 2.5 MB dataset is intentionally kept outside the JS bundle
- Initial UI loads first, then data is fetched
- This is good for bundle size, but still means runtime payload cost

## Data Model Shape

The dataset appears structured like:

- `site`
- `summary`
- `domain`
- `issue`
- `rows`

Conceptually:

```text
site -> domain -> issue -> sku rows
```

There is also a `summary` object per site that feeds top KPIs.

## State Model

The main app state is small and easy to reason about:

- `site`
- `activeDomain`
- `activeIssue`
- `dataReady`
- `dataError`

The issue page adds local interaction state:

- `search`
- `sortKey`
- `selectedRow`
- `showChart`

This is a clean state model for a read-only analytics console.

## Derived Intelligence Layer

The file `pipelineData.js` acts like a lightweight view-model or analytics adapter.

It is responsible for:

- Fetching raw JSON
- Aggregating counts
- Summing opportunity loss
- Formatting currency and percentages
- Building top-issue lists
- Extracting 4-Why statements
- Inferring severity labels
- Building category breakdown charts

This is important because the app is not just rendering raw data. It is transforming data into decision-ready views.

## Backend Perspective

There is no real backend in this implementation, but the UI strongly suggests the shape of a future one.

A production-ready backend would likely need:

- Market/site endpoints
- Domain and issue aggregations
- SKU-level drill-down endpoints
- Search/filter/query support
- Role-based access
- Freshness/version metadata
- Possibly event or alert generation

Recommended API thinking:

- Summary endpoint for KPIs and overview charts
- Domain endpoint for issue counts and opp-loss aggregates
- Issue endpoint for paginated SKU rows
- SKU endpoint for detailed root cause and sentiment

Right now, all intelligence is shipped as a static payload and computed in-browser.

## Strengths From a User Point of View

- Very clear drill-down hierarchy
- Strong business framing around opportunity loss
- Useful mix of summary, ranking, and detail
- Consistent domain color semantics
- Root-cause storytelling makes the data more actionable
- Search, sort, and modal flow fit analyst behavior well

## Weaknesses or UX Gaps

- Domain cards on overview look clickable for deeper navigation, but domain-only drill-down is not actually implemented
- The app is read-only, so insight-to-action handoff is external
- No date filter, time comparison selector, or trend exploration beyond the preset summary fields
- Severity is inferred with keyword rules, so it may feel simplistic in real use
- Large static JSON may become a bottleneck as data grows
- Mobile ergonomics are acceptable but not ideal for heavy table analysis

## Rebuild Recommendations

If this UI is being recreated or evolved, keep these priorities:

1. Preserve the drill-down structure: overview -> issue -> SKU modal
2. Keep opportunity loss as the main prioritization lens
3. Retain domain-specific table columns instead of forcing a one-size-fits-all schema
4. Make domain cards open a real domain summary page
5. Add explicit filters for date range, category, severity, and marketplace
6. Move from static JSON to API-backed aggregation when scale or freshness matters
7. Consider action hooks like assign, export, ticket, or remediation recommendation

## File-Level Mapping

Key files and responsibilities:

- `src/App.jsx`: app shell, data bootstrapping, route-like state switching
- `src/components/Topbar.jsx`: branding and site switching
- `src/components/Sidebar.jsx`: issue navigation tree
- `src/components/Overview.jsx`: executive dashboard view
- `src/components/IssueView.jsx`: issue investigation table and SKU modal
- `src/data/pipelineData.js`: data access, formatting, aggregation, derived logic
- `src/index.css`: design tokens and global visual language

## Final Assessment

Datanirnaya is a compact and well-structured analytics dashboard designed for investigation rather than operations execution. Its strongest quality is the clarity of its user flow: start with business health, move to issue prioritization, then inspect SKU-level root causes. From a frontend point of view, it is clean, modular, and easy to extend. From a full-stack point of view, it currently behaves like a static intelligence prototype that would benefit from a real API, better filtering, and stronger action pathways in a production setting.
