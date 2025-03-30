import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import Index from '../pages/Index';
import { mainRoutes } from './mainRoutes';
import { accountingRoutes } from './accountingRoutes';
import { communicationRoutes } from './communicationRoutes';
import { documentRoutes } from './documentRoutes';
import { hoaRoutes } from './hoaRoutes';
import { resaleRoutes } from './resaleRoutes';
import { settingsRoutes } from './settingsRoutes';
import { databaseRoutes } from './databaseRoutes';
import { vendorRoutes } from './vendorRoutes';
import { residentRoutes } from './residentRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      ...mainRoutes,
      ...accountingRoutes,
      ...communicationRoutes,
      ...documentRoutes,
      ...hoaRoutes,
      ...resaleRoutes,
      ...settingsRoutes,
      ...databaseRoutes,
      ...vendorRoutes,
      ...residentRoutes,
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
