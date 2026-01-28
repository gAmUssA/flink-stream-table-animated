# 🐿️ Flink Table-Stream Duality Interactive Demo

[![Deploy](https://github.com/gAmUssA/flink-stream-table-animated/actions/workflows/deploy.yml/badge.svg)](https://github.com/gAmUssA/flink-stream-table-animated/actions/workflows/deploy.yml)
[![Playwright Tests](https://github.com/gAmUssA/flink-stream-table-animated/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/gAmUssA/flink-stream-table-animated/actions/workflows/playwright-tests.yml)
[![Lit](https://img.shields.io/badge/Lit-3.1.0-324FFF?logo=lit&logoColor=white)](https://lit.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-latest-FBF0DF?logo=bun&logoColor=black)](https://bun.sh/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40.0-45BA4B?logo=playwright&logoColor=white)](https://playwright.dev/)

An interactive educational demo explaining Apache Flink's table-stream duality concept. This application visualizes how streams and tables are two views of the same data.

## Features

- **Core Concept**: Overview of stream-table duality
- **Stream to Table**: Append-only visualization
- **Table to Stream**: Changelog visualization
- **Stream Types**: Documentation of 3 stream types (Insert-only, Retract, Upsert)
- **Live Aggregation**: Interactive real-time demo
- **Code Examples**: Flink API code samples
- **Dark Theme**: Full dark mode support with system preference detection

## Tech Stack

- **Frontend**: [Lit](https://lit.dev/) web components (v3.1.0)
- **Language**: TypeScript (v5.3.0)
- **Runtime/Bundler**: [Bun](https://bun.sh/)
- **Styling**: CSS custom properties for theming, responsive design
- **Deployment**: GitHub Pages via GitHub Actions
- **Testing**: Playwright for end-to-end tests

## Local Development

### Prerequisites

- [Bun](https://bun.sh/) (latest)

### Install Dependencies

```bash
bun install
```

### Serve the Application

```bash
# Development server with hot reload
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

Then open http://localhost:3000 in your browser.

## Testing

This project includes comprehensive Playwright tests for all functionality, including dark theme support.

### Run Tests

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

See [tests/README.md](tests/README.md) for detailed testing documentation.

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### GitHub Actions Workflows

- **Deploy** (`.github/workflows/deploy.yml`): Deploys to GitHub Pages
- **Playwright Tests** (`.github/workflows/playwright-tests.yml`): Runs automated tests

## Dark Theme

The application includes a fully functional dark theme with:

- System preference detection
- Manual toggle with localStorage persistence
- Smooth transitions (0.3s)
- Keyboard accessible (Tab + Enter)
- Consistent styling across all 6 sections
- Proper contrast ratios for accessibility

## Project Structure

```
.
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
│       └── theme.css       # CSS custom properties
├── tests/                  # Playwright tests
│   ├── theme.spec.cjs      # Dark theme functionality tests
│   ├── responsive.spec.cjs # Responsive layout tests
│   └── README.md           # Testing documentation
├── .github/workflows/      # GitHub Actions
│   ├── deploy.yml          # Deployment workflow
│   └── playwright-tests.yml # Testing workflow
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── playwright.config.cjs   # Playwright configuration
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari/WebKit (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun test`
5. Submit a pull request

All pull requests must pass automated tests before merging.

## License

MIT License - feel free to use this for educational purposes.

## Target Audience

Developers learning Apache Flink's unified batch/stream processing model.
