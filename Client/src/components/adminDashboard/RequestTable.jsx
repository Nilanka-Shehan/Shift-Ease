import React, { useEffect } from "react";

const RequestTable = ({
  requests,
  setSelectedRequestId,
  setShowStatusDrawer,
  setPendingCount,
  loading,
}) => {
  useEffect(() => {
    const count = requests.filter((r) => r.status === "Pending").length;
    setPendingCount(count);
  }, [requests, setPendingCount]);

  return (
    <div>
      <table className="w-full mb-8 border border-gray-400">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">Emp No.</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Date of Leave</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">No. of Days</th>
            <th className="border px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="text-center">
              <>
                <td className="p-2 border-b">{request.empNumber}</td>
                <td className="p-2 border-b">{request.email}</td>
                <td className="p-2 border-b">
                  {new Date(request.date).toISOString().split("T")[0]}
                </td>
                <td className="p-2 border-b">{request.leaveType}</td>
                <td className="p-2 border-b">{request.noOfDays}</td>
                <td className="p-2 border-b">
                  {request.status === "Pending" ? (
                    <button
                      className="px-4 py-1 bg-yellow-200 text-black rounded"
                      onClick={() => {
                        setSelectedRequestId(request.id);
                        setShowStatusDrawer(true);
                      }}
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
                        "Pending"
                      )}
                    </button>
                  ) : request.status === "Accepted" ? (
                    <span className="px-4 py-1 text-green-600 rounded">
                      Accepted
                    </span>
                  ) : (
                    <span className="px-4 py-1 text-red-600 rounded">
                      Rejected
                    </span>
                  )}
                </td>
              </>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
