
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

interface HtmlSourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export interface HtmlSourceEditorRef {
  insertAtCursor: (text: string) => void;
}

const HtmlSourceEditor = forwardRef<HtmlSourceEditorRef, HtmlSourceEditorProps>(
  ({ value, onChange, readOnly = false }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Expose method to parent component
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (!textareaRef.current || readOnly) return;
        
        const textarea = textareaRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        // Insert text at cursor position
        const newValue = value.substring(0, startPos) + text + value.substring(endPos);
        onChange(newValue);
        
        // Reset cursor position after the inserted text
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
        }, 0);
      }
    }));

    return (
      <textarea
        ref={textareaRef}
        className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        style={{ 
          backgroundColor: readOnly ? '#f9fafb' : 'white',
          cursor: readOnly ? 'default' : 'text'
        }}
      />
    );
  }
);

HtmlSourceEditor.displayName = 'HtmlSourceEditor';

export default HtmlSourceEditor;
