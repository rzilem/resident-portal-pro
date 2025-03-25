
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';

const AssociationAccountsLink: React.FC = () => {
  return (
    <Button asChild variant="outline" className="gap-1">
      <Link to="/accounting/gl-accounts">
        <Landmark className="h-4 w-4 mr-1" />
        Manage GL Accounts
      </Link>
    </Button>
  );
};

export default AssociationAccountsLink;
