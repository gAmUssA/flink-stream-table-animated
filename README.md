# 🐿️ Flink Table-Stream Duality Interactive Demo

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

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **No build system**: Static files served directly
- **No frameworks**: Pure DOM manipulation
- **Deployment**: GitHub Pages via GitHub Actions
- **Testing**: Playwright for end-to-end tests

## Local Development

### Serve the Application

```bash
# Using Python
python3 -m http.server 8000

# Or using npx
npx serve .
```

Then open http://localhost:8000 in your browser.

## Testing

This project includes comprehensive Playwright tests for all functionality, including dark theme support.

### Run Tests

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# View test report
npx playwright show-report
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
├── index.html              # Main HTML with all 6 demo sections
├── script.js               # JavaScript logic (navigation, animations, theme)
├── styles.css              # Complete styling (layout, animations, themes)
├── tests/                  # Playwright tests
│   ├── theme.spec.js       # Dark theme functionality tests
│   └── README.md           # Testing documentation
├── .github/workflows/      # GitHub Actions
│   ├── deploy.yml          # Deployment workflow
│   └── playwright-tests.yml # Testing workflow
├── package.json            # Node dependencies
└── playwright.config.js    # Playwright configuration
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari/WebKit (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

All pull requests must pass automated tests before merging.

## License

MIT License - feel free to use this for educational purposes.

## Target Audience

Developers learning Apache Flink's unified batch/stream processing model.
