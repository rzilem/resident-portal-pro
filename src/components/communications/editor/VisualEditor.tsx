
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface VisualEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ value, onChange, readOnly = false }) => {
  // In a real implementation, this would be a WYSIWYG editor
  // For now, we'll use a simple textarea as a placeholder
  
  return (
    <div className="p-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] font-mono text-sm resize-y"
        placeholder="Enter your content here..."
        readOnly={readOnly}
      />
    </div>
  );
};

export default VisualEditor;
