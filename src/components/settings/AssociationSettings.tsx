import React, { useEffect, useState } from 'react';
import { Settings, FileText, Mail, Bell, Calendar, DollarSign, Building, ClipboardList, Users, Shield, Home, FileCheck, BanknoteIcon, Folder, BookOpen, Activity, MapPin, Tag, FileBarChart, BookmarkIcon, Briefcase, HelpCircle, PanelLeft, Database, LayoutDashboard, UserCheck, Cog, CheckSquare, Layout, Image, FileBox, ClipboardCheck, FileSpreadsheet, MessageSquare, Landmark, Layers, FileOutput, Import, Pencil, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// Import components
import AssociationList from './associations/AssociationList';
import AssociationDialog from './associations/AssociationDialog';
import SettingTabs from './associations/SettingTabs';
import { Association, SettingSection, AssociationMenuCategory } from './associations/types';
import { useAssociations } from '@/hooks/use-associations';

// Define setting sections and menu categories
const settingSections: SettingSection[] = [
  { id: 'basic', title: 'Basic', icon: Building, description: 'Basic association information' },
  { id: 'financial', title: 'Financial', icon: DollarSign, description: 'Financial settings' },
  { id: 'documents', title: 'Documents', icon: FileText, description: 'Document management settings' },
  { id: 'communications', title: 'Communications', icon: Mail, description: 'Communication settings' },
  { id: 'meetings', title: 'Meetings', icon: Calendar, description: 'Meeting settings' },
  { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Notification preferences' },
];

const menuCategories: AssociationMenuCategory[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { id: 'overview', title: 'Overview', icon: Home, route: '/settings/associations/overview', hasSubmenu: false },
      { id: 'properties', title: 'Properties', icon: Building, route: '/settings/associations/properties', hasSubmenu: true },
      { id: 'residents', title: 'Residents', icon: Users, route: '/settings/associations/residents', hasSubmenu: true },
      { id: 'company-info', title: 'Company Info', icon: Briefcase, route: '/settings/associations/company-info', hasSubmenu: false },
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    items: [
      { id: 'fees', title: 'Fees & Assessments', icon: DollarSign, route: '/settings/associations/fees', hasSubmenu: false },
      { id: 'accounts', title: 'Bank Accounts', icon: BanknoteIcon, route: '/settings/associations/accounts', hasSubmenu: false },
      { id: 'gl-accounts', title: 'GL Accounts', icon: Landmark, route: '/settings/associations/gl-accounts', hasSubmenu: false },
      { id: 'payment-methods', title: 'Payment Methods', icon: CreditCard, route: '/settings/associations/payment-methods', hasSubmenu: false },
    ]
  },
  {
    id: 'documents',
    title: 'Documents',
    items: [
      { id: 'templates', title: 'Templates', icon: FileCheck, route: '/settings/associations/templates', hasSubmenu: false },
      { id: 'categories', title: 'Categories', icon: Folder, route: '/settings/associations/document-categories', hasSubmenu: false },
    ]
  },
  {
    id: 'admin',
    title: 'Administration',
    items: [
      { id: 'roles', title: 'Roles & Permissions', icon: Shield, route: '/settings/associations/roles', hasSubmenu: false },
    ]
  },
];

const AssociationSettings = () => {
  const {
    associations,
    activeAssociation,
    isLoading,
    error,
    fetchAssociations,
    selectAssociation,
    addAssociation,
    updateAssociation,
    updateSetting,
    removeAssociation,
    makeDefaultAssociation,
    toggleStatus
  } = useAssociations();

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [associationToEdit, setAssociationToEdit] = useState<Association | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState('basic');

  useEffect(() => {
    fetchAssociations();
  }, [fetchAssociations]);

  const handleOpenNewDialog = () => {
    setShowNewDialog(true);
  };

  const handleOpenEditDialog = (association: Association) => {
    setAssociationToEdit(association);
    setShowEditDialog(true);
  };

  const handleCloseNewDialog = () => {
    setShowNewDialog(false);
  };

  const handleCloseEditDialog = () => {
    setAssociationToEdit(null);
    setShowEditDialog(false);
  };

  const handleSaveNew = async (data: Partial<Association>) => {
    return await addAssociation(data as Omit<Association, 'id'>);
  };

  const handleSaveEdit = async (data: Partial<Association>) => {
    if (associationToEdit) {
      return await updateAssociation(associationToEdit.id, data);
    }
    throw new Error('No association to edit');
  };

  const handleSettingChange = async (settingName: string, value: any) => {
    if (activeAssociation) {
      await updateSetting(activeAssociation.id, settingName, value);
      toast.success(`${settingName} updated`);
    }
    return Promise.resolve();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        <h3 className="font-bold">Error</h3>
        <p>{error.message}</p>
        <button 
          onClick={() => fetchAssociations()} 
          className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Association Management</h2>
        <Button asChild variant="outline">
          <Link to="/calendar?tab=association">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Link>
        </Button>
      </div>

      <AssociationList 
        associations={associations}
        activeAssociation={activeAssociation}
        selectAssociation={selectAssociation}
        openNewAssociationDialog={handleOpenNewDialog}
        openEditDialog={handleOpenEditDialog}
        toggleStatus={toggleStatus}
        removeAssociation={removeAssociation}
        makeDefaultAssociation={makeDefaultAssociation}
      />

      {activeAssociation && (
        <SettingTabs 
          activeAssociation={activeAssociation}
          handleSettingChange={handleSettingChange}
          getSetting={(key, defaultValue) => activeAssociation.settings?.[key] ?? defaultValue}
          updateAssociation={updateAssociation}
        />
      )}

      <AssociationDialog 
        isOpen={showNewDialog}
        onClose={handleCloseNewDialog}
        onSave={handleSaveNew}
        title="Create New Association"
      />

      {showEditDialog && associationToEdit && (
        <AssociationDialog 
          isOpen={showEditDialog}
          onClose={handleCloseEditDialog}
          onSave={handleSaveEdit}
          association={associationToEdit}
          title={`Edit ${associationToEdit.name}`}
        />
      )}
    </div>
  );
};

export default AssociationSettings;
