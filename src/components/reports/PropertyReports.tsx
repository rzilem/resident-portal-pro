
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Property } from '@/components/properties/PropertyHelpers';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import PropertyOverviewReport from './property/PropertyOverviewReport';
import ARCReport from './property/ARCReport';
import ViolationsReport from './property/ViolationsReport';
import WorkOrderReport from './property/WorkOrderReport';
import PropertyListReport from './property/PropertyListReport';

interface PropertyReportsProps {
  properties: Property[];
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
  onTemplateDownload: () => void;
  selectedReport: string;
}

const PropertyReports = ({ 
  properties, 
  timeRange, 
  association,
  onExport,
  onTemplateDownload,
  selectedReport
}: PropertyReportsProps) => {
  // Render different property reports based on the selected report
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return <PropertyOverviewReport timeRange={timeRange} association={association} />;
        
      case 'arc-report':
        return <ARCReport timeRange={timeRange} association={association} onExport={onExport} />;
        
      case 'violations':
        return <ViolationsReport timeRange={timeRange} association={association} onExport={onExport} />;
        
      case 'work-order':
        return <WorkOrderReport timeRange={timeRange} association={association} onExport={onExport} />;
        
      default:
        return <PropertyListReport properties={properties} timeRange={timeRange} association={association} />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={() => onExport([
            { id: 'name', label: 'Property Name', checked: true },
            { id: 'location', label: 'Location', checked: true },
            { id: 'units', label: 'Units', checked: true },
            { id: 'status', label: 'Status', checked: true },
            { id: 'foundedDate', label: 'Founded Date', checked: true },
          ])}
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={onTemplateDownload}
        >
          <FileText className="h-4 w-4" />
          Get Template
        </Button>
      </div>
      
      {renderReportContent()}
    </div>
  );
};

export default PropertyReports;
