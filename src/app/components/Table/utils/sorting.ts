export const tableSorting = <T>(
  tableData: T[],
  sortField: keyof T,
  isAscending: boolean
) => {
  return tableData.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return isAscending
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return isAscending
      ? aVal > bVal ? 1 : -1
      : aVal > bVal ? -1 : 1;
  });
};
