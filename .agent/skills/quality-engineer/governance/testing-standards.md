---
trigger: always_on
description: Verification strategy, testing pyramid, and implementation standards.
---

# 🛡️ Testing Standards

## 1. The Strategy: The Test Pyramid

1.  **Unit Tests (70%):** Domain logic in isolation. Fast (<50ms). Mocks for everything external.
2.  **Integration Tests (20%):** Interactions with DB/API. Medium (100ms-5s). Use Testcontainers.
3.  **E2E Tests (10%):** Critical user journeys. Slow (>5s). Playwright.

## 2. Implementation Rules

### Co-location Rule
**"Unit/Integration tests live with the code. E2E tests live separately."**
*   `user.service.ts` -> `user.service.spec.ts`
*   `user.component.tsx` -> `user.component.test.tsx`

### AAA Pattern
```typescript
// Arrange
const user = { id: 1 };
// Act
const result = await service.get(user.id);
// Assert
expect(result).toBeDefined();
```

### Naming Conventions
*   `should [behavior] when [condition]`
*   Example: `should return 404 when user_id is missing`

## 3. Test Doubles
*   **Unit:** Mock connectors/repositories.
*   **Integration:** Real DB (Testcontainers), Wiremock for APIs.

## 4. E2E with Playwright
*   **Snapshots:** Capture accessible state, not just pixels.
*   **Artifacts:** Take screenshots on failure and for walkthrough documentation.
*   **Cleanliness:** Always clean up test data.

## 5. Coverage Goals
*   **Unit:** >85% Coverage.
*   **Critical Paths:** 100%.
