
export interface Association {
  id: string;
  name: string;
  units: number;
  address: string;
  isActive: boolean;
  isDefault: boolean;
  settings?: Record<string, any>;
}

export type SettingSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}
