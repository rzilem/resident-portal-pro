
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Members = () => {
  const members = [
    { id: 1, name: 'John Doe', unit: '101', role: 'Resident', contact: 'john@example.com' },
    { id: 2, name: 'Jane Smith', unit: '202', role: 'Board Member', contact: 'jane@example.com' },
    { id: 3, name: 'Robert Johnson', unit: '303', role: 'Resident', contact: 'robert@example.com' },
    { id: 4, name: 'Maria Garcia', unit: '404', role: 'Treasurer', contact: 'maria@example.com' },
  ];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Name</th>
                  <th className="p-3 font-medium text-gray-600">Unit</th>
                  <th className="p-3 font-medium text-gray-600">Role</th>
                  <th className="p-3 font-medium text-gray-600">Contact</th>
                  <th className="p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{member.name}</td>
                    <td className="p-3">Unit {member.unit}</td>
                    <td className="p-3">{member.role}</td>
                    <td className="p-3">{member.contact}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Add Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
