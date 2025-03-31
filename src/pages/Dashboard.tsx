
import React, { useState, useEffect } from 'react';
import { useVoiceGreeting } from '@/hooks/use-voice-greeting';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Widget } from '@/types/dashboard';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Settings2, LayoutDashboard } from 'lucide-react';
import { useCardStyle } from '@/hooks/use-card-style';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

const Dashboard = () => {
  useVoiceGreeting();
  
  const { preferences, updatePreference, isLoading } = useSettings();
  const [dashboardWidgets, setDashboardWidgets] = useState<Widget[]>([]);
  const [columns, setColumns] = useState(2);
  const { cardClass } = useCardStyle();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (preferences) {
      console.log("Initializing dashboard from preferences:", preferences.dashboardLayout);
      
      if (preferences.dashboardLayout?.columns) {
        setColumns(preferences.dashboardLayout.columns);
      }
      
      if (preferences.dashboardLayout?.widgets && preferences.dashboardLayout.widgets.length > 0) {
        setDashboardWidgets(preferences.dashboardLayout.widgets);
      } else {
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
      }
      setIsInitialized(true);
    }
  }, [preferences]);

  const handleSaveDashboard = async (widgets: Widget[], columnCount: number = columns) => {
    console.log("Saving dashboard with widgets:", widgets);
    console.log("Column count:", columnCount);
    
    setDashboardWidgets(widgets);
    setColumns(columnCount);
    setIsCustomizing(false);
    
    try {
      await updatePreference("dashboardLayout", {
        columns: columnCount,
        widgets: widgets
      });
      
      console.log("Dashboard layout saved successfully");
      toast.success("Dashboard layout saved!");
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      toast.error("Failed to save layout. Please try again.");
    }
  };

  if (isLoading || !isInitialized) {
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
              </div>
              <p className="text-muted-foreground mt-2">
                Here's what's happening in your communities today
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isCustomizing ? (
                <DashboardCustomizer 
                  widgets={dashboardWidgets} 
                  onSave={handleSaveDashboard}
                  columns={columns}
                />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={() => setIsCustomizing(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Customize Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[
              { title: 'Properties', value: '12', label: 'Total properties under management' },
              { title: 'Units', value: '256', label: '24 new this month' },
              { title: 'Residents', value: '418', label: '92% occupancy rate' },
              { title: 'Open Requests', value: '15', label: '3 critical, 12 standard' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
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
