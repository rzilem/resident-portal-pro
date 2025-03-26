
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar, Clipboard, FileText, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Association } from '@/types/association';
import { getDaySuffix } from '@/utils/formatters';

interface AssociationQuickReferenceProps {
  association: Association;
  fullAddress: string;
}

const AssociationQuickReference: React.FC<AssociationQuickReferenceProps> = ({ 
  association, 
  fullAddress 
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Quick Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Address
          </h4>
          <p className="text-sm">{fullAddress}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            Contact
          </h4>
          <p className="text-sm">{association.contactInfo.phone}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email
          </h4>
          <p className="text-sm">{association.contactInfo.email}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Next Dues
          </h4>
          <p className="text-sm">
            {association.settings?.dueDay ? 
              `${association.settings.dueDay}${getDaySuffix(association.settings.dueDay)} of each ${association.settings?.feesFrequency || 'month'}` : 
              'No due date set'}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Clipboard className="h-3.5 w-3.5 text-muted-foreground" />
            Association Type
          </h4>
          <p className="text-sm capitalize">{association.type}</p>
        </div>
        
        <div className="pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs" 
            onClick={() => navigate(`/documents/AssociationDocuments?id=${association.id}`)}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            View Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationQuickReference;
