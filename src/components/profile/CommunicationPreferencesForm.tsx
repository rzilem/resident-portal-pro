
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CommunicationPreferences } from '@/types/user';
import { Form } from "@/components/ui/form";
import NotificationChannelsCard from './communication/NotificationChannelsCard';
import EmailFrequencyCard from './communication/EmailFrequencyCard';
import NotificationTopicsCard from './communication/NotificationTopicsCard';
import { communicationFormSchema, CommunicationFormValues, NOTIFICATION_TOPICS } from './communication/types';

interface CommunicationPreferencesFormProps {
  preferences: CommunicationPreferences;
  updatePreferences: (preferences: CommunicationPreferences) => void;
}

const CommunicationPreferencesForm = ({ 
  preferences, 
  updatePreferences 
}: CommunicationPreferencesFormProps) => {
  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationFormSchema),
    defaultValues: {
      allowEmailNotifications: preferences.allowEmailNotifications,
      allowSmsNotifications: preferences.allowSmsNotifications,
      allowPushNotifications: preferences.allowPushNotifications,
      emailFrequency: preferences.emailFrequency,
      subscribedTopics: preferences.subscribedTopics || [],
    },
  });

  function onSubmit(data: CommunicationFormValues) {
    updatePreferences({
      allowEmailNotifications: data.allowEmailNotifications,
      allowSmsNotifications: data.allowSmsNotifications,
      allowPushNotifications: data.allowPushNotifications,
      emailFrequency: data.emailFrequency,
      subscribedTopics: data.subscribedTopics || [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NotificationChannelsCard form={form} />
        <EmailFrequencyCard form={form} />
        <NotificationTopicsCard form={form} topics={NOTIFICATION_TOPICS} />
      </form>
    </Form>
  );
};

export default CommunicationPreferencesForm;
