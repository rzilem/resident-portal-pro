
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGLAccounts } from '@/hooks/useGLAccounts';
import { useAssociations } from '@/hooks/use-associations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GLAccountsManagement: React.FC = () => {
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  const { glAccounts, loading, error, createGLAccount } = useGLAccounts(activeAssociation?.id);
  const [newAccount, setNewAccount] = useState({
    code: '',
    name: '',
    type: 'Expense',
    category: 'Expenses',
    isActive: true
  });

  const handleCreateAccount = () => {
    if (activeAssociation) {
      createGLAccount({
        ...newAccount,
        associationId: activeAssociation.id
      });
      // Reset form
      setNewAccount({
        code: '',
        name: '',
        type: 'Expense',
        category: 'Expenses',
        isActive: true
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GL Accounts Management</CardTitle>
        <div className="flex space-x-4 items-center">
          <Select 
            value={activeAssociation?.id || ''} 
            onValueChange={(id) => {
              const association = associations.find(a => a.id === id);
              if (association) selectAssociation(association);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Association" />
            </SelectTrigger>
            <SelectContent>
              {associations.map(assoc => (
                <SelectItem key={assoc.id} value={assoc.id}>
                  {assoc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {activeAssociation ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Create New GL Account</h3>
              <div className="space-y-2">
                <input 
                  placeholder="Account Code" 
                  value={newAccount.code}
                  onChange={(e) => setNewAccount(prev => ({...prev, code: e.target.value}))}
                  className="w-full p-2 border rounded"
                />
                <input 
                  placeholder="Account Name" 
                  value={newAccount.name}
                  onChange={(e) => setNewAccount(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-2 border rounded"
                />
                <select 
                  value={newAccount.type}
                  onChange={(e) => setNewAccount(prev => ({...prev, type: e.target.value}))}
                  className="w-full p-2 border rounded"
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
                <Button onClick={handleCreateAccount}>Create Account</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Existing Accounts</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {glAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <p>Please select an association to manage GL Accounts</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GLAccountsManagement;
