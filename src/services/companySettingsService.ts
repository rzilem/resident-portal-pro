
// Company settings
let companySettings: Record<string, any> = {
  companyName: 'Association Management Co.',
  taxId: '12-3456789',
  phone: '(555) 123-4567',
  email: 'contact@associationmgmt.com',
  address: '123 Main St, Suite 100, Cityville, ST 12345',
  description: 'Professional association management services for homeowners and community associations.'
};

export const companySettingsService = {
  /**
   * Get all company settings
   */
  getCompanySettings: () => {
    return { ...companySettings };
  },

  /**
   * Update company settings
   */
  updateCompanySettings: (updates: Record<string, any>) => {
    companySettings = {
      ...companySettings,
      ...updates
    };
    return { ...companySettings };
  },

  /**
   * Update a specific company setting
   */
  updateCompanySetting: (key: string, value: any) => {
    companySettings[key] = value;
    return { ...companySettings };
  }
};
