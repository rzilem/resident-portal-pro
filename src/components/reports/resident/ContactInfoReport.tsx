
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download, Mail, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from './utils/formatters';

interface ContactInfoReportProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const ContactInfoReport = ({ timeRange, association, selectedReport }: ContactInfoReportProps) => {
  // Sample resident data
  const allResidentData = [
    { id: 1, name: 'John Smith', property: 'Oakwood Residence', unit: '101', status: 'Owner', moveInDate: '2020-05-15', email: 'john@example.com', phone: '555-123-4567', associationId: 'assoc1' },
    { id: 2, name: 'Jane Doe', property: 'Willow Heights', unit: '205', status: 'Tenant', moveInDate: '2021-08-10', email: 'jane@example.com', phone: '555-987-6543', associationId: 'assoc2' },
    { id: 3, name: 'Robert Johnson', property: 'Cedar Point', unit: '310', status: 'Owner', moveInDate: '2018-03-22', email: 'robert@example.com', phone: '555-456-7890', associationId: 'assoc3' },
    { id: 4, name: 'Mary Williams', property: 'Maple Grove', unit: '402', status: 'Tenant', moveInDate: '2022-01-05', email: 'mary@example.com', phone: '555-234-5678', associationId: '1' },
    { id: 5, name: 'David Brown', property: 'Birchwood Court', unit: '115', status: 'Owner', moveInDate: '2019-07-12', email: 'david@example.com', phone: '555-876-5432', associationId: '2' },
    { id: 6, name: 'Sarah Miller', property: 'Pine Valley', unit: '220', status: 'Owner', moveInDate: '2017-11-30', email: 'sarah@example.com', phone: '555-345-6789', associationId: '3' },
    { id: 7, name: 'Michael Davis', property: 'Oakwood Residence', unit: '102', status: 'Tenant', moveInDate: '2021-04-18', email: 'michael@example.com', phone: '555-654-3210', associationId: '1' },
    { id: 8, name: 'Jennifer Garcia', property: 'Willow Heights', unit: '210', status: 'Owner', moveInDate: '2020-09-05', email: 'jennifer@example.com', phone: '555-789-0123', associationId: '2' },
  ];
  
  const [filteredResidents, setFilteredResidents] = useState(allResidentData);

  // Filter residents when association changes
  useEffect(() => {
    console.log("ContactInfoReport: filtering by association", association);
    if (association === 'all') {
      setFilteredResidents(allResidentData);
    } else {
      setFilteredResidents(allResidentData.filter(resident => resident.associationId === association));
    }
  }, [association]);

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
          {filteredResidents
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
};

export default ContactInfoReport;
