import { Outlet, Navigate } from "react-router-dom";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { GET_ME } from "@auth/graphql/queries";

const IsAuthRedirect = () => {
  const cache = useApolloCache();
  const user = cache.read(GET_ME);

  if (user) return <Navigate to="/" />;

  return <Outlet />;
};

export default IsAuthRedirect;
