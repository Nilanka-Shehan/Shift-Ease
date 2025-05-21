import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
//import useAxiosSecure from '../hooks/useAxiosSecure';

const SetupAccount = () => {
  const [inputValue, setInputValue] = useState({ username: "", password: "" });
  //const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const setupToken = queryParams.get("token");
    if (setupToken) {
      setToken(setupToken);
    } else {
      toast.error("Invalid or missing setup token.");
    }
  }, [location]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...inputValue, token };
    try {
      const { data } = await axios.patch(
        "http://localhost:5000/user/setup-account",
        payload
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      data.success && navigate("/");
    } catch (error) {
      console.error(error.message);
    }
    setInputValue({ empNumber: "", email: "" });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-trnsparent backdrop-blur-md">
        <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[80vh] border border-white/40">
          <h2 className="flex justify-center text-2xl font-bold mb-4">
            Add Name & Password
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="String"
              name="username"
              placeholder="UserName"
              onChange={handleOnChange}
              className="w-full mb-4 p-2 border-b-3 text-gray-800 font-bold"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleOnChange}
              className="w-full mb-4 p-2 border-b-3 text-gray-800 font-bold"
            />

            <button
              type="submit"
              className="w-full bg-[#4BFD4B] text-black px-4 py-2 rounded-2xl hover:bg-[#3AD93A]"
            >
              Change
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SetupAccount;
