import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const UploadDocument = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    console.log('Starting upload');
    if (!file || !user) {
      setError('Please select a file and ensure you are logged in.');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      console.log('Uploading to bucket: documents, path:', `${user.id}/${file.name}`);
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${file.name}`, file, { upsert: true });
      if (error) throw error;
      console.log('Upload successful:', data);
      setSuccess(true);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Please log in to upload documents.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">Upload successful!</p>}
    </div>
  );
};

export default UploadDocument;
