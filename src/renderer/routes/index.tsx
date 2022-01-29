import type { RouteObject } from 'react-router-dom';
import Home from 'renderer/pages/Home';
import Settings from 'renderer/pages/Settings';

const routes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: '/settings', element: <Settings /> },
];

export default routes;
