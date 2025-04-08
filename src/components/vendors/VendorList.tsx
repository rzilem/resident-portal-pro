
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import VendorTable from './VendorTable';
import VendorCardList from './VendorCardList';
import VendorHeader from './VendorHeader';
import { VendorColumn } from './VendorColumnsSelector';
import { Vendor } from '@/types/vendor';
import { Skeleton } from '@/components/ui/skeleton';

interface VendorListProps {
  vendors: Vendor[];
  columns: VendorColumn[];
  onColumnsChange: (columns: VendorColumn[]) => void;
  isLoading?: boolean;
}

const VendorList = ({ 
  vendors, 
  columns, 
  onColumnsChange,
  isLoading = false
}: VendorListProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-48" />
        </div>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
