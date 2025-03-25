
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Helper function to get badge variant
const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "Active":
      return "default"; // Using default instead of success
    case "Pending":
      return "secondary"; // Using secondary instead of warning
    default:
      return "outline";
  }
};

interface ProfileHeaderProps {
  resident: {
    name: string;
    property: string;
    unit: string;
    status: string;
    email: string;
    phone: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ resident }) => {
  return (
    <div className="mb-6">
      <Link to="/residents" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Residents
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{resident.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Badge variant={getStatusBadgeVariant(resident.status)}>
              {resident.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`mailto:${resident.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`tel:${resident.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`sms:${resident.phone}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Text
            </a>
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Send Notice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
