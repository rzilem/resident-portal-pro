
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, UserX, Search, ChevronRight, Settings2, ChevronUp, ChevronDown, Mail, Download, Trash2, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings } from '@/hooks/use-settings';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Column type definition for resident data
export type ResidentColumn = {
  id: string;
  label: string;
  checked: boolean;
};

const Residents = () => {
  const isMobile = useIsMobile();
  const { preferences, updatePreference } = useSettings();
  
  // Define default columns
  const defaultColumns: ResidentColumn[] = [
    { id: 'name', label: 'Name', checked: true },
    { id: 'unit', label: 'Unit', checked: true },
    { id: 'property', label: 'Property', checked: true },
    { id: 'email', label: 'Email', checked: true },
    { id: 'phone', label: 'Phone', checked: false },
    { id: 'status', label: 'Status', checked: true },
    { id: 'moveInDate', label: 'Move-In Date', checked: false },
    { id: 'moveOutDate', label: 'Move-Out Date', checked: false },
    { id: 'mailingAddress', label: 'Mailing Address', checked: false },
    { id: 'propertyAddress', label: 'Property Address', checked: false },
    { id: 'balance', label: 'Balance', checked: false },
    { id: 'lastPayment', label: 'Last Payment', checked: false },
    { id: 'achStartDate', label: 'ACH Start Date', checked: false },
    { id: 'closingDate', label: 'Closing Date', checked: false },
    { id: 'commPreference', label: 'Communication Preference', checked: false },
    { id: 'billingPreference', label: 'Billing Preference', checked: false },
    { id: 'ownerType', label: 'Owner Type', checked: false },
  ];

  const [columns, setColumns] = useState<ResidentColumn[]>(
    preferences?.residentTableColumns || defaultColumns
  );
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (preferences?.residentTableColumns) {
      setColumns(preferences.residentTableColumns);
    }
  }, [preferences]);

  const handleColumnToggle = (columnId: string) => {
    const updatedColumns = columns.map(column => 
      column.id === columnId ? { ...column, checked: !column.checked } : column
    );
    
    const hasCheckedColumn = updatedColumns.some(col => col.checked);
    
    if (hasCheckedColumn) {
      setColumns(updatedColumns);
      updatePreference('residentTableColumns', updatedColumns);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const residents = [
    { 
      id: 101, 
      name: 'Alice Johnson', 
      unit: '301', 
      property: 'Oakwood Heights', 
      email: 'alice.j@example.com',
      phone: '(555) 123-4567',
      status: 'Active',
      moveInDate: '05/15/2021',
      moveOutDate: '',
      mailingAddress: '123 Main St, Apt 301, Seattle, WA 98101',
      propertyAddress: '123 Main St, Apt 301, Seattle, WA 98101',
      balance: '$0.00',
      lastPayment: '$350 on 06/01/2023',
      achStartDate: '05/20/2021',
      closingDate: '05/10/2021',
      commPreference: 'Email',
      billingPreference: 'Auto-draft',
      ownerType: 'Owner-Occupied'
    },
    { 
      id: 102, 
      name: 'Robert Smith', 
      unit: '142', 
      property: 'Willow Creek Estates', 
      email: 'robert.s@example.com',
      phone: '(555) 234-5678',
      status: 'Active',
      moveInDate: '03/10/2022',
      moveOutDate: '',
      mailingAddress: '456 Park Ave, Unit 142, Portland, OR 97201',
      propertyAddress: '456 Park Ave, Unit 142, Portland, OR 97201',
      balance: '$75.00',
      lastPayment: '$275 on 05/28/2023',
      achStartDate: '03/15/2022',
      closingDate: '03/05/2022',
      commPreference: 'Text',
      billingPreference: 'Check',
      ownerType: 'Investor'
    },
    { 
      id: 103, 
      name: 'Emily Davis', 
      unit: '506', 
      property: 'Riverfront Towers', 
      email: 'emily.d@example.com',
      phone: '(555) 345-6789',
      status: 'Active',
      moveInDate: '11/20/2020',
      moveOutDate: '',
      mailingAddress: '789 River Rd, #506, Chicago, IL 60601',
      propertyAddress: '789 River Rd, #506, Chicago, IL 60601',
      balance: '$0.00',
      lastPayment: '$425 on 06/01/2023',
      achStartDate: '12/01/2020',
      closingDate: '11/15/2020',
      commPreference: 'Email',
      billingPreference: 'Auto-draft',
      ownerType: 'Owner-Occupied'
    },
    { 
      id: 201, 
      name: 'Michael Wilson', 
      unit: '203', 
      property: 'Sunset Gardens', 
      email: 'michael.w@example.com',
      phone: '(555) 456-7890',
      status: 'Pending',
      moveInDate: '07/01/2023',
      moveOutDate: '',
      mailingAddress: '321 Sunset Blvd, #203, Los Angeles, CA 90028',
      propertyAddress: '321 Sunset Blvd, #203, Los Angeles, CA 90028',
      balance: '$150.00',
      lastPayment: '$0.00',
      achStartDate: 'Pending',
      closingDate: '06/25/2023',
      commPreference: 'Phone',
      billingPreference: 'Credit Card',
      ownerType: 'Owner-Occupied'
    },
    { 
      id: 202, 
      name: 'Sarah Brown', 
      unit: '118', 
      property: 'Pine Valley Community', 
      email: 'sarah.b@example.com',
      phone: '(555) 567-8901',
      status: 'Active',
      moveInDate: '09/15/2021',
      moveOutDate: '',
      mailingAddress: '654 Pine Valley Rd, #118, Denver, CO 80202',
      propertyAddress: '654 Pine Valley Rd, #118, Denver, CO 80202',
      balance: '$25.00',
      lastPayment: '$300 on 05/30/2023',
      achStartDate: '10/01/2021',
      closingDate: '09/10/2021',
      commPreference: 'Email',
      billingPreference: 'Auto-draft',
      ownerType: 'Owner-Occupied'
    },
    { 
      id: 301, 
      name: 'David Miller', 
      unit: '224', 
      property: 'Oakwood Heights', 
      email: 'david.m@example.com',
      phone: '(555) 678-9012',
      status: 'Inactive',
      moveInDate: '02/10/2020',
      moveOutDate: '04/30/2023',
      mailingAddress: '987 Oak St, Denver, CO 80203',
      propertyAddress: '123 Main St, Apt 224, Seattle, WA 98101',
      balance: '$0.00',
      lastPayment: '$275 on 04/15/2023',
      achStartDate: '03/01/2020',
      closingDate: '02/01/2020',
      commPreference: 'Mail',
      billingPreference: 'Check',
      ownerType: 'Investor'
    },
  ];

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const filteredResidents = searchTerm 
    ? residents.filter(resident => 
        Object.values(resident).some(value => 
          value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : residents;

  const sortedResidents = [...filteredResidents].sort((a, b) => {
    const valueA = a[sortField as keyof typeof a];
    const valueB = b[sortField as keyof typeof b];
    
    if (valueA === undefined || valueB === undefined) return 0;
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    } else {
      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();
      
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    }
  });

  // Toggle selection of a single resident
  const toggleResidentSelection = (residentId: number) => {
    setSelectedResidents(prev => 
      prev.includes(residentId) 
        ? prev.filter(id => id !== residentId) 
        : [...prev, residentId]
    );
  };

  // Toggle selection of all residents
  const toggleSelectAll = () => {
    if (selectAll || selectedResidents.length === sortedResidents.length) {
      setSelectedResidents([]);
      setSelectAll(false);
    } else {
      setSelectedResidents(sortedResidents.map(resident => resident.id));
      setSelectAll(true);
    }
  };

  // Bulk action handlers
  const handleBulkEmail = () => {
    if (selectedResidents.length === 0) {
      toast.error("Please select at least one resident");
      return;
    }
    
    const selectedEmails = sortedResidents
      .filter(resident => selectedResidents.includes(resident.id))
      .map(resident => resident.email)
      .join(', ');
      
    toast.success(`Preparing email to ${selectedResidents.length} residents`);
    // In a real app, you would integrate with an email service or open a mail compose dialog
    window.open(`mailto:${selectedEmails}`);
  };

  const handleBulkExport = () => {
    if (selectedResidents.length === 0) {
      toast.error("Please select at least one resident");
      return;
    }
    
    toast.success(`Exporting data for ${selectedResidents.length} residents`);
    // In a real app, you would generate and download a CSV or PDF file
  };

  const handleBulkTag = () => {
    if (selectedResidents.length === 0) {
      toast.error("Please select at least one resident");
      return;
    }
    
    toast.success(`Apply tags to ${selectedResidents.length} residents`);
    // In a real app, you would open a dialog to select and apply tags
  };

  const handleBulkDelete = () => {
    if (selectedResidents.length === 0) {
      toast.error("Please select at least one resident");
      return;
    }
    
    toast.success(`${selectedResidents.length} residents would be deleted`);
    // In a real app, you would show a confirmation dialog before deleting
  };

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 gap-1">
                      <Settings2 className="h-4 w-4" />
                      <span className="hidden md:inline">Customize Columns</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium mb-2">Display Columns</h4>
                      <div className="max-h-[300px] overflow-y-auto pr-2">
                        {columns.map((column) => (
                          <div key={column.id} className="flex items-center space-x-2 mb-2">
                            <Checkbox 
                              id={`column-${column.id}`} 
                              checked={column.checked} 
                              onCheckedChange={() => handleColumnToggle(column.id)}
                            />
                            <label
                              htmlFor={`column-${column.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {column.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 text-xs text-muted-foreground">
                        At least one column must be selected
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button>Add Resident</Button>
              </div>
            </div>
            
            {selectedResidents.length > 0 && (
              <div className="mb-4">
                <Alert className="bg-muted/50 border border-muted">
                  <AlertDescription className="flex items-center justify-between">
                    <span><strong>{selectedResidents.length}</strong> resident{selectedResidents.length !== 1 ? 's' : ''} selected</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBulkEmail}
                        className="h-8"
                      >
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBulkExport}
                        className="h-8"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Export
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBulkTag}
                        className="h-8"
                      >
                        <Tag className="h-3.5 w-3.5 mr-1" />
                        Tag
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBulkDelete}
                        className="h-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {isMobile && (
              <div className="space-y-4 md:hidden">
                {sortedResidents.map((resident, i) => (
                  <Card key={i} className="p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedResidents.includes(resident.id)} 
                          onCheckedChange={() => toggleResidentSelection(resident.id)}
                          id={`mobile-resident-${resident.id}`}
                        />
                        <Link
                          to={`/resident/${resident.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {resident.name}
                        </Link>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        resident.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        resident.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resident.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {columns.filter(col => col.checked && ['unit', 'property', 'email'].includes(col.id)).map((col) => (
                        <div key={col.id} className="flex justify-between">
                          <span className="text-muted-foreground">{col.label}:</span>
                          {col.id === 'property' ? (
                            <Link 
                              to={`/properties?filter=${encodeURIComponent(resident.property)}`} 
                              className="hover:underline hover:text-primary/80 transition-colors"
                            >
                              {resident[col.id as keyof typeof resident]}
                            </Link>
                          ) : col.id === 'email' ? (
                            <a 
                              href={`mailto:${resident.email}`} 
                              className="hover:underline hover:text-primary/80 transition-colors"
                            >
                              {resident.email}
                            </a>
                          ) : (
                            <span>{resident[col.id as keyof typeof resident]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link to={`/resident/${resident.id}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-3 justify-between">
                        View Profile <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
            
            <div className={isMobile ? "hidden" : "overflow-auto"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox 
                        checked={
                          sortedResidents.length > 0 && 
                          selectedResidents.length === sortedResidents.length
                        } 
                        onCheckedChange={toggleSelectAll}
                        id="select-all-residents"
                      />
                    </TableHead>
                    {columns.filter(col => col.checked).map((column) => (
                      <TableHead 
                        key={column.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => handleSort(column.id)}
                      >
                        <div className="flex items-center gap-1">
                          {column.label}
                          <SortIcon field={column.id} />
                        </div>
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResidents.map((resident, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedResidents.includes(resident.id)} 
                          onCheckedChange={() => toggleResidentSelection(resident.id)}
                          id={`resident-${resident.id}`}
                        />
                      </TableCell>
                      {columns.filter(col => col.checked).map((column) => (
                        <TableCell key={column.id}>
                          {column.id === 'name' ? (
                            <Link 
                              to={`/resident/${resident.id}`} 
                              className="text-primary hover:underline hover:text-primary/80 transition-colors"
                            >
                              {resident.name}
                            </Link>
                          ) : column.id === 'property' ? (
                            <Link 
                              to={`/properties?filter=${encodeURIComponent(resident.property)}`} 
                              className="hover:underline hover:text-primary/80 transition-colors"
                            >
                              {resident.property}
                            </Link>
                          ) : column.id === 'email' ? (
                            <a 
                              href={`mailto:${resident.email}`} 
                              className="hover:underline hover:text-primary/80 transition-colors"
                            >
                              {resident.email}
                            </a>
                          ) : column.id === 'status' ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              resident.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              resident.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {resident.status}
                            </span>
                          ) : (
                            resident[column.id as keyof typeof resident]
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/resident/${resident.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(`mailto:${resident.email}`)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Exporting ${resident.name}'s data`)}>
                                <Download className="h-4 w-4 mr-2" />
                                Export Data
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Tag dialog would open for ${resident.name}`)}>
                                <Tag className="h-4 w-4 mr-2" />
                                Manage Tags
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => toast.error(`Delete confirmation for ${resident.name}`)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Residents;
