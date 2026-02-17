---
name: backend-api-architect
description: Designs and implements production-grade REST/GraphQL APIs with proper authentication, validation, error handling, and documentation. Use when building server endpoints, microservices, or integrating third-party services.
---

# Backend API Architect

## Core Competencies

**API Design Patterns:**
- RESTful resource design (proper HTTP verbs, status codes, pagination)
- GraphQL schema design (queries, mutations, subscriptions, resolvers)
- API versioning strategies (/v1, /v2 or header-based)
- Rate limiting & throttling implementation

**Authentication & Authorization:**
- JWT token generation/validation with refresh tokens
- OAuth 2.0 flows (authorization code, client credentials)
- Role-Based Access Control (RBAC) implementation
- Session management (Redis, server-side sessions)

## Basic API Setup

```typescript
import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Validation schema
const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// Route with validation
app.post('/api/users', async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await db.user.create({ data });
    res.status(201).json({ id: user.id, name: user.name });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Authentication Middleware

```typescript
import jwt from 'jsonwebtoken';

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/api/profile', authenticate, async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.user.id } });
  res.json(user);
});
```

## Error Response Format

```typescript
// Consistent error format (RFC 7807)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "issue": "Invalid format" }
    ],
    "requestId": "req_abc123"
  }
}
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

## Database Query with Prisma

```typescript
// N+1 prevention with eager loading
const users = await prisma.user.findMany({
  include: {
    posts: true, // Load related posts
    profile: true
  }
});

// Pagination
const posts = await prisma.post.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' }
});
```

## Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // DB check
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: { database: 'up' }
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
});
```

## Best Practices Checklist

- [ ] Input validation on all endpoints (Zod/Joi)
- [ ] Consistent error response format
- [ ] Authentication on protected routes
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Request logging with context
- [ ] Health check endpoint
- [ ] API documentation (OpenAPI/Swagger)
- [ ] No secrets in code (use env vars)
- [ ] Proper HTTP status codes

## Anti-Patterns

❌ No input validation (trusting client)
❌ Returning 200 with error in body
❌ Exposing internal errors to client
❌ No rate limiting (abuse vulnerable)
❌ Hardcoded secrets/API keys
❌ Using GET for state-changing operations
