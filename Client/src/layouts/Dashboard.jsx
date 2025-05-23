import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavBar from "../components/DashboardNavBar";

const Dashboard = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <div>
        <DashboardNavBar count={count} className="relative min-h-screen"/>
      </div>
      <div className="w-full">
        <Outlet context={{setCount}}/>
      </div>
      <div>
        <footer>{/* Optional footer */}</footer>
      </div>
    </>
  );
};

export default Dashboard;
