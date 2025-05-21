import React from "react";

const Navbar = ({ onLoginClick, showLogin }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="flex items-center justify-between w-full h-20 px-5 pt-5">
          <img src="/logo.jpg" alt="logo" className="w-20 h-20" />
          {!showLogin && (
            <button
              className="bg-[#4BFD4B] w-40 h-10 rounded-2xl hover:bg-[#3AD93A] transition duration-300"
              onClick={onLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
