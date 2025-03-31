import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string | null;
  activeSessions: {
    id: string;
    device: string;
    lastActive: string;
    current: boolean;
  }[];
}

export function useSecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordLastChanged: null,
    activeSessions: [
      { id: 'session-1', device: 'Windows PC - Chrome', lastActive: '2 minutes ago', current: true },
      { id: 'session-2', device: 'iPhone 13 - Safari', lastActive: '1 day ago', current: false },
      { id: 'session-3', device: 'MacBook Pro - Firefox', lastActive: '3 days ago', current: false }
    ]
  });

  const enableTwoFactor = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, twoFactorEnabled: true }));
      toast.success('Two-factor authentication enabled');
      return true;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable two-factor authentication');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableTwoFactor = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, twoFactorEnabled: false }));
      toast.success('Two-factor authentication disabled');
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable two-factor authentication');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Simulate API call and validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would validate currentPassword against stored password
      if (currentPassword === 'invalid') {
        toast.error('Current password is incorrect');
        return false;
      }
      
      setSettings(prev => ({ 
        ...prev, 
        passwordLastChanged: new Date().toISOString() 
      }));
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(s => s.id !== sessionId)
      }));
      toast.success('Session logged out successfully');
      return true;
    } catch (error) {
      console.error('Error logging out session:', error);
      toast.error('Failed to log out session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutAllDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Keep only current session
      setSettings(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(s => s.current)
      }));
      toast.success('All other devices logged out successfully');
      return true;
    } catch (error) {
      console.error('Error logging out all devices:', error);
      toast.error('Failed to log out all devices');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    settings,
    isLoading,
    enableTwoFactor,
    disableTwoFactor,
    changePassword,
    logoutSession,
    logoutAllDevices
  };
}
