
import React from 'react';
import { ColumnMapping } from '@/utils/spreadsheets/mapping/types';
import MappingField from './MappingField';

interface MappingFieldsListProps {
  mappings: ColumnMapping[];
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null;
  onUpdateMapping: (index: number, targetField: string) => void;
}

const MappingFieldsList: React.FC<MappingFieldsListProps> = ({
  mappings,
  fileData,
  onUpdateMapping
}) => {
  if (!fileData) return null;
  
  return (
    <div className="grid gap-4">
      {mappings.map((mapping, index) => (
        <MappingField
          key={index}
          mapping={mapping}
          index={index}
          sampleValue={fileData.rows[0]?.[mapping.sourceField] || null}
          onUpdateMapping={onUpdateMapping}
        />
      ))}
    </div>
  );
};

export default MappingFieldsList;
