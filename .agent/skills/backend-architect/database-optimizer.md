---
name: database-optimizer
description: Designs efficient database schemas, writes optimized queries, and implements proper indexing strategies. Covers SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Firestore). Use when modeling data, fixing slow queries, or scaling database performance.
---

# Database Optimizer

## Schema Design Principles

**Relational (SQL):**
- Normalization to 3NF (eliminate redundancy)
- Strategic denormalization for read-heavy tables
- Proper foreign key constraints (ON DELETE CASCADE/SET NULL)
- Use UUIDs or BigInt for primary keys in distributed systems
- Composite indexes for multi-column queries

**NoSQL (Document-based):**
- Embed related data for single-entity queries
- Reference separate collections for many-to-many
- Avoid deep nesting (max 2-3 levels)
- Duplicate frequently-accessed data (acceptable tradeoff)

## Query Optimization

**Identify Slow Queries (PostgreSQL):**
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- log queries > 1s

-- View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Use EXPLAIN ANALYZE:**
```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id;

-- Look for:
-- - Seq Scan (bad, add index)
-- - Index Scan (good)
-- - High loop counts (optimize JOIN)
```

## N+1 Query Prevention

```typescript
// ❌ N+1 Problem
const users = await db.user.findMany();
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } });
}
// 1 query for users + N queries for posts = N+1

// ✅ Solution: Eager loading
const users = await db.user.findMany({
  include: { posts: true }
});
// 1 query with JOIN
```

## Indexing Strategy

**Create Index:**
```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at DESC);

-- Partial index (conditional)
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;
```

**When to Index:**
- Primary keys (auto-indexed)
- Foreign keys (for JOINs)
- WHERE clause columns (frequently filtered)
- ORDER BY columns (sorting)
- Composite index for multiple columns in WHERE

**Check Index Usage:**
```sql
-- PostgreSQL
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
-- If idx_scan = 0, index is unused (consider dropping)
```

## Connection Pooling

```typescript
// Prisma with connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Or with pg (raw PostgreSQL)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Caching with Redis

```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function getUserWithCache(id: string) {
  // Check cache first
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  // Cache miss, fetch from DB
  const user = await db.user.findUnique({ where: { id } });
  
  // Store in cache (1 hour TTL)
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
  
  return user;
}
```

## Schema Migration Best Practices

```sql
-- Step 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN new_email VARCHAR(255);

-- Step 2: Backfill data
UPDATE users SET new_email = old_email WHERE new_email IS NULL;

-- Step 3: Make NOT NULL
ALTER TABLE users ALTER COLUMN new_email SET NOT NULL;

-- Step 4: Drop old column
ALTER TABLE users DROP COLUMN old_email;
```

## Pagination Patterns

```typescript
// Offset-based (simple, not recommended for large datasets)
const posts = await db.post.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

// Cursor-based (better for large datasets)
const posts = await db.post.findMany({
  take: 20,
  skip: 1, // skip cursor itself
  cursor: { id: lastPostId },
  orderBy: { createdAt: 'desc' },
});
```

## Performance Checklist

- [ ] Indexes on foreign keys
- [ ] Indexes on WHERE/ORDER BY columns
- [ ] No SELECT * (fetch only needed columns)
- [ ] N+1 queries eliminated (use eager loading)
- [ ] Connection pooling configured
- [ ] Slow query logging enabled
- [ ] EXPLAIN ANALYZE on complex queries
- [ ] Caching for frequently-read data
- [ ] Database backups scheduled

## Anti-Patterns

❌ SELECT * (fetch only needed columns)
❌ No indexes on foreign keys
❌ Using OR in WHERE (hard to optimize)
❌ Storing JSON as text (use JSONB in PostgreSQL)
❌ No connection pooling (exhaust connections)
❌ Ignoring EXPLAIN output
❌ N+1 queries in loops
