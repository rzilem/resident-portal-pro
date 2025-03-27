
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Property } from '@/components/properties/PropertyHelpers';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import PropertyOverviewReport from './property/PropertyOverviewReport';
import ARCReport from './property/ARCReport';
import PropertyListReport from './property/PropertyListReport';
import ViolationsReport from './property/ViolationsReport';
import WorkOrderReport from './property/WorkOrderReport';

interface PropertyReportsProps {
  properties: Property[];
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
  onTemplateDownload?: () => void;
  selectedReport: string;
}

const PropertyReports: React.FC<PropertyReportsProps> = ({
  properties,
  timeRange,
  association,
  onExport,
  onTemplateDownload,
  selectedReport,
}) => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  
  // Filter properties when association changes
  useEffect(() => {
    console.log("PropertyReports: association changed to", association);
    if (association === 'all') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.associationId === association));
    }
  }, [association, properties]);

  return (
    <Card className="p-6">
      {selectedReport === 'overview' && (
        <PropertyOverviewReport timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'arc-report' && (
        <ARCReport timeRange={timeRange} association={association} onExport={onExport} />
      )}
      
      {selectedReport === 'association-list' && (
        <PropertyListReport properties={filteredProperties} timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'violations' && (
        <ViolationsReport timeRange={timeRange} association={association} onExport={onExport} />
      )}
      
      {selectedReport === 'work-order' && (
        <WorkOrderReport timeRange={timeRange} association={association} onExport={onExport} />
      )}
      
      {/* Default fallback if no report is selected */}
      {!['overview', 'arc-report', 'association-list', 'violations', 'work-order'].includes(selectedReport) && (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-2">Select a report type</h2>
          <p className="text-muted-foreground">
            Choose a report type from the tabs above to view property data
          </p>
        </div>
      )}
    </Card>
  );
};

export default PropertyReports;
