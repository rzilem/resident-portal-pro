
import React from 'react';
import { Link } from 'react-router-dom';
import CompanyLogo from '@/components/branding/CompanyLogo';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  return (
    <div className={className}>
      <Link to="/" className="flex items-center">
        <CompanyLogo height={40} width={180} />
      </Link>
    </div>
  );
};

export default AppHeader;
