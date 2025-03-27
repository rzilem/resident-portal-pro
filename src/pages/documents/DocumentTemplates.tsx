import React, { useState } from 'react';
import DashboardHeaderWithNav from '@/components/DashboardHeaderWithNav';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssociationTemplateInfo from '@/components/database/AssociationTemplateInfo';
import { useToast } from '@/hooks/use-toast';
import SampleTemplatePreview from '@/components/database/SampleTemplatePreview';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';

const DocumentTemplates = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('association');

  const handleDownloadTemplate = (type: string) => {
    switch (type) {
      case 'association':
        generateOnboardingTemplate();
        break;
      case 'homeowners':
        exportToExcel([{ name: '', email: '', phone: '', unit: '' }], 'Homeowners_Template');
        break;
      case 'properties':
        exportToExcel([{ name: '', type: '', address: '', units: '' }], 'Properties_Template');
        break;
      default:
        generateOnboardingTemplate();
    }

    toast({
      title: "Template downloaded",
      description: `${type} template has been downloaded to your device`,
    });
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
                    variant={activeTab === 'documents' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('documents')}
                  >
                    Document Categories
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
                    {activeTab === 'documents' && 'Document Categories Template'}
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
                  {activeTab === 'homeowners' && 'Template for importing only homeowner records'}
                  {activeTab === 'properties' && 'Template for importing property and unit information'}
                  {activeTab === 'documents' && 'Standard document categories for organization'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'association' && <AssociationTemplateInfo />}
                {activeTab === 'homeowners' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Homeowners Template Structure</h3>
                    <p className="text-muted-foreground mb-4">
                      This template contains fields specifically for homeowner data import, without the association details.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Required Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• homeowner_first_name</li>
                          <li>• homeowner_last_name</li>
                          <li>• homeowner_email</li>
                          <li>• homeowner_phone</li>
                          <li>• unit_number</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Optional Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• homeowner_alternate_phone</li>
                          <li>• homeowner_mailing_address</li>
                          <li>• homeowner_move_in_date</li>
                          <li>• homeowner_notes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'properties' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Properties Template Structure</h3>
                    <p className="text-muted-foreground mb-4">
                      This template contains fields for property and unit information.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Property Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• property_name</li>
                          <li>• property_type</li>
                          <li>• property_address</li>
                          <li>• property_city</li>
                          <li>• property_state</li>
                          <li>• property_zip</li>
                          <li>• property_year_built</li>
                          <li>• property_units_count</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Unit Fields</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• unit_number</li>
                          <li>• unit_address</li>
                          <li>• unit_bedrooms</li>
                          <li>• unit_bathrooms</li>
                          <li>• unit_square_feet</li>
                          <li>• unit_floor</li>
                          <li>• unit_status</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'documents' && (
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Document Categories Structure</h3>
                    <p className="text-muted-foreground mb-4">
                      Standard document categories for organizing association files.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Administrative Categories</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Governing Documents</li>
                          <li>• Board Meeting Minutes</li>
                          <li>• Bylaws & CC&Rs</li>
                          <li>• Policies & Procedures</li>
                          <li>• Insurance Documents</li>
                        </ul>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium">Financial Categories</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Financial Statements</li>
                          <li>• Budgets</li>
                          <li>• Audits</li>
                          <li>• Tax Returns</li>
                          <li>• Reserve Studies</li>
                        </ul>
                      </div>
                    </div>
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
