
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const ExportDataCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Data</CardTitle>
        <CardDescription>Download a copy of your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You can export your data at any time. Your data will be exported as a file that you can import into other services.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Export as PDF</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export as CSV</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 md:col-span-2">
            <Download className="h-4 w-4" />
            <span>Download all data</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportDataCard;
