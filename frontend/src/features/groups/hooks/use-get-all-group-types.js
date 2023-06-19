import { useQuery } from "@apollo/client";
import { GET_ALL_GROUP_TYPES } from "../graphql/queries";

const useGetAllGroupTypes = () => {
  const {
    data: { getGroupTypes } = { getGroupTypes: [] },
    loading,
    error,
    refetch: retry,
  } = useQuery(GET_ALL_GROUP_TYPES);

  return { groupTypes: getGroupTypes, loading, error, retry };
};

export { useGetAllGroupTypes };
