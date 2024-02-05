const isFunction = (FnTest) => {
  return Object.prototype.toString.call(FnTest) === "[object Function]";
};

const isString = (stringTest) => {
  return Object.prototype.toString.call(stringTest) === "[object String]";
};

const createOptimisticResponse = (schema, data, isMutationWrapper = true) => {
  // Get required data
  if (schema === 1) {
    return data ?? "";
  }

  // Runs custom data functiontrivial pursuit
  if (isFunction(schema)) {
    const customData = schema(data);
    return customData ?? data;
  }

  // Returns static data like __typename
  if (isString(schema)) return schema;

  // Recursively loop array
  if (Array.isArray(schema)) {
    const arrayItems = [];
    for (let item of data) {
      arrayItems.push(createOptimisticResponse(schema[0], item, false));
    }
    return arrayItems;
  }

  return Object.fromEntries(
    Object.keys(schema).map((key) => {
      const newData = isMutationWrapper ? data : data?.[key];
      const value = createOptimisticResponse(schema[key], newData, false);
      return [key, value];
    })
  );
};

export { createOptimisticResponse };
