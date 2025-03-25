
import React, { useState } from 'react';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Widget } from '@/types/dashboard';

const Dashboard = () => {
  // In a real app, this would come from the user's preferences
  const [dashboardWidgets, setDashboardWidgets] = useState<Widget[]>([
    {
      id: 'widget-1',
      type: 'properties',
      title: 'Properties',
      size: 'medium',
      position: 0,
    },
    {
      id: 'widget-2',
      type: 'residents',
      title: 'Residents',
      size: 'medium',
      position: 1,
    },
    {
      id: 'widget-3',
      type: 'weather',
      title: 'Weather',
      size: 'small',
      position: 2,
    },
    {
      id: 'widget-4',
      type: 'tasks',
      title: 'Tasks',
      size: 'small',
      position: 3,
    },
    {
      id: 'widget-5',
      type: 'maintenance',
      title: 'Maintenance',
      size: 'medium',
      position: 4,
    },
    {
      id: 'widget-6',
      type: 'documents',
      title: 'Documents',
      size: 'medium',
      position: 5,
    },
  ]);

  const [columns, setColumns] = useState(2);

  const handleSaveDashboard = (widgets: Widget[]) => {
    setDashboardWidgets(widgets);
    // In a real app, you would save this to the user's preferences
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground">Here's what's happening in your communities today</p>
        </div>
        <DashboardCustomizer 
          widgets={dashboardWidgets} 
          onSave={handleSaveDashboard} 
        />
      </div>
      
      <DashboardLayout 
        widgets={dashboardWidgets}
        columns={columns} 
      />
    </div>
  );
};

export default Dashboard;
