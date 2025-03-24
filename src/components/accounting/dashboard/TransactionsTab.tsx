
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart } from "lucide-react";
import { Link } from 'react-router-dom';

const TransactionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
        <CardDescription>
          View and manage all financial transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Transaction Overview</h3>
            <p className="text-muted-foreground mb-4">
              View transaction details in the Transactions page
            </p>
            <Button className="mt-2" asChild>
              <Link to="/accounting/transactions">Go to Transactions</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;
