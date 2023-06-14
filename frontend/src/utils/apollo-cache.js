const hasApolloCache = () => {
  return !!sessionStorage.getItem("apollo-cache-persist");
};

export { hasApolloCache };
