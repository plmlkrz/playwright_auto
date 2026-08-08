# CLAUDE.md

<!-- Last audited: 2026-08-07 -->

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                  # Run all tests (headless off by default)
npm run test:headed       # Run tests with visible browser window
npm run report            # Open the HTML test report
npx playwright test --grep "test name"   # Run a single test by name
npx playwright test tests/peoplesoft-login.spec.ts  # Run a single spec file
```

Set credentials via environment variables before running:
```bash
PEOPLESOFT_URL=https://... PS_USER=myuser PS_PASS=mypass npm test
```

## Architecture

This is a Playwright + TypeScript test suite targeting an **Oracle PeopleSoft** web application, using the **Page Object Model** pattern.

- `tests/` — Playwright spec files (one spec per feature area)
- `pages/` — Page Object classes that encapsulate selectors and actions for each PeopleSoft page

**Key design decisions:**
- `workers: 1` in `playwright.config.ts` — tests run sequentially because PeopleSoft has session-state concerns that make parallel execution unsafe
- `headless: false` by default — intentional for learning/debugging; flip to `true` for CI
- Timeouts are generous (`30s` test, `10s` expect) because PeopleSoft pages load slowly
- PeopleSoft-specific CSS selectors (e.g. `#userid`, `#pwd`, `.PSLOGINMSGBOX`) are isolated inside Page Objects so specs stay readable

When adding new page coverage, create a new Page Object in `pages/` and a corresponding spec in `tests/`.
