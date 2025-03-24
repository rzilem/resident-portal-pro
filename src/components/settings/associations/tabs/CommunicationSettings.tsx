
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Association } from '../types';

interface CommunicationSettingsProps {
  activeAssociation: Association;
  handleSettingChange: (settingName: string, value: any) => void;
  getSetting: (key: string, fallback?: any) => any;
}

const CommunicationSettings = ({ 
  activeAssociation, 
  handleSettingChange, 
  getSetting 
}: CommunicationSettingsProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Email Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email-from-name">Email From Name</Label>
            <Input 
              id="email-from-name"
              value={getSetting('emailFromName', activeAssociation.name)}
              onChange={(e) => handleSettingChange('emailFromName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-from-address">Email From Address</Label>
            <Input 
              id="email-from-address"
              type="email"
              value={getSetting('emailFromAddress', `info@${activeAssociation.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`)}
              onChange={(e) => handleSettingChange('emailFromAddress', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-reply-to">Email Reply-To</Label>
            <Input 
              id="email-reply-to"
              type="email"
              value={getSetting('emailReplyTo', `support@${activeAssociation.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`)}
              onChange={(e) => handleSettingChange('emailReplyTo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-logo-in-emails">Include Logo in Emails</Label>
              <Switch 
                id="include-logo-in-emails"
                checked={getSetting('includeLogoInEmails', true)}
                onCheckedChange={(checked) => handleSettingChange('includeLogoInEmails', checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Automated Communications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="send-payment-reminders">Send Payment Reminders</Label>
              <Switch 
                id="send-payment-reminders"
                checked={getSetting('sendPaymentReminders', true)}
                onCheckedChange={(checked) => handleSettingChange('sendPaymentReminders', checked)}
              />
            </div>
          </div>
          
          {getSetting('sendPaymentReminders', true) && (
            <div className="space-y-2">
              <Label htmlFor="payment-reminder-days">Days Before Due Date</Label>
              <Input 
                id="payment-reminder-days"
                type="number"
                value={getSetting('paymentReminderDays', '7')}
                onChange={(e) => handleSettingChange('paymentReminderDays', e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="send-late-notices">Send Late Payment Notices</Label>
              <Switch 
                id="send-late-notices"
                checked={getSetting('sendLateNotices', true)}
                onCheckedChange={(checked) => handleSettingChange('sendLateNotices', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="send-violation-notices">Send Violation Notices</Label>
              <Switch 
                id="send-violation-notices"
                checked={getSetting('sendViolationNotices', true)}
                onCheckedChange={(checked) => handleSettingChange('sendViolationNotices', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="send-meeting-notices">Send Meeting Notices</Label>
              <Switch 
                id="send-meeting-notices"
                checked={getSetting('sendMeetingNotices', true)}
                onCheckedChange={(checked) => handleSettingChange('sendMeetingNotices', checked)}
              />
            </div>
          </div>
          
          {getSetting('sendMeetingNotices', true) && (
            <div className="space-y-2">
              <Label htmlFor="meeting-notice-days">Days Before Meeting</Label>
              <Input 
                id="meeting-notice-days"
                type="number"
                value={getSetting('meetingNoticeDays', '14')}
                onChange={(e) => handleSettingChange('meetingNoticeDays', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationSettings;
