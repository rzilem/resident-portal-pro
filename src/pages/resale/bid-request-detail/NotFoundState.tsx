
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Alert variant="destructive">
        <AlertTitle>Bid Request Not Found</AlertTitle>
        <AlertDescription>
          The bid request you are looking for could not be found. Please check the URL or go back to the bid requests page.
        </AlertDescription>
      </Alert>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => navigate('/resale/bid-requests')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bid Requests
      </Button>
    </div>
  );
};

export default NotFoundState;
