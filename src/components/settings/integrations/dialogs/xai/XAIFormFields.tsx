
import React from 'react';
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
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input 
          id="apiKey" 
          placeholder="Enter your X.AI API key" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Your X.AI API key will be securely stored and used for AI generations.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Default Model</Label>
        <Select 
          value={defaultModel} 
          onValueChange={setDefaultModel}
          defaultValue="grok-1"
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grok-1">Grok-1</SelectItem>
            <SelectItem value="grok-1-mini">Grok-1 Mini</SelectItem>
            <SelectItem value="grok-2">Grok-2</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The default model to use for AI generations.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="organization">Organization ID (Optional)</Label>
        <Input 
          id="organization" 
          placeholder="Enter your organization ID" 
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          If you're using an organizational account, enter your organization ID.
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
