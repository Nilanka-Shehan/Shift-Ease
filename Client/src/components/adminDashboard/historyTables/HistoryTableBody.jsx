import React from "react";

const HistoryTableBody = ({ histories, handleDeleteOne, loading }) => {
  return (
    <div>
      <table className="w-full mb-4 border border-gray-400">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">Emp No.</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Leave Date</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">No. of Days</th>
            <th className="border px-3 py-2">Reacted Date</th>
            <th className="border border-r-0 px-3 py-2">Status</th>
            <th className="border border-l-0 px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {histories.map((request) => (
            <tr key={request._id} className="text-center">
              <>
                <td className="p-2 border-b">{request.empNumber}</td>
                <td className="p-2 border-b">{request.email}</td>
                <td className="p-2 border-b">
                  {new Date(request.date).toISOString().split("T")[0]}
                </td>
                <td className="p-2 border-b">{request.leaveType}</td>
                <td className="p-2 border-b">{request.noOfDays}</td>
                <td className="p-2 border-b">
                  {new Date(request.createdDate).toISOString().split("T")[0]}
                </td>
                <td className="p-2 border-b">
                  {request.status === "Accepted" ? (
                    <span className="px-4 py-1 text-green-600 rounded">
                      Accepted
                    </span>
                  ) : request.status === "Rejected" ? (
                    <span className="px-4 py-1 text-red-600 rounded">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-4 py-1 rounded">Undefind</span>
                  )}
                </td>
                <td className="p-2 border-b">
                  <button
                    className="text-2xl hover:text-red-500"
                    onClick={() => handleDeleteOne(request._id)}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-red-500 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                        ></path>
                      </svg>
                    ) : (
                      "x"
                    )}
                  </button>
                </td>
              </>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTableBody;
