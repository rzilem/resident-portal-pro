
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Heading1, Heading2, Code } from 'lucide-react';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<string>("visual");
  const [htmlCode, setHtmlCode] = React.useState<string>(value);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const updateVisualContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      setHtmlCode(newContent);
    }
  };

  const updateHtmlContent = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlCode;
      onChange(htmlCode);
    }
  };

  const handleTabChange = (tab: string) => {
    if (activeTab === "visual" && tab === "html") {
      // Switching from visual to HTML - update the HTML code
      if (editorRef.current) {
        setHtmlCode(editorRef.current.innerHTML);
      }
    } else if (activeTab === "html" && tab === "visual") {
      // Switching from HTML to visual - update the editor
      updateHtmlContent();
    }
    setActiveTab(tab);
  };

  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    updateVisualContent();
    // Focus back to the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const createLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between border-b px-3 py-2">
          <TabsList>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="p-0">
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
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[250px] p-4 focus:outline-none"
            onInput={updateVisualContent}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </TabsContent>

        <TabsContent value="html" className="p-0">
          <textarea
            className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none resize-none"
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            spellCheck={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HtmlEditor;
