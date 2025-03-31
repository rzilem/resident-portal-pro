
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, KeyRound, LockKeyhole, Eye, EyeOff, Shield, Smartphone } from "lucide-react";

const SecuritySettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginNotificationsEnabled, setLoginNotificationsEnabled] = useState(true);
  const [apiAccessEnabled, setApiAccessEnabled] = useState(false);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would validate and change password
    toast.success("Password changed successfully");
  };
  
  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    toast.success("Two-factor authentication enabled");
  };
  
  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast.success("Two-factor authentication disabled");
  };
  
  const handleSessionTimeoutChange = (value: number) => {
    setSessionTimeout(value);
    toast.success(`Session timeout set to ${value} minutes`);
  };
  
  const toggleLoginNotifications = () => {
    setLoginNotificationsEnabled(!loginNotificationsEnabled);
    toast.success(`Login notifications ${!loginNotificationsEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const toggleApiAccess = () => {
    setApiAccessEnabled(!apiAccessEnabled);
    toast.success(`API access ${!apiAccessEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const handlePasswordExpiryChange = (value: number) => {
    setPasswordExpiryDays(value);
    toast.success(`Password expiry set to ${value} days`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
      <p className="text-muted-foreground">
        Manage your account security settings, passwords, and authentication methods.
      </p>
      
      <div className="grid gap-6">
        {/* Password Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle>Password Management</CardTitle>
            </div>
            <CardDescription>
              Change your password or update password security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="password-expiry">Password Expires After</Label>
                <select
                  id="password-expiry"
                  className="p-2 rounded border"
                  value={passwordExpiryDays}
                  onChange={(e) => handlePasswordExpiryChange(Number(e.target.value))}
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                  <option value="0">Never</option>
                </select>
              </div>
              
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            </div>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Protect your account with an additional verification step
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={twoFactorEnabled ? handleDisable2FA : undefined}
              />
            </div>
            
            {!twoFactorEnabled && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Set Up 2FA</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Scan the QR code with your authenticator app to enable 2FA on your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="border p-4 rounded-md w-64 h-64 flex items-center justify-center bg-muted">
                      <ShieldCheck className="h-32 w-32 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input id="verification-code" placeholder="Enter 6-digit code" />
                    </div>
                    <Button onClick={handleEnable2FA} className="w-full">
                      Verify and Enable
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
        
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>
              Manage your session and login security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after a period of inactivity
                </p>
              </div>
              <select
                className="p-2 rounded border"
                value={sessionTimeout}
                onChange={(e) => handleSessionTimeoutChange(Number(e.target.value))}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="0">Never</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new login attempts
                </p>
              </div>
              <Switch
                checked={loginNotificationsEnabled}
                onCheckedChange={toggleLoginNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>API Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access to your account via API
                </p>
              </div>
              <Switch
                checked={apiAccessEnabled}
                onCheckedChange={toggleApiAccess}
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              <ShieldAlert className="h-4 w-4 inline-block mr-1" />
              For security reasons, some actions may require password re-authentication.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
