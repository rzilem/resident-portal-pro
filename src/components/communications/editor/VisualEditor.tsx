
import React, { useRef, useEffect } from 'react';

interface VisualEditorProps {
  value: string;
  onUpdate: (content: string) => void;
  readOnly?: boolean;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ value, onUpdate, readOnly = false }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && !readOnly) {
      onUpdate(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      className={`p-4 min-h-[300px] focus:outline-none ${readOnly ? 'bg-gray-50' : ''}`}
      contentEditable={!readOnly}
      onInput={handleInput}
      onBlur={handleInput}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default VisualEditor;
