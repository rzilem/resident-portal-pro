
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundState = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Resident Not Found</h1>
      <p className="mb-4">The resident profile you're looking for doesn't exist.</p>
      <Link to="/residents">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Residents
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundState;
