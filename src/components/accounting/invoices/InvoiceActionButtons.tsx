
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Printer, Upload, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

const InvoiceActionButtons = () => {
  const handleExport = (format: string) => {
    toast({
      title: "Export initiated",
      description: `Invoices are being exported to ${format.toUpperCase()} format.`
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="default" size="sm" className="gap-1">
              <Link to="/accounting/invoice-coding">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="z-50">
            <p>Create a new invoice</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="top" className="z-50">
            <p>Export invoices</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast({ title: "Import from file" })}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from file
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "Template download initiated" })}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="top" className="z-50">
            <p>Import invoice data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => toast({ title: "Print queue initiated", description: "Preparing invoices for printing..." })}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="z-50">
            <p>Send invoices to printer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default InvoiceActionButtons;
