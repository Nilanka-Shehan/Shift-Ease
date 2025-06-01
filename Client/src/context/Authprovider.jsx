import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("access-token", data.token);
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  //google login
  const googleLogin = async (response) => {
    const token = response.code;
    console.log(`token:${token}`);
    if (!token) {
      console.error("Google login failed: Missing access token.");
      return {
        success: false,
        message: "Google login failed: Missing access token.",
      };
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/user/google-login",
        {
          token: token, // Send credential as token
        }
      );

      if (data.success) {
        console.log(data);
        localStorage.setItem("access-token", data.token);
        setUser(data.user);
        return data;
      } else {
        console.error("Google login failed:", data.message);
        return data;
      }
    } catch (error) {
      console.error(
        "Error during Google login:",
        error.response?.data || error.message
      );
      return { success: false, message: "Google login failed." };
    }
  };

  //logout
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("access-token");
    window.location.replace('/');
 // Refresh the window after logout
  };

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const { data } = await axios.get(`http://localhost:5000/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            setUser(data.employee);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error fetching user : ", error.message);
          localStorage.removeItem("access-token");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const authInfo = {
    user,
    login,
    logout,
    loading,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? <div>Loading...</div> : children} {/* Added loading check */}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
