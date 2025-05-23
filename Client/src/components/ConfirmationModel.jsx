import React from "react";

const ConfirmationModel = ({ onConfirm, message }) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg w-[400px] border-2">
        <h2 className="text-lg font-semibold mb-4 text-white">{message || "Are you sure?"}</h2>
        <div className="flex justify-center gap-5">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => onConfirm("yes")}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => onConfirm("no")}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModel;
