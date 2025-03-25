
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { GLAccount } from '@/types/accounting';
import { predefinedGlAccounts } from './predefined-accounts';
import GlAccountsSearch from './GlAccountsSearch';
import GlAccountsActions from './GlAccountsActions';
import GlAccountsTable from './GlAccountsTable';
import GlAccountDialog from './GlAccountDialog';

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

  const handleAddAccount = () => {
    setAccountToEdit(null);
    setShowAddDialog(true);
  };

  const handleEditAccount = (account: GLAccount) => {
    setAccountToEdit(account);
    setShowAddDialog(true);
  };

  const handleSaveAccount = (account: GLAccount) => {
    if (accountToEdit) {
      // Update existing account
      setAccounts(accounts.map(acc => acc.id === account.id ? account : acc));
      toast.success("GL account updated successfully");
    } else {
      // Add new account
      const newAccount = { ...account, id: (accounts.length + 1).toString() };
      setAccounts([...accounts, newAccount]);
      toast.success("GL account added successfully");
    }
    setShowAddDialog(false);
    setAccountToEdit(null);
  };

  const handleDeleteAccount = (id: string) => {
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

  const handleCancelDialog = () => {
    setShowAddDialog(false);
    setAccountToEdit(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <GlAccountsSearch 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilter}
        />
        
        <GlAccountsActions 
          isMaster={isMaster}
          onAddAccount={handleAddAccount}
          onImportFromMaster={handleImportFromMaster}
          onExportToCSV={handleExportToCSV}
        />
      </div>
      
      <GlAccountsTable 
        accounts={filteredAccounts}
        onEditAccount={handleEditAccount}
        onDeleteAccount={handleDeleteAccount}
      />

      <GlAccountDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        account={accountToEdit}
        onSave={handleSaveAccount}
        onCancel={handleCancelDialog}
      />
    </div>
  );
};

export default GlAccountsList;
