import React from "react";

const Navbar = ({ onLoginClick, showLogin }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 opacity-80">
        <div className="flex items-center justify-between w-full h-20 px-5 pt-5">
          <img
            src="/logo.png"
            alt="logo"
            className="h-16 w-16 md:h-20 md:w-20 lg:h-28 lg:w-28 object-contain drop-shadow-lg transition-transform duration-300 hover:border-[#FFD700]"
          />

          {!showLogin && (
            <button
              className="bg-[#E30B5D] text-white font-bold w-40 h-10 rounded-2xl hover:bg-[#B50849] transition duration-300"
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
