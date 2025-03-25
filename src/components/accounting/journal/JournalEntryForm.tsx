
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { JournalEntry, JournalEntryLine, GLAccount } from '@/types/accounting';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface JournalEntryFormProps {
  entry?: JournalEntry | null;
  onComplete: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, onComplete }) => {
  // Mock data for GL accounts
  const [accounts] = useState<GLAccount[]>([
    { id: '1', code: '1000', name: 'Cash', category: 'Assets', type: 'Asset', isActive: true },
    { id: '2', code: '2000', name: 'Accounts Payable', category: 'Liabilities', type: 'Liability', isActive: true },
    { id: '3', code: '3000', name: 'Common Area Income', category: 'Revenue', type: 'Income', isActive: true },
    { id: '4', code: '4000', name: 'Repairs & Maintenance', category: 'Expenses', type: 'Expense', isActive: true },
    { id: '5', code: '5000', name: 'Reserve Fund', category: 'Equity', type: 'Equity', isActive: true },
  ]);

  // Form state
  const [formData, setFormData] = useState<{
    date: string;
    reference: string;
    description: string;
    lines: JournalEntryLine[];
  }>({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    lines: [
      {
        id: uuidv4(),
        accountId: '',
        accountName: '',
        debit: 0,
        credit: 0,
        description: ''
      },
      {
        id: uuidv4(),
        accountId: '',
        accountName: '',
        debit: 0,
        credit: 0,
        description: ''
      }
    ]
  });

  // Initialize form data with entry data if provided
  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date,
        reference: entry.reference,
        description: entry.description,
        lines: [...entry.lines]
      });
    }
  }, [entry]);

  // Update form data with input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update account selection
  const handleAccountChange = (lineId: string, accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map(line => 
        line.id === lineId 
          ? { 
              ...line, 
              accountId, 
              accountName: account ? account.name : ''
            }
          : line
      )
    }));
  };

  // Update debit or credit value
  const handleAmountChange = (lineId: string, field: 'debit' | 'credit', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map(line => {
        if (line.id === lineId) {
          // If setting debit, clear credit and vice versa
          if (field === 'debit' && numValue > 0) {
            return { ...line, debit: numValue, credit: 0 };
          } else if (field === 'credit' && numValue > 0) {
            return { ...line, credit: numValue, debit: 0 };
          } else {
            return { ...line, [field]: numValue };
          }
        }
        return line;
      })
    }));
  };

  // Add a new line to the journal entry
  const addLine = () => {
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

  // Remove a line from the journal entry
  const removeLine = (lineId: string) => {
    if (formData.lines.length <= 2) {
      toast.error("Journal entry must have at least two lines");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter(line => line.id !== lineId)
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    
    return { totalDebit, totalCredit };
  };

  // Check if the journal entry is balanced
  const isBalanced = () => {
    const { totalDebit, totalCredit } = calculateTotals();
    return Math.abs(totalDebit - totalCredit) < 0.01; // Account for floating point errors
  };

  // Save the journal entry
  const handleSave = (status: 'draft' | 'posted') => {
    if (status === 'posted' && !isBalanced()) {
      toast.error("Journal entry must be balanced before posting");
      return;
    }
    
    if (formData.reference.trim() === '') {
      toast.error("Reference is required");
      return;
    }
    
    if (formData.description.trim() === '') {
      toast.error("Description is required");
      return;
    }
    
    // Validate that all lines have an account
    const invalidLines = formData.lines.filter(line => !line.accountId);
    if (invalidLines.length > 0) {
      toast.error("All lines must have an account selected");
      return;
    }
    
    const newEntry: JournalEntry = {
      id: entry?.id || uuidv4(),
      date: formData.date,
      reference: formData.reference,
      description: formData.description,
      status,
      lines: formData.lines,
      createdAt: entry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real application, you would save this to your backend
    console.log('Saving journal entry:', newEntry);
    
    toast.success(`Journal entry ${status === 'posted' ? 'posted' : 'saved as draft'}`);
    onComplete();
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const isEntryBalanced = isBalanced();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="e.g., JE-2023-001"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <div className="h-10 px-3 py-2 flex items-center border rounded-md">
            {entry ? (
              <Badge 
                className={
                  entry.status === 'posted' 
                    ? "bg-green-500" 
                    : entry.status === 'draft' 
                      ? "bg-yellow-500" 
                      : "bg-gray-500"
                }
              >
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </Badge>
            ) : (
              <Badge className="bg-yellow-500">Draft</Badge>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter journal entry description"
          rows={2}
        />
      </div>
      
      {!isEntryBalanced && (
        <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Journal entry is not balanced. Debits must equal credits.</span>
        </div>
      )}
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.lines.map(line => (
              <TableRow key={line.id}>
                <TableCell>
                  <Select 
                    value={line.accountId} 
                    onValueChange={(value) => handleAccountChange(line.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
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
                    value={line.description || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        lines: prev.lines.map(l => 
                          l.id === line.id 
                            ? { ...l, description: e.target.value }
                            : l
                        )
                      }));
                    }}
                    placeholder="Line description"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.debit || ''}
                    onChange={(e) => handleAmountChange(line.id, 'debit', e.target.value)}
                    className="text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.credit || ''}
                    onChange={(e) => handleAmountChange(line.id, 'credit', e.target.value)}
                    className="text-right"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(line.id)}
                    title="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Totals row */}
            <TableRow>
              <TableCell colSpan={2} className="text-right font-medium">
                Totals
              </TableCell>
              <TableCell className="text-right font-bold">
                {totalDebit.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold">
                {totalCredit.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            {/* Difference row - only show if not balanced */}
            {!isEntryBalanced && (
              <TableRow>
                <TableCell colSpan={2} className="text-right font-medium text-red-500">
                  Difference
                </TableCell>
                <TableCell colSpan={2} className="text-right font-bold text-red-500">
                  {Math.abs(totalDebit - totalCredit).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={addLine}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Line
        </Button>
        
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onComplete()}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave('posted')}
            disabled={!isEntryBalanced}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Post Journal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryForm;
