
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface NotificationSettingsProps {
  handleSettingChange: (settingName: string, value: any) => void;
  getSetting: (key: string, fallback?: any) => any;
}

const NotificationSettings = ({ handleSettingChange, getSetting }: NotificationSettingsProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notification-method">Default Notification Method</Label>
            <Select
              value={getSetting('notificationMethod', 'email')}
              onValueChange={(value) => handleSettingChange('notificationMethod', value)}
            >
              <SelectTrigger id="notification-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="both">Email & SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-residents-to-opt-out">Allow Residents to Opt Out</Label>
              <Switch 
                id="allow-residents-to-opt-out"
                checked={getSetting('allowResidentsToOptOut', true)}
                onCheckedChange={(checked) => handleSettingChange('allowResidentsToOptOut', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="send-weekly-digest">Send Weekly Digest</Label>
              <Switch 
                id="send-weekly-digest"
                checked={getSetting('sendWeeklyDigest', true)}
                onCheckedChange={(checked) => handleSettingChange('sendWeeklyDigest', checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Notification Types</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-new-documents">New Documents</Label>
              <Switch 
                id="notify-new-documents"
                checked={getSetting('notifyNewDocuments', true)}
                onCheckedChange={(checked) => handleSettingChange('notifyNewDocuments', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-announcements">Community Announcements</Label>
              <Switch 
                id="notify-announcements"
                checked={getSetting('notifyAnnouncements', true)}
                onCheckedChange={(checked) => handleSettingChange('notifyAnnouncements', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-maintenance">Maintenance Updates</Label>
              <Switch 
                id="notify-maintenance"
                checked={getSetting('notifyMaintenance', true)}
                onCheckedChange={(checked) => handleSettingChange('notifyMaintenance', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-payments">Payment Confirmations</Label>
              <Switch 
                id="notify-payments"
                checked={getSetting('notifyPayments', true)}
                onCheckedChange={(checked) => handleSettingChange('notifyPayments', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-violations">Violation Notices</Label>
              <Switch 
                id="notify-violations"
                checked={getSetting('notifyViolations', true)}
                onCheckedChange={(checked) => handleSettingChange('notifyViolations', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-board-decisions">Board Decisions</Label>
              <Switch 
                id="notify-board-decisions"
                checked={getSetting('notifyBoardDecisions', true)}
                onCheckedChange={(checked) => handleSettingChange('notifyBoardDecisions', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
