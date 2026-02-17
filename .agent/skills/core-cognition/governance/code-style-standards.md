---
trigger: always_on
description: Mandatory project structure, coding conventions, and file organization rules.
---

# 🎨 Code Style Standards

## 1. Project Structure
**"A place for everything, and everything in its place."**

*   `src/app/`: Next.js App Router (Pages, Layouts).
*   `src/components/`: React Components.
    *   `ui/`: Shadcn/Generic UI (Buttons, Inputs).
    *   `features/`: Domain-specific components (RichTextEditor).
*   `src/lib/`: Utilities, Helpers, Schemas (Zod).
*   `src/services/`: API Clients, Data Fetching logic.
*   `src/hooks/`: Custom React Hooks.
*   `src/types/`: TypeScript Definitions (Global).

## 2. Coding Conventions

### Language Mandates
*   **TypeScript:** Strict Mode. Explicit types for function parameters and returns. No `any`.
*   **Naming:**
    *   Variables/Functions: `camelCase`
    *   Components/Classes: `PascalCase`
    *   Constants: `UPPER_SNAKE_CASE`
    *   Files: `kebab-case` (e.g., `user-profile.tsx`)

### Organization Principles
1.  **Colocation:** Keep related things together. (Tests next to code, styles next to component).
2.  **Barrel Exports:** Use `index.ts` only for public APIs of a module.
3.  **No Circular Dependencies:** A module should never import from a module that imports it.

### Code Completion
**"Don't leave holes in the ship."**
*   **No TODOs:** Fix it now or file a ticket.
*   **No Placeholders:** Generate real, working code.
*   **Completeness:** Implement all required methods of an interface.

## 3. Idioms
*   **Early Return:** Reduce nesting.
    ```typescript
    if (!user) return;
    // do work
    ```
*   **Functional:** Prefer `map`, `filter`, `reduce` over loops.
*   **Immutability:** Treat `props` and `state` as immutable.
