import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const DashboardNavBar = () => {
  const [isSticky, setSticky] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  return (
    <>
      <div
        className={`${
          isSticky ? "bg-transparent" : "bg-[#234325] shadow-2xl"
        } fixed top-0 left-0 w-full h-fit z-50`}
      >
        <div className="flex items-center justify-between w-full h-20 px-5">
          <img src="/logo.jpg" alt="logo" className="w-15 h-15" />
          <img
            src={user?.photoURL}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </>
  );
};

export default DashboardNavBar;
