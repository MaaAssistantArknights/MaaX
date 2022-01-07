import { useRoutes, Navigate } from 'react-router-dom';
import routes from 'renderer/routes';

import NavBar from './layouts/NavBar';

import './App.less';

export default function App() {
  const route = useRoutes(routes);
  return (
    <div className="app">
      <NavBar />
      {route}
    </div>
  );
}
