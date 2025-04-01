
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthRequiredMessage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="h-5 w-5 text-amber-500" />
          Authentication Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          You need to be logged in to upload documents.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full">
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
};
