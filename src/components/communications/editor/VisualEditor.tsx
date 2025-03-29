
import React, { useRef, useEffect, useCallback } from 'react';

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

  // Make sure the editor has focus when commands are executed
  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Create a range and selection if needed
      if (window.getSelection()?.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false); // collapse to end
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, []);

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
      className="min-h-[250px] p-4 focus:outline-none overflow-auto"
      onInput={updateContent}
      onBlur={updateContent}
      onFocus={focusEditor}
      onClick={focusEditor}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default VisualEditor;
