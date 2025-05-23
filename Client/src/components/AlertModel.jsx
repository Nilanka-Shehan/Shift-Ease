import React from "react";

const AlertModel = ({ setShowConfirmation,message }) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg w-[400px] border-2">
        <h2 className="text-lg font-semibold mb-4 text-white">{message || "Are you sure?"}</h2>
        <div className="flex justify-center gap-5">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setShowConfirmation(false)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModel;
