
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Building, Edit, Trash2, Plus, Users, Settings, FileText, Mail, Bell, Calendar, LucideIcon, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Association {
  id: string;
  name: string;
  units: number;
  address: string;
  isActive: boolean;
  isDefault: boolean;
  settings?: Record<string, any>;
}

type SettingSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

const AssociationSettings = () => {
  const [associations, setAssociations] = useState<Association[]>([
    { 
      id: '1', 
      name: 'Sunset Heights HOA', 
      units: 48, 
      address: '123 Sunset Blvd, Los Angeles, CA', 
      isActive: true, 
      isDefault: true,
      settings: {
        timezone: 'America/Los_Angeles',
        fiscalYearStart: '01/01',
        lateFeeAmount: 25,
        lateFeeType: 'fixed',
        currencySymbol: '$',
        allowOnlinePayments: true,
        sendAutomaticReminders: true,
        requireVoterRegistration: false,
      }
    },
    { id: '2', name: 'Ocean View Condos', units: 120, address: '456 Ocean Dr, Miami, FL', isActive: true, isDefault: false },
    { id: '3', name: 'Mountain Valley Association', units: 75, address: '789 Valley Rd, Denver, CO', isActive: false, isDefault: false },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    units: '',
    address: ''
  });
  
  const [activeAssociation, setActiveAssociation] = useState<Association>(associations[0]);
  const [activeSettingsTab, setActiveSettingsTab] = useState('basic');
  
  // Define all the setting sections
  const settingSections: SettingSection[] = [
    { id: 'basic', title: 'Basic Settings', icon: Settings, description: 'Association name, address, and general information' },
    { id: 'financial', title: 'Financial Settings', icon: DollarSign, description: 'Payment options, late fees, and fiscal year configuration' },
    { id: 'documents', title: 'Documents', icon: FileText, description: 'Document requirements and management' },
    { id: 'communications', title: 'Communications', icon: Mail, description: 'Email templates and notification settings' },
    { id: 'meetings', title: 'Meetings', icon: Calendar, description: 'Meeting rules and voting configurations' },
    { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Notification preferences and channels' },
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const openNewAssociationDialog = () => {
    setEditingAssociation(null);
    setFormData({ name: '', units: '', address: '' });
    setDialogOpen(true);
  };
  
  const openEditDialog = (association: Association) => {
    setEditingAssociation(association);
    setFormData({ 
      name: association.name, 
      units: association.units.toString(), 
      address: association.address 
    });
    setDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.units || !formData.address) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingAssociation) {
      // Update existing association
      const updatedAssociations = associations.map(a => 
        a.id === editingAssociation.id 
          ? { 
              ...a, 
              name: formData.name, 
              units: parseInt(formData.units), 
              address: formData.address 
            } 
          : a
      );
      setAssociations(updatedAssociations);
      toast.success("Association updated successfully");
    } else {
      // Add new association
      const newAssociation: Association = {
        id: Date.now().toString(),
        name: formData.name,
        units: parseInt(formData.units),
        address: formData.address,
        isActive: true,
        isDefault: associations.length === 0 // First association is default
      };
      setAssociations([...associations, newAssociation]);
      toast.success("Association added successfully");
    }
    
    setDialogOpen(false);
  };
  
  const toggleAssociationStatus = (id: string) => {
    const updatedAssociations = associations.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    setAssociations(updatedAssociations);
    
    const association = associations.find(a => a.id === id);
    toast.success(`${association?.name} ${association?.isActive ? 'deactivated' : 'activated'}`);
  };
  
  const setAsDefault = (id: string) => {
    const updatedAssociations = associations.map(a => 
      ({ ...a, isDefault: a.id === id })
    );
    setAssociations(updatedAssociations);
    
    const association = associations.find(a => a.id === id);
    toast.success(`${association?.name} set as default`);
  };
  
  const deleteAssociation = (id: string) => {
    const association = associations.find(a => a.id === id);
    
    if (association?.isDefault) {
      toast.error("Cannot delete the default association");
      return;
    }
    
    const updatedAssociations = associations.filter(a => a.id !== id);
    setAssociations(updatedAssociations);
    toast.success(`${association?.name} deleted`);
  };
  
  const handleSettingChange = (settingName: string, value: any) => {
    if (!activeAssociation) return;
    
    const updatedAssociations = associations.map(assoc => 
      assoc.id === activeAssociation.id 
        ? { 
            ...assoc, 
            settings: { 
              ...(assoc.settings || {}), 
              [settingName]: value 
            } 
          } 
        : assoc
    );
    
    setAssociations(updatedAssociations);
    
    // Update activeAssociation
    const updatedActiveAssociation = updatedAssociations.find(a => a.id === activeAssociation.id);
    if (updatedActiveAssociation) {
      setActiveAssociation(updatedActiveAssociation);
    }
    
    toast.success(`Setting updated successfully`);
  };
  
  const selectAssociation = (association: Association) => {
    setActiveAssociation(association);
  };

  // Helper function to get setting value with fallback
  const getSetting = (key: string, fallback: any = '') => {
    return activeAssociation?.settings?.[key] ?? fallback;
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Associations</CardTitle>
            <CardDescription>Add, edit or remove property associations</CardDescription>
          </div>
          <Button onClick={openNewAssociationDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Association
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Association Name</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associations.map((association) => (
                <TableRow key={association.id} className={association.id === activeAssociation?.id ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {association.name}
                    </div>
                  </TableCell>
                  <TableCell>{association.units}</TableCell>
                  <TableCell className="hidden md:table-cell">{association.address}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={association.isActive} 
                      onCheckedChange={() => toggleAssociationStatus(association.id)} 
                    />
                  </TableCell>
                  <TableCell>
                    {association.isDefault ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAsDefault(association.id)}
                      >
                        Set Default
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => selectAssociation(association)}
                      >
                        Configure
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(association)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteAssociation(association.id)}
                            disabled={association.isDefault}
                            className={association.isDefault ? "text-muted-foreground" : "text-destructive"}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {activeAssociation && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Configure Association: {activeAssociation.name}</CardTitle>
                <CardDescription>Manage settings for this association</CardDescription>
              </div>
              <Select 
                value={activeAssociation.id} 
                onValueChange={(value) => {
                  const selected = associations.find(a => a.id === value);
                  if (selected) selectAssociation(selected);
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select association" />
                </SelectTrigger>
                <SelectContent>
                  {associations.map(association => (
                    <SelectItem key={association.id} value={association.id}>
                      {association.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                {settingSections.map(section => (
                  <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{section.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="basic">
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
                            const updatedAssociations = associations.map(a => 
                              a.id === activeAssociation.id ? { ...a, name: e.target.value } : a
                            );
                            setAssociations(updatedAssociations);
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
                            const updatedAssociations = associations.map(a => 
                              a.id === activeAssociation.id ? { ...a, address: e.target.value } : a
                            );
                            setAssociations(updatedAssociations);
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
              </TabsContent>
              
              <TabsContent value="financial">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Fiscal Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fiscal-year-start">Fiscal Year Start (MM/DD)</Label>
                        <Input 
                          id="fiscal-year-start"
                          value={getSetting('fiscalYearStart', '01/01')}
                          onChange={(e) => handleSettingChange('fiscalYearStart', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={getSetting('currency', 'USD')}
                          onValueChange={(value) => handleSettingChange('currency', value)}
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency-symbol">Currency Symbol</Label>
                        <Input 
                          id="currency-symbol"
                          value={getSetting('currencySymbol', '$')}
                          onChange={(e) => handleSettingChange('currencySymbol', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="due-day">Monthly Due Day</Label>
                        <Select
                          value={getSetting('dueDay', '1')}
                          onValueChange={(value) => handleSettingChange('dueDay', value)}
                        >
                          <SelectTrigger id="due-day">
                            <SelectValue placeholder="Select due day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                              <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Payment Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allow-online-payments">Allow Online Payments</Label>
                          <Switch 
                            id="allow-online-payments"
                            checked={getSetting('allowOnlinePayments', true)}
                            onCheckedChange={(checked) => handleSettingChange('allowOnlinePayments', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allow-autopay">Allow AutoPay Enrollment</Label>
                          <Switch 
                            id="allow-autopay"
                            checked={getSetting('allowAutopay', true)}
                            onCheckedChange={(checked) => handleSettingChange('allowAutopay', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="charge-convenience-fee">Charge Convenience Fee</Label>
                          <Switch 
                            id="charge-convenience-fee"
                            checked={getSetting('chargeConvenienceFee', false)}
                            onCheckedChange={(checked) => handleSettingChange('chargeConvenienceFee', checked)}
                          />
                        </div>
                      </div>
                      
                      {getSetting('chargeConvenienceFee', false) && (
                        <div className="space-y-2">
                          <Label htmlFor="convenience-fee">Convenience Fee (%)</Label>
                          <Input 
                            id="convenience-fee"
                            type="number"
                            value={getSetting('convenienceFee', '3.0')}
                            onChange={(e) => handleSettingChange('convenienceFee', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Late Fee Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-late-fees">Enable Late Fees</Label>
                          <Switch 
                            id="enable-late-fees"
                            checked={getSetting('enableLateFees', true)}
                            onCheckedChange={(checked) => handleSettingChange('enableLateFees', checked)}
                          />
                        </div>
                      </div>
                      
                      {getSetting('enableLateFees', true) && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="late-fee-type">Late Fee Type</Label>
                            <Select
                              value={getSetting('lateFeeType', 'fixed')}
                              onValueChange={(value) => handleSettingChange('lateFeeType', value)}
                            >
                              <SelectTrigger id="late-fee-type">
                                <SelectValue placeholder="Select late fee type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="late-fee-amount">
                              {getSetting('lateFeeType', 'fixed') === 'fixed' 
                                ? 'Late Fee Amount' 
                                : 'Late Fee Percentage'}
                            </Label>
                            <div className="flex">
                              {getSetting('lateFeeType', 'fixed') === 'fixed' && (
                                <span className="flex items-center bg-muted px-3 rounded-l-md border-y border-l border-input">
                                  {getSetting('currencySymbol', '$')}
                                </span>
                              )}
                              <Input 
                                id="late-fee-amount"
                                type="number"
                                className={getSetting('lateFeeType', 'fixed') === 'fixed' ? "rounded-l-none" : ""}
                                value={getSetting('lateFeeAmount', '25')}
                                onChange={(e) => handleSettingChange('lateFeeAmount', e.target.value)}
                              />
                              {getSetting('lateFeeType', 'fixed') === 'percentage' && (
                                <span className="flex items-center bg-muted px-3 rounded-r-md border-y border-r border-input">
                                  %
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="late-fee-grace-days">Grace Period (Days)</Label>
                            <Input 
                              id="late-fee-grace-days"
                              type="number"
                              value={getSetting('lateFeeGraceDays', '10')}
                              onChange={(e) => handleSettingChange('lateFeeGraceDays', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="compound-late-fees">Compound Late Fees Monthly</Label>
                              <Switch 
                                id="compound-late-fees"
                                checked={getSetting('compoundLateFees', false)}
                                onCheckedChange={(checked) => handleSettingChange('compoundLateFees', checked)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
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
              </TabsContent>
              
              <TabsContent value="communications">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Email Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-from-name">Email From Name</Label>
                        <Input 
                          id="email-from-name"
                          value={getSetting('emailFromName', activeAssociation.name)}
                          onChange={(e) => handleSettingChange('emailFromName', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-from-address">Email From Address</Label>
                        <Input 
                          id="email-from-address"
                          type="email"
                          value={getSetting('emailFromAddress', `info@${activeAssociation.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`)}
                          onChange={(e) => handleSettingChange('emailFromAddress', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-reply-to">Email Reply-To</Label>
                        <Input 
                          id="email-reply-to"
                          type="email"
                          value={getSetting('emailReplyTo', `support@${activeAssociation.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`)}
                          onChange={(e) => handleSettingChange('emailReplyTo', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-logo-in-emails">Include Logo in Emails</Label>
                          <Switch 
                            id="include-logo-in-emails"
                            checked={getSetting('includeLogoInEmails', true)}
                            onCheckedChange={(checked) => handleSettingChange('includeLogoInEmails', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Automated Communications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="send-payment-reminders">Send Payment Reminders</Label>
                          <Switch 
                            id="send-payment-reminders"
                            checked={getSetting('sendPaymentReminders', true)}
                            onCheckedChange={(checked) => handleSettingChange('sendPaymentReminders', checked)}
                          />
                        </div>
                      </div>
                      
                      {getSetting('sendPaymentReminders', true) && (
                        <div className="space-y-2">
                          <Label htmlFor="payment-reminder-days">Days Before Due Date</Label>
                          <Input 
                            id="payment-reminder-days"
                            type="number"
                            value={getSetting('paymentReminderDays', '7')}
                            onChange={(e) => handleSettingChange('paymentReminderDays', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="send-late-notices">Send Late Payment Notices</Label>
                          <Switch 
                            id="send-late-notices"
                            checked={getSetting('sendLateNotices', true)}
                            onCheckedChange={(checked) => handleSettingChange('sendLateNotices', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="send-violation-notices">Send Violation Notices</Label>
                          <Switch 
                            id="send-violation-notices"
                            checked={getSetting('sendViolationNotices', true)}
                            onCheckedChange={(checked) => handleSettingChange('sendViolationNotices', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="send-meeting-notices">Send Meeting Notices</Label>
                          <Switch 
                            id="send-meeting-notices"
                            checked={getSetting('sendMeetingNotices', true)}
                            onCheckedChange={(checked) => handleSettingChange('sendMeetingNotices', checked)}
                          />
                        </div>
                      </div>
                      
                      {getSetting('sendMeetingNotices', true) && (
                        <div className="space-y-2">
                          <Label htmlFor="meeting-notice-days">Days Before Meeting</Label>
                          <Input 
                            id="meeting-notice-days"
                            type="number"
                            value={getSetting('meetingNoticeDays', '14')}
                            onChange={(e) => handleSettingChange('meetingNoticeDays', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="meetings">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Meeting Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annual-meeting-month">Annual Meeting Month</Label>
                        <Select
                          value={getSetting('annualMeetingMonth', '1')}
                          onValueChange={(value) => handleSettingChange('annualMeetingMonth', value)}
                        >
                          <SelectTrigger id="annual-meeting-month">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="board-meeting-frequency">Board Meeting Frequency</Label>
                        <Select
                          value={getSetting('boardMeetingFrequency', 'monthly')}
                          onValueChange={(value) => handleSettingChange('boardMeetingFrequency', value)}
                        >
                          <SelectTrigger id="board-meeting-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allow-virtual-meetings">Allow Virtual Meetings</Label>
                          <Switch 
                            id="allow-virtual-meetings"
                            checked={getSetting('allowVirtualMeetings', true)}
                            onCheckedChange={(checked) => handleSettingChange('allowVirtualMeetings', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="record-meetings">Record Meetings</Label>
                          <Switch 
                            id="record-meetings"
                            checked={getSetting('recordMeetings', true)}
                            onCheckedChange={(checked) => handleSettingChange('recordMeetings', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Voting Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-electronic-voting">Enable Electronic Voting</Label>
                          <Switch 
                            id="enable-electronic-voting"
                            checked={getSetting('enableElectronicVoting', true)}
                            onCheckedChange={(checked) => handleSettingChange('enableElectronicVoting', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allow-proxy-voting">Allow Proxy Voting</Label>
                          <Switch 
                            id="allow-proxy-voting"
                            checked={getSetting('allowProxyVoting', true)}
                            onCheckedChange={(checked) => handleSettingChange('allowProxyVoting', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quorum-percentage">Quorum Percentage</Label>
                        <div className="flex">
                          <Input 
                            id="quorum-percentage"
                            type="number"
                            value={getSetting('quorumPercentage', '50')}
                            onChange={(e) => handleSettingChange('quorumPercentage', e.target.value)}
                          />
                          <span className="flex items-center bg-muted px-3 rounded-r-md border-y border-r border-input">
                            %
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="require-voter-registration">Require Voter Registration</Label>
                          <Switch 
                            id="require-voter-registration"
                            checked={getSetting('requireVoterRegistration', false)}
                            onCheckedChange={(checked) => handleSettingChange('requireVoterRegistration', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Notification Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="notification-method">Default Notification Method</Label>
                        <Select
                          value={getSetting('notificationMethod', 'email')}
                          onValueChange={(value) => handleSettingChange('notificationMethod', value)}
                        >
                          <SelectTrigger id="notification-method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="push">Push Notification</SelectItem>
                            <SelectItem value="both">Email & SMS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allow-residents-to-opt-out">Allow Residents to Opt Out</Label>
                          <Switch 
                            id="allow-residents-to-opt-out"
                            checked={getSetting('allowResidentsToOptOut', true)}
                            onCheckedChange={(checked) => handleSettingChange('allowResidentsToOptOut', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="send-weekly-digest">Send Weekly Digest</Label>
                          <Switch 
                            id="send-weekly-digest"
                            checked={getSetting('sendWeeklyDigest', true)}
                            onCheckedChange={(checked) => handleSettingChange('sendWeeklyDigest', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-new-documents">New Documents</Label>
                          <Switch 
                            id="notify-new-documents"
                            checked={getSetting('notifyNewDocuments', true)}
                            onCheckedChange={(checked) => handleSettingChange('notifyNewDocuments', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-announcements">Community Announcements</Label>
                          <Switch 
                            id="notify-announcements"
                            checked={getSetting('notifyAnnouncements', true)}
                            onCheckedChange={(checked) => handleSettingChange('notifyAnnouncements', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-maintenance">Maintenance Updates</Label>
                          <Switch 
                            id="notify-maintenance"
                            checked={getSetting('notifyMaintenance', true)}
                            onCheckedChange={(checked) => handleSettingChange('notifyMaintenance', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-payments">Payment Confirmations</Label>
                          <Switch 
                            id="notify-payments"
                            checked={getSetting('notifyPayments', true)}
                            onCheckedChange={(checked) => handleSettingChange('notifyPayments', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-violations">Violation Notices</Label>
                          <Switch 
                            id="notify-violations"
                            checked={getSetting('notifyViolations', true)}
                            onCheckedChange={(checked) => handleSettingChange('notifyViolations', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-board-decisions">Board Decisions</Label>
                          <Switch 
                            id="notify-board-decisions"
                            checked={getSetting('notifyBoardDecisions', true)}
                            onCheckedChange={(checked) => handleSettingChange('notifyBoardDecisions', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                // Reset to original settings
                const original = associations.find(a => a.id === activeAssociation.id);
                if (original) {
                  selectAssociation(original);
                }
              }}
            >
              Reset Changes
            </Button>
            <Button 
              onClick={() => {
                // Save settings happens automatically with handleSettingChange
                toast.success("Settings saved successfully");
              }}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAssociation ? "Edit Association" : "Add New Association"}
            </DialogTitle>
            <DialogDescription>
              {editingAssociation 
                ? "Update the details for this association" 
                : "Fill in the details to add a new property association"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Association Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="units">Number of Units</Label>
                  <Input 
                    id="units" 
                    name="units" 
                    type="number" 
                    value={formData.units}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAssociation ? "Save Changes" : "Add Association"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssociationSettings;
