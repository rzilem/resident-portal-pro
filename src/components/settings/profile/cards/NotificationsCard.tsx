
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NotificationsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="text-xs text-muted-foreground">Receive notifications via email</span>
          </Label>
          <Switch id="email-notifications" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
            <span>Push Notifications</span>
            <span className="text-xs text-muted-foreground">Receive push notifications on your device</span>
          </Label>
          <Switch id="push-notifications" />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="updates-notifications" className="flex flex-col space-y-1">
            <span>Product Updates</span>
            <span className="text-xs text-muted-foreground">Receive updates about new features</span>
          </Label>
          <Switch id="updates-notifications" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
