/**
 * Service that provides sample data for reports.
 * This will be replaced with real data from the API in production.
 */

// Types for sample data
export interface PropertySample {
  id: string;
  name: string;
  location: string;
  units: number;
  status: string;
  onboardingDate: Date;
  annualFees: number;
  assessmentFrequency: string;
}

export interface ResidentSample {
  id: string;
  name: string;
  unit: string;
  status: string;
  moveInDate: Date;
  email: string;
  phone: string;
  type: string;
}

export interface ViolationSample {
  id: string;
  property: string;
  type: string;
  reportedDate: Date;
  status: string;
  resolvedDate: Date | null;
  description: string;
}

export interface FinancialDataSample {
  // Monthly data for charts
  monthlyData: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
  
  // Bank accounts data
  bankAccounts: Array<{
    account: string;
    number: string;
    balance: number;
    lastUpdated: string;
  }>;
  
  // Budget data
  budgetData: Array<{
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
  }>;
  
  // Expense categories
  expenseCategories: Array<{
    name: string;
    value: number;
  }>;
  
  // Invoice data
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    vendor: string;
  }>;
  
  // Summary metrics
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    cashOnHand: number;
    outstandingReceivables: number;
    totalAssets: number;
  };
}

// Generate financial data with different scales based on association
const generateFinancialData = (associationId: string): FinancialDataSample => {
  // Apply multiplier based on association to create different data scales
  const multiplier = associationId === "all" 
    ? 1.0 
    : (parseInt(associationId.slice(-1), 10) / 5) + 0.8; // Generate different scales for different associations
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    monthlyData: months.map(month => ({
      name: month,
      income: Math.round((Math.random() * 20000 + 30000) * multiplier),
      expenses: Math.round((Math.random() * 15000 + 20000) * multiplier)
    })),
    
    bankAccounts: [
      { 
        account: 'Operating Account', 
        number: 'XXXX-4532', 
        balance: Math.round(125000 * multiplier), 
        lastUpdated: '2023-07-25' 
      },
      { 
        account: 'Reserve Fund', 
        number: 'XXXX-7890', 
        balance: Math.round(345000 * multiplier), 
        lastUpdated: '2023-07-25' 
      },
      { 
        account: 'Special Assessment', 
        number: 'XXXX-1234', 
        balance: Math.round(78000 * multiplier), 
        lastUpdated: '2023-07-25' 
      },
      { 
        account: 'Maintenance Fund', 
        number: 'XXXX-5678', 
        balance: Math.round(42000 * multiplier), 
        lastUpdated: '2023-07-25' 
      },
    ],
    
    budgetData: [
      { category: 'Maintenance', budgeted: Math.round(120000 * multiplier), actual: Math.round(118500 * multiplier), variance: Math.round(1500 * multiplier) },
      { category: 'Utilities', budgeted: Math.round(85000 * multiplier), actual: Math.round(88200 * multiplier), variance: Math.round(-3200 * multiplier) },
      { category: 'Administration', budgeted: Math.round(65000 * multiplier), actual: Math.round(62400 * multiplier), variance: Math.round(2600 * multiplier) },
      { category: 'Insurance', budgeted: Math.round(45000 * multiplier), actual: Math.round(45000 * multiplier), variance: 0 },
      { category: 'Reserves', budgeted: Math.round(75000 * multiplier), actual: Math.round(75000 * multiplier), variance: 0 },
    ],
    
    expenseCategories: [
      { name: 'Maintenance', value: Math.round(32000 * multiplier) },
      { name: 'Utilities', value: Math.round(18000 * multiplier) },
      { name: 'Administration', value: Math.round(12000 * multiplier) },
      { name: 'Insurance', value: Math.round(8000 * multiplier) },
      { name: 'Reserves', value: Math.round(10000 * multiplier) },
    ],
    
    invoices: [
      { id: 'INV-2305', date: '2023-05-15', amount: Math.round(1250 * multiplier), status: 'Paid', vendor: 'ABC Maintenance' },
      { id: 'INV-2306', date: '2023-05-22', amount: Math.round(850 * multiplier), status: 'Paid', vendor: 'City Utilities' },
      { id: 'INV-2307', date: '2023-06-01', amount: Math.round(1500 * multiplier), status: 'Pending', vendor: 'Premium Insurance' },
      { id: 'INV-2308', date: '2023-06-10', amount: Math.round(750 * multiplier), status: 'Paid', vendor: 'Green Landscaping' },
      { id: 'INV-2309', date: '2023-06-15', amount: Math.round(1100 * multiplier), status: 'Overdue', vendor: 'Security Systems Inc' },
      { id: 'INV-2310', date: '2023-06-28', amount: Math.round(950 * multiplier), status: 'Pending', vendor: 'ABC Maintenance' },
      { id: 'INV-2311', date: '2023-07-05', amount: Math.round(1350 * multiplier), status: 'Paid', vendor: 'Elevator Services' },
      { id: 'INV-2312', date: '2023-07-12', amount: Math.round(800 * multiplier), status: 'Pending', vendor: 'City Utilities' },
    ],
    
    summary: {
      totalIncome: Math.round(577000 * multiplier),
      totalExpenses: Math.round(397000 * multiplier),
      netIncome: Math.round(180000 * multiplier),
      cashOnHand: Math.round(245000 * multiplier),
      outstandingReceivables: Math.round(35000 * multiplier),
      totalAssets: Math.round(1250000 * multiplier)
    }
  };
};

