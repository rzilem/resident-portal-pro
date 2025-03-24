
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Wallet, FileText } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const FinancialsIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Payment Processing */}
        <IntegrationCard 
          title="Payment Processing"
          description="Connect payment processors to handle HOA dues and fees"
          icon={<CreditCard className="h-5 w-5" />}
          integrations={[
            { name: "Stripe", connected: true },
            { name: "PayPal", connected: false },
            { name: "Square", connected: false },
            { name: "Authorize.net", connected: false }
          ]}
        />
        
        {/* Banking Integration */}
        <IntegrationCard 
          title="Banking"
          description="Connect bank accounts for automated reconciliation"
          icon={<Wallet className="h-5 w-5" />}
          integrations={[
            { name: "Plaid", connected: false },
            { name: "Yodlee", connected: false },
            { name: "Direct Bank API", connected: false }
          ]}
        />
        
        {/* Accounting Software */}
        <IntegrationCard 
          title="Accounting Software"
          description="Connect your accounting software for seamless financial management"
          icon={<FileText className="h-5 w-5" />}
          integrations={[
            { name: "QuickBooks", connected: false },
            { name: "Xero", connected: false },
            { name: "FreshBooks", connected: false },
            { name: "Wave", connected: false }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default FinancialsIntegrations;
