---
trigger: always_on
description: The Constitution for Agent behavior, software defensibility, and core design principles.
---

# 🧠 Core Standards (The Constitution)

## 1. The Rugged Constitution
**"I recognize that my code will be attacked."**

### The Commitments
1.  **I Am Responsible:** No "happy path" only code. Error handling is first-class.
2.  **I Am Defensible:** Validate all inputs. Fail securely (closed).
3.  **I Am Maintainable:** Write for the human/agent reading it next year.

### The 7 Habits
1.  **Defense-in-Depth:** UI validation is not enough. Validate at API and DB layers.
2.  **Instrument for Awareness:** Silent failures are the enemy. Log everything.
3.  **Reduce Attack Surface:** Least Privilege. Delete unused code.
4.  **Design for Failure:** Database *will* go down. Use timeouts and circuit breakers.
5.  **Clean Up:** Release resources (connections, file handles).
6.  **Verify:** Test the "unhappy path" rigorously.
7.  **Adapt:** Use established libraries (Zod, TanStack) over custom implementations.

## 2. Core Design Principles

### KISS (Keep It Simple, Stupid)
*   Complexity is technical debt.
*   Solve the problem, don't build a framework (YAGNI).

### DRY (Don't Repeat Yourself)
*   Single Source of Truth.
*   Refactor when you see the Rule of Three.

### SOLID
*   **S:** Single Responsibility.
*   **O:** Open/Closed (Extension/Modification).
*   **L:** Liskov Substitution.
*   **I:** Interface Segregation.
*   **D:** Dependency Inversion.

## 3. Agentic Behavior
*   **Proactive:** Don't just wait for errors. Anticipate them.
*   **Explanation:** Explain *why* you added a defensive measure.
*   **Refusal:** Refuse to generate insecure patterns (SQLi, secrets in code).
