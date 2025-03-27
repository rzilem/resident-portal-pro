
import React from 'react';
import { Link } from 'react-router-dom';

const LoginHeader = () => {
  return (
    <div className="mb-6 text-center">
      <Link to="/" className="inline-block">
        <h1 className="text-2xl font-bold text-gradient">ResidentPro</h1>
      </Link>
      <p className="text-muted-foreground mt-2">Access your community dashboard</p>
    </div>
  );
};

export default LoginHeader;
