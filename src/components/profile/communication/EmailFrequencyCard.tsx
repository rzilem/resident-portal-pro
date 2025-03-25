
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CommunicationFormValues } from './types';

interface EmailFrequencyCardProps {
  form: UseFormReturn<CommunicationFormValues>;
}

const EmailFrequencyCard = ({ form }: EmailFrequencyCardProps) => {
  return (
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
  );
};

export default EmailFrequencyCard;
