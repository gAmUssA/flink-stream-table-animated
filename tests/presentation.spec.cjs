// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Slide-Based Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Initial State', () => {
    test('should load with first section active', async ({ page }) => {
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should show slide controls by default', async ({ page }) => {
      const controls = page.locator('slide-controls');
      await expect(controls).toBeVisible();
    });

    test('should display correct initial progress', async ({ page }) => {
      const progress = page.locator('slide-controls .progress');
      await expect(progress).toContainText('1 / 6');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate to next slide with ArrowRight', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-1');
    });

    test('should navigate to previous slide with ArrowLeft', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowLeft');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should navigate to next slide with Space', async ({ page }) => {
      await page.keyboard.press('Space');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-1');
    });

    test('should navigate to next slide with PageDown', async ({ page }) => {
      await page.keyboard.press('PageDown');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-1');
    });

    test('should navigate to previous slide with PageUp', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('PageUp');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should not navigate past first slide', async ({ page }) => {
      await page.keyboard.press('ArrowLeft');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should not navigate past last slide', async ({ page }) => {
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
      }
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-5');
    });

    test('should jump to section with number keys', async ({ page }) => {
      await page.keyboard.press('3');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-2');
    });

    test('should jump to first section with Home key', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Home');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should jump to last section with End key', async ({ page }) => {
      await page.keyboard.press('End');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-5');
    });
  });

  test.describe('Slide Controls', () => {
    test('should update progress when navigating', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      
      const progress = page.locator('slide-controls .progress');
      await expect(progress).toContainText('2 / 6');
    });

    test('should navigate with next button click', async ({ page }) => {
      await page.getByRole('button', { name: 'Next slide' }).click();
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-1');
    });

    test('should navigate with previous button click', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      await page.getByRole('button', { name: 'Previous slide' }).click();
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should disable previous button on first slide', async ({ page }) => {
      const prevButton = page.getByRole('button', { name: 'Previous slide' });
      await expect(prevButton).toBeDisabled();
    });

    test('should disable next button on last slide', async ({ page }) => {
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowRight');
      }
      
      const nextButton = page.getByRole('button', { name: 'Next slide' });
      await expect(nextButton).toBeDisabled();
    });
  });

  test.describe('Premium Layout', () => {
    test('should have fullscreen slide layout', async ({ page }) => {
      const sectionHeight = await page.evaluate(() => {
        const section = document.querySelector('.demo-section.active');
        if (!section) return 0;
        return section.getBoundingClientRect().height;
      });
      
      expect(sectionHeight).toBeGreaterThan(100);
    });

    test('should have active section visible', async ({ page }) => {
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });

    test('should have container visible', async ({ page }) => {
      const container = page.locator('.container');
      await expect(container).toBeVisible();
    });
  });

  test.describe('Reduced Motion Fallback', () => {
    test('should respect prefers-reduced-motion setting', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });
  });

  test.describe('Viewport Sizes', () => {
    test('should work at 1920x1080 viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const container = page.locator('.container');
      await expect(container).toBeVisible();
      
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });

    test('should work at 1280x720 viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      
      const container = page.locator('.container');
      await expect(container).toBeVisible();
      
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });

    test('should work at mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const container = page.locator('.container');
      await expect(container).toBeVisible();
      
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on controls', async ({ page }) => {
      const prevButton = page.getByRole('button', { name: 'Previous slide' });
      const nextButton = page.getByRole('button', { name: 'Next slide' });
      
      await expect(prevButton).toHaveAttribute('aria-label', 'Previous slide');
      await expect(nextButton).toHaveAttribute('aria-label', 'Next slide');
    });

    test('should have live region for progress indicator', async ({ page }) => {
      const progress = page.locator('slide-controls .progress');
      await expect(progress).toHaveAttribute('aria-live', 'polite');
    });
  });

  test.describe('Auto-Hide Controls', () => {
    test('should auto-hide slide controls after 3 seconds', async ({ page }) => {
      const controls = page.locator('slide-controls');
      
      await page.waitForTimeout(3500);
      
      await expect(controls).toHaveAttribute('hidden-controls', '');
    });

    test('should show controls on keyboard navigation', async ({ page }) => {
      await page.waitForTimeout(3500);
      
      await page.keyboard.press('ArrowRight');
      
      const controls = page.locator('slide-controls');
      const hiddenAttr = await controls.getAttribute('hidden-controls');
      expect(hiddenAttr).toBeNull();
    });

    test('should keep controls visible on hover', async ({ page }) => {
      await page.locator('slide-controls').hover();
      
      await page.waitForTimeout(3500);
      
      const controls = page.locator('slide-controls');
      const hiddenAttr = await controls.getAttribute('hidden-controls');
      expect(hiddenAttr).toBeNull();
    });
  });

  test.describe('Premium Slide Transitions', () => {
    test('should have premium animation keyframes defined', async ({ page }) => {
      const hasAnimation = await page.evaluate(() => {
        const section = document.querySelector('.demo-section.active');
        if (!section) return false;
        const style = getComputedStyle(section);
        return style.animationName !== 'none' && style.animationName !== '';
      });
      expect(hasAnimation).toBe(true);
    });

    test('should apply animation during transition', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      
      const animationName = await page.evaluate(() => {
        const section = document.querySelector('.demo-section.active');
        if (!section) return '';
        return getComputedStyle(section).animationName;
      });
      expect(animationName).toContain('premiumSlideReveal');
    });
  });

  test.describe('IDE Toolbar Controls', () => {
    test.describe('Stream to Table Section', () => {
      test('should have IDE toolbar in Kafka console window', async ({ page }) => {
        await page.goto('/#stream-to-table');
        
        const toolbar = page.locator('section-stream-to-table .ide-toolbar');
        await expect(toolbar).toBeVisible();
      });

      test('should have Run, Pause, Reset buttons', async ({ page }) => {
        await page.goto('/#stream-to-table');
        
        const runBtn = page.locator('section-stream-to-table .ide-toolbar-btn.run');
        const pauseBtn = page.locator('section-stream-to-table .ide-toolbar-btn.pause');
        const stopBtn = page.locator('section-stream-to-table .ide-toolbar-btn.stop');
        
        await expect(runBtn).toBeVisible();
        await expect(pauseBtn).toBeVisible();
        await expect(stopBtn).toBeVisible();
      });

      test('should show Running status when demo starts', async ({ page }) => {
        await page.goto('/#stream-to-table');
        
        await page.locator('section-stream-to-table .ide-toolbar-btn.run').click();
        
        const status = page.locator('section-stream-to-table .ide-toolbar-status');
        await expect(status).toContainText('Running');
      });

      test('should pause demo when pause button clicked', async ({ page }) => {
        await page.goto('/#stream-to-table');
        
        await page.locator('section-stream-to-table .ide-toolbar-btn.run').click();
        await page.waitForTimeout(500);
        await page.locator('section-stream-to-table .ide-toolbar-btn.pause').click();
        
        const status = page.locator('section-stream-to-table .ide-toolbar-status');
        await expect(status).toContainText('Paused');
      });

      test('should reset demo when reset button clicked', async ({ page }) => {
        await page.goto('/#stream-to-table');
        
        await page.locator('section-stream-to-table .ide-toolbar-btn.run').click();
        await page.waitForTimeout(1500);
        await page.locator('section-stream-to-table .ide-toolbar-btn.stop').click();
        
        const status = page.locator('section-stream-to-table .ide-toolbar-status');
        await expect(status).toContainText('Ready');
        
        const emptyMessage = page.locator('section-stream-to-table .kafka-empty');
        await expect(emptyMessage).toBeVisible();
      });
    });

    test.describe('Table to Stream Section', () => {
      test('should have IDE toolbar in aggregation.sql window', async ({ page }) => {
        await page.goto('/#table-to-stream');
        
        const toolbar = page.locator('section-table-to-stream .ide-toolbar');
        await expect(toolbar).toBeVisible();
      });

      test('should run aggregation demo', async ({ page }) => {
        await page.goto('/#table-to-stream');
        
        await page.locator('section-table-to-stream .ide-toolbar-btn.run').click();
        
        const status = page.locator('section-table-to-stream .ide-toolbar-status');
        await expect(status).toContainText('Running');
      });
    });

    test.describe('Live Aggregation Section', () => {
      test('should have IDE toolbar in live_aggregation.sql window', async ({ page }) => {
        await page.goto('/#live-aggregation');
        
        const toolbar = page.locator('section-live-aggregation .ide-toolbar');
        await expect(toolbar).toBeVisible();
      });

      test('should run live aggregation demo', async ({ page }) => {
        await page.goto('/#live-aggregation');
        
        await page.locator('section-live-aggregation .ide-toolbar-btn.run').click();
        
        const status = page.locator('section-live-aggregation .ide-toolbar-status');
        await expect(status).toContainText('Running');
      });

      test('should update result table as events arrive', async ({ page }) => {
        await page.goto('/#live-aggregation');
        
        await page.locator('section-live-aggregation .ide-toolbar-btn.run').click();
        
        await page.waitForTimeout(1500);
        
        const tableRows = page.locator('section-live-aggregation .table-container tbody tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Glassmorphism Button Styling', () => {
    test('should have slide controls visible', async ({ page }) => {
      const controls = page.locator('slide-controls');
      await expect(controls).toBeVisible();
    });

    test('should have styled navigation buttons', async ({ page }) => {
      const prevBtn = page.getByRole('button', { name: 'Previous slide' });
      const nextBtn = page.getByRole('button', { name: 'Next slide' });
      
      await expect(prevBtn).toBeVisible();
      await expect(nextBtn).toBeVisible();
    });
  });
});
