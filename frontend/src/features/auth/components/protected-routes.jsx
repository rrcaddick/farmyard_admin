import { Outlet, Navigate } from "react-router-dom";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";

const ProtectedRoutes = () => {
  const cache = useApolloCache();
  const user = cache.read(getMe);

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoutes;
