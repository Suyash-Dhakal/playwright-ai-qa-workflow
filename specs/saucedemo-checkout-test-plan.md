# SCRUM-101 — SauceDemo Checkout Test Plan

## Application scope and coverage

- Application: https://www.saucedemo.com
- User: `standard_user` / `secret_sauce`
- Coverage: authentication guard, cart review, checkout information, overview, completion, cancellation, validation, calculations, navigation, browser compatibility, and responsive layouts.
- Automation: Playwright projects for Chromium, Firefox, and WebKit. Mobile scenarios use Chromium Pixel 5 and WebKit iPhone 12 emulation after projects are enabled.

## Test data

| Data set | Value | Use |
|---|---|---|
| Valid customer | First name `John`; last name `Doe`; postal `12345` | Main happy path |
| Alternate customer | First name `Ada`; last name `Lovelace`; postal `SW1A 1AA` | International postal format and alphabetic postal code |
| Unicode customer | `José`; `O'Neill`; `75001` | Unicode and apostrophe handling |
| Special-character customer | `John@#$`; `Smith!_`; `<>` | Non-destructive invalid-data attempt |
| Single-word postal | First `Li`; last `Ng`; postal `1` | Short boundary |
| Long text | 255 character alphanumeric first/last name and postal values | Boundary and layout handling |
| Whitespace | Spaces only or leading/trailing spaces | Required-field and trimming behavior |
| Empty | Empty string | Required validation |

## Standard cart fixtures

| Fixture | Products | Expected subtotal |
|---|---|---|
| Low | `Sauce Labs Bike Light` | $9.99 |
| Medium | `Sauce Labs Backpack` | $29.99 |
| Mixed | Backpack, Bike Light, Fleece Jacket | $89.97 |
| Maximum | All six inventory products | $129.96 |

Use prices currently published by SauceDemo and calculate expectations from displayed prices rather than hard-coding a catalog list that can change.

## Scenario 1 — Complete checkout happy path

**Goal:** Validate AC1–AC4 end to end.

**Steps and expected results:**
1. Open `/`, log in as `standard_user`.
   - Expected: Inventory page is displayed; cart badge is absent/empty.
2. Add Backpack, Bike Light, and Fleece Jacket.
   - Expected: Buttons change to Remove; cart badge shows `3`; selected products remain marked.
3. Open the cart.
   - Expected: Three items are listed; each shows name, description, price, and quantity `1`; total quantity is `3`.
4. Verify Checkout and Continue Shopping are visible, then select Checkout.
   - Expected: Checkout Information page loads with First Name, Last Name, and Postal Code fields.
5. Enter `John`, `Doe`, and `12345`; select Continue.
   - Expected: Overview loads and URL/path progresses to checkout overview.
6. Verify overview line items, quantity, payment `SauceCard #31337`, shipping `Free Pony Express Delivery!`, subtotal `$89.97`, tax `$7.20`, and total `$97.17`.
   - Expected: Values match cart contents and the calculation formula `total = subtotal + rounded tax`.
7. Select Finish.
   - Expected: Checkout Complete page displays `Thank you for your order!`, the dispatch confirmation, and Back Home.
8. Select Back Home.
   - Expected: Inventory loads and the cart badge is cleared; products can be re-added.

## Scenario 2 — Cart review and quantity integrity

1. Add a different quantity or product set and open the cart.
   - Expected: The cart item count equals the number of units, product metadata matches inventory, and each quantity is correct.
2. Remove one item.
   - Expected: Line item and cart badge update; inventory Remove changes to Add to cart; totals update on overview if remaining items proceed.
3. Remove all items and attempt Checkout.
   - Expected: Empty-cart state is shown. Checkout is not reachable through valid empty-cart business flow; direct protected-state navigation must not create an order.
4. Select Continue Shopping.
   - Expected: Inventory is shown and cart contents are preserved.

## Scenario 3 — Required-field validation (AC2)

Run each case with a non-empty cart.

1. Submit all fields empty.
   - Expected: `Error: First Name is required`; no overview navigation.
2. Enter only `John`, submit.
   - Expected: `Error: Last Name is required`.
