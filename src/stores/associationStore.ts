
import { create } from 'zustand';

interface Association {
  id: string;
  name: string;
  // Add other association properties as needed
}

interface AssociationState {
  currentAssociation: Association | null;
  setCurrentAssociation: (association: Association | null) => void;
}

export const useAssociationStore = create<AssociationState>((set) => ({
  currentAssociation: null,
  setCurrentAssociation: (association) => set({ currentAssociation: association }),
}));
