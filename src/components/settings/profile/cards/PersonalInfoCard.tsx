
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues, FormAdapter } from '../types';

interface PersonalInfoCardProps {
  form: Partial<UseFormReturn<ProfileFormValues>> | FormAdapter;
  isAdmin?: boolean;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ form, isAdmin = false }) => {
  // Check if we're using a React Hook Form instance or a custom adapter
  const isRHF = 'control' in form && form.control;
  
  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/avatars/01.png" alt="Profile picture" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </div>
          {isAdmin && (
            <Badge variant="outline" className="absolute top-4 right-4 bg-amber-100 text-amber-800 border-amber-300">
              Admin
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isRHF ? (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input 
                  id="firstName" 
                  value={(form.getValues && form.getValues('firstName') as string) || ''}
                  onChange={(e) => form.setValue && form.setValue('firstName', e.target.value)}
                  placeholder="Enter your first name" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input 
                  id="lastName" 
                  value={(form.getValues && form.getValues('lastName') as string) || ''}
                  onChange={(e) => form.setValue && form.setValue('lastName', e.target.value)}
                  placeholder="Enter your last name" 
                />
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isRHF ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  value={(form.getValues && form.getValues('email') as string) || ''}
                  onChange={(e) => form.setValue && form.setValue('email', e.target.value)}
                  placeholder="Enter your email" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                <Input 
                  id="phoneNumber" 
                  value={(form.getValues && form.getValues('phoneNumber') as string) || ''}
                  onChange={(e) => form.setValue && form.setValue('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number" 
                />
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-2">
          {isRHF ? (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input 
                id="address" 
                value={(form.getValues && form.getValues('address') as string) || ''}
                onChange={(e) => form.setValue && form.setValue('address', e.target.value)}
                placeholder="Enter your address" 
              />
            </>
          )}
        </div>
        
        <div className="space-y-2">
          {isRHF ? (
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write a short bio about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <label htmlFor="bio" className="text-sm font-medium">Bio</label>
              <Textarea 
                id="bio" 
                value={(form.getValues && form.getValues('bio') as string) || ''}
                onChange={(e) => form.setValue && form.setValue('bio', e.target.value)}
                placeholder="Write a short bio about yourself" 
              />
            </>
          )}
        </div>
      </CardContent>
      {!isRHF && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PersonalInfoCard;
