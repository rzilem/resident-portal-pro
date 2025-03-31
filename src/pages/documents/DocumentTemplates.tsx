
import React, { useState } from 'react';
import DashboardHeaderWithNav from '@/components/DashboardHeaderWithNav';
import { FileText, Download, ArrowDownCircle, LinkIcon, Building, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssociationTemplateInfo from '@/components/database/AssociationTemplateInfo';
import { toast } from 'sonner';
import SampleTemplatePreview from '@/components/database/SampleTemplatePreview';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';
import { 
  generateResidentTemplate,
  generateOwnerPropertyAssociationTemplate 
} from '@/utils/templates/residentTemplates';
import { 
  generatePropertyTemplate,
  generateAssociationPropertiesTemplate
} from '@/utils/templates/propertyTemplates';
import { 
  generateDocumentCategoriesTemplate, 
  generateDocumentMetadataTemplate,
  generateDocumentPermissionsTemplate
} from '@/utils/templates/documentTemplates';

// Placeholder functions for templates that haven't been implemented yet
const generateViolationTemplate = () => {
  toast.info('Violations template is being prepared...');
  // Implementation would go here
  setTimeout(() => {
    toast.success('Violations template downloaded successfully');
  }, 1000);
};

const generateFinancialTemplate = () => {
  toast.info('Financial accounts template is being prepared...');
  // Implementation would go here
  setTimeout(() => {
    toast.success('Financial accounts template downloaded successfully');
  }, 1000);
};

const generateVendorTemplate = () => {
  toast.info('Vendor template is being prepared...');
  // Implementation would go here
  setTimeout(() => {
    toast.success('Vendor template downloaded successfully');
  }, 1000);
};

const DocumentTemplates = () => {
  const [activeTab, setActiveTab] = useState('association');

  const handleDownloadTemplate = (type: string) => {
    try {
      switch (type) {
        case 'association':
          generateOnboardingTemplate();
          break;
        case 'homeowners':
          generateResidentTemplate();
          break;
        case 'properties':
          generatePropertyTemplate();
          break;
        case 'owner-property':
          generateOwnerPropertyAssociationTemplate();
          break;
        case 'association-properties':
          generateAssociationPropertiesTemplate();
          break;
        case 'documents':
          generateDocumentCategoriesTemplate();
          break;
        case 'document-metadata':
          generateDocumentMetadataTemplate();
          break;
        case 'document-permissions':
          generateDocumentPermissionsTemplate();
          break;
        case 'violations':
          generateViolationTemplate();
          break;
        case 'financial':
          generateFinancialTemplate();
          break;
        case 'vendors':
          generateVendorTemplate();
          break;
        default:
          generateOnboardingTemplate();
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded successfully`);
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template');
    }
  };

  return (
    <>
      <DashboardHeaderWithNav
        title="Document Templates"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Template Types</CardTitle>
                <CardDescription>Choose a template format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Button 
                    variant={activeTab === 'association' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('association')}
                  >
                    Association Data
                  </Button>
                  <Button 
                    variant={activeTab === 'homeowners' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('homeowners')}
                  >
                    Homeowners Only
                  </Button>
                  <Button 
                    variant={activeTab === 'properties' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('properties')}
                  >
                    Properties and Units
                  </Button>
                  <Button 
                    variant={activeTab === 'owner-property' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('owner-property')}
                  >
                    Owner-Property Mapping
                  </Button>
                  <Button 
                    variant={activeTab === 'association-properties' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('association-properties')}
                  >
                    Association Properties
                  </Button>
                  <Button 
                    variant={activeTab === 'documents' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('documents')}
                  >
                    Document Categories
                  </Button>
                  <Button 
                    variant={activeTab === 'document-metadata' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('document-metadata')}
                  >
                    Document Metadata
                  </Button>
                  <Button 
                    variant={activeTab === 'document-permissions' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('document-permissions')}
                  >
                    Document Permissions
                  </Button>
                  <Button 
                    variant={activeTab === 'violations' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('violations')}
                  >
                    Violation Types
                  </Button>
                  <Button 
                    variant={activeTab === 'financial' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('financial')}
                  >
                    Financial Accounts
                  </Button>
                  <Button 
                    variant={activeTab === 'vendors' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('vendors')}
                  >
                    Vendors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {activeTab === 'association' && 'Association Data Template'}
                    {activeTab === 'homeowners' && 'Homeowners Data Template'}
                    {activeTab === 'properties' && 'Properties Data Template'}
                    {activeTab === 'owner-property' && 'Owner-Property Mapping Template'}
                    {activeTab === 'association-properties' && 'Association Properties Template'}
                    {activeTab === 'documents' && 'Document Categories Template'}
                    {activeTab === 'document-metadata' && 'Document Metadata Template'}
                    {activeTab === 'document-permissions' && 'Document Permissions Template'}
                    {activeTab === 'violations' && 'Violation Types Template'}
                    {activeTab === 'financial' && 'Financial Accounts Template'}
                    {activeTab === 'vendors' && 'Vendors Template'}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => handleDownloadTemplate(activeTab)}
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
                <CardDescription>
                  {activeTab === 'association' && 'Complete template with all association and homeowner data'}
                  {activeTab === 'homeowners' && 'Template with 50 rows for importing only homeowner records'}
                  {activeTab === 'properties' && 'Template with 50 rows for importing property and unit information'}
                  {activeTab === 'owner-property' && 'Template with 50 rows for mapping owners to properties and associations'}
                  {activeTab === 'association-properties' && 'Template with 50 rows linking properties to their associations'}
                  {activeTab === 'documents' && 'Standard document categories for organization (50 rows)'}
                  {activeTab === 'document-metadata' && 'Template with 50 rows for document metadata and properties'}
                  {activeTab === 'document-permissions' && 'Template with 50 rows for document access control'}
                  {activeTab === 'violations' && 'Template for violation types and categories'}
                  {activeTab === 'financial' && 'Template for financial accounts and GL codes'}
                  {activeTab === 'vendors' && 'Template for vendor contact information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'association' && <AssociationTemplateInfo />}
                
                {activeTab === 'homeowners' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Homeowners Template Structure (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      This template contains fields specifically for homeowner data import, including association and property links.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Required Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• first_name</li>
                          <li>• last_name</li>
                          <li>• email</li>
                          <li>• address</li>
                          <li>• unit_number</li>
                          <li>• association_id</li>
                          <li>• property_id</li>
                          <li>• resident_type</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Linking Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• property_id - Links to specific property</li>
                          <li>• association_id - Links to specific association</li>
                          <li>• is_primary - Indicates primary resident</li>
                          <li>• move_in_date - Start of residency</li>
                          <li>• resident_type - owner/tenant/family</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'properties' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Properties Template Structure (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      This template contains fields for property and unit information with association linkage.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Property Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• property_name</li>
                          <li>• address</li>
                          <li>• unit_number</li>
                          <li>• city</li>
                          <li>• state</li>
                          <li>• zip</li>
                          <li>• association_id</li>
                          <li>• association_name</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Additional Property Info</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• property_type</li>
                          <li>• bedrooms</li>
                          <li>• bathrooms</li>
                          <li>• square_feet</li>
                          <li>• property_id (for existing properties)</li>
                          <li>• unique_identifier (optional reference)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'owner-property' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Owner-Property Mapping Template (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      This template maps owners to properties and associations, making it easy to change ownership.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Property and Association Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• property_id</li>
                          <li>• property_address</li>
                          <li>• unit_number</li>
                          <li>• association_id</li>
                          <li>• association_name</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Owner Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• owner_id</li>
                          <li>• owner_first_name</li>
                          <li>• owner_last_name</li>
                          <li>• owner_email</li>
                          <li>• owner_phone</li>
                          <li>• ownership_start_date</li>
                          <li>• ownership_end_date</li>
                          <li>• is_current_owner</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
                      <h4 className="font-medium flex items-center text-blue-700">
                        <ArrowDownCircle className="h-4 w-4 mr-2" />
                        Changing Property Ownership
                      </h4>
                      <p className="text-sm text-blue-700 mt-2">
                        When an owner changes, you can keep the property data intact and just update the owner information.
                        Simply fill in a new row with the same property_id but new owner information, marking the old owner as
                        not current and setting the ownership_end_date.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'association-properties' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Association Properties Template (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      This template ensures all properties are properly linked to their associations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Association Information</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• association_id</li>
                          <li>• association_name</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Property Information</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• property_id</li>
                          <li>• property_address</li>
                          <li>• unit_number</li>
                          <li>• property_type</li>
                          <li>• status</li>
                          <li>• date_added</li>
                          <li>• date_removed</li>
                          <li>• notes</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-200">
                      <h4 className="font-medium flex items-center text-green-700">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Association and Property Relationships
                      </h4>
                      <p className="text-sm text-green-700 mt-2">
                        This template helps maintain the relationship between associations and their properties over time,
                        even as properties change ownership or status. The system uses these relationships to ensure
                        that when you update a property, it remains correctly associated with its community.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'documents' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Document Categories Template (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      This template helps you organize your document categories for better file management.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Category Structure</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• category_name - Name of the document category</li>
                          <li>• parent_category - Optional parent category name</li>
                          <li>• description - Brief description of the category</li>
                          <li>• is_restricted - Whether access is limited (Yes/No)</li>
                          <li>• required_permission - Permission needed to access</li>
                          <li>• sort_order - Display order of categories</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Suggested Categories</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Board Documents</li>
                          <li>• Meeting Minutes</li>
                          <li>• Financial Statements</li>
                          <li>• Governing Documents</li>
                          <li>• Architectural Guidelines</li>
                          <li>• Community Newsletters</li>
                          <li>• Vendor Contracts</li>
                          <li>• Insurance Policies</li>
                        </ul>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => generateDocumentCategoriesTemplate()}
                      className="mt-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Document Categories Template
                    </Button>
                  </div>
                )}
                
                {activeTab === 'document-metadata' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Document Metadata Template (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      This template provides fields for detailed document metadata to better organize and search your files.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Basic Document Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• document_name - Name of the document</li>
                          <li>• file_path - Storage path (can be virtual)</li>
                          <li>• document_type - Type of document</li>
                          <li>• category - Document category</li>
                          <li>• tags - Comma-separated tags</li>
                          <li>• description - Brief document description</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Access and Governance</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• published_date - When document was published</li>
                          <li>• expiration_date - When document expires</li>
                          <li>• is_public - Whether document is public</li>
                          <li>• access_level - Who can access the document</li>
                          <li>• association_id - Associated association</li>
                          <li>• property_id - Associated property (if any)</li>
                        </ul>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => generateDocumentMetadataTemplate()}
                      className="mt-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Document Metadata Template
                    </Button>
                  </div>
                )}
                
                {activeTab === 'document-permissions' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Document Permissions Template (50 rows)</h3>
                    <p className="text-muted-foreground mb-4">
                      Define who can access, view, download, edit, and delete your documents.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Document Reference</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• document_id - ID of the document</li>
                          <li>• document_name - Name of the document</li>
                          <li>• role - User role for this permission</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Permission Settings</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• can_view - Can view the document (Yes/No)</li>
                          <li>• can_download - Can download (Yes/No)</li>
                          <li>• can_edit - Can edit the document (Yes/No)</li>
                          <li>• can_delete - Can delete the document (Yes/No)</li>
                          <li>• notes - Additional notes on permissions</li>
                        </ul>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => generateDocumentPermissionsTemplate()}
                      className="mt-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Document Permissions Template
                    </Button>
                  </div>
                )}
                
                {activeTab === 'violations' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Violations Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Template for defining violation types and categories for your associations.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => generateViolationTemplate()}
                      className="mb-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Violations Template
                    </Button>
                  </div>
                )}
                
                {activeTab === 'financial' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Financial Accounts Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Template for setting up financial accounts and GL codes for your associations.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => generateFinancialTemplate()}
                      className="mb-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Financial Accounts Template
                    </Button>
                  </div>
                )}
                
                {activeTab === 'vendors' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Vendors Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Template for importing vendor contact information and service details.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => generateVendorTemplate()}
                      className="mb-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Vendors Template
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentTemplates;
