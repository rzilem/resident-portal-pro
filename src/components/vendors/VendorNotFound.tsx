
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardX, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Vendor Not Found</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <ClipboardX className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            The vendor profile you are looking for could not be found. It may have been removed or the ID is incorrect.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/vendors')}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Vendors
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VendorNotFound;
