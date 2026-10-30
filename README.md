# Playwright Checkout Tests

## About This Project

This project demonstrates an agentic AI approach to quality assurance. AI agents are used to plan tests from a user story, explore the checkout application, generate Playwright tests, run and heal failing tests, and prepare a test report.

The final automated tests are stored in this repository and run against the Sauce Demo checkout flow. The project combines traditional Playwright automation with AI-assisted planning and test maintenance.

This project contains Playwright tests for the Sauce Demo checkout flow.

## Tests Included

- Complete checkout flow
- Required checkout field validation
- Cart navigation
- Checkout cancellation
- Order overview and price calculation
- Cart reset after order completion

The tests run in Chromium, Firefox, and WebKit.

## Requirements

- Node.js
- npm

## Setup

```bash
npm install
npx playwright install
```

## Run the Tests

Run the SCRUM-101 checkout tests in all configured browsers:

```bash
npx playwright test tests/saucedemo-checkout
```

Run tests in Chromium only:

```bash
npx playwright test tests/saucedemo-checkout --project=chromium
```

Open the HTML report after a test run:

```bash
npx playwright show-report
```

## Project Structure

```text
tests/saucedemo-checkout/
  checkout.spec.ts       Checkout test cases
  helpers.ts             Login and checkout helper functions
  PLAYWRIGHT_HEALING.md  Test healing record

specs/
  saucedemo-checkout-test-plan.md

user-stories/
  SCRUM-101-ecommerce-checkout.md

test-results/
  SCRUM-101-checkout-test-report.md
```

## Test Site

https://www.saucedemo.com

Test user:

- Username: `standard_user`
- Password: `secret_sauce`
