---
trigger: always_on, model_decision
description: Unified standards for Logging, Metrics, and Tracing using OpenTelemetry.
---

# 👁️ Observability Standards

**"If it's not logged, it didn't happen."**

## 1. The Mandate: Log All Operations

**Every operation entry point MUST be logged.**
*   **Includes:** API endpoints, Background Jobs, Event Consumers, DB Transactions.
*   **Excludes:** Internal utility functions, pure logic.

### Minimum Log Requirements
1.  **Start:** With `correlationId`, `operation`, `userId`.
2.  **Success:** With `duration` (ms), result identifiers.
3.  **Failure:** With `error` stack trace.

## 2. Implementation Principles

### Structured Logging
*   **Format:** JSON in Production. Pretty-print allowed in Dev.
*   **No String Formatting:** Use key-value pairs.
    *   ❌ `log.info("User " + id + " logged in")`
    *   ✅ `log.info("user_login", { expected_user_id: id })`
*   **Standard Fields:**
    *   `correlationId`: UUID traced across services.
    *   `operation`: Clear name (e.g., `create_order`).
    *   `duration_ms`: Execution time.
    *   `level`: INFO (default), DEBUG (verbose), ERROR (failures), FATAL (crash).

### Privacy & Security
*   **Redaction:** Scrub PII, Passwords, Tokens, Credit Cards.
*   **Mechanism:** Use logger middleware (pino-redact) rather than manual checking.

## 3. Engineering Standards (OpenTelemetry)

### Tracing
*   **Standard:** Propagate W3C `Trace Context` headers (`traceparent`).
*   **Instrumentation:** Auto-instrument HTTP/DB frameworks. Manual spans for critical logic.
*   **Sampling:** 100% in Dev/Staging. 1-10% in Prod (Head-based). Always sample errors.

### Metrics (The Golden Signals)
*   **Rate:** Requests/ops per second.
*   **Errors:** Failed / Total.
*   **Duration:** Latency (p50, p95, p99).
*   **Saturation:** Queue depth, CPU/Memory usage (USE method).

### Health Checks
*   `/health`: Liveness (Process is running).
*   `/ready`: Readiness (Dependencies configured and reachable).

## 4. Implementation Snippets

**Go (Slog)**
```go
logger.Info("op_start", "correlationId", cid, "op", "create_user")
// ...
logger.Error("op_fail", "correlationId", cid, "err", err)
```

**Node (Pino)**
```javascript
logger.info({ correlationId, op: 'create_user' }, 'starting operation');
```

## 5. Checklist
- [ ] Correlation IDs generated at ingress
- [ ] Logs are structured JSON
- [ ] PII is redacted
- [ ] Trace Context propagated to downstream services
- [ ] Golden Signals (Rate, Errors, Duration) monitored
