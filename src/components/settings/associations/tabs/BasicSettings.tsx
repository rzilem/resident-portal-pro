
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Association } from '../types';

interface BasicSettingsProps {
  activeAssociation: Association;
  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>;
  setActiveAssociation: React.Dispatch<React.SetStateAction<Association>>;
  handleSettingChange: (settingName: string, value: any) => void;
  getSetting: (key: string, fallback?: any) => any;
}

const BasicSettings = ({ 
  activeAssociation, 
  setAssociations,
  setActiveAssociation,
  handleSettingChange, 
  getSetting 
}: BasicSettingsProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="association-name">Association Name</Label>
            <Input 
              id="association-name" 
              value={activeAssociation.name}
              onChange={(e) => {
                const updatedAssociations = setAssociations(prev => 
                  prev.map(a => 
                    a.id === activeAssociation.id ? { ...a, name: e.target.value } : a
                  )
                );
                setActiveAssociation({...activeAssociation, name: e.target.value});
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="association-code">Association Code</Label>
            <Input 
              id="association-code" 
              value={getSetting('code', 'ASHOA')}
              onChange={(e) => handleSettingChange('code', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={getSetting('timezone', 'America/New_York')}
              onValueChange={(value) => handleSettingChange('timezone', value)}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primary-language">Primary Language</Label>
            <Select
              value={getSetting('primaryLanguage', 'en')}
              onValueChange={(value) => handleSettingChange('primaryLanguage', value)}
            >
              <SelectTrigger id="primary-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Location Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={activeAssociation.address}
              onChange={(e) => {
                setAssociations(prev => 
                  prev.map(a => 
                    a.id === activeAssociation.id ? { ...a, address: e.target.value } : a
                  )
                );
                setActiveAssociation({...activeAssociation, address: e.target.value});
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city-state-zip">City, State, ZIP</Label>
            <Input 
              id="city-state-zip" 
              value={getSetting('cityStateZip', 'Los Angeles, CA 90001')}
              onChange={(e) => handleSettingChange('cityStateZip', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={getSetting('country', 'US')}
              onValueChange={(value) => handleSettingChange('country', value)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input 
              id="contact-email" 
              type="email"
              value={getSetting('contactEmail', 'info@sunsetheights.org')}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Contact Phone</Label>
            <Input 
              id="contact-phone" 
              value={getSetting('contactPhone', '(555) 123-4567')}
              onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={getSetting('website', 'https://www.sunsetheights.org')}
              onChange={(e) => handleSettingChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSettings;
