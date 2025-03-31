
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useXAI } from '@/hooks/use-xai';

const XAITest: React.FC = () => {
  const { isXAIConnected, settings } = useXAI();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!isXAIConnected) {
      toast.error('Please configure X.AI integration first');
      return;
    }

    setIsGenerating(true);
    setResponse('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      setResponse(`This is a simulated response to: "${prompt}"\n\nIn a production environment, this would connect to the X.AI API using your configured API key.`);
      
      toast.success('Response generated');
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          X.AI Test
        </CardTitle>
        <CardDescription>
          Test your X.AI integration with a sample prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isXAIConnected ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 text-sm">
            X.AI integration is not configured. Please visit the Integrations page to set up your API key.
          </div>
        ) : (
          <>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>
            
            {response && (
              <div className="grid w-full gap-1.5">
                <Label htmlFor="response">Response</Label>
                <Textarea
                  id="response"
                  value={response}
                  readOnly
                  rows={6}
                  className="bg-muted"
                />
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !isXAIConnected || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Response'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default XAITest;
