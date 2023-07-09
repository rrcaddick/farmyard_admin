import MUIDataTable from "@components/table/mui-data-table";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { useSnackbar } from "notistack";
import { useCallback } from "react";

const useMuiDataTable = () => {
  const cache = useApolloCache();
  const { enqueueSnackbar } = useSnackbar();

  const MuiDataTable = useCallback(
    ({ title, data, columns, options, loading, error, retry }) => (
      <MUIDataTable {...{ title, data, columns, options, loading, error, retry }} />
    ),
    []
  );

  const onRowsDelete = useCallback(
    async (deletedRows, tableData, deleteAction, restoreAction) => {
      const deletedValues = deletedRows?.data.reduce((deletedValues, { dataIndex }) => {
        return { ...deletedValues, [tableData[dataIndex].id]: tableData[dataIndex].__typename };
      }, {});

      const deletedIds = Object.keys(deletedValues);

      try {
        const { ok, deletedCount, restoreInfo } = await deleteAction(deletedIds);

        if (!ok) {
          throw new Error("Oops! Something went wrong");
        }

        if (restoreAction) {
          enqueueSnackbar(`${deletedCount} ${deletedValues[deletedIds[0]].toLowerCase()}(s) archived`, {
            variant: "undo",
            action: () => {
              restoreAction(deletedIds, restoreInfo);
            },
            onClose: () => {
              // Purge cache of deletedIds
              deletedIds.forEach((deletedId) => {
                cache.evict(`${deletedValues[deletedId]}:${deletedId}`);
              });
            },
          });
        }

        return ok;
      } catch (error) {
        enqueueSnackbar("Oops! Something went wrong", {
          variant: "retry",
          action: () => {
            // Retry delete mutation
            onRowsDelete(deletedRows, tableData, deleteAction, restoreAction);
          },
        });
        return false;
      }
    },
    [cache, enqueueSnackbar]
  );

  return {
    MuiDataTable,
    onRowsDelete,
  };
};

export { useMuiDataTable };
