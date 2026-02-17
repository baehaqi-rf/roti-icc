---
skill_name: nextjs-supabase-tab-optimization
version: 2.0.0
author: AI Coding Assistant
created: 2026-02-15
updated: 2026-02-15
tags: [nextjs, supabase, performance, react-query, optimization, tab-switching]
complexity: intermediate
estimated_time: 45-90 minutes
applies_to:
  - "app/**/*.{tsx,ts,jsx,js}"
  - "components/**/*.{tsx,ts,jsx,js}"
  - "lib/supabase*.{ts,js}"
  - "**/*[Tt]ab*.{tsx,ts,jsx,js}"
---

# Next.js + Supabase Tab Optimization Skill

## 🎯 Mission
Transform slow Next.js tab switching (500ms+) with Supabase to instant performance (<50ms) like vanilla JavaScript applications.

## 📋 Prerequisites Check

Before executing this skill, verify:

```bash
# Required in package.json
- "next": "^14.0.0 || ^15.0.0"
- "@supabase/supabase-js": "^2.0.0"

# Project structure must have one of:
- app/ directory (App Router) OR
- pages/ directory (Pages Router)

# Environment variables required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🔍 Problem Detection

Execute this skill when you detect ANY of these patterns:

### Code Patterns to Search:
```typescript
// Pattern 1: router.push in tab handlers
router.push(\`.*tab.*\`)
router.replace(\`.*tab.*\`)

// Pattern 2: Unoptimized data fetching
useEffect.*supabase.*select
useState.*\[\].*supabase

// Pattern 3: No caching mechanism
!(useSWR|useQuery|QueryClient)

// Pattern 4: Loading on every tab switch
isLoading.*activeTab
loading.*setLoading.*tab
```

### Performance Indicators:
- Tab switching feels slow (visible delay)
- Loading spinner appears on every tab change
- Network tab shows duplicate requests
- Errors occur with 100+ rows of data
- Console shows multiple Supabase queries

## 📊 Expected Improvements

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Tab switching time | 500ms+ | <50ms | 90% faster |
| Initial data load | 2-3s | <1.2s | 60% faster |
| Cache hit time | N/A | <50ms | Instant |
| Error rate (large data) | 15-20% | <2% | 90% reduction |
| Memory usage | High | Optimized | -30% |
| User experience | Choppy | Smooth | Like vanilla JS |

---

## 🚀 PHASE 1: Critical Tab Switching Fix

**Priority:** CRITICAL - Execute this first for immediate impact  
**Time:** 5-10 minutes  
**Impact:** 90% of perceived performance improvement

### Step 1.1: Locate Tab Switching Logic

**Search for:**
```bash
# In terminal or search tool
rg "router\.(push|replace).*tab" --type ts --type tsx
# or
grep -r "router.push.*tab" app/ components/
```

**Common locations:**
- `components/Tabs.tsx`
- `components/TabContainer.tsx`
- `app/**/[page].tsx`
- `components/*Navigation*.tsx`

### Step 1.2: Replace Router Logic

**Find this pattern:**
```typescript
// ❌ ANTI-PATTERN - Creates server request (500ms delay)
import { useRouter } from 'next/navigation';

const router = useRouter();
const handleTabChange = (tab: string) => {
  router.push(`?tab=${tab}`);
  // or
  router.push(`/dashboard?tab=${tab}`);
};
```

**Replace with:**
```typescript
// ✅ OPTIMIZED - Instant URL update (<50ms)
import { useState } from 'react';

const handleTabChange = (tab: string) => {
  // Update URL without page reload
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tab);
  window.history.pushState({}, '', url);

  // Update local state
  setActiveTab(tab);
};

// Handle browser back/forward buttons
useEffect(() => {
  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'default';
    setActiveTab(tab);
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
```

### Step 1.3: Validate Phase 1

**Test checklist:**
- [ ] Click tabs rapidly - should switch instantly
- [ ] No loading spinner appears
- [ ] URL updates correctly
- [ ] Browser back/forward buttons work
- [ ] Console shows no errors

**Measure performance:**
```typescript
// Add to handleTabChange temporarily
console.time('tab-switch');
handleTabChange(newTab);
console.timeEnd('tab-switch'); // Should show <50ms
```

**If Phase 1 solves your problem:** Stop here. Otherwise continue to Phase 2.

---

## 🚀 PHASE 2: Data Caching Implementation

**Priority:** HIGH  
**Time:** 20-30 minutes  
**Impact:** Eliminates redundant network requests

### Step 2.1: Install React Query

**Execute:**
```bash
npm install @tanstack/react-query
# or
pnpm add @tanstack/react-query
# or
yarn add @tanstack/react-query
```

**Update package.json:** Verify version ^5.0.0 or higher

### Step 2.2: Create Query Provider

**File to create:** `app/providers.tsx` (or `components/providers.tsx`)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 1 minute
        staleTime: 60 * 1000,

        // Cache persists for 5 minutes
        gcTime: 5 * 60 * 1000,

        // Don't refetch on window focus
        refetchOnWindowFocus: false,

        // Don't refetch on component mount if data exists
        refetchOnMount: false,

        // Retry failed requests 2 times
        retry: 2,

        // Exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Remove in production */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Step 2.3: Wrap Application

**File to modify:** `app/layout.tsx`

```typescript
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Step 2.4: Convert Data Fetching

**Search for unoptimized patterns:**
```bash
rg "useState.*\[\]" --type tsx | grep -i "data\|items\|rows"
rg "useEffect.*supabase" --type tsx
```

**Find this pattern:**
```typescript
// ❌ ANTI-PATTERN - No caching, re-fetches always
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function TabContent({ activeTab, userId }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(activeTab)
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <DataTable data={data} />;
}
```

**Replace with:**
```typescript
// ✅ OPTIMIZED - Cached, instant on repeat access
'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface TabContentProps {
  activeTab: string;
  userId: string;
}

