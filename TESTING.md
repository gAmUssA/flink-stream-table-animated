# Testing Documentation

## Overview

This document provides comprehensive information about the automated testing setup for the Flink Table-Stream Duality demo application.

## Test Suite Summary

### Dark Theme Functionality Tests

**Location**: `tests/theme.spec.js`

**Total Tests**: 10

**Coverage Areas**:

1. ✅ Initial load with system preferences
2. ✅ Toggle button functionality and icon updates
3. ✅ localStorage persistence across page refreshes
4. ✅ System preference detection after localStorage clear
5. ✅ Keyboard accessibility (Tab + Enter)
6. ✅ Visual consistency across all 6 demo sections
7. ✅ Smooth CSS transitions (0.3s)
8. ✅ Animation compatibility in both themes
9. ✅ Visible focus states
10. ✅ Theme persistence during navigation

## Test Execution

### Local Testing

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# View HTML report
npx playwright show-report
```

### CI/CD Testing

Tests run automatically on GitHub Actions for:

- **Push to main branch**: Triggers both deployment and test workflows
- **Pull requests**: Runs tests before allowing merge
- **Manual dispatch**: Can be triggered manually from Actions tab

**Workflow File**: `.github/workflows/playwright-tests.yml`

**Test Results**: Available as artifacts in GitHub Actions
- `playwright-report`: HTML test report (always uploaded)
- `playwright-screenshots`: Screenshots of failures (uploaded on failure)

## Test Configuration

### Playwright Configuration (`playwright.config.js`)

```javascript
{
  testDir: './tests',
  baseURL: 'http://localhost:8000',
  fullyParallel: true,
  retries: 2 (in CI), 0 (locally),
  workers: 1 (in CI), auto (locally),
  browsers: ['chromium', 'firefox', 'webkit'],
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://localhost:8000'
  }
}
```

## Test Details

### Test 1: Initial Load with System Preferences

**Purpose**: Verify correct theme on initial load

**Steps**:
1. Clear localStorage
2. Navigate to application
3. Check theme attribute
4. Verify icon display
5. Confirm no saved preference

**Expected Results**:
- Theme: `light` (default)
- Icon: 🌙
- localStorage: `null`

### Test 2: Toggle Button Functionality

**Purpose**: Verify theme toggle works correctly

**Steps**:
1. Navigate to application
2. Click theme toggle button
3. Check theme attribute
4. Verify icon update
5. Confirm localStorage save

**Expected Results**:
- Theme: `dark`
- Icon: ☀️
- localStorage: `"dark"`

### Test 3: localStorage Persistence

**Purpose**: Verify theme persists across page refreshes

**Steps**:
1. Navigate to application
2. Toggle to dark mode
3. Reload page
4. Check theme and icon

**Expected Results**:
- Theme remains `dark` after reload
- Icon remains ☀️

### Test 4: System Preference Detection

**Purpose**: Verify fallback to system preference

**Steps**:
1. Navigate to application
2. Toggle to dark mode
3. Clear localStorage
4. Reload page
5. Check theme

**Expected Results**:
- Theme reverts to system preference
- localStorage is `null`

### Test 5: Keyboard Accessibility

**Purpose**: Verify keyboard navigation works

**Steps**:
1. Navigate to application
2. Press Tab key
3. Verify focus on theme toggle
4. Press Enter key
5. Check theme change

**Expected Results**:
- Theme toggle receives focus
- Enter key toggles theme
- Theme changes to `dark`

### Test 6: Visual Consistency Across Sections

**Purpose**: Verify all sections display correctly in dark mode

**Steps**:
1. Navigate to application
2. Toggle to dark mode
3. Navigate through all 6 sections
4. Verify theme persists

**Expected Results**:
- All sections accessible
- Theme remains `dark` throughout
- URLs update correctly

### Test 7: Smooth Transitions

**Purpose**: Verify CSS transitions are configured

**Steps**:
1. Navigate to application
2. Check computed styles for transitions
3. Verify transition duration

**Expected Results**:
- Body transition: `0.3s`
- Container transition: `0.3s`

### Test 8: Animation Compatibility

**Purpose**: Verify animations work in both themes

**Steps**:
1. Navigate to Stream to Table section
2. Start animation in light mode
3. Verify table rows appear
4. Toggle to dark mode
5. Start animation again
6. Verify table rows appear

**Expected Results**:
- Animations work in light mode
- Animations work in dark mode
- Table rows populate correctly

### Test 9: Visible Focus States

**Purpose**: Verify focus outlines are visible

**Steps**:
1. Navigate to application
2. Toggle to dark mode
3. Tab to navigation button
4. Check for visible outline

**Expected Results**:
- Focus outline is visible
- Outline is not `none`

### Test 10: Theme Persistence During Navigation

**Purpose**: Verify theme persists when navigating

**Steps**:
1. Navigate to application
2. Toggle to dark mode
3. Navigate through multiple sections
4. Check theme after each navigation

**Expected Results**:
- Theme remains `dark` throughout navigation
- No theme resets occur

## Continuous Integration

### GitHub Actions Workflow

**File**: `.github/workflows/playwright-tests.yml`

**Triggers**:
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

**Steps**:
1. Checkout code
2. Setup Node.js 18
3. Install npm dependencies
4. Install Playwright browsers
5. Run Playwright tests
6. Upload test results (always)
7. Upload screenshots (on failure)

**Timeout**: 60 minutes

**Runner**: Ubuntu latest

### Viewing Test Results

1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Playwright Tests" workflow
4. Click on a specific run
5. View test results and download artifacts

## Troubleshooting

### Tests Failing Locally

1. **Clear browser cache**: `npx playwright clean`
2. **Reinstall browsers**: `npx playwright install --force`
3. **Check port availability**: Ensure port 8000 is free
4. **Update dependencies**: `npm install`

### Tests Failing in CI

1. **Check workflow logs**: View detailed logs in GitHub Actions
2. **Download artifacts**: Check screenshots and HTML report
3. **Verify dependencies**: Ensure package.json is up to date
4. **Check timeouts**: Increase timeout if needed

### Common Issues

**Issue**: Tests timeout
**Solution**: Increase timeout in playwright.config.js or specific tests

**Issue**: Browser not found
**Solution**: Run `npx playwright install`

**Issue**: Port already in use
**Solution**: Kill process on port 8000 or change port in config

**Issue**: localStorage not persisting
**Solution**: Check browser privacy settings

## Best Practices

1. **Run tests before committing**: `npm test`
2. **Write descriptive test names**: Explain what is being tested
3. **Use beforeEach for setup**: Ensure clean state
4. **Test both positive and negative cases**: Cover edge cases
5. **Keep tests independent**: Tests should not depend on each other
6. **Use appropriate waits**: Wait for animations and async operations
7. **Check CI before merging**: Ensure all tests pass in CI

## Future Enhancements

Potential areas for additional testing:

- [ ] Visual regression testing with screenshots
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility testing (axe-core)
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsive testing
- [ ] Animation timing tests
- [ ] Error handling tests
- [ ] Network failure scenarios

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD with Playwright](https://playwright.dev/docs/ci)
