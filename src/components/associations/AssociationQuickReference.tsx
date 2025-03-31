
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building, Users, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Association } from '@/types/supabase';
import { formatDate, getDaySuffix } from '@/utils/formatters';

interface AssociationQuickReferenceProps {
  association: Association;
  className?: string;
}

const AssociationQuickReference: React.FC<AssociationQuickReferenceProps> = ({ 
  association,
  className = ''
}) => {
  // Format the founded_date if it exists
  const formattedEstablishedDate = association.founded_date 
    ? formatDate(association.founded_date, 'medium')
    : 'Not specified';

  // Calculate the number of years since establishment
  const getYearsSinceEstablishment = () => {
    if (!association.founded_date) return null;
    
    const establishedDate = new Date(association.founded_date);
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - establishedDate.getFullYear();
    
    return yearDiff;
  };

  const yearsSinceEstablishment = getYearsSinceEstablishment();

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Quick Reference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Association Type</p>
            <p className="text-sm text-muted-foreground">
              {association.type || 'Not specified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Number of Units</p>
            <p className="text-sm text-muted-foreground">
              {association.units || 'Not specified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Established</p>
            <p className="text-sm text-muted-foreground">
              {formattedEstablishedDate}
              {yearsSinceEstablishment !== null && (
                <span className="ml-1">({yearsSinceEstablishment} years ago)</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">
              {association.contact_phone || 'Not specified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">
              {association.contact_email || 'Not specified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-muted-foreground">
              {association.address || 'Not specified'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationQuickReference;
