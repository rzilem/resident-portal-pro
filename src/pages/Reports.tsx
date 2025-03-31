import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart as BarChartIcon,
  Building,
  Download,
  Filter,
  FileText,
  Users,
  Search,
  RefreshCw,
  Calendar,
  Printer
} from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';
import { toast } from 'sonner';
import { usePropertyExport } from '@/hooks/usePropertyExport';
import { getPropertiesFromAssociations } from '@/components/properties/PropertyHelpers';
import FinancialReports from '@/components/reports/FinancialReports';
import PropertyReports from '@/components/reports/PropertyReports';
import ResidentReports from '@/components/reports/ResidentReports';
import ReportFilters from '@/components/reports/ReportFilters';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Reports = () => {
  // State for reports
  const [reports, setReports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState<'financial' | 'property' | 'resident'>('financial');
  const [timeRange, setTimeRange] = useState('year');
  const [association, setAssociation] = useState('all');
  const [selectedReport, setSelectedReport] = useState('income-expense');
  const [isLoading, setIsLoading] = useState(false);
  
  const { associations } = useAssociations();
  
  // Get properties from associations
  const properties = associations && associations.length > 0 
    ? getPropertiesFromAssociations(associations) 
    : [];
  
  const { handleVisibleColumnsExport, handleTemplateDownload } = usePropertyExport(properties);
  
  // Load reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Mock data for reports
      const mockReports = [
        {
          id: '1',
          name: 'Monthly Income Statement',
          description: 'Financial performance for the current month',
          type: 'financial',
          format: 'pdf',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Property Occupancy Report',
          description: 'Current occupancy rates across all properties',
          type: 'property',
          format: 'excel',
          createdAt: new Date()
        },
        {
          id: '3',
          name: 'Resident Demographics',
          description: 'Analysis of resident demographics and trends',
          type: 'resident',
          format: 'pdf',
          createdAt: new Date()
        },
        {
          id: '4',
          name: 'Annual Budget Report',
          description: 'Budget vs actual for the current year',
          type: 'financial',
          format: 'excel',
          createdAt: new Date()
        },
        {
          id: '5',
          name: 'Maintenance Request Summary',
          description: 'Overview of maintenance requests by property',
          type: 'property',
          format: 'pdf',
          createdAt: new Date()
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the association change
  const handleAssociationChange = useCallback((newAssociation: string) => {
    console.log("Reports page: Changing association to", newAssociation);
    setAssociation(newAssociation);
  }, []);
  
  // Track association changes for debugging
  useEffect(() => {
    console.log("Reports page: association is now", association);
  }, [association]);
  
  const handleExport = () => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to generate the export
      setTimeout(() => {
        toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Export failed");
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setIsLoading(true);
    try {
      // This would open a modal with report parameters in a real app
      setTimeout(() => {
        toast.success("Report generated successfully");
        fetchReports(); // Refresh the reports list
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (report: any) => {
    toast.success(`${report.name} downloaded`);
  };

  const handlePrintReport = (report: any) => {
    toast.success("Preparing report for printing...");
  };

  const handleRefreshData = () => {
    fetchReports();
    toast.success("Reports data refreshed");
  };

  // Reset selected report when report type changes
  const handleReportTypeChange = (type: 'financial' | 'property' | 'resident') => {
    setReportType(type);
    
    // Set default report for each type
    if (type === 'financial') setSelectedReport('income-expense');
    if (type === 'property') setSelectedReport('overview');
    if (type === 'resident') setSelectedReport('resident-overview');
  };

  // Filter reports by search query
  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Generate and analyze reports across your properties</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleRefreshData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button className="gap-2" onClick={handleExport} disabled={isLoading}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      {/* Report Type Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer hover:border-primary/50 transition-colors ${reportType === 'financial' ? 'border-primary' : ''}`}
          onClick={() => handleReportTypeChange('financial')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Financial Reports</CardTitle>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
              <BarChartIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base font-medium">Income & expense reports</div>
            <p className="text-xs text-muted-foreground">View financial performance over time</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:border-primary/50 transition-colors ${reportType === 'property' ? 'border-primary' : ''}`}
          onClick={() => handleReportTypeChange('property')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Property Reports</CardTitle>
            <div className="bg-green-50 text-green-600 p-2 rounded-full">
              <Building className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base font-medium">Property statistics</div>
            <p className="text-xs text-muted-foreground">Track property metrics and occupancy</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:border-primary/50 transition-colors ${reportType === 'resident' ? 'border-primary' : ''}`}
          onClick={() => handleReportTypeChange('resident')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Resident Reports</CardTitle>
            <div className="bg-purple-50 text-purple-600 p-2 rounded-full">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base font-medium">Resident analytics</div>
            <p className="text-xs text-muted-foreground">Monitor resident data and trends</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Configure report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium">Association</label>
              <Select value={association} onValueChange={handleAssociationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select association" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Associations</SelectItem>
                  <SelectItem value="oakwood">Oakwood HOA</SelectItem>
                  <SelectItem value="pinecrest">Pinecrest Condos</SelectItem>
                  <SelectItem value="riverdale">Riverdale Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportType === 'financial' && (
                    <>
                      <SelectItem value="income-expense">Income & Expense</SelectItem>
                      <SelectItem value="balance">Balance Sheet</SelectItem>
                      <SelectItem value="cash-flow">Cash Flow</SelectItem>
                      <SelectItem value="accounts-receivable">Accounts Receivable</SelectItem>
                      <SelectItem value="accounts-payable">Accounts Payable</SelectItem>
                    </>
                  )}
                  
                  {reportType === 'property' && (
                    <>
                      <SelectItem value="overview">Property Overview</SelectItem>
                      <SelectItem value="occupancy">Occupancy</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="amenities">Amenities Usage</SelectItem>
                    </>
                  )}
                  
                  {reportType === 'resident' && (
                    <>
                      <SelectItem value="resident-overview">Resident Overview</SelectItem>
                      <SelectItem value="demographics">Demographics</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="communications">Communications</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleGenerateReport} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Content */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>
            {reportType === 'financial' && 'Financial Reports'}
            {reportType === 'property' && 'Property Reports'}
            {reportType === 'resident' && 'Resident Reports'}
          </CardTitle>
          <CardDescription>
            {reportType === 'financial' && 'View and analyze financial data across properties'}
            {reportType === 'property' && 'Analyze property metrics and performance'}
            {reportType === 'resident' && 'Explore resident statistics and trends'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportType === 'financial' && (
            <FinancialReports 
              timeRange={timeRange} 
              association={association}
              selectedReport={selectedReport}
            />
          )}
          
          {reportType === 'property' && (
            <PropertyReports 
              properties={properties}
              timeRange={timeRange} 
              association={association} 
              onExport={handleVisibleColumnsExport}
              onTemplateDownload={handleTemplateDownload}
              selectedReport={selectedReport}
            />
          )}
          
          {reportType === 'resident' && (
            <ResidentReports 
              timeRange={timeRange} 
              association={association}
              selectedReport={selectedReport}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Recent and Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Access your recently generated reports
          </CardDescription>
          <div className="mt-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {report.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrintReport(report)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleGenerateReport}
              >
                Generate New Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
