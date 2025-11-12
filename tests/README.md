# Playwright Tests

This directory contains automated tests for the Flink Table-Stream Duality demo application.

## Test Coverage

### Dark Theme Functionality Tests (`theme.spec.js`)

The test suite validates all aspects of the dark theme implementation:

1. **Initial Load with System Preferences**
   - Verifies light theme loads by default when system preference is light
   - Checks correct icon display (🌙 for light mode)

2. **Toggle Button Functionality**
   - Tests theme switching between light and dark modes
   - Validates icon updates (🌙 ↔ ☀️)
   - Confirms localStorage persistence

3. **localStorage Persistence**
   - Ensures theme preference persists across page refreshes
   - Tests theme restoration from saved preference

4. **System Preference Detection**
   - Validates fallback to system preference when localStorage is cleared
   - Tests proper theme detection

5. **Visual Consistency Across All Sections**
   - Tests all 6 demo sections in dark mode:
     - Core Concept
     - Stream to Table
     - Table to Stream
     - Stream Types
     - Live Aggregation
     - Code Examples

6. **Keyboard Accessibility**
   - Validates Tab navigation to theme toggle
   - Tests Enter key activation
   - Verifies visible focus states

7. **Smooth Transitions**
   - Checks CSS transition properties (0.3s)
   - Validates smooth theme switching

8. **Animation Compatibility**
   - Tests stream-to-table animation in both themes
   - Ensures animations work correctly in light and dark modes

9. **Focus States**
   - Validates visible focus outlines on interactive elements
   - Tests focus visibility in both themes

10. **Navigation Persistence**
    - Ensures theme persists during section navigation
    - Tests theme consistency across all pages

## Running Tests

### Prerequisites

```bash
npm install
npx playwright install
```

### Run All Tests

```bash
npm test
```

### Run Tests in UI Mode

```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View Test Report

```bash
npx playwright show-report
```

## CI/CD Integration

Tests run automatically on:
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

See `.github/workflows/playwright-tests.yml` for the GitHub Actions configuration.

## Test Results

Test results and screenshots are uploaded as artifacts in GitHub Actions:
- `playwright-report`: HTML test report (always uploaded)
- `playwright-screenshots`: Screenshots of failed tests (uploaded on failure)

## Writing New Tests

When adding new features, follow these guidelines:

1. Create descriptive test names that explain what is being tested
2. Use `test.beforeEach()` to set up clean state
3. Use Playwright's built-in assertions (`expect`)
4. Test both positive and negative scenarios
5. Ensure tests are independent and can run in any order
6. Add appropriate waits for animations and async operations

## Configuration

Test configuration is in `playwright.config.js`:
- Base URL: `http://localhost:8000`
- Test directory: `./tests`
- Browsers: Chromium, Firefox, WebKit
- Web server: Python HTTP server on port 8000
- Retries: 2 in CI, 0 locally
- Screenshots: Only on failure
- Trace: On first retry
