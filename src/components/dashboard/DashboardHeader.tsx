
import React from 'react';
import { Widget } from '@/types/dashboard';
import DashboardActions from './DashboardActions';

interface DashboardHeaderProps {
  isCustomizing: boolean;
  setIsCustomizing: (value: boolean) => void;
  dashboardWidgets?: Widget[];
  columns?: number;
  handleSaveDashboard?: (widgets: Widget[], columns?: number) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isCustomizing,
  setIsCustomizing,
  dashboardWidgets = [],
  columns = 2,
  handleSaveDashboard = () => {}
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <div className="flex space-x-2">
        <DashboardActions 
          isCustomizing={isCustomizing}
          setIsCustomizing={setIsCustomizing}
          dashboardWidgets={dashboardWidgets}
          columns={columns}
          handleSaveDashboard={handleSaveDashboard}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
