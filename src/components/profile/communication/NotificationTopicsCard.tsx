
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { MessageSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunicationFormValues } from './types';
import { Topic } from './types';

interface NotificationTopicsCardProps {
  form: UseFormReturn<CommunicationFormValues>;
  topics: Topic[];
}

const NotificationTopicsCard = ({ form, topics }: NotificationTopicsCardProps) => {
  return (
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
  );
};

export default NotificationTopicsCard;
