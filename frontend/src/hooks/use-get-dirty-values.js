import _ from "lodash";
import { useMemo, useState, useCallback } from "react";
import { isPrimitive, stringifyPath } from "@utils/common";

const useGetDirtyFields = () => {
  const [deletedFieldArrayItems, setDeletedFieldArrayItems] = useState({});
  const hasDeletedItems = useMemo(() => Object.keys(deletedFieldArrayItems).length > 0, [deletedFieldArrayItems]);

  const markAsDeleted = useCallback((fieldArray, deletedItem) => {
    setDeletedFieldArrayItems((deletedFieldArrayItems) => {
      if (deletedFieldArrayItems?.[fieldArray])
        return { ...deletedFieldArrayItems, [fieldArray]: [...deletedFieldArrayItems[fieldArray], deletedItem] };

      return { ...deletedFieldArrayItems, [fieldArray]: [deletedItem] };
    });
  }, []);

  const removeDeletedItems = (data, deletedFieldArrayItems) => {
    for (const path in deletedFieldArrayItems) {
      const keys = path.split(".");
      let current = data;
      keys.forEach((key) => {
        if (Array.isArray(current[key])) {
          const idsToDelete = deletedFieldArrayItems[path];
          current[key] = current[key].filter((item) => !idsToDelete.includes(item.id));
        }
        current = current[key];
      });
    }
  };

  const getDirtyFields = (defaultData, submittedData, hasIdField = false) => {
    // Primitive type - return data if changed
    if (isPrimitive(defaultData)) {
      return defaultData === submittedData ? undefined : submittedData;
    }

    // Array type - Loop over and recursively call getDirtyFields. Push null for no diff to maintain index positions
    if (Array.isArray(defaultData)) {
      if (!Array.isArray(submittedData)) {
        return submittedData;
      }

      const result = [];
      for (let i = 0; i < Math.max(defaultData.length, submittedData.length); i++) {
        const diff = getDirtyFields(defaultData[i], submittedData[i], hasIdField);
        const noDiff = diff === undefined || (Object.keys(diff).length === 1 && "id" in diff);
        result.push(noDiff ? null : diff);
      }
      return result;
    }

    // Object type - Loop keys and recursively call getDirtyFields. Checks for existance of id field and adds it
    const resultObj = {};
    for (const key in defaultData) {
      if (key === "id") continue;
      const diff = getDirtyFields(defaultData[key], submittedData[key], hasIdField);
      if (diff !== undefined) {
        resultObj[key] = diff;
      }
    }

    if ("id" in defaultData && !hasIdField) {
      hasIdField = true;
      resultObj.id = defaultData.id;
    }

    return Object.keys(resultObj).length === 0 ? undefined : resultObj;
  };

  const getDirtyValues = (defaultData, submittedData, stringifiedPaths = []) => {
    removeDeletedItems(defaultData, deletedFieldArrayItems);

    stringifiedPaths.forEach((path) => {
      stringifyPath(path, submittedData);
    });

    return getDirtyFields(defaultData, submittedData);
  };

  return {
    hasDeletedItems,
    markAsDeleted,
    getDirtyValues,
    deletedFieldArrayItems,
  };
};

export { useGetDirtyFields };
