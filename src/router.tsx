import { createHashRouter, Navigate } from 'react-router-dom';
import App from './App';
import templateRoutes from './templates';

import genSpec from './specs/gen/spec';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to={`/${templateRoutes[0]}`} />,
  },
  ...templateRoutes.map(templateSlug => ({
    path: `/${templateSlug}`,
    element: <App spec={genSpec} />,
  })),
]);

export default router;
