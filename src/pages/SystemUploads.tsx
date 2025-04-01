
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileUp, FileDown, Database, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DocumentStructureTab from '@/components/database/upload/DocumentStructureTab';
import TemplatesTab from '@/components/database/upload/TemplatesTab';
import UploadDataTab from '@/components/database/upload/UploadDataTab';
import VendorUploadTab from '@/components/database/upload/VendorUploadTab';
import SuccessState from '@/components/database/upload/SuccessState';
import { TooltipButton } from '@/components/ui/tooltip-button';

const SystemUploads = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadStep, setUploadStep] = useState<'initial' | 'mapping' | 'validation' | 'success'>('initial');
  const { toast } = useToast();
  
  const handleUploadComplete = () => {
    setUploadStep('success');
    toast({
      title: "Upload successful",
      description: "Your data has been processed and uploaded to the system."
    });
  };
  
  const handleReset = () => {
    setUploadStep('initial');
  };

  const handleDialogClose = () => {
    // Placeholder for dialog close function
    console.log('Dialog closed');
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">System Uploads</h1>
        <p className="text-muted-foreground">Import and manage data in your system</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Import data, templates, and system structure information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-4">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                <span>Upload Data</span>
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Vendor Import</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Document Structure</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              {uploadStep === 'success' ? (
                <SuccessState 
                  onReset={handleReset} 
                  onClose={handleDialogClose} 
                />
              ) : (
                <UploadDataTab onComplete={handleUploadComplete} />
              )}
            </TabsContent>
            
            <TabsContent value="vendors">
              <VendorUploadTab />
            </TabsContent>
            
            <TabsContent value="templates">
              <TemplatesTab onOpenChange={handleDialogClose} />
            </TabsContent>
            
            <TabsContent value="structure">
              <DocumentStructureTab onOpenChange={handleDialogClose} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Data Upload</CardTitle>
              <TooltipButton 
                variant="ghost" 
                size="icon" 
                className="text-blue-500" 
                tooltipText="Upload data files"
              >
                <Upload className="h-5 w-5" />
              </TooltipButton>
            </div>
            <CardDescription>
              Import resident and property data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Import bulk data from Excel or CSV files. Update existing records or add new ones.
            </p>
            <TooltipButton 
              className="w-full mt-4" 
              tooltipText="Import data from files"
              onClick={() => {
                setActiveTab('upload');
                setUploadStep('initial');
              }}
            >
              Start Data Upload
            </TooltipButton>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Vendor Import</CardTitle>
              <TooltipButton 
                variant="ghost" 
                size="icon" 
                className="text-indigo-500" 
                tooltipText="Import vendor data"
              >
                <Users className="h-5 w-5" />
              </TooltipButton>
            </div>
            <CardDescription>
              Import vendor data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Bulk import vendor information from spreadsheets. Add new vendors or update existing ones.
            </p>
            <TooltipButton 
              className="w-full mt-4" 
              tooltipText="Import vendor information"
              onClick={() => setActiveTab('vendors')}
            >
              Import Vendors
            </TooltipButton>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Templates</CardTitle>
              <TooltipButton 
                variant="ghost" 
                size="icon" 
                className="text-purple-500" 
                tooltipText="Access and download templates"
              >
                <FileDown className="h-5 w-5" />
              </TooltipButton>
            </div>
            <CardDescription>
              Download data templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get standardized templates for data import. Follow these formats for seamless data uploads.
            </p>
            <TooltipButton 
              variant="outline" 
              className="w-full mt-4"
              tooltipText="View available templates"
              onClick={() => setActiveTab('templates')}
            >
              Browse Templates
            </TooltipButton>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Document Structure</CardTitle>
              <TooltipButton 
                variant="ghost" 
                size="icon" 
                className="text-green-500" 
                tooltipText="Configure document categories"
              >
                <Database className="h-5 w-5" />
              </TooltipButton>
            </div>
            <CardDescription>
              Configure document organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up your document categories and structure. Organize your filing system for maximum efficiency.
            </p>
            <TooltipButton 
              variant="outline" 
              className="w-full mt-4"
              tooltipText="Configure document structure"
              onClick={() => setActiveTab('structure')}
            >
              Manage Structure
            </TooltipButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemUploads;
