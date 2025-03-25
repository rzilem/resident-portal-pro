
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  UserRound, 
  Shield, 
  Bell, 
  Car, 
  Phone, 
  UserCog 
} from "lucide-react";
import ProfileForm from '@/components/profile/ProfileForm';
import EmergencyContactsForm from '@/components/profile/EmergencyContactsForm';
import CommunicationPreferencesForm from '@/components/profile/CommunicationPreferencesForm';
import VehiclesForm from '@/components/profile/VehiclesForm';
import { User } from '@/types/user';

// Mock user data - in a real app this would come from your auth system
const mockUser: User = {
  id: "user-1",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
  role: "resident",
  createdAt: "2023-01-15T10:30:00Z",
  lastLogin: "2023-06-10T08:45:00Z",
  status: "active",
  type: "homeowner",
  associationIds: ["assoc-1"],
  committees: ["landscaping"],
  phoneNumber: "(555) 123-4567",
  address: "123 Main St, Apt 4B, Anytown, CA 12345",
  bio: "Resident since 2018. I enjoy community gardening and organizing neighborhood events.",
  profileImageUrl: "",
  emergencyContacts: [
    {
      id: "ec-1",
      name: "John Smith",
      relationship: "Spouse",
      phoneNumber: "(555) 987-6543",
      email: "john.smith@example.com",
      isAuthorized: true
    }
  ],
  vehicleInfo: [
    {
      id: "v-1",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      color: "Blue",
      licensePlate: "ABC123",
      parkingSpot: "A42"
    }
  ],
  communicationPreferences: {
    allowEmailNotifications: true,
    allowSmsNotifications: true,
    allowPushNotifications: false,
    emailFrequency: "daily",
    subscribedTopics: ["maintenance", "announcements", "events"]
  },
  customFields: [
    {
      id: "cf-1",
      label: "Pet Information",
      value: "Dog: Max, Golden Retriever",
      type: "text"
    }
  ]
};

const UserProfile = () => {
  const [user, setUser] = useState<User>(mockUser);
  const navigate = useNavigate();

  const updateUserProfile = (updatedData: Partial<User>) => {
    // In a real app, this would be an API call
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
    toast.success("Profile updated successfully");
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none px-4 bg-background">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Emergency Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span>Vehicles</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Communication</span>
              </TabsTrigger>
              {(user.role === 'admin' || user.role === 'manager') && (
                <TabsTrigger value="permissions" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Permissions</span>
                </TabsTrigger>
              )}
            </TabsList>

            <div className="p-6">
              <TabsContent value="personal" className="mt-0">
                <ProfileForm user={user} updateUser={updateUserProfile} />
              </TabsContent>
              
              <TabsContent value="emergency" className="mt-0">
                <EmergencyContactsForm 
                  contacts={user.emergencyContacts || []} 
                  updateContacts={(contacts) => updateUserProfile({ emergencyContacts: contacts })} 
                />
              </TabsContent>
              
              <TabsContent value="vehicles" className="mt-0">
                <VehiclesForm 
                  vehicles={user.vehicleInfo || []} 
                  updateVehicles={(vehicles) => updateUserProfile({ vehicleInfo: vehicles })} 
                />
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0">
                <CommunicationPreferencesForm 
                  preferences={user.communicationPreferences || {
                    allowEmailNotifications: true,
                    allowSmsNotifications: false,
                    allowPushNotifications: false,
                    emailFrequency: 'daily'
                  }} 
                  updatePreferences={(prefs) => updateUserProfile({ communicationPreferences: prefs })} 
                />
              </TabsContent>
              
              {(user.role === 'admin' || user.role === 'manager') && (
                <TabsContent value="permissions" className="mt-0">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <UserCog className="h-5 w-5" />
                      View and manage permissions in the 
                      <button 
                        onClick={() => navigate('/settings/permissions')}
                        className="text-primary hover:underline"
                      >
                        Settings &amp; Permissions
                      </button> 
                      section
                    </p>
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
