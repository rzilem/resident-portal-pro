
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2 } from 'lucide-react';
import { MessageTemplate } from './types';
import { SAMPLE_COMMUNITIES } from './types';

interface TemplateCardProps {
  template: MessageTemplate;
  onPreview: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (templateId: string) => void;
  onSelect: (template: MessageTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onPreview, 
  onEdit, 
  onDelete, 
  onSelect 
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg truncate">{template.name}</CardTitle>
        <CardDescription className="truncate">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="space-y-1 text-sm">
          <div className="font-medium">Category: {template.category}</div>
          <div className="truncate">Subject: {template.subject}</div>
          <div>
            {template.communities?.includes('all') 
              ? 'All Communities' 
              : template.communities?.map(c => {
                  const community = SAMPLE_COMMUNITIES.find(sc => sc.id === c);
                  return community?.name;
                }).join(', ') || 'All Communities'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onPreview(template)}
          >
            <Eye className="mr-1 h-4 w-4" />
            Preview
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onSelect(template)}
          >
            Use
          </Button>
        </div>
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(template)}
          >
            <FileEdit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
