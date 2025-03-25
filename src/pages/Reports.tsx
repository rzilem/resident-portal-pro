
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart as BarChartIcon,
  Building,
  Download,
  Filter,
  FileText,
  Users
} from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';
import { toast } from 'sonner';
import { usePropertyExport } from '@/hooks/usePropertyExport';
import { getPropertiesFromAssociations } from '@/components/properties/PropertyHelpers';
import FinancialReports from '@/components/reports/FinancialReports';
import PropertyReports from '@/components/reports/PropertyReports';
import ResidentReports from '@/components/reports/ResidentReports';
import ReportFilters from '@/components/reports/ReportFilters';

const Reports = () => {
  const [reportType, setReportType] = useState<'financial' | 'property' | 'resident'>('financial');
  const [timeRange, setTimeRange] = useState('year');
  const [association, setAssociation] = useState('all');
  const [selectedReport, setSelectedReport] = useState('income-expense');
  const { associations } = useAssociations();
  
  const properties = associations && associations.length > 0 
    ? getPropertiesFromAssociations(associations) 
    : [];
  
  const { handleVisibleColumnsExport, handleTemplateDownload } = usePropertyExport(properties);
  
  const handleExport = () => {
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
  };
  
  // Reset selected report when report type changes
  const handleReportTypeChange = (type: 'financial' | 'property' | 'resident') => {
    setReportType(type);
    
    // Set default report for each type
    if (type === 'financial') setSelectedReport('income-expense');
    if (type === 'property') setSelectedReport('overview');
    if (type === 'resident') setSelectedReport('resident-overview');
  };
  
  return (
    <div className="grid gap-4 md:gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Generate and analyze reports across your properties</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
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
      
      <ReportFilters 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        association={association}
        setAssociation={setAssociation}
        associations={associations || []}
        reportType={reportType}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />
      
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
    </div>
  );
};

export default Reports;
