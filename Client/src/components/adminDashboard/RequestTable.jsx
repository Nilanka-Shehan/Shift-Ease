import React, { useEffect } from "react";

const RequestTable = ({
  requests,
  setSelectedRequestId,
  setShowStatusDrawer,
  setPendingCount,
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
                      Pending
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
