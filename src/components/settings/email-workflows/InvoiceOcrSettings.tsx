
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scan, Settings2, Star, Clock, History, Layers, FileSearch } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const InvoiceOcrSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            <CardTitle>Invoice OCR Processing</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings2 className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
        <CardDescription>
          Configure and monitor OCR processing for invoice automation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Vendor Templates</TabsTrigger>
            <TabsTrigger value="mapping">GL Mapping</TabsTrigger>
            <TabsTrigger value="history">Processing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                icon={<FileSearch className="h-5 w-5 text-blue-500" />}
                title="Processed Today" 
                value="12"
                description="Invoices processed" 
              />
              <MetricCard 
                icon={<Star className="h-5 w-5 text-amber-500" />}
                title="Recognition Rate" 
                value="89%"
                description="Average accuracy" 
              />
              <MetricCard 
                icon={<Clock className="h-5 w-5 text-green-500" />}
                title="Processing Time" 
                value="1.8s"
                description="Average per invoice" 
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
              <h3 className="text-sm font-medium">OCR Performance</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vendor Recognition</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Date Recognition</span>
                  <span className="font-medium">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount Recognition</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Invoice Number Recognition</span>
                  <span className="font-medium">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Line Item Recognition</span>
                  <span className="font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="link" size="sm" className="gap-1">
                <History className="h-4 w-4" />
                <span>View Detailed Reports</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="text-center p-6 border border-dashed rounded-lg">
              <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">Vendor Templates</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Create custom OCR templates for your vendors to improve recognition accuracy.
                Upload sample invoices to train the system.
              </p>
              <Button className="gap-2">
                <Star className="h-4 w-4" />
                <span>Add Vendor Template</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="mapping" className="space-y-4 mt-4">
            <div className="text-center p-6 border border-dashed rounded-lg">
              <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">GL Account Mapping</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Create mapping rules to automatically assign GL accounts based on vendor, 
                invoice content, or line items detected in the invoice.
              </p>
              <Button className="gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Configure GL Mapping</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="text-center p-6 border border-dashed rounded-lg">
              <History className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">Processing History</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                View the history of processed invoices, OCR results, and any manual corrections made.
                This helps improve the system over time.
              </p>
              <Button className="gap-2">
                <FileSearch className="h-4 w-4" />
                <span>View Processing History</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 bg-white rounded-md shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
};

export default InvoiceOcrSettings;
