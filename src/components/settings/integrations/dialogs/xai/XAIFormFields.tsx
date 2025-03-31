
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface XAIFormFieldsProps {
  apiKey: string;
  defaultModel: string;
  organization: string;
  onApiKeyChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onOrganizationChange: (value: string) => void;
}

const XAIFormFields: React.FC<XAIFormFieldsProps> = ({
  apiKey,
  defaultModel,
  organization,
  onApiKeyChange,
  onModelChange,
  onOrganizationChange
}) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="xai-api-key">API Key</Label>
          <Input
            id="xai-api-key"
            type="password"
            placeholder="Enter your X.AI API key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Your API key is stored securely and never shared.
          </p>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="xai-model">Default Model</Label>
          <Select
            value={defaultModel}
            onValueChange={onModelChange}
          >
            <SelectTrigger id="xai-model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grok-1">Grok 1</SelectItem>
              <SelectItem value="grok-1-vision">Grok 1 Vision</SelectItem>
              <SelectItem value="grok-2">Grok 2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The default model to use for X.AI requests.
          </p>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="xai-organization">Organization ID (Optional)</Label>
          <Input
            id="xai-organization"
            type="text"
            placeholder="Enter your X.AI organization ID"
            value={organization}
            onChange={(e) => onOrganizationChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Only required if you belong to multiple organizations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default XAIFormFields;
