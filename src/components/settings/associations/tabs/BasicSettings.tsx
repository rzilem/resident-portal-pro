import React from 'react';
import { Card } from '@/components/ui/card';
import TagManagement from '../TagManagement';

const BasicSettings = () => {
  return (
    <div className="space-y-6">
      <TagManagement />
      {/* Other basic settings would be here */}
    </div>
  );
};

export default BasicSettings;
