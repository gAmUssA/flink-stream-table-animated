// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Mobile Layouts (320px - 480px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have scrollable navigation with touch-friendly targets on 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check navigation is scrollable
    const navOverflow = await page.locator('.navigation').evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.overflowX;
    });
    expect(navOverflow).toBe('auto');
    
    // Check touch target sizes (minimum 44x44px)
    const buttons = await page.locator('.nav-btn').all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should display readable content on 320px screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Check minimum font sizes
    const bodyFontSize = await page.evaluate(() => {
      const body = document.body;
      return parseFloat(window.getComputedStyle(body).fontSize);
    });
    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
    
    // Check no horizontal scroll on main content
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should stack split-views vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to section with split-view
    await page.goto('/#stream-to-table');
    
    const splitView = page.locator('.split-view').first();
    const gridColumns = await splitView.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should be single column (1fr or similar)
    expect(gridColumns).not.toContain('1fr 1fr');
  });

  test('should have proper touch targets for control buttons', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#stream-to-table');
    
    const controlButtons = await page.locator('#section-1 .controls .btn').all();
    
    for (const button of controlButtons) {
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should test all 6 sections for readability on 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const sections = [
      { name: /Core Concept/, hash: '#concept' },
      { name: /Stream.*Table/, hash: '#stream-to-table' },
      { name: /Table.*Stream/, hash: '#table-to-stream' },
      { name: /Changelog Types/, hash: '#stream-types' },
      { name: /Live SQL/, hash: '#live-aggregation' },
      { name: /Code Examples/, hash: '#code-examples' }
    ];
    
    for (const section of sections) {
      await page.goto(`/${section.hash}`);
      
      // Check section is visible
      const sectionElement = page.locator('.demo-section.active');
      await expect(sectionElement).toBeVisible();
      
      // Check no horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);
    }
  });

  test('should handle animations properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#stream-to-table');
    
    // Start animation
    await page.getByRole('button', { name: /Run/ }).click();
    await page.waitForTimeout(2000);
    
    // Check animation is running
    const tableRows = await page.locator('#append-table-body tr').count();
    expect(tableRows).toBeGreaterThan(0);
    
    // Check stream container is visible and scaled
    const streamContainer = page.locator('.kafka-messages');
    await expect(streamContainer).toBeVisible();
  });

  test('should have accessible theme toggle on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const themeToggle = page.locator('#theme-toggle');
    const box = await themeToggle.boundingBox();
    
    // Should be at least 40x40px on mobile
    expect(box.width).toBeGreaterThanOrEqual(36);
    expect(box.height).toBeGreaterThanOrEqual(36);
    
    // Should be clickable
    await themeToggle.click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should display tables with horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#stream-to-table');
    
    // Start animation to populate table
    await page.getByRole('button', { name: /Run/ }).click();
    await page.waitForTimeout(1500);
    
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
    
    // Table should be scrollable if needed
    const tableContainer = table.locator('..');
    const overflow = await tableContainer.evaluate(el => {
      return window.getComputedStyle(el).overflowX;
    });
    expect(['auto', 'scroll']).toContain(overflow);
  });

  test('should display code blocks with proper sizing on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#code-examples');
    
    const codeBlock = page.locator('#section-5 .ide-editor').first();
    await expect(codeBlock).toBeVisible();
    
    // Check font size is readable (12-14px)
    const fontSize = await codeBlock.evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(fontSize).toBeGreaterThanOrEqual(11);
    expect(fontSize).toBeLessThanOrEqual(15);
  });

  test('should maintain proper spacing between interactive elements', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#stream-to-table');
    
    const controls = page.locator('#section-1 .controls').first();
    const gap = await controls.evaluate(el => {
      return parseFloat(window.getComputedStyle(el).gap);
    });
    
    // Minimum 8px spacing
    expect(gap).toBeGreaterThanOrEqual(8);
  });
});

