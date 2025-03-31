
import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import { Widget } from '@/types/dashboard';

interface DashboardActionsProps {
  isCustomizing: boolean;
  setIsCustomizing: (value: boolean) => void;
  dashboardWidgets: Widget[];
  columns: number;
  handleSaveDashboard: (widgets: Widget[], columns?: number) => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  isCustomizing,
  setIsCustomizing,
  dashboardWidgets,
  columns,
  handleSaveDashboard
}) => {
  return (
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
  );
};

export default DashboardActions;
