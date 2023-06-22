const isObject = (objectRef) => {
  if (typeof objectRef === "object" && !Array.isArray(objectRef) && objectRef !== null) {
    return true;
  }
  return false;
};

const createDirtyFields = (defaultValues, submittedValues, dependantFields = []) => {
  // Value is array
  if (Array.isArray(submittedValues)) {
    // Loop array and recursively call createDirtyFields
    const arrayObjects = [];
    for (let i = 0; i < submittedValues.length; i++) {
      const { id } = submittedValues[i];
      const defaultArrayValue = defaultValues.find((value) => value.id === id);
      const dirtyFieldsObject = createDirtyFields(defaultArrayValue, submittedValues[i], dependantFields);
      if (Object.keys(dirtyFieldsObject).length > 0) arrayObjects.push({ ...dirtyFieldsObject, index: i });
    }
    return arrayObjects.length > 0 ? arrayObjects : undefined;
  }

  // Value is not object
  if (!isObject(submittedValues)) {
    // Recursively call createDirtyFields
    return submittedValues !== defaultValues;
  }

  // Recursively call createDirtyFields
  return Object.fromEntries(
    Object.keys(submittedValues).reduce((acc, key) => {
      const submitData = submittedValues[key];
      const defaultData = defaultValues?.[key] || "";
      const isDependantField = dependantFields.includes(key);
      const value = isDependantField || createDirtyFields(defaultData, submitData, dependantFields);
      if (!value || (isObject(value) && Object.keys(value).length === 0)) return acc;
      acc.push([key, value]);
      return acc;
    }, [])
  );
};

const addIdToDirtyFields = (dirtyFields) => {
  if (dirtyFields === true) return true;

  if (Object.keys(dirtyFields).length === 0) return {};

  if (Array.isArray(dirtyFields)) {
    const arrayObjects = [];
    for (let i = 0; i < dirtyFields.length; i++) {
      if (!dirtyFields[i]) arrayObjects.push(null);
      else arrayObjects.push(addIdToDirtyFields(dirtyFields[i]));
    }
    return arrayObjects;
  }

  return Object.fromEntries(
    Object.keys(dirtyFields).reduce(
      (acc, key) => {
        const value = addIdToDirtyFields(dirtyFields[key]);
        if (typeof value === "object" && Object.keys(value).length === 0) return acc;
        acc.push([key, value]);
        return acc;
      },
      [["id", true]]
    )
  );
};

const getDirtyValues = (dirtyFields, allValues, { withId = false }) => {
  if (dirtyFields === true) return allValues;

  if (Object.keys(dirtyFields).length === 0) return {};

  if (Array.isArray(dirtyFields)) {
    const arrayObjects = [];
    for (let i = 0; i < dirtyFields.length; i++) {
      if (!dirtyFields[i]) continue;
      const { index, ...dirtyFieldsObject } = dirtyFields[i];
      arrayObjects.push({ ...getDirtyValues(dirtyFieldsObject, allValues[index], { withId }) });
    }
    return arrayObjects;
  }

  if (withId && Object.keys(dirtyFields).length > 0 && allValues?.id) dirtyFields = { ...dirtyFields, id: true };

  return Object.fromEntries(
    Object.keys(dirtyFields).reduce((acc, key) => {
      const value = getDirtyValues(dirtyFields[key], allValues[key], { withId });
      if (key === "id" && value.includes("Temp")) return acc;
      if (typeof value === "object" && Object.keys(value).length === 0) return acc;
      acc.push([key, value]);
      return acc;
    }, [])
  );
};

const getDirtyData = () => {};

export { addIdToDirtyFields, getDirtyValues, createDirtyFields, getDirtyData };
