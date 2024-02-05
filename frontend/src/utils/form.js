import { removeProperty, stringifyPath } from "@utils/common";

const isObject = (objectRef) => {
  if (typeof objectRef === "object" && !Array.isArray(objectRef) && objectRef !== null) {
    return true;
  }
  return false;
};

const createDependantObject = (value, dependantFields) => {
  const keys = Object.keys(value);
  const hasDependantField = keys.some((key) => dependantFields.includes(key));
  return hasDependantField ? { ...value, ...Object.fromEntries(dependantFields.map((x) => [x, true])) } : value;
};

const createDirtyFields = (defaultValues, submittedValues, dependantFields) => {
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
  let dirtyFields = Object.fromEntries(
    Object.keys(submittedValues).reduce((acc, key) => {
      const submitData = submittedValues[key];
      const defaultData = defaultValues?.[key] || "";
      const dependantField = dependantFields?.[key];
      let value = createDirtyFields(defaultData, submitData, dependantFields?.[key]);

      if (Array.isArray(dependantField) && value) {
        value = Array.isArray(value)
          ? value.map((x) => {
              const test = createDependantObject(x, dependantField);
              return test;
            })
          : createDependantObject(value, dependantField);
      }

      if (!value || (isObject(value) && Object.keys(value).length === 0)) return acc;
      acc.push([key, value]);
      return acc;
    }, [])
  );

  if (dependantFields?.root) {
    dirtyFields = createDependantObject(dirtyFields, dependantFields?.root);
  }

  return dirtyFields;
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
    for (let i = 0; i < allValues.length; i++) {
      const dirtyField = dirtyFields.find((x) => x.index === i);
      const { index, ...dirtyFieldsObject } = dirtyField || {};
      arrayObjects.push(dirtyField ? { ...getDirtyValues(dirtyFieldsObject, allValues[index], { withId }) } : null);
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

const parseGraphqlData = (data, stringifyPaths = []) => {
  const resultObj = removeProperty(data, "__typename");

  stringifyPaths.forEach((path) => {
    stringifyPath(path, resultObj);
  });

  return resultObj;
};

export { addIdToDirtyFields, getDirtyValues, createDirtyFields, parseGraphqlData };
