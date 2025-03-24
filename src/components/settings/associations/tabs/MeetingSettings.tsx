
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface MeetingSettingsProps {
  handleSettingChange: (settingName: string, value: any) => void;
  getSetting: (key: string, fallback?: any) => any;
}

const MeetingSettings = ({ handleSettingChange, getSetting }: MeetingSettingsProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Meeting Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annual-meeting-month">Annual Meeting Month</Label>
            <Select
              value={getSetting('annualMeetingMonth', '1')}
              onValueChange={(value) => handleSettingChange('annualMeetingMonth', value)}
            >
              <SelectTrigger id="annual-meeting-month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="board-meeting-frequency">Board Meeting Frequency</Label>
            <Select
              value={getSetting('boardMeetingFrequency', 'monthly')}
              onValueChange={(value) => handleSettingChange('boardMeetingFrequency', value)}
            >
              <SelectTrigger id="board-meeting-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-virtual-meetings">Allow Virtual Meetings</Label>
              <Switch 
                id="allow-virtual-meetings"
                checked={getSetting('allowVirtualMeetings', true)}
                onCheckedChange={(checked) => handleSettingChange('allowVirtualMeetings', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="record-meetings">Record Meetings</Label>
              <Switch 
                id="record-meetings"
                checked={getSetting('recordMeetings', true)}
                onCheckedChange={(checked) => handleSettingChange('recordMeetings', checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Voting Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-electronic-voting">Enable Electronic Voting</Label>
              <Switch 
                id="enable-electronic-voting"
                checked={getSetting('enableElectronicVoting', true)}
                onCheckedChange={(checked) => handleSettingChange('enableElectronicVoting', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-proxy-voting">Allow Proxy Voting</Label>
              <Switch 
                id="allow-proxy-voting"
                checked={getSetting('allowProxyVoting', true)}
                onCheckedChange={(checked) => handleSettingChange('allowProxyVoting', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quorum-percentage">Quorum Percentage</Label>
            <div className="flex">
              <Input 
                id="quorum-percentage"
                type="number"
                value={getSetting('quorumPercentage', '50')}
                onChange={(e) => handleSettingChange('quorumPercentage', e.target.value)}
              />
              <span className="flex items-center bg-muted px-3 rounded-r-md border-y border-r border-input">
                %
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-voter-registration">Require Voter Registration</Label>
              <Switch 
                id="require-voter-registration"
                checked={getSetting('requireVoterRegistration', false)}
                onCheckedChange={(checked) => handleSettingChange('requireVoterRegistration', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingSettings;
