
import React, { useState, useEffect } from 'react';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Widget } from '@/types/dashboard';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCardStyle } from '@/hooks/use-card-style';

const Dashboard = () => {
  const { preferences, updatePreference, isLoading } = useSettings();
  const [dashboardWidgets, setDashboardWidgets] = useState<Widget[]>([]);
  const [columns, setColumns] = useState(2);
  const { cardClass } = useCardStyle();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize dashboard from preferences
  useEffect(() => {
    if (preferences) {
      // Set columns
      if (preferences.dashboardLayout?.columns) {
        setColumns(preferences.dashboardLayout.columns);
      }
      
      // Set widgets
      if (preferences.dashboardLayout?.widgets && preferences.dashboardLayout.widgets.length > 0) {
        setDashboardWidgets(preferences.dashboardLayout.widgets);
      } else {
        // Fallback to default widgets if none are set
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
            type: 'notifications',
            title: 'Notifications',
            size: 'small',
            position: 5,
          },
        ]);
      }
      setIsInitialized(true);
    }
  }, [preferences]);

  // Save dashboard layout when it changes
  const handleSaveDashboard = async (widgets: Widget[], columnCount: number = columns) => {
    setDashboardWidgets(widgets);
    setColumns(columnCount);
    
    try {
      await updatePreference("dashboardLayout", {
        columns: columnCount,
        widgets: widgets
      });
      toast.success("Dashboard layout saved!");
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      toast.error("Failed to save layout. Please try again.");
    }
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <Card className={cardClass}>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          columns={columns}
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
