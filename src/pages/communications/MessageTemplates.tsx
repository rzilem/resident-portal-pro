
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TemplateManager from '@/components/communications/templates/TemplateManager';

const MessageTemplates: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Message Templates</h1>
        <p className="text-muted-foreground">
          Create and manage reusable message templates for your communications
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <TemplateManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageTemplates;
