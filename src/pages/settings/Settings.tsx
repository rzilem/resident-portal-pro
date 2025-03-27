
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Placeholder components for the settings tabs
const AccountSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Account Settings</CardTitle>
      <CardDescription>Manage your account details and preferences</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Account settings content will go here.</p>
    </CardContent>
  </Card>
);

const ProfileSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Profile Settings</CardTitle>
      <CardDescription>Update your profile information</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Profile settings content will go here.</p>
    </CardContent>
  </Card>
);

const SecuritySettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Security Settings</CardTitle>
      <CardDescription>Manage your security preferences</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Security settings content will go here.</p>
    </CardContent>
  </Card>
);

const Settings = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Routes>
          <Route index element={
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
              
              <TabsContent value="profile">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>
            </Tabs>
          } />
        </Routes>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
