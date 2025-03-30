
import { useState } from 'react';
import { useIntegrations } from '@/hooks/use-integrations';
import { toast } from "sonner";
import { APIConfigFormProps } from '../APIConfigForm';

export interface IntegrationCardHookProps {
  title: string;
  integrations?: {
    name: string;
    connected: boolean;
    apiFields?: APIConfigFormProps['fields'];
  }[];
}

export function useIntegrationCard({ title, integrations }: IntegrationCardHookProps) {
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [showElevenLabsDialog, setShowElevenLabsDialog] = useState(false);
  
  const { 
    connectIntegration, 
    disconnectIntegration, 
    updateIntegrationSettings, 
    testWebhook,
    isConnected,
    getIntegration
  } = useIntegrations();

  const handleConnect = async (name: string) => {
    try {
      // Special handling for ElevenLabs
      if (name === 'ElevenLabs') {
        setSelectedIntegration(name);
        setShowElevenLabsDialog(true);
        return;
      }
      
      // For integrations with API fields, show config form instead of auto-connecting
      const integration = integrations?.find(i => i.name === name);
      if (integration?.apiFields && integration.apiFields.length > 0) {
        setSelectedIntegration(name);
        setShowConfigForm(true);
        setOpen(true);
        return;
      }
      
      // Simple toggle-only integrations
      await connectIntegration(name, { enabled: true });
      toast.success(`Connected to ${name}`);
    } catch (error) {
      console.error('Error connecting:', error);
      toast.error(`Failed to connect to ${name}`);
    }
  };

  const handleDisconnect = async (name: string) => {
    try {
      await disconnectIntegration(name);
      toast.success(`Disconnected from ${name}`);
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error(`Failed to disconnect from ${name}`);
    }
  };

  const handleSaveAPIConfig = async (values: Record<string, any>) => {
    if (!selectedIntegration) return;
    
    try {
      await updateIntegrationSettings(selectedIntegration, {
        ...values,
        enabled: true
      });
      
      setOpen(false);
      setShowConfigForm(false);
      toast.success(`API configuration saved for ${selectedIntegration}`);
    } catch (error) {
      console.error('Error saving API configuration:', error);
      toast.error('Failed to save API configuration');
    }
  };

  const handleSaveApiKey = async () => {
    if (!selectedIntegration) return;
    
    try {
      await updateIntegrationSettings(selectedIntegration, {
        apiKey,
        enabled: true
      });
      
      setOpen(false);
      toast.success(`API key saved for ${selectedIntegration}`);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    }
  };

  const handleSaveWebhook = async () => {
    if (!selectedIntegration) return;
    
    try {
      await updateIntegrationSettings(selectedIntegration, {
        webhookUrl,
        enabled: true
      });
      
      setOpen(false);
      toast.success(`Webhook URL saved for ${selectedIntegration}`);
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      toast.error('Failed to save webhook URL');
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL first');
      return;
    }
    
    try {
      await testWebhook(webhookUrl, {
        service: selectedIntegration,
        action: 'test'
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
    }
  };

  const handleTestConnection = async (values: Record<string, any>) => {
    if (!selectedIntegration) return false;
    
    try {
      // This is a simplified test; in a real app, you'd test with the actual service
      const result = await testWebhook(values.apiUrl || 'https://example.com', {
        service: selectedIntegration,
        credentials: 'test'
      });
      return result;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  };

  const getIntegrationConfig = (name: string) => {
    const integration = getIntegration(name);
    if (!integration) return {};
    
    // Filter out non-user-configurable fields and convert to appropriate format
    const {enabled, lastSync, ...config} = integration;
    return config;
  };

  const handleOpenConfigForm = (name: string) => {
    setSelectedIntegration(name);
    setShowConfigForm(true);
    setOpen(true);
  };

  const handleOpenApiKeyDialog = () => {
    setSelectedIntegration(title);
    setShowConfigForm(false);
    setOpen(true);
  };

  const handleOpenWebhookDialog = () => {
    setSelectedIntegration(title);
    setShowConfigForm(false);
    setOpen(true);
  };

  const handleOpenWebhookEndpointDialog = () => {
    setSelectedIntegration(title);
    setShowConfigForm(false);
    setOpen(true);
  };
  
  const handleOpenElevenLabsDialog = () => {
    setSelectedIntegration('ElevenLabs');
    setShowElevenLabsDialog(true);
  };

  return {
    open,
    setOpen,
    selectedIntegration,
    apiKey,
    setApiKey,
    webhookUrl,
    setWebhookUrl,
    showConfigForm,
    setShowConfigForm,
    showElevenLabsDialog,
    setShowElevenLabsDialog,
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
    handleOpenWebhookEndpointDialog,
    handleOpenElevenLabsDialog
  };
}
