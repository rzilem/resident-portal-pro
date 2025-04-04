
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data for employee activities
const employeeData = [
  { 
    id: 1, 
    name: 'Emma Thompson', 
    role: 'Community Manager', 
    office: 'Austin', 
    lastActive: '10 minutes ago', 
    assignedItems: 12, 
    completedItems: 7, 
    avatar: '/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png'
  },
  { 
    id: 2, 
    name: 'Michael Rodriguez', 
    role: 'Assistant Manager', 
    office: 'Austin', 
    lastActive: '25 minutes ago', 
    assignedItems: 8, 
    completedItems: 5, 
    avatar: '/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png'
  },
  { 
    id: 3, 
    name: 'Jessica Chen', 
    role: 'Community Manager', 
    office: 'Round Rock', 
    lastActive: '1 hour ago', 
    assignedItems: 15, 
    completedItems: 10, 
    avatar: '/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png'
  },
  { 
    id: 4, 
    name: 'David Wilson', 
    role: 'Accounting Specialist', 
    office: 'Austin', 
    lastActive: '3 hours ago', 
    assignedItems: 20, 
    completedItems: 18, 
    avatar: '/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png'
  },
  { 
    id: 5, 
    name: 'Sarah Johnson', 
    role: 'Administrative Assistant', 
    office: 'Round Rock', 
    lastActive: '30 minutes ago', 
    assignedItems: 6, 
    completedItems: 4, 
    avatar: '/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png'
  }
];

const EmployeeActivityTable: React.FC = () => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Office</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Completion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeData.map((employee) => {
            const completionPercentage = (employee.completedItems / employee.assignedItems) * 100;
            
            return (
              <TableRow key={employee.id} className="cursor-pointer hover:bg-accent transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Badge variant="outline">{employee.office}</Badge>
                </TableCell>
                <TableCell>{employee.lastActive}</TableCell>
                <TableCell>{employee.completedItems} / {employee.assignedItems}</TableCell>
                <TableCell className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Progress value={completionPercentage} className="h-2" />
                    <span className="text-xs text-muted-foreground w-[40px]">{completionPercentage.toFixed(0)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeActivityTable;
