import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Printer, Share2 } from 'lucide-react';
import ReportFilters from './ReportFilters';
import { useAssociations } from '@/hooks/use-associations';
import { useToast } from '@/components/ui/use-toast';
import { sampleReportDataService } from '@/services/SampleReportDataService';
import PropertyOverviewReport from './property/PropertyOverviewReport';
import WorkOrderReport from './property/WorkOrderReport';
import ARCReport from './property/ARCReport';
import PropertyListReport from './property/PropertyListReport';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import { adaptAssociationsToFullType } from '@/utils/type-adapters';

const PropertyReportDetail = () => {
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
          const properties = sampleReportDataService.getPropertyData(reportId || '', association);
          const violations = sampleReportDataService.getViolationData(reportId || '', association);
          
          setReportData({
            title: formatReportName(reportId || ''),
            description: 'Property report details',
            properties,
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
  
  const handleExportColumns = (columns: PropertyColumn[]) => {
    toast({
      title: 'Exporting with custom columns',
      description: `Exporting ${columns.filter(c => c.checked).length} selected columns...`
    });
    
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Your report has been downloaded with the selected columns.',
      });
    }, 2000);
  };
  
  const renderReportContent = () => {
    if (!reportData) return null;
    
    // Return different report components based on the reportId
    switch(reportId) {
      case 'overview':
        return <PropertyOverviewReport timeRange={timeRange} association={association} />;
      case 'work-order':
        return <WorkOrderReport timeRange={timeRange} association={association} onExport={handleExportColumns} />;
      case 'arc-report':
        return <ARCReport timeRange={timeRange} association={association} onExport={handleExportColumns} />;
      case 'association-list':
        return <PropertyListReport properties={reportData.properties} timeRange={timeRange} association={association} />;
      default:
        return (
          <div className="border rounded-md p-4 bg-accent/5">
            <h3 className="text-lg font-medium mb-2">Sample Report Data for {formatReportName(reportId || '')}</h3>
            <p className="mb-4">This is sample content for the report. In the full implementation, detailed property data and visualizations would be displayed based on the selected time range and association.</p>
            
            <h4 className="text-base font-medium mt-4 mb-2">Properties</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Annual Fees
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.properties.map((property: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {property.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.units}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${property.annualFees.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {reportData.violations && reportData.violations.length > 0 && (
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
          <p className="text-muted-foreground">Property report details and visualization</p>
        </div>
      </div>
      
      <ReportFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        association={association}
        setAssociation={setAssociation}
        associations={adaptAssociationsToFullType(associations)}
        reportType="property"
        selectedReport={reportId || ''}
        setSelectedReport={() => {}}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{formatReportName(reportId || '')}</CardTitle>
            <CardDescription>
              Property report for {association === 'all' ? 'all associations' : `association ${association}`}
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

export default PropertyReportDetail;
