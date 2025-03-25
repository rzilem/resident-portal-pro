
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from 'lucide-react';
import { JournalEntry, JournalEntryLine, GLAccount } from '@/types/accounting';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface JournalEntryFormProps {
  entry?: JournalEntry | null;
  onComplete: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, onComplete }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<JournalEntry>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    status: 'draft',
    lines: [
      {
        id: uuidv4(),
        accountId: '',
        accountName: '',
        debit: 0,
        credit: 0,
        description: ''
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [isBalanced, setIsBalanced] = useState(false);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  // Mock data for chart of accounts
  const [accounts] = useState<GLAccount[]>([
    { id: '1', code: '1000', name: 'Cash', category: 'Assets', type: 'Asset', isActive: true },
    { id: '2', code: '1100', name: 'Accounts Receivable', category: 'Assets', type: 'Asset', isActive: true },
    { id: '3', code: '4000', name: 'Assessment Income', category: 'Income', type: 'Income', isActive: true },
    { id: '4', code: '5000', name: 'Office Supplies', category: 'Expenses', type: 'Expense', isActive: true },
    { id: '5', code: '2000', name: 'Accounts Payable', category: 'Liabilities', type: 'Liability', isActive: true },
    { id: '6', code: '3000', name: 'Retained Earnings', category: 'Equity', type: 'Equity', isActive: true },
  ]);

  // Initialize form if editing an existing entry
  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        date: new Date(entry.date).toISOString().split('T')[0]
      });
    }
  }, [entry]);

  // Calculate totals and check balance
  useEffect(() => {
    const debitTotal = formData.lines.reduce((sum, line) => sum + line.debit, 0);
    const creditTotal = formData.lines.reduce((sum, line) => sum + line.credit, 0);
    
    setTotalDebit(debitTotal);
    setTotalCredit(creditTotal);
    setIsBalanced(debitTotal === creditTotal && debitTotal > 0);
  }, [formData.lines]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as 'draft' | 'posted' | 'void'
    }));
  };

  const handleAddLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          id: uuidv4(),
          accountId: '',
          accountName: '',
          debit: 0,
          credit: 0,
          description: ''
        }
      ]
    }));
  };

  const handleRemoveLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const handleLineChange = (index: number, field: keyof JournalEntryLine, value: any) => {
    setFormData(prev => {
      const newLines = [...prev.lines];
      newLines[index] = {
        ...newLines[index],
        [field]: value
      };
      
      // If this is an account change, update the account name
      if (field === 'accountId') {
        const account = accounts.find(a => a.id === value);
        if (account) {
          newLines[index].accountName = account.name;
        }
      }
      
      return {
        ...prev,
        lines: newLines
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBalanced) {
      toast({
        title: "Journal entry not balanced",
        description: "Total debits must equal total credits",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.lines.some(line => !line.accountId)) {
      toast({
        title: "Incomplete journal entry",
        description: "All lines must have an account selected",
        variant: "destructive"
      });
      return;
    }

    // Prepare data for saving
    const journalEntry: JournalEntry = {
      ...formData,
      id: formData.id || `JE-${new Date().getTime()}`,
      updatedAt: new Date().toISOString()
    };

    // Here you would typically save the journal entry to your database
    console.log('Saving journal entry:', journalEntry);
    
    toast({
      title: `Journal entry ${entry ? 'updated' : 'created'}`,
      description: `Journal entry ${journalEntry.reference} has been ${entry ? 'updated' : 'created'} successfully`
    });
    
    // Call the onComplete callback to return to the list view
    onComplete();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference #</Label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="JE-2023-001"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter a description for this journal entry"
              className="min-h-[80px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="void">Void</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Journal Entry Lines</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddLine}
            className="flex items-center gap-1"
          >
            <PlusCircle size={16} />
            Add Line
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.lines.map((line, index) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <Select 
                      value={line.accountId} 
                      onValueChange={(value) => handleLineChange(index, 'accountId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.code} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Line description"
                      value={line.description || ''}
                      onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.debit || ''}
                      onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.credit || ''}
                      onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveLine(index)}
                      disabled={formData.lines.length === 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Totals row */}
              <TableRow className="border-t-2">
                <TableCell colSpan={2} className="text-right font-medium">
                  Totals
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(totalDebit)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(totalCredit)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              
              {/* Difference row */}
              <TableRow className={!isBalanced ? "bg-red-50" : ""}>
                <TableCell colSpan={2} className="text-right font-medium">
                  Difference
                </TableCell>
                <TableCell colSpan={2} className={`text-right font-medium ${!isBalanced ? "text-red-500" : ""}`}>
                  {formatCurrency(Math.abs(totalDebit - totalCredit))}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!isBalanced}
        >
          {entry ? 'Update' : 'Create'} Journal Entry
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
