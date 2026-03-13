import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { FinTechContext } from "../context/FinTechContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(FinTechContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;