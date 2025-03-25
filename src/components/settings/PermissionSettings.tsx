
import React, { useState } from 'react';
import UserManagement, { User } from './permissions/UserManagement';
import DocumentAccess from './permissions/DocumentAccess';
import { roles } from './permissions/roles';

const PermissionSettings = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Alice Johnson', email: 'alice@example.com', role: 'board', status: 'active' },
    { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'resident', status: 'pending' },
  ]);
  
  const [documentPermissions, setDocumentPermissions] = useState({
    financialReports: {
      owner: true, admin: true, manager: true, board: true, resident: false, vendor: false
    },
    bylaws: {
      owner: true, admin: true, manager: true, board: true, resident: true, vendor: false
    },
    boardMinutes: {
      owner: true, admin: true, manager: true, board: true, resident: true, vendor: false
    },
    vendorContracts: {
      owner: true, admin: true, manager: true, board: false, resident: false, vendor: true
    }
  });

  return (
    <div className="grid gap-6">
      <UserManagement users={users} setUsers={setUsers} />
      <DocumentAccess 
        documentPermissions={documentPermissions}
        setDocumentPermissions={setDocumentPermissions}
        roles={roles}
      />
    </div>
  );
};

export default PermissionSettings;
