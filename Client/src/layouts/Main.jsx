import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LoginModal from "../components/Login"; // Import your modal
import Navbar from "../components/Navbar";

const Main = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="relative min-h-screen">
        <Navbar onLoginClick={() => setShowLogin(true)} showLogin={showLogin} />
        <div className="w-full">
          <Outlet />
        </div>
        <footer>{/* Optional footer */}</footer>
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Main;
