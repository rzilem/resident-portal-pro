
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, HelpCircle, Mail, Users, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface ResidentReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const ResidentReports = ({ timeRange, association, selectedReport }: ResidentReportsProps) => {
  // Sample resident data
  const residentData = [
    { id: 1, name: 'John Smith', property: 'Oakwood Residence', unit: '101', status: 'Owner', moveInDate: '2020-05-15', email: 'john@example.com', phone: '555-123-4567' },
    { id: 2, name: 'Jane Doe', property: 'Willow Heights', unit: '205', status: 'Tenant', moveInDate: '2021-08-10', email: 'jane@example.com', phone: '555-987-6543' },
    { id: 3, name: 'Robert Johnson', property: 'Cedar Point', unit: '310', status: 'Owner', moveInDate: '2018-03-22', email: 'robert@example.com', phone: '555-456-7890' },
    { id: 4, name: 'Mary Williams', property: 'Maple Grove', unit: '402', status: 'Tenant', moveInDate: '2022-01-05', email: 'mary@example.com', phone: '555-234-5678' },
    { id: 5, name: 'David Brown', property: 'Birchwood Court', unit: '115', status: 'Owner', moveInDate: '2019-07-12', email: 'david@example.com', phone: '555-876-5432' },
    { id: 6, name: 'Sarah Miller', property: 'Pine Valley', unit: '220', status: 'Owner', moveInDate: '2017-11-30', email: 'sarah@example.com', phone: '555-345-6789' },
    { id: 7, name: 'Michael Davis', property: 'Oakwood Residence', unit: '102', status: 'Tenant', moveInDate: '2021-04-18', email: 'michael@example.com', phone: '555-654-3210' },
    { id: 8, name: 'Jennifer Garcia', property: 'Willow Heights', unit: '210', status: 'Owner', moveInDate: '2020-09-05', email: 'jennifer@example.com', phone: '555-789-0123' },
  ];

  // Sample board members data
  const boardMembersData = [
    { id: 1, name: 'Robert Johnson', property: 'Cedar Point', unit: '310', position: 'President', startDate: '2022-01-05', email: 'robert@example.com', phone: '555-456-7890' },
    { id: 2, name: 'Sarah Miller', property: 'Pine Valley', unit: '220', position: 'Vice President', startDate: '2022-01-05', email: 'sarah@example.com', phone: '555-345-6789' },
    { id: 3, name: 'David Brown', property: 'Birchwood Court', unit: '115', position: 'Treasurer', startDate: '2022-01-05', email: 'david@example.com', phone: '555-876-5432' },
    { id: 4, name: 'Jennifer Garcia', property: 'Willow Heights', unit: '210', position: 'Secretary', startDate: '2022-01-05', email: 'jennifer@example.com', phone: '555-789-0123' },
    { id: 5, name: 'John Smith', property: 'Oakwood Residence', unit: '101', position: 'Member', startDate: '2022-01-05', email: 'john@example.com', phone: '555-123-4567' },
  ];

  // Sample transaction history data
  const transactionHistoryData = [
    { id: 'TRX-001', resident: 'John Smith', date: '2023-07-10', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-002', resident: 'Jane Doe', date: '2023-07-05', type: 'Late Fee', amount: 25, status: 'Paid' },
    { id: 'TRX-003', resident: 'Robert Johnson', date: '2023-07-01', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-004', resident: 'Mary Williams', date: '2023-06-30', type: 'Special Assessment', amount: 500, status: 'Unpaid' },
    { id: 'TRX-005', resident: 'David Brown', date: '2023-06-25', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-006', resident: 'Sarah Miller', date: '2023-06-20', type: 'Fine', amount: 100, status: 'Unpaid' },
    { id: 'TRX-007', resident: 'Michael Davis', date: '2023-06-15', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-008', resident: 'Jennifer Garcia', date: '2023-06-10', type: 'Amenity Fee', amount: 75, status: 'Paid' },
  ];

  // Sample resident status data for charts
  const residentStatusData = [
    { name: 'Owner-Occupied', value: 65 },
    { name: 'Tenant-Occupied', value: 25 },
    { name: 'Vacant', value: 10 },
  ];

  // Sample resident communication stats
  const communicationStatsData = [
    { month: 'Feb', emailOpen: 72, emailClick: 45, smsDelivery: 85 },
    { month: 'Mar', emailOpen: 75, emailClick: 48, smsDelivery: 88 },
    { month: 'Apr', emailOpen: 70, emailClick: 40, smsDelivery: 82 },
    { month: 'May', emailOpen: 78, emailClick: 52, smsDelivery: 90 },
    { month: 'Jun', emailOpen: 80, emailClick: 55, smsDelivery: 92 },
    { month: 'Jul', emailOpen: 82, emailClick: 58, smsDelivery: 93 },
  ];

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa'];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render different resident reports based on the selected report
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'resident-overview':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-base font-medium mb-4">Resident Status Distribution</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={residentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {residentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium mb-4">Communication Effectiveness</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={communicationStatsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="emailOpen" name="Email Open Rate" stroke="#4ade80" strokeWidth={2} />
                      <Line type="monotone" dataKey="emailClick" name="Email Click Rate" stroke="#60a5fa" strokeWidth={2} />
                      <Line type="monotone" dataKey="smsDelivery" name="SMS Delivery Rate" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Total Residents</h4>
                  <p className="text-2xl font-bold mt-1">345</p>
                  <p className="text-xs text-green-600 mt-1">+15 since last quarter</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Owner-Occupied</h4>
                  <p className="text-2xl font-bold mt-1">65%</p>
                  <p className="text-xs text-muted-foreground mt-1">224 properties</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Tenant-Occupied</h4>
                  <p className="text-2xl font-bold mt-1">25%</p>
                  <p className="text-xs text-muted-foreground mt-1">86 properties</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Vacant</h4>
                  <p className="text-2xl font-bold mt-1">10%</p>
                  <p className="text-xs text-amber-600 mt-1">35 properties</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h4 className="text-base font-medium mb-2">Resident Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm mb-2">
                    The community has maintained a healthy owner-occupancy rate of 65%, which is above the target of 60%. The vacancy rate has decreased by 2% compared to the previous quarter, indicating improved occupancy.
                  </p>
                  <p className="text-sm">
                    Resident engagement with digital communications has shown a positive trend, with email open rates increasing by 5% and SMS delivery rates remaining consistently above 90%.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">Key Resident Metrics</h5>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Residency Duration:</span>
                      <span className="text-sm font-medium">4.2 years</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">New Residents (YTD):</span>
                      <span className="text-sm font-medium">28</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Resident Turnover Rate:</span>
                      <span className="text-sm font-medium">8%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Digital Communication Opt-in:</span>
                      <span className="text-sm font-medium">92%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'contact-info':
      case 'all-addresses':
      case 'current-addresses':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                {selectedReport === 'contact-info' ? 'Homeowner Contact Information' : 
                 selectedReport === 'all-addresses' ? 'All Addresses Export' : 
                 'All Addresses (Current Resident) Export'}
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                {(selectedReport === 'all-addresses' || selectedReport === 'current-addresses') && (
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Generate Labels
                  </Button>
                )}
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Move-In Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residentData
                  .filter(resident => selectedReport !== 'current-addresses' || resident.status === 'Owner')
                  .map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="font-medium">{resident.name}</TableCell>
                    <TableCell>{resident.property}</TableCell>
                    <TableCell>{resident.unit}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        resident.status === 'Owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {resident.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(resident.moveInDate)}</TableCell>
                    <TableCell>{resident.email}</TableCell>
                    <TableCell>{resident.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h4 className="text-base font-medium">Export Notes</h4>
              </div>
              <p className="text-sm mb-2">
                This report contains personal contact information and should be handled according to privacy guidelines. The data is current as of {new Date().toLocaleDateString()}.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Email addresses and phone numbers should only be used for community-related communications</li>
                <li>• Personal data should not be shared with third parties without proper authorization</li>
                <li>• Check for recent opt-out requests before using contact information for mass communications</li>
              </ul>
            </div>
          </div>
        );
        
      case 'board-members':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                Board Members Directory
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Directory
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Board
                </Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boardMembersData.map((boardMember) => (
                  <TableRow key={boardMember.id}>
                    <TableCell className="font-medium">{boardMember.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        boardMember.position === 'President' ? 'bg-purple-100 text-purple-800' : 
                        boardMember.position === 'Vice President' ? 'bg-blue-100 text-blue-800' : 
                        boardMember.position === 'Treasurer' ? 'bg-green-100 text-green-800' : 
                        boardMember.position === 'Secretary' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {boardMember.position}
                      </span>
                    </TableCell>
                    <TableCell>{boardMember.property}</TableCell>
                    <TableCell>{boardMember.unit}</TableCell>
                    <TableCell>{formatDate(boardMember.startDate)}</TableCell>
                    <TableCell>{boardMember.email}</TableCell>
                    <TableCell>{boardMember.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Current Term</h4>
                  <p className="text-2xl font-bold mt-1">2023-2024</p>
                  <p className="text-xs text-muted-foreground mt-1">Ends on 12/31/2024</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Board Size</h4>
                  <p className="text-2xl font-bold mt-1">5 Members</p>
                  <p className="text-xs text-muted-foreground mt-1">Full capacity</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Next Election</h4>
                  <p className="text-2xl font-bold mt-1">Nov 15, 2024</p>
                  <p className="text-xs text-muted-foreground mt-1">Annual meeting</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'transaction-history':
      case 'transaction-by-charge':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                {selectedReport === 'transaction-history' ? 'Homeowner Transaction History' : 'Transaction History By Charge'}
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Transactions
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Resident</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionHistoryData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.resident}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-medium mb-4">Transaction Distribution by Type</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'HOA Fee', amount: 1000 },
                        { name: 'Late Fee', amount: 25 },
                        { name: 'Special Assessment', amount: 500 },
                        { name: 'Fine', amount: 100 },
                        { name: 'Amenity Fee', amount: 75 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="amount" name="Amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-base font-medium">Transaction Summary</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium">Total Collected</h4>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(
                        transactionHistoryData
                          .filter(t => t.status === 'Paid')
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}</p>
                      <p className="text-xs text-green-600 mt-1">75% collection rate</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium">Outstanding</h4>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(
                        transactionHistoryData
                          .filter(t => t.status === 'Unpaid')
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}</p>
                      <p className="text-xs text-amber-600 mt-1">25% of total billed</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Key Transaction Insights</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• HOA fee collection rate is 5% higher than same period last year</li>
                    <li>• Special assessments account for 29% of total transactions</li>
                    <li>• Late fees have decreased by 15% compared to previous quarter</li>
                    <li>• Online payment adoption has increased to 78% of all transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'meeting-signin':
      case 'meeting-consolidated':
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
        
      default:
        return (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Users className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Select a Resident Report</h3>
                <p className="text-muted-foreground">Choose a report type from the dropdown above to view resident data</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div>{renderReportContent()}</div>;
};

export default ResidentReports;
