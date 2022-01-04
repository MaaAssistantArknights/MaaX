import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

import ThemeProvider from './utils/theme';

import App from './App';

render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
