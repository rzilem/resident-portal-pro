
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { speakWithElevenLabs } from '@/utils/elevenlabs';

const ElevenLabsTest = () => {
  const { isElevenLabsConnected, settings, testElevenLabsAPI } = useElevenLabs();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // For debugging purposes
  useEffect(() => {
    console.log('ElevenLabsTest component mounted with settings:', {
      connected: isElevenLabsConnected,
      apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
      defaultVoiceId: settings.defaultVoiceId,
      defaultModel: settings.defaultModel
    });
  }, [isElevenLabsConnected, settings]);

  const handleTestVoice = async () => {
    if (!isElevenLabsConnected) {
      toast.error("ElevenLabs is not connected. Please add your API key in the integration settings.");
      return;
    }

    if (!settings.apiKey) {
      toast.error("No API key found. Please check your ElevenLabs integration settings.");
      return;
    }

    setIsPlaying(true);
    try {
      console.log("Testing ElevenLabs voice with settings:", {
        voiceId: settings.defaultVoiceId,
        model: settings.defaultModel
      });
      
      await speakWithElevenLabs(
        "Hello! Your ElevenLabs integration is working correctly. This is a test of the voice synthesis API.",
        {
          voice: settings.defaultVoiceId,
          model: settings.defaultModel
        }
      );
      toast.success("Voice test completed successfully!");
    } catch (error) {
      console.error("Error testing ElevenLabs voice:", error);
      toast.error("Failed to test ElevenLabs voice. Check the console for details.");
    } finally {
      setIsPlaying(false);
    }
  };

  const handleTestConnection = async () => {
    if (!settings.apiKey) {
      toast.error("No API key found. Please check your ElevenLabs integration settings.");
      return;
    }

    setIsTesting(true);
    try {
      const success = await testElevenLabsAPI();
      
      if (success) {
        toast.success("ElevenLabs API connection verified successfully!");
      } else {
        toast.error("ElevenLabs API connection test failed. Check your API key.");
      }
    } catch (error) {
      console.error("Error testing ElevenLabs connection:", error);
      toast.error("Connection test encountered an error.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Test ElevenLabs Voice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p>
            {isElevenLabsConnected 
              ? "Your ElevenLabs integration is connected. Click the button below to test the voice synthesis."
              : "ElevenLabs is not connected. Please add your API key in the integration settings."}
          </p>
          {isElevenLabsConnected && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Using voice: {settings.defaultVoiceId === 'EXAVITQu4vr4xnSDxMaL' ? 'Sarah (Default)' : settings.defaultVoiceId} 
                <br />
                Model: {settings.defaultModel || "Default"}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleTestVoice} 
              disabled={!isElevenLabsConnected || isPlaying || isTesting}
              className="w-full"
            >
              {isPlaying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Playing voice...
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Test Voice
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleTestConnection} 
              disabled={!isElevenLabsConnected || isPlaying || isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing connection...
                </>
              ) : (
                "Verify Connection"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsTest;
