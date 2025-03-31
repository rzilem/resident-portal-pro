
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, PlusCircle } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface BudgetToolbarProps {
  activeTab: string;
}

const BudgetToolbar: React.FC<BudgetToolbarProps> = ({ activeTab }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
      <TabsList>
        <TabsTrigger value="current">Current Year</TabsTrigger>
        <TabsTrigger value="previous">Previous Year</TabsTrigger>
        <TabsTrigger value="planning">Planning</TabsTrigger>
      </TabsList>
      
      <div className="flex gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw size={16} /> Refresh
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="z-50">
              <p>Refresh budget data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} /> Export
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="z-50">
              <p>Export budget to spreadsheet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle size={16} /> New Budget Item
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="z-50">
              <p>Add new budget line item</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default BudgetToolbar;
