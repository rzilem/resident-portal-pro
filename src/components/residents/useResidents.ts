
import { useState } from 'react';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';
import { ResidentColumn } from '@/pages/Residents';

export const useResidents = () => {
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

  // Mock residents data
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

  return {
    columns,
    handleColumnToggle,
    sortField,
    sortDirection,
    handleSort,
    searchTerm,
    setSearchTerm,
    selectedResidents,
    toggleResidentSelection,
    toggleSelectAll,
    sortedResidents,
    handleBulkEmail,
    handleBulkExport,
    handleBulkTag,
    handleBulkDelete
  };
};
