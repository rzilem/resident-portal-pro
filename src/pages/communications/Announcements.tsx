
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Announcement } from '@/pages/communications/types';

const Announcements: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Announcements</h1>
        <p className="text-muted-foreground">
          Create and manage announcements for community members
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6 text-center py-8">
          <p className="text-muted-foreground">
            Announcements feature is coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
