import { Outlet, Navigate } from "react-router-dom";
import { useApolloCache } from "../../../hooks/use-apollo-cache";
import { getMe } from "../graphql/queries";

const ProtectedRoutes = ({ auth = true }) => {
  const cache = useApolloCache();
  const user = cache.read(getMe);

  if (!user) return <Navigate to="/login" />;

  if (user && !auth) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoutes;
