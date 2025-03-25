
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Bell, Mail, Smartphone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CommunicationFormValues } from './types';

interface NotificationChannelsCardProps {
  form: UseFormReturn<CommunicationFormValues>;
}

const NotificationChannelsCard = ({ form }: NotificationChannelsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Channels</CardTitle>
        <CardDescription>Choose how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="allowEmailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications via email
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="allowSmsNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  SMS Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications via text message
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="allowPushNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Push Notifications
                </FormLabel>
                <FormDescription>
                  Receive in-app push notifications
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default NotificationChannelsCard;
