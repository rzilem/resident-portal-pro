
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/hooks/use-settings';
import { useAssociations } from '@/hooks/use-associations';
import { usePropertyExport } from '@/hooks/usePropertyExport';
import PropertyStats from '@/components/properties/PropertyStats';
import PropertyList from '@/components/properties/PropertyList';
import { 
  getPropertiesFromAssociations, 
  getDefaultProperties, 
  getDefaultColumns, 
  Property
} from '@/components/properties/PropertyHelpers';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

const Properties = () => {
  const { preferences } = useSettings();
  const { associations } = useAssociations();
  const isMobile = useIsMobile();
  
  const properties: Property[] = associations && associations.length > 0 
    ? getPropertiesFromAssociations(associations) 
    : getDefaultProperties();
  
  const [columns, setColumns] = useState<PropertyColumn[]>(
    preferences?.propertyTableColumns || getDefaultColumns()
  );
  
  useEffect(() => {
    if (preferences?.propertyTableColumns) {
      setColumns(preferences.propertyTableColumns);
    }
  }, [preferences]);
  
  const handleColumnsChange = (newColumns: PropertyColumn[]) => {
    const hasCheckedColumn = newColumns.some(col => col.checked);
    
    if (hasCheckedColumn) {
      setColumns(newColumns);
    }
  };
  
  const { 
    isExporting,
    handleVisibleColumnsExport,
    handleTemplateDownload 
  } = usePropertyExport(properties);
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Properties Management</h2>
          <p className="text-muted-foreground">Overview of all properties in your portfolio</p>
        </section>
        
        <PropertyStats />
        
        <PropertyList 
          properties={properties}
          columns={columns}
          onColumnsChange={handleColumnsChange}
          onExport={() => handleVisibleColumnsExport(columns)}
          onTemplateDownload={handleTemplateDownload}
        />
      </div>
    </div>
  );
};

export default Properties;
