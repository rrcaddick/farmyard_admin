import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = false;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoutes;
