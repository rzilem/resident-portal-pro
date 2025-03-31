
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, FileCheck, FileQuestion, FileSearch, BarChart2, PieChart, Download, Calendar, Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateReport } from '@/utils/pdfGenerator';

const Reports = () => {
  const [reportType, setReportType] = useState('resale-summary');
  const [dateRange, setDateRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    let title, subtitle, columns, data, summary;

    // Based on report type, set appropriate data
    switch (reportType) {
      case 'resale-summary':
        title = 'Resale Certificate Summary Report';
        subtitle = `${dateRange === 'custom' ? `${startDate} to ${endDate}` : 'Monthly Summary - March 2025'}`;
        columns = ['Association', 'Total Certificates', 'In Progress', 'Completed', 'Revenue'];
        data = [
          ['Stonehaven Condos', 14, 3, 11, '$4,200'],
          ['La Ventana Ranch', 8, 1, 7, '$2,450'],
          ['Enclave at Alta Vista', 12, 4, 8, '$3,600'],
          ['Chandler Creek HOA', 6, 0, 6, '$1,800'],
          ['Towne Court', 9, 2, 7, '$2,700'],
        ];
        summary = {
          'Total Certificates': '49',
          'Average Completion Time': '3.2 days',
          'Total Revenue': '$14,750',
          'Period': 'March 1-31, 2025'
        };
        break;

      case 'questionnaire-summary':
        title = 'Questionnaire Summary Report';
        subtitle = `${dateRange === 'custom' ? `${startDate} to ${endDate}` : 'Monthly Summary - March 2025'}`;
        columns = ['Association', 'Total Questionnaires', 'In Progress', 'Completed', 'Revenue'];
        data = [
          ['Stonehaven Condos', 8, 2, 6, '$2,400'],
          ['La Ventana Ranch', 5, 1, 4, '$1,600'],
          ['Enclave at Alta Vista', 7, 3, 4, '$2,100'],
          ['Chandler Creek HOA', 4, 0, 4, '$1,200'],
          ['Towne Court', 6, 1, 5, '$1,800'],
        ];
        summary = {
          'Total Questionnaires': '30',
          'Average Completion Time': '2.8 days',
          'Total Revenue': '$9,100',
          'Period': 'March 1-31, 2025'
        };
        break;

      case 'transaction-log':
        title = 'Transaction Log Report';
        subtitle = `${dateRange === 'custom' ? `${startDate} to ${endDate}` : 'Monthly Log - March 2025'}`;
        columns = ['Transaction ID', 'Date', 'Property', 'Type', 'Status', 'Amount'];
        data = [
          ['TRX-2025-001', '03/05/2025', '123 Main St #101', 'Resale Certificate', 'Completed', '$300'],
          ['TRX-2025-002', '03/07/2025', '456 Oak Ave #202', 'Questionnaire', 'Completed', '$250'],
          ['TRX-2025-003', '03/10/2025', '789 Pine Rd #303', 'Resale Certificate', 'Completed', '$300'],
          ['TRX-2025-004', '03/15/2025', '321 Elm St #404', 'TREC Form', 'Completed', '$200'],
          ['TRX-2025-005', '03/20/2025', '654 Birch Ln #505', 'Inspection', 'In Progress', '$350'],
        ];
        summary = {
          'Total Transactions': '35',
          'Completed Transactions': '28',
          'Total Revenue': '$9,750',
          'Period': 'March 1-31, 2025'
        };
        break;

      default:
        title = 'Custom Report';
        subtitle = 'Generated on ' + new Date().toLocaleDateString();
        columns = ['Item', 'Value'];
        data = [['No data available', '']];
        break;
    }

    // Generate the report
    const doc = generateReport({
      title,
      subtitle,
      date: new Date().toLocaleDateString(),
      columns,
      data,
      summary
    });

    // Download the PDF
    doc.save(`${reportType}_${dateRange}_report.pdf`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and analyze reports for your resale management operations</p>
        </div>
        <Button className="gap-2" onClick={handleGenerateReport}>
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="standard-reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard-reports" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Standard Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="custom-reports" className="flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard-reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Select report type and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resale-summary">Resale Certificate Summary</SelectItem>
                        <SelectItem value="questionnaire-summary">Questionnaire Summary</SelectItem>
                        <SelectItem value="transaction-log">Transaction Log</SelectItem>
                        <SelectItem value="revenue-report">Revenue Report</SelectItem>
                        <SelectItem value="performance-metrics">Performance Metrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Include Data For</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select data scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Associations</SelectItem>
                        <SelectItem value="selected">Selected Associations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Output Format</label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Select output format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full gap-2" onClick={handleGenerateReport}>
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setReportType('resale-summary')}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <FileCheck className="h-8 w-8 text-blue-500" />
                  <Badge>Popular</Badge>
                </div>
                <CardTitle className="text-xl">Resale Certificate Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Summarizes resale certificate activity for a given period</CardDescription>
                <Button variant="link" className="mt-2 p-0" onClick={() => setReportType('resale-summary')}>
                  Select Report
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setReportType('questionnaire-summary')}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <FileQuestion className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-xl">Questionnaire Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Provides details on questionnaire processing and completion</CardDescription>
                <Button variant="link" className="mt-2 p-0" onClick={() => setReportType('questionnaire-summary')}>
                  Select Report
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setReportType('transaction-log')}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-xl">Transaction Log</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Detailed log of all resale management transactions</CardDescription>
                <Button variant="link" className="mt-2 p-0" onClick={() => setReportType('transaction-log')}>
                  Select Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Visual reports and key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">Analytics Dashboard Coming Soon</h3>
                <p className="text-muted-foreground">Advanced analytics features are under development.</p>
                <Button variant="outline">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Design your own custom reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <FileSearch className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">Custom Report Builder Coming Soon</h3>
                <p className="text-muted-foreground">Build tailored reports with our advanced reporting tool.</p>
                <Button variant="outline">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Quick access to your recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">Resale Certificate Summary - March 2025</p>
                  <p className="text-xs text-muted-foreground">Generated on March 31, 2025</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-medium">Questionnaire Summary - March 2025</p>
                  <p className="text-xs text-muted-foreground">Generated on March 31, 2025</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium">Transaction Log - Q1 2025</p>
                  <p className="text-xs text-muted-foreground">Generated on March 30, 2025</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
