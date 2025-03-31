
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Link2, 
  Image, 
  Redo2, 
  Undo2
} from 'lucide-react';

interface EditorToolbarProps {
  executeCommand: (command: string, value?: string | null) => void;
  createLink: () => void;
  insertImage: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  executeCommand,
  createLink,
  insertImage
}) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-muted/30 border-b">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('bold')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('italic')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('underline')}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('strikeThrough')}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <div className="h-6 w-px bg-border mx-1"></div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('justifyLeft')}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('justifyCenter')}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('justifyRight')}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <div className="h-6 w-px bg-border mx-1"></div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('insertUnorderedList')}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('insertOrderedList')}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="h-6 w-px bg-border mx-1"></div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={createLink}
        title="Insert Link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={insertImage}
        title="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <div className="h-6 w-px bg-border mx-1"></div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('undo')}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => executeCommand('redo')}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
