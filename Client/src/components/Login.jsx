import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRoleCheck from "../hooks/useRoleCheck";

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const allowedRoles = ["admin", "user"];
  const { login, googleLogin } = useAuth();
  const { role, refetch } = useRoleCheck(allowedRoles);
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const { email, password } = inputValue;

  useEffect(() => {
    if (role) {
      switch (role) {
        case "admin":
          navigate("dashboard/admin-dashboard");
          break;
        case "user":
          navigate("dashboard/employee-dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [role, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const loadingToastId = toast.loading("Logging in...");

  try {
    const response = await login(email, password);
    if (response.success) {
      toast.update(loadingToastId, {
        render: response.message || "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      refetch();
    } else {
      toast.update(loadingToastId, {
        render: response.message || "Login failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    toast.update(loadingToastId, {
      render: error.response?.data?.message || "An unexpected error occurred.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }

  setInputValue({ email: "", password: "" });
};


  const handleGoogleLogin = () => {
    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      ux_mode: "popup", // so it doesn't redirect your page
      callback: async (response) => {
        if (!response.code) {
          toast.error("Google login failed: Missing authorization code.");
          return;
        }

        try {
          // send authorization code to your backend to exchange for access_token and verify user
          console.log(response);
          const loginResponse = await googleLogin(response);
          if (loginResponse.success) {
            toast.success("Google login successful");
            refetch(); // refresh user role
          } else {
            toast.error(loginResponse.message);
          }
        } catch (error) {
          console.error("Google login error:", error);
          toast.error("Google login failed");
        }
      },
    });

    client.requestCode();
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-trnsparent backdrop-blur-md">
        <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[80vh] border border-white/40">
          <h2 className="flex justify-center text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleOnChange}
              className="w-full mb-4 p-2 border-b-3 text-white font-bold"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleOnChange}
              className="w-full mb-4 p-2 border-b-3 text-white font-bold"
            />

            <button
              type="submit"
              className="w-full bg-[#4BFD4B] text-black px-4 py-2 rounded-2xl hover:bg-[#3AD93A]"
            >
              Login
            </button>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-white font-bold">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-[#D9D9D9] text-black px-4 py-2 rounded-2xl hover:bg-white"
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>
            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-red-500 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginModal;
