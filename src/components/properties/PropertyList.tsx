
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useParams } from 'react-router-dom';
import PropertyTable from './PropertyTable';
import PropertyCardList from './PropertyCardList';
import PropertyHeader from './PropertyHeader';
import { PropertyColumn } from './PropertyColumnsSelector';
import { Property } from './PropertyHelpers';

interface PropertyListProps {
  properties: Property[];
  columns: PropertyColumn[];
  onColumnsChange: (columns: PropertyColumn[]) => void;
  onExport: () => void;
  onTemplateDownload: () => void;
}

const PropertyList = ({ 
  properties, 
  columns, 
  onColumnsChange, 
  onExport, 
  onTemplateDownload 
}: PropertyListProps) => {
  const isMobile = useIsMobile();
  const { id } = useParams();

  // Filter to just the selected property if viewing a specific property
  const displayProperties = id ? properties.filter(p => p.associationId === id) : properties;

  return (
    <Card className="animate-fade-in">
      <PropertyHeader 
        columns={columns} 
        onColumnsChange={onColumnsChange} 
        onExport={onExport} 
        onTemplateDownload={onTemplateDownload} 
        isDetailView={!!id}
        propertyName={id ? displayProperties[0]?.name : undefined}
      />
      <CardContent>
        {isMobile && (
          <PropertyCardList properties={displayProperties} columns={columns} />
        )}
        
        <div className={isMobile ? "hidden" : "overflow-auto"}>
          <PropertyTable properties={displayProperties} columns={columns} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyList;
