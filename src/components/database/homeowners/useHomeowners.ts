
import { useState, useEffect } from 'react';
import { Homeowner } from '../types';
import { DatabaseColumn } from '../DatabaseColumnsSelector';
import { useSettings } from '@/hooks/use-settings';

// Mock data - in a real app, this would be fetched from an API
const mockHomeowners: Homeowner[] = [
  {
    id: "H001",
    fullName: "Alice Johnson",
    unit: "101",
    address: "123 Main Street",
    property: "Oakwood Heights",
    phone: "(555) 123-4567",
    email: "alice.j@example.com",
    status: "Active",
    moveInDate: "12/05/2019",
    balance: "$450.00", // Updated with a balance
    lastPaymentDate: "01/15/2023",
    lastPaymentAmount: "$350.00",
    paymentMethod: "Auto-draft",
    ownerType: "Owner",
    primaryResidence: "Yes",
    mailingAddress: "Same as unit",
  },
  {
    id: "H002",
    fullName: "Robert Smith",
    unit: "142",
    address: "456 Park Avenue",
    property: "Willow Creek Estates",
    phone: "(555) 234-5678",
    email: "robert.s@example.com",
    status: "Active",
    moveInDate: "03/15/2020",
    moveOutDate: "06/30/2023",
    balance: "$75.00",
    lastPaymentDate: "05/10/2023",
    lastPaymentAmount: "$175.00",
    paymentMethod: "Check",
    ownerType: "Tenant",
    primaryResidence: "No",
    mailingAddress: "789 Oak St, Portland, OR",
  },
  {
    id: "H003",
    fullName: "Emily Davis",
    unit: "506",
    address: "789 River Road",
    property: "Riverfront Towers",
    phone: "(555) 345-6789",
    email: "emily.d@example.com",
    status: "Inactive",
    moveInDate: "07/01/2018",
    moveOutDate: "02/28/2023",
    balance: "$0.00",
    lastPaymentDate: "02/15/2023",
    lastPaymentAmount: "$425.00",
    paymentMethod: "Auto-draft",
    ownerType: "Owner",
    primaryResidence: "Yes",
    mailingAddress: "Same as unit",
  },
  {
    id: "H004",
    fullName: "Michael Wilson",
    unit: "203",
    address: "321 Sunset Blvd",
    property: "Sunset Gardens",
    phone: "(555) 456-7890",
    email: "michael.w@example.com",
    status: "Pending",
    moveInDate: "09/15/2021",
    balance: "$150.00",
    lastPaymentDate: "04/30/2023",
    lastPaymentAmount: "$200.00",
    paymentMethod: "Credit Card",
    ownerType: "Owner",
    primaryResidence: "Yes",
    mailingAddress: "Same as unit",
  },
  {
    id: "H005",
    fullName: "Sarah Brown",
    unit: "118",
    address: "654 Pine Valley Rd",
    property: "Pine Valley Community",
    phone: "(555) 567-8901",
    email: "sarah.b@example.com",
    status: "Active",
    moveInDate: "11/01/2019",
    balance: "$25.00",
    lastPaymentDate: "05/01/2023",
    lastPaymentAmount: "$300.00",
    paymentMethod: "Auto-draft",
    ownerType: "Tenant",
    primaryResidence: "Yes",
    mailingAddress: "Same as unit",
  },
  {
    id: "H006",
    fullName: "David Miller",
    unit: "224",
    address: "987 Oak Street",
    property: "Oakwood Heights",
    phone: "(555) 678-9012",
    email: "david.m@example.com",
    status: "Inactive",
    moveInDate: "05/15/2020",
    moveOutDate: "04/30/2023",
    balance: "$0.00",
    lastPaymentDate: "04/15/2023",
    lastPaymentAmount: "$275.00",
    paymentMethod: "Check",
    ownerType: "Owner",
    primaryResidence: "No",
    mailingAddress: "123 Maple St, Denver, CO",
  },
];

export const defaultColumns: DatabaseColumn[] = [
  { id: 'id', label: 'ID', checked: true },
  { id: 'fullName', label: 'Name', checked: true },
  { id: 'unit', label: 'Unit', checked: true },
  { id: 'property', label: 'Property', checked: true },
  { id: 'contact', label: 'Contact', checked: true },
  { id: 'status', label: 'Status', checked: true },
  { id: 'moveInDate', label: 'Move-In Date', checked: true },
  { id: 'balance', label: 'Balance', checked: true },
  { id: 'lastPayment', label: 'Last Payment', checked: true },
  { id: 'ownerType', label: 'Owner Type', checked: true },
  { id: 'primaryResidence', label: 'Primary Residence', checked: true },
];

export const useHomeowners = () => {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Homeowner>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [columns, setColumns] = useState<DatabaseColumn[]>(
    settings?.databaseHomeownerColumns || defaultColumns
  );

  useEffect(() => {
    if (settings?.databaseHomeownerColumns) {
      setColumns(settings.databaseHomeownerColumns);
    }
  }, [settings]);

  const handleColumnsChange = (newColumns: DatabaseColumn[]) => {
    setColumns(newColumns);
  };

  const filteredHomeowners = mockHomeowners.filter(homeowner =>
    Object.values(homeowner).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedHomeowners = [...filteredHomeowners].sort((a, b) => {
    const aValue = a[sortColumn]?.toString() || '';
    const bValue = b[sortColumn]?.toString() || '';
    
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSort = (column: keyof Homeowner) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'outline';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return {
    homeowners: sortedHomeowners,
    originalCount: mockHomeowners.length,
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    columns,
    handleColumnsChange,
    handleSort,
    getStatusVariant,
  };
};
