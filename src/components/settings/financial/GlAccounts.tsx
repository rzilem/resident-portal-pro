
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Association } from '@/components/settings/associations/types';

interface GlAccountsProps {
  association: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue: any) => any;
}

const GlAccounts: React.FC<GlAccountsProps> = ({ 
  association, 
  handleSettingChange, 
  getSetting 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GL Accounts</CardTitle>
        <CardDescription>Configure the general ledger accounts for this association</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 flex justify-center items-center min-h-[200px]">
          <p className="text-muted-foreground">GL accounts configuration will be added here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlAccounts;
