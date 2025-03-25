
export interface Owner {
  id: number;
  name: string;
  unit: string;
  email: string;
}

export interface Association {
  id: number;
  name: string;
  location: string;
  owners: Owner[];
}
