import { Outlet, Navigate } from "react-router-dom";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";

const IsAuthRedirect = () => {
  const cache = useApolloCache();
  const user = cache.read(getMe);

  if (user) return <Navigate to="/" />;

  return <Outlet />;
};

export default IsAuthRedirect;
