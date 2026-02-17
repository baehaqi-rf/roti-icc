---
name: test-automation-engineer
description: Implements comprehensive testing strategies including unit, integration, and end-to-end tests. Ensures code reliability, prevents regressions, and maintains test coverage. Use when building new features, refactoring, or setting up CI/CD pipelines.
---

# Test Automation Engineer

## Testing Philosophy

**Test Pyramid:**
- **70% Unit Tests** (fast, isolated, test functions/classes)
- **20% Integration Tests** (test API endpoints, database interactions)
- **10% E2E Tests** (test full user flows in browser)

**Golden Rules:**
- Write tests BEFORE fixing bugs (TDD for bug fixes)
- Test behavior, not implementation details
- Keep tests independent (no shared state)
- Fast feedback loop (unit tests < 1s total)

## Unit Testing

```typescript
// Vitest / Jest example
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './cart';

describe('calculateDiscount', () => {
  it('applies 10% discount for orders > $100', () => {
    const result = calculateDiscount(150, 'SAVE10');
    expect(result).toBe(135); // 150 - 15
  });

  it('throws error for invalid coupon', () => {
    expect(() => calculateDiscount(150, 'INVALID'))
      .toThrow('Invalid coupon code');
  });

  it('handles zero amount', () => {
    const result = calculateDiscount(0, 'SAVE10');
    expect(result).toBe(0);
  });
});
```

## Mocking External Dependencies

```typescript
import { vi } from 'vitest';
import { getUser } from './api';

// Mock database
vi.mock('./database', () => ({
  db: {
    user: {
      findUnique: vi.fn().mockResolvedValue({ 
        id: 1, 
        name: 'Test User' 
      })
    }
  }
}));

describe('getUser', () => {
  it('fetches user from database', async () => {
    const user = await getUser(1);
    expect(user.name).toBe('Test User');
  });
});
```

## Integration Testing (API)

```typescript
import request from 'supertest';
import { app } from './server';

describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'John',
      email: 'john@example.com'
    });
  });

  it('returns 400 for invalid email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'invalid' })
      .expect(400);
  });
});
```

## E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can complete checkout flow', async ({ page }) => {
  // Navigate to products
  await page.goto('/products');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart-1"]');
  await page.click('[data-testid="cart-icon"]');
  
  // Verify cart
  await expect(page.locator('.cart-item')).toHaveCount(1);
  
  // Checkout
  await page.click('[data-testid="checkout-btn"]');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="card"]', '4242424242424242');
  await page.click('[data-testid="submit-payment"]');
  
  // Verify success
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Test Coverage

```bash
# Run tests with coverage
npm run test -- --coverage

# Coverage thresholds in vitest.config.ts
export default {
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      lines: 80,
      functions: 80,
      branches: 80,
    }
  }
}
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Test Data Setup

```typescript
// beforeEach hook for clean state
import { beforeEach, afterEach } from 'vitest';

beforeEach(async () => {
  // Reset database
  await db.$executeRaw`TRUNCATE TABLE users CASCADE`;
  
  // Seed test data
  await db.user.create({
    data: { name: 'Test', email: 'test@example.com' }
  });
});

afterEach(async () => {
  // Cleanup
  await db.$disconnect();
});
```

## Best Practices

- **Use data-testid** for stable selectors (not CSS classes)
- **Test critical paths** (login, checkout, payment)
- **Parallelize tests** (Playwright sharding, Vitest workers)
- **Mock slow external APIs** (payment gateways, email)
- **Keep E2E tests minimal** (they're slow and flaky)
- **Run tests in CI** on every PR

## Testing Checklist

- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Test coverage > 80%
- [ ] Tests run in CI/CD
- [ ] No flaky tests (fix or remove)
- [ ] Fast test suite (< 30s for unit/integration)

## Anti-Patterns

❌ Testing implementation details (internal state)
❌ Brittle selectors (.css-abc123)
❌ Tests depend on execution order
❌ No assertions (test passes but checks nothing)
❌ Slow tests blocking development
❌ Testing everything (focus on critical paths)
