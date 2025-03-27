
import React, { useState } from 'react';
import UploadDocument from './UploadDocument';

const Dashboard = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Search email, phone or UID" className="border border-gray-300 rounded px-3 py-2" />
        <button className="bg-gray-200 px-3 py-2 rounded">ALL USERS</button>
        <button className="bg-gray-200 px-3 py-2 rounded">ALL COLUMNS</button>
        <button className="bg-gray-200 px-3 py-2 rounded">Sorted by created at</button>
        <button className="bg-gray-200 px-3 py-2 rounded">Refresh</button>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-indigo-600 text-white px-3 py-2 rounded"
        >
          Upload Document
        </button>
        <button className="bg-green-600 text-white px-3 py-2 rounded">Add user</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">UID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Display name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Provider</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">afb9e05b-ae2f-47c7-96ca-60b526afdcc4</td>
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td className="border border-gray-300 px-4 py-2">rzilem@gmail.com</td>
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td className="border border-gray-300 px-4 py-2">Email</td>
            </tr>
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Document</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <UploadDocument />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
