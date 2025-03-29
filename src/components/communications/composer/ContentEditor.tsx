
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HtmlEditor from '../HtmlEditor';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tags, Wand2, Eye, Clock } from 'lucide-react';
import { useComposer } from './ComposerContext';
import FormatSelector from './FormatSelector';
import ScheduledMessagesDialog from './ScheduledMessagesDialog';
import { toast } from 'sonner';

interface ContentEditorProps {
  onOpenAiAssistant: () => void;
  onOpenMergeTagsDialog: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  onOpenAiAssistant, 
  onOpenMergeTagsDialog 
}) => {
  const { 
    content, 
    setContent, 
    format, 
    setFormat,
    setPreviewContent,
    setShowMergeTagPreview,
    previewProcessedContent
  } = useComposer();
  
  const [showScheduledMessages, setShowScheduledMessages] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handlePreviewClick = async () => {
    if (!content.trim()) {
      toast.error("Please add content before previewing");
      return;
    }

    setIsPreviewLoading(true);
    try {
      // We'll set the raw content for preview and let the MessagePreview component handle processing
      setPreviewContent(content);
      setShowMergeTagPreview(true);
    } catch (error) {
      console.error("Error preparing preview:", error);
      toast.error("Failed to generate preview");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <FormatSelector 
            format={format} 
            onChange={setFormat} 
          />
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowScheduledMessages(true)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Scheduled
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenMergeTagsDialog}
            >
              <Tags className="h-4 w-4 mr-2" />
              Merge Tags
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenAiAssistant}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreviewClick}
              disabled={isPreviewLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {format === 'plain' ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your message..."
                className="min-h-[250px] border-0 focus-visible:ring-0 resize-none"
              />
            ) : (
              <HtmlEditor
                value={content}
                onChange={setContent}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ScheduledMessagesDialog 
        open={showScheduledMessages} 
        onOpenChange={setShowScheduledMessages} 
      />
    </>
  );
};

export default ContentEditor;
