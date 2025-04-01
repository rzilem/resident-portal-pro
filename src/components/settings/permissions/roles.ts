
export const roles = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Property Manager" },
  { value: "staff", label: "Staff Member" },
  { value: "board", label: "Board Member" },
  { value: "vendor", label: "Vendor" },
  { value: "invoice_approver", label: "Invoice Approver" },
  { value: "resident", label: "Resident" },
];

// Administrative roles with descriptions (for UI display)
export const administrativeRoles = [
  { 
    value: "admin", 
    label: "Administrator",
    description: "Full access to all system features and settings."
  },
  { 
    value: "manager", 
    label: "Property Manager",
    description: "Can manage properties, residents, and maintenance requests."
  },
  { 
    value: "staff", 
    label: "Staff Member",
    description: "Limited administrative access for day-to-day operations."
  },
  { 
    value: "board", 
    label: "Board Member",
    description: "Access to board documents, voting, and financial approvals."
  },
  { 
    value: "invoice_approver", 
    label: "Invoice Approver",
    description: "Can review and approve financial transactions."
  },
];
