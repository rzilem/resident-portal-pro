
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon } from 'lucide-react';
import HtmlEditor from '../../HtmlEditor';

interface TemplateContentEditorProps {
  content: string;
  isHtmlFormat: boolean;
  onContentChange: (content: string) => void;
  onFormatChange: (isHtml: boolean) => void;
  onMergeTagsClick: () => void;
}

const TemplateContentEditor: React.FC<TemplateContentEditorProps> = ({
  content,
  isHtmlFormat,
  onContentChange,
  onFormatChange,
  onMergeTagsClick
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="template-content">Message Content*</Label>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onMergeTagsClick}
          >
            <TagIcon className="mr-2 h-4 w-4" />
            Insert Merge Tag
          </Button>
          <Select 
            value={isHtmlFormat ? 'html' : 'plain'} 
            onValueChange={(v) => onFormatChange(v === 'html')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plain">Plain Text</SelectItem>
              <SelectItem value="html">Rich HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isHtmlFormat ? (
        <Card className="border">
          <HtmlEditor 
            value={content} 
            onChange={onContentChange}
          />
        </Card>
      ) : (
        <Textarea 
          id="template-content" 
          value={content} 
          onChange={(e) => onContentChange(e.target.value)} 
          placeholder="Your message content here. Use merge tags like {{resident.name}} for personalization."
          rows={8}
        />
      )}
    </div>
  );
};

export default TemplateContentEditor;
