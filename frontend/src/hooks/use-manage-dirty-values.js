import { useMemo, useState, useCallback } from "react";
import { createDirtyFields, getDirtyValues } from "@utils/form";
import _ from "lodash";

const useManageDirtyValues = () => {
  const [deletedFieldArrayItems, setDeletedFieldArrayItems] = useState({});
  const hasDeletedItems = useMemo(() => Object.keys(deletedFieldArrayItems).length > 1, [deletedFieldArrayItems]);

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
          return deletedFieldArrays[deletedFieldArray]?.some((deletedItem) => deletedItem.id !== fieldArrayItem.id);
        });
      }

      return _defaultValues;
    },
    [deletedFieldArrayItems]
  );

  const getDirtyData = useCallback(
    (defaultValues, submittedValues, dirtyFieldsModifier, { withId = false }) => {
      const _defaultValues = removeDeletedFieldArrayItems(defaultValues);
      const dirtyFields = createDirtyFields(
        _defaultValues,
        dirtyFieldsModifier ? dirtyFieldsModifier(submittedValues) : submittedValues
      );
      const dirtyValues = getDirtyValues(dirtyFields, submittedValues, { withId });
      return _.merge({ ...dirtyValues, id: submittedValues.id }, deletedFieldArrayItems);
    },
    [removeDeletedFieldArrayItems, deletedFieldArrayItems]
  );

  const hookValue = useMemo(
    () => ({
      markAsDeleted,
      getDirtyData,
      hasDeletedItems,
    }),
    [markAsDeleted, getDirtyData, hasDeletedItems]
  );

  return hookValue;
};

export { useManageDirtyValues };
