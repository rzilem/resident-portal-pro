
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';
import { Association } from '@/types/association';
import { getPropertiesFromAssociations } from '@/components/properties/PropertyHelpers';

// Imported Components
import AssociationHeader from '@/components/associations/AssociationHeader';
import AssociationStats from '@/components/associations/AssociationStats';
import AssociationPhotos from '@/components/associations/AssociationPhotos';
import AssociationAmenities from '@/components/associations/AssociationAmenities';
import AssociationQuickReference from '@/components/associations/AssociationQuickReference';
import AssociationContactInfo from '@/components/associations/AssociationContactInfo';
import AssociationDetailsCard from '@/components/associations/AssociationDetailsCard';
import AssociationTabs from '@/components/associations/AssociationTabs';

const AssociationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { associations } = useAssociations();
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (associations.length > 0 && id) {
      const foundAssociation = associations.find(a => a.id === id);
      setAssociation(foundAssociation || null);
      setLoading(false);
    }
  }, [associations, id]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading association details...</p>
        </div>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Association Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the association you're looking for.
          </p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => navigate('/properties')}
          >
            Return to Properties
          </button>
        </div>
      </div>
    );
  }

  const properties = getPropertiesFromAssociations([association]);
  
  const fullAddress = `${association.address.street}, ${association.address.city}, ${association.address.state} ${association.address.zipCode}, ${association.address.country}`;
  
  const propertyImages = [
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6'
  ];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-6">
        <AssociationHeader association={association} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <AssociationStats association={association} />
            <AssociationPhotos associationName={association.name} propertyImages={propertyImages} />
            <AssociationAmenities association={association} />
          </div>
          
          <div className="space-y-6">
            <AssociationQuickReference association={association} fullAddress={fullAddress} />
            <AssociationContactInfo association={association} />
            <AssociationDetailsCard association={association} />
          </div>
        </div>

        <AssociationTabs association={association} properties={properties} />
      </div>
    </div>
  );
};

export default AssociationProfile;
