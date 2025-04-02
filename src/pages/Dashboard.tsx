
import React, { useState, useEffect } from 'react';
import { useVoiceGreeting } from '@/hooks/use-voice-greeting';
import { Widget } from '@/types/dashboard';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCardStyle } from '@/hooks/use-card-style';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/hooks/use-auth';

const Dashboard = () => {
  useVoiceGreeting();
  
  const { preferences, updatePreference, isLoading, isInitialized } = useSettings();
  const { isAuthenticated } = useAuth();
  const [dashboardWidgets, setDashboardWidgets] = useState<Widget[]>([]);
  const [columns, setColumns] = useState(2);
  const { cardClass } = useCardStyle();
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isInitialized && preferences) {
      console.log("Initializing dashboard from preferences:", preferences.dashboardLayout);
      
      if (preferences.dashboardLayout?.columns) {
        setColumns(preferences.dashboardLayout.columns);
      }
      
      if (preferences.dashboardLayout?.widgets && preferences.dashboardLayout.widgets.length > 0) {
        setDashboardWidgets(preferences.dashboardLayout.widgets);
      } else {
        // If no saved widgets, use defaults
        setDashboardWidgets([
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
            type: 'financials',
            title: 'Financial Snapshot',
            size: 'medium',
            position: 2,
          },
          {
            id: 'widget-4',
            type: 'tasks',
            title: 'Tasks',
            size: 'medium',
            position: 3,
          },
          {
            id: 'widget-5',
            type: 'calendar',
            title: 'Calendar',
            size: 'medium',
            position: 4,
          },
          {
            id: 'widget-6',
            type: 'ci-insights',
            title: 'CI Insights',
            size: 'medium',
            position: 5,
          },
        ]);
        
        // Save default widgets to preferences
        if (isAuthenticated) {
          updatePreference('dashboardLayout', {
            columns: columns,
            widgets: dashboardWidgets
          });
        }
      }
      setIsLoadingWidgets(false);
    }
  }, [preferences, isInitialized, updatePreference, isAuthenticated, columns, dashboardWidgets]);

  const handleSaveDashboard = async (widgets: Widget[], columnCount: number = columns) => {
    console.log("Saving dashboard with widgets:", widgets);
    console.log("Column count:", columnCount);
    
    setDashboardWidgets(widgets);
    setColumns(columnCount);
    setIsCustomizing(false);
    
    try {
      if (!isAuthenticated) {
        toast.warning('You must be logged in to save dashboard layout');
        return;
      }
      
      const updated = await updatePreference("dashboardLayout", {
        columns: columnCount,
        widgets: widgets
      });
      
      if (updated) {
        console.log("Dashboard layout saved successfully");
        toast.success("Dashboard layout saved!");
      } else {
        throw new Error("Failed to save layout");
      }
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      toast.error("Failed to save layout. Please try again.");
    }
  };

  if (isLoading || isLoadingWidgets) {
    return (
      <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <Card className={`${cardClass} w-full max-w-md p-8`}>
          <CardContent className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading your dashboard...</p>
            <p className="text-muted-foreground text-sm mt-2">Preparing your personalized experience</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      <div className="relative">
        <DashboardHeader 
          isCustomizing={isCustomizing}
          setIsCustomizing={setIsCustomizing}
          dashboardWidgets={dashboardWidgets}
          columns={columns}
          handleSaveDashboard={handleSaveDashboard}
        />
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-2"
      >
        <DashboardLayout 
          widgets={dashboardWidgets}
          columns={columns}
          animate={true}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
