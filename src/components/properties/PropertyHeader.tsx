
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyColumnsSelector, { PropertyColumn } from './PropertyColumnsSelector';

interface PropertyHeaderProps {
  columns: PropertyColumn[];
  onColumnsChange: (columns: PropertyColumn[]) => void;
  onExport: () => void;
  onTemplateDownload: () => void;
  isDetailView?: boolean;
  propertyName?: string;
}

const PropertyHeader = ({ 
  columns, 
  onColumnsChange, 
  onExport, 
  onTemplateDownload,
  isDetailView = false,
  propertyName
}: PropertyHeaderProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/properties');
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        {isDetailView ? (
          <>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleBackClick}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>{propertyName || 'Property Details'}</CardTitle>
            </div>
            <CardDescription>
              Detailed information for this property
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle>Property List</CardTitle>
            <CardDescription>
              Complete list of properties in your portfolio
            </CardDescription>
          </>
        )}
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
