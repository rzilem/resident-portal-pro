
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Vendor } from '@/types/vendor';
import VendorPerformanceChart from './VendorPerformanceChart';
import InsuranceExpirationChart from '../insurance/InsuranceExpirationChart';
import InsuranceExpirationTable from '../insurance/InsuranceExpirationTable';
import { Badge } from "@/components/ui/badge";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  BarChart2, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Users, 
  Wrench,
  Star,
  DollarSign
} from 'lucide-react';

interface VendorMetricsDashboardProps {
  vendors: Vendor[];
}

const VendorMetricsDashboard: React.FC<VendorMetricsDashboardProps> = ({ vendors }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vendor Performance Metrics</h2>
          <p className="text-muted-foreground">Track, analyze, and optimize vendor relationships</p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Last updated: Today</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Metrics are updated daily</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TooltipProvider>
          <Card>
            <CardHeader className="pb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    Active Vendors
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total number of currently active vendors</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{vendors.filter(v => v.status === 'active').length}</div>
              <p className="text-sm text-muted-foreground">
                {Math.round(vendors.filter(v => v.status === 'active').length / vendors.length * 100)}% of total vendors
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>
        
        <TooltipProvider>
          <Card>
            <CardHeader className="pb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Avg. Vendor Rating
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average performance rating across all vendors</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / 
                  vendors.filter(v => v.rating).length).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {vendors.filter(v => v.rating).length} rated vendors
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>
        
        <TooltipProvider>
          <Card>
            <CardHeader className="pb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Insurance Alerts
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of vendors with expired or expiring insurance</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {vendors.filter(v => v.insurance?.expirationDate && 
                  new Date(v.insurance.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-sm text-muted-foreground">
                Require attention in the next 30 days
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="performance" className="flex items-center gap-1.5">
                  <BarChart2 className="h-4 w-4" />
                  <span>Performance</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>View vendor performance metrics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="insurance" className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>Insurance</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Track vendor insurance compliance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="services" className="flex items-center gap-1.5">
                  <Wrench className="h-4 w-4" />
                  <span>Services</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analyze vendor service utilization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="financial" className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  <span>Financial</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vendor spending and financial data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <VendorPerformanceChart vendors={vendors} />
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsuranceExpirationChart vendors={vendors} />
            <InsuranceExpirationTable vendors={vendors} />
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Utilization</CardTitle>
              <CardDescription>Analysis of vendor service categories and utilization</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              <p className="text-muted-foreground">Service metrics coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
              <CardDescription>Vendor spending and financial performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              <p className="text-muted-foreground">Financial metrics coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorMetricsDashboard;
