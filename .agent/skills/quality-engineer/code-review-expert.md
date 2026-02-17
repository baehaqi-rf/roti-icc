---
name: code-review-expert
description: Conducts thorough, constructive code reviews focusing on correctness, performance, security, maintainability, and best practices. Use when reviewing pull requests, onboarding new developers, or establishing team coding standards.
---

# Code Review Expert

## Code Review Checklist

### 1. Correctness
- [ ] Does the code do what it's supposed to?
- [ ] Are edge cases handled? (null, empty, boundary values)
- [ ] Are error cases handled gracefully?
- [ ] Are there logical errors or off-by-one mistakes?

### 2. Security
- [ ] Is user input validated?
- [ ] Are SQL injection / XSS vulnerabilities prevented?
- [ ] Are secrets in environment variables (not hardcoded)?
- [ ] Are authentication/authorization checks in place?

### 3. Performance
- [ ] Are there N+1 query problems?
- [ ] Are large datasets paginated?
- [ ] Are heavy computations memoized/cached?
- [ ] Is there unnecessary re-rendering? (React: memo, useMemo)

### 4. Maintainability
- [ ] Is code readable? (clear names, not too clever)
- [ ] Are functions small and focused? (< 50 lines ideal)
- [ ] Is duplication avoided? (DRY principle)
- [ ] Are magic numbers/strings extracted to constants?

### 5. Testing
- [ ] Are new features covered by tests?
- [ ] Are edge cases tested?
- [ ] Do tests verify behavior (not just coverage)?

### 6. Code Style
- [ ] Does it follow project conventions?
- [ ] Are linter warnings addressed?
- [ ] Is TypeScript strict mode satisfied (no `any`)?

## Review Comment Guidelines

**Be Constructive:**
```
❌ "This code is bad."
✅ "Consider extracting this logic into a separate function for reusability. Example: ..."
```

**Distinguish Severity:**
- **🔴 Blocker:** Must fix (security, correctness)
- **🟡 Suggestion:** Nice to have (style, refactoring)
- **💬 Question:** "Why did you choose approach X?"

**Praise Good Work:**
```
✅ "Great job handling this edge case! I hadn't thought of that."
```

## Common Code Smells

### Long Functions
```typescript
// ❌ 200-line function doing everything
function processOrder() {
  // validate
  // calculate
  // save
  // send email
}

// ✅ Extract responsibilities
function processOrder() {
  validateOrder();
  const total = calculateTotal();
  saveOrder(total);
  sendConfirmationEmail();
}
```

### Magic Numbers
```typescript
// ❌
if (user.age > 18 && user.score > 100) { ... }

// ✅
const ADULT_AGE = 18;
const PASSING_SCORE = 100;
if (user.age > ADULT_AGE && user.score > PASSING_SCORE) { ... }
```

### Deeply Nested Logic
```typescript
// ❌
if (user) {
  if (user.isActive) {
    if (user.hasPermission('write')) {
      // do something
    }
  }
}

// ✅ Early returns
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission('write')) return;
// do something
```

### Inconsistent Naming
```typescript
// ❌ Mixed conventions
const user_name = 'John';
const UserAge = 25;

// ✅ Consistent camelCase
const userName = 'John';
const userAge = 25;
```

## Review Process

**For Reviewer:**
1. Understand context (read PR description)
2. Check CI status (tests passing?)
3. Review high-level changes first (architecture)
4. Then review details (line-by-line)
5. Test locally for complex changes
6. Leave constructive, specific comments
7. Approve or request changes

**For Author:**
1. Write clear PR description (what, why, how)
2. Keep PRs small (< 400 lines ideal)
3. Self-review before requesting review
4. Address all comments (fix or explain)
5. Thank reviewer for feedback

## Automation

**Pre-Commit Hooks:**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

**CI Checks:**
- Linting (ESLint)
- Formatting (Prettier)
- Type checking (TypeScript)
- Unit tests
- Coverage threshold

## PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Documentation updated
```

## Red Flags

🚩 No tests for new functionality  
🚩 Commented-out code left in PR  
🚩 Console.log statements in production code  
🚩 TODO comments without linked issues  
🚩 Large files changed (> 500 lines)  
🚩 Unrelated changes in single PR  

## Best Practices

**Focus on:**
- Correctness (does it work?)
- Security (is it safe?)
- Maintainability (can others understand?)
- Performance (is it efficient?)

**Don't:**
- Nitpick style (use automated formatters)
- Rewrite author's code (suggest, don't dictate)
- Approve without reading (rubber stamping)
- Block on personal preferences

## Anti-Patterns

❌ Nitpicking style issues
❌ Rewriting author's code
❌ Approving without reading
❌ Hostile tone
❌ Blocking on personal preferences
❌ Not testing complex changes
❌ Ignoring CI failures
