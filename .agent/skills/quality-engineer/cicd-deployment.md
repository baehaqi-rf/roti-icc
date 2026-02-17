---
name: cicd-deployment-engineer
description: Sets up automated CI/CD pipelines for testing, building, and deploying applications. Covers GitHub Actions, Docker, Vercel, AWS, and infrastructure as code. Use when preparing production deployments, automating releases, or configuring staging environments.
---

# CI/CD Deployment Engineer

## CI/CD Pipeline Stages

**Typical Flow:**
1. **Lint & Format** (ESLint, Prettier)
2. **Test** (unit, integration, E2E)
3. **Build** (compile TypeScript, bundle assets)
4. **Security Scan** (npm audit, SAST)
5. **Deploy** (staging → production)

## GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

## Docker Multi-Stage Build

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

## Docker Compose (Local Dev)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

## Environment Management

**GitHub Secrets:**
```bash
# Add secrets via GitHub UI:
# Settings → Secrets → Actions
VERCEL_TOKEN=xxx
DATABASE_URL=postgresql://...
API_KEY=xxx
```

**Environment Variables:**
```bash
# .env.local (development)
DATABASE_URL=postgresql://localhost:5432/dev
API_KEY=dev_key

# .env.production (production)
DATABASE_URL=postgresql://prod.example.com:5432/prod
API_KEY=prod_key
```

## Database Migrations in CI

```yaml
# In deploy step
- name: Run migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Health Checks

```typescript
// /api/health endpoint
app.get('/health', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'healthy',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
});
```

## Deployment Platforms

**Vercel (Frontend/Full-Stack):**
- Zero-config for Next.js
- Preview deployments for every PR
- Environment variables per branch
- Edge Functions for serverless API

**Railway (Backend):**
- Deploy from GitHub (auto-deploy on push)
- Managed PostgreSQL / Redis
- Custom domains with HTTPS

**AWS (Advanced):**
- EC2 (VMs), ECS (containers), Lambda (serverless)
- RDS (databases), S3 (storage), CloudFront (CDN)

## Rollback Strategy

```bash
# Tag releases
git tag v1.0.0
git push origin v1.0.0

# Quick rollback
git revert HEAD
git push origin main  # triggers redeploy
```

## Monitoring Setup

```typescript
// Sentry integration
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

## Deployment Checklist

- [ ] CI/CD pipeline configured
- [ ] Tests run on every PR
- [ ] Build succeeds before deploy
- [ ] Environment variables configured
- [ ] Database migrations automated
- [ ] Health check endpoint exists
- [ ] Rollback strategy documented
- [ ] Monitoring/logging enabled
- [ ] Staging environment setup
- [ ] Production secrets secured

## Best Practices

**Separate Environments:**
- Development (local)
- Staging (test production-like environment)
- Production (live users)

**Branch Strategy:**
- `main` → production
- `develop` → staging
- `feature/*` → feature branches

**Automated Testing:**
- All tests must pass before deploy
- No manual deployment steps
- Automatic rollback on failure

## Anti-Patterns

❌ Deploying directly from local machine
❌ No staging environment (test in prod)
❌ Manual migration steps
❌ Secrets in code or logs
❌ No health checks
❌ Long-running builds (optimize caching)
❌ No rollback plan
