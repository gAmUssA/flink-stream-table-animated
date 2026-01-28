---
trigger: always_on
---

# 🐿️ Flink Table-Stream Duality Demo - Windsurf Rules

## Project Overview

This is an interactive educational web application demonstrating Apache Flink's table-stream duality concept. Built with Lit web components and TypeScript, bundled with Bun.

## Tech Stack

- **Frontend**: [Lit](https://lit.dev/) web components (v3.1.0)
- **Language**: TypeScript (v5.3.0)
- **Runtime/Bundler**: [Bun](https://bun.sh/)
- **Styling**: CSS custom properties for theming, responsive design
- **Testing**: Playwright for end-to-end tests
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
├── src/
│   ├── index.html          # HTML shell template
│   ├── index.ts            # Application entry point
│   ├── components/         # Lit web components
│   │   ├── app-shell.ts    # Main application shell
│   │   ├── nav-bar.ts      # Navigation component
│   │   ├── theme-toggle.ts # Dark/light theme toggle
│   │   ├── ide-window.ts   # Code block visual component
│   │   ├── changelog-entry.ts # Changelog row component
│   │   └── sections/       # Demo section components
│   │       ├── core-concept.ts
│   │       ├── stream-to-table.ts
│   │       ├── table-to-stream.ts
│   │       ├── changelog-types.ts
│   │       ├── live-aggregation.ts
│   │       └── code-examples.ts
│   └── styles/
│       ├── theme.css       # CSS custom properties
│       └── presentation.css # Presentation mode styles
├── tests/                  # Playwright E2E tests
│   ├── theme.spec.cjs      # Dark theme functionality tests
│   ├── responsive.spec.cjs # Responsive layout tests
│   ├── presentation.spec.cjs # Presentation mode tests
│   └── README.md           # Testing documentation
├── .github/workflows/      # GitHub Actions
│   ├── deploy.yml          # Deployment workflow
│   └── playwright-tests.yml # Testing workflow
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── playwright.config.cjs   # Playwright configuration
```

## Code Style Guidelines

### TypeScript / Lit Components

- Use Lit web components with TypeScript
- Follow Lit best practices: `@customElement`, `@property`, `@state` decorators
- Use `html` tagged template literals for rendering
- Use `css` tagged template literals for component styles
- Use `const` and `let` - never `var`
- Use arrow functions for callbacks
- Include proper error handling with try/catch for localStorage and browser API access
- Add feature detection before using browser APIs (e.g., `window.matchMedia`)
- Use `console.warn()` for recoverable errors, not `console.error()`

### CSS

- Use CSS custom properties (variables) for theming: `var(--variable-name)`
- Define theme variables in `:root` and `[data-theme="dark"]` selectors
- Use semantic variable names (e.g., `--text-primary`, `--bg-secondary`, `--border-primary`)
- Include 0.3s transitions for theme changes
- Support responsive design with CSS Grid and `minmax()`
- Use `rem` or `em` for font sizes, `px` for borders and small spacing

### HTML

- Use semantic HTML5 elements
- Include proper ARIA attributes for accessibility (`aria-label`, roles)
- Use `data-*` attributes for JavaScript hooks (e.g., `data-theme`)
- Include proper meta tags for viewport and charset

## Accessibility Requirements

- All interactive elements must be keyboard accessible (Tab + Enter)
- Include visible focus states with proper outline
- Maintain sufficient color contrast ratios (WCAG AA minimum)
- Use `aria-label` on icon-only buttons
- Support system preference detection for dark mode (`prefers-color-scheme`)
- Persist user preferences in localStorage

## Testing Guidelines

### Playwright Tests

- Use `@ts-check` at the top of test files for TypeScript checking
- Follow `test.describe()` → `test()` structure
- Use `test.beforeEach()` to set up clean state (clear localStorage)
- Use Playwright's built-in `expect` assertions
- Use role-based selectors when possible: `page.getByRole('button', { name: 'Toggle theme' })`
- Include appropriate waits for animations: `page.waitForTimeout()`
- Test both light and dark themes
- Tests must be independent and run in any order

### Running Tests

```bash
# Install dependencies
bun install
bunx playwright install

# Run all tests
bun test

# Run tests in UI mode
bun run test:ui

# Run tests in headed mode
bun run test:headed

# View test report
bunx playwright show-report
```

### Test File Naming

- Use `.spec.cjs` suffix for test files (CommonJS for Playwright compatibility)
- Name files after the feature being tested (e.g., `theme.spec.cjs`, `responsive.spec.cjs`)

## Local Development

```bash
# Install dependencies
bun install

# Development server with hot reload
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Open http://localhost:3000
```

## Deployment

- Automatic deployment to GitHub Pages on push to `main` branch
- All PRs must pass Playwright tests before merging
- Build step runs `bun run build` before deployment

## Animation Guidelines

- Use CSS animations with `@keyframes` for visual effects
- Use `setTimeout` for sequenced animations in JavaScript
- Provide Start/Stop/Reset controls for user-controlled animations
- Keep animations performant - use `transform` and `opacity` when possible
- Respect `prefers-reduced-motion` media query where applicable

## Theme Implementation

- Use `data-theme` attribute on `<html>` element
- Store preference in localStorage with key `theme-preference`
- Values: `light` or `dark`
- Fall back to system preference when no stored preference exists
- Update toggle icon: 🌙 for light mode (click to go dark), ☀️ for dark mode (click to go light)

## Do NOT

- Add build tools (webpack, vite, etc.) - Bun handles bundling
- Add JavaScript frameworks (React, Vue, etc.) - use Lit only
- Add CSS preprocessors (Sass, Less)
- Remove existing accessibility features
- Hard-code colors - always use CSS variables
- Delete or weaken existing tests
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.

## GitHub Actions

- Node.js 18 for CI
- Use `npm ci` for reproducible installs
- Upload playwright-report as artifact (always)
- Upload test-results as artifact (on failure)
- 60-minute timeout for test jobs
- 2 retries in CI, 0 locally
