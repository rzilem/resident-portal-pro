
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const SecuritySettingsAccessDenied = () => (
  <Card>
    <CardHeader>
      <CardTitle>Document Security Settings</CardTitle>
      <CardDescription>Configure document access permissions</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
        <p className="text-amber-800 dark:text-amber-300">
          You need administrator permissions to manage document security settings.
        </p>
      </div>
    </CardContent>
  </Card>
);

export default SecuritySettingsAccessDenied;
