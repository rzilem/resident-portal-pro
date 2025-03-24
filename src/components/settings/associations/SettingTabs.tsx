
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Association, SettingSection, AssociationMenuCategory } from './types';

// Tab content components
import BasicSettings from './tabs/BasicSettings';
import FinancialSettings from './tabs/FinancialSettings';
import DocumentSettings from './tabs/DocumentSettings';
import CommunicationSettings from './tabs/CommunicationSettings';
import MeetingSettings from './tabs/MeetingSettings';
import NotificationSettings from './tabs/NotificationSettings';

interface SettingTabsProps {
  activeAssociation: Association;
  setActiveAssociation: React.Dispatch<React.SetStateAction<Association>>;
  associations: Association[];
  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>;
  activeSettingsTab: string;
  setActiveSettingsTab: React.Dispatch<React.SetStateAction<string>>;
  settingSections: SettingSection[];
  menuCategories: AssociationMenuCategory[];
  selectAssociation: (association: Association) => void;
}

const SettingTabs = ({
  activeAssociation,
  setActiveAssociation,
  associations,
  setAssociations,
  activeSettingsTab,
  setActiveSettingsTab,
  settingSections,
  menuCategories,
  selectAssociation
}: SettingTabsProps) => {
  
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("general");
  
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

  // Helper function to get setting value with fallback
  const getSetting = (key: string, fallback: any = '') => {
    return activeAssociation?.settings?.[key] ?? fallback;
  };

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar with association menu categories */}
          <div className="col-span-1 border-r pr-4 overflow-y-auto max-h-[calc(100vh-250px)]">
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={activeAccordion || undefined}
              onValueChange={(value) => setActiveAccordion(value)}
            >
              {menuCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-sm font-medium">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <div key={item.id}>
                          <Button 
                            variant={activeSubMenu === item.id ? "secondary" : "ghost"} 
                            className="w-full justify-start text-sm pl-4"
                            onClick={() => setActiveSubMenu(item.id)}
                          >
                            {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                            {item.title}
                            {item.hasSubmenu && <ChevronRight className="h-4 w-4 ml-auto" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Right side with tab content */}
          <div className="col-span-1 md:col-span-3">
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
                <BasicSettings 
                  activeAssociation={activeAssociation} 
                  setAssociations={setAssociations}
                  setActiveAssociation={setActiveAssociation}
                  handleSettingChange={handleSettingChange}
                  getSetting={getSetting}
                />
              </TabsContent>
              
              <TabsContent value="financial">
                <FinancialSettings 
                  handleSettingChange={handleSettingChange}
                  getSetting={getSetting}
                />
              </TabsContent>
              
              <TabsContent value="documents">
                <DocumentSettings 
                  handleSettingChange={handleSettingChange}
                  getSetting={getSetting}
                />
              </TabsContent>
              
              <TabsContent value="communications">
                <CommunicationSettings 
                  activeAssociation={activeAssociation}
                  handleSettingChange={handleSettingChange}
                  getSetting={getSetting}
                />
              </TabsContent>
              
              <TabsContent value="meetings">
                <MeetingSettings 
                  handleSettingChange={handleSettingChange}
                  getSetting={getSetting}
                />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationSettings 
                  handleSettingChange={handleSettingChange}
                  getSetting={getSetting}
                />
              </TabsContent>
            </Tabs>
            
            {/* Placeholder for the submenu content */}
            {activeSubMenu && (
              <div className="mt-6 p-4 border rounded-md bg-muted/40">
                <h3 className="text-lg font-medium mb-2">
                  {menuCategories.flatMap(c => c.items).find(item => item.id === activeSubMenu)?.title || 'Settings'}
                </h3>
                <p className="text-muted-foreground">
                  This is a placeholder for the {menuCategories.flatMap(c => c.items).find(item => item.id === activeSubMenu)?.title || 'selected'} settings content.
                  The actual implementation would display the appropriate form or information here.
                </p>
              </div>
            )}
          </div>
        </div>
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
  );
};

export default SettingTabs;
