
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight
} from 'lucide-react';

interface EditorToolbarProps {
  executeCommand?: (command: string, value: string | null) => void;
  createLink?: () => void;
  insertImage?: () => void;
  disabled?: boolean;
  onAction?: (action: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onAction, 
  executeCommand, 
  createLink, 
  insertImage, 
  disabled = false 
}) => {
  const handleAction = (action: string) => {
    if (disabled) return;
    
    if (onAction) {
      onAction(action);
    } else if (executeCommand) {
      switch (action) {
        case 'bold':
          executeCommand('bold', null);
          break;
        case 'italic':
          executeCommand('italic', null);
          break;
        case 'underline':
          executeCommand('underline', null);
          break;
        case 'bulletList':
          executeCommand('insertUnorderedList', null);
          break;
        case 'orderedList':
          executeCommand('insertOrderedList', null);
          break;
        case 'link':
          if (createLink) createLink();
          break;
        case 'image':
          if (insertImage) insertImage();
          break;
        case 'alignLeft':
          executeCommand('justifyLeft', null);
          break;
        case 'alignCenter':
          executeCommand('justifyCenter', null);
          break;
        case 'alignRight':
          executeCommand('justifyRight', null);
          break;
        default:
          console.log('Unhandled action:', action);
      }
    }
  };
  
  return (
    <div className="flex items-center gap-1 p-1 border-b overflow-x-auto">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('bold')}
        disabled={disabled}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('italic')}
        disabled={disabled}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('underline')}
        disabled={disabled}
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('bulletList')}
        disabled={disabled}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('orderedList')}
        disabled={disabled}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('link')}
        disabled={disabled}
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('image')}
        disabled={disabled}
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('alignLeft')}
        disabled={disabled}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('alignCenter')}
        disabled={disabled}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleAction('alignRight')}
        disabled={disabled}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
