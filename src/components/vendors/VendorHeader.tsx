
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { PlusCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorColumnsSelector, { VendorColumn } from './VendorColumnsSelector';

interface VendorHeaderProps {
  columns: VendorColumn[];
  onColumnsChange: (columns: VendorColumn[]) => void;
}

const VendorHeader = ({ columns, onColumnsChange }: VendorHeaderProps) => {
  return (
    <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
      <div className="flex items-center">
        <h3 className="text-xl font-semibold">Vendors</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link to="/system-uploads">
            <Download className="h-4 w-4 mr-1" />
            Import/Export
          </Link>
        </Button>
        
        <VendorColumnsSelector 
          columns={columns} 
          onChange={onColumnsChange} 
        />
        
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Vendor
        </Button>
      </div>
    </CardHeader>
  );
};

export default VendorHeader;
