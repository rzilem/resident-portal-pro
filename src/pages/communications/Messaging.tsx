
import React from 'react';
import CommunityMessaging from './CommunityMessaging';

// This is a redirect component to maintain backward compatibility
const Messaging: React.FC = () => {
  return <CommunityMessaging initialTab="compose" />;
};

export default Messaging;
