import { ReactNode } from "react";

import { type TableColumn } from "@/app/data";

export interface TableProps<T> {
    columns: TableColumn<T>[];
    stickyHeader?: boolean;
    noRowsChildren?: ReactNode;
    pageSize?: number;
    getRowKey?: (row: T) => string | number;
    getColumnKey?: (row: T, column: TableColumn<T>) => string | number;
    getRows: () => Promise<T[]>
};
