
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { MessageTemplate } from '@/pages/communications/types';

interface TemplateSelectorProps {
  templates: MessageTemplate[];
  onSelectTemplate: (template: MessageTemplate) => void;
  currentCommunity?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates, 
  onSelectTemplate,
  currentCommunity
}) => {
  // Filter templates based on current community
  const filteredTemplates = currentCommunity 
    ? templates.filter(template => 
        !template.communities || 
        template.communities.includes('all') || 
        template.communities.includes(currentCommunity)
      )
    : templates;

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, MessageTemplate[]>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <FileText className="h-4 w-4" />
          Use Template
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Select a Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <React.Fragment key={category}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{category}</DropdownMenuLabel>
                {categoryTemplates.map((template) => (
                  <DropdownMenuItem 
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="cursor-pointer"
                  >
                    {template.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TemplateSelector;
