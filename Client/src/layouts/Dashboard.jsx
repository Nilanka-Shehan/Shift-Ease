import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavBar from "../components/DashboardNavBar";

const Dashboard = () => {
  return (
    <>
      <div>
        <DashboardNavBar className="relative min-h-screen"/>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
      <div>
        <footer>{/* Optional footer */}</footer>
      </div>
    </>
  );
};

export default Dashboard;
