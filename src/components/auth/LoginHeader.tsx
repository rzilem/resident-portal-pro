
import React from 'react';
import { Link } from 'react-router-dom';

const LoginHeader = () => {
  return (
    <div className="mb-6 text-center">
      <Link to="/" className="inline-block">
        <img 
          src="/lovable-uploads/2adf9261-4bca-441e-8c61-dbfdeb68cbb6.png" 
          alt="ResidentPro Logo" 
          className="h-12 mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold text-gradient">ResidentPro</h1>
      </Link>
      <p className="text-muted-foreground mt-2">Access your community dashboard</p>
    </div>
  );
};

export default LoginHeader;
