
import React from 'react';
import { Button } from "@/components/ui/button";

interface WebhookContentProps {
  onConfigureClick: () => void;
}

const WebhookContent: React.FC<WebhookContentProps> = ({
  onConfigureClick
}) => {
  return (
    <div className="flex items-center justify-between">
      <span>Webhook Configuration</span>
      <Button 
        variant="outline" 
        onClick={onConfigureClick}
      >
        Configure Webhook
      </Button>
    </div>
  );
};

export default WebhookContent;
