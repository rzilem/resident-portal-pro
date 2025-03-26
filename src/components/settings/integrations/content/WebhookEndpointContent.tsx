
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

interface WebhookEndpointContentProps {
  onViewEndpointClick: () => void;
}

const WebhookEndpointContent: React.FC<WebhookEndpointContentProps> = ({
  onViewEndpointClick
}) => {
  return (
    <div className="flex items-center justify-between">
      <span>Webhook Endpoint for External Services</span>
      <Button 
        variant="outline"
        onClick={onViewEndpointClick}
      >
        <Link className="h-4 w-4 mr-2" />
        View Endpoint
      </Button>
    </div>
  );
};

export default WebhookEndpointContent;
