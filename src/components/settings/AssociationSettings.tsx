
import React, { useEffect, useState } from 'react';
import { Settings, FileText, Mail, Bell, Calendar, DollarSign, Building, ClipboardList, Users, Shield, Home, FileCheck, BanknoteIcon, Folder, BookOpen, Activity, MapPin, Tag, FileBarChart, BookmarkIcon, Briefcase, HelpCircle, PanelLeft, Database, LayoutDashboard, UserCheck, Cog, CheckSquare, Layout, Image, FileBox, ClipboardCheck, FileSpreadsheet, MessageSquare, Landmark, Layers, FileOutput, Import, Pencil } from "lucide-react";
import { toast } from "sonner";

// Import components
import AssociationList from './associations/AssociationList';
import AssociationDialog from './associations/AssociationDialog';
import SettingTabs from './associations/SettingTabs';
import { Association, SettingSection, AssociationMenuCategory } from './associations/types';
import { useAssociations } from '@/hooks/use-associations';

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
