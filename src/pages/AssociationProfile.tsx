
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';
import { Association } from '@/types/association';
import { getPropertiesFromAssociations } from '@/components/properties/PropertyHelpers';
import { toast } from 'sonner';

// Imported Components
import AssociationHeader from '@/components/associations/AssociationHeader';
import AssociationStats from '@/components/associations/AssociationStats';
import AssociationPhotos from '@/components/associations/AssociationPhotos';
import AssociationAmenities from '@/components/associations/AssociationAmenities';
import AssociationTabs from '@/components/associations/AssociationTabs';
import CalendarView from '@/components/calendar/CalendarView';
import { getAssociationById } from '@/services/associationService';

const AssociationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { associations, isLoading: associationsLoading } = useAssociations();
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Association ID from URL:', id);
    
    const loadAssociation = async () => {
      if (!id) return;
      
      try {
        // Try to find in the cache first
        const cachedAssociation = associations.find(a => a.id === id);
        if (cachedAssociation) {
          console.log('Found association in cache:', cachedAssociation);
          setAssociation(cachedAssociation);
          setLoading(false);
          return;
        }
        
        // If not in cache and associations are still loading, wait for them
        if (associationsLoading) {
          console.log('Associations still loading, waiting...');
          return;
        }
        
        // If associations are loaded but the association wasn't found, try to fetch it directly
        console.log('Association not found in cache, fetching directly...');
        const fetchedAssociation = await getAssociationById(id);
        
        if (fetchedAssociation) {
          console.log('Fetched association directly:', fetchedAssociation);
          setAssociation(fetchedAssociation);
        } else {
          console.log('Association not found, even after direct fetch.');
          toast.error('Association not found');
        }
      } catch (error) {
        console.error('Error loading association:', error);
        toast.error('Failed to load association');
      } finally {
        setLoading(false);
      }
    };
    
    loadAssociation();
  }, [id, associations, associationsLoading]);

  if (loading || associationsLoading) {
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
            We couldn't find the association you're looking for. (ID: {id})
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

  // Standard user ID and access level for calendar - same as in Calendar.tsx
  const userId = 'current-user';
  const userAccessLevel = 'admin' as const;

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-6">
        <AssociationHeader association={association} fullAddress={fullAddress} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-3">
            <AssociationStats association={association} />
            <AssociationPhotos associationName={association.name} propertyImages={propertyImages} />
            <AssociationAmenities association={association} />
          </div>
        </div>

        {/* Association Calendar Section - Using same implementation as in Calendar.tsx */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Association Calendar</h2>
          <div className="bg-white rounded-md shadow">
            <CalendarView 
              userId={userId}
              userAccessLevel={userAccessLevel}
              associationId={association.id}
              isGlobalAdmin={false}
            />
          </div>
        </div>

        <AssociationTabs 
          association={association} 
          properties={properties} 
          className="mt-6" 
        />
      </div>
    </div>
  );
};

export default AssociationProfile;
