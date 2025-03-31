
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bot } from "lucide-react";
import { toast } from "sonner";
import { useXAI } from '@/hooks/use-xai';

const XAITest = () => {
  const { isXAIConnected, settings, testXAIConnection } = useXAI();
  const [isTesting, setIsTesting] = useState(false);
  
  const handleTestConnection = async () => {
    if (!isXAIConnected) {
      toast.error("X.AI is not connected. Please add your API key in the integration settings.");
      return;
    }

    if (!settings.apiKey) {
      toast.error("No API key found. Please check your X.AI integration settings.");
      return;
    }

    setIsTesting(true);
    try {
      const success = await testXAIConnection();
      
      if (success) {
        toast.success("X.AI API connection verified successfully!");
      } else {
        toast.error("X.AI API connection test failed. Check your API key.");
      }
    } catch (error) {
      console.error("Error testing X.AI connection:", error);
      toast.error("Connection test encountered an error.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
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
                Using model: {settings.defaultModel || "Default"} 
                {settings.organization && <span><br />Organization: {settings.organization}</span>}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleTestConnection} 
              disabled={!isXAIConnected || isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing connection...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default XAITest;
