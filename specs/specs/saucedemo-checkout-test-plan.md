# SCRUM-101 - E-commerce Checkout Process Test Plan

## Application Overview

Comprehensive test plan for the SauceDemo e-commerce checkout process covering all user flows from cart review through order completion. Tests include positive scenarios, validation handling, navigation flows, and edge cases across the complete customer purchase journey.

## Test Scenarios

### 1. Checkout Process E2E Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Complete Checkout Flow - Happy Path

**File:** `tests/checkout/complete-checkout-flow.spec.ts`

**Steps:**
  1. Login to application with standard_user credentials
    - expect: User is successfully logged in
    - expect: Products page is displayed
  2. Add multiple products to cart (Backpack $29.99, Bike Light $9.99, Fleece Jacket $49.99)
    - expect: Cart badge shows correct item count
    - expect: Add to cart button changes to Remove
    - expect: Cart icon updates dynamically
  3. Navigate to cart page by clicking cart badge
    - expect: Cart page displays all added items
    - expect: Each item shows name, description, price, quantity
    - expect: Continue Shopping and Checkout buttons are visible
  4. Click Checkout button to proceed to information entry
    - expect: Checkout information page loads
    - expect: Form displays First Name, Last Name, Zip/Postal Code fields
    - expect: Cancel and Continue buttons are present
  5. Fill in checkout information (First Name: John, Last Name: Doe, Zip: 12345)
    - expect: All form fields accept valid data
    - expect: No validation errors appear
  6. Click Continue to proceed to overview
    - expect: Checkout overview page loads
    - expect: All ordered items are displayed with quantities
    - expect: Payment information shows SauceCard #31337
    - expect: Shipping shows Free Pony Express Delivery
    - expect: Price breakdown shows Item total: $89.97, Tax: $7.20, Total: $97.17
  7. Click Finish to complete order
    - expect: Order confirmation page displays
    - expect: Success message 'Thank you for your order!' is shown
    - expect: Order dispatch message is displayed
    - expect: Back Home button is present
  8. Click Back Home button
    - expect: Returns to products page
    - expect: Cart badge is cleared/removed
    - expect: All products show Add to cart buttons

#### 1.2. Cart Review Functionality - AC1

**File:** `tests/checkout/cart-review.spec.ts`

**Steps:**
  1. Login and add items with different prices to cart
    - expect: Items are successfully added to cart
  2. Navigate to cart page and verify item details display
    - expect: All items show correct name, description, price
    - expect: Quantity column displays correct values
    - expect: Individual prices are visible for each item
  3. Verify navigation options in cart
    - expect: Continue Shopping button is present and functional
    - expect: Checkout button is present and functional
    - expect: Remove buttons are available for each item
  4. Test Continue Shopping functionality
    - expect: Returns to products page
    - expect: Cart contents are preserved
    - expect: Product states reflect cart contents
  5. Test Remove item functionality
    - expect: Item is removed from cart
    - expect: Cart count updates
    - expect: Product button changes to Add to cart

#### 1.3. Checkout Information Entry Validation - AC2

**File:** `tests/checkout/information-entry-validation.spec.ts`

**Steps:**
  1. Navigate to checkout information page with items in cart
    - expect: Checkout information form is displayed
    - expect: All required fields are present
  2. Click Continue without filling any fields
    - expect: Error message displays 'Error: First Name is required'
    - expect: Red X indicators appear on all empty fields
    - expect: Form remains on same page for correction
  3. Fill only First Name and click Continue
    - expect: Error message displays 'Error: Last Name is required'
    - expect: Visual indicators persist for empty fields
  4. Fill First Name and Last Name, leave Zip empty and click Continue
    - expect: Error message displays 'Error: Postal Code is required'
    - expect: Form validation prevents progression
  5. Test error message dismissal functionality
    - expect: Error message can be dismissed using X button
    - expect: Form remains accessible for correction
  6. Fill all fields with valid data and proceed
    - expect: Form accepts valid data
    - expect: Successfully progresses to checkout overview

#### 1.4. Order Overview Verification - AC3

**File:** `tests/checkout/order-overview.spec.ts`

**Steps:**
  1. Complete checkout information and reach overview page
    - expect: Checkout overview page loads successfully
  2. Verify item summary display
    - expect: All ordered items are listed with QTY and Description
    - expect: Item details match cart contents
    - expect: Individual prices are displayed
  3. Verify payment and shipping information
    - expect: Payment Information shows 'SauceCard #31337'
    - expect: Shipping Information shows 'Free Pony Express Delivery!'
  4. Verify price calculations
    - expect: Item total shows sum of all item prices
    - expect: Tax calculation is accurate (8% rate)
    - expect: Total amount includes tax
    - expect: All monetary values are formatted correctly
  5. Verify navigation options
    - expect: Cancel button is present and functional
    - expect: Finish button is present and functional

#### 1.5. Order Completion Confirmation - AC4

**File:** `tests/checkout/order-completion.spec.ts`

