
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Association } from '@/types/association';

interface AssociationHeaderProps {
  association: Association;
  fullAddress?: string;
}

const AssociationHeader: React.FC<AssociationHeaderProps> = ({ 
  association,
  fullAddress
}) => {
  const navigate = useNavigate();
  const associationCode = association.settings?.code || association.id;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building className="h-6 w-6" />
          {association.name}
        </h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Code: {associationCode}</span>
          {fullAddress && (
            <div className="flex items-center ml-3">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>{fullAddress}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={association.status === 'active' ? 'secondary' : 'outline'}>
          {association.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
        <Button variant="outline" onClick={() => navigate('/settings/associations')}>
          Edit Association
        </Button>
      </div>
    </div>
  );
};

export default AssociationHeader;
