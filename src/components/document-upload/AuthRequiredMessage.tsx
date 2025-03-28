
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const AuthRequiredMessage: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="text-center p-6">
        <p className="text-muted-foreground">Please log in to upload documents.</p>
      </CardContent>
    </Card>
  );
};
