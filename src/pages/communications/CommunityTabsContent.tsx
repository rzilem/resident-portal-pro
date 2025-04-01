
import React, { useState } from 'react';
import { CompositionMessage, Tab } from './types';
import { Card } from '@/components/ui/card';

interface CommunityTabsContentProps {
  activeTab: Tab;
  children: React.ReactNode;
}

const CommunityTabsContent: React.FC<CommunityTabsContentProps> = ({ activeTab, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (message: CompositionMessage) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Message sent:', message);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{activeTab.label}</h2>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Card className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </Card>
    </div>
  );
};

export default CommunityTabsContent;
