
import React from 'react';

interface DocumentMetadataFormProps {
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

const DocumentMetadataForm: React.FC<DocumentMetadataFormProps> = ({
  description, 
  setDescription,
  category,
  setCategory,
  tags,
  setTags
}) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagList = e.target.value.split(',').map(tag => tag.trim());
    setTags(tagList.filter(tag => tag !== ''));
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <input
          id="description"
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Enter document description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          className="w-full p-2 border rounded-md"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="uncategorized">Uncategorized</option>
          <option value="financial">Financial</option>
          <option value="legal">Legal</option>
          <option value="meetings">Meeting Minutes</option>
          <option value="rules">Rules & Regulations</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="important, board, budget"
          onChange={handleTagChange}
        />
      </div>
    </div>
  );
};

export default DocumentMetadataForm;
