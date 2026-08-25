# =============================================================================
# A1 Real Estate CRM — Multi-Stage Production Dockerfile
# =============================================================================
# Stage 1 (deps)     → Install production + dev dependencies
# Stage 2 (builder)  → Generate Prisma client, compile Next.js standalone bundle
# Stage 3 (runner)   → Minimal Alpine image serving the standalone output
#
# Build:  docker build -t a1-crm:latest .
# Run:    docker run -p 3000:3000 --env-file .env.local a1-crm:latest
# =============================================================================

# Pin to exact Node LTS version for reproducible builds
ARG NODE_VERSION=20.18.0
ARG ALPINE_VERSION=3.20

# =============================================================================
# STAGE 1 — deps: Install all dependencies (prod + dev for build)
# =============================================================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS deps

# Install OS packages required by Prisma binary engine & native modules
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    ca-certificates

WORKDIR /app

# Copy package manifests first for optimal Docker layer caching
COPY package.json package-lock.json* ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# Install ALL deps (dev included — needed for Prisma generate & Next.js build)
RUN npm ci --frozen-lockfile

# =============================================================================
# STAGE 2 — builder: Prisma client generation + Next.js production build
# =============================================================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

RUN apk add --no-cache \
    libc6-compat \
    openssl

WORKDIR /app

# Pull installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy full source
COPY . .

# ── Build-time environment variables ─────────────────────────────────────────
# DATABASE_URL must be set at build time for Prisma generate.
# Use a dummy placeholder here; real secrets are injected at runtime via
# --env-file or -e flags — they are NEVER baked into the image.
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client for the current schema
RUN npx prisma generate

# Build the Next.js standalone production bundle
# (output: 'standalone' in next.config.mjs produces a self-contained server)
RUN npm run build

# =============================================================================
# STAGE 3 — runner: Minimal production container (Alpine, non-root user)
# =============================================================================
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

# Runtime OS deps (Prisma query engine needs openssl)
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    dumb-init

WORKDIR /app

# ── Security: create unprivileged app user ─────────────────────────────────
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# ── Copy standalone bundle artifacts from builder ──────────────────────────
# The standalone folder contains everything needed to run the server
# (server.js + minimal node_modules — no dev dependencies)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

# Copy Prisma schema + generated client (needed for runtime queries)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma         ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma         ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/schema.prisma         ./prisma/schema.prisma

# ── Runtime environment ────────────────────────────────────────────────────
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# DATABASE_URL and NEXT_PUBLIC_* vars are injected at runtime — not baked in

# ── Drop to unprivileged user ──────────────────────────────────────────────
USER nextjs

EXPOSE 3000

# Health check — hits the root route every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# dumb-init ensures proper PID 1 signal handling (graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
