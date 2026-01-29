// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Dark Theme Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should load with light theme by default when system preference is light', async ({ page }) => {
    await page.goto('/');
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const icon = await page.locator('.theme-icon').textContent();
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme-preference'));
    
    expect(theme).toBe('light');
    expect(icon).toBe('🌙');
    expect(savedTheme).toBeNull();
  });

  test('should toggle theme and update icon', async ({ page }) => {
    await page.goto('/');
    
    // Click toggle button
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const icon = await page.locator('.theme-icon').textContent();
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme-preference'));
    
    expect(theme).toBe('dark');
    expect(icon).toBe('☀️');
    expect(savedTheme).toBe('dark');
  });

  test('should persist theme preference across page refreshes', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    // Reload page
    await page.reload();
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const icon = await page.locator('.theme-icon').textContent();
    
    expect(theme).toBe('dark');
    expect(icon).toBe('☀️');
  });

  test('should revert to system preference when localStorage is cleared', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    // Clear localStorage
    await page.evaluate(() => localStorage.removeItem('theme-preference'));
    await page.reload();
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme-preference'));
    
    expect(theme).toBe('light'); // Assuming system preference is light in CI
    expect(savedTheme).toBeNull();
  });

  test('should have proper keyboard accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Tab to theme toggle button
    await page.keyboard.press('Tab');
    
    // Check if button is focused
    const focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return {
        tagName: focused.tagName,
        id: focused.id
      };
    });
    
    expect(focusedElement.id).toBe('theme-toggle');
    
    // Toggle with Enter key
    await page.keyboard.press('Enter');
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should display all sections correctly in dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    // Test each section
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
      
      // Verify theme is still dark
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(theme).toBe('dark');
    }
  });

  test('should have smooth transitions on theme change', async ({ page }) => {
    await page.goto('/');
    
    // Check transition properties
    const transitions = await page.evaluate(() => {
      const body = document.body;
      const container = document.querySelector('.container');
      
      return {
        body: window.getComputedStyle(body).transition,
        container: window.getComputedStyle(container).transition
      };
    });
    
    expect(transitions.body).toContain('0.3s');
    expect(transitions.container).toContain('0.3s');
  });

  test('should work correctly with animations in both themes', async ({ page }) => {
    await page.goto('/#stream-to-table');
    await page.waitForSelector('#section-1.active');
    
    // Test in light mode
    await page.locator('section-stream-to-table .ide-toolbar-btn.run').click();
    await page.waitForTimeout(3000);
    
    let tableRows = await page.locator('#append-table-body tr').count();
    expect(tableRows).toBeGreaterThan(0);
    
    // Reset
    await page.locator('section-stream-to-table .ide-toolbar-btn.stop').click();
    
    // Toggle to dark mode
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    // Test animation in dark mode
    await page.locator('section-stream-to-table .ide-toolbar-btn.run').click();
    await page.waitForTimeout(3000);
    
    tableRows = await page.locator('#append-table-body tr').count();
    expect(tableRows).toBeGreaterThan(0);
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should have visible focus states', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode for better visibility
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    // Tab to navigation button
    await page.keyboard.press('Tab');
    
    // Check if outline is visible
    const hasOutline = await page.evaluate(() => {
      const focused = document.activeElement;
      const outline = window.getComputedStyle(focused).outline;
      return outline !== 'none' && outline !== '';
    });
    
    expect(hasOutline).toBe(true);
  });

  test('should maintain theme during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    
    // Navigate through sections
    await page.getByRole('button', { name: /Stream.*Table/ }).click();
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    
    await page.getByRole('button', { name: /Table.*Stream/ }).click();
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    
    await page.getByRole('button', { name: /Changelog Types/ }).click();
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });
});
