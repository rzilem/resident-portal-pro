
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { jsPDF } from 'jspdf';

interface ReportViewerProps {
  reportType: 'financial' | 'property' | 'resident';
  reportName: string;
  association: string;
  timeRange: string;
  isLoading: boolean;
  onExport: (format: 'pdf' | 'excel') => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  reportType,
  reportName,
  association,
  timeRange,
  isLoading,
  onExport
}) => {
  const [data, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'table'>('bar');
  
  useEffect(() => {
    // This would be an API call in a real implementation
    // For now, we'll generate mock data based on the report type and name
    
    // Set a chart type based on the report
    if (reportName.includes('balance-sheet') || reportName.includes('billing')) {
      setChartType('bar');
    } else if (reportName.includes('forecast') || reportName.includes('trend')) {
      setChartType('line');
    } else if (reportName.includes('breakdown') || reportName.includes('percentages')) {
      setChartType('pie');
    } else {
      setChartType('table');
    }
    
    // Generate mock data
    if (reportType === 'financial') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setData(months.map(month => ({
        name: month,
        income: Math.floor(Math.random() * 40000) + 25000,
        expenses: Math.floor(Math.random() * 30000) + 15000,
        balance: Math.floor(Math.random() * 20000) + 10000,
      })));
    } else if (reportType === 'property') {
      setData([
        { name: 'Occupied', value: 75 },
        { name: 'Vacant', value: 15 },
        { name: 'Pending Sale', value: 10 },
      ]);
    } else {
      setData([
        { name: 'Owners', value: 65 },
        { name: 'Tenants', value: 30 },
        { name: 'Other', value: 5 },
      ]);
    }
  }, [reportType, reportName]);
  
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(`Report: ${reportName}`, 20, 20);
    doc.text(`Association: ${association === 'all' ? 'All Associations' : association}`, 20, 30);
    doc.text(`Time Range: ${timeRange}`, 20, 40);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Add some sample data
    doc.text('This is a sample report generated from the HOA management system.', 20, 70);
    
    // Save the PDF
    doc.save(`${reportName}.pdf`);
  };
  
  // Set colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-[350px] w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      );
    }
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4ade80" />
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
              {data[0]?.balance && <Bar dataKey="balance" name="Balance" fill="#60a5fa" />}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="income" name="Income" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} />
              {data[0]?.balance && <Line type="monotone" dataKey="balance" name="Balance" stroke="#60a5fa" strokeWidth={2} />}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'table':
        return (
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th 
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof value === 'number' && key !== 'id' 
                          ? key.toLowerCase().includes('time') || key.toLowerCase().includes('date')
                            ? new Date(value).toLocaleDateString() 
                            : `$${value.toLocaleString()}`
                          : String(value)
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      default:
        return <div>No preview available for this report type.</div>;
    }
  };
  
  // Format report name for display
  const formatReportName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-accent/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{formatReportName(reportName)}</CardTitle>
            <CardDescription>
              {association === 'all' ? 'All Associations' : `Association: ${association}`} | 
              Time Range: {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => onExport('pdf')}>
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => onExport('excel')}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
