
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
  isCustomizing?: boolean;
  setIsCustomizing?: (value: boolean) => void;
  dashboardWidgets?: Widget[];
  columns?: number;
  handleSaveDashboard?: (widgets: Widget[], columns?: number) => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  isCustomizing = false,
  setIsCustomizing = () => {},
  dashboardWidgets = [],
  columns = 2,
  handleSaveDashboard = () => {}
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={() => setIsCustomizing(true)}
            variant="default"
            size="icon"
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Customize Dashboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DashboardActions;
