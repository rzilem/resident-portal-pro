
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssociations } from '@/hooks/use-associations';
import GlAccountsList from '@/components/accounting/gl-accounts/GlAccountsList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Library } from 'lucide-react';

const GlAccounts: React.FC = () => {
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  const [selectedSource, setSelectedSource] = useState<string>("master");
  const [selectedAssociationId, setSelectedAssociationId] = useState<string>(
    activeAssociation?.id || ''
  );

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    if (source === "association" && associations.length > 0) {
      // If switching to association view, set the association
      setSelectedAssociationId(activeAssociation?.id || associations[0].id);
      
      // Optionally select this association in the global state
      const association = associations.find(a => a.id === (activeAssociation?.id || associations[0].id));
      if (association) {
        selectAssociation(association);
      }
    }
  };

  const handleAssociationChange = (associationId: string) => {
    setSelectedAssociationId(associationId);
    const association = associations.find(a => a.id === associationId);
    if (association) {
      selectAssociation(association);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">GL Accounts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chart of Accounts</CardTitle>
          <CardDescription>
            Manage general ledger accounts for your associations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="master" onValueChange={handleSourceChange} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="master" className="flex items-center gap-1">
                  <Library className="h-4 w-4" />
                  <span>Master GL List</span>
                </TabsTrigger>
                <TabsTrigger value="association" className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>Association GL</span>
                </TabsTrigger>
              </TabsList>

              {selectedSource === "association" && (
                <div className="w-72">
                  <Select 
                    value={selectedAssociationId} 
                    onValueChange={handleAssociationChange}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <SelectValue placeholder="Select Association" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {associations.map((association) => (
                        <SelectItem 
                          key={association.id} 
                          value={association.id}
                        >
                          {association.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <TabsContent value="master">
              <GlAccountsList isMaster={true} associationId={null} />
            </TabsContent>
            
            <TabsContent value="association">
              {selectedAssociationId ? (
                <GlAccountsList isMaster={false} associationId={selectedAssociationId} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Please select an association</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlAccounts;
