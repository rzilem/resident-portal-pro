
import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';

interface VisualEditorProps {
  value: string;
  onUpdate: (content: string) => void;
}

const VisualEditor = forwardRef<{insertAtCursor: (text: string) => void}, VisualEditorProps>(
  ({ value, onUpdate }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Initialize the editor with content
    useEffect(() => {
      if (editorRef.current && !isInitialized) {
        editorRef.current.innerHTML = value;
        setIsInitialized(true);
      } else if (editorRef.current && value !== editorRef.current.innerHTML) {
        // Only update innerHTML if the value has actually changed
        // This prevents losing cursor position when parent re-renders
        editorRef.current.innerHTML = value;
      }
    }, [value, isInitialized]);

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

    const updateContent = useCallback(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML;
        if (newContent !== value) {
          onUpdate(newContent);
        }
      }
    }, [onUpdate, value]);

    // Expose method to insert content at cursor position
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        // Focus the editor first
        focusEditor();
        
        // Get the current selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          // Insert the text at the cursor position
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          // Create a text node with the content to insert
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);
          
          // Move the cursor after the inserted text
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Update the content
          updateContent();
        } else {
          // If no selection, append to the end
          if (editorRef.current) {
            editorRef.current.innerHTML += text;
            updateContent();
          }
        }
      }
    }));

    return (
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[250px] p-4 focus:outline-none overflow-auto border rounded-md"
        onInput={updateContent}
        onBlur={updateContent}
        onFocus={focusEditor}
        onClick={focusEditor}
      />
    );
  }
);

VisualEditor.displayName = 'VisualEditor';

export default VisualEditor;
