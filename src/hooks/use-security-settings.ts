
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string | null;
  loginAttempts: number;
  securityQuestions: boolean;
  activeDevices: string[];
  lastLogin: string | null;
}

const defaultSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  passwordLastChanged: null,
  loginAttempts: 0,
  securityQuestions: false,
  activeDevices: [],
  lastLogin: null
};

export function useSecuritySettings() {
  // In a real application, this would be fetched from a backend
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecuritySettings);
  const [isLoading, setIsLoading] = useState(false);

  const enableTwoFactor = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        twoFactorEnabled: true
      }));
      
      toast.success('Two-factor authentication enabled successfully');
      return true;
    } catch (err) {
      toast.error('Failed to enable two-factor authentication');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableTwoFactor = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        twoFactorEnabled: false
      }));
      
      toast.success('Two-factor authentication disabled');
      return true;
    } catch (err) {
      toast.error('Failed to disable two-factor authentication');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Mock password validation
      if (currentPassword !== 'password') {
        toast.error('Current password is incorrect');
        setIsLoading(false);
        return false;
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        passwordLastChanged: new Date().toISOString()
      }));
      
      toast.success('Password changed successfully');
      return true;
    } catch (err) {
      toast.error('Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupSecurityQuestions = useCallback(async (questions: {question: string; answer: string}[]) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        securityQuestions: true
      }));
      
      toast.success('Security questions set up successfully');
      return true;
    } catch (err) {
      toast.error('Failed to set up security questions');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutDevice = useCallback(async (deviceId: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        activeDevices: prev.activeDevices.filter(id => id !== deviceId)
      }));
      
      toast.success('Device logged out successfully');
      return true;
    } catch (err) {
      toast.error('Failed to log out device');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutAllDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        activeDevices: []
      }));
      
      toast.success('All devices logged out successfully');
      return true;
    } catch (err) {
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
    setupSecurityQuestions,
    logoutDevice,
    logoutAllDevices
  };
}
