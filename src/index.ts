import './styles/theme.css';
import './styles/presentation.css';
import './components/app-shell.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('app-shell');
  if (!app) {
    console.error('app-shell element not found');
  }
});
