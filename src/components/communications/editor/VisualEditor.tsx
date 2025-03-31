
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface VisualEditorRef {
  insertAtCursor: (text: string) => void;
}

interface VisualEditorProps {
  value: string;
  onUpdate: (content: string) => void;
}

const VisualEditor = forwardRef<VisualEditorRef, VisualEditorProps>(({ 
  value, 
  onUpdate 
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Handle editor input changes
  const handleInput = () => {
    if (editorRef.current) {
      onUpdate(editorRef.current.innerHTML);
    }
  };

  // Expose method to insert text at cursor
  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      if (!editorRef.current) return;
      
      // Get the current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        // No selection, append to the end
        editorRef.current.innerHTML += text;
        onUpdate(editorRef.current.innerHTML);
        return;
      }
      
      // Get the current range
      const range = selection.getRangeAt(0);
      
      // Check if the selection is within our editor
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        // Selection is outside our editor, focus and append
        editorRef.current.focus();
        const newRange = document.createRange();
        newRange.selectNodeContents(editorRef.current);
        newRange.collapse(false); // Collapse to end
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
      
      // Insert the text
      const textNode = document.createTextNode(text);
      range.deleteContents();
      range.insertNode(textNode);
      
      // Move the cursor to the end of inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Update the content
      onUpdate(editorRef.current.innerHTML);
      
      // Focus back on the editor
      editorRef.current.focus();
    }
  }));

  return (
    <div
      ref={editorRef}
      contentEditable={true}
      className="min-h-[250px] px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 overflow-y-auto"
      onInput={handleInput}
      style={{ backgroundColor: 'white' }}
    />
  );
});

VisualEditor.displayName = 'VisualEditor';

export default VisualEditor;
