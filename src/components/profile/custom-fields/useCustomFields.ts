
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CustomField } from '@/types/user';

export function useCustomFields(
  initialCustomFields: CustomField[],
  onCustomFieldsChange: (fields: CustomField[]) => void
) {
  const [customFields, setCustomFields] = useState<CustomField[]>(initialCustomFields || []);
  const [newCustomField, setNewCustomField] = useState<{
    label: string;
    value: string;
    type: 'text' | 'date' | 'boolean' | 'number' | 'select';
  }>({
    label: '',
    value: '',
    type: 'text'
  });

  useEffect(() => {
    setCustomFields(initialCustomFields || []);
  }, [initialCustomFields]);

  const addCustomField = () => {
    if (newCustomField.label.trim() === '' || newCustomField.value.trim() === '') {
      return;
    }

    const newField: CustomField = {
      id: uuidv4(),
      label: newCustomField.label,
      value: newCustomField.value,
      type: newCustomField.type,
    };

    const updatedFields = [...customFields, newField];
    setCustomFields(updatedFields);
    onCustomFieldsChange(updatedFields);
    setNewCustomField({ label: '', value: '', type: 'text' });
  };

  const updateCustomField = (id: string, field: Partial<CustomField>) => {
    const updatedFields = customFields.map(item => 
      item.id === id ? { ...item, ...field } : item
    );
    setCustomFields(updatedFields);
    onCustomFieldsChange(updatedFields);
  };

  const removeCustomField = (id: string) => {
    const updatedFields = customFields.filter(field => field.id !== id);
    setCustomFields(updatedFields);
    onCustomFieldsChange(updatedFields);
  };

  return {
    customFields,
    newCustomField,
    setNewCustomField,
    addCustomField,
    updateCustomField,
    removeCustomField
  };
}
