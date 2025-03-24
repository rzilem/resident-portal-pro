
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface DocumentSettingsProps {
  handleSettingChange: (settingName: string, value: any) => void;
  getSetting: (key: string, fallback?: any) => any;
}

const DocumentSettings = ({ handleSettingChange, getSetting }: DocumentSettingsProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Document Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-governing-docs">Require Governing Documents</Label>
              <Switch 
                id="require-governing-docs"
                checked={getSetting('requireGoverningDocs', true)}
                onCheckedChange={(checked) => handleSettingChange('requireGoverningDocs', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-doc-esign">Enable Electronic Document Signing</Label>
              <Switch 
                id="enable-doc-esign"
                checked={getSetting('enableDocEsign', true)}
                onCheckedChange={(checked) => handleSettingChange('enableDocEsign', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doc-retention-period">Document Retention Period (Years)</Label>
            <Input 
              id="doc-retention-period"
              type="number"
              value={getSetting('docRetentionPeriod', '7')}
              onChange={(e) => handleSettingChange('docRetentionPeriod', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Required Documents</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-bylaws">Bylaws</Label>
              <Switch 
                id="require-bylaws"
                checked={getSetting('requireBylaws', true)}
                onCheckedChange={(checked) => handleSettingChange('requireBylaws', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-cc-and-r">CC&R (Covenants, Conditions & Restrictions)</Label>
              <Switch 
                id="require-cc-and-r"
                checked={getSetting('requireCCAndR', true)}
                onCheckedChange={(checked) => handleSettingChange('requireCCAndR', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-articles">Articles of Incorporation</Label>
              <Switch 
                id="require-articles"
                checked={getSetting('requireArticles', true)}
                onCheckedChange={(checked) => handleSettingChange('requireArticles', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-rules">Rules and Regulations</Label>
              <Switch 
                id="require-rules"
                checked={getSetting('requireRules', true)}
                onCheckedChange={(checked) => handleSettingChange('requireRules', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-budget">Annual Budget</Label>
              <Switch 
                id="require-budget"
                checked={getSetting('requireBudget', true)}
                onCheckedChange={(checked) => handleSettingChange('requireBudget', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
