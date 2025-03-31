
import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Widget } from '@/types/dashboard';
import { useDialog } from '@/hooks/use-dialog';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';

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
  const { open, setOpen } = useDialog(isCustomizing);

  // Sync external and internal state
  React.useEffect(() => {
    setOpen(isCustomizing);
  }, [isCustomizing, setOpen]);

  // When internal dialog state changes, update parent
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    setIsCustomizing(value);
  };

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => handleOpenChange(true)}
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

      <DashboardCustomizer 
        widgets={dashboardWidgets}
        columns={columns}
        onSave={handleSaveDashboard}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </>
  );
};

export default DashboardActions;
