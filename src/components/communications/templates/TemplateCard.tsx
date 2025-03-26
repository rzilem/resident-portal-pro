
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash, Send } from 'lucide-react';
import { MessageTemplate } from './types';

interface TemplateCardProps {
  template: MessageTemplate;
  onPreview: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (id: string) => void;
  onSelect: (template: MessageTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onEdit,
  onDelete,
  onSelect
}) => {
  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Preview clicked for template:", template.name);
    onPreview(template);
  };

  const handleUseTemplate = () => {
    onSelect(template);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{template.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(template.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-1">{template.name}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-1 items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePreview}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(template)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(template.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="default" size="sm" className="h-8 px-3" onClick={handleUseTemplate}>
          <Send className="mr-1 h-4 w-4" />
          Use
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
