
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Link, ListOrdered, List,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image, Heading1, Heading2, Code, Underline, 
  Quote, Table, Undo, Redo, Strikethrough, Type
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const handleButtonClick = (command: string, value: string | null = null) => {
    console.log(`Execute command: ${command}`, value);
    executeCommand(command, value);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30">
      <div className="flex items-center gap-1 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('bold')}
          className="h-9 w-9 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('italic')}
          className="h-9 w-9 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('underline')}
          className="h-9 w-9 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('strikeThrough')}
          className="h-9 w-9 p-0"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1 mx-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('formatBlock', '<h1>')}
          className="h-9 w-9 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('formatBlock', '<h2>')}
          className="h-9 w-9 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('formatBlock', '<p>')}
          className="h-9 w-9 p-0"
          title="Paragraph"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('formatBlock', '<blockquote>')}
          className="h-9 w-9 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('formatBlock', '<pre>')}
          className="h-9 w-9 p-0"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1 mx-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('insertUnorderedList')}
          className="h-9 w-9 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('insertOrderedList')}
          className="h-9 w-9 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1 mx-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('justifyLeft')}
          className="h-9 w-9 p-0"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('justifyCenter')}
          className="h-9 w-9 p-0"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('justifyRight')}
          className="h-9 w-9 p-0"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('justifyFull')}
          className="h-9 w-9 p-0"
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1 mx-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={createLink}
          className="h-9 w-9 p-0"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertImage}
          className="h-9 w-9 p-0"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('insertHTML', '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>')}
          className="h-9 w-9 p-0"
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1 ml-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('undo')}
          className="h-9 w-9 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleButtonClick('redo')}
          className="h-9 w-9 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
