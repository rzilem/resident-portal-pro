
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Check, Download, File } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface TemplateListProps {
  title: string;
  description: string;
  templates: Template[];
  onApplyTemplate: (templateId: string) => void;
  onDownloadTemplate: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  title,
  description,
  templates,
  onApplyTemplate,
  onDownloadTemplate
}) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'documents':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'legal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'financial':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'communications':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'workflow':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'training':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'technical':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map(template => (
            <div 
              key={template.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors"
            >
              <div className="space-y-1 mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">{template.name}</h3>
                  <Badge 
                    className={getCategoryColor(template.category)} 
                    variant="secondary"
                  >
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              
              <div className="flex gap-2 self-end sm:self-center">
                <TooltipButton 
                  tooltipText="Download this template"
                  variant="outline" 
                  size="sm"
                  onClick={() => onDownloadTemplate(template.id)}
                >
                  <Download className="h-4 w-4" />
                </TooltipButton>
                
                <TooltipButton 
                  tooltipText="Apply this template to your project"
                  variant="outline" 
                  size="sm"
                  onClick={() => onApplyTemplate(template.id)}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Apply
                </TooltipButton>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateList;
