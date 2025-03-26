
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, UploadCloud } from 'lucide-react';
import VendorColumnsSelector, { VendorColumn } from './VendorColumnsSelector';

interface VendorHeaderProps {
  columns: VendorColumn[];
  onColumnsChange: (columns: VendorColumn[]) => void;
}

const VendorHeader = ({ columns, onColumnsChange }: VendorHeaderProps) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>Manage your service providers and suppliers</CardDescription>
        </div>
        
        <div className="flex flex-wrap gap-2 ml-auto">
          <VendorColumnsSelector 
            columns={columns} 
            onChange={onColumnsChange} 
          />
          
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
          
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <UploadCloud className="h-4 w-4" />
            <span className="hidden md:inline">Import</span>
          </Button>
          
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Vendor</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default VendorHeader;
