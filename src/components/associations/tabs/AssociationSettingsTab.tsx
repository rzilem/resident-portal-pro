
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Association } from '@/types/association';

interface AssociationSettingsTabProps {
  association: Association;
}

const AssociationSettingsTab: React.FC<AssociationSettingsTabProps> = ({ association }) => {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Module Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {association.settings?.modules ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(association.settings.modules).map(([module, enabled]) => (
                <div key={module} className="flex items-center gap-2">
                  <Badge variant={enabled ? "secondary" : "outline"} className="w-20 justify-center">
                    {enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <span className="capitalize">{module}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No module settings available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {association.settings?.communications ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(association.settings.communications)
                  .filter(([key, _]) => typeof _ === 'boolean')
                  .map(([channel, enabled]) => (
                    <div key={channel} className="flex items-center gap-2">
                      <Badge variant={enabled ? "secondary" : "outline"} className="w-20 justify-center">
                        {enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <span className="capitalize">{channel.replace('Enabled', '')}</span>
                    </div>
                  ))}
              </div>
              
              {association.settings.communications.defaultEmailSender && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Default Sender:</span>
                  <span className="font-medium">{association.settings.communications.defaultEmailSender}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No communication settings available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationSettingsTab;
