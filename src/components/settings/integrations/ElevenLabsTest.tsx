
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Volume2, Play, Square, Loader2, Info } from 'lucide-react';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { generateSpeech, playAudioBlob, VOICE_OPTIONS } from '@/utils/elevenlabs';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/use-integrations';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ElevenLabsTest = () => {
  const [text, setText] = useState("Welcome to ResidentPro. I'm your virtual assistant, how can I help you today?");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isElevenLabsConnected, settings } = useElevenLabs();
  const { getIntegration } = useIntegrations();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);

  // Listen for logs and capture them for display
  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      if (typeof args[0] === 'string' && args[0].includes('ElevenLabs')) {
        setTestLog(prev => [...prev, args.join(' ')]);
      }
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const handleGenerateSpeech = async () => {
    if (!isElevenLabsConnected) {
      toast.error("Please connect ElevenLabs integration first");
      return;
    }

    if (!text.trim()) {
      toast.error("Please enter some text to convert to speech");
      return;
    }

    setIsGenerating(true);
    setTestLog([]);
    
    try {
      const integrationDetails = getIntegration('ElevenLabs');
      
      // Log attempt
      setTestLog(prev => [...prev, `Attempting to generate speech with: ${integrationDetails?.apiKey ? 'API Key Present' : 'No API Key'}`]);
      
      // For testing purposes, we'll use a simulated API response
      // In a real implementation, this would use the actual API key from integrationDetails
      const mockApiKey = integrationDetails?.apiKey || 'test-api-key';
      const voiceId = integrationDetails?.defaultVoiceId || settings.defaultVoiceId;
      const model = integrationDetails?.defaultModel || settings.defaultModel;
      
      setTestLog(prev => [...prev, `Using voice: ${voiceId}, model: ${model}`]);
      
      // Generate speech
      const audioBlob = await generateSpeech(text, mockApiKey, {
        voiceId,
        model
      });
      
      if (!audioBlob) {
        throw new Error("Failed to generate speech");
      }
      
      // Create a URL for the audio blob
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setTestLog(prev => [...prev, `Speech generated successfully, URL created`]);
      
      toast.success("Speech generated successfully");
      
      // Set up the audio element
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onplay = () => {
          setIsPlaying(true);
          setTestLog(prev => [...prev, `Audio playback started`]);
        };
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setTestLog(prev => [...prev, `Audio playback completed`]);
        };
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      setTestLog(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
      toast.error("Failed to generate speech");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setTestLog(prev => [...prev, `Audio playback paused`]);
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        setTestLog(prev => [...prev, `Error playing audio: ${error.message}`]);
        toast.error("Failed to play audio");
      });
    }
  };

  const integrationDetails = getIntegration('ElevenLabs');

  return (
    <Card className="overflow-hidden">
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
                <p className="text-sm font-medium">Voice: {integrationDetails?.defaultVoiceId ? 
                  Object.entries(VOICE_OPTIONS).find(([name, id]) => id === integrationDetails.defaultVoiceId)?.[0] || 'Custom' : 
                  'Default'}</p>
                <p className="text-sm text-muted-foreground">Model: {integrationDetails?.defaultModel || 'eleven_multilingual_v2'}</p>
              </div>
              
              <Button 
                onClick={handleGenerateSpeech} 
                disabled={isGenerating || !text.trim()}
              >
                {isGenerating ? (
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
                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>
            )}
            
            {testLog.length > 0 && (
              <div className="mt-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <details>
                      <summary className="cursor-pointer font-medium">Test Log (click to expand)</summary>
                      <div className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                        {testLog.map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ElevenLabsTest;
