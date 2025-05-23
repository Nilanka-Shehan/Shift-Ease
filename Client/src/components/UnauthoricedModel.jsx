import React from "react";

const UnauthorizedModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg w-[400px] border-2">
        <h2 className="text-lg font-semibold mb-4 text-white">Unauthorized Access</h2>
        <p className="text-gray-300 mb-6">You don't have permission to view this page.</p>
        <div className="flex justify-center">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal;
