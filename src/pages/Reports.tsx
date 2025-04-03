import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Download, Filter, BarChart, PieChart, LineChart, RefreshCw, Clipboard, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

import ReportFilters from '@/components/reports/ReportFilters';
import ReportsList from '@/components/reports/ReportsList';
import ReportViewer from '@/components/reports/ReportViewer';
import ReportDashboard from '@/components/reports/ReportDashboard';
import { useAssociations } from '@/hooks/use-associations';
import { Association } from '@/types/association';
import { exportToExcel } from '@/utils/exportToExcel';
import { adaptAssociationToFullType, adaptAssociationsToFullType } from '@/utils/type-adapters';

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { associations } = useAssociations();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [timeRange, setTimeRange] = useState<string>('month');
  const [association, setAssociation] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportType, setReportType] = useState<'financial' | 'property' | 'resident'>('financial');
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  useEffect(() => {
    if (association === 'all') {
      setSelectedAssociation(null);
    } else {
      const found = associations.find(a => a.id === association);
      setSelectedAssociation(found || null);
    }
    
    console.log("Selected association changed to:", association);
  }, [association, associations]);
  
  useEffect(() => {
    setSelectedReport('');
  }, [reportType]);
  
  const handleRunReport = (report: string) => {
    setIsGeneratingReport(true);
    setSelectedReport(report);
    
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Report Generated",
        description: `${report} has been generated successfully.`,
      });
    }, 1500);
  };
  
  const handleExportReport = (format: 'pdf' | 'excel') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your report is being prepared for download."
    });
    
    setTimeout(() => {
      if (format === 'excel') {
        const data = [
          { 
            'Date': '2023-01-01', 
            'Amount': '$1,000.00', 
            'Category': 'Income',
            'Association': selectedAssociation?.name || 'All Associations'
          },
          // Add more rows...
        ];
        
        exportToExcel(data, `${selectedReport || 'report'}-${new Date().toISOString().slice(0, 10)}`);
      }
      
      toast({
        title: "Export Complete",
        description: `Your report has been exported as ${format.toUpperCase()}.`
      });
    }, 2000);
  };
  
  const handleAssociationChange = (association: Association) => {
    setSelectedAssociation(() => association);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate, view, and manage association reports</p>
        </div>
        
        <div className="flex gap-2">
          <TooltipButton 
            variant="outline" 
            className="gap-2"
            tooltipText="Refresh report data"
            onClick={() => {
              toast({
                title: "Data Refreshed",
                description: "Report data has been updated"
              });
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </TooltipButton>
          
          <TooltipButton 
            className="gap-2"
            tooltipText="Open monthly report workflow builder"
            onClick={() => navigate('/workflows?tab=builder&report=true')}
          >
            <Clipboard className="h-4 w-4" />
            Monthly Report Workflow
          </TooltipButton>
        </div>
      </div>
      
      <ReportFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        association={association}
        setAssociation={setAssociation}
        associations={adaptAssociationsToFullType(associations)}
        reportType={reportType}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="financial" onClick={() => setReportType('financial')}>
            Financial Reports
          </TabsTrigger>
          <TabsTrigger value="property" onClick={() => setReportType('property')}>
            Property Reports
          </TabsTrigger>
          <TabsTrigger value="resident" onClick={() => setReportType('resident')}>
            Resident Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <ReportDashboard 
            association={association}
            timeRange={timeRange}
            onRunReport={handleRunReport}
          />
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>View and generate financial reports for your associations</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsList 
                type="financial" 
                onRunReport={handleRunReport}
                selectedAssociation={selectedAssociation}
              />
            </CardContent>
          </Card>
          
          {selectedReport && (
            <ReportViewer 
              reportType="financial"
              reportName={selectedReport}
              association={association}
              timeRange={timeRange}
              isLoading={isGeneratingReport}
              onExport={handleExportReport}
            />
          )}
        </TabsContent>
        
        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Reports</CardTitle>
              <CardDescription>View and generate property-related reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsList 
                type="property" 
                onRunReport={handleRunReport}
                selectedAssociation={selectedAssociation}
              />
            </CardContent>
          </Card>
          
          {selectedReport && (
            <ReportViewer 
              reportType="property"
              reportName={selectedReport}
              association={association}
              timeRange={timeRange}
              isLoading={isGeneratingReport}
              onExport={handleExportReport}
            />
          )}
        </TabsContent>
        
        <TabsContent value="resident" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resident Reports</CardTitle>
              <CardDescription>View and generate resident-related reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsList 
                type="resident" 
                onRunReport={handleRunReport}
                selectedAssociation={selectedAssociation}
              />
            </CardContent>
          </Card>
          
          {selectedReport && (
            <ReportViewer 
              reportType="resident"
              reportName={selectedReport}
              association={association}
              timeRange={timeRange}
              isLoading={isGeneratingReport}
              onExport={handleExportReport}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
