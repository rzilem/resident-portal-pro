
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';

const UploadDocument = () => {
  const { user, supabase } = useContext(AuthContext);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Ensure the documents bucket exists when component mounts
  React.useEffect(() => {
    const initializeBucket = async () => {
      if (user) {
        try {
          await ensureDocumentsBucketExists();
        } catch (error) {
          console.error('Error initializing document bucket:', error);
        }
      }
    };
    
    initializeBucket();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements[0].files[0];
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      // Initialize the bucket if it doesn't exist
      await ensureDocumentsBucketExists();
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(`Failed to upload document: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
        <p className="text-gray-600 mb-4">
          Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
        </p>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
          <p className="text-red-600 font-medium mb-2">Authentication Required</p>
          <p className="text-gray-700 mb-3">Please log in to upload documents.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
      <p className="text-gray-600 mb-4">
        Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
      </p>
      
      {uploadSuccess && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
          <p className="text-green-600">Document uploaded successfully!</p>
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
          <p className="text-red-600">{uploadError}</p>
        </div>
      )}
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" 
            className="block w-full text-gray-700 bg-white rounded border border-gray-300 cursor-pointer focus:outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum file size: 10MB
          </p>
        </div>
        <button 
          type="submit" 
          disabled={uploading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
