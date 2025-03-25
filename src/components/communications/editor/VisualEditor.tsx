
import React, { useRef, useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

interface VisualEditorProps {
  value: string;
  onUpdate: (content: string) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ value, onUpdate }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onUpdate(newContent);
    }
  };

  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    updateContent();
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
    <>
      <EditorToolbar 
        executeCommand={executeCommand} 
        createLink={createLink} 
        insertImage={insertImage} 
      />
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[250px] p-4 focus:outline-none"
        onInput={updateContent}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  );
};

export default VisualEditor;
