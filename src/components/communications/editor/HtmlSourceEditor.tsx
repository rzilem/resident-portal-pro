
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

interface HtmlSourceEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const HtmlSourceEditor = forwardRef<{insertAtCursor: (text: string) => void}, HtmlSourceEditorProps>(
  ({ value, onChange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Expose method to insert content at cursor position
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        // Focus the textarea
        textarea.focus();
        
        // Get the current cursor position
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        // Insert the text at the cursor position
        const newValue = value.substring(0, startPos) + text + value.substring(endPos);
        onChange(newValue);
        
        // Set the cursor position after the inserted text
        setTimeout(() => {
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
        spellCheck={false}
      />
    );
  }
);

HtmlSourceEditor.displayName = 'HtmlSourceEditor';

export default HtmlSourceEditor;
