import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

import { initializeIcons } from '@fluentui/react/lib/Icons';
import ThemeProvider from './utils/theme';

import App from './App';

initializeIcons();

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
