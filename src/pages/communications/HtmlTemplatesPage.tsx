
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { htmlTemplateService } from '@/services/htmlTemplateService';

const HtmlTemplatesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">HTML Templates</h1>
        <p className="text-muted-foreground">
          Create and manage HTML templates for your communications and documents
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground py-8">
            HTML Templates management is coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlTemplatesPage;
