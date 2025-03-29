
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useComposer } from './ComposerContext';
import FormatSelector from './FormatSelector';
import { Card } from '@/components/ui/card';
import { Lightbulb, Tags } from 'lucide-react';
import HtmlEditor from '../HtmlEditor';
import { Textarea } from '@/components/ui/textarea';

interface ContentEditorProps {
  onOpenAiAssistant: () => void;
  onOpenMergeTagsDialog: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  onOpenAiAssistant,
  onOpenMergeTagsDialog,
}) => {
  const { 
    content, 
    setContent, 
    format, 
    setFormat,
    messageType,
    previewProcessedContent,
    setPreviewContent,
    setShowMergeTagPreview
  } = useComposer();

  // Force plain text format for SMS
  React.useEffect(() => {
    if (messageType === 'sms' && format !== 'plain') {
      setFormat('plain');
    }
  }, [messageType, format, setFormat]);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handlePreviewClick = async () => {
    try {
      const processed = await previewProcessedContent(content);
      setPreviewContent(processed);
      setShowMergeTagPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  // Calculate SMS message count
  const getSmsMessageCount = () => {
    const charCount = content.length;
    if (charCount === 0) return 0;
    return Math.ceil(charCount / 160);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="content">Message Content</Label>
        <div className="flex items-center gap-2">
          {/* Only show format selector for email messages */}
          {messageType === 'email' && <FormatSelector />}
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="h-8 gap-1"
            onClick={onOpenMergeTagsDialog}
          >
            <Tags className="h-4 w-4" />
            Merge Tags
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="h-8 gap-1"
            onClick={onOpenAiAssistant}
          >
            <Lightbulb className="h-4 w-4" />
            AI Assist
          </Button>
        </div>
      </div>

      {messageType === 'sms' ? (
        <div className="space-y-2">
          <Textarea
            id="content" 
            placeholder="Enter your SMS message here..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={5}
            maxLength={480} // Allow for 3 SMS messages max
            className="resize-y"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{content.length} characters</span>
            <span>
              {getSmsMessageCount()} {getSmsMessageCount() === 1 ? 'message' : 'messages'}
              {getSmsMessageCount() > 1 && ' (may incur additional charges)'}
            </span>
          </div>
        </div>
      ) : (
        format === 'html' ? (
          <HtmlEditor 
            content={content} 
            onChange={handleContentChange} 
            onPreview={handlePreviewClick}
          />
        ) : (
          <Textarea
            id="content" 
            placeholder="Enter your message content here..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={10}
            className="resize-y"
          />
        )
      )}

      {/* SMS Message Info Card */}
      {messageType === 'sms' && (
        <Card className="p-3 bg-muted/50">
          <h4 className="text-sm font-medium mb-1">SMS Guidelines</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Standard SMS messages are limited to 160 characters</li>
            <li>• Longer messages will be split into multiple texts</li>
            <li>• Merge tags will be processed before sending</li>
            <li>• Recipients need to have a valid mobile number on file</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default ContentEditor;
