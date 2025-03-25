
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CommunicationPreferences } from '@/types/user';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, MessageSquare, Save, Smartphone } from "lucide-react";

interface CommunicationPreferencesFormProps {
  preferences: CommunicationPreferences;
  updatePreferences: (preferences: CommunicationPreferences) => void;
}

const formSchema = z.object({
  allowEmailNotifications: z.boolean(),
  allowSmsNotifications: z.boolean(),
  allowPushNotifications: z.boolean(),
  emailFrequency: z.enum(["immediate", "daily", "weekly"]),
  subscribedTopics: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const topics = [
  { id: "maintenance", label: "Maintenance Updates" },
  { id: "events", label: "Community Events" },
  { id: "announcements", label: "Announcements" },
  { id: "board", label: "Board Communications" },
  { id: "financial", label: "Financial Notifications" },
  { id: "emergencies", label: "Emergency Alerts" },
];

const CommunicationPreferencesForm = ({ 
  preferences, 
  updatePreferences 
}: CommunicationPreferencesFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allowEmailNotifications: preferences.allowEmailNotifications,
      allowSmsNotifications: preferences.allowSmsNotifications,
      allowPushNotifications: preferences.allowPushNotifications,
      emailFrequency: preferences.emailFrequency,
      subscribedTopics: preferences.subscribedTopics || [],
    },
  });

  function onSubmit(data: FormValues) {
    updatePreferences({
      ...data,
      subscribedTopics: data.subscribedTopics || [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Email Frequency</CardTitle>
            <CardDescription>Choose how often you want to receive email updates</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="emailFrequency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="immediate" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Immediate - Send each notification as it happens
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="daily" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Daily Digest - Group all notifications and send once a day
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="weekly" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Weekly Summary - Send a weekly summary of all activity
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Topics</CardTitle>
            <CardDescription>Select the types of notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="subscribedTopics"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {topics.map((topic) => (
                      <FormItem
                        key={topic.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(topic.id)}
                            onCheckedChange={(checked) => {
                              const updatedTopics = checked
                                ? [...(field.value || []), topic.id]
                                : (field.value || []).filter(
                                    (value) => value !== topic.id
                                  );
                              field.onChange(updatedTopics);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {topic.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-4 bg-muted/30">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      <strong>Emergency alerts</strong> cannot be disabled and will always be sent
                      to ensure your safety and awareness of critical situations.
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CommunicationPreferencesForm;
