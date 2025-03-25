
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Association } from '../types';
import { toast } from 'sonner';

interface BasicSettingsProps {
  activeAssociation: Association;
  handleSettingChange: (settingName: string, value: any) => Promise<void>;
  getSetting: (key: string, fallback?: any) => any;
  updateAssociation: (id: string, updates: Partial<Association>) => Promise<Association>;
}

const BasicSettings = ({ 
  activeAssociation, 
  handleSettingChange, 
  getSetting,
  updateAssociation
}: BasicSettingsProps) => {
  
  const handleAssociationFieldChange = async (field: string, value: any) => {
    try {
      await updateAssociation(activeAssociation.id, { [field]: value });
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
    }
  };
  
  const handleAddressChange = async (field: keyof Association['address'], value: string) => {
    try {
      await updateAssociation(activeAssociation.id, { 
        address: { 
          ...activeAssociation.address, 
          [field]: value 
        } 
      });
      toast.success(`Address ${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update address ${field}`);
    }
  };
  
  const handleContactInfoChange = async (field: keyof Association['contactInfo'], value: string) => {
    try {
      await updateAssociation(activeAssociation.id, { 
        contactInfo: { 
          ...activeAssociation.contactInfo, 
          [field]: value 
        } 
      });
      toast.success(`Contact ${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update contact ${field}`);
    }
  };
  
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
              onChange={(e) => handleAssociationFieldChange('name', e.target.value)}
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
            <Label htmlFor="address">Street Address</Label>
            <Input 
              id="address" 
              value={activeAssociation.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              value={activeAssociation.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              value={activeAssociation.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input 
              id="zipCode" 
              value={activeAssociation.address.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={activeAssociation.address.country}
              onValueChange={(value) => handleAddressChange('country', value)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USA">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Mexico">Mexico</SelectItem>
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
              value={activeAssociation.contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Contact Phone</Label>
            <Input 
              id="contact-phone" 
              value={activeAssociation.contactInfo.phone}
              onChange={(e) => handleContactInfoChange('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={activeAssociation.contactInfo.website || ''}
              onChange={(e) => handleContactInfoChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSettings;
