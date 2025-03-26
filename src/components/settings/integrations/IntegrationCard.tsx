import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APIConfigFormProps } from './APIConfigForm';
import IntegrationList from './IntegrationList';
import ApiKeyContent from './content/ApiKeyContent';
import WebhookContent from './content/WebhookContent';
import WebhookEndpointContent from './content/WebhookEndpointContent';
import ApiKeyDialog from './dialogs/ApiKeyDialog';
import WebhookDialog from './dialogs/WebhookDialog';
import WebhookEndpointDialog from './dialogs/WebhookEndpointDialog';
import ConfigFormDialog from './dialogs/ConfigFormDialog';
import { useIntegrationCard } from './hooks/useIntegrationCard';

interface Integration {
  name: string;
  connected: boolean;
  apiFields?: APIConfigFormProps['fields'];
}

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  integrations?: Integration[];
  isApiKey?: boolean;
  isWebhook?: boolean;
  isWebhookEndpoint?: boolean;
  customActions?: React.ReactNode;
  apiFields?: APIConfigFormProps['fields'];
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  integrations,
  isApiKey,
  isWebhook,
  isWebhookEndpoint,
  customActions,
  apiFields
}) => {
  const {
    open,
    setOpen,
    selectedIntegration,
    apiKey,
    setApiKey,
    webhookUrl,
    setWebhookUrl,
    showConfigForm,
    setShowConfigForm,
    isConnected,
    handleConnect,
    handleDisconnect,
    handleSaveAPIConfig,
    handleSaveApiKey,
    handleSaveWebhook,
    handleTestWebhook,
    handleTestConnection,
    getIntegrationConfig,
    handleOpenConfigForm,
    handleOpenApiKeyDialog,
    handleOpenWebhookDialog,
    handleOpenWebhookEndpointDialog
  } = useIntegrationCard({ title, integrations });

  const getConfigFields = () => {
    if (!selectedIntegration) return [];
    
    let fields: APIConfigFormProps['fields'] = [];
    
    if (integrations) {
      const integration = integrations.find(i => i.name === selectedIntegration);
      if (integration?.apiFields) {
        fields = integration.apiFields;
      }
    } else if (apiFields) {
      fields = apiFields;
    }
    
    return fields;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {integrations ? (
          <IntegrationList 
            integrations={integrations}
            isConnected={isConnected}
            onConfigure={handleOpenConfigForm}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ) : isApiKey ? (
          <ApiKeyContent 
            title={title}
            onConfigureClick={handleOpenApiKeyDialog}
          />
        ) : isWebhook ? (
          <WebhookContent 
            onConfigureClick={handleOpenWebhookDialog}
          />
        ) : isWebhookEndpoint ? (
          <WebhookEndpointContent 
            onViewEndpointClick={handleOpenWebhookEndpointDialog}
          />
        ) : customActions ? (
          customActions
        ) : null}

        {showConfigForm && selectedIntegration && (
          <ConfigFormDialog
            open={open && showConfigForm}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) setShowConfigForm(false);
            }}
            selectedIntegration={selectedIntegration}
            fields={getConfigFields()}
            initialValues={selectedIntegration ? getIntegrationConfig(selectedIntegration) : {}}
            onSave={handleSaveAPIConfig}
            onCancel={() => {
              setOpen(false);
              setShowConfigForm(false);
            }}
            testConnection={handleTestConnection}
          />
        )}
        
        {isApiKey && (
          <ApiKeyDialog
            open={open && !showConfigForm}
            setOpen={setOpen}
            selectedIntegration={selectedIntegration}
            apiKey={apiKey}
            setApiKey={setApiKey}
            handleSaveApiKey={handleSaveApiKey}
          />
        )}
        
        {isWebhook && (
          <WebhookDialog
            open={open && !showConfigForm}
            setOpen={setOpen}
            selectedIntegration={selectedIntegration}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            handleSaveWebhook={handleSaveWebhook}
            handleTestWebhook={handleTestWebhook}
          />
        )}
        
        {isWebhookEndpoint && (
          <WebhookEndpointDialog
            open={open && !showConfigForm}
            setOpen={setOpen}
          />
        )}
      </CardContent>
      
      {!integrations && !isApiKey && !isWebhook && !isWebhookEndpoint && !customActions && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full">
            Learn More
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default IntegrationCard;