3. Enter `John` and `Doe`, leave Postal Code empty, submit.
   - Expected: `Error: Postal Code is required`.
4. Enter Postal Code only, submit.
   - Expected: First Name remains first in the required-field order.
5. Submit a whitespace-only field while other fields are valid.
   - Expected: Application rejects it as empty if whitespace normalization is implemented; otherwise document this as an observable application limitation and do not proceed if the field is not meaningful.
6. Submit two valid fields plus an empty field, then dismiss the error with the X control and correct it.
   - Expected: Dismissal removes the alert; field values remain; correcting and resubmitting reaches Overview.
7. Repeat each missing field individually while preserving the two other valid values.
   - Expected: Exactly the currently missing required field is reported and navigation remains blocked.

## Scenario 4 — Invalid and special-character handling (AC5)

The name and postal fields are not documented by SauceDemo as restricted character fields. Assume SauceDemo deliberately accepts text rather than imposing a real identity/postal validation policy.

1. Enter `John@#$` / `Smith!_` / `<>`, submit.
   - Expected: The flow must not crash, script, or modify the page; values may be accepted and displayed safely. Navigation behavior is the asserted result: acceptance for non-empty non-whitespace text.
2. Enter `<script>alert(1)</script>` in each field, submit.
   - Expected: No script executes; markup is rendered as inert text if shown; page remains usable.
3. Enter Unicode, apostrophe, hyphen, one-letter names, and short alphanumeric postal values.
   - Expected: Non-empty values do not trigger unexpected character-class rejection; overview continues.
4. Enter 255 characters in each field.
   - Expected: No browser, server, or layout error; submit and overview behavior is stable; long values do not overlap controls.
5. Submit leading/trailing spaces around valid text.
   - Expected: If preserved, no semantic change occurs; if trimmed, displayed values reflect the trimmed value. Whitespace-only input is rejected or explicitly treated as empty.
6. Enter newline-like control characters or emoji.
   - Expected: Browser input remains safe, values are handled without crashing, and navigation follows the non-empty-text policy.

## Scenario 5 — Overview, pricing, tax, and order completion

1. Use all supported domestic boundaries and price fixtures from the Test Data section.
2. Verify subtotal equals sum of displayed line prices × quantity, rounded to cents.
3. Recalculate tax and total on Overview with `tax = round(subtotal × 0.08, 2)` and `total = subtotal + tax`; compare no more than cents.
4. Verify payment/shipping text and totals after quantity changes and product removals.
5. Verify all monetary text uses `$`, two decimal places, and identical values among cart and overview where applicable.
6. Re-select Finish only once; then verify one confirmation and no duplicate order side effects.
7. Use double-click Finish.
   - Expected: Only one Checkout Complete page/session is produced and the application never displays two conflicting completion states.
8. Refresh Overview and Checkout Complete.
   - Expected: Cart/form state is handled consistently; no duplicate purchase or page crash occurs. Document site behavior if refresh restores no longer valid state.

## Scenario 6 — Navigation and back-button behavior

| Starting point | Action | Expected result |
|---|---|---|
| Cart | Cancel/Continue Shopping | Returns to inventory; cart is preserved |
| Information | Cancel | Returns to cart; cart and navigation state are preserved |
| Information | Browser Back | Returns to cart without loss of cart contents |
| Overview | Cancel | Returns to inventory; cart is preserved because cancellation does not complete the order |
| Overview | Browser Back | Returns to information and preserves entered values where the browser retains them |
| Complete | Back Home | Returns to inventory; completed cart is cleared |
| Complete | Browser Back | No active purchase is recreated; checkout state is safely non-active |

Additional checks:
- Continue Shopping may add/remove items, then cart totals and quantities match the latest state.
- Browser Forward restores the expected page only when no completed checkout invalidates that state.
- Direct URL navigation to checkout pages without login or with an empty cart must not expose an order or create a successful checkout. SauceDemo may redirect or show its page-level handling; authenticated business guard behavior is the primary requirement.

## Scenario 7 — Authentication and direct access

