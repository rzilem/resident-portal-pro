
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Smartphone, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSecuritySettings } from '@/hooks/use-security-settings';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const SecuritySettings: React.FC = () => {
  const {
    settings,
    isLoading,
    enableTwoFactor,
    disableTwoFactor,
    changePassword,
    logoutAllDevices
  } = useSecuritySettings();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleToggleTwoFactor = async (checked: boolean) => {
    if (checked) {
      await enableTwoFactor();
    } else {
      await disableTwoFactor();
    }
  };

  const handlePasswordSubmit = passwordForm.handleSubmit(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    const success = await changePassword(data.currentPassword, data.newPassword);
    if (success) {
      setPasswordDialogOpen(false);
      passwordForm.reset();
    }
  });

  const mockDevices = [
    { id: 'device-1', name: 'Windows PC - Chrome', lastActive: '2 minutes ago' },
    { id: 'device-2', name: 'iPhone 13 - Safari', lastActive: '1 day ago' },
    { id: 'device-3', name: 'MacBook Pro - Firefox', lastActive: '3 days ago' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={handleToggleTwoFactor}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Change your account password
                </p>
              </div>
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and a new password to update your account
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...passwordForm}>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter current password" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage all your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              These are devices that have logged into your account. Revoke any sessions that you don't recognize.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {mockDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">{device.name}</h4>
                    <p className="text-xs text-muted-foreground">Last active: {device.lastActive}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full" onClick={logoutAllDevices} disabled={isLoading}>
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? 'Logging out...' : 'Logout from all devices'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
