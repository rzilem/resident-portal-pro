
import React from 'react';
import { Link } from 'react-router-dom';
import { Owner } from './types';

interface OwnersTableProps {
  owners: Owner[];
  emptyMessage?: string;
}

const OwnersTable: React.FC<OwnersTableProps> = ({ 
  owners, 
  emptyMessage = 'No owners match your search' 
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-2 text-xs font-medium">Name</th>
            <th className="text-left p-2 text-xs font-medium">Unit</th>
            <th className="text-left p-2 text-xs font-medium">Email</th>
          </tr>
        </thead>
        <tbody>
          {owners.length > 0 ? (
            owners.map((owner) => (
              <tr key={owner.id} className="border-t">
                <td className="p-2 text-sm">
                  <Link 
                    to={`/resident/${owner.id}`}
                    className="text-primary hover:underline hover:text-primary/80 transition-colors"
                  >
                    {owner.name}
                  </Link>
                </td>
                <td className="p-2 text-sm">{owner.unit}</td>
                <td className="p-2 text-sm">
                  <a 
                    href={`mailto:${owner.email}`}
                    className="hover:underline hover:text-primary/80 transition-colors"
                  >
                    {owner.email}
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OwnersTable;
