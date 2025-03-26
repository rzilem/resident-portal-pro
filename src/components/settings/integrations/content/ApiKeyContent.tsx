
import React from 'react';
import { Button } from "@/components/ui/button";

interface ApiKeyContentProps {
  title: string;
  onConfigureClick: () => void;
}

const ApiKeyContent: React.FC<ApiKeyContentProps> = ({
  title,
  onConfigureClick
}) => {
  return (
    <div className="flex items-center justify-between">
      <span>API Key Configuration</span>
      <Button 
        variant="outline" 
        onClick={onConfigureClick}
      >
        Configure API Key
      </Button>
    </div>
  );
};

export default ApiKeyContent;
