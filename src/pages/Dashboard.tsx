
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Widget } from '@/types/dashboard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { profile } = useUser();
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'properties-widget',
      type: 'properties',
      title: 'Properties',
      size: 'medium',
      position: 0,
    },
    {
      id: 'residents-widget',
      type: 'residents',
      title: 'Residents',
      size: 'medium',
      position: 1,
    },
    {
      id: 'financials-widget',
      type: 'financials',
      title: 'Financial Overview',
      size: 'large',
      position: 2,
    },
    {
      id: 'tasks-widget',
      type: 'tasks',
      title: 'My Tasks',
      size: 'medium',
      position: 3,
    },
    {
      id: 'calendar-widget',
      type: 'calendar',
      title: 'Upcoming Events',
      size: 'medium',
      position: 4,
    },
    {
      id: 'ci-insights-widget',
      type: 'ci-insights',
      title: 'CI Insights',
      size: 'medium',
      position: 5,
    }
  ]);
  const [columns, setColumns] = useState(2);
  
  const handleSaveCustomization = (newWidgets: Widget[], newColumns?: number) => {
    setWidgets(newWidgets);
    if (newColumns) {
      setColumns(newColumns);
    }
  };

  // Animation variants for page container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="container p-6 mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            Welcome, {profile?.first_name || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening across your associations
          </p>
        </div>
        
        <DashboardCustomizer 
          widgets={widgets}
          columns={columns}
          onSave={handleSaveCustomization}
        />
      </div>

      <DashboardLayout 
        widgets={widgets}
        columns={columns}
        animate={true}
      />
    </motion.div>
  );
};

export default Dashboard;
