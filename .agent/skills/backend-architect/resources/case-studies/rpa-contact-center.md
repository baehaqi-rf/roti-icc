# Research Log: RPA Contact Center "CountCurrent"

## 1. Context Analysis
**Request**: Create an RPA application to count/track "current" contact center metrics (Concurrency) with Monthly, Weekly, and Daily reporting.
**Key Constraints**: Use `.agent` rules (Feature-Sliced, Testability, etc.).
**Ambiguity**: "CountCurrent" likely refers to **Concurrent Calls/Chats**.
**Data Source**: Unknown. We will assume a **Mock Web Portal** or **Simulated API** for the prototype, enabling the user to swap in the real selector/endpoints later.

## 2. Architecture Decision Records (ADR)

### ADR-001: RPA Engine Selection
**Context**: We need a reliable browser automation tool to scrape data.
**Options**:
1.  **Playwright (Node.js)**: Native integration with the Next.js backend (if using Server Actions) or separate service. Strong TS support.
2.  **Playwright (Python)**: Standard for data science, but splits the stack.
3.  **Selenium**: Legacy, slower, harder to maintain.

**Decision**: **Playwright (Node.js)**
**Rationale**: Keeps the stack unified (TypeScript/JavaScript). We can run the RPA worker as a separate Node.js service or within a job queue (BullMQ) alongside the Next.js app. Easier to share types (DTOs) between Scraper and Dashboard.

### ADR-002: Data Storage for Time-Series
**Context**: We need to store concurrency data (timestamp, value, dimension) and query it efficiently for Daily/Weekly/Monthly aggregations.
**Options**:
1.  **PostgreSQL (Vanilla)**: Standard, reliable. Good enough for moderate volume.
2.  **TimescaleDB**: Extension for Postgres. Best for heavy time-series.
3.  **Redis**: Good for real-time "current" count, bad for historical analytics (Monthly).

**Decision**: **PostgreSQL (Vanilla)** (Start simple)
**Rationale**: We can use standard SQL `date_trunc` for rollups. If volume explodes, upgrade to TimescaleDB.

## 3. Reporting Logic Strategy
**Metric**: Concurrent Contacts (CC).
-   **Daily Report**: Hour-by-hour breakdown (Peak, Avg).
-   **Weekly Report**: Day-by-day (Monday-Sunday) breakdown.
-   **Monthly Report**: Week-by-week or Day-by-day trend.

**Implementation**:
-   **Ingest**: RPA Job runs every X minutes -> Inserts row `[timestamp, cc_value, raw_metadata]`.
-   **Aggregator**: SQL Views or Materialized Views for `dailies`, `weeklies`, `monthlies`.

## 4. Proposed Stack
-   **Repo**: Monorepo (`apps/web`, `apps/worker`).
-   **Web**: Next.js (App Router) + Tailwind + Recharts.
-   **Worker**: Node.js + BullMQ + Playwright.
-   **DB**: PostgreSQL.
