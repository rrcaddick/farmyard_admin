const onRowsDelete = async (deletedRows, data, deleteMutation, restoreMutation, cache) => {
  const deletedValues = deletedRows?.data.reduce((deletedValues, { dataIndex }) => {
    return { ...deletedValues, [data[dataIndex].id]: data[dataIndex].__typename };
  }, {});

  const deletedIds = Object.keys(deletedValues);

  try {
    const { ok, deletedCount } = await deleteMutation({
      variables: { deletedIds },
      optimisticResponse: {
        deleteMutation: {
          ok: true,
          deletedCount: deletedIds.length,
          deletedIds,
        },
      },
    });

    if (!ok) {
      throw new Error("Oops! Something went wrong");
    }

    enqueueSnackbar(`${deletedCount} group(s) archived`, {
      variant: "undo",
      action: () => {
        restoreMutation({
          variables: { deletedIds },
          optimisticResponse: {
            restoreMutation: [...cache.read(READ_GROUPS, { groupIds: deletedIds })],
          },
        });
      },
      onClose: () => {
        // Purge cache of deletedIds
        deletedIds.forEach((deletedId) => {
          cache.evict(`${deletedValues[deletedId].__typename}:${deletedId}`);
        });
      },
    });

    return ok;
  } catch (error) {
    enqueueSnackbar("Oops! Something went wrong", {
      variant: "retry",
      action: () => {
        // Retry delete mutation
        onRowsDelete(deletedRows, data, deleteMutation);
      },
    });
    return false;
  }
};
