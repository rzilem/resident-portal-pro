
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export interface VisualEditorRef {
  insertAtCursor: (text: string) => void;
}

interface VisualEditorProps {
  value: string;
  onUpdate: (value: string) => void;
  readOnly?: boolean;
}

const VisualEditor = forwardRef<VisualEditorRef, VisualEditorProps>(
  ({ value, onUpdate, readOnly = false }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    
    // Expose method to parent component to insert at cursor
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        const selection = window.getSelection();
        
        if (selection && selection.rangeCount > 0 && editorRef.current) {
          const range = selection.getRangeAt(0);
          
          // Check if the selection is within our editor
          if (editorRef.current.contains(range.commonAncestorContainer)) {
            // Insert the text at cursor position
            const textNode = document.createTextNode(text);
            range.deleteContents();
            range.insertNode(textNode);
            
            // Move cursor to the end of inserted text
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Update the value
            onUpdate(editorRef.current.innerHTML);
          } else {
            // If cursor is not in editor, append to the end
            editorRef.current.innerHTML += text;
            onUpdate(editorRef.current.innerHTML);
          }
        } else {
          // Fallback: append to the end
          if (editorRef.current) {
            editorRef.current.innerHTML += text;
            onUpdate(editorRef.current.innerHTML);
          }
        }
      }
    }));
    
    const handleInput = () => {
      if (editorRef.current) {
        onUpdate(editorRef.current.innerHTML);
      }
    };
    
    return (
      <div className="p-4">
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          className="min-h-[300px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleInput}
          style={{ 
            userSelect: 'text',
            WebkitUserSelect: 'text',
            cursor: readOnly ? 'default' : 'text'
          }}
        />
      </div>
    );
  }
);

VisualEditor.displayName = 'VisualEditor';

export default VisualEditor;
