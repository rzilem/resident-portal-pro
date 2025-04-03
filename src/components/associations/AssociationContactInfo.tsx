
import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Association } from '@/types/association';

interface AssociationContactInfoProps {
  association: Association;
}

const AssociationContactInfo: React.FC<AssociationContactInfoProps> = ({ association }) => {
  // Ensure contactInfo exists to prevent "Cannot read properties of undefined" errors
  const contactInfo = association?.contactInfo || { email: '', phone: '', website: '' };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{contactInfo.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{contactInfo.phone}</span>
        </div>
        {contactInfo.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={contactInfo.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-primary hover:underline"
            >
              {contactInfo.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationContactInfo;
