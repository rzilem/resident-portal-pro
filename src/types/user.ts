
export type UserRole = 'admin' | 'manager' | 'staff' | 'resident' | 'board_member' | 'board' | 'vendor';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'blocked';
export type SecurityLevel = 'basic' | 'elevated' | 'full_access';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  securityLevel: SecurityLevel;
  phoneNumber?: string;
  address?: string;
  profileImageUrl?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  customFields?: Record<string, any>;
  meta?: Record<string, any>;
}
