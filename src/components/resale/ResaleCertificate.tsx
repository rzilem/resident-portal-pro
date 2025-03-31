
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Download, Plus, Filter, Search, Eye, FileText, Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { generateResaleCertificate, ResaleCertificateData } from '@/utils/pdfGenerator';

// Sample data for resale certificates
const sampleCertificates = [
  {
    id: 'RC-2025-001',
    propertyAddress: '123 Main St, Austin, TX 78701',
    unitNumber: '101',
    associationName: 'Downtown Living HOA',
    ownerName: 'John Smith',
    purchaserName: 'Alice Johnson',
    closingDate: '05/15/2025',
    assessmentAmount: '$250.00',
    outstandingDues: '$0.00',
    specialAssessments: 'None',
    certifiedBy: 'Robert Wilson',
    certificationDate: '03/20/2025',
    status: 'Active',
    createdAt: '03/18/2025',
  },
  {
    id: 'RC-2025-002',
    propertyAddress: '456 Oak Ave, Austin, TX 78704',
    unitNumber: '202',
    associationName: 'Sunset Ridge Condos',
    ownerName: 'Michael Johnson',
    purchaserName: 'David Williams',
    closingDate: '04/30/2025',
    assessmentAmount: '$325.00',
    outstandingDues: '$325.00',
    specialAssessments: '$500.00 - Pool renovation',
    certifiedBy: 'Robert Wilson',
    certificationDate: '03/15/2025',
    status: 'Active',
    createdAt: '03/15/2025',
  },
  {
    id: 'RC-2025-003',
    propertyAddress: '789 Pine Rd, Round Rock, TX 78665',
    unitNumber: '303',
    associationName: 'Pinewood Estates',
    ownerName: 'Emily Davis',
    purchaserName: 'Sarah Miller',
    closingDate: '06/10/2025',
    assessmentAmount: '$175.00',
    outstandingDues: '$0.00',
    specialAssessments: 'None',
    certifiedBy: 'Robert Wilson',
    certificationDate: '03/22/2025',
    status: 'Active',
    createdAt: '03/22/2025',
  },
];

const ResaleCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [certificates, setCertificates] = useState(sampleCertificates);

  // Filter certificates based on search term and status
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cert.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.associationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleGeneratePdf = (cert: any) => {
    const certData: ResaleCertificateData = {
      propertyAddress: cert.propertyAddress,
      unitNumber: cert.unitNumber,
      associationName: cert.associationName,
      ownerName: cert.ownerName,
      purchaserName: cert.purchaserName,
      closingDate: cert.closingDate,
      assessmentAmount: cert.assessmentAmount,
      outstandingDues: cert.outstandingDues,
      specialAssessments: cert.specialAssessments,
      certifiedBy: cert.certifiedBy,
      certificationDate: cert.certificationDate,
    };

    const doc = generateResaleCertificate(certData);
    doc.save(`${cert.id}_resale_certificate.pdf`);
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Resale Certificates</CardTitle>
            <CardDescription>Generate and manage resale certificates for property transfers</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => navigate('/resale/wizard')}>
            <Plus className="h-4 w-4" />
            New Certificate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, address, owner, or association..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Association</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.id}</TableCell>
                    <TableCell className="max-w-[250px] truncate" title={cert.propertyAddress}>
                      {cert.propertyAddress}
                    </TableCell>
                    <TableCell>{cert.associationName}</TableCell>
                    <TableCell>{cert.ownerName}</TableCell>
                    <TableCell>{cert.closingDate}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          cert.status === 'Active' ? 'bg-green-500' : 
                          cert.status === 'Expired' ? 'bg-red-500' : 
                          'bg-yellow-500'
                        }
                      >
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{cert.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {}} 
                          title="View Certificate Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleGeneratePdf(cert)} 
                          title="Download PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {}} 
                          title="Edit Certificate"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCertificate(cert.id)} 
                          title="Delete Certificate"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No certificates found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResaleCertificate;
