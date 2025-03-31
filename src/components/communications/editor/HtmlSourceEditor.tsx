
import React from 'react';

interface HtmlSourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const HtmlSourceEditor: React.FC<HtmlSourceEditorProps> = ({ value, onChange, readOnly = false }) => {
  return (
    <textarea
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
};

export default HtmlSourceEditor;
