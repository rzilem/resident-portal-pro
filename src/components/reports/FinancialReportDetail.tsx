import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Printer, Share2 } from 'lucide-react';
import ReportFilters from './ReportFilters';
import { useAssociations } from '@/hooks/use-associations';
import { useToast } from '@/components/ui/use-toast';
import { reportDataService } from '@/services/ReportDataService';
import BankBalancesReport from './financial/BankBalancesReport';
import IncomeExpenseReport from './financial/IncomeExpenseReport';
import CashFlowReport from './financial/CashFlowReport';
import CashForecastReport from './financial/CashForecastReport';
import BillingReport from './financial/BillingReport';
import { adaptAssociationsToFullType } from '@/utils/type-adapters';

const FinancialReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { associations } = useAssociations();
  
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [association, setAssociation] = useState('all');
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // Get data from our service with the current association id
        const data = await reportDataService.getReportData(reportId || '', association, timeRange);
        
        setReportData({
          title: formatReportName(reportId || ''),
          description: 'Financial report details',
          data: data
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report data. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    if (reportId) {
      fetchReportData();
    }
  }, [reportId, toast, association, timeRange]);
  
  const formatReportName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const handleExport = (format: string) => {
    toast({
      title: 'Export Started',
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Your report has been downloaded.',
      });
    }, 2000);
  };
  
  const renderReportContent = () => {
    if (!reportData) return null;
    
    // Return different report components based on the reportId
    switch(reportId) {
      case 'bank-balances':
        return <BankBalancesReport timeRange={timeRange} association={association} />;
      case 'income-expense':
        return <IncomeExpenseReport timeRange={timeRange} association={association} />;
      case 'cash-flow':
        return <CashFlowReport timeRange={timeRange} association={association} />;
      case 'cash-forecast':
        return <CashForecastReport timeRange={timeRange} association={association} />;
      case 'admin-billing':
      case 'billing-report':
        return <BillingReport timeRange={timeRange} association={association} reportType={reportId as any} />;
      default:
        return (
          <div className="border rounded-md p-4 bg-accent/5">
            <h3 className="text-lg font-medium mb-2">Sample Report Data for {formatReportName(reportId || '')}</h3>
            <p className="mb-4">This is sample content for the report. In the full implementation, detailed data and visualizations would be displayed based on the selected time range and association.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-medium mb-2">Report Summary</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Income:</span>
                    <span className="text-sm font-medium">${reportData.data.summary.totalIncome.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Expenses:</span>
                    <span className="text-sm font-medium">${reportData.data.summary.totalExpenses.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Net Income:</span>
                    <span className="text-sm font-medium">${reportData.data.summary.netIncome.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Assets:</span>
                    <span className="text-sm font-medium">${reportData.data.summary.totalAssets.toLocaleString()}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-medium mb-2">Report Details</h4>
                <p className="text-sm mb-2">
                  Association: {association === 'all' ? 'All Associations' : `Association ${association}`}
                </p>
                <p className="text-sm mb-2">
                  Time Range: {timeRange === 'month' ? 'This Month' : 
                              timeRange === 'quarter' ? 'This Quarter' : 
                              timeRange === 'year' ? 'This Year' : 
                              timeRange === '90days' ? 'Last 90 Days' : 'Custom Range'}
                </p>
                <p className="text-sm">
                  Generated on: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{formatReportName(reportId || '')}</h1>
          <p className="text-muted-foreground">Financial report details and visualization</p>
        </div>
      </div>
      
      <ReportFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        association={association}
        setAssociation={setAssociation}
        associations={adaptAssociationsToFullType(associations)}
        reportType="financial"
        selectedReport={reportId || ''}
        setSelectedReport={() => {}}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{formatReportName(reportId || '')}</CardTitle>
            <CardDescription>
              Financial report for {association === 'all' ? 'all associations' : `association ${association}`}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportDetail;
