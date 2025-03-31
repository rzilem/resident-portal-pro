
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface VisualEditorProps {
  value: string;
  onUpdate: (content: string) => void;
  readOnly?: boolean;
}

export interface VisualEditorRef {
  insertAtCursor: (text: string) => void;
}

const VisualEditor = forwardRef<VisualEditorRef, VisualEditorProps>(({ value, onUpdate, readOnly = false }, ref) => {
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

  // Expose method to parent component
  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      if (!editorRef.current || readOnly) return;
      
      // Get current selection
      const selection = window.getSelection();
      if (!selection?.rangeCount) {
        // If no selection, append to the end
        editorRef.current.innerHTML += text;
        onUpdate(editorRef.current.innerHTML);
        return;
      }
      
      // Insert at current selection
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(text);
      range.deleteContents();
      range.insertNode(fragment);
      
      // Move cursor to end of inserted text
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      
      onUpdate(editorRef.current.innerHTML);
    }
  }));

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
});

VisualEditor.displayName = 'VisualEditor';

export default VisualEditor;
