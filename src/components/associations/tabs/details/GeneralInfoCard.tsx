
import React from 'react';
import { Building, Calendar, Users, Hash, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Association } from '@/types/association';
import { formatDate } from '@/utils/formatters';

interface GeneralInfoCardProps {
  association: Association;
}

const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({ association }) => {
  // Ensure contactInfo and address exist to prevent "Cannot read properties of undefined" errors
  const contactInfo = association?.contactInfo || { email: '', phone: '', website: '' };
  const address = association?.address || { street: '', city: '', state: '', zipCode: '', country: '' };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                Association Type
              </h3>
              <p className="capitalize">{association.type || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Founded Date
              </h3>
              <p>{association.foundedDate ? formatDate(association.foundedDate) : 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                Total Units
              </h3>
              <p>{association.units || 0} units</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Association ID
              </h3>
              <p>{association.id}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Address
              </h3>
              <p>{address.street || 'N/A'}</p>
              <p>{address.city || 'N/A'}, {address.state || 'N/A'} {address.zipCode || 'N/A'}</p>
              <p>{address.country || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </h3>
              <p>{contactInfo.email || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone
              </h3>
              <p>{contactInfo.phone || 'N/A'}</p>
            </div>
            
            {contactInfo.website && (
              <div>
                <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </h3>
                <p>
                  <a 
                    href={contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {contactInfo.website}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">Association Description</h3>
          <p className="text-muted-foreground">
            {association.type === 'hoa' ? (
              `${association.name} is a Homeowners Association founded in ${association.foundedDate ? new Date(association.foundedDate).getFullYear() : 'N/A'} 
              and consists of ${association.units || 0} units. The association is located in ${address.city || 'N/A'}, 
              ${address.state || 'N/A'} and is currently ${association.status === 'active' ? 'active' : 'inactive'}.`
            ) : association.type === 'condo' ? (
              `${association.name} is a Condominium Association founded in ${association.foundedDate ? new Date(association.foundedDate).getFullYear() : 'N/A'} 
              and consists of ${association.units || 0} units. The association is located in ${address.city || 'N/A'}, 
              ${address.state || 'N/A'} and is currently ${association.status === 'active' ? 'active' : 'inactive'}.`
            ) : (
              `${association.name} is a ${association.type || 'Unknown'} Association founded in ${association.foundedDate ? new Date(association.foundedDate).getFullYear() : 'N/A'} 
              and consists of ${association.units || 0} units. The association is located in ${address.city || 'N/A'}, 
              ${address.state || 'N/A'} and is currently ${association.status === 'active' ? 'active' : 'inactive'}.`
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoCard;
