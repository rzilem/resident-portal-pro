
import { Association, AssociationSettings } from '@/types/association';
import { toast } from 'sonner';

// Mock database - in a real app, this would be replaced with actual API calls
let associations: Association[] = [
  { 
    id: '1', 
    name: 'Sunset Heights HOA',
    address: {
      street: '123 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    contactInfo: {
      email: 'info@sunsetheights.org',
      phone: '(555) 123-4567',
      website: 'https://www.sunsetheights.org'
    },
    type: 'hoa',
    foundedDate: '2010-01-15',
    units: 48,
    status: 'active',
    settings: {
      fiscalYearStart: '01-01',
      feesFrequency: 'monthly',
      documents: {
        storageLimit: 1000,
        allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
      },
      board: {
        termLength: 24,
        maximumMembers: 7
      },
      communications: {
        emailEnabled: true,
        smsEnabled: true,
        announcementsEnabled: true
      },
      modules: {
        maintenance: true,
        violations: true,
        voting: true,
        accounting: true,
        documents: true,
        calendar: true
      },
      timezone: 'America/Los_Angeles',
      primaryLanguage: 'en',
      code: 'SHOA',
      currencySymbol: '$',
      lateFeeAmount: '25',
      lateFeeType: 'fixed',
      allowOnlinePayments: true,
      isDefault: true
    }
  },
  { 
    id: '2', 
    name: 'Ocean View Condos',
    address: {
      street: '456 Ocean Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
      country: 'USA'
    },
    contactInfo: {
      email: 'info@oceanviewcondos.org',
      phone: '(555) 987-6543',
      website: 'https://www.oceanviewcondos.org'
    },
    type: 'condo',
    foundedDate: '2015-06-20',
    units: 120,
    status: 'active',
    settings: {
      fiscalYearStart: '01-01',
      feesFrequency: 'monthly',
      documents: {
        storageLimit: 2000,
        allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
      },
      board: {
        termLength: 12,
        maximumMembers: 5
      },
      communications: {
        emailEnabled: true,
        smsEnabled: false,
        announcementsEnabled: true
      },
      modules: {
        maintenance: true,
        violations: true,
        voting: true,
        accounting: true,
        documents: true,
        calendar: true
      },
      isDefault: false
    }
  },
  { 
    id: '3', 
    name: 'Mountain Valley Association',
    address: {
      street: '789 Valley Rd',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      country: 'USA'
    },
    contactInfo: {
      email: 'info@mountainvalley.org',
      phone: '(555) 456-7890',
      website: 'https://www.mountainvalley.org'
    },
    type: 'hoa',
    foundedDate: '2008-03-10',
    units: 75,
    status: 'inactive',
    settings: {
      fiscalYearStart: '07-01',
      feesFrequency: 'quarterly',
      documents: {
        storageLimit: 1500,
        allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
      },
      board: {
        termLength: 36,
        maximumMembers: 9
      },
      communications: {
        emailEnabled: true,
        smsEnabled: true,
        announcementsEnabled: false
      },
      modules: {
        maintenance: true,
        violations: false,
        voting: true,
        accounting: true,
        documents: true,
        calendar: false
      },
      isDefault: false
    }
  }
];

export const getAssociations = (): Promise<Association[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...associations]);
    }, 500);
  });
};

export const getAssociationById = (id: string): Promise<Association | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(associations.find(a => a.id === id));
    }, 300);
  });
};

export const createAssociation = (association: Omit<Association, 'id'>): Promise<Association> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAssociation: Association = {
        ...association,
        id: Math.random().toString(36).substr(2, 9),
      };
      associations = [...associations, newAssociation];
      resolve(newAssociation);
    }, 700);
  });
};

export const updateAssociation = (id: string, updates: Partial<Association>): Promise<Association> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = associations.findIndex(a => a.id === id);
      if (index !== -1) {
        const updatedAssociation = {
          ...associations[index],
          ...updates,
          settings: {
            ...associations[index].settings,
            ...updates.settings
          }
        };
        associations = [
          ...associations.slice(0, index),
          updatedAssociation,
          ...associations.slice(index + 1)
        ];
        resolve(updatedAssociation);
      } else {
        reject(new Error('Association not found'));
      }
    }, 700);
  });
};

export const updateAssociationSetting = (
  id: string, 
  settingName: string, 
  value: any
): Promise<Association> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = associations.findIndex(a => a.id === id);
      if (index !== -1) {
        const updatedAssociation = {
          ...associations[index],
          settings: {
            ...associations[index].settings,
            [settingName]: value
          }
        };
        associations = [
          ...associations.slice(0, index),
          updatedAssociation,
          ...associations.slice(index + 1)
        ];
        resolve(updatedAssociation);
      } else {
        reject(new Error('Association not found'));
      }
    }, 300);
  });
};

export const deleteAssociation = (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = associations.length;
      associations = associations.filter(a => a.id !== id);
      if (associations.length < initialLength) {
        resolve(true);
      } else {
        reject(new Error('Association not found'));
      }
    }, 500);
  });
};

export const setDefaultAssociation = (id: string): Promise<Association[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      associations = associations.map(a => ({
        ...a,
        settings: {
          ...a.settings,
          isDefault: a.id === id
        }
      }));
      resolve([...associations]);
    }, 300);
  });
};

export const toggleAssociationStatus = (id: string): Promise<Association> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = associations.findIndex(a => a.id === id);
      if (index !== -1) {
        const currentStatus = associations[index].status;
        const newStatus: 'active' | 'inactive' = currentStatus === 'active' ? 'inactive' : 'active';
        
        const updatedAssociation: Association = {
          ...associations[index],
          status: newStatus
        };
        
        associations = [
          ...associations.slice(0, index),
          updatedAssociation,
          ...associations.slice(index + 1)
        ];
        resolve(updatedAssociation);
      } else {
        reject(new Error('Association not found'));
      }
    }, 300);
  });
};
