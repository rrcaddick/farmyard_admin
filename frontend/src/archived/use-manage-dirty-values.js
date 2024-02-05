import { useMemo, useState, useCallback } from "react";
import { createDirtyFields, getDirtyValues } from "@utils/form";
import _ from "lodash";

const useManageDirtyValues = () => {
  const [deletedFieldArrayItems, setDeletedFieldArrayItems] = useState({});
  const hasDeletedItems = useMemo(() => Object.keys(deletedFieldArrayItems).length > 0, [deletedFieldArrayItems]);

  const markAsDeleted = useCallback((fieldArray, deletedItem) => {
    setDeletedFieldArrayItems((deletedFieldArrayItems) => {
      if (deletedFieldArrayItems?.[fieldArray])
        return { ...deletedFieldArrayItems, [fieldArray]: [...deletedFieldArrayItems[fieldArray], deletedItem] };

      return { ...deletedFieldArrayItems, [fieldArray]: [deletedItem] };
    });
  }, []);

  const removeDeletedFieldArrayItems = useCallback(
    (defaultValues) => {
      const _defaultValues = { ...defaultValues };
      const deletedFieldArrays = Object.keys(deletedFieldArrayItems);

      for (let deletedFieldArray of deletedFieldArrays) {
        _defaultValues[deletedFieldArray] = _defaultValues[deletedFieldArray].filter((fieldArrayItem) => {
          return deletedFieldArrayItems[deletedFieldArray]?.some((deletedItem) => deletedItem.id !== fieldArrayItem.id);
        });
      }

      return _defaultValues;
    },
    [deletedFieldArrayItems]
  );

  const getDirtyData = useCallback(
    (defaultValues, submittedValues, { dirtyFieldsModifier, withId = false, dependantFields = [] }) => {
      const _defaultValues = removeDeletedFieldArrayItems(defaultValues);

      const dirtyFields = createDirtyFields(
        _defaultValues,
        dirtyFieldsModifier ? dirtyFieldsModifier(submittedValues) : submittedValues,
        dependantFields
      );

      const dirtyValues = getDirtyValues(dirtyFields, submittedValues, { withId });

      const value = _.merge({ ...dirtyValues, id: submittedValues.id }, deletedFieldArrayItems);

      return _.merge({ ...dirtyValues, id: defaultValues.id }, deletedFieldArrayItems);
    },
    [removeDeletedFieldArrayItems, deletedFieldArrayItems]
  );

  const getDirtyValuesTest = (defaultData, submittedData, stringifiedPaths) => {
    const pathsToBeStringified = stringifiedPaths;

    const removeDeletedItems = (data, deletedFieldArrayItems) => {
      for (const path in deletedFieldArrayItems) {
        const keys = path.split(".");
        let current = data;
        keys.forEach((key) => {
          if (Array.isArray(current[key])) {
            const idsToDelete = deletedFieldArrayItems[path].map((item) => item.id);
            current[key] = current[key].filter((item) => !idsToDelete.includes(item.id));
          }
          current = current[key];
        });
      }
    };

    const stringifyPath = (path, data) => {
      const keys = path.split(".");
      let current = data;
      keys.forEach((key) => {
        if (Array.isArray(current[key])) {
          current[key].forEach((item, index) => {
            current[key][index] = JSON.stringify(item);
          });
        } else {
          current[key] = JSON.stringify(current[key]);
        }
        current = current[key];
      });
    };

    removeDeletedItems(defaultData, deletedFieldArrayItems);

    pathsToBeStringified.forEach((path) => {
      stringifyPath(path, submittedData);
    });

    const getDifferentValues = (defaultData, submittedData) => {
      if (typeof defaultData !== "object") {
        return defaultData === submittedData ? undefined : submittedData;
      }

      if (Array.isArray(defaultData)) {
        if (!Array.isArray(submittedData)) {
          return submittedData;
        }

        const result = [];
        for (let i = 0; i < Math.max(defaultData.length, submittedData.length); i++) {
          const diff = getDifferentValues(defaultData[i], submittedData[i]);
          result.push(diff === undefined ? null : diff);
        }
        return result;
      }

      const resultObj = {};
      for (const key in defaultData) {
        const diff = getDifferentValues(defaultData[key], submittedData[key]);
        if (diff !== undefined) {
          resultObj[key] = diff;
        }
      }
      return Object.keys(resultObj).length === 0 ? undefined : resultObj;
    };

    return getDifferentValues(defaultData, submittedData);
  };

  return {
    markAsDeleted,
    getDirtyData,
    getDirtyValuesTest,
    hasDeletedItems,
  };
};

export { useManageDirtyValues };
