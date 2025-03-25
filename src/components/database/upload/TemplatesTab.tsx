
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';

interface TemplatesTabProps {
  onOpenChange: (open: boolean) => void;
}

const TemplatesTab = ({ onOpenChange }: TemplatesTabProps) => {
  const { toast } = useToast();

  const handleDownloadTemplate = (type: string) => {
    // Generate template data based on type
    let templateData: Record<string, any>[] = [];
    
    if (type === 'Association') {
      // Full association template with all fields
      templateData = [{
        association_name: '',
        association_address: '',
        association_phone: '',
        association_email: '',
        association_tax_id: '',
        property_name: '',
        property_type: '',
        property_year_built: '',
        property_units_count: '',
        unit_number: '',
        unit_address: '',
        unit_bedrooms: '',
        unit_bathrooms: '',
        unit_square_feet: '',
        homeowner_id: '',
        homeowner_first_name: '',
        homeowner_last_name: '',
        homeowner_email: '',
        homeowner_phone: '',
        homeowner_alternate_phone: '',
        homeowner_mailing_address: '',
        homeowner_move_in_date: '',
        homeowner_status: '',
        homeowner_type: '',
        homeowner_primary_residence: '',
        homeowner_balance: '',
        homeowner_last_payment_date: '',
        homeowner_last_payment_amount: '',
        homeowner_payment_method: '',
        homeowner_ach_start_date: '',
        homeowner_closing_date: '',
        homeowner_comm_preference: '',
        homeowner_billing_preference: '',
        homeowner_emergency_contact: '',
        homeowner_board_member: '',
        homeowner_notes: ''
      }];
    } else if (type === 'Homeowners') {
      // Homeowners-only template
      templateData = [{
        homeowner_id: '',
        homeowner_first_name: '',
        homeowner_last_name: '',
        unit_number: '',
        property_name: '',
        homeowner_email: '',
        homeowner_phone: '',
        homeowner_alternate_phone: '',
        homeowner_mailing_address: '',
        homeowner_move_in_date: '',
        homeowner_status: '',
        homeowner_type: '',
        homeowner_primary_residence: '',
        homeowner_balance: '',
        homeowner_payment_method: '',
        homeowner_ach_start_date: '',
        homeowner_closing_date: '',
        homeowner_comm_preference: '',
        homeowner_billing_preference: '',
        homeowner_emergency_contact: '',
        homeowner_board_member: '',
        homeowner_notes: ''
      }];
    } else if (type === 'Properties') {
      // Properties template
      templateData = [{
        property_name: '',
        property_address: '',
        property_type: '',
        property_year_built: '',
        property_units_count: '',
        property_tax_id: '',
        property_county: '',
        property_city: '',
        property_state: '',
        property_zip: '',
        property_manager: '',
        property_phone: '',
        property_email: '',
      }];
    } else if (type === 'Document Categories') {
      // Document categories template
      templateData = [{
        category_name: '',
        parent_category: '',
        description: '',
        visibility: '',
        access_level: '',
      }];
    }
    
    // Export the template
    exportToExcel(templateData, `${type}_Template`);
    
    toast({
      title: "Template downloaded",
      description: `${type} template has been downloaded to your device`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Download template files to ensure your data is in the correct format for import.
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Association with Homeowners</h3>
            <p className="text-sm text-muted-foreground">Complete template with all homeowner data</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Association')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Homeowners Only</h3>
            <p className="text-sm text-muted-foreground">Template for importing only homeowner data</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Homeowners')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Properties and Units</h3>
            <p className="text-sm text-muted-foreground">Template for importing property and unit data</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Properties')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Document Categories Structure</h3>
            <p className="text-sm text-muted-foreground">Template showing all available document folders</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Document Categories')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesTab;
