
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import PropertyColumnsSelector, { PropertyColumn } from './PropertyColumnsSelector';

interface PropertyHeaderProps {
  columns: PropertyColumn[];
  onColumnsChange: (columns: PropertyColumn[]) => void;
  onExport: () => void;
  onTemplateDownload: () => void;
}

const PropertyHeader = ({ 
  columns, 
  onColumnsChange, 
  onExport, 
  onTemplateDownload 
}: PropertyHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Property List</CardTitle>
        <CardDescription>
          Complete list of properties in your portfolio
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <PropertyColumnsSelector 
          columns={columns} 
          onChange={onColumnsChange} 
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          onClick={onTemplateDownload}
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Template</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
      </div>
    </CardHeader>
  );
};

export default PropertyHeader;
