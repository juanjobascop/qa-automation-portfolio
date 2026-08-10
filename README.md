# QA Automation Portfolio — Playwright + TypeScript

End-to-end **UI** and **API** test automation built with [Playwright](https://playwright.dev/)
and TypeScript. The suite is written the way a real QA framework is: a clean
**Page Object Model**, custom test fixtures, typed test data, and a maintainable
folder structure — targeting stable public demo applications so anyone can clone
and run it in minutes.

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 👋 About me

I'm **Juan Jose Bascope Castro**, a Manual & Automation QA Engineer and QA Lead
based in Santa Cruz de la Sierra, Bolivia, with **4+ years** of end-to-end
testing experience across web and mobile. Day to day I build scalable automation
frameworks (Cypress / JavaScript, Page Object Model), safeguard **SQL data
integrity**, and lead iOS mobile validation — currently as QA Engineer at Tutator.
I work across the full SDLC (functional, regression, acceptance, and exploratory
testing) in Agile teams, with tools like Zephyr, ClickUp, and JIRA.

This repository applies those same framework-design principles in **Playwright +
TypeScript** to show clean, maintainable automation on a modern stack.

**Trilingual:** Spanish (native) · English (bilingual) · French (professional working)
📫 [j.bascope@outlook.com](mailto:j.bascope@outlook.com)

---

## What this demonstrates

| Skill | Where to look |
|-------|---------------|
| Page Object Model | [`pages/`](pages/) — `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` extending a shared `BasePage` |
| Custom fixtures / dependency injection | [`fixtures/pom-fixtures.ts`](fixtures/pom-fixtures.ts) — page objects + a pre-authenticated `loggedInInventory` fixture |
| UI end-to-end testing | [`tests/ui/`](tests/ui/) — login, inventory, and a full checkout journey |
| API testing (CRUD + auth) | [`tests/api/`](tests/api/) — token auth and a create→read→update→delete lifecycle |
| Test data management | [`fixtures/test-data.ts`](fixtures/test-data.ts) — typed, named data instead of magic strings |
| Positive **and** negative coverage | invalid logins, locked-out users, form validation, 404s, bad credentials |
| Reporting & artifacts | HTML report, traces, screenshots and video on failure |

## Systems under test

- **UI:** [SauceDemo](https://www.saucedemo.com) — a public e-commerce demo app.
- **API:** [restful-booker](https://restful-booker.herokuapp.com) — a public REST API for a hotel booking service.

Both are free, public practice targets, so the suite runs anywhere with no
credentials or setup. Target URLs are overridable via environment variables
(see [`.env.example`](.env.example)).

## Project structure

```
qa-automation-portfolio/
├── pages/                  # Page Object Model
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   ├── pom-fixtures.ts     # Custom Playwright fixtures (POM injection)
│   └── test-data.ts        # Typed test data
├── utils/
│   └── booking-client.ts   # Typed API client for restful-booker
├── tests/
│   ├── ui/                 # Browser E2E specs
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   └── checkout.spec.ts
│   └── api/                # HTTP specs
│       ├── auth.spec.ts
│       └── booking-crud.spec.ts
├── playwright.config.ts    # Two projects: "ui" and "api"
└── .github/workflows/      # CI (GitHub Actions) — ready to enable
```

## Getting started

Requires **Node.js 18+** (developed on Node 20+).

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (first run only)
npx playwright install

# 3. Run everything
npm test
```

## Running tests

```bash
npm test            # full suite (UI + API)
npm run test:ui     # UI E2E tests only
npm run test:api    # API tests only
npm run test:headed # watch the browser drive the UI
npm run test:debug  # step through with the Playwright Inspector
npm run report      # open the HTML report from the last run
npm run typecheck   # TypeScript type-check without running tests
```

Filter to a single file or test:

```bash
npx playwright test tests/ui/checkout.spec.ts
npx playwright test -g "completes a purchase"
```

## Reporting

After a run, an HTML report is generated in `playwright-report/`:

```bash
npm run report
```

On failure the suite automatically captures a **trace**, **screenshot**, and
**video** to make debugging fast — the hallmarks of a production-grade setup.

## Continuous integration

A GitHub Actions workflow ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml))
runs the full suite on every push and pull request to `main` and uploads the
HTML report as a build artifact. It activates automatically once the repo is on
GitHub.

## Design notes

- **Page Object Model** isolates locators and page actions from test logic, so a
  UI change is fixed in one place.
- **Fixtures over `beforeEach` boilerplate** — page objects are injected, and
  `loggedInInventory` encapsulates the login precondition many tests share.
- **Typed everything** — test data, API payloads, and responses are typed, so
  the compiler catches mistakes before the tests run.
- **Env-overridable base URLs** — the same specs can point at staging or local
  environments without touching code.

## License

[MIT](LICENSE)
