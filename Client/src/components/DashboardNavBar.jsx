import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./adminDashboard/NotificationBell";

const DashboardNavBar = ({ count }) => {
  const [isSticky, setSticky] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    window.location.reload;
  };

  return (
    <>
      <div
        className={`${
          isSticky ? "bg-gray-900 opacity-90" : "bg-gray-900 shadow-2xl"
        } fixed top-0 left-0 w-full h-fit z-50`}
      >
        <div className="flex items-center justify-between w-full h-20 px-5">
          <img
            src="/logo.png"
            alt="logo"
            className="h-16 w-16 md:h-20 md:w-20 lg:h-28 lg:w-28 object-contain drop-shadow-lg transition-transform duration-300 hover:border-[#FFD700]"
          />
          <div className="flex items-center gap-10">
            {user.role === "admin" && <NotificationBell count={count} />}
            <GrLogout
              className="text-red-500 text-2xl"
              onClick={handleLogout}
            />
            <img
              src={user?.photoURL}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNavBar;
