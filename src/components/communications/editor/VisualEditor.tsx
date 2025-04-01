
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface VisualEditorRef {
  executeCommand: (command: string, value?: string | null) => void;
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
    
    // Initialize editor
    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = value;
        if (readOnly) {
          editorRef.current.setAttribute('contenteditable', 'false');
        } else {
          editorRef.current.setAttribute('contenteditable', 'true');
        }
      }
    }, [readOnly]);
    
    // Update editor content when value prop changes
    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);
    
    // Handle editor content changes
    const handleInput = () => {
      if (editorRef.current) {
        onUpdate(editorRef.current.innerHTML);
      }
    };
    
    // Expose editor methods to parent
    useImperativeHandle(ref, () => ({
      executeCommand: (command: string, value: string | null = null) => {
        document.execCommand(command, false, value);
        handleInput();
      },
      insertAtCursor: (text: string) => {
        if (!editorRef.current) return;
        
        // If it's a selection range
        if (window.getSelection) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
            
            // Move cursor to the end of inserted text
            range.setStartAfter(range.endContainer);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            handleInput();
            return;
          }
        }
        
        // Fallback if no selection
        editorRef.current.innerHTML += text;
        handleInput();
      }
    }));
    
    return (
      <div 
        ref={editorRef}
        onInput={handleInput}
        className={`p-4 min-h-[300px] outline-none ${readOnly ? 'bg-muted/20' : ''}`}
        style={{ 
          overflowY: 'auto',
          wordBreak: 'break-word'
        }}
      />
    );
  }
);

VisualEditor.displayName = 'VisualEditor';

export default VisualEditor;
