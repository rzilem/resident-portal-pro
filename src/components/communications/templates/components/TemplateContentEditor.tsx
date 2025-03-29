
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import HtmlEditor from '../../HtmlEditor';
import FormatSelector from '../../composer/FormatSelector';
import { Tags } from 'lucide-react';
import { MergeTag } from '@/types/mergeTags';

interface TemplateContentEditorProps {
  content: string;
  isHtmlFormat: boolean;
  onContentChange: (content: string) => void;
  onFormatChange: (isHtml: boolean) => void;
  onMergeTagsClick: () => void;
  onSaveTemplate?: () => void;
  onInsertMergeTag?: (tag: MergeTag) => void;
}

const TemplateContentEditor: React.FC<TemplateContentEditorProps> = ({
  content,
  isHtmlFormat,
  onContentChange,
  onFormatChange,
  onMergeTagsClick,
  onSaveTemplate,
  onInsertMergeTag
}) => {
  const htmlEditorRef = useRef<any>(null);

  // Handle merge tag insertion
  const handleInsertMergeTag = (tag: MergeTag) => {
    if (onInsertMergeTag) {
      onInsertMergeTag(tag);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <FormatSelector 
            format={isHtmlFormat ? 'html' : 'plain'} 
            onChange={(format) => onFormatChange(format === 'html')}
          />
          
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={onMergeTagsClick}
            className="flex items-center gap-1"
          >
            <Tags className="h-4 w-4" />
            Insert Merge Tags
          </Button>
        </div>
      </div>
      
      {isHtmlFormat ? (
        <HtmlEditor 
          value={content} 
          onChange={onContentChange}
          onSave={onSaveTemplate}
          isTemplate={true}
          ref={htmlEditorRef}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full min-h-[250px] p-4 border rounded-md"
          placeholder="Enter template content here..."
        />
      )}
    </div>
  );
};

export default TemplateContentEditor;
