import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TextFade from "../../components/TextFade";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRoleCheck from "../../hooks/useRoleCheck";
import { useEffect } from "react";
import { useCallback } from "react";
import AlertModel from "../../components/AlertModel";

const EmployeeDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { refetch } = useRoleCheck();
  const formRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const [inputValue, setInputValue] = useState({
    leaveType: "",
    date: "",
    noOfDays: null,
  });
  const { leaveType, date, noOfDays } = inputValue;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [annual, setAnnual] = useState(7);
  const [casual, setCasual] = useState(14);
  const remainingDates = annual + casual;

  const text = `If you would like to apply for leave on a specific date, please fill out the form below with all the required information. Ensure that the details provided are accurate to avoid any delays in processing your request.`;

  const handleRequestFormClick = () => {
    if(remainingDates <= 0) {
      setShowRequestForm(true);
      return;
    }
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // This function will be called when the form is submitted
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowForm(false);

    const payload = {
      empId: user.id,
      date,
      leaveType,
      noOfDays,
    };

    // Wrap your axios call inside a function so you can handle state changes separately
    const requestPromise = axiosSecure.post("/request/create-request", payload);
    toast.promise(requestPromise, {
      pending: "Submitting your request...",
      success: "Request submitted successfully!",
      error: {
        render({ data }) {
          // `data` is the error thrown
          if (axios.isAxiosError(data)) {
            setShowConfirmation(true);
            setErrorMessage(
              data.response?.data?.message ||
                "An error occurred while submitting your request."
            );
            return (
              data.response?.data?.message ||
              "An error occurred while submitting your request."
            );
          }
          return "An unexpected error occurred.";
        },
      },
    });

    try {
      await requestPromise;

      // Only update state after successful request
      refetch();
      setInputValue({
        leaveType: "",
        date: "",
        noOfDays: null,
      });
    } catch (err) {
      // Do nothing — toast already shows the error
      console.error("Submission error (already handled by toast):", err);
    }
  };

  const handleOnChange = (e) => {
    const { name, value, type } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const fetchRequest = useCallback(async () => {
    try {
      const response = await axiosSecure.get(`/request/get-request/${user.id}`);
      setAnnual(response.data.annual);
      setCasual(response.data.casual);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [axiosSecure, user.id]);

  useEffect(() => {
    fetchRequest();
    refetch();
    const interval = setInterval(() => {
      fetchRequest();
      refetch(); // refresh every 10 seconds
    }, 5000); // 5 sec
    return () => clearInterval(interval);
  }, [fetchRequest, refetch]);

  return (
    <>
      <div className="bg-[#F8F9F7] pt-20">
        <div
        // className="w-full bg-cover bg-center"
        // style={{ backgroundImage: "url('/coverphoto.jpg')" }}
        >
          <div>
            <h1 className="px-5 pt-5 text-4xl">Welcome {user.username}!</h1>
          </div>

          <section className="flex flex-col items-center gap-5 pt-10">
            {/* Card 1 */}
            <div className="w-[calc(100%-40px)]  h-24 bg-[#121212] opacity-90 shadow-2xl border p-4 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img
                    src="/calendar-icon.png"
                    alt="icon"
                    className="w-15 h-15 animate-pulse"
                  />
                  <div>
                    <h2 className="text-lg lg:text-2xl font-semibold text-[#A8A8A8]">
                      Remaining Leaves
                    </h2>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg lg:text-4xl font-semibold text-[#A8A8A8]">
                    {remainingDates}
                  </h2>
                </div>
              </div>
            </div>

            {/* Cards 2 and 3 */}
            <div className="grid grid-cols-2 gap-5 w-[calc(100%-40px)]">
              <div className="bg-[#121212] opacity-90 h-24 shadow-2xl border flex items-center p-4">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-lg lg:text-2xl font-semibold text-[#A8A8A8]">
                      Annual Leaves
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-4xl font-semibold text-[#A8A8A8]">
                      {annual}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="bg-[#121212] opacity-90 h-24 shadow-2xl border flex items-center p-4">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-lg lg:text-2xl font-semibold text-[#A8A8A8]">
                      Casual Leaves
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-4xl font-semibold text-[#A8A8A8]">
                      {casual}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-5 items-center pt-20">
          {/* Image */}
          <div className="p-5 lg:col-span-3">
            <img
              src="/employee.jpg"
              alt="image"
              className="w-full h-auto rounded-md shadow-2xl"
            />
          </div>
          {/* Text */}
          <div className="p-5 lg:col-span-2 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-lg lg:text-2xl mb-4">
                <TextFade text={text} />
              </h1>
            </div>
            <div>
              <div className="flex justify-center w-full">
                <img
                  src="/arrow.png"
                  alt="image"
                  className="w-32 h-32 lg:w-64 lg:h-64 rounded-lg bg-none animate-bounce"
                />
              </div>
              <div>
                <button
                  className="bg-gray-900 text-[#FFFFFF] lg:text-3xl font-bold w-full rounded-2xl h-10 hover:bg-[#121212]"
                  onClick={handleRequestFormClick}
                >
                  Request Form
                </button>
              </div>
            </div>
          </div>
        </section>
        {showForm && (
          <section>
            <div className="max-w-lg lg:max-w-2xl mx-auto mt-10 bg-[#E6F4EA] border-[#B7C9A8] rounded p-6 shadow-md">
              <h2 className="text-center text-lg font-semibold mb-6">
                Request Form
              </h2>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="block font-medium mb-1" htmlFor="empNumber">
                    Employee Number :
                  </label>
                  <input
                    type="number"
                    id="empNumber"
                    name="empNumber"
                    value={user.empNumber}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-[#F4FBF4] focus:outline-none focus:ring-2 focus:ring-[#B7C9A8]"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block font-medium mb-1" htmlFor="leaveType">
                    Type of Leave :
                  </label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    onChange={handleOnChange}
                    className="w-full border rounded px-3 py-2 bg-[#F4FBF4] focus:outline-none focus:ring-2 focus:ring-[#B7C9A8]"
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="Annual">Annual leaves</option>
                    <option value="Casual">Casual leaves</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1" htmlFor="date">
                    Date of Leave :
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={handleOnChange}
                    className="w-full border rounded px-3 py-2 bg-[#F4FBF4] focus:outline-none focus:ring-2 focus:ring-[#B7C9A8]"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="numberOfDays"
                  >
                    No. of Days :
                  </label>
                  <input
                    type="number"
                    id="noOfDays"
                    name="noOfDays"
                    onChange={handleOnChange}
                    className="w-full border rounded px-3 py-2 bg-[#F4FBF4] focus:outline-none focus:ring-2 focus:ring-[#B7C9A8]"
                    required
                  />
                </div>
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="bg-[#4E6E44] text-white font-semibold px-6 py-2 rounded hover:bg-[#234325] transition"
                    // onClick={setShowForm(false)}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
      <ToastContainer />
      {showConfirmation && (
        <AlertModel
          message={errorMessage}
          setShowConfirmation={setShowConfirmation}
        />
      )}
      {showRequestForm && (
        <AlertModel
          message="You have no remaining leaves. Please contact your manager."
          setShowConfirmation={setShowRequestForm}
        />
      )}
    </>
  );
};

export default EmployeeDashboard;
