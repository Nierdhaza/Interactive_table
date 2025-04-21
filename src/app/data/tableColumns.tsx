import { JSX } from 'react';
import { TableRow } from './tableRows'

export interface CustomHeaderProps<T> {
  column: TableColumn<T>;
  isSorted: boolean;
  isAscending: boolean;
  sortHandler: () => void;
  filterValue?: string;
  onFilterChange: (value: string) => void;
}

export interface TableColumn<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    style?: React.CSSProperties;
    render?: (row: T) => JSX.Element;
    customHeader?: (props: CustomHeaderProps<T>) => JSX.Element;
}

export const tableColumns: TableColumn<TableRow>[] = [
    { key: 'id', label: 'NO.', sortable: true },
    {
      key: 'issueType',
      label: 'ISSUE TYPE',
      sortable: true,
      style: { backgroundColor: 'rgb(124, 61, 61)' },
      render: (row) => <>{row.issueType}</>,
      // customHeader: () => <>HEADER</>
    },
    { key: 'severity', label: 'SEVERITY', sortable: true },
    { key: 'component', label: 'COMPONENT', sortable: true },
    { key: 'selector', label: 'SELECTOR', sortable: true, filterable: true },
    { key: 'url', label: 'URL', sortable: true, filterable: true },
  
    // More columns
    // { key: 'status', label: 'STATUS', sortable: true },
    // { key: 'priority', label: 'PRIORITY', sortable: true },
    // { key: 'reportedBy', label: 'REPORTED BY', sortable: true },
    // { key: 'createdAt', label: 'CREATED AT', sortable: true },
    // { key: 'lastUpdated', label: 'LAST UPDATED', sortable: true },
  ];
  