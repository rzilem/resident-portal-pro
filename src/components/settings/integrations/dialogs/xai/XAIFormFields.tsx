
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import XAIActions from './XAIActions';

interface XAIFormFieldsProps {
  apiKey: string;
  defaultModel: string;
  organization: string;
  isTesting: boolean;
  isLoading: boolean;
  setApiKey: (value: string) => void;
  setDefaultModel: (value: string) => void;
  setOrganization: (value: string) => void;
  handleSave: () => void;
  handleTest: () => void;
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
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="xai-api-key">API Key</Label>
          <Input
            id="xai-api-key"
            type="password"
            placeholder="Enter your X.AI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your X.AI API key will be stored securely
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="xai-default-model">Default Model</Label>
          <Select 
            value={defaultModel}
            onValueChange={setDefaultModel}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a default model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grok-2">Grok-2 (Latest)</SelectItem>
              <SelectItem value="grok-1.5">Grok-1.5</SelectItem>
              <SelectItem value="grok-1">Grok-1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="xai-organization">Organization ID (Optional)</Label>
          <Input
            id="xai-organization"
            type="text"
            placeholder="Enter your organization ID"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Only required for enterprise customers with multiple organizations
          </p>
        </div>
      </div>
      
      <XAIActions
        onCancel={onCancel}
        onTest={handleTest}
        onSave={handleSave}
        isLoading={isLoading}
        isTesting={isTesting}
        apiKey={apiKey}
      />
    </>
  );
};

export default XAIFormFields;
