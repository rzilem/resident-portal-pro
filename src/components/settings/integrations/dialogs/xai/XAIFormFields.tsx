
import React, { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface XAIFormFieldsProps {
  apiKey: string;
  defaultModel: string;
  organization: string;
  isTesting: boolean;
  isLoading: boolean;
  setApiKey: (value: string) => void;
  setDefaultModel: (value: string) => void;
  setOrganization: (value: string) => void;
  handleSave: () => Promise<void>;
  handleTest: () => Promise<void>;
  onCancel: () => void;
}

const XAIFormFields: React.FC<XAIFormFieldsProps> = ({
  apiKey,
  defaultModel,
  organization,
  isTesting,
  isLoading,
  setApiKey,
  setDefaultModel,
  setOrganization,
  handleSave,
  handleTest,
  onCancel
}) => {
  console.log("Rendering XAIFormFields with model:", defaultModel);
  const apiKeyInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the API key input when the form mounts
  useEffect(() => {
    if (apiKeyInputRef.current) {
      setTimeout(() => {
        apiKeyInputRef.current?.focus();
      }, 100);
    }
  }, []);
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("API key change event triggered:", e.target.value);
    setApiKey(e.target.value);
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Organization change event triggered:", e.target.value);
    setOrganization(e.target.value);
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input 
          id="apiKey" 
          ref={apiKeyInputRef}
          type="text"
          placeholder="Enter your X.AI API key (e.g., xai_abc123)" 
          value={apiKey}
          onChange={handleApiKeyChange}
          autoComplete="off"
          className="bg-background focus:ring-offset-background border-input"
          required
        />
        <p className="text-xs text-muted-foreground">
          Obtain your API key from console.x.ai and paste it here.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Default Model</Label>
        <Select 
          value={defaultModel} 
          onValueChange={setDefaultModel}
          defaultValue="grok-2"
        >
          <SelectTrigger id="model" className="w-full bg-background">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="grok-1">Grok-1</SelectItem>
            <SelectItem value="grok-1-mini">Grok-1 Mini</SelectItem>
            <SelectItem value="grok-2">Grok-2</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select the X.AI model for your application (Grok-2 recommended).
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="organization">Organization ID (Optional)</Label>
        <Input 
          id="organization" 
          type="text"
          placeholder="Enter your organization ID" 
          value={organization}
          onChange={handleOrganizationChange}
          autoComplete="off"
          className="bg-background focus:ring-offset-background border-input"
        />
        <p className="text-xs text-muted-foreground">
          Required only for organizational X.AI accounts.
        </p>
      </div>
      
      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading || isTesting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleTest}
            disabled={!apiKey || isLoading || isTesting}
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        </div>
        
        <Button 
          type="button" 
          onClick={handleSave}
          disabled={!apiKey || isLoading || isTesting}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
};

export default XAIFormFields;
