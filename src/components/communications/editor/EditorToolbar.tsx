
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Link, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, 
  Image, Heading1, Heading2, Code 
} from 'lucide-react';

interface EditorToolbarProps {
  executeCommand: (command: string, value: string | null) => void;
  createLink: () => void;
  insertImage: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  executeCommand, 
  createLink, 
  insertImage 
}) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('bold')}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('italic')}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={createLink}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('insertUnorderedList')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('insertOrderedList')}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyLeft')}
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyCenter')}
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyRight')}
        className="h-8 w-8 p-0"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={insertImage}
        className="h-8 w-8 p-0"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('formatBlock', '<h1>')}
        className="h-8 w-8 p-0"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('formatBlock', '<h2>')}
        className="h-8 w-8 p-0"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
