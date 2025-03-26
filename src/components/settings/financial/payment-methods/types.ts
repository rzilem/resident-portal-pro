
export interface PaymentMethodConfig {
  enabled: boolean;
  fee: number;
  feeType: 'percentage' | 'flat';
  icon?: string;
  customName?: string;
}

export interface PaymentMethods {
  creditCard: PaymentMethodConfig;
  ach: PaymentMethodConfig;
  check: PaymentMethodConfig;
  [key: string]: PaymentMethodConfig;
}

export interface InvoiceSearchParams {
  query?: string;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  status?: string[];
  vendor?: string[];
  association?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface InvoiceFilterState extends InvoiceSearchParams {
  isFiltered: boolean;
}
