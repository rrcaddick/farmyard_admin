import { useQuery } from "@apollo/client";
import { GET_ALL_GROUPS } from "@groups/graphql/queries";

const useGetGroups = () => {
  const { data: { getGroups } = { getGroups: [] }, loading, error } = useQuery(GET_ALL_GROUPS);

  return { groups: getGroups, loading, error };
};

export { useGetGroups };
