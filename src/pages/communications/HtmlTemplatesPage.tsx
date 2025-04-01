
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HtmlTemplates from '@/components/communications/html-templates/HtmlTemplates';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const HtmlTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">HTML Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable HTML templates for your communications
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/communications')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Communications
        </Button>
      </div>
      
      <HtmlTemplates />
    </div>
  );
};

export default HtmlTemplatesPage;
