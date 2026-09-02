# CLAUDE.md
# Last audited: 2026-09-02

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                  # Run all tests (headless off by default)
npm run test:headed       # Run tests with visible browser window
npm run report            # Open the HTML test report
npx playwright test --grep "test name"        # Run a single test by name
npx playwright test tests/saucelabs-login.spec.ts  # Run a single spec file
```

Set credentials via environment variables before running:
```bash
# PeopleSoft
PEOPLESOFT_URL=https://... PS_USER=myuser PS_PASS=mypass npm test

# Swag Labs (saucedemo.com) — defaults are the public demo credentials
SWAGLABS_URL=https://www.saucedemo.com/ PS_USER=standard_user PS_PASSWORD=secret_sauce npm test
```

## Architecture

This is a Playwright + TypeScript test suite using the **Page Object Model** pattern. It currently covers two applications:

- **Oracle PeopleSoft** (`pages/PeopleSoftLoginPage.ts` / `tests/peoplesoft-login.spec.ts`)
- **Swag Labs / SauceDemo** (`pages/SwagLabsLoginPage.ts` / `tests/saucelabs-login.spec.ts`)

**Structure:**
- `tests/` — Playwright spec files (one spec per application/feature area). Specs stay selector-free; they only call Page Object methods.
- `pages/` — Page Object classes. All CSS selectors and raw Playwright interactions live here.
- `playwright.config.ts` — global runner config (timeouts, reporter, browser projects).

**Key design decisions:**
- `workers: 1` — tests run sequentially. PeopleSoft has server-side session state concerns; keeping this setting applies to the whole suite for consistency.
- `headless: false` by default — intentional for learning/debugging; set to `true` for CI.
- Timeouts are generous (`30s` test, `10s` expect) to accommodate slow-loading enterprise pages.
- Traces, screenshots, and video are captured on first retry only (`trace: 'on-first-retry'`), keeping normal runs fast.
- TypeScript strict mode is enabled (`tsconfig.json`); all Page Object locators are typed as private fields.

**Adding new coverage:** create a Page Object in `pages/` and a corresponding spec in `tests/`. Follow the existing pattern: constructor defines locators, public methods wrap interactions and assertions.
