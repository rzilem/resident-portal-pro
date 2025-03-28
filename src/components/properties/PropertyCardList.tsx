
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { PropertyColumn } from './PropertyColumnsSelector';
import { Property } from './PropertyHelpers';

interface PropertyCardListProps {
  properties: Property[];
  columns: PropertyColumn[];
}

const PropertyCardList = ({ properties, columns }: PropertyCardListProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const navigateToAssociation = (associationId: string) => {
    // Navigate to the property profile page for the specific association
    if (id !== associationId) {
      navigate(`/properties/${associationId}`);
    }
  };

  return (
    <div className="space-y-4">
      {properties.map((property, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle 
              className="text-primary cursor-pointer hover:underline"
              onClick={() => navigateToAssociation(property.associationId || 'unknown')}
            >
              {property.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 space-y-3">
            <div className="flex justify-between items-start">
              <Badge variant={property.status === 'Active' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Onboarded: {new Date(property.onboardingDate).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {property.location}
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                {property.units} Units
              </div>
              {columns.find(col => col.id === 'assessmentFrequency' && col.checked) && (
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  {property.assessmentFrequency}
                </div>
              )}
            </div>
            
            <div className="mt-2 pt-2 border-t border-border">
              {columns
                .filter(col => 
                  col.checked && 
                  !['name', 'location', 'units', 'status', 'onboardingDate', 'assessmentFrequency'].includes(col.id)
                )
                .map(col => {
                  const value = property[col.id as keyof typeof property];
                  if (value === undefined) return null;
                  
                  return (
                    <div key={col.id} className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">{col.label}:</span>
                      <span className="font-medium">
                        {typeof value === 'boolean' 
                          ? (value ? 'Yes' : 'No') 
                          : (col.id === 'annualFees' ? `$${value}` : value)
                        }
                      </span>
                    </div>
                  );
                })
              }
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyCardList;
