
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareMore } from 'lucide-react';

interface AiAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySuggestion: (text: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  open,
  onOpenChange,
  onApplySuggestion
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedText = generateSampleResponse(aiPrompt);
      setAiResponse(generatedText);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!aiResponse) return;
    onApplySuggestion(aiResponse);
    handleClose();
  };

  const handleClose = () => {
    setAiPrompt('');
    setAiResponse('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Message Assistant</DialogTitle>
          <DialogDescription>
            Describe what kind of message you need help with, and our AI will suggest content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">What kind of message do you need?</Label>
            <Textarea
              id="ai-prompt"
              placeholder="e.g., Write a welcome message for new residents"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="text-xs text-muted-foreground">
              Try prompts like "maintenance announcement", "board meeting invitation", or "community event"
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateContent} 
            disabled={isGenerating || !aiPrompt.trim()} 
            className="w-full"
          >
            {isGenerating ? (
              <>Generating content...</>
            ) : (
              <>
                <MessageSquareMore className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
          
          {aiResponse && (
            <div className="space-y-2 mt-4">
              <Label>Generated Content</Label>
              <div className="border rounded-md p-3 bg-muted/30 whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={!aiResponse}
          >
            Use This Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Sample response generator function
const generateSampleResponse = (prompt: string) => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('welcome')) {
    return "Welcome to our community! We're delighted to have you join us. This message is to provide you with some important information about our community resources and upcoming events.";
  } else if (promptLower.includes('maintenance') || promptLower.includes('repair')) {
    return "We want to inform you about upcoming maintenance work scheduled for next week. The maintenance team will be performing routine inspections and repairs throughout the community. Please ensure access to common areas during this time.";
  } else if (promptLower.includes('meeting') || promptLower.includes('board')) {
    return "The next board meeting is scheduled for Tuesday, July 15th at 7:00 PM in the community center. We'll be discussing the annual budget, upcoming renovations, and community events. All residents are welcome to attend.";
  } else if (promptLower.includes('event') || promptLower.includes('social')) {
    return "We're excited to announce our Summer Community Festival on Saturday, August 5th from 2:00 PM to 8:00 PM. There will be food, games, and entertainment for all ages. Don't miss this opportunity to meet your neighbors and enjoy a day of fun!";
  } else {
    return "Thank you for your message. We appreciate your communication and will address your concerns promptly. Our community thrives through active participation and open dialogue between residents and management.";
  }
};

export default AiAssistant;
