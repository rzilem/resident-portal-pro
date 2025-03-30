
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import Login from '../pages/Login';

// Create the router outside of any component
const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: '/login',
        element: <Login />,
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

// RouterConfig component
const RouterConfig = () => {
  return <RouterProvider router={router} />;
};

export default RouterConfig;
