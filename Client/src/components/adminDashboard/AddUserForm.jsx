import React from "react";

const AddUserForm = ({ setShowAddUserForm, handleSubmit, handleOnChange }) => {
  return (
    <div className="relative bg-gray-200 p-6 rounded mt-4">
      <h2 className="text-lg font-semibold mb-4 text-center">Add User</h2>
      <button
        className="absolute top-4 right-4 text-sm border-2 border-red-900 text-black px-3 py-1 rounded hover:bg-red-300"
        onClick={() => setShowAddUserForm(false)}
      >
        Close
      </button>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Employee Number</label>
          <input
            type="number"
            name="empNumber"
            onChange={handleOnChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Enter employee number"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleOnChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Enter email"
          />
        </div>
        <button
          type="submit"
          className="border px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 mx-auto mt-2"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
