
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Bot, TagIcon } from 'lucide-react';
import HtmlEditor from '../HtmlEditor';
import FormatSelector from './FormatSelector';
import { useComposer } from './ComposerContext';
import { mergeTagService } from '@/services/mergeTagService';

interface ContentEditorProps {
  onOpenAiAssistant: () => void;
  onOpenMergeTagsDialog: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  onOpenAiAssistant,
  onOpenMergeTagsDialog,
}) => {
  const { content, setContent, format, setPreviewContent, setShowMergeTagPreview } = useComposer();

  const handlePreviewWithMergeTags = async () => {
    try {
      const processed = await mergeTagService.processMergeTags(content, {});
      setPreviewContent(processed);
      setShowMergeTagPreview(true); // Open the preview dialog after setting the content
      console.log("Preview dialog should open with content:", processed);
    } catch (error) {
      console.error("Error processing merge tags for preview:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="content">Message Content</Label>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onOpenAiAssistant}
            className="gap-1"
          >
            <Bot className="h-4 w-4" />
            AI Assist
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onOpenMergeTagsDialog}
          >
            <TagIcon className="mr-2 h-4 w-4" />
            Insert Merge Tag
          </Button>
          <FormatSelector />
        </div>
      </div>

      {format === 'plain' ? (
        <Textarea
          id="content"
          placeholder="Enter your message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[250px]"
          required
        />
      ) : (
        <Card className="border">
          <HtmlEditor 
            value={content} 
            onChange={setContent}
          />
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handlePreviewWithMergeTags}
        >
          Preview with Merge Tags
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
