// import { CREATE_GROUP_MUTATION } from "../mutations";

// const useGroup = () => {
//   const [createGroup, { loading }] = useMutation(CREATE_GROUP_MUTATION, {
//     onError: ({ graphQLErrors }) => {
//       if (graphQLErrors?.length > 0) {
//         const { data: errors } = graphQLErrors[0]?.extensions || {};
//       }
//     },
//     onCompleted: (data) => {},
//     update: () => {},
//   });

//   return {
//     createGroup,
//     getGroups,
//     updateGroup,
//     deleteGroups,
//   };
// };

// export default useGroup;
