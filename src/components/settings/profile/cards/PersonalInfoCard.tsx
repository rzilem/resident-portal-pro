
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserRound, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from '../types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PersonalInfoCardProps {
  form: Partial<UseFormReturn<ProfileFormValues>>;
  isAdmin?: boolean;
  onSubmit?: () => void;
}

const PersonalInfoCard = ({ form, isAdmin, onSubmit }: PersonalInfoCardProps) => {
  // Form handling logic
  const handleFirstNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue?.('firstName', e.target.value);
  };

  const handleLastNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue?.('lastName', e.target.value);
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue?.('email', e.target.value);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue?.('phoneNumber', e.target.value);
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue?.('address', e.target.value);
  };

  const handleBioInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue?.('bio', e.target.value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        {isAdmin && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin Mode
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.control ? (
            // React Hook Form version
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="First Name" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            // Simplified input for ProfileSettings
            <div className="relative">
              <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="First Name" 
                value={form.getValues?.('firstName') || ''}
                onChange={handleFirstNameInput}
              />
            </div>
          )}

          {form.control ? (
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <Input 
              placeholder="Last Name" 
              value={form.getValues?.('lastName') || ''}
              onChange={handleLastNameInput}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.control ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Email" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Email" 
                value={form.getValues?.('email') || ''}
                onChange={handleEmailInput}
              />
            </div>
          )}

          {form.control ? (
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Phone Number" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Phone Number" 
                value={form.getValues?.('phoneNumber') || ''}
                onChange={handlePhoneInput}
              />
            </div>
          )}
        </div>

        {form.control ? (
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Address" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Address" 
              value={form.getValues?.('address') || ''}
              onChange={handleAddressInput}
            />
          </div>
        )}

        {form.control ? (
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us a little about yourself..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <Textarea 
            placeholder="Tell us a little about yourself..." 
            className="min-h-[100px]" 
            value={form.getValues?.('bio') || ''}
            onChange={handleBioInput}
          />
        )}
      </CardContent>
      {onSubmit && (
        <CardFooter className="flex justify-end">
          <Button 
            type="button" 
            onClick={onSubmit}
            className={isAdmin ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            {isAdmin ? "Save with Admin Rights" : "Save Changes"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PersonalInfoCard;
