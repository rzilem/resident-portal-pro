
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Grid } from '@/components/ui/grid';
import { useToast } from '@/hooks/use-toast';
import { useAssociations } from '@/hooks/use-associations';
import { Filter, RefreshCw, Download, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import operation dashboard components
import OpenItemsChart from '@/components/operations/dashboard/OpenItemsChart';
import TeamPerformanceChart from '@/components/operations/dashboard/TeamPerformanceChart';
import OfficeMetricsChart from '@/components/operations/dashboard/OfficeMetricsChart';
import RecentRequestsList from '@/components/operations/dashboard/RecentRequestsList';
import CIInsights from '@/components/operations/dashboard/CIInsights';
import InvoiceTracker from '@/components/operations/dashboard/InvoiceTracker';
import RequestsDistributionChart from '@/components/operations/dashboard/RequestsDistributionChart';
import RequestTypeBreakdown from '@/components/operations/dashboard/RequestTypeBreakdown';
import EmployeeActivityTable from '@/components/operations/dashboard/EmployeeActivityTable';

const OperationsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { associations } = useAssociations();
  const [timeRange, setTimeRange] = useState('30days');
  const [portfolio, setPortfolio] = useState('all');
  const [office, setOffice] = useState('all');
  
  const handleRefresh = () => {
    toast({
      title: "Dashboard Refreshed",
      description: "Latest data has been loaded",
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Exporting Dashboard",
      description: "Your dashboard data is being prepared for download",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Operations Dashboard</h1>
          <p className="text-muted-foreground">Track all open items across associations and portfolios</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <TooltipButton 
            variant="outline" 
            className="gap-2"
            tooltipText="Refresh dashboard data"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </TooltipButton>
          
          <TooltipButton 
            variant="outline" 
            className="gap-2"
            tooltipText="Export dashboard data"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </TooltipButton>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="border-muted bg-card">
        <CardContent className="px-4 py-3">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={portfolio} onValueChange={setPortfolio}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Portfolios</SelectItem>
                  <SelectItem value="north">North Austin</SelectItem>
                  <SelectItem value="south">South Austin</SelectItem>
                  <SelectItem value="west">West Austin</SelectItem>
                  <SelectItem value="roundrock">Round Rock</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={office} onValueChange={setOffice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  <SelectItem value="austin">Austin Office</SelectItem>
                  <SelectItem value="roundrock">Round Rock Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="teams">Team Performance</TabsTrigger>
          <TabsTrigger value="insights">CI Insights</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={4}>
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Open Items by Category</CardTitle>
                <CardDescription>All active requests across associations</CardDescription>
              </CardHeader>
              <CardContent>
                <OpenItemsChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Request Distribution</CardTitle>
                <CardDescription>By association type</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestsDistributionChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Office Metrics</CardTitle>
                <CardDescription>Comparing Austin vs Round Rock performance</CardDescription>
              </CardHeader>
              <CardContent>
                <OfficeMetricsChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Request Types</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestTypeBreakdown />
              </CardContent>
            </Card>
          </Grid>
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Grid columns={{ sm: 1, md: 2 }} gap={4}>
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Click on any request to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRequestsList />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>ARC Requests</CardTitle>
                <CardDescription>Architectural review committee requests</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRequestsList type="arc" />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Gate & Pool Requests</CardTitle>
                <CardDescription>Access requests by community</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRequestsList type="access" />
              </CardContent>
            </Card>
          </Grid>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Accounting Invoices</CardTitle>
              <CardDescription>Track all pending invoices across associations</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTracker />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          <Grid columns={{ sm: 1, md: 1, lg: 2 }} gap={4}>
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Response times and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamPerformanceChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Employee Activity</CardTitle>
                <CardDescription>Recent activity and item assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeActivityTable />
              </CardContent>
            </Card>
          </Grid>
        </TabsContent>
        
        {/* CI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <CardTitle>CI Insights & Recommendations</CardTitle>
              </div>
              <CardDescription>AI-powered insights for improving operations</CardDescription>
            </CardHeader>
            <CardContent>
              <CIInsights />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperationsDashboard;
