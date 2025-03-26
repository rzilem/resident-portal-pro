
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderX } from 'lucide-react';

const VendorNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <div className="bg-muted/30 rounded-full p-8 mb-6">
        <FolderX className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        We couldn't find the vendor you're looking for. It may have been removed or you may have followed an invalid link.
      </p>
      <Button onClick={() => navigate('/vendors')}>
        Back to Vendors
      </Button>
    </div>
  );
};

export default VendorNotFound;
