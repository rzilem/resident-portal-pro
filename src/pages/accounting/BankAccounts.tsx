
import React from 'react';
import { useAssociations } from '@/hooks/use-associations';
import BankAccountsList from '@/components/accounting/bank-accounts/BankAccountsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';

const BankAccounts: React.FC = () => {
  const { associations, activeAssociation, selectAssociation } = useAssociations();

  const handleAssociationChange = (associationId: string) => {
    const association = associations.find(a => a.id === associationId);
    if (association) {
      selectAssociation(association);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bank Accounts</h1>
        
        {associations.length > 0 && (
          <div className="w-full md:w-72 mt-4 md:mt-0">
            <Select 
              value={activeAssociation?.id || ''} 
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

      {activeAssociation ? (
        <BankAccountsList associationId={activeAssociation.id} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Association Selected</CardTitle>
            <CardDescription>
              Please select an association to view and manage bank accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">
              Use the dropdown above to select an association
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankAccounts;
