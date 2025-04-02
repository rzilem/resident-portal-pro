
import { useAssociationStore } from '@/stores/associationStore';

/**
 * A hook that provides access to the currently selected association
 * @returns Object with selectedAssociation and related methods
 */
export const useSelectedAssociation = () => {
  const currentAssociation = useAssociationStore((state) => state.currentAssociation);
  const setCurrentAssociation = useAssociationStore((state) => state.setCurrentAssociation);

  return {
    selectedAssociation: currentAssociation,
    setSelectedAssociation: setCurrentAssociation,
  };
};
