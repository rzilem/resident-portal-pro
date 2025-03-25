
import { useState } from 'react';
import { toast } from 'sonner';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';
import { Property } from '@/components/properties/PropertyHelpers';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

export const usePropertyExport = (properties: Property[]) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const visibleColumns = properties.length > 0 
        ? Object.keys(properties[0]).map(key => ({ id: key, label: key })) 
        : [];
      
      const exportData = properties.map(property => {
        const exportObj: Record<string, any> = {};
        
        visibleColumns.forEach(col => {
          let value = property[col.id as keyof typeof property];
          
          if (typeof value === 'boolean') {
            value = value ? 'Yes' : 'No';
          }
          
          exportObj[col.label] = value;
        });
        
        return exportObj;
      });
      
      exportToExcel(exportData, 'Property_Report');
      toast.success('Property report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export properties');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleVisibleColumnsExport = (columns: PropertyColumn[]) => {
    setIsExporting(true);
    try {
      const visibleColumns = columns.filter(col => col.checked);
      const exportData = properties.map(property => {
        const exportObj: Record<string, any> = {};
        
        visibleColumns.forEach(col => {
          let value = property[col.id as keyof typeof property];
          
          if (typeof value === 'boolean') {
            value = value ? 'Yes' : 'No';
          }
          
          exportObj[col.label] = value;
        });
        
        return exportObj;
      });
      
      exportToExcel(exportData, 'Property_Report');
      toast.success('Property report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export properties');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleTemplateDownload = () => {
    try {
      generateOnboardingTemplate();
      toast.success('Onboarding template downloaded');
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Failed to download onboarding template');
    }
  };
  
  return {
    isExporting,
    handleExport,
    handleVisibleColumnsExport,
    handleTemplateDownload
  };
};
