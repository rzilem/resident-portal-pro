
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

export interface HtmlSourceEditorRef {
  insertAtCursor: (text: string) => void;
}

interface HtmlSourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const HtmlSourceEditor = forwardRef<HtmlSourceEditorRef, HtmlSourceEditorProps>(
  ({ value, onChange, readOnly = false }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Expose method to parent component to insert at cursor
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const startPos = textarea.selectionStart;
          const endPos = textarea.selectionEnd;
          
          // Insert text at cursor position
          const newValue = value.substring(0, startPos) + text + value.substring(endPos);
          onChange(newValue);
          
          // Set cursor position after the inserted text
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = startPos + text.length;
              textareaRef.current.selectionEnd = startPos + text.length;
              textareaRef.current.focus();
            }
          }, 0);
        }
      }
    }));
    
    return (
      <div className="p-4">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[300px] font-mono text-sm resize-y"
          placeholder="<!DOCTYPE html>..."
          readOnly={readOnly}
        />
      </div>
    );
  }
);

HtmlSourceEditor.displayName = 'HtmlSourceEditor';

export default HtmlSourceEditor;
