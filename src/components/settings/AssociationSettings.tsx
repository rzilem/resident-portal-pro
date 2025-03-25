
import React, { useEffect, useState } from 'react';
import { Settings, FileText, Mail, Bell, Calendar, DollarSign, Building, ClipboardList, Users, Shield, Home, FileCheck, BanknoteIcon, Folder, BookOpen, Activity, MapPin, Tag, FileBarChart, BookmarkIcon, Briefcase, HelpCircle, PanelLeft, Database, LayoutDashboard, UserCheck, Cog, CheckSquare, Layout, Image, FileBox, ClipboardCheck, FileSpreadsheet, MessageSquare, Landmark, Layers, FileOutput, Import, Pencil } from "lucide-react";
import { toast } from "sonner";

// Import components
import AssociationList from './associations/AssociationList';
import AssociationDialog from './associations/AssociationDialog';
import SettingTabs from './associations/SettingTabs';
import { Association, SettingSection, AssociationMenuCategory } from './associations/types';
import { useAssociations } from '@/hooks/use-associations';
