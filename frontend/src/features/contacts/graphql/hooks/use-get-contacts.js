import { useQuery } from "@apollo/client";
import { GET_ALL_CONTACTS } from "@contacts/graphql/queries";

const useGetContacts = () => {
  const { data: { getContacts } = { getGroups: [] }, loading, error } = useQuery(GET_ALL_CONTACTS);

  return { contacts: getContacts, loading, error };
};

export { useGetContacts };
