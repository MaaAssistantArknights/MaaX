import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import store from './store';

import App from './App';

render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
