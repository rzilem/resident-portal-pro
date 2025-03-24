import React, { useState } from 'react';
import { Settings, FileText, Mail, Bell, Calendar, DollarSign, Building, ClipboardList, Users, Shield, Home, FileCheck, BanknoteIcon, Folder, BookOpen, Activity, MapPin, Tag, FileBarChart, BookmarkIcon, Briefcase, HelpCircle, PanelLeft, Database, LayoutDashboard, UserCheck, Cog, CheckSquare, Layout, Image, FileBox, ClipboardCheck, FileSpreadsheet, MessageSquare, Bank, Layers, FileOutput, Import, Pencil } from "lucide-react";
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
  
  // Comprehensive menu structure based on the new categories from the image
  const associationMenuCategories: AssociationMenuCategory[] = [
    {
      id: 'general',
      title: 'General',
      items: [
        { id: 'association-list', title: 'Association List', icon: Building, route: '/settings/associations' },
        { id: 'company-info', title: 'Company Info', icon: Briefcase, route: '/settings/associations/company-info' },
        { id: 'action-items', title: 'Action Types/Steps', icon: ClipboardCheck, route: '/settings/associations/action-types' },
        { id: 'activity-notes', title: 'Activity Notes', icon: Activity, route: '/settings/associations/activity-notes' },
        { id: 'custom-info', title: 'Custom Info', icon: FileText, route: '/settings/associations/custom-info' },
        { id: 'additional-info', title: 'Additional Info', icon: HelpCircle, route: '/settings/associations/additional-info' },
      ]
    },
    {
      id: 'users-roles',
      title: 'Users & Roles',
      items: [
        { id: 'users', title: 'Users', icon: Users, route: '/settings/associations/users' },
        { id: 'roles', title: 'Roles', icon: UserCheck, route: '/settings/associations/roles' },
        { id: 'responsibilities', title: 'Responsibilities', icon: ClipboardList, route: '/settings/associations/responsibilities' },
      ]
    },
    {
      id: 'amenities',
      title: 'Amenities',
      items: [
        { id: 'amenity-category', title: 'Amenity Category', icon: Tag, route: '/settings/associations/amenity-category' },
        { id: 'amenity-calendar-settings', title: 'Amenity Calendar Settings', icon: Calendar, route: '/settings/associations/amenity-calendar-settings' },
      ]
    },
    {
      id: 'addresses',
      title: 'Addresses',
      items: [
        { id: 'addresses', title: 'Addresses', icon: MapPin, route: '/settings/associations/addresses' },
        { id: 'address-types', title: 'Address Types', icon: Tag, route: '/settings/associations/address-types' },
      ]
    },
    {
      id: 'financial',
      title: 'Financial',
      items: [
        { id: 'bank-accounts', title: 'Banks', icon: Bank, route: '/settings/associations/banks' },
        { id: 'check-signatures', title: 'Check Signatures', icon: Pencil, route: '/settings/associations/check-signatures' },
        { id: 'gl-accounts', title: 'GL Accounts', icon: BookmarkIcon, route: '/settings/associations/gl-accounts' },
        { id: 'funds', title: 'Funds', icon: DollarSign, route: '/settings/associations/funds' },
        { id: 'portfolios', title: 'Portfolios', icon: Layers, route: '/settings/associations/portfolios' },
        { id: 'portfolio-types', title: 'Portfolio Types', icon: Folder, route: '/settings/associations/portfolio-types' },
        { id: 'custom-reports', title: 'Custom Reports', icon: FileSpreadsheet, route: '/settings/associations/custom-reports' },
      ]
    },
    {
      id: 'property-management',
      title: 'Property Management',
      items: [
        { id: 'arc-types', title: 'ARC Types', icon: Shield, route: '/settings/associations/arc-types' },
        { id: 'ccr-items', title: 'CCR Items', icon: FileCheck, route: '/settings/associations/ccr-items' },
        { id: 'import', title: 'Import', icon: Import, route: '/settings/associations/import' },
      ]
    },
    {
      id: 'communications',
      title: 'Communications',
      items: [
        { id: 'letter-templates', title: 'Letter Templates', icon: FileOutput, route: '/settings/associations/letter-templates' },
        { id: 'portal-pages', title: 'Portal Pages', icon: Layout, route: '/settings/associations/portal-pages' },
        { id: 'logo-management', title: 'Logo Management', icon: Image, route: '/settings/associations/logo-management' },
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      items: [
        { id: 'interfaces', title: 'Interfaces', icon: Cog, route: '/settings/associations/interfaces' },
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

