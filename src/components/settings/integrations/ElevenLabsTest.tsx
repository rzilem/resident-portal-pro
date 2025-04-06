
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Volume2, Play, Square, Loader2 } from 'lucide-react';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/use-integrations';

const ElevenLabsTest = () => {
  const [text, setText] = useState("Welcome to ResidentPro. I'm your virtual assistant, how can I help you today?");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { 
    isElevenLabsConnected, 
    settings, 
    generateAudio, 
    audioBlob, 
    isLoading 
  } = useElevenLabs();
  const { getIntegration } = useIntegrations();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Update audio URL when blob changes
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Clean up previous URL to avoid memory leaks
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  const handleGenerateSpeech = async () => {
    if (!isElevenLabsConnected) {
      toast.error("Please connect ElevenLabs integration first");
      return;
    }

    if (!text.trim()) {
      toast.error("Please enter some text to convert to speech");
      return;
    }

    try {
      await generateAudio(text);
      toast.success("Speech generated successfully");
      
      // Audio URL will be updated via the useEffect
    } catch (error) {
      console.error("Error generating speech:", error);
      toast.error("Failed to generate speech");
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const integrationDetails = getIntegration('ElevenLabs');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          ElevenLabs Text-to-Speech
        </CardTitle>
        <CardDescription>
          Test your ElevenLabs integration by converting text to speech
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isElevenLabsConnected ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            <p>ElevenLabs integration is not connected. Please configure it in the Integrations tab.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="voice-text">Enter text to convert to speech</Label>
              <Textarea
                id="voice-text"
                placeholder="Type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Voice: {integrationDetails?.defaultVoiceId || 'Default'}</p>
                <p className="text-sm text-muted-foreground">Model: {integrationDetails?.defaultModel || 'eleven_multilingual_v2'}</p>
              </div>
              
              <Button 
                onClick={handleGenerateSpeech} 
                disabled={isLoading || !text.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate Speech"
                )}
              </Button>
            </div>
            
            {audioUrl && (
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying ? "Playing audio..." : "Audio ready to play"}
                  </p>
                </div>
                <audio 
                  ref={audioRef} 
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)} 
                  onError={(e) => {
                    console.error("Audio error:", e);
                    toast.error("Error playing audio");
                  }}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ElevenLabsTest;