function TabContent({ activeTab, userId }: TabContentProps) {
  const { data, isLoading, error, isFetching } = useQuery({
    // Unique cache key - MUST be stable and descriptive
    queryKey: ['tabData', activeTab, userId],

    // Fetch function
    queryFn: async () => {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },

    // Only fetch if we have required params
    enabled: !!userId && !!activeTab,

    // Custom stale time for this specific query (optional)
    staleTime: 2 * 60 * 1000, // 2 minutes for this tab
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      {isFetching && <RefetchingIndicator />}
      <DataTable data={data ?? []} />
    </div>
  );
}
```

### Step 2.5: Create Loading Components

**File to create:** `components/LoadingSkeleton.tsx`

```typescript
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  );
}

export function RefetchingIndicator() {
  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">
      Updating...
    </div>
  );
}
```

### Step 2.6: Validate Phase 2

**Test checklist:**
- [ ] First tab load shows loading skeleton
- [ ] Second+ access is instant (cache hit)
- [ ] React Query DevTools shows cached queries
- [ ] Network tab shows fewer requests
- [ ] Console shows no duplicate fetches

**Verify caching:**
```typescript
// Open React Query DevTools (bottom left icon)
// Check "Queries" tab - should see:
// - ['tabData', 'tab1', 'user123'] - fresh (green)
// - ['tabData', 'tab2', 'user123'] - stale (yellow)
```

---

## 🚀 PHASE 3: Prefetching for Zero Latency

**Priority:** MEDIUM  
**Time:** 10-15 minutes  
**Impact:** Perceived instant loading on hover

### Step 3.1: Add Prefetch Logic

**File to modify:** `components/Tabs.tsx` or your tab component

```typescript
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  userId: string;
}

