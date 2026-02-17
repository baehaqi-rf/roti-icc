
## Distributed Systems Mandate

### Philosophy
**"Assume the network will fail, the process will crash, and messages will arrive out of order."**

### 1. Idempotency
**Goal**: Ensure retrying a request (due to timeout/failure) does not perform the action twice.

-   **Requirement**: All state-mutating APIs (`POST`, `PATCH`) **MUST** accept and respect an `Idempotency-Key` header (UUID).
-   **Behavior**:
    -   If key seen before: Return stored response (cached).
    -   If key new: Process and store result.
    -   Atomic: Check-and-set of Idempotency Key + Operation must be atomic.

### 2. Eventual Consistency (Outbox Pattern)
**Goal**: Save data and publish event atomically.

-   **Problem**: Saving to DB succeeds, but publishing to Queue fails (dual writes).
-   **Solution**: Use **Transactional Outbox Pattern**.
    1.  Start DB Transaction.
    2.  Insert Entity.
    3.  Insert Event into `outbox` table.
    4.  Commit Transaction.
    5.  Async Worker polls `outbox` and publishes to Queue.

### 3. Background Jobs
**Goal**: Don't block HTTP requests on slow operations.

-   **Threshold**: Any operation > 500ms **MUST** be async.
-   **Pattern**:
    -   Return `202 Accepted`.
    -   Return `Location: /jobs/{jobId}` for status polling.
    -   Or use Webhooks/Websocket for completion notification.

### 4. Circuit Breaking & Retries
**Goal**: Prevent cascading failures.

-   **Retries**: Use **Exponential Backoff** with **Jitter**. Only retry retry-able errors (Network, 503). Do *not* retry 4xx errors.
-   **Circuit Breaker**: Fail fast if downstream service is down. Use strict timeouts.
