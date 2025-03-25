
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Settings, DollarSign, CreditCard, Landmark } from 'lucide-react';
import GlAccounts from '@/components/settings/financial/GlAccounts';
import PaymentMethods from '@/components/settings/financial/PaymentMethods';
import InvoiceSettings from '@/components/settings/financial/InvoiceSettings';
import { Association } from '../types';

interface FinancialSettingsProps {
  association: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue: any) => any;
}

const FinancialSettings: React.FC<FinancialSettingsProps> = ({ 
  association, 
  handleSettingChange,
  getSetting
}) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Financial Settings
        </h2>
        <Button asChild variant="outline" className="gap-1">
          <Link to="/accounting/gl-accounts">
            <Landmark className="h-4 w-4 mr-1" />
            Manage GL Accounts
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="gl-accounts">GL Accounts</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <p className="text-muted-foreground">
            Configure general financial settings for this association.
          </p>
          
          {/* We'll add general financial settings here later */}
          <div className="border rounded-md p-6 flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">General financial settings will be added here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="payment-methods" className="space-y-4 pt-4">
          <PaymentMethods
            association={association}
            handleSettingChange={handleSettingChange}
            getSetting={getSetting}
          />
        </TabsContent>
        
        <TabsContent value="gl-accounts" className="space-y-4 pt-4">
          <GlAccounts
            association={association}
            handleSettingChange={handleSettingChange}
            getSetting={getSetting}
          />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4 pt-4">
          <InvoiceSettings
            association={association}
            handleSettingChange={handleSettingChange}
            getSetting={getSetting}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialSettings;
