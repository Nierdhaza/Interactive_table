import { TableRow, tableRows } from "@/app/data";

export interface TableConfig<T> {
    page: number;
    sortField: keyof T | '';
    isAscending: boolean;
    filters: { [key in keyof T]?: string };
} 

export type GetRowsType<T> = (tableConfig: TableConfig<T>) => Promise<{ rows: T[], hasMore: boolean }>;


export const getRows = async () => {
    // const responseData: TableRow[] = await new Promise(resolve => resolve(tableRows));
    const responseData: TableRow[] = await new Promise(resolve => setTimeout(() => resolve(tableRows), 1000));
    return responseData;
  };

export const getSelectedRow = async (id: number) => {
  // backend call for separate item
  const responseItem: TableRow | undefined = await new Promise(resolve => {
    const item = tableRows.find(row => row.id === id);
    resolve(item);
  });

  return responseItem;
}
