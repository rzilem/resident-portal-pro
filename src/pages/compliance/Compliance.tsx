
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssociations } from '@/hooks/use-associations';
import ComplianceOverview from '@/components/compliance/ComplianceOverview';
import ViolationsTable from '@/components/compliance/ViolationsTable';
import ComplianceMetrics from '@/components/compliance/ComplianceMetrics';
import ComplianceColumnsSelector from '@/components/compliance/ComplianceColumnsSelector';
import ViolationTemplatesManager from '@/components/compliance/templates/ViolationTemplatesManager';

const Compliance = () => {
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  const [activeTab, setActiveTab] = useState('overview');

  const handleAssociationChange = (value: string) => {
    const association = associations.find(a => a.id === value);
    if (association) {
      selectAssociation(association);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
          <p className="text-muted-foreground">
            Monitor and manage association compliance issues
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select 
            value={activeAssociation?.id} 
            onValueChange={handleAssociationChange}
          >
            <SelectTrigger className="w-[250px]">
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
          <ComplianceColumnsSelector />
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="violations">Active Violations</TabsTrigger>
          <TabsTrigger value="templates">Violation Templates</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <ComplianceOverview />
        </TabsContent>
        
        <TabsContent value="violations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Violations</CardTitle>
              <CardDescription>
                View and manage all active compliance violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ViolationsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <ViolationTemplatesManager />
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-6 mt-6">
          <ComplianceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compliance;
