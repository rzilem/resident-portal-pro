
export interface Association {
  id: string;
  name: string;
  units: number;
  address: string;
  isActive: boolean;
  isDefault?: boolean;
  settings?: {
    [key: string]: any;
  }
}

export interface SettingSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

export interface AssociationMenuItem {
  id: string;
  title: string;
  icon: any;
  route: string;
  hasSubmenu?: boolean;
}

export interface AssociationMenuCategory {
  id: string;
  title: string;
  items: AssociationMenuItem[];
}
