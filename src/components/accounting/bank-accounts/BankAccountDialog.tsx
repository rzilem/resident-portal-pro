
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BankAccount } from '@/types/accounting';
import { useBankAccounts } from '@/hooks/useBankAccounts';

const formSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  accountType: z.enum(['operating', 'reserve', 'cd', 'other']),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  balance: z.number().nonnegative('Balance must be a positive number'),
  isActive: z.boolean().default(true),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface BankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: BankAccount | null;
  associationId: string;
  onClose: (refreshNeeded: boolean) => void;
}

const BankAccountDialog: React.FC<BankAccountDialogProps> = ({
  open,
  onOpenChange,
  account,
  associationId,
  onClose
}) => {
  const { createAccount, updateAccount } = useBankAccounts({ associationId });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      accountType: 'operating',
      accountNumber: '',
      routingNumber: '',
      balance: 0,
      isActive: true,
      notes: ''
    }
  });
  
  // Set form values when editing an existing account
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        accountType: account.accountType,
        accountNumber: account.accountNumber || '',
        routingNumber: account.routingNumber || '',
        balance: account.balance,
        isActive: account.isActive,
        notes: account.notes || ''
      });
    } else {
      form.reset({
        name: '',
        accountType: 'operating',
        accountNumber: '',
        routingNumber: '',
        balance: 0,
        isActive: true,
        notes: ''
      });
    }
  }, [account, form]);
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (account) {
        // Update existing account
        await updateAccount(account.id, values);
      } else {
        // Create new account - making sure all required fields are present
        await createAccount({
          associationId,
          name: values.name,
          accountType: values.accountType,
          accountNumber: values.accountNumber,
          routingNumber: values.routingNumber,
          balance: values.balance,
          isActive: values.isActive,
          notes: values.notes
        });
      }
      onClose(true);
    } catch (error) {
      console.error('Error saving bank account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {account ? 'Edit Bank Account' : 'Add Bank Account'}
          </DialogTitle>
          <DialogDescription>
            {account 
              ? 'Update the details of this bank account' 
              : 'Add a new bank account to the association'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Main Operating Account" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="operating">Operating</SelectItem>
                      <SelectItem value="reserve">Reserve</SelectItem>
                      <SelectItem value="cd">Certificate of Deposit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123456789" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="987654321" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Account</FormLabel>
                    <FormDescription>
                      Inactive accounts will be hidden from reports and dashboards
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this account"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : account ? 'Update Account' : 'Add Account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BankAccountDialog;
