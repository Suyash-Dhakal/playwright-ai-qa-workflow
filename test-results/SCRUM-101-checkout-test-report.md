# SCRUM-101 Checkout Test Execution Report

## 1. Executive Summary

- **Scope:** SauceDemo end-to-end checkout workflow.
- **Test plan scenarios:** 10.
- **Manual scenarios executed:** Checkout, required-field validation, cart review/navigation, overview calculation, completion/cart reset, and cancellation were explored.
- **Automated cases:** 6, each executed in 3 configured browsers.
- **Initial Chromium result:** 6 passed, 0 failed.
- **Final cross-browser result:** 18 passed, 0 failed (Chromium, Firefox, WebKit).
- **Overall status:** PASS.
- **Healing required:** None.

## 2. Manual Test Results

| Area | Result | Observations |
|---|---|---|
| Login | PASS | `standard_user` logged in successfully; inventory page displayed. |
| Cart review | PASS | Added items showed quantity 1, description, price, remove controls, and navigation buttons. |
| Required fields | PASS | Empty Continue submission displays `Error: First Name is required`. Sequential validation advances to Last Name and Postal Code errors. |
| Checkout overview | PASS | Displayed three items, SauceCard #31337, Free Pony Express Delivery, item total, tax, and total. |
| Price calculation | PASS | Three-item subtotal was $89.97; tax was $7.20; total was $97.17. |
| Order completion | PASS | Finish displayed `Thank you for your order!`, dispatch text, and cleared the cart. |

A browser screenshot was captured during manual cart review but is not stored in the repository. Console also reported occasional unrelated HTTP 401 resource-load errors while the application flow remained functional.

## 3. Automated Test Results

| Suite | Initial result | Final result |
|---|---|---|
| Chromium checkout suite | 6 passed | 6 passed |
| Firefox checkout suite | — | 6 passed |
| WebKit checkout suite | — | 6 passed |

The suite verifies happy-path completion, required-field validation, cart navigation preservation, information/overview cancellation, overview totals, and cart clearing after completion.

### Healing Activities

No test failures occurred, so no selector, timing, assertion, or retry repair was required. Stable `data-test` locators, role/text locators, and Playwright state assertions were retained.

## 4. Defects Log

No defects affecting SCRUM-101 were identified. The browser console displayed HTTP 401 resource-load messages, but these did not block checkout behavior and no matching functional defect was reproduced.

## 5. Test Coverage Analysis

Covered:
- Login and inventory state.
- Cart contents, quantities, prices, removal state, and navigation.
- Required-field validation.
- Information-to-overview navigation.
- Payment and shipping labels.
- Price subtotal, tax, and total.
- Order completion and cart clearing.
- Cancellation from information and overview pages.
- Chromium, Firefox, and WebKit execution.

Not automated by this suite:
- Every scenario in the expanded 10-section plan.
- Mobile viewport matrix.
- Long text and special-character input matrix.
- Browser back-button matrix.
- Maximum-cart and multi-item price matrix.

These remain documented plan scope and should be expanded before claiming full plan coverage.

## 6. Limitations and Evidence

- Automated execution used the live `https://www.saucedemo.com` environment.
- Browser binaries/configuration were provided by the existing Playwright configuration.
- No application defect fix was required.
- Playwright HTML results were generated under `playwright-report/` and the repository is committed separately from generated report output.
