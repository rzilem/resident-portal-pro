
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Database, Building, Users, FileArchive, UserRoundCog, FileText } from 'lucide-react';
import BulkUploadDialog from '@/components/database/BulkUploadDialog';
import SampleTemplatePreview from '@/components/database/SampleTemplatePreview';
import { Button } from '@/components/ui/button';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';
import { useToast } from '@/hooks/use-toast';

const SystemUploads = () => {
  const [activeTab, setActiveTab] = useState('associations');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'associations' | 'homeowners' | 'vendors' | 'documents'>('associations');
  const { toast } = useToast();

  const handleOpenUploadDialog = (type: 'associations' | 'homeowners' | 'vendors' | 'documents') => {
    setUploadType(type);
    setIsUploadDialogOpen(true);
  };

  const handleDownloadTemplate = (templateType: string) => {
    if (templateType === 'association') {
      generateOnboardingTemplate();
    }

    toast({
      title: "Template downloaded",
      description: `${templateType} template has been downloaded to your device`,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">System Uploads</h1>
        <p className="text-muted-foreground">Upload and manage data for new association setups and system configuration</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="associations" className="flex gap-2 items-center">
            <Building className="h-4 w-4" />
            <span>Associations</span>
          </TabsTrigger>
          <TabsTrigger value="homeowners" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            <span>Homeowners</span>
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex gap-2 items-center">
            <UserRoundCog className="h-4 w-4" />
            <span>Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="associations">
          <Card>
            <CardHeader>
              <CardTitle>Association Uploads</CardTitle>
              <CardDescription>
                Import new associations with all properties, settings, and related data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Complete Association Setup</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Upload a spreadsheet containing all association data, including properties, 
                    units, and configurations in a single import.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <SampleTemplatePreview />
                    <Button 
                      className="gap-2" 
                      onClick={() => handleOpenUploadDialog('associations')}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Associations
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Association Settings</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Import predefined settings templates for different types of associations
                    (HOA, Condo, etc.) to quickstart new association configurations.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('settings')}
                    >
                      <FileText className="h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      className="gap-2"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature will be available in a future update.",
                        });
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="homeowners">
          <Card>
            <CardHeader>
              <CardTitle>Homeowner Uploads</CardTitle>
              <CardDescription>
                Import homeowner and resident data for existing associations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Bulk Homeowner Import</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Upload a spreadsheet with homeowner data for an existing association. 
                    Include contact information, property details, and account status.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('homeowners')}
                    >
                      <FileText className="h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      className="gap-2" 
                      onClick={() => handleOpenUploadDialog('homeowners')}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Homeowners
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileArchive className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Unit/Property Assignment</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Match and assign homeowners to specific units or properties in bulk. Update
                    ownership records and occupancy status.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('property-assignment')}
                    >
                      <FileText className="h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      className="gap-2"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature will be available in a future update.",
                        });
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Assignments
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Uploads</CardTitle>
              <CardDescription>
                Import vendor and service provider information for associations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserRoundCog className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Vendor Directory Import</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Upload a spreadsheet with vendor information including contact details, 
                    services offered, contract terms, and payment information.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('vendors')}
                    >
                      <FileText className="h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      className="gap-2" 
                      onClick={() => handleOpenUploadDialog('vendors')}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Vendors
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileArchive className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Contracts & Agreements</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Import vendor contracts, service agreements, and payment terms.
                    Track renewal dates and contract obligations.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('contracts')}
                    >
                      <FileText className="h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      className="gap-2"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature will be available in a future update.",
                        });
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Contracts
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Uploads</CardTitle>
              <CardDescription>
                Import and organize documents for associations and homeowners
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Document Structure Setup</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Set up document categories and folder structures for new associations.
                    Import document classification rules and retention policies.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('document-structure')}
                    >
                      <FileText className="h-4 w-4" />
                      View Categories
                    </Button>
                    <Button 
                      className="gap-2" 
                      onClick={() => handleOpenUploadDialog('documents')}
                    >
                      <Upload className="h-4 w-4" />
                      Create Structure
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-6 border border-border flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileArchive className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Document Batch Import</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Upload multiple documents at once with metadata for automatic categorization.
                    Import governing documents, financial reports, and community notices.
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDownloadTemplate('document-metadata')}
                    >
                      <FileText className="h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      className="gap-2"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature will be available in a future update.",
                        });
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Batch Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BulkUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
      />
    </div>
  );
};

export default SystemUploads;
