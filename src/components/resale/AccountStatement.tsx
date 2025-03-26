
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Printer, Mail, FileText, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const AccountStatement = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [statementGenerated, setStatementGenerated] = useState(false);
  
  const handleGenerateStatement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setStatementGenerated(true);
      
      toast({
        title: "Statement Generated",
        description: "The account statement has been generated successfully.",
      });
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statement Generator</CardTitle>
        <CardDescription>
          Generate real-time statements showing current financial standing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!statementGenerated ? (
          <form onSubmit={handleGenerateStatement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input id="propertyAddress" placeholder="Enter property address" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyOwner">Property Owner</Label>
                <Input id="propertyOwner" placeholder="Enter owner name" required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="Enter account number" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="statementType">Statement Type</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="statementType">
                    <SelectValue placeholder="Select statement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Statement</SelectItem>
                    <SelectItem value="detailed">Detailed Statement</SelectItem>
                    <SelectItem value="closing">Closing Statement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" required />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Statement'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Account Statement</h3>
                  <p className="text-sm text-muted-foreground">Oak Ridge Condominiums</p>
                </div>
                <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-sm">
                  Current
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">123 Main Street, Unit 45</p>
                  <p className="text-sm">Austin, TX 78701</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm">Account #: HOA-20231101</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Current Balance</p>
                      <p className="text-sm text-muted-foreground">As of Nov 1, 2023</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">$350.00</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Next Payment Due</p>
                      <p className="text-sm text-muted-foreground">Monthly Assessment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$250.00</p>
                    <p className="text-sm text-muted-foreground">Due Nov 15, 2023</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                    <div>
                      <p className="font-medium">Special Assessment</p>
                      <p className="text-sm text-muted-foreground">Pool Renovation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$100.00</p>
                    <p className="text-sm text-muted-foreground">Due Dec 1, 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-2">Recent Transactions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <p>Oct 15, 2023</p>
                    <p>Monthly Assessment</p>
                    <p className="font-medium">$250.00</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Oct 15, 2023</p>
                    <p>Payment Received</p>
                    <p className="font-medium text-green-600">-$250.00</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Sep 15, 2023</p>
                    <p>Monthly Assessment</p>
                    <p className="font-medium">$250.00</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Sep 15, 2023</p>
                    <p>Payment Received</p>
                    <p className="font-medium text-green-600">-$250.00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
              <Button 
                variant="link" 
                className="ml-auto"
                onClick={() => setStatementGenerated(false)}
              >
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountStatement;
