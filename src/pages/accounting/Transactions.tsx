
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownUp, DollarSign, Filter, PlusCircle, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Transactions = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          <div className="grid gap-4 md:gap-6 mb-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Financial Transactions</h2>
              <p className="text-muted-foreground">Manage all financial transactions across your properties</p>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Total Income', value: '$48,256.00', desc: 'This month', icon: TrendingUp, color: 'bg-green-50 text-green-600' },
                { title: 'Total Expenses', value: '$32,189.75', desc: 'This month', icon: TrendingDown, color: 'bg-red-50 text-red-600' },
                { title: 'Net Balance', value: '$16,066.25', desc: 'This month', icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
              ].map((item, i) => (
                <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <div className={`${item.color} p-2 rounded-full`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </section>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  View and manage financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Transaction
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2023-06-10', desc: 'Monthly HOA Fee Collection', property: 'Oakwood Heights', category: 'Fees', type: 'Income', amount: 12400.00 },
                      { date: '2023-06-08', desc: 'Landscaping Service', property: 'Willow Creek Estates', category: 'Maintenance', type: 'Expense', amount: -2850.75 },
                      { date: '2023-06-05', desc: 'Pool Maintenance', property: 'Riverfront Towers', category: 'Maintenance', type: 'Expense', amount: -1200.00 },
                      { date: '2023-06-02', desc: 'Special Assessment Collection', property: 'Sunset Gardens', category: 'Assessment', type: 'Income', amount: 7500.00 },
                      { date: '2023-06-01', desc: 'Elevator Repair', property: 'Oakwood Heights', category: 'Repairs', type: 'Expense', amount: -4200.50 },
                      { date: '2023-05-28', desc: 'Utility Payment - Water', property: 'Pine Valley Community', category: 'Utilities', type: 'Expense', amount: -1875.25 },
                    ].map((transaction, i) => (
                      <TableRow key={i}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.desc}</TableCell>
                        <TableCell>{transaction.property}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                            transaction.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'Income' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;
