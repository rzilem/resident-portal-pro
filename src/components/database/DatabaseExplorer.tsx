
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyRecords from './PropertyRecords';
import UnitRecords from './UnitRecords';
import AssociationRecords from './AssociationRecords';
import TransactionRecords from './TransactionRecords';
import { Database, Building, Users, CreditCard } from 'lucide-react';

const DatabaseExplorer = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Database Explorer</CardTitle>
        <CardDescription>
          View and manage all database records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="homeowners">
          <TabsList className="mb-4">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Units</span>
            </TabsTrigger>
            <TabsTrigger value="homeowners" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Homeowners</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <PropertyRecords />
          </TabsContent>
          
          <TabsContent value="units">
            <UnitRecords />
          </TabsContent>
          
          <TabsContent value="homeowners" className="pt-4">
            <AssociationRecords />
          </TabsContent>
          
          <TabsContent value="transactions" className="pt-4">
            <TransactionRecords />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseExplorer;
