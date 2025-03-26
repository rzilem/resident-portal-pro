
import React from 'react';
import { Database, FileText, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const TransactionRecordsPlaceholder = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full">
      <CardContent className="p-8 text-center">
        <Database className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Financial Transaction Records</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Access and manage your financial transactions, invoices, and payment history all in one place.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            className="gap-2" 
            onClick={() => navigate('/accounting/invoice-queue')}
          >
            <FileText className="h-4 w-4" />
            View Invoice Queue
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate('/accounting/reports')}
          >
            <BarChart4 className="h-4 w-4" />
            Financial Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionRecordsPlaceholder;
