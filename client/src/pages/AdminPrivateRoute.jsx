import React from "react";
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user?.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminPrivateRoute;
