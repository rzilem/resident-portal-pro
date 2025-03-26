
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PrinterIcon, Mail, Ship, Settings } from 'lucide-react';

const PrintQueueSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('printers');
  const [defaultPrinter, setDefaultPrinter] = useState('Main Office Printer');
  const [duplexPrinting, setDuplexPrinting] = useState(true);
  const [certificateEnable, setCertificateEnable] = useState(true);
  const [certifiedMailProvider, setCertifiedMailProvider] = useState('usps');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          Print Queue Settings
        </CardTitle>
        <CardDescription>
          Configure your printing and mailing preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="printers" className="flex items-center gap-2">
              <PrinterIcon className="h-4 w-4" />
              <span>Printers</span>
            </TabsTrigger>
            <TabsTrigger value="mailing" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Mailing</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Ship className="h-4 w-4" />
              <span>Shipping</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="printers">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-printer">Default Printer</Label>
                  <Select value={defaultPrinter} onValueChange={setDefaultPrinter}>
                    <SelectTrigger id="default-printer">
                      <SelectValue placeholder="Select printer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Office Printer">Main Office Printer</SelectItem>
                      <SelectItem value="Office Printer 2">Office Printer 2</SelectItem>
                      <SelectItem value="Production Printer">Production Printer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="duplex-printing">Default to Double-sided Printing</Label>
                  <Switch
                    id="duplex-printing"
                    checked={duplexPrinting}
                    onCheckedChange={setDuplexPrinting}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Connected Printers</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Main Office Printer', status: 'Ready', type: 'HP LaserJet Pro', location: 'Front Office' },
                    { name: 'Office Printer 2', status: 'Low Toner', type: 'Brother MFC', location: 'Back Office' },
                    { name: 'Production Printer', status: 'Ready', type: 'Xerox WorkCentre', location: 'Mail Room' }
                  ].map((printer, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{printer.name}</p>
                        <p className="text-sm text-gray-500">{printer.type} • {printer.location}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          printer.status === 'Ready' ? "bg-green-50 text-green-700 border-green-200" :
                          "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {printer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mailing">
            <div className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label htmlFor="certified-mail" className="font-medium">Enable Certified Mail</Label>
                  <p className="text-sm text-gray-500">Send important documents with delivery tracking and confirmation</p>
                </div>
                <Switch
                  id="certified-mail"
                  checked={certificateEnable}
                  onCheckedChange={setCertificateEnable}
                />
              </div>
              
              {certificateEnable && (
                <div className="space-y-4 p-4 border rounded-md bg-blue-50">
                  <div className="space-y-2">
                    <Label htmlFor="certified-provider">Certified Mail Provider</Label>
                    <Select value={certifiedMailProvider} onValueChange={setCertifiedMailProvider}>
                      <SelectTrigger id="certified-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usps">USPS</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="dhl">DHL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="Enter your account number" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key (if applicable)</Label>
                    <Input id="api-key" type="password" placeholder="Enter API key" />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Default Return Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="return-name">Name/Company</Label>
                      <Input id="return-name" defaultValue="HOA Management Company" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="return-street">Street Address</Label>
                      <Input id="return-street" defaultValue="123 Management Blvd" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="return-city">City</Label>
                      <Input id="return-city" defaultValue="Austin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="return-state">State</Label>
                      <Input id="return-state" defaultValue="TX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="return-zip">ZIP Code</Label>
                      <Input id="return-zip" defaultValue="78701" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping">
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium">Shipping Settings</h3>
                <p className="text-muted-foreground">Configure bulk shipping options for large mailings</p>
                <p className="text-sm text-gray-500">Coming soon</p>
                <Button className="mt-4" variant="outline">Request Early Access</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PrintQueueSettings;
