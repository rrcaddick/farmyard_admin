import _ from "lodash";
import { useMemo, useCallback } from "react";
import { GET_CONTACT_TYPES } from "@contacts/graphql/queries";
import { GET_GROUPS } from "@groups/graphql/queries";
import { useApolloQuery } from "@hooks/use-apollo-query";

const useGetContactFormData = () => {
  const {
    data: contactTypes,
    loading: contactTypesLoading,
    serverErrors: contactTypesServerErrors,
    refetch: contactTypesRefetch,
  } = useApolloQuery(GET_CONTACT_TYPES);

  const {
    data: groups,
    loading: groupsLoading,
    serverErrors: groupsServerErrors,
    refetch: groupsRefetch,
  } = useApolloQuery(GET_GROUPS);

  const loading = useMemo(() => {
    return contactTypesLoading || groupsLoading;
  }, [contactTypesLoading, groupsLoading]);

  const refetch = useCallback(() => {
    contactTypesRefetch();
    groupsRefetch();
  }, [contactTypesRefetch, groupsRefetch]);

  const serverErrors = useMemo(
    () => _.merge({}, contactTypesServerErrors, groupsServerErrors),
    [contactTypesServerErrors, groupsServerErrors]
  );

  return {
    data: {
      contactTypes: contactTypes ?? [],
      groups: groups ?? [],
    },
    loading,
    serverErrors,
    refetch,
  };
};

export default useGetContactFormData;
