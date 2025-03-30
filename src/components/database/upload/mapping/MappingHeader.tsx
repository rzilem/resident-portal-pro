
import React from 'react';

interface MappingHeaderProps {
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null;
}

const MappingHeader: React.FC<MappingHeaderProps> = ({ fileData }) => {
  if (!fileData) return null;
  
  return (
    <>
      <h3 className="text-lg font-medium">Field Mapping</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Map your source data fields to system fields
      </p>
      
      <div className="bg-muted/30 p-3 rounded-md mb-4">
        <h4 className="font-medium text-sm mb-2">File Summary:</h4>
        <div className="text-sm flex flex-wrap gap-4">
          <div><span className="font-medium">Columns:</span> {fileData.headers.length}</div>
          <div><span className="font-medium">Rows:</span> {fileData.rows.length}</div>
        </div>
      </div>
    </>
  );
};

export default MappingHeader;
