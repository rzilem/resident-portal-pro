
/**
 * Pattern recognition for different field types
 */

/**
 * Association-related field pattern matchers
 */
export const associationFieldPatterns = {
  name: (header: string): boolean => {
    const pattern = /^(association([-_\s]*)name|name)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  address: (header: string): boolean => {
    const pattern = /^(association([-_\s]*)address|address)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  phone: (header: string): boolean => {
    const pattern = /^(association([-_\s]*)phone|phone)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, '')) &&
      !header.toLowerCase().includes('homeowner');
  },
  
  email: (header: string): boolean => {
    const pattern = /^(association([-_\s]*)email|email)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, '')) &&
      !header.toLowerCase().includes('homeowner');
  },
  
  taxId: (header: string): boolean => {
    const pattern = /^(tax([-_\s]*)id|association([-_\s]*)tax([-_\s]*)id)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  type: (header: string): boolean => {
    const pattern = /^(association([-_\s]*)type|hoa([-_\s]*)type|type)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  website: (header: string): boolean => {
    const pattern = /^(website|association([-_\s]*)website|url)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  }
};

/**
 * Property-related field pattern matchers
 */
export const propertyFieldPatterns = {
  name: (header: string): boolean => {
    const pattern = /^(property([-_\s]*)name)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  type: (header: string): boolean => {
    const pattern = /^(property([-_\s]*)type)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  yearBuilt: (header: string): boolean => {
    const pattern = /^(year([-_\s]*)built|property([-_\s]*)year([-_\s]*)built|year([-_\s]*)established|year([-_\s]*)founded|founded)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  unitCount: (header: string): boolean => {
    const pattern = /^(total([-_\s]*)units|units|property([-_\s]*)units([-_\s]*)count|unit([-_\s]*)count)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  }
};

/**
 * Unit-related field pattern matchers
 */
export const unitFieldPatterns = {
  number: (header: string): boolean => {
    const pattern = /^(unit([-_\s]*)number|unit|unit([-_\s]*)no)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  address: (header: string): boolean => {
    const pattern = /^(unit([-_\s]*)address)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  bedrooms: (header: string): boolean => {
    const pattern = /^(bedrooms|beds|unit([-_\s]*)bedrooms)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  bathrooms: (header: string): boolean => {
    const pattern = /^(bathrooms|baths|unit([-_\s]*)bathrooms)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  squareFeet: (header: string): boolean => {
    const pattern = /^(square([-_\s]*)feet|sqft|sq([-_\s]*)feet|unit([-_\s]*)square([-_\s]*)feet)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  }
};

/**
 * Homeowner-related field pattern matchers
 */
export const homeownerFieldPatterns = {
  id: (header: string): boolean => {
    const pattern = /^(homeowner([-_\s]*)id)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  firstName: (header: string): boolean => {
    const pattern = /^(first([-_\s]*)name|homeowner([-_\s]*)first([-_\s]*)name)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  lastName: (header: string): boolean => {
    const pattern = /^(last([-_\s]*)name|homeowner([-_\s]*)last([-_\s]*)name)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  email: (header: string): boolean => {
    return header.toLowerCase().includes('email') && 
           !header.toLowerCase().includes('association') &&
           header.toLowerCase() !== 'association_email';
  },
  
  phone: (header: string): boolean => {
    return header.toLowerCase().includes('phone') && 
           !header.toLowerCase().includes('alternate') && 
           !header.toLowerCase().includes('association') &&
           header.toLowerCase() !== 'association_phone';
  }
};

/**
 * Address component field pattern matchers
 */
export const addressFieldPatterns = {
  street: (header: string): boolean => {
    const pattern = /^(street|address1)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  city: (header: string): boolean => {
    const pattern = /^(city)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  state: (header: string): boolean => {
    const pattern = /^(state|province)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  zip: (header: string): boolean => {
    const pattern = /^(zip|zipcode|postal([-_\s]*)code)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  country: (header: string): boolean => {
    const pattern = /^(country)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  }
};

/**
 * Financial field pattern matchers
 */
export const financialFieldPatterns = {
  fiscalYearStart: (header: string): boolean => {
    const pattern = /^(fiscal([-_\s]*)year([-_\s]*)start|fiscal([-_\s]*)year)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  feesFrequency: (header: string): boolean => {
    const pattern = /^(fees([-_\s]*)frequency)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  },
  
  annualFees: (header: string): boolean => {
    const pattern = /^(annual([-_\s]*)fees)$/i;
    return pattern.test(header.toLowerCase().replace(/[^a-z0-9_\s-]/g, ''));
  }
};
