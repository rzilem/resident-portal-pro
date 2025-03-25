
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Download, Upload, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { GLAccount } from '@/types/accounting';
import GlAccountForm from './GlAccountForm';
import { predefinedGlAccounts } from './predefined-accounts';

interface GlAccountsListProps {
  isMaster: boolean;
  associationId: string | null;
}

const GlAccountsList: React.FC<GlAccountsListProps> = ({ isMaster, associationId }) => {
  const [accounts, setAccounts] = useState<GLAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<GLAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<GLAccount | null>(null);

  // Load accounts based on whether we're viewing master or association-specific accounts
  useEffect(() => {
    if (isMaster) {
      // For master GL, load the predefined accounts
      setAccounts(predefinedGlAccounts);
    } else if (associationId) {
      // For association-specific GL, we'd normally fetch from an API
      // For now, just use a subset of the predefined accounts
      setAccounts(predefinedGlAccounts.slice(0, 20));
    }
  }, [isMaster, associationId]);

  // Apply filters and search whenever accounts, searchTerm or typeFilter changes
  useEffect(() => {
    let filtered = [...accounts];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(account => 
        account.code.toLowerCase().includes(term) || 
        account.name.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(account => account.type.toLowerCase() === typeFilter.toLowerCase());
    }
    
    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, typeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
  };

  const handleAddAccount = (account: GLAccount) => {
    // In a real app, this would be an API call
    setAccounts([...accounts, { ...account, id: (accounts.length + 1).toString() }]);
    setShowAddDialog(false);
    toast.success("GL account added successfully");
  };

  const handleEditAccount = (account: GLAccount) => {
    setAccountToEdit(account);
    setShowAddDialog(true);
  };

  const handleUpdateAccount = (updatedAccount: GLAccount) => {
    // In a real app, this would be an API call
    setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    setShowAddDialog(false);
    setAccountToEdit(null);
    toast.success("GL account updated successfully");
  };

  const handleDeleteAccount = (id: string) => {
    // In a real app, this would be an API call
    setAccounts(accounts.filter(acc => acc.id !== id));
    toast.success("GL account deleted successfully");
  };

  const handleImportFromMaster = () => {
    // This would import selected accounts from master to the association
    toast.success("Accounts imported from Master GL");
  };

  const handleExportToCSV = () => {
    // This would export accounts to CSV
    toast.success("Accounts exported to CSV");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search accounts..." 
              className="pl-8" 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select defaultValue="all" onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="liability">Liability</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {!isMaster && (
            <Button variant="outline" className="flex items-center gap-1" onClick={handleImportFromMaster}>
              <Upload size={16} />
              <span className="hidden md:inline">Import from Master</span>
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-1" onClick={handleExportToCSV}>
            <Download size={16} />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button className="flex items-center gap-1" onClick={() => { setAccountToEdit(null); setShowAddDialog(true); }}>
            <PlusCircle size={16} />
            <span>Add Account</span>
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>GL Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  {searchTerm || typeFilter !== 'all' ? 
                    "No accounts match your search criteria" : 
                    "No accounts found. Add your first GL account."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.code}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>{account.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{accountToEdit ? 'Edit GL Account' : 'Add GL Account'}</DialogTitle>
            <DialogDescription>
              {accountToEdit 
                ? 'Update the details for this GL account.' 
                : 'Create a new general ledger account.'}
            </DialogDescription>
          </DialogHeader>
          
          <GlAccountForm 
            account={accountToEdit}
            onSave={accountToEdit ? handleUpdateAccount : handleAddAccount}
            onCancel={() => {
              setShowAddDialog(false);
              setAccountToEdit(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlAccountsList;
