
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComposer } from './ComposerContext';

const FormatSelector: React.FC = () => {
  const { format, setFormat } = useComposer();

  return (
    <Select 
      value={format} 
      onValueChange={(value) => setFormat(value as 'plain' | 'html')}
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
