
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GLAccount } from '@/types/accounting';
import { toast } from 'sonner';

export const useGLAccounts = (associationId?: string) => {
  const [glAccounts, setGLAccounts] = useState<GLAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGLAccounts = async () => {
    if (!associationId) {
      setGLAccounts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gl_accounts')
        .select('*')
        .eq('association_id', associationId)
        .order('code');

      if (error) throw error;
      
      setGLAccounts(data || []);
    } catch (err) {
      console.error('Error fetching GL Accounts:', err);
      setError('Failed to load GL Accounts');
      toast.error('Could not load GL Accounts');
    } finally {
      setLoading(false);
    }
  };

  const createGLAccount = async (account: Omit<GLAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('gl_accounts')
        .insert(account)
        .select()
        .single();

      if (error) throw error;
      
      setGLAccounts(prev => [...prev, data]);
      toast.success('GL Account created successfully');
      return data;
    } catch (err) {
      console.error('Error creating GL Account:', err);
      toast.error('Failed to create GL Account');
      return null;
    }
  };

  const updateGLAccount = async (id: string, updates: Partial<GLAccount>) => {
    try {
      const { data, error } = await supabase
        .from('gl_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setGLAccounts(prev => 
        prev.map(account => account.id === id ? data : account)
      );
      toast.success('GL Account updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating GL Account:', err);
      toast.error('Failed to update GL Account');
      return null;
    }
  };

  useEffect(() => {
    fetchGLAccounts();
  }, [associationId]);

  return {
    glAccounts,
    loading,
    error,
    fetchGLAccounts,
    createGLAccount,
    updateGLAccount
  };
};
