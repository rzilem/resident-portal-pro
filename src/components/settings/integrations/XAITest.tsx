
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2 } from 'lucide-react';
import { useXAI } from '@/hooks/use-xai';
import { toast } from 'sonner';

const XAITest = () => {
  const [prompt, setPrompt] = useState("Write a short welcome message for new residents of an apartment complex.");
  const [response, setResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isXAIConnected, generateContent, settings } = useXAI();

  const handleGenerateContent = async () => {
    if (!isXAIConnected) {
      toast.error("Please connect X.AI integration first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setResponse(null);
    
    try {
      // In a real implementation, this would call the actual X.AI API through the generateContent function
      // For demonstration, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const mockResponse = `Welcome to your new home at Sunshine Apartments! 

We're thrilled to have you join our community. Your comfort and satisfaction are our top priorities. 

Don't hesitate to reach out to our management office if you need anything. We host monthly resident events, so keep an eye on the community board for upcoming gatherings.

Enjoy your new space and all the amenities our complex has to offer!`;
      
      setResponse(mockResponse);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          X.AI Content Generation
        </CardTitle>
        <CardDescription>
          Test your X.AI integration by generating content from a prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isXAIConnected ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            <p>X.AI integration is not connected. Please configure it in the Integrations tab.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Enter your prompt</Label>
              <Textarea
                id="ai-prompt"
                placeholder="Type your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Model: {settings.defaultModel || 'grok-2'}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerateContent} 
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </div>
            
            {response && (
              <div className="pt-4 space-y-2">
                <Label>Generated Content</Label>
                <div className="border rounded-md p-4 bg-muted/20">
                  <p className="whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default XAITest;
