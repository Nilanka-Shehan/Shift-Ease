import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import HistoryTableBody from "./HistoryTableBody";
import ConfirmationModel from "../../ConfirmationModel";

const HistoryTable = ({ histories }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [empNumber, setEmpNumber] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteOne = async (requestId) => {
    setLoading(true);
    try {
      await axiosSecure.delete(`/history/delete-one/${requestId}`);
    } catch (error) {
      console.error({ message: error.message });
      toast.error("Failed to delete user.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setShowConfirmModal(true);
  };

  const confirmClearHistory = async (response) => {
    setShowConfirmModal(false);
    if (response !== "yes") return;

    setLoading(true);
    try {
      await axiosSecure.delete("/history/delete-all");
      toast.success("All history cleared.", { autoClose: 2000 });

      setSearchHistory([]);
      setEmpNumber("");
      setShowSearchResult(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear history.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchSearch = async () => {
        if (!empNumber) {
          setShowSearchResult(false);
          setSearchHistory([]);
          setMessage("");
          return;
        }

        try {
          const response = await axiosSecure.get(
            `/history/search/${empNumber}`
          );
          setShowSearchResult(true);

          if (response?.data?.success && response.data.result.length > 0) {
            setSearchHistory(response.data.result);
            setMessage("");
          } else {
            setSearchHistory([]);
            setMessage("No records found for this employee.");
          }
        } catch (error) {
          console.error(error);
          setMessage("Error fetching search results.");
          toast.error("Search failed.", { autoClose: 2000 });
        }
      };

      fetchSearch();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [empNumber, axiosSecure]);

  return (
    <>
      <div className="flex flex-col mb-3">
        <div className="relative w-full max-w-sm">
          <input
            type="number"
            id="empNumber"
            name="empNumber"
            placeholder="Employee Number"
            className="w-full border rounded px-3 py-2 bg-[#F4FBF4] focus:outline-none focus:ring-2 focus:ring-[#B7C9A8] pr-10"
            value={empNumber}
            onChange={(e) => {
              const value = e.target.value;
              setEmpNumber(value);
            }}
          />
        </div>
      </div>

      {showSearchResult ? (
        searchHistory.length > 0 ? (
          <HistoryTableBody
            histories={searchHistory}
            handleDeleteOne={handleDeleteOne}
            loading={loading}
          />
        ) : (
          <span className="text-center text-gray-500 block mt-4">
            {message}
          </span>
        )
      ) : (
        <HistoryTableBody
          histories={histories}
          handleDeleteOne={handleDeleteOne}
          loading={loading}
        />
      )}
      {/* Clear History Button */}
      <div className="flex justify-end">
        <button
          onClick={handleClearHistory}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-fit mt-4"
        >
          Clear Full History
        </button>
      </div>

      {showConfirmModal && (
        <ConfirmationModel
          message="Are you sure you want to delete all history?"
          onConfirm={confirmClearHistory}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default HistoryTable;
