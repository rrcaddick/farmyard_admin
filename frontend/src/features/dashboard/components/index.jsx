import { useQuery } from "@apollo/client";
import { getMe } from "@auth/graphql/queries";

const Dashboad = () => {
  const { loading, error, data } = useQuery(getMe, { fetchPolicy: "network-only" });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return <div>User: Ray Caddick</div>;
};

export default Dashboad;
