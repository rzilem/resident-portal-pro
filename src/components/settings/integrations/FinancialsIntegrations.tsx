
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Wallet, FileText } from "lucide-react";
import IntegrationCard from './IntegrationCard';
import { APIConfigFormProps } from './APIConfigForm';

const FinancialsIntegrations = () => {
  // Define API fields for each integration type
  const stripeFields: APIConfigFormProps['fields'] = [
    { 
      name: 'apiKey', 
      label: 'API Key', 
      type: 'password', 
      required: true,
      description: 'Your Stripe secret key starting with sk_...'
    },
    {
      name: 'webhookSecret',
      label: 'Webhook Secret',
      type: 'password',
      description: 'Webhook signing secret for verifying webhook events'
    },
    {
      name: 'publishableKey',
      label: 'Publishable Key',
      type: 'text',
      required: true,
      description: 'Your Stripe publishable key starting with pk_...'
    }
  ];
  
  const paypalFields: APIConfigFormProps['fields'] = [
    {
      name: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: true
    },
    {
      name: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      required: true
    },
    {
      name: 'environment',
      label: 'Environment',
      type: 'text',
      description: 'Either "sandbox" or "production"',
      placeholder: 'sandbox'
    }
  ];
  
  const squareFields: APIConfigFormProps['fields'] = [
    {
      name: 'accessToken',
      label: 'Access Token',
      type: 'password',
      required: true
    },
    {
      name: 'applicationId',
      label: 'Application ID',
      type: 'text',
      required: true
    },
    {
      name: 'locationId',
      label: 'Location ID',
      type: 'text',
      required: true,
      description: 'ID of the Square location to use for transactions'
    }
  ];
  
  const authorizeNetFields: APIConfigFormProps['fields'] = [
    {
      name: 'apiLoginId',
      label: 'API Login ID',
      type: 'text',
      required: true
    },
    {
      name: 'transactionKey',
      label: 'Transaction Key',
      type: 'password',
      required: true
    },
    {
      name: 'environment',
      label: 'Environment',
      type: 'text',
      description: 'Either "sandbox" or "production"',
      placeholder: 'sandbox'
    }
  ];
  
  const plaidFields: APIConfigFormProps['fields'] = [
    {
      name: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: true
    },
    {
      name: 'secret',
      label: 'Secret',
      type: 'password',
      required: true
    },
    {
      name: 'environment',
      label: 'Environment',
      type: 'text',
      description: 'One of "sandbox", "development", or "production"',
      placeholder: 'sandbox'
    }
  ];
  
  const quickbooksFields: APIConfigFormProps['fields'] = [
    {
      name: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: true
    },
    {
      name: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      required: true
    },
    {
      name: 'redirectUri',
      label: 'Redirect URI',
      type: 'url',
      required: true,
      description: 'Must match the URI configured in your QuickBooks app'
    },
    {
      name: 'environment',
      label: 'Environment',
      type: 'text',
      description: 'Either "sandbox" or "production"',
      placeholder: 'sandbox'
    }
  ];

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Payment Processing */}
        <IntegrationCard 
          title="Payment Processing"
          description="Connect payment processors to handle HOA dues and fees"
          icon={<CreditCard className="h-5 w-5" />}
          integrations={[
            { name: "Stripe", connected: false, apiFields: stripeFields },
            { name: "PayPal", connected: false, apiFields: paypalFields },
            { name: "Square", connected: false, apiFields: squareFields },
            { name: "Authorize.net", connected: false, apiFields: authorizeNetFields }
          ]}
        />
        
        {/* Banking Integration */}
        <IntegrationCard 
          title="Banking"
          description="Connect bank accounts for automated reconciliation"
          icon={<Wallet className="h-5 w-5" />}
          integrations={[
            { name: "Plaid", connected: false, apiFields: plaidFields },
            { name: "Yodlee", connected: false, apiFields: [
              { name: 'appId', label: 'App ID', type: 'text', required: true },
              { name: 'apiKey', label: 'API Key', type: 'password', required: true }
            ]},
            { name: "Direct Bank API", connected: false, apiFields: [
              { name: 'apiUrl', label: 'API URL', type: 'url', required: true },
              { name: 'apiKey', label: 'API Key', type: 'password', required: true },
              { name: 'accountId', label: 'Account ID', type: 'text', required: true }
            ]}
          ]}
        />
        
        {/* Accounting Software */}
        <IntegrationCard 
          title="Accounting Software"
          description="Connect your accounting software for seamless financial management"
          icon={<FileText className="h-5 w-5" />}
          integrations={[
            { name: "QuickBooks", connected: false, apiFields: quickbooksFields },
            { name: "Xero", connected: false, apiFields: [
              { name: 'clientId', label: 'Client ID', type: 'text', required: true },
              { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
              { name: 'redirectUri', label: 'Redirect URI', type: 'url', required: true }
            ]},
            { name: "FreshBooks", connected: false, apiFields: [
              { name: 'clientId', label: 'Client ID', type: 'text', required: true },
              { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
              { name: 'redirectUri', label: 'Redirect URI', type: 'url', required: true }
            ]},
            { name: "Wave", connected: false, apiFields: [
              { name: 'apiToken', label: 'API Token', type: 'password', required: true },
              { name: 'businessId', label: 'Business ID', type: 'text', required: true }
            ]}
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default FinancialsIntegrations;
