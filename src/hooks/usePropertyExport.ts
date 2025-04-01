
import { useState } from 'react';
import { toast } from 'sonner';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

interface Property {
  id: string;
  address: string;
  unit_number?: string;
  city?: string;
  state?: string;
  zip?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  association_id?: string;
  association_name?: string;
}

export const usePropertyExport = (properties?: Property[]) => {
  const [loading, setLoading] = useState(false);
  
  const exportPropertyList = async (properties: Property[]) => {
    try {
      setLoading(true);
      
      // Format data for Excel export
      const data = properties.map(property => ({
        address: property.address || '',
        unit_number: property.unit_number || '',
        city: property.city || '',
        state: property.state || '',
        zip: property.zip || '',
        property_type: property.property_type || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        square_feet: property.square_feet?.toString() || '',
        association_name: property.association_name || ''
      }));
      
      // Use xlsx to generate and download the Excel file
      import('xlsx').then(XLSX => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Properties');
        
        // Write to Excel file
        XLSX.writeFile(workbook, 'property_list.xlsx');
        
        toast.success('Property list exported successfully');
      });
    } catch (error) {
      console.error('Failed to export properties:', error);
      toast.error('Failed to export property list');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadPropertyTemplate = () => {
    try {
      setLoading(true);
      generateOnboardingTemplate('property');
      toast.success('Property template downloaded successfully');
    } catch (error) {
      console.error('Failed to download template:', error);
      toast.error('Failed to download property template');
    } finally {
      setLoading(false);
    }
  };

  // Add the missing functions that Properties.tsx is looking for
  const handleVisibleColumnsExport = (columns: PropertyColumn[]) => {
    if (!properties || properties.length === 0) {
      toast.error('No properties to export');
      return;
    }
    
    exportPropertyList(properties);
  };
  
  const handleTemplateDownload = () => {
    downloadPropertyTemplate();
  };
  
  return {
    exportPropertyList,
    downloadPropertyTemplate,
    loading,
    isExporting: loading,
    handleVisibleColumnsExport,
    handleTemplateDownload
  };
};

export default usePropertyExport;
