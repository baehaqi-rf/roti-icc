---
trigger: model_decision
description: Comprehensive standards for Frontend Engineering, React, and UI Performance.
---

# 🚀 Frontend Standards

## 1. Core Mandate: Performance is a Feature

**"You must treat performance as a feature, not an afterthought."**

### Core Web Vitals targets
1.  **LCP (Largest Contentful Paint):** < 2.5s.
    *   Use `next/image` with explicit dimensions.
    *   Preload fonts and hero images.
    *   Prefer SSR/SSG.
2.  **CLS (Cumulative Layout Shift):** < 0.1.
    *   Reserve space for images/ads.
    *   `font-display: swap`.
3.  **INP (Interaction to Next Paint):** < 200ms.
    *   Yield to main thread.
    *   Optimistic UI updates.

## 2. Modern React Implementation

### Server Components (RSC) First
*   **Default:** All components are Server Components.
*   **Boundary:** Push `"use client"` down to the leaves.
*   **Fetching:** `async/await` directly in RSC. No `useEffect` for initial data.

### Hook Discipline
*   **No Derived State in Effects:** `const filtered = items.filter(...)` ✅
*   **Custom Hooks:** Extract complex logic into `useFeature`.
*   **Stability:** Use `useCallback` only when profiling demands it.

### Next.js App Router
*   `layout.tsx`: Shells.
*   `page.tsx`: Route content.
*   `loading.tsx` / `error.tsx`: Mandatory for route segments.
*   `Server Actions`: Prefer over API routes for simple mutations.

## 3. Accessibility (WCAG 2.1 AA)
**"No innovative feature excuses exclusion."**
1.  **Semantic HTML:** Buttons are `<button>`, not `div`.
2.  **Focus:** Visible indicators, logical order, focus trapping in modals.
3.  **Keyboard:** All interactive elements must be keyboard accessible.

## 4. State Management
*   **Server State:** TanStack Query / SWR / RSC.
*   **Client UI:** Zustand / Context (for themes, sidebar).
*   **Forms:** React Hook Form / Conform. Uncontrolled inputs prefered.

## 5. Styling
*   **Tailwind CSS:** Primary styling engine (90%).
*   **Design System:** Strict tokens (spacing, color, type).
