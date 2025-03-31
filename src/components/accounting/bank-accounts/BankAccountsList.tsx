
import React, { useState } from 'react';
import { BankAccount } from '@/types/accounting';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, RefreshCw, Eye } from 'lucide-react';
import BankAccountDialog from './BankAccountDialog';
import { formatCurrency } from '@/utils/formatters';
import BankAccountDetails from './BankAccountDetails';

interface BankAccountsListProps {
  associationId: string;
}

const BankAccountsList: React.FC<BankAccountsListProps> = ({ associationId }) => {
  const { accounts, loading, error, refreshAccounts } = useBankAccounts({ associationId });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsDetailsOpen(true);
  };

  const handleDialogClose = (refreshNeeded: boolean) => {
    setIsDialogOpen(false);
    if (refreshNeeded) {
      refreshAccounts();
    }
  };

  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setSelectedAccount(null);
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'operating':
        return 'bg-blue-100 text-blue-800';
      case 'reserve':
        return 'bg-green-100 text-green-800';
      case 'cd':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Bank Accounts</h2>
          <p className="text-muted-foreground">
            Manage your association's bank accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshAccounts()}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleCreateAccount}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Operating Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                accounts
                  .filter(account => account.accountType === 'operating')
                  .reduce((sum, account) => sum + account.balance, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reserve Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                accounts
                  .filter(account => account.accountType === 'reserve')
                  .reduce((sum, account) => sum + account.balance, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalBalance())}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
          <CardDescription>
            View and manage all bank accounts for this association
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Loading accounts...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-red-500">{error}</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex justify-center items-center h-32 flex-col gap-2">
              <p className="text-muted-foreground">No bank accounts found</p>
              <Button size="sm" onClick={handleCreateAccount}>
                Add Your First Account
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="hidden md:table-cell">Account Number</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeColor(account.accountType)} variant="outline">
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(account.balance)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {account.accountNumber ? 
                          `****${account.accountNumber.slice(-4)}` : 
                          'N/A'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {account.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(account)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAccount(account)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BankAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        account={selectedAccount}
        associationId={associationId}
        onClose={handleDialogClose}
      />

      {selectedAccount && (
        <BankAccountDetails
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          account={selectedAccount}
          onClose={handleDetailsClose}
        />
      )}
    </div>
  );
};

export default BankAccountsList;
