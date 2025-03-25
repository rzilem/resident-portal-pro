
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormatSelectorProps {
  format: 'plain' | 'html';
  onFormatChange: (format: 'plain' | 'html') => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onFormatChange }) => {
  return (
    <Select 
      value={format} 
      onValueChange={(value) => onFormatChange(value as 'plain' | 'html')}
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
