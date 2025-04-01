
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MessageHistory: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-muted-foreground">No message history available</p>
      </CardContent>
    </Card>
  );
};

export default MessageHistory;
