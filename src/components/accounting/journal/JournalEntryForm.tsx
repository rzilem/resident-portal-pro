
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntryLine {
  id: string;
  accountId: string;
  description: string;
  debit: number | '';
  credit: number | '';
}

interface JournalEntry {
  id?: string;
  date: Date;
  reference: string;
  description: string;
  lines: JournalEntryLine[];
}

// Sample GL accounts for the demo
const sampleAccounts = [
  { id: '1000', name: 'Cash', code: '1000' },
  { id: '1200', name: 'Accounts Receivable', code: '1200' },
  { id: '2000', name: 'Accounts Payable', code: '2000' },
  { id: '3000', name: 'Capital', code: '3000' },
  { id: '4000', name: 'Revenue', code: '4000' },
  { id: '5000', name: 'Expenses', code: '5000' },
];

const JournalEntryForm = ({ entry, onComplete }) => {
  const [formData, setFormData] = useState<JournalEntry>({
    date: new Date(),
    reference: '',
    description: '',
    lines: [
      {
        id: crypto.randomUUID(),
        accountId: '',
        description: '',
        debit: '',
        credit: '',
      },
    ],
  });

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    }
  }, [entry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleLineChange = (id: string, field: keyof JournalEntryLine, value: any) => {
    setFormData({
      ...formData,
      lines: formData.lines.map((line) => {
        if (line.id === id) {
          return { ...line, [field]: value };
        }
        return line;
      }),
    });
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        {
          id: crypto.randomUUID(),
          accountId: '',
          description: '',
          debit: '',
          credit: '',
        },
      ],
    });
  };

  const removeLine = (id: string) => {
    if (formData.lines.length <= 1) {
      toast.error('Journal entry must have at least one line');
      return;
    }
    
    setFormData({
      ...formData,
      lines: formData.lines.filter((line) => line.id !== id),
    });
  };

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    formData.lines.forEach((line) => {
      if (line.debit !== '') totalDebit += Number(line.debit);
      if (line.credit !== '') totalCredit += Number(line.credit);
    });

    return { totalDebit, totalCredit };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate entry
    const { totalDebit, totalCredit } = calculateTotals();
    
    if (totalDebit !== totalCredit) {
      toast.error('Journal entry must balance (debits must equal credits)');
      return;
    }
    
    if (totalDebit === 0 && totalCredit === 0) {
      toast.error('Journal entry must have at least one value');
      return;
    }
    
    // Check for required fields
    if (!formData.date || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check for account selection
    const hasEmptyAccount = formData.lines.some(line => !line.accountId);
    if (hasEmptyAccount) {
      toast.error('Please select an account for each line');
      return;
    }
    
    // Save entry
    console.log('Saving journal entry:', formData);
    toast.success(entry ? 'Journal entry updated' : 'Journal entry created');
    onComplete();
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePicker 
            date={formData.date} 
            onDateChange={handleDateChange} 
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reference">Reference / Number</Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            placeholder="Optional"
          />
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter journal entry description"
          rows={2}
        />
      </div>
      
      <div className="border rounded-md mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <Select
                    value={line.accountId || "select_account"}
                    onValueChange={(value) => handleLineChange(line.id, 'accountId', value === "select_account" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select_account" disabled>Select account</SelectItem>
                      {sampleAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={line.description}
                    onChange={(e) => handleLineChange(line.id, 'description', e.target.value)}
                    placeholder="Line description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.debit}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : '';
                      handleLineChange(line.id, 'debit', value);
                      if (value !== '') handleLineChange(line.id, 'credit', '');
                    }}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.credit}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : '';
                      handleLineChange(line.id, 'credit', value);
                      if (value !== '') handleLineChange(line.id, 'debit', '');
                    }}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(line.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            <TableRow>
              <TableCell colSpan={2} className="text-right font-medium">
                Totals:
              </TableCell>
              <TableCell className="font-medium">
                {totalDebit.toFixed(2)}
              </TableCell>
              <TableCell className="font-medium">
                {totalCredit.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell colSpan={5}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={addLine}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          {entry ? 'Update' : 'Create'} Journal Entry
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
