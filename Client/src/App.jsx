import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Dashboard from './layouts/Dashboard';
import AdminDashboard from './layouts/dashboard/AdminDashboard';
import EmployeeDashboard from './layouts/dashboard/EmployeeDashboard';
import Main from './layouts/Main';
import Home from './pages/Home';
import SetupAccount from './pages/SetupAccount';

const router = createBrowserRouter([
  {
    path : "/",
    element : <Main/>,
    children : [
      {
        path : "/",
        element : <Home/>
      },
    ]
  },
  {
    path : "dashboard",
    element : <Dashboard/>,
    children : [
      {
        path : "employee-dashboard",
        element : <EmployeeDashboard/>
      },
      {
        path : "admin-dashboard",
        element : <AdminDashboard/>
      }
    ]
  },
  {
    path : "setup-account",
    element : <SetupAccount/>
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;