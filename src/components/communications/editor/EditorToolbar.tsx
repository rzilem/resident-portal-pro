
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  disabled?: boolean;
  onAction: (action: string, value?: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  disabled = false,
  onAction
}) => {
  return (
    <div className="border-b p-2 bg-muted/30 flex flex-wrap items-center gap-1">
      <TooltipProvider delayDuration={300}>
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="bold" 
                aria-label="Toggle bold" 
                disabled={disabled}
                onClick={() => onAction('bold')}
                size="sm"
              >
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="italic" 
                aria-label="Toggle italic"
                disabled={disabled}
                onClick={() => onAction('italic')}
                size="sm"
              >
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="underline" 
                aria-label="Toggle underline"
                disabled={disabled}
                onClick={() => onAction('underline')}
                size="sm"
              >
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="bulletList" 
                aria-label="Toggle bullet list"
                disabled={disabled}
                onClick={() => onAction('bulletList')}
                size="sm"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="orderedList" 
                aria-label="Toggle ordered list"
                disabled={disabled}
                onClick={() => onAction('orderedList')}
                size="sm"
              >
                <ListOrdered className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="heading1" 
                aria-label="Heading 1"
                disabled={disabled}
                onClick={() => onAction('heading', '1')}
                size="sm"
              >
                <Heading1 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="heading2" 
                aria-label="Heading 2"
                disabled={disabled}
                onClick={() => onAction('heading', '2')}
                size="sm"
              >
                <Heading2 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="heading3" 
                aria-label="Heading 3"
                disabled={disabled}
                onClick={() => onAction('heading', '3')}
                size="sm"
              >
                <Heading3 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <ToggleGroup type="single" className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="alignLeft" 
                aria-label="Align Left"
                disabled={disabled}
                onClick={() => onAction('align', 'left')}
                size="sm"
              >
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="alignCenter" 
                aria-label="Align Center"
                disabled={disabled}
                onClick={() => onAction('align', 'center')}
                size="sm"
              >
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="alignRight" 
                aria-label="Align Right"
                disabled={disabled}
                onClick={() => onAction('align', 'right')}
                size="sm"
              >
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="alignJustify" 
                aria-label="Justify"
                disabled={disabled}
                onClick={() => onAction('align', 'justify')}
                size="sm"
              >
                <AlignJustify className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Justify</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={disabled}
              onClick={() => onAction('link')}
              className="h-8 px-2"
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Link</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={disabled}
              onClick={() => onAction('image')}
              className="h-8 px-2"
            >
              <Image className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EditorToolbar;
