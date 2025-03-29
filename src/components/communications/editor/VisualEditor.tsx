
import React, { useRef, useEffect } from 'react';

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

  return (
    <div
      ref={editorRef}
      contentEditable
      className="min-h-[250px] p-4 focus:outline-none"
      onInput={updateContent}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default VisualEditor;
