import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./layouts/Dashboard";
import AdminDashboard from "./layouts/dashboard/AdminDashboard";
import EmployeeDashboard from "./layouts/dashboard/EmployeeDashboard";
import Main from "./layouts/Main";
import Home from "./pages/Home";
import SetupAccount from "./pages/SetupAccount";
import RoleProtectedRoute from "./hooks/RoleProtectedRoutes";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "employee-dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={["user"]}>
            <EmployeeDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <RoleProtectedRoute>
            <AdminDashboard />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "setup-account",
    element: <SetupAccount />,
  },
  {
    path: "*",
    element: <NotFound  />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
