
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Residents = () => {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Residents Management</h2>
          <p className="text-muted-foreground">View and manage all residents in your communities</p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Total Residents', value: '418', desc: 'Across all properties', icon: Users, color: 'bg-blue-50 text-blue-600' },
            { title: 'Active Accounts', value: '392', desc: '93.8% activation rate', icon: UserCheck, color: 'bg-green-50 text-green-600' },
            { title: 'Pending Approvals', value: '7', desc: 'New resident applications', icon: UserX, color: 'bg-amber-50 text-amber-600' },
          ].map((item, i) => (
            <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <div className={`${item.color} p-2 rounded-full`}>
                  <item.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Resident Directory</CardTitle>
            <CardDescription>
              Search and manage all residents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search residents..."
                  className="pl-8"
                />
              </div>
              <Button>Add Resident</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 101, name: 'Alice Johnson', unit: '301', property: 'Oakwood Heights', email: 'alice.j@example.com', status: 'Active' },
                  { id: 102, name: 'Robert Smith', unit: '142', property: 'Willow Creek Estates', email: 'robert.s@example.com', status: 'Active' },
                  { id: 103, name: 'Emily Davis', unit: '506', property: 'Riverfront Towers', email: 'emily.d@example.com', status: 'Active' },
                  { id: 201, name: 'Michael Wilson', unit: '203', property: 'Sunset Gardens', email: 'michael.w@example.com', status: 'Pending' },
                  { id: 202, name: 'Sarah Brown', unit: '118', property: 'Pine Valley Community', email: 'sarah.b@example.com', status: 'Active' },
                  { id: 301, name: 'David Miller', unit: '224', property: 'Oakwood Heights', email: 'david.m@example.com', status: 'Inactive' },
                ].map((resident, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/residents/${resident.id}`} 
                        className="text-primary hover:underline hover:text-primary/80 transition-colors"
                      >
                        {resident.name}
                      </Link>
                    </TableCell>
                    <TableCell>{resident.unit}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/properties?filter=${encodeURIComponent(resident.property)}`} 
                        className="hover:underline hover:text-primary/80 transition-colors"
                      >
                        {resident.property}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${resident.email}`} 
                        className="hover:underline hover:text-primary/80 transition-colors"
                      >
                        {resident.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        resident.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        resident.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resident.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Residents;
