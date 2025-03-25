
import React from 'react';

interface HtmlSourceEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const HtmlSourceEditor: React.FC<HtmlSourceEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
    />
  );
};

export default HtmlSourceEditor;