1. In a fresh session, open checkout/cart URLs directly.
   - Expected: Login is required before protected checkout access; no order is created for an unauthenticated user.
2. Log in, complete checkout, log out, then revisit protected URLs with the browser Back/Forward controls.
   - Expected: Checkout/session state cannot be completed as another unauthenticated state.
3. Use standard user credentials and verify credentials do not persist as sensitive output in Playwright reports unless intentional test redaction is configured.

## Scenario 8 — Browser coverage

Playwright projects must cover:

| Project | Browser engine | Desktop profile |
|---|---|---|
| Chromium | Chromium | Desktop Chrome |
| Firefox | Firefox | Desktop Firefox |
| WebKit | WebKit | Desktop Safari |

For every desktop engine run at least the complete happy path, required-field cases, navigation cancellation, and exact pricing fixture. Compare element visibility, text, keyboard behavior, scrolling, and final cart clearing. The existing configuration is expected to enable these three desktop projects and all relevant mobile projects.

## Scenario 9 — Mobile coverage

Enable and run responsive projects for:

| Project | Device profile | Viewport |
|---|---|---|
| Mobile Chrome | Pixel 5 or equivalent | 393 × 851 |
| Mobile Safari | iPhone 12 or equivalent | 390 × 844 |

Test the full flow on both profiles: login, add/remove products, cart, required-field submit, valid information entry, overview, Finish, Back Home. Also check portrait and landscape at 667 × 375 and tablet at 768 × 1024. Expected results:
- No horizontal overflow at any supported viewport.
- Menus, fields, buttons, product cards, and cart lines remain visible and operable without overlapping.
- Touch targets are usable; virtual keyboards do not hide Continue permanently.
- Page scroll remains possible with keyboard open; Back Home stays reachable.
- Device browser Back and hardware/app navigation do not lose cart contents before completion.
- Visual output is captured only on failure or by the configured trace policy.

## Scenario 10 — Accessibility and usability checks

For each checkout page:
1. Tab through interactive controls in source order and verify visible focus.
2. Submit required-field errors and verify the error is announced and dismissible by keyboard.
3. Verify form fields have programmatic names matching First Name, Last Name, and Postal Code.
4. Verify buttons use descriptive names; images expose meaningful alternative text or are decorative.
5. Verify color alone is not used to communicate validation failure.

## Scenario 11 — Reliability and regression

1. Execute checkout scenarios in isolated browser contexts with fresh cart state.
2. Run mobile and desktop projects in parallel without sharing users, storage, or cart state.
3. Retry only infrastructure failures; assert application failures directly without hidden retries.
4. Capture screenshot, trace, video on failure, and console/page errors in artifacts as configured.
5. Verify Checkout never produces a false success; Finish requires an overview state reached from valid information.

## Exit criteria

- All P0 happy-path, validation, navigation, calculation, and cart-clearing cases pass on Chromium, Firefox, and WebKit.
- Mobile happy path passes on Pixel 5 and iPhone 12 profiles, or documented environment blockers are recorded.
- No unresolved cart integrity, duplicate completion, required-field bypass, navigation loss, monetary calculation, or script injection defects remain.
- Known SauceDemo behavior differences are documented in the defect report rather than asserted as project expectations without evidence.

## Assumptions and observations

- SauceDemo tax is calculated as 8% of item subtotal, with rounding to cents; fixtures assume this is reflected in the public application.
- SauceDemo’s checkout overview displays payment `SauceCard #31337` and `Free Pony Express Delivery!` regardless of entered details.
- SauceDemo does not implement a payment entry or real payment selection step; the story’s payment concept is represented by fixed overview information.
- SauceDemo accepts non-empty name/postal text without a documented character whitelist; the existing plan’s expectation that special characters are accepted should be retained until runtime evidence shows stricter behavior.
- Browser Back behavior may use session and browser-history implementation, so assertions should prefer cart integrity and non-active purchase state over exact URL restoration.
- Currency fixtures should be reconciled from the live catalog before execution because product and price data can change.
- The six-product maximum fixture price is expected to be $129.96 based on the current catalog, subject to live-site verification.
