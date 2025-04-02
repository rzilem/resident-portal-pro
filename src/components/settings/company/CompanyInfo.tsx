
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCompanySettings } from '@/hooks/use-company-settings';

const CompanyInfo: React.FC = () => {
  const { 
    settings, 
    isLoading, 
    updateSetting, 
    getSetting 
  } = useCompanySettings();

  const handleUpdateSetting = (key: string, value: any) => {
    updateSetting(key, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Company information saved successfully");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Loading company details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">Loading company information...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Manage your company details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                placeholder="Enter company name" 
                defaultValue={getSetting('companyName')}
                onChange={(e) => handleUpdateSetting('companyName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input 
                id="taxId" 
                placeholder="XX-XXXXXXX" 
                defaultValue={settings.taxId || ''}
                onChange={(e) => handleUpdateSetting('taxId', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(555) 555-5555" 
                defaultValue={settings.phone || ''}
                onChange={(e) => handleUpdateSetting('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="contact@company.com" 
                defaultValue={settings.email || ''}
                onChange={(e) => handleUpdateSetting('email', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea 
              id="address" 
              placeholder="Enter your business address" 
              rows={3}
              defaultValue={settings.address || ''}
              onChange={(e) => handleUpdateSetting('address', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea 
              id="description" 
              placeholder="Brief description of your company" 
              rows={4}
              defaultValue={settings.description || ''}
              onChange={(e) => handleUpdateSetting('description', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;
