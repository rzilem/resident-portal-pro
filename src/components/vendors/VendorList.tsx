
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import VendorTable from './VendorTable';
import VendorCardList from './VendorCardList';
import VendorHeader from './VendorHeader';
import { VendorColumn } from './VendorColumnsSelector';
import { Vendor } from '@/types/vendor';

interface VendorListProps {
  vendors: Vendor[];
  columns: VendorColumn[];
  onColumnsChange: (columns: VendorColumn[]) => void;
}

const VendorList = ({ 
  vendors, 
  columns, 
  onColumnsChange
}: VendorListProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="animate-fade-in">
      <VendorHeader 
        columns={columns} 
        onColumnsChange={onColumnsChange} 
      />
      <CardContent>
        {isMobile && (
          <VendorCardList vendors={vendors} columns={columns} />
        )}
        
        <div className={isMobile ? "hidden" : "overflow-auto"}>
          <VendorTable vendors={vendors} columns={columns} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorList;
