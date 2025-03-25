
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatDate } from './utils/formatters';

interface MeetingReportProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const MeetingReport = ({ timeRange, association, selectedReport }: MeetingReportProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {selectedReport === 'meeting-signin' ? 'Meeting Sign-in Report' : 'Meeting Sign-In (Consolidated)'}
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Sign-in Sheet
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meeting Date</TableHead>
            <TableHead>Meeting Type</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Quorum Met</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Minutes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { date: '2023-07-15', type: 'Regular Board Meeting', attendance: 35, quorum: true, duration: '1h 45m', minutes: true },
            { date: '2023-06-20', type: 'Special Meeting', attendance: 42, quorum: true, duration: '1h 15m', minutes: true },
            { date: '2023-05-18', type: 'Regular Board Meeting', attendance: 28, quorum: true, duration: '2h 00m', minutes: true },
            { date: '2023-04-15', type: 'Annual Meeting', attendance: 65, quorum: true, duration: '2h 30m', minutes: true },
            { date: '2023-03-20', type: 'Regular Board Meeting', attendance: 31, quorum: true, duration: '1h 30m', minutes: true },
            { date: '2023-02-18', type: 'Regular Board Meeting', attendance: 26, quorum: false, duration: '1h 40m', minutes: true },
            { date: '2023-01-21', type: 'Budget Approval', attendance: 45, quorum: true, duration: '2h 15m', minutes: true },
          ].map((meeting, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(meeting.date)}</TableCell>
              <TableCell>{meeting.type}</TableCell>
              <TableCell>{meeting.attendance} residents</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  meeting.quorum ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {meeting.quorum ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>{meeting.duration}</TableCell>
              <TableCell>
                <Button variant="link" className="p-0 h-auto">
                  {meeting.minutes ? 'View Minutes' : 'Pending'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-base font-medium mb-4">Meeting Attendance Trend</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: 'Jan', attendance: 45 },
                  { month: 'Feb', attendance: 26 },
                  { month: 'Mar', attendance: 31 },
                  { month: 'Apr', attendance: 65 },
                  { month: 'May', attendance: 28 },
                  { month: 'Jun', attendance: 42 },
                  { month: 'Jul', attendance: 35 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" name="Attendance" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-base font-medium">Meeting Statistics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">Average Attendance</h4>
                <p className="text-2xl font-bold mt-1">39</p>
                <p className="text-xs text-green-600 mt-1">+12% vs. last year</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">Quorum Rate</h4>
                <p className="text-2xl font-bold mt-1">86%</p>
                <p className="text-xs text-green-600 mt-1">6/7 meetings</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Meeting Insights</h4>
            <ul className="space-y-1 text-sm">
              <li>• Virtual attendance option increased overall participation by 28%</li>
              <li>• Annual meeting had the highest attendance of the year</li>
              <li>• Budget meetings consistently show higher-than-average attendance</li>
              <li>• Pre-meeting email reminders improved attendance by approximately 15%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingReport;
