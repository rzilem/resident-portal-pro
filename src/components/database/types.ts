
export type Homeowner = {
  id: string;
  fullName: string;
  unit: string;
  address: string;
  property: string;
  phone: string;
  email: string;
  status: string;
  moveInDate: string;
  moveOutDate?: string;
  balance: string;
  lastPaymentDate: string;
  lastPaymentAmount: string;
  paymentMethod: string;
  ownerType: string;
  primaryResidence: string;
  mailingAddress: string;
  notes?: string;
};
