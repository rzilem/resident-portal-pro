
import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardHeaderWithNav from './DashboardHeaderWithNav';

const DashboardHeader = () => {
  // No title is passed which means the DashboardHeaderWithNav will determine
  // the title based on the current route path
  return (
    <DashboardHeaderWithNav />
  );
};

export default DashboardHeader;
