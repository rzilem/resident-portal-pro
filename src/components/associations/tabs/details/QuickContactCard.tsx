
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Calendar, Clipboard, FileText, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Association } from '@/types/association';
import { getDaySuffix } from '@/utils/formatters';

interface QuickContactCardProps {
  association: Association;
  fullAddress: string;
}

const QuickContactCard: React.FC<QuickContactCardProps> = ({ 
  association, 
  fullAddress 
}) => {
  const navigate = useNavigate();

  // Mock data for manager contacts (in a real app, this would come from the association object)
  const communityManager = {
    name: "Jane Smith",
    phone: association.contactInfo.phone,
    email: association.contactInfo.email
  };
  
  const assistantManager = {
    name: "John Davis",
    phone: "555-123-4567",
    email: "john.davis@example.com"
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Quick Reference & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            Community Manager
          </h4>
          <p className="text-sm font-medium">{communityManager.name}</p>
          <p className="text-sm">{communityManager.phone}</p>
          <p className="text-sm">{communityManager.email}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Assistant Manager
          </h4>
          <p className="text-sm font-medium">{assistantManager.name}</p>
          <p className="text-sm">{assistantManager.phone}</p>
          <p className="text-sm">{assistantManager.email}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1">
            <Clipboard className="h-3.5 w-3.5 text-muted-foreground" />
            Association Type
          </h4>
          <p className="text-sm capitalize">{association.type}</p>
        </div>
        
        <Separator className="my-1" />
        
        <div className="pt-1">
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

export default QuickContactCard;