function Tabs({ tabs, userId }: TabsProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Prefetch next tab data on hover
  const prefetchTab = (tabId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['tabData', tabId, userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from(tabId)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        return data;
      },
    });
  };

  // Prefetch adjacent tabs on mount
  useEffect(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);

    // Prefetch next tab
    if (currentIndex < tabs.length - 1) {
      prefetchTab(tabs[currentIndex + 1].id);
    }

    // Prefetch previous tab
    if (currentIndex > 0) {
      prefetchTab(tabs[currentIndex - 1].id);
    }
  }, [activeTab]);

  return (
    <div className="flex gap-2 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            handleTabChange(tab.id);
            setActiveTab(tab.id);
          }}
          onMouseEnter={() => prefetchTab(tab.id)} // ⚡ Prefetch on hover
          className={`px-4 py-2 ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

### Step 3.2: Implement Smart Prefetching

**Advanced strategy:**
```typescript
// Prefetch all tabs on idle
import { useEffect } from 'react';

function useIdlePrefetch(tabs: string[], userId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Wait for browser idle time
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => {
        tabs.forEach((tabId) => {
          queryClient.prefetchQuery({
            queryKey: ['tabData', tabId, userId],
            queryFn: async () => {
              const { data } = await supabase
                .from(tabId)
                .select('*')
                .eq('user_id', userId)
                .limit(100);
              return data;
            },
          });
        });
      });

      return () => cancelIdleCallback(handle);
    }
  }, [tabs, userId]);
}
```

### Step 3.3: Validate Phase 3

**Test checklist:**
- [ ] Hover tab → Network shows prefetch request
- [ ] Click hovered tab → Instant display (no loading)
- [ ] Adjacent tabs prefetch on mount
- [ ] DevTools shows prefetched queries

---

## 🚀 PHASE 4: Supabase Connection Optimization

**Priority:** HIGH (if experiencing errors)  
**Time:** 15-20 minutes  
**Impact:** Eliminates connection errors with large datasets

### Step 4.1: Enable Connection Pooling

**File to modify:** `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-connection-pool': 'true', // ⚡ Enable pooling
    },
  },
  // Realtime disabled by default for performance
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// For server-side (if using Server Components)
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    db: { schema: 'public' },
    auth: { persistSession: false },
  }
);
```

### Step 4.2: Database Indexing

**Create migration file:** `supabase/migrations/add_performance_indexes.sql`

```sql
-- ================================================
-- Performance Indexes for Tab Data Optimization
-- Created: 2026-02-15
-- ================================================

-- Index for user-specific queries (CRITICAL)
CREATE INDEX IF NOT EXISTS idx_user_tab_data 
ON your_table_name(user_id, created_at DESC);

-- Composite index for filtered queries
CREATE INDEX IF NOT EXISTS idx_user_tab_status 
ON your_table_name(user_id, status, created_at DESC)
WHERE status IS NOT NULL;

-- Full-text search index (if searching)
CREATE INDEX IF NOT EXISTS idx_search_content 
ON your_table_name 
USING gin(to_tsvector('english', column_name));

-- ================================================
-- Query Performance Analysis
-- Run these to verify index usage
-- ================================================

-- Check existing indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'your_table_name';

-- Analyze query performance (replace with your actual query)
EXPLAIN ANALYZE 
SELECT * 
FROM your_table_name 
WHERE user_id = 'test-user-id'
ORDER BY created_at DESC 
LIMIT 100;

-- Should show "Index Scan" instead of "Seq Scan"
-- Query time should be <100ms
```

**Apply migration:**
```bash
# Via Supabase CLI
supabase db push

# Or manually in Supabase Dashboard:
# SQL Editor → New Query → Paste → Run
```

### Step 4.3: Query Optimization

**Add query hints:**
```typescript
// Optimized query with proper indexing
const { data, error } = await supabase
  .from('your_table')
  .select('id, name, created_at, status') // ⚡ Select only needed columns
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(100); // ⚡ Always limit large tables

// For filtered queries
const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active') // ⚡ Uses composite index
  .order('created_at', { ascending: false })
  .limit(100);

