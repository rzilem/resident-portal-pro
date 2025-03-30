
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Settings } from "lucide-react";
import { useXAI } from '@/hooks/use-xai';
import { generateWithXAI } from '@/utils/xai';
import { toast } from 'sonner';

const XAITest = () => {
  const { isXAIConnected, settings } = useXAI();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    if (!isXAIConnected) {
      toast.error('Please connect to X.AI first');
      setShowDialog(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateWithXAI(
        settings.apiKey,
        prompt,
        settings.defaultModel
      );
      
      setResponse(result);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          X.AI Playground
        </CardTitle>
        <CardDescription>
          Test X.AI's text generation capabilities with your API key
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isXAIConnected ? (
          <div className="p-4 border border-dashed rounded-md text-center">
            <p className="text-muted-foreground mb-4">Connect to X.AI to start generating text</p>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure X.AI
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Your prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>
            
            {response && (
              <div className="space-y-2">
                <label htmlFor="response" className="text-sm font-medium">
                  X.AI response
                </label>
                <div
                  className="w-full rounded-md border border-input bg-background p-3 text-sm"
                >
                  {response}
                </div>
              </div>
            )}
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setShowDialog(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          API Settings
        </Button>
        
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!isXAIConnected || !prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </CardFooter>
      
      {showDialog && (
        <div className="hidden">
          {/* This is just to trigger the dialog via IntegrationCard */}
          {/* The actual dialog is rendered through AutomationIntegrations */}
        </div>
      )}
    </Card>
  );
};

export default XAITest;