**Steps:**
  1. Complete entire checkout flow up to Finish button
    - expect: Checkout overview page is displayed with all details
  2. Click Finish button to complete order
    - expect: Order confirmation page loads
    - expect: Page title shows 'Checkout: Complete!'
  3. Verify success messaging
    - expect: Success message 'Thank you for your order!' is displayed
    - expect: Order dispatch message confirms delivery
    - expect: Pony Express image/icon is shown
  4. Verify cart clearing functionality
    - expect: Cart badge is no longer visible
    - expect: Cart has been cleared of all items
  5. Test Back Home navigation
    - expect: Back Home button returns to products page
    - expect: All products show Add to cart buttons
    - expect: User can start new shopping session

#### 1.6. Error Handling and Edge Cases - AC5

**File:** `tests/checkout/error-handling-edge-cases.spec.ts`

**Steps:**
  1. Test special characters in form fields (@#$% in First Name)
    - expect: Form accepts special characters
    - expect: No character validation errors occur
    - expect: Process can continue with special characters
  2. Test boundary conditions with very long text input
    - expect: Form handles long text appropriately
    - expect: No system errors occur
    - expect: Text is properly truncated or handled
  3. Test form field combinations with mixed valid/invalid data
    - expect: Validation works for each field independently
    - expect: Appropriate error messages display
    - expect: User can correct and resubmit
  4. Test rapid clicking of buttons
    - expect: No duplicate processing occurs
    - expect: System handles multiple clicks gracefully
    - expect: User feedback is appropriate
  5. Test browser back button during checkout process
    - expect: Navigation behaves predictably
    - expect: Cart contents are preserved
    - expect: User can resume checkout process

#### 1.7. Navigation Flow Testing

**File:** `tests/checkout/navigation-flows.spec.ts`

**Steps:**
  1. Test Cancel button from checkout information page
    - expect: Returns to cart page
    - expect: Cart contents are preserved
    - expect: User can restart checkout
  2. Test Cancel button from checkout overview page
    - expect: Returns to products page
    - expect: Cart contents are preserved
    - expect: Navigation is intuitive
  3. Test Continue Shopping from cart at different states
    - expect: Always returns to products page
    - expect: Cart state is maintained
    - expect: Product states reflect cart contents
  4. Test complete navigation loop without completing purchase
    - expect: User can navigate freely through all checkout steps
    - expect: Cart is preserved throughout navigation
    - expect: No data loss occurs
  5. Verify all navigation paths maintain cart integrity
    - expect: Cart contents persist across all pages
    - expect: Item counts remain accurate
    - expect: User experience is consistent

#### 1.8. Price Calculation and Tax Verification

**File:** `tests/checkout/price-calculations.spec.ts`

**Steps:**
  1. Add single low-price item and verify calculations
    - expect: Item total matches product price
    - expect: Tax is calculated at 8% rate
    - expect: Total equals item total plus tax
  2. Add multiple items with different prices and verify totals
    - expect: Item total is sum of all individual prices
    - expect: Tax calculation scales correctly
    - expect: Final total is mathematically correct
  3. Test with maximum number of different items
    - expect: All 6 products can be added to cart
    - expect: Large totals calculate correctly
    - expect: No rounding errors in calculations
  4. Verify monetary formatting throughout checkout
    - expect: All prices display with $ symbol and 2 decimal places
    - expect: Formatting is consistent across all pages
    - expect: No formatting errors in calculations

#### 1.9. Cross-Browser Compatibility Testing

**File:** `tests/checkout/cross-browser-compatibility.spec.ts`

**Steps:**
  1. Execute complete checkout flow in Chrome browser
    - expect: All functionality works correctly
    - expect: Visual elements display properly
    - expect: No browser-specific issues occur
  2. Execute complete checkout flow in Firefox browser
    - expect: Identical functionality to Chrome
    - expect: Form validation works consistently
    - expect: Navigation behaves the same
  3. Execute complete checkout flow in Safari browser
    - expect: All features function as expected
    - expect: No Safari-specific compatibility issues
    - expect: User experience is consistent
  4. Compare behavior across all browsers
    - expect: Functionality is identical across browsers
    - expect: No browser-specific bugs exist
    - expect: Performance is acceptable on all browsers

#### 1.10. Mobile Responsiveness Testing

**File:** `tests/checkout/mobile-responsiveness.spec.ts`

**Steps:**
  1. Test checkout flow on mobile viewport (iPhone dimensions)
    - expect: All elements are properly sized and accessible
    - expect: Form fields are easy to interact with
    - expect: Navigation buttons are appropriately sized
  2. Test checkout flow on tablet viewport (iPad dimensions)
    - expect: Layout adapts appropriately to tablet size
    - expect: All functionality remains accessible
    - expect: User experience is optimized for touch
  3. Test form interactions on smaller screens
    - expect: Virtual keyboard doesn't obscure form fields
    - expect: Scrolling behavior is appropriate
    - expect: Submit buttons remain accessible
  4. Verify mobile-specific navigation patterns
    - expect: Back buttons function correctly on mobile
    - expect: Touch targets are appropriately sized
    - expect: Mobile browser navigation works properly