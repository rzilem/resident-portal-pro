
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Textarea } from '@/components/ui/textarea';

export interface HtmlSourceEditorRef {
  insertAtCursor: (text: string) => void;
}

interface HtmlSourceEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlSourceEditor = forwardRef<HtmlSourceEditorRef, HtmlSourceEditorProps>(({ 
  value, 
  onChange 
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        // Insert the text at the cursor position
        const newValue = value.substring(0, startPos) + text + value.substring(endPos);
        onChange(newValue);
        
        // Set the cursor position after the inserted text
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
          textarea.focus();
        }, 0);
      }
    }
  }));

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[250px] font-mono text-sm px-4 py-2"
      placeholder="Enter HTML source code here..."
    />
  );
});

HtmlSourceEditor.displayName = 'HtmlSourceEditor';

export default HtmlSourceEditor;
