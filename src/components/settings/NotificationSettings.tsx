
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    announcements: true,
    maintenance: true,
    payments: true,
    events: false,
    documents: true,
    messages: true
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    announcements: false,
    maintenance: true,
    payments: true,
    events: false,
    documents: false,
    messages: true
  });

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Notification preferences saved!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Manage emails you receive from ResidentPro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <div key={`email-${key}`} className="flex items-center justify-between py-2">
                <Label htmlFor={`email-${key}`} className="font-normal cursor-pointer flex-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Switch 
                  id={`email-${key}`} 
                  checked={value} 
                  onCheckedChange={() => handleEmailToggle(key as keyof typeof emailNotifications)} 
                />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Manage push notifications on your devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(pushNotifications).map(([key, value]) => (
              <div key={`push-${key}`} className="flex items-center justify-between py-2">
                <Label htmlFor={`push-${key}`} className="font-normal cursor-pointer flex-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Switch 
                  id={`push-${key}`} 
                  checked={value} 
                  onCheckedChange={() => handlePushToggle(key as keyof typeof pushNotifications)} 
                />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Digest</CardTitle>
            <CardDescription>Receive a weekly summary of important updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="weekly-digest" className="font-normal cursor-pointer flex-1">
                Enable weekly digest email
              </Label>
              <Switch id="weekly-digest" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default NotificationSettings;