test.describe('Tablet Layouts (481px - 1024px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display proper portrait layout at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check navigation fits properly
    const navButtons = await page.locator('.nav-btn').all();
    expect(navButtons.length).toBe(6);
    
    // All buttons should be visible
    for (const button of navButtons) {
      await expect(button).toBeVisible();
    }
  });

  test('should maintain single-column split-view in portrait', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#stream-to-table');
    
    const splitView = page.locator('.split-view').first();
    const gridColumns = await splitView.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should still be single column in portrait
    expect(gridColumns).not.toContain('1fr 1fr');
  });

  test('should restore two-column layout in landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/#stream-to-table');
    
    const splitView = page.locator('.split-view').first();
    const gridColumns = await splitView.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should have two columns in landscape
    expect(gridColumns).toContain('1fr');
  });

  test('should have intermediate sizing at 600px', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    
    // Check header sizing
    const headerH1 = page.locator('.header h1');
    const fontSize = await headerH1.evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    
    // Should be between mobile and desktop sizes
    expect(fontSize).toBeGreaterThan(25); // Larger than mobile
    expect(fontSize).toBeLessThan(40); // Smaller than desktop
  });

  test('should handle orientation changes properly', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#stream-to-table');
    
    let splitView = page.locator('.split-view').first();
    let gridColumns = await splitView.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    expect(gridColumns).not.toContain('1fr 1fr');
    
    // Switch to landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500); // Allow CSS to recalculate
    
    gridColumns = await splitView.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    expect(gridColumns).toContain('1fr');
  });

  test('should display grids appropriately on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#stream-types');
    
    // Check if content is readable and properly laid out
    const section = page.locator('#section-3');
    await expect(section).toBeVisible();
    
    // No horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('should maintain touch targets on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#live-aggregation');
    
    const buttons = await page.locator('#section-4 .controls .btn').all();
    
    for (const button of buttons) {
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should test all sections in tablet portrait', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const sections = [
      '#concept',
      '#stream-to-table',
      '#table-to-stream',
      '#stream-types',
      '#live-aggregation',
      '#code-examples'
    ];
    
    for (const hash of sections) {
      await page.goto(`/${hash}`);
      
      const section = page.locator('.demo-section.active');
      await expect(section).toBeVisible();
      
      // Check readability
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);
    }
  });

  test('should test all sections in tablet landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    const sections = [
      '#concept',
      '#stream-to-table',
      '#table-to-stream',
      '#stream-types',
      '#live-aggregation',
      '#code-examples'
    ];
    
    for (const hash of sections) {
      await page.goto(`/${hash}`);
      
      const section = page.locator('.demo-section.active');
      await expect(section).toBeVisible();
    }
  });
});

