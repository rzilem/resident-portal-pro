
import React, { useState } from 'react';
import { format, addMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface PaymentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentName: string;
  currentBalance: string;
}

const PaymentPlanDialog: React.FC<PaymentPlanDialogProps> = ({
  open,
  onOpenChange,
  residentName,
  currentBalance,
}) => {
  const [billingStartDate, setBillingStartDate] = useState<Date | undefined>(new Date());
  const [achStartDate, setAchStartDate] = useState<Date | undefined>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<string>("ACH Draft");
  const [routingNumber, setRoutingNumber] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [isSavingsAccount, setIsSavingsAccount] = useState<boolean>(false);
  const [numberOfMonths, setNumberOfMonths] = useState<string>("6");
  const [monthlyPayment, setMonthlyPayment] = useState<string>("");
  
  // Calculate end date based on start date and number of months
  const endDate = billingStartDate ? 
    addMonths(billingStartDate, parseInt(numberOfMonths)) : 
    undefined;
  
  // Format numeric balance string for calculations (strips $ and ,)
  const getNumericBalance = (balanceStr: string): number => {
    return parseFloat(balanceStr.replace(/[$,]/g, '')) || 0;
  };

  // Calculate monthly payment when balance or months change
  React.useEffect(() => {
    const balanceValue = getNumericBalance(currentBalance);
    const months = parseInt(numberOfMonths) || 1;
    
    if (balanceValue > 0 && months > 0) {
      const payment = (balanceValue / months).toFixed(2);
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment("0.00");
    }
  }, [currentBalance, numberOfMonths]);

  const handleSave = () => {
    // Validation
    if (!billingStartDate || !achStartDate || !routingNumber || !accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (routingNumber.length !== 9) {
      toast({
        title: "Invalid Routing Number",
        description: "Routing number must be 9 digits.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would connect to backend services to create the payment plan
    toast({
      title: "Payment Plan Created",
      description: `Payment plan for ${residentName} has been set up successfully.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Setup Payment Plan for {residentName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="current-balance" className="text-right">
              Current Balance
            </Label>
            <Input
              id="current-balance"
              value={currentBalance}
              readOnly
              className="col-span-2 bg-muted"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="plan-length" className="text-right">
              Plan Length
            </Label>
            <Select 
              value={numberOfMonths} 
              onValueChange={(value) => setNumberOfMonths(value)}
            >
              <SelectTrigger id="plan-length" className="col-span-2">
                <SelectValue placeholder="Select number of months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="9">9 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="18">18 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="monthly-payment" className="text-right">
              Monthly Payment
            </Label>
            <Input
              id="monthly-payment"
              value={`$${monthlyPayment}`}
              readOnly
              className="col-span-2 bg-muted"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="billing-start-date" className="text-right">
              Billing Start Date
            </Label>
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="billing-start-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !billingStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billingStartDate ? format(billingStartDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={billingStartDate}
                    onSelect={setBillingStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">
              End Date
            </Label>
            <Input
              id="end-date"
              value={endDate ? format(endDate, "PPP") : ""}
              readOnly
              className="col-span-2 bg-muted"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="payment-method" className="text-right">
              Payment Method
            </Label>
            <Select 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger id="payment-method" className="col-span-2">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACH Draft">ACH Draft</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "ACH Draft" && (
            <>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="aba-routing" className="text-right">
                  ABA (Bank Routing #)
                </Label>
                <Input
                  id="aba-routing"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="9 digit routing number"
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="bank-account" className="text-right">
                  Bank Account #
                </Label>
                <Input
                  id="bank-account"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Account number"
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="is-savings" className="text-right">
                  Is Savings Account
                </Label>
                <div className="flex items-center col-span-2">
                  <Checkbox 
                    id="is-savings" 
                    checked={isSavingsAccount}
                    onCheckedChange={(checked) => setIsSavingsAccount(checked === true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="ach-start-date" className="text-right">
                  ACH Start Date
                </Label>
                <div className="col-span-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="ach-start-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !achStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {achStartDate ? format(achStartDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={achStartDate}
                        onSelect={setAchStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Setup Payment Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPlanDialog;
