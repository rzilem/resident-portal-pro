
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { speakWithElevenLabs } from '@/utils/elevenlabs';

const ElevenLabsTest = () => {
  const { isElevenLabsConnected, settings } = useElevenLabs();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTestVoice = async () => {
    if (!isElevenLabsConnected) {
      toast.error("ElevenLabs is not connected. Please add your API key in the integration settings.");
      return;
    }

    setIsPlaying(true);
    try {
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
                Using voice: {settings.defaultVoiceId || "Default"} 
                <br />
                Model: {settings.defaultModel || "Default"}
              </p>
            </div>
          )}
          <Button 
            onClick={handleTestVoice} 
            disabled={!isElevenLabsConnected || isPlaying}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsTest;
