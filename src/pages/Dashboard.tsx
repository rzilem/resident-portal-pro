
import React, { useState, useEffect } from 'react';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import DashboardLayout from '@/components/DashboardLayout';
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
      <DashboardLayout>
        <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <Card className={cardClass}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardWidgets.filter(widget => !widget.hidden).map((widget) => (
            <div
              key={widget.id}
              className={widget.size === 'large' ? 'col-span-2' : 'col-span-1'}
            >
              {/* Widget content would be rendered here */}
              <Card className={cardClass}>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{widget.title}</h3>
                  <p className="text-muted-foreground text-sm">Widget content for {widget.type}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
