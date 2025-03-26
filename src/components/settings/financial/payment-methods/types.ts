
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
