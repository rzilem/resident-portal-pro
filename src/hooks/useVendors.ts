
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vendor } from '@/types/vendor';
import { 
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
} from '@/api/vendorApi';

export const useVendors = () => {
  const queryClient = useQueryClient();
  
  const { 
    data: vendors = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors
  });

  const createVendorMutation = useMutation({
    mutationFn: (newVendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => 
      createVendor(newVendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Vendor> }) => 
      updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  return {
    vendors,
    isLoading,
    error,
    refetchVendors: refetch,
    createVendor: createVendorMutation.mutate,
    updateVendor: updateVendorMutation.mutate,
    deleteVendor: deleteVendorMutation.mutate,
    isCreating: createVendorMutation.isPending,
    isUpdating: updateVendorMutation.isPending,
    isDeleting: deleteVendorMutation.isPending
  };
};

export const useVendor = (id: string | undefined) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const queryClient = useQueryClient();

  const { 
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => id ? getVendorById(id) : null,
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      setVendor(data);
    }
  }, [data]);

  const updateVendorMutation = useMutation({
    mutationFn: (updates: Partial<Vendor>) => 
      id ? updateVendor(id, updates) : Promise.resolve(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', id] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  return {
    vendor,
    setVendor,
    isLoading,
    error,
    refetchVendor: refetch,
    updateVendor: updateVendorMutation.mutate,
    isUpdating: updateVendorMutation.isPending
  };
};
