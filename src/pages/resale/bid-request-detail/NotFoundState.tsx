
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="border-destructive/20">
        <CardContent className="pt-6 pb-6 flex flex-col items-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <FileX className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Bid Request Not Found</h2>
          <p className="text-muted-foreground text-center mb-6">
            The bid request you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/resale/bid-requests')} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Bid Requests
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundState;
