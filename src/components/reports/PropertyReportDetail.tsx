
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Printer, Share2 } from 'lucide-react';
import ReportFilters from './ReportFilters';
import { useAssociations } from '@/hooks/use-associations';
import { useToast } from '@/components/ui/use-toast';

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
        // This would be an API call to fetch the report data
        setTimeout(() => {
          setReportData({
            title: formatReportName(reportId || ''),
            description: 'Property report details',
            data: [
              // sample data would go here
            ]
          });
          setIsLoading(false);
        }, 1500);
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
  }, [reportId, toast]);
  
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
        associations={associations}
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
          ) : (
            <div>
              {/* Render report content here */}
              <p className="mb-4">Report content would be displayed here, with data visualizations, tables, and other relevant information.</p>
              
              <div className="border rounded-md p-4 bg-accent/5">
                <h3 className="text-lg font-medium mb-2">Sample Report Data</h3>
                <p>This is placeholder content for the {formatReportName(reportId || '')} report.</p>
                <p className="mt-2">The actual implementation would include detailed property data and visualizations based on the selected time range and association.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyReportDetail;