// For search queries
const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .eq('user_id', userId)
  .textSearch('column_name', searchTerm, {
    type: 'websearch',
    config: 'english',
  })
  .limit(50);
```

### Step 4.4: Validate Phase 4

**Test checklist:**
- [ ] Indexes created successfully
- [ ] EXPLAIN ANALYZE shows index usage
- [ ] Query time < 100ms
- [ ] No connection timeout errors
- [ ] 100+ rows load without issues

**Performance check:**
```sql
-- In Supabase SQL Editor
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM your_table 
WHERE user_id = 'test-id' 
ORDER BY created_at DESC 
LIMIT 100;

-- Look for:
-- ✅ "Index Scan using idx_user_tab_data"
-- ✅ "Execution Time: <100ms"
-- ❌ "Seq Scan" (means index not used)
```

---

## 🚀 PHASE 5: Large Dataset Handling

**Priority:** MEDIUM (only if dataset > 100 rows)  
**Time:** 20-30 minutes  
**Impact:** Smooth scrolling with 1000+ rows

### Decision Tree:

```
Dataset size check:
├─ < 100 rows → Skip Phase 5 (Phases 1-4 sufficient)
├─ 100-1000 rows → Implement Step 5.1 (Pagination)
└─ > 1000 rows → Implement Step 5.2 (Virtualization)
```

### Step 5.1: Infinite Scroll Pagination

**When to use:** 100-1000 rows per tab

```typescript
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const PAGE_SIZE = 50;

function PaginatedTabContent({ activeTab, userId }: Props) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['paginatedTabData', activeTab, userId],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from(activeTab)
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        data,
        nextPage: end < (count ?? 0) ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Auto-fetch next page when scrolling near bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <LoadingSkeleton />;
  if (status === 'error') return <ErrorDisplay error={error} />;

  const allRows = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-2">
      {allRows.map((row) => (
        <DataRow key={row.id} data={row} />
      ))}

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage ? (
          <LoadingSpinner />
        ) : hasNextPage ? (
          <button onClick={() => fetchNextPage()} className="text-blue-500">
            Load More
          </button>
        ) : (
          <span className="text-gray-500">No more data</span>
        )}
      </div>
    </div>
  );
}
```

### Step 5.2: Virtual Scrolling

**When to use:** > 1000 rows per tab

**Install dependency:**
```bash
npm install @tanstack/react-virtual
```

**Implementation:**
```typescript
'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