// Generate property data
const generatePropertyData = (associationId: string): PropertySample[] => {
  // Base properties
  const baseProperties = [
    {
      id: 'prop-001',
      name: 'Oakwood Residences',
      location: '123 Main St, Austin, TX',
      units: 48,
      status: 'Active',
      onboardingDate: new Date('2020-06-15'),
      annualFees: 120000,
      assessmentFrequency: 'monthly'
    },
    {
      id: 'prop-002',
      name: 'Willow Heights',
      location: '456 Oak Ave, Austin, TX',
      units: 36,
      status: 'Active',
      onboardingDate: new Date('2021-02-10'),
      annualFees: 85000,
      assessmentFrequency: 'monthly'
    },
    {
      id: 'prop-003',
      name: 'Cedar Point',
      location: '789 Pine Rd, Austin, TX',
      units: 24,
      status: 'Active',
      onboardingDate: new Date('2019-11-05'),
      annualFees: 65000,
      assessmentFrequency: 'quarterly'
    },
    {
      id: 'prop-004',
      name: 'Maple Grove',
      location: '321 Elm St, Austin, TX',
      units: 12,
      status: 'Inactive',
      onboardingDate: new Date('2018-08-20'),
      annualFees: 35000,
      assessmentFrequency: 'monthly'
    },
    {
      id: 'prop-005',
      name: 'Birchwood Court',
      location: '654 Birch Ln, Austin, TX',
      units: 60,
      status: 'Active',
      onboardingDate: new Date('2022-01-15'),
      annualFees: 150000,
      assessmentFrequency: 'monthly'
    }
  ];
  
  // If all associations, return all properties
  if (associationId === 'all') {
    return baseProperties;
  }
  
  // Otherwise, filter to just a couple properties and modify them slightly to look different
  return baseProperties.slice(0, 3).map(prop => ({
    ...prop,
    name: prop.name + ' ' + associationId.slice(-2),
    units: prop.units + parseInt(associationId.slice(-1), 10) * 2,
    annualFees: prop.annualFees * (parseInt(associationId.slice(-1), 10) / 5 + 0.8)
  }));
};

// Generate resident data
const generateResidentData = (associationId: string): ResidentSample[] => {
  const baseResidents = [
    {
      id: 'res-001',
      name: 'John Smith',
      unit: '101',
      status: 'Current',
      moveInDate: new Date('2021-03-15'),
      email: 'john.smith@example.com',
      phone: '(512) 555-1234',
      type: 'Owner'
    },
    {
      id: 'res-002',
      name: 'Jane Doe',
      unit: '202',
      status: 'Current',
      moveInDate: new Date('2020-08-10'),
      email: 'jane.doe@example.com',
      phone: '(512) 555-5678',
      type: 'Owner'
    },
    {
      id: 'res-003',
      name: 'Robert Johnson',
      unit: '303',
      status: 'Current',
      moveInDate: new Date('2022-01-05'),
      email: 'robert.johnson@example.com',
      phone: '(512) 555-9012',
      type: 'Tenant'
    },
    {
      id: 'res-004',
      name: 'Emily Wilson',
      unit: '404',
      status: 'Former',
      moveInDate: new Date('2019-05-20'),
      email: 'emily.wilson@example.com',
      phone: '(512) 555-3456',
      type: 'Owner'
    },
    {
      id: 'res-005',
      name: 'Michael Brown',
      unit: '505',
      status: 'Current',
      moveInDate: new Date('2021-11-15'),
      email: 'michael.brown@example.com',
      phone: '(512) 555-7890',
      type: 'Tenant'
    }
  ];
  
  // If all associations, return all residents
  if (associationId === 'all') {
    return baseResidents;
  }
  
  // Otherwise, filter to just a couple residents and modify them
  return baseResidents.slice(0, 3).map(res => ({
    ...res,
    unit: (parseInt(res.unit) + parseInt(associationId.slice(-1), 10) * 10).toString(),
    name: res.name + ' ' + (parseInt(associationId.slice(-1), 10) % 2 === 0 ? 'Jr.' : 'Sr.')
  }));
};

