
import React from 'react';
import { Link } from 'react-router-dom';

const LoginHeader = () => {
  return (
    <div className="mb-6 text-center">
      <Link to="/" className="inline-block">
        <img 
          src="/lovable-uploads/6088e842-7579-4b26-8d7d-2ccc84fdb285.png" 
          alt="PS Management Logo" 
          className="h-12 mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold text-gradient">PS Management</h1>
      </Link>
      <p className="text-muted-foreground mt-2">Access your community dashboard</p>
    </div>
  );
};

export default LoginHeader;
