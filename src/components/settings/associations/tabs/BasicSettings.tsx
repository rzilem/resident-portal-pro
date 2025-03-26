
import React from 'react';
import { Card } from '@/components/ui/card';
import TagManagement from '../TagManagement';
import { Association } from '@/types/association';

interface BasicSettingsProps {
  activeAssociation: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue?: any) => any;
  updateAssociation: (id: string, updates: Partial<Association>) => Promise<Association>;
}

const BasicSettings: React.FC<BasicSettingsProps> = ({
  activeAssociation,
  handleSettingChange,
  getSetting,
  updateAssociation
}) => {
  return (
    <div className="space-y-6">
      <TagManagement />
      {/* Other basic settings would be here */}
    </div>
  );
};

export default BasicSettings;
