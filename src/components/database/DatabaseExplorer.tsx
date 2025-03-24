
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyRecords from './PropertyRecords';
import UnitRecords from './UnitRecords';
import AssociationRecords from './AssociationRecords';
import TransactionRecordsPlaceholder from './TransactionRecordsPlaceholder';

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
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="homeowners">Homeowners</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
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
            <TransactionRecordsPlaceholder />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseExplorer;
