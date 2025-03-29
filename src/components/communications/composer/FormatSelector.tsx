
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComposer } from './ComposerContext';

// Define props interface with format and onChange
interface FormatSelectorProps {
  format: 'plain' | 'html';
  onChange: (format: 'plain' | 'html') => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onChange }) => {
  return (
    <Select 
      value={format} 
      onValueChange={(value) => onChange(value as 'plain' | 'html')}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Message Format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="plain">Plain Text</SelectItem>
        <SelectItem value="html">Rich HTML</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FormatSelector;
