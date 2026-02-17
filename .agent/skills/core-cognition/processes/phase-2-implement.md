---
description: Implement phase - TDD cycle for writing code
---

# Phase 2: Implement

## Purpose
Write production code following Test-Driven Development (TDD).

## Prerequisites
- Phase 1 (Research) completed
- Research log exists at `.agent/research_logs/{feature_name}.md`
- Mark task as `[/]` in task.md

## Steps

**Set Mode:** Use `task_boundary` to set mode to **EXECUTION**.

### 1. Create Test File
Co-locate with implementation:
- Go: `*_test.go`
- TypeScript: `*.spec.ts`

### 2. Write Failing Test (Red)
**Mandatory**: If logic is complex, generate a **Property-Based Test** (see `rules/modern-testing-mandate.md`).

```go
func TestCreateTask_Success(t *testing.T) {
    // Arrange
    mockStore := NewMockStorage()
    // ...
```

### 3. Write Minimal Code (Green)
Write ONLY enough code to make the test pass.

### 4. Refactor (Blue)
Improve the code while keeping tests green:
- Improve names and structure
- Remove duplication
- **Run Security Scan**: Verify no secrets or injection risks (see `rules/security-hardening-mandate.md`).
- **Follow predefined agent rules** (read applicable `.agent/rules/*.md`)
- **Handle errors** per Error Handling Principles
- **Add logging** per Logging and Observability Mandate
- Ensure tests still pass

### 5. Repeat
Continue Red-Green-Refactor for each behavior.

## Unit Test Requirements
- Mock all dependencies (interfaces)
- Test happy path, error paths AND edge cases
- Target >85% coverage on domain logic

## Development Commands
```bash
# Run specific test
go test -v -run TestCreateTask ./internal/features/task/...

# Run with coverage
go test -cover ./internal/features/task/...

# Frontend tests
pnpm run test
pnpm run test -- --coverage
```

## Completion Criteria
- [ ] Unit tests written and passing
- [ ] Implementation complete
- [ ] Error handling follows principles
- [ ] Logging added to operations
- [ ] Code follows project patterns

## Next Phase
Proceed to **Phase 3: Integrate** (`/3-integrate`)