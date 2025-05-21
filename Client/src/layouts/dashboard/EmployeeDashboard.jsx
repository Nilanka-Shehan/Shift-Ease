import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextFade from "../../components/TextFade";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRoleCheck from "../../hooks/useRoleCheck";
import { useEffect } from "react";
import { useCallback } from "react";

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
  const [annual, setAnnual] = useState(7);
  const [casual, setCasual] = useState(14);
  const remainingDates = annual + casual;

  const text = `If you would like to apply for leave on a specific date, please fill out the form below with all the required information. Ensure that the details provided are accurate to avoid any delays in processing your request.`;

  const handleRequestFormClick = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // This function will be called when the form is submitted
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowForm(false);

    const requestPromise = axiosSecure.post("/request/create-request", {
      empId: user.id,
      date,
      leaveType,
      noOfDays,
    });

    toast.promise(requestPromise, {
      pending: "Submitting your request...",
      success: {
        render({ data }) {
          refetch();
          //reset form fields
          setInputValue({
            leaveType: "",
            date: "",
            noOfDays: null,
          });
          return data?.data?.message || "Request submitted successfully!";
        },
      },
      error: {
        render({ data }) {
          return (
            data?.response?.data?.message || "An unexpected error occurred."
          );
        },
      },
    });

    try {
      await requestPromise;
    } catch {
      // Error already handled by toast
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
            <div className="w-[calc(100%-40px)]  h-24 bg-[#E6F4EA] rounded-lg shadow-2xl border p-4 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img
                    src="/calendar-icon.png"
                    alt="icon"
                    className="w-15 h-15 animate-pulse"
                  />
                  <div>
                    <h2 className="text-lg lg:text-2xl font-semibold text-[#23282D]">
                      Remaining Leaves
                    </h2>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg lg:text-4xl font-semibold">
                    {remainingDates}
                  </h2>
                </div>
              </div>
            </div>

            {/* Cards 2 and 3 */}
            <div className="grid grid-cols-2 gap-5 w-[calc(100%-40px)]">
              <div className="bg-[#D9E3DC] h-24 rounded-lg shadow-2xl border flex items-center p-4">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-lg lg:text-2xl font-semibold text-[#23282D]">
                      Annual Leaves
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-4xl font-semibold">
                      {annual}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="bg-[#F6EFD2] h-24 rounded-lg shadow-2xl border flex items-center p-4">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-lg lg:text-2xl font-semibold text-[#23282D]">
                      Casual Leaves
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-4xl font-semibold">
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
                  className="bg-[#4E6E44] text-[#FFFFFF] lg:text-3xl font-bold w-full rounded-2xl h-10 hover:bg-[#234325]"
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
    </>
  );
};

export default EmployeeDashboard;