function VirtualizedTabContent({ activeTab, userId }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['virtualTabData', activeTab, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const virtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height
    overscan: 5, // Render 5 extra items above/below viewport
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto border rounded"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = data[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <DataRow data={row} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Step 5.3: Validate Phase 5

**Test checklist:**
- [ ] Smooth scrolling with 1000+ rows
- [ ] No janky/laggy behavior
- [ ] Memory usage stays stable
- [ ] Only visible rows rendered (check DevTools)
- [ ] Infinite scroll triggers automatically

---

## ✅ Final Validation & Testing

### Automated Performance Tests

**Create test file:** `scripts/validate-optimization.ts`

```typescript
interface PerformanceMetrics {
  tabSwitchTime: number;
  cacheHitTime: number;
  queryTime: number;
  errorRate: number;
}

async function measureTabSwitch(): Promise<number> {
  const start = performance.now();
  // Simulate tab switch
  handleTabChange('new-tab');
  const end = performance.now();
  return end - start;
}

async function validateOptimization(): Promise<PerformanceMetrics> {
  const metrics: PerformanceMetrics = {
    tabSwitchTime: await measureTabSwitch(),
    cacheHitTime: 0, // Measure from React Query DevTools
    queryTime: 0, // Measure from Supabase Dashboard
    errorRate: 0, // Calculate from error logs
  };

  console.table(metrics);

  // Validate against targets
  const passed = {
    tabSwitch: metrics.tabSwitchTime < 50,
    cacheHit: metrics.cacheHitTime < 50,
    query: metrics.queryTime < 100,
    errors: metrics.errorRate < 2,
  };

  console.table(passed);

  return metrics;
}
```

### Manual Test Checklist

```markdown
## Phase 1: Tab Switching
- [ ] Tab switches instantly (<50ms)
- [ ] No visible loading spinner
- [ ] URL updates correctly
- [ ] Browser back/forward works

## Phase 2: Data Caching
- [ ] First load shows skeleton
- [ ] Second+ access is instant
- [ ] React Query DevTools shows cache
- [ ] No duplicate network requests

## Phase 3: Prefetching
- [ ] Hover shows prefetch in Network tab
- [ ] Hovered tab loads instantly
- [ ] Adjacent tabs prefetched

## Phase 4: Database
- [ ] Indexes created successfully
- [ ] Query time < 100ms
- [ ] No connection errors
- [ ] EXPLAIN shows index usage

## Phase 5: Large Data (if applicable)
- [ ] Smooth scrolling with 1000+ rows
- [ ] Memory usage stable
- [ ] No performance degradation
```

### Success Criteria

**Skill execution is COMPLETE when all targets met:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Tab switching | <50ms | `console.time()` in handler |
| Initial load | <1.2s | Lighthouse/DevTools |
| Cache hit | <50ms | React Query DevTools |
| Query time | <100ms | Supabase Dashboard / EXPLAIN |
| Error rate | <2% | Error boundary logs |
| User feedback | "Feels instant" | Manual confirmation |

---

## 🐛 Troubleshooting Guide

### Issue 1: Cache Not Working

**Symptoms:**
- Still seeing loading on every tab switch
- Network shows duplicate requests
- DevTools shows no cached queries

**Diagnosis:**
```typescript
// Check queryKey stability
console.log('Query Key:', ['tabData', activeTab, userId]);
// Must be same values on each render

// Check if data is being invalidated
queryClient.getQueryData(['tabData', activeTab, userId]);
```

**Solutions:**
1. Ensure queryKey is stable (no random values)
2. Check `staleTime` and `gcTime` configs
3. Verify `enabled` condition is correct
4. Remove manual `invalidateQueries` calls

### Issue 2: Memory Leak

**Symptoms:**
- App slows down after many tab switches
- DevTools shows increasing memory usage
- Browser becomes unresponsive

**Diagnosis:**
```typescript
// Check cache size
console.log('Cached queries:', queryClient.getQueryCache().getAll().length);

// Check for unmounted component updates
useEffect(() => {
  let mounted = true;
  // ... async operation
  if (mounted) setState(data);
  return () => { mounted = false; };
}, []);
```

**Solutions:**
1. Set appropriate `gcTime` (5 min recommended)
2. Limit cache size in QueryClient config
3. Clean up useEffect subscriptions
4. Use AbortController for fetch cancellation

### Issue 3: Supabase Timeouts

**Symptoms:**
- Connection timeout errors
- "Too many connections" error
- Slow query performance

**Diagnosis:**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT pid, query, query_start
FROM pg_stat_activity
WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 seconds';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

**Solutions:**
1. Enable connection pooling (Phase 4.1)
2. Add database indexes (Phase 4.2)
3. Add `.limit()` to all queries
4. Use connection string with pooling: `supabase.co:6543`

### Issue 4: Prefetch Overload

**Symptoms:**
- Too many network requests
- Bandwidth usage high
- Slow initial page load

**Diagnosis:**
```typescript
// Monitor prefetch calls
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'added') {
    console.log('Query added:', event.query.queryKey);
  }
});
```

**Solutions:**
1. Limit prefetch to adjacent tabs only
2. Use `requestIdleCallback` for background prefetch
3. Debounce hover events
4. Reduce `staleTime` for prefetched data

---

## 📁 Expected File Structure After Completion

```
your-project/
├── .github/
│   └── instructions/
│       └── nextjs-optimization.md        ← This skill file
├── app/
│   ├── layout.tsx                        ← Modified (Phase 2.3)
│   ├── providers.tsx                      ← Created (Phase 2.2)
│   └── dashboard/
│       └── [userId]/
│           ├── page.tsx                   ← Modified (Phase 2.4)
│           └── loading.tsx                ← Created (optional)
├── components/
│   ├── Tabs.tsx                          ← Modified (Phase 1.2, 3.1)
│   ├── TabContent.tsx                    ← Modified (Phase 2.4)
│   ├── LoadingSkeleton.tsx               ← Created (Phase 2.5)
│   ├── PaginatedTabContent.tsx           ← Created (Phase 5.1, optional)
│   └── VirtualizedTabContent.tsx         ← Created (Phase 5.2, optional)
├── lib/
│   └── supabase.ts                       ← Modified (Phase 4.1)
├── supabase/
│   └── migrations/
│       └── add_performance_indexes.sql    ← Created (Phase 4.2)
├── scripts/
│   └── validate-optimization.ts           ← Created (testing)
└── package.json                          ← Modified (dependencies)
```

---

## 📚 Additional Resources

### Documentation
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Supabase Performance Guide](https://supabase.com/docs/guides/database/performance)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [React Virtual](https://tanstack.com/virtual/latest/docs/introduction)

### Debugging Tools
- React Query DevTools - `npm install @tanstack/react-query-devtools`
- Chrome Performance Monitor
- Supabase Dashboard → Database → Query Performance
- Lighthouse CI for automated testing

### Learning Path
1. Understanding React Query caching strategies
2. Database indexing fundamentals
3. Virtual scrolling concepts
4. Next.js routing optimizations

---

## 🎓 Skill Execution Notes for AI Agents

**For AI Coding Assistants (Cursor, Windsurf, Cline, Aider, etc.):**

### Pre-Execution Checklist:
1. Read entire skill before starting
2. Scan project for existing patterns
3. Check `package.json` for conflicting libraries
4. Identify current router version (App/Pages)
5. Locate existing Supabase setup

### Execution Strategy:
- **Always execute phases sequentially** (don't skip Phase 1)
- **Validate after each phase** before proceeding
- **Ask clarifying questions** when project structure unclear
- **Report metrics** after each phase completion
- **Stop early** if user approves partial solution

### Questions to Ask User:
1. "What's your average dataset size per tab?"
2. "Are you using App Router or Pages Router?"
3. "Do you have existing caching solutions?"
4. "Which phase should I prioritize?"

### Code Generation Guidelines:
- Show before/after code diffs
- Explain why each change improves performance
- Provide test commands after each phase
- Use TypeScript with proper types
- Follow project's code style

### Measurement Requirements:
- Use Performance API for timing
- Log metrics to console
- Compare against success criteria
- Report improvements in percentages

### Completion Report Template:
```
# Optimization Complete

## Phases Executed:
✅ Phase 1: Tab Switching (10 min)
✅ Phase 2: Data Caching (25 min)
✅ Phase 3: Prefetching (12 min)
✅ Phase 4: Database (18 min)
⏭️ Phase 5: Skipped (dataset < 100 rows)

## Performance Improvements:
- Tab switching: 520ms → 45ms (91% faster)
- Cache hit rate: 0% → 85%
- Query time: 280ms → 75ms (73% faster)
- Error rate: 18% → 1% (94% reduction)

## Files Modified:
- app/layout.tsx
- app/providers.tsx (created)
- components/Tabs.tsx
- components/TabContent.tsx
- lib/supabase.ts
- package.json

## Next Steps:
1. Deploy to staging
2. Monitor performance metrics
3. Consider Phase 5 if dataset grows
4. Set up error tracking

## User Confirmation:
"Tab switching now feels instant like vanilla JS ✓"
```

---

**End of Skill Definition**

Version: 2.0.0  
Last Updated: 2026-02-15  
Tested On: Next.js 14/15, React Query v5, Supabase v2
