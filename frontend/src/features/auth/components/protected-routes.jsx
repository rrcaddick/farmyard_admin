import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = true;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoutes;
