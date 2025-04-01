
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Building, Home, Users, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';
import { useDropzone } from 'react-dropzone';

// Mock data for document template categories
const templateCategories = [
  { id: 'association', name: 'Association', icon: <Building className="h-5 w-5 text-purple-500" /> },
  { id: 'property', name: 'Property', icon: <Home className="h-5 w-5 text-blue-500" /> },
  { id: 'resident', name: 'Resident', icon: <Users className="h-5 w-5 text-green-500" /> },
];

const DocumentTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('association');
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      console.log('Dropped files:', acceptedFiles);
      toast.success(`Uploaded template: ${acceptedFiles[0].name}`);
    }
  });
  
  const handleDownloadTemplate = (type: string) => {
    generateOnboardingTemplate(type);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Templates</h2>
        <Button {...getRootProps()} variant="outline" className="gap-2">
          <input {...getInputProps()} />
          <Upload className="h-4 w-4" />
          <span>Upload Template</span>
        </Button>
      </div>
      
      <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 mb-6">
          {templateCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              <span>{category.name} Templates</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="association">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TemplateCard 
              title="Association Setup"
              description="Template for setting up new associations in the system"
              onDownload={() => handleDownloadTemplate('association')}
              fields={[
                'Association Name', 'Address', 'City', 'State', 'Zip',
                'Contact Information', 'Total Units', 'Founded Date'
              ]}
            />
            
            {/* More association templates */}
          </div>
        </TabsContent>
        
        <TabsContent value="property">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TemplateCard 
              title="Property Upload"
              description="Template for adding multiple properties to an association"
              onDownload={() => handleDownloadTemplate('property')}
              fields={[
                'Property Address', 'Unit Number', 'City', 'State', 'Zip',
                'Property Type', 'Bedrooms', 'Bathrooms', 'Square Feet'
              ]}
            />
            
            {/* More property templates */}
          </div>
        </TabsContent>
        
        <TabsContent value="resident">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TemplateCard 
              title="Resident Onboarding"
              description="Template for adding new residents to your associations"
              onDownload={() => handleDownloadTemplate('resident')}
              fields={[
                'First Name', 'Last Name', 'Email', 'Phone',
                'Property Address', 'Unit Number', 'Resident Type',
                'Move-in Date', 'Status'
              ]}
            />
            
            {/* More resident templates */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Template card component
const TemplateCard = ({ 
  title, 
  description, 
  fields, 
  onDownload 
}: { 
  title: string; 
  description: string; 
  fields: string[]; 
  onDownload: () => void 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <strong className="block mb-1">Fields included:</strong>
          <ul className="list-disc pl-5 space-y-1">
            {fields.slice(0, 4).map((field, index) => (
              <li key={index}>{field}</li>
            ))}
            {fields.length > 4 && (
              <li className="text-muted-foreground">+{fields.length - 4} more fields</li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
          <span>Download Template</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentTemplates;
