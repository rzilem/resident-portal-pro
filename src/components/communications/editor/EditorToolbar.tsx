
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
  onAction: (action: string) => void;
  disabled?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onAction, disabled = false }) => {
  const handleAction = (action: string) => {
    if (!disabled) {
      onAction(action);
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
