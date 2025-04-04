
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Properties from '../pages/Properties';
import Residents from '../pages/Residents';
import ResidentProfile from '../pages/ResidentProfile';
import Compliance from '../pages/compliance/Compliance';
import Calendar from '../pages/Calendar';
import Workflows from '../pages/Workflows';
import PrintQueue from '../pages/PrintQueue';
import Reports from '../pages/Reports';
import Integrations from '../pages/Integrations';
import SystemUploads from '../pages/SystemUploads';
import AssociationProfile from '../pages/AssociationProfile';
import LeadsManagement from '../pages/leads/LeadsManagement';
import UserProfile from '../pages/profile/UserProfile';

// Landing page routes
import Features from '../pages/Features';
import Pricing from '../pages/Pricing';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Testimonials from '../pages/Testimonials';
import Careers from '../pages/Careers';
import Blog from '../pages/Blog';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Cookies from '../pages/Cookies';

export const mainRoutes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/simple-dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/properties',
    element: (
      <ProtectedRoute>
        <Properties />
      </ProtectedRoute>
    ),
  },
  {
    path: '/properties/:id',
    element: (
      <ProtectedRoute>
        <Properties />
      </ProtectedRoute>
    ),
  },
  {
    path: '/associations/:id',
    element: (
      <ProtectedRoute>
        <AssociationProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/residents',
    element: (
      <ProtectedRoute>
        <Residents />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resident/:id',
    element: (
      <ProtectedRoute>
        <ResidentProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/compliance',
    element: (
      <ProtectedRoute>
        <Compliance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendar',
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workflows',
    element: (
      <ProtectedRoute>
        <Workflows />
      </ProtectedRoute>
    ),
  },
  {
    path: '/print-queue',
    element: (
      <ProtectedRoute>
        <PrintQueue />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/integrations',
    element: (
      <ProtectedRoute>
        <Integrations />
      </ProtectedRoute>
    ),
  },
  {
    path: '/system-uploads',
    element: (
      <ProtectedRoute>
        <SystemUploads />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leads',
    element: (
      <ProtectedRoute>
        <LeadsManagement />
      </ProtectedRoute>
    ),
  },
  // User Profile routes
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/user',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  // Public landing page routes
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/testimonials',
    element: <Testimonials />,
  },
  {
    path: '/careers',
    element: <Careers />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/cookies',
    element: <Cookies />,
  }
];
