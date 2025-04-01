
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/hooks/use-settings';
import { useAssociations } from '@/hooks/use-associations';
import { usePropertyExport } from '@/hooks/usePropertyExport';
import { useParams } from 'react-router-dom';
import PropertyStats from '@/components/properties/PropertyStats';
import PropertyList from '@/components/properties/PropertyList';
import { 
  getPropertiesFromAssociations, 
  getDefaultProperties, 
  getDefaultColumns, 
  Property
} from '@/components/properties/PropertyHelpers';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import PropertyListReport from '@/components/reports/property/PropertyListReport';

const Properties = () => {
  const { preferences } = useSettings();
  const { associations } = useAssociations();
  const isMobile = useIsMobile();
  const { id } = useParams();
  
  // Use getPropertiesFromAssociations with proper type checking
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

  const selectedProperty = id ? properties.find(p => p.associationId === id) : null;
  
  const { 
    isExporting,
    handleVisibleColumnsExport,
    handleTemplateDownload 
  } = usePropertyExport(properties);
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      {!id && <PropertyStats />}
      
      {id && selectedProperty ? (
        <div className="space-y-6">
          <PropertyList 
            properties={properties}
            columns={columns}
            onColumnsChange={handleColumnsChange}
            onExport={() => handleVisibleColumnsExport(columns)}
            onTemplateDownload={handleTemplateDownload}
          />
          
          <PropertyListReport 
            properties={[selectedProperty]}
            timeRange={`As of ${new Date().toLocaleDateString()}`}
            association={selectedProperty.name}
          />
        </div>
      ) : (
        <PropertyList 
          properties={properties}
          columns={columns}
          onColumnsChange={handleColumnsChange}
          onExport={() => handleVisibleColumnsExport(columns)}
          onTemplateDownload={handleTemplateDownload}
        />
      )}
    </div>
  );
};

export default Properties;
