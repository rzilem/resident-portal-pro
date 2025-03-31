
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VOICE_OPTIONS } from '@/utils/elevenlabs';

interface ElevenLabsFormFieldsProps {
  apiKey: string;
  defaultVoiceId: string;
  defaultModel: string;
  onApiKeyChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

const ElevenLabsFormFields: React.FC<ElevenLabsFormFieldsProps> = ({
  apiKey,
  defaultVoiceId,
  defaultModel,
  onApiKeyChange,
  onVoiceChange,
  onModelChange
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="api-key">API Key</Label>
        <Input
          id="api-key"
          type="password"
          placeholder="Enter your ElevenLabs API key"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Find your API key in the ElevenLabs dashboard under Profile &gt; API Key
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="default-voice">Default Voice</Label>
        <Select 
          value={defaultVoiceId}
          onValueChange={onVoiceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a default voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={VOICE_OPTIONS.ARIA}>Aria (Female, Professional)</SelectItem>
            <SelectItem value={VOICE_OPTIONS.ROGER}>Roger (Male, Authoritative)</SelectItem>
            <SelectItem value={VOICE_OPTIONS.SARAH}>Sarah (Female, Friendly)</SelectItem>
            <SelectItem value={VOICE_OPTIONS.DANIEL}>Daniel (Male, Conversational)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="default-model">Default Model</Label>
        <Select 
          value={defaultModel}
          onValueChange={onModelChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a default model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eleven_turbo_v2">Eleven Turbo v2 (Faster)</SelectItem>
            <SelectItem value="eleven_multilingual_v2">Eleven Multilingual v2 (Higher Quality)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Turbo is faster and cheaper, while Multilingual offers higher quality
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsFormFields;