// Generate violation data
const generateViolationData = (associationId: string): ViolationSample[] => {
  const baseViolations = [
    {
      id: 'vio-001',
      property: 'Oakwood Residences',
      type: 'Landscaping',
      reportedDate: new Date('2023-06-15'),
      status: 'Open',
      resolvedDate: null,
      description: 'Overgrown lawn and weeds in flower beds'
    },
    {
      id: 'vio-002',
      property: 'Willow Heights',
      type: 'Architectural',
      reportedDate: new Date('2023-06-10'),
      status: 'Resolved',
      resolvedDate: new Date('2023-06-25'),
      description: 'Unauthorized paint color on front door'
    },
    {
      id: 'vio-003',
      property: 'Cedar Point',
      type: 'Maintenance',
      reportedDate: new Date('2023-07-01'),
      status: 'Open',
      resolvedDate: null,
      description: 'Broken fence on property boundary'
    },
    {
      id: 'vio-004',
      property: 'Maple Grove',
      type: 'Trash',
      reportedDate: new Date('2023-07-05'),
      status: 'Open',
      resolvedDate: null,
      description: 'Trash cans left on curb for multiple days'
    },
    {
      id: 'vio-005',
      property: 'Birchwood Court',
      type: 'Parking',
      reportedDate: new Date('2023-06-20'),
      status: 'Resolved',
      resolvedDate: new Date('2023-07-01'),
      description: 'Vehicle parked on lawn'
    }
  ];
  
  // If all associations, return all violations
  if (associationId === 'all') {
    return baseViolations;
  }
  
  // Otherwise, filter and modify
  return baseViolations.slice(0, 3).map(vio => ({
    ...vio,
    property: vio.property + ' ' + associationId.slice(-2),
    reportedDate: new Date(vio.reportedDate.getTime() + (parseInt(associationId.slice(-1), 10) * 86400000)) // Add days based on association ID
  }));
};

// Service class
class SampleReportDataService {
  getFinancialData(reportName: string, association: string): FinancialDataSample {
    const baseData = generateFinancialData(association);
    
    // Modify based on report type
    if (reportName.includes('budget')) {
      // Increase budget numbers for budget reports
      return {
        ...baseData,
        budgetData: baseData.budgetData.map(item => ({
          ...item,
          budgeted: item.budgeted * 1.2,
          actual: item.actual * 1.15
        })),
        summary: {
          ...baseData.summary,
          totalIncome: baseData.summary.totalIncome * 1.1,
          totalExpenses: baseData.summary.totalExpenses * 1.05
        }
      };
    } else if (reportName.includes('bank') || reportName.includes('cash')) {
      // Modify bank and cash flow reports
      return {
        ...baseData,
        bankAccounts: baseData.bankAccounts.map(account => ({
          ...account,
          balance: account.balance * (reportName.includes('bank-balances') ? 1.2 : 0.9)
        })),
        summary: {
          ...baseData.summary,
          cashOnHand: baseData.summary.cashOnHand * 1.15,
          totalAssets: baseData.summary.totalAssets * 1.1
        }
      };
    } else if (reportName.includes('billing')) {
      // Modify billing reports
      return {
        ...baseData,
        invoices: baseData.invoices.map(invoice => ({
          ...invoice,
          amount: invoice.amount * 1.25
        })),
        summary: {
          ...baseData.summary,
          outstandingReceivables: baseData.summary.outstandingReceivables * 1.4
        }
      };
    }
    
    return baseData;
  }
  
  getPropertyData(reportName: string, association: string): PropertySample[] {
    const baseData = generatePropertyData(association);
    
    // Modify based on report type (you can add more customization here)
    if (reportName.includes('overview')) {
      return baseData.map(property => ({
        ...property,
        units: property.units * 1.2
      }));
    } else if (reportName.includes('arc')) {
      return baseData.map(property => ({
        ...property,
        annualFees: property.annualFees * 1.1
      }));
    }
    
    return baseData;
  }
  
  getResidentData(reportName: string, association: string): ResidentSample[] {
    const baseData = generateResidentData(association);
    
    // Modify based on report type
    if (reportName.includes('violation')) {
      // For violation-related reports
      return baseData;
    } else if (reportName.includes('address')) {
      // For address reports
      return baseData;
    }
    
    return baseData;
  }
  
  getViolationData(reportName: string, association: string): ViolationSample[] {
    return generateViolationData(association);
  }
}

export const sampleReportDataService = new SampleReportDataService();
