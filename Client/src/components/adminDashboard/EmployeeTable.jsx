import React from "react";

const EmployeeTable = ({ employees, setUserToDelete, setShowConfirmModal }) => {
  return (
    <div>
      <table className="w-full mb-4 border border-gray-400">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">Emp No.</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {employees.map((employee) => (
            <tr key={employee.id} className="text-center">
              {employee.role !== "admin" && (
                <>
                  <td className="p-2 border-b">{employee.empNumber}</td>
                  <td className="p-2 border-b">
                    {employee.username ? employee.username : "Pending"}
                  </td>
                  <td className="p-2 border-b">{employee.email}</td>
                  <td className="p-2 border-b">
                    {employee.username ? "Active" : "Pending"}
                  </td>
                  <td className="p-2 border-b">
                    <button
                      className="px-4 py-1 border-2 border-red-900 text-black shadow-2xl rounded hover:bg-red-300"
                      onClick={() => {
                        setUserToDelete(employee.id);
                        setShowConfirmModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
