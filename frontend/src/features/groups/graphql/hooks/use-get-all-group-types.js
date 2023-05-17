import { useQuery } from "@apollo/client";
import { GET_ALL_GROUP_TYPES } from "../queries";

const useGetAllGroupTypes = () => {
  const { data: { getGroupTypes } = { getGroupTypes: [] }, loading, error } = useQuery(GET_ALL_GROUP_TYPES);

  return { groupTypes: getGroupTypes, loading, error };
};

export { useGetAllGroupTypes };
