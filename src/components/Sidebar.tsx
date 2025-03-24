
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  Database, 
  FileText, 
  Home, 
  LogOut,
  Mail, 
  Menu, 
  MessageSquare, 
  Settings, 
  User, 
  Users, 
  X,
  DollarSign,
  Building,
  FileSpreadsheet,
  Briefcase,
  Shield
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarComponent = ({ open, onOpenChange }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    // Show toast and redirect
    toast.info("You have been logged out");
    navigate('/login');
  };

  return (
    <SidebarProvider defaultOpen={!isMobile} open={open} onOpenChange={onOpenChange}>
      <SidebarUI>
        <SidebarHeader>
          <Link to="/" className="text-xl font-bold text-gradient">
            ResidentPro
          </Link>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                    <Link to="/dashboard">
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/properties')}>
                    <Link to="/properties">
                      <Building className="w-4 h-4" />
                      <span>Properties</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/residents')}>
                    <Link to="/residents">
                      <Users className="w-4 h-4" />
                      <span>Residents</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Accounting</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/accounting/transactions')}>
                    <Link to="/accounting/transactions">
                      <DollarSign className="w-4 h-4" />
                      <span>Transactions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/accounting/reports')}>
                    <Link to="/accounting/reports">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/accounting/payments')}>
                    <Link to="/accounting/payments">
                      <CreditCard className="w-4 h-4" />
                      <span>Payments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/settings/associations/gl-accounts')}>
                    <Link to="/settings/associations/gl-accounts">
                      <FileText className="w-4 h-4" />
                      <span>GL Accounts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Communications</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/communications/announcements')}>
                    <Link to="/communications/announcements">
                      <Bell className="w-4 h-4" />
                      <span>Announcements</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/communications/messages')}>
                    <Link to="/communications/messages">
                      <Mail className="w-4 h-4" />
                      <span>Messages</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/communications/events')}>
                    <Link to="/communications/events">
                      <Calendar className="w-4 h-4" />
                      <span>Events</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/database/records')}>
                    <Link to="/database/records">
                      <Database className="w-4 h-4" />
                      <span>Records</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/settings/associations/company-info')}>
                    <Link to="/settings/associations/company-info">
                      <Briefcase className="w-4 h-4" />
                      <span>Company Info</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/settings/associations/arc-types')}>
                    <Link to="/settings/associations/arc-types">
                      <Shield className="w-4 h-4" />
                      <span>ARC Types</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/settings')}>
                <Link to="/settings">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/profile')}>
                <Link to="/profile">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarUI>
    </SidebarProvider>
  );
};

export default SidebarComponent;
