
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CompanyInfoProps {
  handleSettingChange?: (key: string, value: any) => void;
  getSetting?: (key: string, fallback?: any) => any;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ handleSettingChange, getSetting }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Manage your company details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              placeholder="Enter company name" 
              defaultValue={getSetting?.('companyName', '')}
              onChange={(e) => handleSettingChange?.('companyName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / EIN</Label>
            <Input 
              id="taxId" 
              placeholder="XX-XXXXXXX" 
              defaultValue={getSetting?.('taxId', '')}
              onChange={(e) => handleSettingChange?.('taxId', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="(555) 555-5555" 
              defaultValue={getSetting?.('phone', '')}
              onChange={(e) => handleSettingChange?.('phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="contact@company.com" 
              defaultValue={getSetting?.('email', '')}
              onChange={(e) => handleSettingChange?.('email', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea 
            id="address" 
            placeholder="Enter your business address" 
            rows={3}
            defaultValue={getSetting?.('address', '')}
            onChange={(e) => handleSettingChange?.('address', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Company Description</Label>
          <Textarea 
            id="description" 
            placeholder="Brief description of your company" 
            rows={4}
            defaultValue={getSetting?.('description', '')}
            onChange={(e) => handleSettingChange?.('description', e.target.value)}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={() => {
              toast.success("Company information saved successfully");
            }}
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;
