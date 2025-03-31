
import React, { useState } from 'react';
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
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDown, ArrowUp, Building, CalendarIcon } from 'lucide-react';
import { BankAccount } from '@/types/accounting';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  transactionDate: z.date({
    required_error: "Transaction date is required",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).positive("Amount must be greater than 0"),
  description: z.string().optional(),
  checkNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: BankAccount;
  transactionType: 'deposit' | 'withdrawal';
  onSuccess: () => void;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onOpenChange,
  account,
  transactionType,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTransaction } = useBankTransactions({ bankAccountId: account.id });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDate: new Date(),
      amount: 0,
      description: '',
      checkNumber: '',
    }
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await createTransaction({
        associationId: account.associationId,
        bankAccountId: account.id,
        transactionDate: values.transactionDate.toISOString(),
        amount: values.amount,
        description: values.description || null,
        transactionType: transactionType === 'deposit' ? 'deposit' : 'withdrawal',
        checkNumber: values.checkNumber || null,
        status: 'cleared',
        isReconciled: false,
        statementId: null
      });
      
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {transactionType === 'deposit' ? (
              <>
                <ArrowDown className="h-5 w-5 text-green-500" />
                Add Deposit
              </>
            ) : (
              <>
                <ArrowUp className="h-5 w-5 text-red-500" />
                Add Withdrawal
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {transactionType === 'deposit' 
              ? `Add a deposit to ${account.name}`
              : `Add a withdrawal from ${account.name}`}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{account.name}</span>
            </div>
            
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaction Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        placeholder="0.00"
                        className="pl-8"
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for this transaction"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {transactionType === 'withdrawal' && (
              <FormField
                control={form.control}
                name="checkNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Check number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank if this is not a check payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={transactionType === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isSubmitting ? 'Processing...' : transactionType === 'deposit' ? 'Add Deposit' : 'Add Withdrawal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
