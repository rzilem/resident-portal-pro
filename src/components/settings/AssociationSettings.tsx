
import React, { useState } from 'react';
import { Settings, FileText, Mail, Bell, Calendar, DollarSign, Building, ClipboardList, Users, Shield, Home, FileCheck, BanknoteIcon, Folder, BookOpen, Activity, MapPin, Tag, FileBarChart, BookmarkIcon, Briefcase, HelpCircle, PanelLeft, Database } from "lucide-react";
import { toast } from "sonner";

// Import components
import AssociationList from './associations/AssociationList';
import AssociationDialog from './associations/AssociationDialog';
import SettingTabs from './associations/SettingTabs';
import { Association, SettingSection, AssociationMenuCategory } from './associations/types';

const AssociationSettings = () => {
  const [associations, setAssociations] = useState<Association[]>([
    { 
      id: '1', 
      name: 'Sunset Heights HOA', 
      units: 48, 
      address: '123 Sunset Blvd, Los Angeles, CA', 
      isActive: true, 
      isDefault: true,
      settings: {
        timezone: 'America/Los_Angeles',
        fiscalYearStart: '01/01',
        lateFeeAmount: 25,
        lateFeeType: 'fixed',
        currencySymbol: '$',
        allowOnlinePayments: true,
        sendAutomaticReminders: true,
        requireVoterRegistration: false,
      }
    },
    { id: '2', name: 'Ocean View Condos', units: 120, address: '456 Ocean Dr, Miami, FL', isActive: true, isDefault: false },
    { id: '3', name: 'Mountain Valley Association', units: 75, address: '789 Valley Rd, Denver, CO', isActive: false, isDefault: false },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    units: '',
    address: ''
  });
  
  const [activeAssociation, setActiveAssociation] = useState<Association>(associations[0]);
  const [activeSettingsTab, setActiveSettingsTab] = useState('basic');
  
  // Comprehensive menu structure based on the image
  const associationMenuCategories: AssociationMenuCategory[] = [
    {
      id: 'general',
      title: 'General',
      items: [
        { id: 'association-list', title: 'Association List', icon: Building },
        { id: 'action-items', title: 'Action Items', icon: ClipboardList },
        { id: 'activity-notes', title: 'Activity Notes', icon: Activity },
        { id: 'amenity-calendar-settings', title: 'Amenity Calendar Settings', icon: Calendar },
        { id: 'additional-info', title: 'Additional Info', icon: HelpCircle },
      ]
    },
    {
      id: 'addresses',
      title: 'Addresses',
      items: [
        { id: 'addresses', title: 'Addresses', icon: MapPin },
        { id: 'address-types', title: 'Address Types', icon: Tag },
      ]
    },
    {
      id: 'management',
      title: 'Management',
      items: [
        { id: 'arc-types', title: 'ARC Types', icon: Shield },
        { id: 'association-alias', title: 'Association Alias', icon: Tag },
        { id: 'assessments', title: 'Assessments', icon: FileBarChart },
        { id: 'board-committee', title: 'Board/Committee', icon: Users },
        { id: 'ccr-items', title: 'CCR Items', icon: FileCheck },
        { id: 'documents', title: 'Documents', icon: FileText },
        { id: 'inspections', title: 'Inspections', icon: FileCheck },
        { id: 'portal-pages', title: 'Portal Pages', icon: PanelLeft },
        { id: 'services', title: 'Services', icon: Briefcase },
        { id: 'settings', title: 'Settings', icon: Settings },
      ]
    },
    {
      id: 'financial',
      title: 'Financial',
      items: [
        { id: 'bank-accounts', title: 'Bank Accounts', icon: BanknoteIcon },
        { id: 'funds', title: 'Funds', icon: DollarSign },
        { id: 'gl-accounts', title: 'GL Accounts', icon: BookmarkIcon, hasSubmenu: true },
        { id: 'insurance', title: 'Insurance', icon: Shield },
      ]
    },
    {
      id: 'calendar',
      title: 'Calendar',
      items: [
        { id: 'calendar', title: 'Calendar', icon: Calendar },
        { id: 'amenity-calendar', title: 'Amenity Calendar', icon: Calendar },
      ]
    },
  ];
  
  // Define all the setting sections
  const settingSections: SettingSection[] = [
    { id: 'basic', title: 'Basic Settings', icon: Settings, description: 'Association name, address, and general information' },
    { id: 'financial', title: 'Financial Settings', icon: DollarSign, description: 'Payment options, late fees, and fiscal year configuration' },
    { id: 'documents', title: 'Documents', icon: FileText, description: 'Document requirements and management' },
    { id: 'communications', title: 'Communications', icon: Mail, description: 'Email templates and notification settings' },
    { id: 'meetings', title: 'Meetings', icon: Calendar, description: 'Meeting rules and voting configurations' },
    { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Notification preferences and channels' },
  ];
  
  const openNewAssociationDialog = () => {
    setEditingAssociation(null);
    setFormData({ name: '', units: '', address: '' });
    setDialogOpen(true);
  };
  
  const openEditDialog = (association: Association) => {
    setEditingAssociation(association);
    setFormData({ 
      name: association.name, 
      units: association.units.toString(), 
      address: association.address 
    });
    setDialogOpen(true);
  };
  
  const selectAssociation = (association: Association) => {
    setActiveAssociation(association);
  };

  return (
    <div className="grid gap-6">
      <AssociationList 
        associations={associations}
        setAssociations={setAssociations}
        activeAssociation={activeAssociation}
        selectAssociation={selectAssociation}
        openNewAssociationDialog={openNewAssociationDialog}
        openEditDialog={openEditDialog}
      />
      
      {activeAssociation && (
        <SettingTabs 
          activeAssociation={activeAssociation}
          setActiveAssociation={setActiveAssociation}
          associations={associations}
          setAssociations={setAssociations}
          activeSettingsTab={activeSettingsTab}
          setActiveSettingsTab={setActiveSettingsTab}
          settingSections={settingSections}
          selectAssociation={selectAssociation}
          menuCategories={associationMenuCategories}
        />
      )}
      
      <AssociationDialog 
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editingAssociation={editingAssociation}
        formData={formData}
        setFormData={setFormData}
        associations={associations}
        setAssociations={setAssociations}
      />
    </div>
  );
};

export default AssociationSettings;
