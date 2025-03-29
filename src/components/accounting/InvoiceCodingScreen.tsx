
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, Plus, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLAccount } from "@/types/accounting";

// Define the schema for the form
const invoiceFormSchema = z.object({
  association: z.string({
    required_error: "Please select an association.",
  }),
  provider: z.string({
    required_error: "Please select a service provider.",
  }),
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  accountNumber: z.string().optional(),
  invoiceDate: z.date({
    required_error: "Invoice date is required.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  invoiceTotal: z.coerce.number().min(0, "Total must be a positive number."),
  paymentType: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceItem {
  id: string;
  glAccount: string;
  fund: string;
  bankAccount: string;
  description: string;
  amount: number;
}

const mockGlAccounts: GLAccount[] = [
  { id: "1001", code: "1001", name: "Operating Expenses", category: "Expenses", type: "Expense", isActive: true },
  { id: "1002", code: "1002", name: "Maintenance", category: "Expenses", type: "Expense", isActive: true },
  { id: "2001", code: "2001", name: "Accounts Payable", category: "Liabilities", type: "Liability", isActive: true },
  { id: "3001", code: "3001", name: "Cash Operating", category: "Assets", type: "Asset", isActive: true },
];

const InvoiceCodingScreen: React.FC = () => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  
  // Default values for the form
  const defaultValues: Partial<InvoiceFormValues> = {
    invoiceDate: new Date(),
    dueDate: new Date(),
    invoiceTotal: 0,
  };

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  });

  // Function to handle form submission
  const onSubmit = (data: InvoiceFormValues) => {
    console.log("Form submitted:", data);
    console.log("Invoice items:", invoiceItems);
    // Here you would typically send the data to your backend or perform other actions
  };

  // Function to add a new invoice item
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`, // Generate a unique ID
      glAccount: "",
      fund: "",
      bankAccount: "",
      description: "",
      amount: 0,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  // Calculate the total amount of all invoice items
  const totalAmount = invoiceItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Coding</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-1">
            <Search className="h-4 w-4" />
            Search Invoices
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Code Invoice</CardTitle>
          <CardDescription>Enter the invoice details and allocate to GL accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Association Selection */}
                <FormField
                  control={form.control}
                  name="association"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Association</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "default_association"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Association" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default_association" disabled>Select an association</SelectItem>
                          <SelectItem value="all">All Associations</SelectItem>
                          <SelectItem value="oakwood">Oakwood Heights</SelectItem>
                          <SelectItem value="willow">Willow Creek Estates</SelectItem>
                          <SelectItem value="riverfront">Riverfront Towers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Provider Selection */}
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "default_provider"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a Service Provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default_provider" disabled>Choose a provider</SelectItem>
                          <SelectItem value="abc">ABC Maintenance</SelectItem>
                          <SelectItem value="xyz">XYZ Landscaping</SelectItem>
                          <SelectItem value="city">City Utilities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Invoice Number */}
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter invoice number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Account Number */}
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "default_account"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default_account" disabled>Select an account</SelectItem>
                          <SelectItem value="acc1">Account 100-1234</SelectItem>
                          <SelectItem value="acc2">Account 200-5678</SelectItem>
                          <SelectItem value="acc3">Account 300-9012</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Invoice Date */}
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
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
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
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
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Invoice Total */}
                <FormField
                  control={form.control}
                  name="invoiceTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Total</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                            $
                          </span>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="pl-7" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "default_payment"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default_payment" disabled>Choose a payment method</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="ach">ACH Transfer</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="wire">Wire Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tabs for Details, Messages, Recent Invoices */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="recentInvoices">Recent Invoices</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem} className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      New Item
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="flex items-center gap-1">
                      <RefreshCw className="h-4 w-4" />
                      Refresh GL
                    </Button>
                  </div>

                  {/* Invoice Items Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/5">GL Account</TableHead>
                          <TableHead className="w-1/6">Fund</TableHead>
                          <TableHead className="w-1/6">Bank Account</TableHead>
                          <TableHead className="w-1/3">Description</TableHead>
                          <TableHead className="w-1/6 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceItems.length > 0 ? (
                          invoiceItems.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Select
                                  value={item.glAccount || "default_gl"}
                                  onValueChange={(value) => {
                                    const updatedItems = [...invoiceItems];
                                    updatedItems[index].glAccount = value;
                                    setInvoiceItems(updatedItems);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select GL Account" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="default_gl" disabled>Select an account</SelectItem>
                                    {mockGlAccounts.map((account) => (
                                      <SelectItem key={account.id} value={account.id}>
                                        {account.code} - {account.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.fund || "default_fund"}
                                  onValueChange={(value) => {
                                    const updatedItems = [...invoiceItems];
                                    updatedItems[index].fund = value;
                                    setInvoiceItems(updatedItems);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Fund" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="default_fund" disabled>Select a fund</SelectItem>
                                    <SelectItem value="operating">Operating</SelectItem>
                                    <SelectItem value="reserve">Reserve</SelectItem>
                                    <SelectItem value="capital">Capital</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.bankAccount || "default_bank"}
                                  onValueChange={(value) => {
                                    const updatedItems = [...invoiceItems];
                                    updatedItems[index].bankAccount = value;
                                    setInvoiceItems(updatedItems);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Bank" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="default_bank" disabled>Select a bank account</SelectItem>
                                    <SelectItem value="checking">Checking</SelectItem>
                                    <SelectItem value="savings">Savings</SelectItem>
                                    <SelectItem value="money_market">Money Market</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="Description"
                                  value={item.description}
                                  onChange={(e) => {
                                    const updatedItems = [...invoiceItems];
                                    updatedItems[index].description = e.target.value;
                                    setInvoiceItems(updatedItems);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  type="number"
                                  className="text-right"
                                  value={item.amount.toString()}
                                  onChange={(e) => {
                                    const updatedItems = [...invoiceItems];
                                    updatedItems[index].amount = parseFloat(e.target.value) || 0;
                                    setInvoiceItems(updatedItems);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              No invoice items yet. Click "New Item" to add one.
                            </TableCell>
                          </TableRow>
                        )}
                        
                        {invoiceItems.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-right font-medium">
                              Total:
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="messages" className="pt-4">
                  <div className="border rounded-md p-6 text-center text-muted-foreground">
                    No messages related to this invoice.
                  </div>
                </TabsContent>
                
                <TabsContent value="recentInvoices" className="pt-4">
                  <div className="border rounded-md p-6 text-center text-muted-foreground">
                    No recent invoices from this vendor.
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">
                  Post Invoice
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCodingScreen;
