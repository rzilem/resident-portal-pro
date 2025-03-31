
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Edit, Eye, MessageSquare, 
  FileText, Trash2, CalendarClock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/components/communications/composer/ComposerUtils';
import { MessageTemplate } from '@/pages/communications/types';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface TemplateCardProps {
  template: MessageTemplate;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onPreview?: () => void;
  getCommunityName: (id: string) => string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onEdit,
  onDelete,
  onPreview,
  getCommunityName
}) => {
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {template.category}
          </Badge>
          <div className="flex gap-1">
            {template.communities && template.communities.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {template.communities.includes('all') 
                  ? 'All Communities' 
                  : template.communities.length === 1 
                    ? getCommunityName(template.communities[0])
                    : `${template.communities.length} Communities`}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-base">{template.name}</CardTitle>
        <CardDescription className="text-xs">
          <div className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            <span>Updated {formatDate(template.updatedAt)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground mb-2">
          {truncateText(template.description, 120)}
        </p>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="font-medium">{truncateText(template.subject, 60)}</span>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{truncateText(template.content, 100)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="default" 
          size="sm" 
          onClick={onSelect}
        >
          Use Template
        </Button>
        <div className="flex gap-1">
          {onPreview && (
            <TooltipButton
              variant="ghost"
              size="icon"
              onClick={onPreview}
              tooltipText="Preview template"
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </TooltipButton>
          )}
          <TooltipButton
            variant="ghost"
            size="icon"
            onClick={onEdit}
            tooltipText="Edit template"
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </TooltipButton>
          <TooltipButton
            variant="ghost"
            size="icon"
            onClick={onDelete}
            tooltipText="Delete template"
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </TooltipButton>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