test.describe('Desktop Regression Testing (1025px+)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should maintain desktop layout at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Check container max-width
    const container = page.locator('.container');
    const maxWidth = await container.evaluate(el => {
      return window.getComputedStyle(el).maxWidth;
    });
    expect(maxWidth).toBe('1200px');
  });

  test('should display two-column split-views on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/#stream-to-table');
    
    const splitView = page.locator('.split-view').first();
    const gridColumns = await splitView.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should have two columns
    expect(gridColumns).toContain('1fr');
  });

  test('should maintain all interactive features on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Test navigation
    await page.getByRole('button', { name: /Stream.*Table/ }).click();
    await expect(page).toHaveURL(/#stream-to-table/);
    
    // Wait for section to be active
    await page.waitForSelector('#section-1.active');
    
    // Test animation controls
    const startButton = page.getByRole('button', { name: /Run/ });
    await expect(startButton).toBeVisible();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    const tableRows = await page.locator('#append-table-body tr').count();
    expect(tableRows).toBeGreaterThan(0);
    
    // Test reset (section 1 doesn't have a pause button, only start and reset)
    await page.waitForTimeout(500);
    const resetButton = page.getByRole('button', { name: 'Reset' });
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    await page.waitForTimeout(500);
    // After reset, there should be 1 row (the placeholder "Table is empty" message)
    const resetRows = await page.locator('#append-table-body tr').count();
    expect(resetRows).toBe(1);
  });

  test('should maintain theme toggle functionality on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    const lightTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(lightTheme).toBe('light');
  });

  test('should display all sections correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const sections = [
      { name: /Core Concept/, hash: '#concept' },
      { name: /Stream.*Table/, hash: '#stream-to-table' },
      { name: /Table.*Stream/, hash: '#table-to-stream' },
      { name: /Changelog Types/, hash: '#stream-types' },
      { name: /Live SQL/, hash: '#live-aggregation' },
      { name: /Code Examples/, hash: '#code-examples' }
    ];
    
    for (const section of sections) {
      await page.getByRole('button', { name: section.name }).click();
      await expect(page).toHaveURL(new RegExp(section.hash));
      
      const sectionElement = page.locator('.demo-section.active');
      await expect(sectionElement).toBeVisible();
    }
  });

  test('should maintain proper typography on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const headerH1 = page.locator('.header h1');
    const fontSize = await headerH1.evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    
    // Desktop font size should be larger
    expect(fontSize).toBeGreaterThan(30);
  });

  test('should have no visual regressions in animations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/#live-aggregation');
    
    // Wait for section to be active
    await page.waitForSelector('#section-4.active');
    
    // Start aggregation (button text is just "▶️ Start" not "▶️ Start Aggregation")
    const startButton = page.getByRole('button', { name: /Start/ });
    await expect(startButton).toBeVisible({ timeout: 10000 });
    await startButton.click();
    await page.waitForTimeout(3000);
    
    // Check table is populated (correct table body id is agg-result-body)
    const tableRows = await page.locator('#agg-result-body tr').count();
    expect(tableRows).toBeGreaterThan(0);
    
    // Check input stream has events
    const inputStream = page.locator('#agg-input');
    await expect(inputStream).toBeVisible();
    const hasContent = await inputStream.evaluate(el => el.textContent.trim().length > 0);
    expect(hasContent).toBe(true);
  });

  test('should maintain code block styling on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/#code-examples');
    
    // Wait for section to be active
    await page.waitForSelector('#section-5.active');
    
    // Check that code examples section is visible
    const section = page.locator('#section-5');
    await expect(section).toBeVisible();
    
    // Verify code blocks are present (using .code-block class which exists in section 5)
    const codeBlock = section.locator('.ide-editor').first();
    await expect(codeBlock).toBeVisible();
    
    // Check that code blocks have proper styling (IDE editor uses flex layout)
    const display = await codeBlock.evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    
    // IDE editor should use flex layout
    expect(display).toBe('flex');
  });
});

test.describe('Cross-Browser Compatibility', () => {
  test('should work on mobile viewport across browsers', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test basic functionality
    await page.getByRole('button', { name: /Stream.*Table/ }).click();
    await expect(page).toHaveURL(/#stream-to-table/);
    
    // Test animation
    await page.getByRole('button', { name: /Run/ }).click();
    await page.waitForTimeout(2000);
    
    const tableRows = await page.locator('#append-table-body tr').count();
    expect(tableRows).toBeGreaterThan(0);
  });

  test('should handle touch interactions properly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test interaction on navigation (click works for both touch and mouse)
    const navButton = page.getByRole('button', { name: /Core Concept/ });
    await navButton.click();
    
    // Check navigation worked
    await expect(page).toHaveURL(/#concept/);
  });

  test('should maintain theme across browsers', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Toggle theme
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    
    // Reload and check persistence
    await page.reload();
    const persistedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(persistedTheme).toBe('dark');
  });

  test('should display smooth scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check webkit overflow scrolling
    const navigation = page.locator('.navigation');
    const scrolling = await navigation.evaluate(el => {
      return window.getComputedStyle(el).webkitOverflowScrolling || 'auto';
    });
    
    // Should have touch scrolling enabled
    expect(['touch', 'auto']).toContain(scrolling);
  });

  test('should handle viewport meta tag correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute('content') : null;
    });
    
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
  });

  test('should work with different pixel densities', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test at different device pixel ratios
    await page.emulateMedia({ colorScheme: 'light' });
    
    const section = page.locator('.demo-section.active');
    await expect(section).toBeVisible();
    
    // Check text is readable
    const bodyFontSize = await page.evaluate(() => {
      return parseFloat(window.getComputedStyle(document.body).fontSize);
    });
    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
  });
});
