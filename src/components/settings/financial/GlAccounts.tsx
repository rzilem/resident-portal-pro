
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface GLAccount {
  id: string;
  code: string;
  name: string;
  category: string;
  type: string;
  isActive: boolean;
}

const GlAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<GLAccount[]>([
    { id: '1', code: '1000', name: 'Cash', category: 'Assets', type: 'Asset', isActive: true },
    { id: '2', code: '2000', name: 'Accounts Payable', category: 'Liabilities', type: 'Liability', isActive: true },
    { id: '3', code: '3000', name: 'Common Area Income', category: 'Revenue', type: 'Income', isActive: true },
    { id: '4', code: '4000', name: 'Repairs & Maintenance', category: 'Expenses', type: 'Expense', isActive: true },
    { id: '5', code: '5000', name: 'Reserve Fund', category: 'Equity', type: 'Equity', isActive: true },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<GLAccount | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    type: '',
    isActive: true,
  });
  
  const handleOpenDialog = (account?: GLAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        code: account.code,
        name: account.name,
        category: account.category,
        type: account.type,
        isActive: account.isActive,
      });
    } else {
      setEditingAccount(null);
      setFormData({
        code: '',
        name: '',
        category: '',
        type: '',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...formData } 
          : acc
      ));
      toast.success("GL account updated successfully");
    } else {
      // Create new account
      const newAccount: GLAccount = {
        id: (accounts.length + 1).toString(),
        ...formData,
      };
      setAccounts([...accounts, newAccount]);
      toast.success("GL account created successfully");
    }
    setDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
    toast.success("GL account deleted successfully");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>GL Accounts</CardTitle>
          <CardDescription>Manage your general ledger accounts</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <PlusCircle size={16} />
          <span>Add Account</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell className="hidden md:table-cell">{account.category}</TableCell>
                <TableCell className="hidden md:table-cell">{account.type}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {account.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(account)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit GL Account' : 'Add GL Account'}</DialogTitle>
              <DialogDescription>
                {editingAccount 
                  ? 'Update the details for this GL account.' 
                  : 'Create a new general ledger account.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Account Code</Label>
                  <Input 
                    id="code" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assets">Assets</SelectItem>
                    <SelectItem value="Liabilities">Liabilities</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GlAccounts;
