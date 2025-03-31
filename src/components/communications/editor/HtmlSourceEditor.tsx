
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface HtmlSourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const HtmlSourceEditor: React.FC<HtmlSourceEditorProps> = ({ value, onChange, readOnly = false }) => {
  return (
    <div className="p-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] font-mono text-sm resize-y"
        placeholder="<!DOCTYPE html>..."
        readOnly={readOnly}
      />
    </div>
  );
};

export default HtmlSourceEditor;
