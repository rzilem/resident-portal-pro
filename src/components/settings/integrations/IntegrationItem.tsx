
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface IntegrationItemProps {
  name: string;
  isConnected: boolean;
  onConfigure: () => void;
  onToggle: (checked: boolean) => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  name,
  isConnected,
  onConfigure,
  onToggle
}) => {
  return (
    <li className="flex items-center justify-between">
      <span>{name}</span>
      <div className="flex items-center gap-2">
        {isConnected && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onConfigure}
          >
            Configure
          </Button>
        )}
        <Switch 
          checked={isConnected}
          onCheckedChange={onToggle}
        />
      </div>
    </li>
  );
};

export default IntegrationItem;
