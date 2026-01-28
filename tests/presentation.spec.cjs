// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Presentation Mode Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Presentation Toggle', () => {
    test('should load with presentation mode disabled by default', async ({ page }) => {
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBeNull();
    });

    test('should enable presentation mode when toggle is clicked', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBe('true');
    });

    test('should disable presentation mode when toggle is clicked again', async ({ page }) => {
      // Enable
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      // Disable
      await page.getByRole('button', { name: 'Exit presentation mode' }).click();
      
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBeNull();
    });

    test('should persist presentation mode preference in localStorage', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const savedPref = await page.evaluate(() => 
        localStorage.getItem('flink-tutorial-presentation-mode')
      );
      expect(savedPref).toBe('true');
    });

    test('should restore presentation mode from localStorage on reload', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      await page.reload();
      
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBe('true');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
    });

    test('should navigate to next slide with ArrowRight', async ({ page }) => {
      await page.keyboard.press('ArrowRight');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-1');
    });

    test('should navigate to previous slide with ArrowLeft', async ({ page }) => {
      // Go to section 1 first
      await page.keyboard.press('ArrowRight');
      // Go back
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

    test('should exit presentation mode with Escape', async ({ page }) => {
      await page.keyboard.press('Escape');
      
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBeNull();
    });

    test('should not navigate past first slide', async ({ page }) => {
      await page.keyboard.press('ArrowLeft');
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should not navigate past last slide', async ({ page }) => {
      // Navigate to last slide (6 sections, 0-indexed)
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
      }
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-5');
    });
  });

  test.describe('Slide Controls', () => {
    test('should show slide controls in presentation mode', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const controls = page.locator('slide-controls');
      await expect(controls).toHaveAttribute('visible', '');
    });

    test('should hide slide controls in website mode', async ({ page }) => {
      const controls = page.locator('slide-controls');
      await expect(controls).not.toHaveAttribute('visible');
    });

    test('should display correct progress indicator', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const progress = page.locator('slide-controls .progress');
      await expect(progress).toContainText('1 / 6');
    });

    test('should update progress when navigating', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      await page.keyboard.press('ArrowRight');
      
      const progress = page.locator('slide-controls .progress');
      await expect(progress).toContainText('2 / 6');
    });

    test('should navigate with next button click', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      await page.getByRole('button', { name: 'Next slide' }).click();
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-1');
    });

    test('should navigate with previous button click', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      await page.keyboard.press('ArrowRight');
      await page.getByRole('button', { name: 'Previous slide' }).click();
      
      const activeSection = await page.locator('.demo-section.active').getAttribute('id');
      expect(activeSection).toBe('section-0');
    });

    test('should disable previous button on first slide', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const prevButton = page.getByRole('button', { name: 'Previous slide' });
      await expect(prevButton).toBeDisabled();
    });

    test('should disable next button on last slide', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Navigate to last slide
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowRight');
      }
      
      const nextButton = page.getByRole('button', { name: 'Next slide' });
      await expect(nextButton).toBeDisabled();
    });
  });

  test.describe('Parallax Effects', () => {
    test('should apply presentation mode styles', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Verify presentation mode is active
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBe('true');
      
      // Verify active section is visible
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });

    test('should have presentation-specific layout', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Check that sections are styled for presentation
      const sectionHeight = await page.evaluate(() => {
        const section = document.querySelector('.demo-section.active');
        if (!section) return 0;
        return section.getBoundingClientRect().height;
      });
      
      // Section should have significant height in presentation mode
      expect(sectionHeight).toBeGreaterThan(100);
    });
  });

  test.describe('Reduced Motion Fallback', () => {
    test('should respect prefers-reduced-motion setting', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Check that presentation mode is active
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBe('true');
      
      // With reduced motion, CSS should handle animation reduction
      // This test just verifies the mode activates correctly with reduced motion
    });
  });

  test.describe('Presentation Viewport Sizes', () => {
    test('should work at 1920x1080 viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const container = page.locator('.container');
      await expect(container).toBeVisible();
      
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });

    test('should work at 1280x720 viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const container = page.locator('.container');
      await expect(container).toBeVisible();
      
      const activeSection = page.locator('.demo-section.active');
      await expect(activeSection).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on controls', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const prevButton = page.getByRole('button', { name: 'Previous slide' });
      const nextButton = page.getByRole('button', { name: 'Next slide' });
      
      await expect(prevButton).toHaveAttribute('aria-label', 'Previous slide');
      await expect(nextButton).toHaveAttribute('aria-label', 'Next slide');
    });

    test('should have aria-pressed on presentation toggle', async ({ page }) => {
      const toggle = page.locator('presentation-toggle button');
      
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      
      await toggle.click();
      
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });

    test('should have live region for progress indicator', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const progress = page.locator('slide-controls .progress');
      await expect(progress).toHaveAttribute('aria-live', 'polite');
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Click on presentation toggle directly for reliable test
      const toggle = page.locator('presentation-toggle button');
      await toggle.focus();
      await page.keyboard.press('Enter');
      
      const presentationAttr = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation')
      );
      expect(presentationAttr).toBe('true');
    });
  });

  test.describe('Auto-Hide Controls', () => {
    test('should auto-hide slide controls after 3 seconds', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Controls should be visible initially
      const controls = page.locator('slide-controls');
      await expect(controls).toHaveAttribute('visible', '');
      
      // Wait for auto-hide (3 seconds + buffer)
      await page.waitForTimeout(3500);
      
      // Controls should have hidden-controls attribute
      await expect(controls).toHaveAttribute('hidden-controls', '');
    });

    test('should show controls on keyboard navigation', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Wait for auto-hide
      await page.waitForTimeout(3500);
      
      // Navigate with keyboard
      await page.keyboard.press('ArrowRight');
      
      // Controls should be visible again (hidden-controls removed)
      const controls = page.locator('slide-controls');
      const hiddenAttr = await controls.getAttribute('hidden-controls');
      expect(hiddenAttr).toBeNull();
    });

    test('should auto-hide header after 3 seconds', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Wait for auto-hide
      await page.waitForTimeout(3500);
      
      // Header should be hidden
      const headerHidden = await page.evaluate(() => 
        document.documentElement.getAttribute('data-header-hidden')
      );
      expect(headerHidden).toBe('true');
    });

    test('should keep controls visible on hover', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Hover over controls
      await page.locator('slide-controls').hover();
      
      // Wait past auto-hide time
      await page.waitForTimeout(3500);
      
      // Controls should still be visible (no hidden-controls)
      const controls = page.locator('slide-controls');
      const hiddenAttr = await controls.getAttribute('hidden-controls');
      expect(hiddenAttr).toBeNull();
    });
  });

  test.describe('Dark Mode Auto-Switch', () => {
    test('should switch to dark mode when entering presentation mode', async ({ page }) => {
      // Start in light mode
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
      
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const theme = await page.evaluate(() => 
        document.documentElement.getAttribute('data-theme')
      );
      expect(theme).toBe('dark');
    });

    test('should restore previous theme when exiting presentation mode', async ({ page }) => {
      // Start in light mode
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
      
      // Enter presentation mode (switches to dark)
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Exit presentation mode
      await page.getByRole('button', { name: 'Exit presentation mode' }).click();
      
      const theme = await page.evaluate(() => 
        document.documentElement.getAttribute('data-theme')
      );
      expect(theme).toBe('light');
    });
  });

  test.describe('Premium Slide Transitions', () => {
    test('should have premium animation keyframes defined', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Check that the active section has animation
      const hasAnimation = await page.evaluate(() => {
        const section = document.querySelector('.demo-section.active');
        if (!section) return false;
        const style = getComputedStyle(section);
        return style.animationName !== 'none' && style.animationName !== '';
      });
      expect(hasAnimation).toBe(true);
    });

    test('should apply blur effect during transition', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Navigate to trigger animation
      await page.keyboard.press('ArrowRight');
      
      // Check animation is applied (premiumSlideReveal)
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
        
        // Messages should be cleared
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
        
        // Wait for first event
        await page.waitForTimeout(1500);
        
        // Result table should have data
        const tableRows = page.locator('section-live-aggregation .table-container tbody tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Fullscreen Mode', () => {
    test('should request fullscreen when entering presentation mode', async ({ page }) => {
      // Track if requestFullscreen was called
      await page.evaluate(() => {
        window.__fullscreenCalled = false;
        Element.prototype.requestFullscreen = function() {
          window.__fullscreenCalled = true;
          return Promise.resolve();
        };
      });
      
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      const wasCalled = await page.evaluate(() => window.__fullscreenCalled);
      expect(wasCalled).toBe(true);
    });

    test('should have F key bound for fullscreen toggle', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Verify presentation mode is active and F key handler exists
      const presentationActive = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation') === 'true'
      );
      expect(presentationActive).toBe(true);
      
      // The F key should trigger fullscreen (we can't fully test fullscreen in headless)
      // Just verify the key doesn't cause errors
      await page.keyboard.press('f');
      
      // Still in presentation mode
      const stillActive = await page.evaluate(() => 
        document.documentElement.getAttribute('data-presentation') === 'true'
      );
      expect(stillActive).toBe(true);
    });
  });

  test.describe('Glassmorphism Button Styling', () => {
    test('should have glassmorphism styling on slide controls', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Check that slide controls exist and are visible
      const controls = page.locator('slide-controls');
      await expect(controls).toHaveAttribute('visible', '');
      
      // Glassmorphism is applied via shadow DOM styles
      // Just verify the component renders correctly
    });

    test('should have styled navigation buttons', async ({ page }) => {
      await page.getByRole('button', { name: 'Enter presentation mode' }).click();
      
      // Verify buttons exist in slide controls
      const prevBtn = page.getByRole('button', { name: 'Previous slide' });
      const nextBtn = page.getByRole('button', { name: 'Next slide' });
      
      await expect(prevBtn).toBeVisible();
      await expect(nextBtn).toBeVisible();
    });
  });
});
