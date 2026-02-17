---
trigger: model_decision
description: Standards for implementing concurrent, parallel, and threaded code safely.
---

# ⚡ Concurrency Standards

## 1. Core Mandate

**Don't Optimize Prematurely.**
*   **Complexity:** Concurrency adds significant complexity (race conditions, deadlocks).
*   **Justification:** Use only when there is a measurable performance benefit.
*   **Profile First:** Prove the bottleneck before spinning up threads.

### When to Use
*   **I/O Bound:** Async/Await, Event Loops. (Network, DB, Disk).
*   **CPU Bound:** Parallel Workers, Thread Pools. (Encoding, Data Science).

## 2. Implementation Principles

### Safety First
1.  **Avoid Shared Mutable State:** This is the root of all evil.
2.  **Prefer Message Passing:** "Share memory by communicating, don't communicate by sharing memory" (Go/Rust model).
3.  **Immutability:** Immutable data is thread-safe by default.

### Preventing Hazards
*   **Race Conditions:** Use synchronization (Mutex, Atomic) if shared state is unavoidable. Check with `-race` detectors.
*   **Deadlocks:**
    *   Lock Ordering: Always acquire locks in the same order.
    *   Timeouts: Never wait for a lock forever.
    *   No Nested Locks: Avoid holding multiple locks if possible.

### Failure Handling
*   **Graceful Degradation:** One thread crash should not take down the system.
*   **Timeouts:** All concurrent operations must have a timeout.
*   **Backpressure:** Don't spawn infinite routines. Use bounded queues/pools.

## 3. Testing Strategies
*   **Determinism:** Test concurrent logic with mocked time or deterministic schedulers if possible.
*   **Stress:** Test limits (thread pool exhaustion, queue overflow).
*   **Detection:** Run tests with ThreadSanitizer or Race Detectors enabled in CI.
