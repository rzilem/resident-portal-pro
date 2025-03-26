
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const SecuritySettingsLoading = () => (
  <Card>
    <CardHeader>
      <CardTitle>Document Security Settings</CardTitle>
      <CardDescription>Loading document categories...</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </CardContent>
  </Card>
);

export default SecuritySettingsLoading;
