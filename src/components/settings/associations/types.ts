
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

export type AssociationMenuItem = {
  id: string;
  title: string;
  icon?: React.ElementType;
  description?: string;
  hasSubmenu?: boolean;
}

export type AssociationMenuCategory = {
  id: string;
  title: string;
  items: AssociationMenuItem[];
}
