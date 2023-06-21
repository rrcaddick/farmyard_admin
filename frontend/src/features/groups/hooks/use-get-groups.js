import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "@groups/graphql/queries";

const useGetGroups = () => {
  const { data: { getGroups } = { getGroups: [] }, loading, error } = useQuery(GET_GROUPS);

  return { groups: getGroups, loading, error };
};

export { useGetGroups };
