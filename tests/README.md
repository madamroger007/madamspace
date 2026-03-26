# Test Suite Overview

This folder follows the plan in .agent/testing-plan.md.

## Structure

- tests/unit: pure logic/unit-level tests
- tests/integration: real DB/repository integration tests (external providers mocked)
- tests/e2e: browser journey tests (Playwright phase)
- tests/fixtures: deterministic test data factories
- tests/helpers: shared testing helpers

## Current Coverage Domains

- Auth:
  - withAuth guards
  - auth/me route
  - auth/forgot-password route (integration, real DB)
  - auth/reset-password route (integration, real DB)
  - auth/token routes
  - auth/users and auth/users/[id] routes (integration, real DB)
- Payment:
  - create-transaction route (integration, real DB)
  - orders/public route (integration, real DB)
  - orders route (integration, real DB)
  - transaction-status route (integration)
  - fee-estimate route (integration)
- Product:
  - products route baseline checks
- Voucher:
  - voucher route baseline checks

## Commands

- pnpm test
- pnpm test:unit
- pnpm test:integration
- pnpm test:coverage
- pnpm test:e2e
- pnpm test:e2e:headed

## Safety Notes

- External providers are mocked in integration tests.
- JWT_SECRET is set in tests/setup.ts for isolated test runtime.
- No tests require production secrets.

## Integration Requirements

- `POSTGRES_URL` must be set for `pnpm test:integration`.
- Integration setup is isolated in `tests/integration/setup.ts`.
- Integration config uses `vitest.integration.config.ts`.
- Integration runs with `fileParallelism: false` to avoid shared-DB race conditions across suites.
