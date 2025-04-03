import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Printer, Share2 } from 'lucide-react';
import ReportFilters from './ReportFilters';
import { useAssociations } from '@/hooks/use-associations';
import { useToast } from '@/components/ui/use-toast';
import { sampleReportDataService } from '@/services/SampleReportDataService';
import { adaptAssociationsToFullType } from '@/utils/type-adapters';

const ResidentReportDetail = () => {
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
        // Get sample data from our service with the current association id
        setTimeout(() => {
          const residents = sampleReportDataService.getResidentData(reportId || '', association);
          const violations = reportId?.includes('violation') 
            ? sampleReportDataService.getViolationData(reportId, association) 
            : [];
          
          setReportData({
            title: formatReportName(reportId || ''),
            description: 'Resident report details',
            residents,
            violations
          });
          setIsLoading(false);
        }, 800);
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
  }, [reportId, toast, association]);
  
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
    
    // Special cases would go here for specific report types
    // For now, we'll render a general template
    
    return (
      <div className="border rounded-md p-4 bg-accent/5">
        <h3 className="text-lg font-medium mb-2">Sample Report Data for {formatReportName(reportId || '')}</h3>
        <p className="mb-4">This is sample content for the {formatReportName(reportId || '')} report. In the full implementation, detailed resident data and visualizations would be displayed based on the selected time range and association.</p>
        
        <h4 className="text-base font-medium mt-4 mb-2">Residents</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Move In Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.residents.map((resident: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {resident.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resident.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resident.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resident.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {resident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(resident.moveInDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resident.email}<br />
                    {resident.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reportId?.includes('violation') && reportData.violations && reportData.violations.length > 0 && (
          <>
            <h4 className="text-base font-medium mt-6 mb-2">Violations</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.violations.map((violation: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {violation.property}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {violation.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(violation.reportedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          violation.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {violation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {violation.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-medium mb-2">Report Summary</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Residents:</span>
                <span className="text-sm font-medium">{reportData.residents.length}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Residents:</span>
                <span className="text-sm font-medium">
                  {reportData.residents.filter((r: any) => r.status === 'Current').length}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Owners:</span>
                <span className="text-sm font-medium">
                  {reportData.residents.filter((r: any) => r.type === 'Owner').length}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tenants:</span>
                <span className="text-sm font-medium">
                  {reportData.residents.filter((r: any) => r.type === 'Tenant').length}
                </span>
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
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{formatReportName(reportId || '')}</h1>
          <p className="text-muted-foreground">Resident report details and visualization</p>
        </div>
      </div>
      
      <ReportFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        association={association}
        setAssociation={setAssociation}
        associations={adaptAssociationsToFullType(associations)}
        reportType="resident"
        selectedReport={reportId || ''}
        setSelectedReport={() => {}}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{formatReportName(reportId || '')}</CardTitle>
            <CardDescription>
              Resident report for {association === 'all' ? 'all associations' : `association ${association}`}
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

export default ResidentReportDetail;
