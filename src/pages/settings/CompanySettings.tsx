
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoUploader from '@/components/settings/LogoUploader';
import { Building, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/hooks/use-settings';

const CompanySettings = () => {
  const { settings, updateSettings } = useSettings();
  
  const handleSaveCompanyInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const companyData = {
      name: formData.get('companyName') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
    };
    
    updateSettings('company', companyData);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Company Settings</h1>
      
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="email-settings">Email Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding" className="space-y-6">
          <LogoUploader />
          
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the color scheme to match your company branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="primaryColor" className="block text-sm font-medium">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      className="h-10 w-10 rounded-md border cursor-pointer"
                      defaultValue="#0072CE"
                    />
                    <Input
                      placeholder="#0072CE"
                      className="w-32"
                      defaultValue="#0072CE"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="secondaryColor" className="block text-sm font-medium">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      className="h-10 w-10 rounded-md border cursor-pointer"
                      defaultValue="#FF4D4F"
                    />
                    <Input
                      placeholder="#FF4D4F"
                      className="w-32"
                      defaultValue="#FF4D4F"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Colors</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company-info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details that will be displayed on reports and communications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompanyInfo} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="block text-sm font-medium">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        name="companyName"
                        className="pl-10"
                        defaultValue={settings.company?.name || ''}
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        name="address"
                        className="pl-10 min-h-[80px]"
                        defaultValue={settings.company?.address || ''}
                        placeholder="Street Address"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium">
                        City
                      </label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={settings.company?.city || ''}
                        placeholder="City"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium">
                        State
                      </label>
                      <Input
                        id="state"
                        name="state"
                        defaultValue={settings.company?.state || ''}
                        placeholder="State"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="block text-sm font-medium">
                        Zip Code
                      </label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        defaultValue={settings.company?.zipCode || ''}
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        className="pl-10"
                        defaultValue={settings.company?.phone || ''}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="pl-10"
                        defaultValue={settings.company?.email || ''}
                        placeholder="contact@yourcompany.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="website" className="block text-sm font-medium">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        name="website"
                        className="pl-10"
                        defaultValue={settings.company?.website || ''}
                        placeholder="https://www.yourcompany.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Company Information</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email-settings">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email settings for outgoing communications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="defaultEmail" className="block text-sm font-medium">
                  Default Sender Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="defaultEmail"
                    className="pl-10"
                    defaultValue={settings.email?.defaultSender || ''}
                    placeholder="no-reply@yourcompany.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="emailSignature" className="block text-sm font-medium">
                  Default Email Signature
                </label>
                <Textarea
                  id="emailSignature"
                  className="min-h-[120px]"
                  defaultValue={settings.email?.signature || ''}
                  placeholder="Your default email signature"
                />
              </div>
              
              <div className="flex justify-end">
                <Button>Save Email Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanySettings;
