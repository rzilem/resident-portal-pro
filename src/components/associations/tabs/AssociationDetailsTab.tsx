
import React from 'react';
import { MapPin, Calendar, Users, Building, Hash, Globe, Mail, Phone, AlertTriangle, Droplet, ArrowUpDown, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Association } from '@/types/association';
import { formatDate } from '@/utils/formatters';

interface AssociationDetailsTabProps {
  association: Association;
}

const mockCriticalDates = {
  insuranceExpiration: '2025-06-15',
  poolPermitExpiration: '2024-05-30',
  elevatorInspection: '2024-08-10',
  fireInspection: '2024-07-22',
  buildingPermit: '2025-03-15',
};

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  const hasPool = association.settings?.hasPool;
  const hasElevator = association.settings?.hasElevator;

  return (
    <div className="mt-4 space-y-4">
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
                <p className="capitalize">{association.type}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Founded Date
                </h3>
                <p>{formatDate(association.foundedDate)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Total Units
                </h3>
                <p>{association.units} units</p>
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
                <p>{association.address.street}</p>
                <p>{association.address.city}, {association.address.state} {association.address.zipCode}</p>
                <p>{association.address.country}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </h3>
                <p>{association.contactInfo.email}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone
                </h3>
                <p>{association.contactInfo.phone}</p>
              </div>
              
              {association.contactInfo.website && (
                <div>
                  <h3 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Website
                  </h3>
                  <p>
                    <a 
                      href={association.contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {association.contactInfo.website}
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
                `${association.name} is a Homeowners Association founded in ${new Date(association.foundedDate).getFullYear()} 
                and consists of ${association.units} units. The association is located in ${association.address.city}, 
                ${association.address.state} and is currently ${association.status === 'active' ? 'active' : 'inactive'}.`
              ) : association.type === 'condo' ? (
                `${association.name} is a Condominium Association founded in ${new Date(association.foundedDate).getFullYear()} 
                and consists of ${association.units} units. The association is located in ${association.address.city}, 
                ${association.address.state} and is currently ${association.status === 'active' ? 'active' : 'inactive'}.`
              ) : (
                `${association.name} is a ${association.type} Association founded in ${new Date(association.foundedDate).getFullYear()} 
                and consists of ${association.units} units. The association is located in ${association.address.city}, 
                ${association.address.state} and is currently ${association.status === 'active' ? 'active' : 'inactive'}.`
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Critical Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div className="text-muted-foreground text-sm mb-1">Insurance Expiration</div>
                </div>
                <div className="font-medium mt-1">
                  {formatDate(mockCriticalDates.insuranceExpiration)}
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div className="text-muted-foreground text-sm mb-1">Fire Inspection Due</div>
                </div>
                <div className="font-medium mt-1">
                  {formatDate(mockCriticalDates.fireInspection)}
                </div>
              </div>
              
              {hasPool && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-cyan-500" />
                    <div className="text-muted-foreground text-sm mb-1">Pool Permit Expiration</div>
                  </div>
                  <div className="font-medium mt-1">
                    {formatDate(mockCriticalDates.poolPermitExpiration)}
                  </div>
                </div>
              )}
              
              {hasElevator && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5 text-violet-500" />
                    <div className="text-muted-foreground text-sm mb-1">Elevator Inspection Due</div>
                  </div>
                  <div className="font-medium mt-1">
                    {formatDate(mockCriticalDates.elevatorInspection)}
                  </div>
                </div>
              )}
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-500" />
                  <div className="text-muted-foreground text-sm mb-1">Building Permit Expiration</div>
                </div>
                <div className="font-medium mt-1">
                  {formatDate(mockCriticalDates.buildingPermit)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Association Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Current Status</div>
              <div className="font-medium capitalize">{association.status}</div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Association Code</div>
              <div className="font-medium">{association.settings?.code || association.id}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationDetailsTab;
