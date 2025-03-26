
import React from 'react';
import IntegrationItem from './IntegrationItem';

interface Integration {
  name: string;
  connected: boolean;
  apiFields?: any[];
}

interface IntegrationListProps {
  integrations: Integration[];
  isConnected: (name: string) => boolean;
  onConfigure: (name: string) => void;
  onConnect: (name: string) => void;
  onDisconnect: (name: string) => void;
}

const IntegrationList: React.FC<IntegrationListProps> = ({
  integrations,
  isConnected,
  onConfigure,
  onConnect,
  onDisconnect
}) => {
  return (
    <ul className="space-y-3">
      {integrations.map((integration, index) => (
        <IntegrationItem
          key={index}
          name={integration.name}
          isConnected={integration.connected || isConnected(integration.name)}
          onConfigure={() => onConfigure(integration.name)}
          onToggle={(checked) => {
            if (checked) {
              onConnect(integration.name);
            } else {
              onDisconnect(integration.name);
            }
          }}
        />
      ))}
    </ul>
  );
};

export default IntegrationList;
