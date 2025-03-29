
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Link, List, ListOrdered, 
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
  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30">
      <div className="flex items-center gap-1 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('bold', null)}
          className="h-9 w-9 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('italic', null)}
          className="h-9 w-9 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('underline', null)}
          className="h-9 w-9 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('strikeThrough', null)}
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
          onClick={() => executeCommand('formatBlock', '<h1>')}
          className="h-9 w-9 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="h-9 w-9 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<p>')}
          className="h-9 w-9 p-0"
          title="Paragraph"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="h-9 w-9 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<pre>')}
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
          onClick={() => executeCommand('insertUnorderedList', null)}
          className="h-9 w-9 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('insertOrderedList', null)}
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
          onClick={() => executeCommand('justifyLeft', null)}
          className="h-9 w-9 p-0"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyCenter', null)}
          className="h-9 w-9 p-0"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyRight', null)}
          className="h-9 w-9 p-0"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyFull', null)}
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
          onClick={() => executeCommand('insertHTML', '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>')}
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
          onClick={() => executeCommand('undo', null)}
          className="h-9 w-9 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('redo', null)}
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
