import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModel from "../../components/ConfirmationModel";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useCallback } from "react";
import EmployeeTable from "../../components/adminDashboard/EmployeeTable";
import RequestTable from "../../components/adminDashboard/RequestTable";
import ActionDrawer from "../../components/adminDashboard/ActionDrawer";
import AddUserForm from "../../components/adminDashboard/AddUserForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const axiosSecure = useAxiosSecure();
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showStatusDrawer, setShowStatusDrawer] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const { user } = useAuth();
  //const [status, setStatus] = useState("");

  const [inputValue, setInputValue] = useState({ empNumber: null, email: "" });

  const fetchUsers = useCallback(async () => {
    const toastId = toast.loading("Fetching users...");
    try {
      const response = await axiosSecure.get("/user/get-all");
      setEmployees(response.data);
      toast.update(toastId, {
        render: "Users loaded successfully.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.update(toastId, {
        render: "Failed to load users.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [axiosSecure]);
  const fetchRequests = useCallback(async () => {
    const toastId = toast.loading("Fetching requests...");
    try {
      const response = await axiosSecure("/request/get-all");
      setRequests(response.data);
      toast.update(toastId, {
        render: "Requests loaded successfully.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.update(toastId, {
        render: "Failed to load requests.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchUsers();
    fetchRequests(); // initial fetch

    const interval = setInterval(() => {
      fetchRequests(); // refresh every 10 seconds
    }, 10000); // 10 sec

    return () => clearInterval(interval); // cleanup on unmount
  }, [fetchUsers, fetchRequests]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (empid) => {
    const toastId = toast.loading("Deleting user...");
    try {
      await axiosSecure.delete(`/user/delete/${empid}`);
      setEmployees((prev) => prev.filter((e) => e.id !== empid));
      await fetchUsers();
      toast.update(toastId, {
        render: "User deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.update(toastId, {
        render: "Failed to delete user.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSetStatus = async (status) => {
    const toastId = toast.loading("Updating status...");
    try {
      const response = await axiosSecure.patch(
        `/request/update-status/${selectedRequestId}`,
        status
      );
      if (response.success) {
        await fetchRequests();
        toast.update(toastId, {
          render: response.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setSelectedRequestId("");
      } else {
        toast.update(toastId, {
          render: response.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to update status.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error while updating:", error);
    }
  };

  const handleConfirmDelete = (response) => {
    if (response === "yes") {
      if (userToDelete) {
        handleDelete(userToDelete);
      } else {
        console.warn("No user selected for deletion.");
      }
    }

    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Adding user...");
    try {
      const { data } = await axiosSecure.post("/user/add-user", inputValue);
      if (data.success) {
        toast.update(toastId, {
          render: "User added successfully.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: "Failed to add user.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      setShowAddUserForm(false);
      await fetchUsers();
    } catch (error) {
      toast.update(toastId, {
        render: "Something went wrong.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(error.message);
    }
    setInputValue({ empNumber: "", email: "" });
  };

  return (
    <>
      <div className="pt-18">
        <div>
          <h1 className="px-5 pt-5 text-4xl">
            Welcome {user.username.split(" ")[0]}!
          </h1>
        </div>
        <div className="w-full mx-auto mt-8 bg-gray-100  px-10">
          {/* Tabs */}
          <div className="flex gap-4 mb-4 pb-10">
            <button
              className={`border-b-2 pb-1 ${
                activeTab === "requests"
                  ? "border-black font-semibold"
                  : "border-transparent text-gray-600"
              }`}
              onClick={() => {
                setActiveTab("requests");
                setShowAddUserForm(false);
              }}
            >
              Requests
            </button>
            <button
              className={`border-b-2 pb-1 ${
                activeTab === "employees"
                  ? "border-black font-semibold"
                  : "border-transparent text-gray-600"
              }`}
              onClick={() => {
                setActiveTab("employees");
                setShowAddUserForm(false);
              }}
            >
              Employees
            </button>
          </div>

          {/* Requests Table */}
          {activeTab === "requests" && (
            <RequestTable
              requests={requests}
              setSelectedRequestId={setSelectedRequestId}
              setShowStatusDrawer={setShowStatusDrawer}
            />
          )}

          {/* Employees Table and Add User */}
          {activeTab === "employees" && !showAddUserForm && (
            <div>
              <EmployeeTable
                employees={employees}
                setUserToDelete={setUserToDelete}
                setShowConfirmModal={setShowConfirmModal}
              />
              <button
                className="border px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowAddUserForm(true)}
              >
                Add User
              </button>
            </div>
          )}

          {/* Add User Form */}
          {activeTab === "employees" && showAddUserForm && (
            <AddUserForm
              setShowAddUserForm={setShowAddUserForm}
              handleSubmit={handleSubmit}
              handleOnChange={handleOnChange}
            />
          )}
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmationModel
          message="Are you sure you want to delete this user?"
          onConfirm={handleConfirmDelete}
        />
      )}
      {showStatusDrawer && (
        <ActionDrawer
          handleSetStatus={handleSetStatus}
          setShowStatusDrawer={setShowStatusDrawer}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default AdminDashboard;