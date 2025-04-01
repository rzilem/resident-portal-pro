
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bot, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useXAI } from '@/hooks/use-xai';
import XAIDialog from './dialogs/XAIDialog';

const XAITest = () => {
  const { isXAIConnected, settings, testXAIConnection } = useXAI();
  const [isTesting, setIsTesting] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  
  const handleTestConnection = async () => {
    if (!isXAIConnected) {
      toast.error("X.AI is not connected. Please add your API key in the settings.");
      setShowConfigDialog(true);
      return;
    }

    if (!settings.apiKey) {
      toast.error("No API key found. Please check your X.AI integration settings.");
      setShowConfigDialog(true);
      return;
    }

    setIsTesting(true);
    try {
      const success = await testXAIConnection();
      
      if (success) {
        toast.success("X.AI API connection verified successfully!");
      } else {
        toast.error("X.AI API connection test failed. Check your API key.");
        // If test fails, show the config dialog
        setShowConfigDialog(true);
      }
    } catch (error) {
      console.error("Error testing X.AI connection:", error);
      toast.error("Connection test encountered an error.");
      // Also show config dialog on error
      setShowConfigDialog(true);
    } finally {
      setIsTesting(false);
    }
  };

  const handleConfigureClick = () => {
    setShowConfigDialog(true);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Test X.AI Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p>
              {isXAIConnected 
                ? "Your X.AI integration is connected. Click the button below to test the connection."
                : "X.AI is not connected. Please add your API key in the integration settings."}
            </p>
            {isXAIConnected && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Using model: {settings.defaultModel || "grok-1"} 
                  {settings.organization && <span><br />Organization: {settings.organization}</span>}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant={isXAIConnected ? "default" : "outline"}
                onClick={isXAIConnected ? handleTestConnection : handleConfigureClick} 
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing connection...
                  </>
                ) : isXAIConnected ? (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Test Connection
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Configure X.AI
                  </>
                )}
              </Button>
              
              {isXAIConnected && (
                <Button 
                  variant="outline"
                  onClick={handleConfigureClick}
                  className="w-full"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reconfigure X.AI
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <XAIDialog 
        open={showConfigDialog} 
        onOpenChange={setShowConfigDialog} 
      />
    </>
  );
};

export default XAITest;
