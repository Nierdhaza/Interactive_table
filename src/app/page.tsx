'use client';

import Table from './components/Table';
import { tableColumns } from '@/app/data';
import { getRows } from './components/Table/utils';

import classes from './page.module.css';

export default function TableWrapper() {

  return (
    <div className={classes.page}>
      <Table
        columns={tableColumns}
        getRows={getRows} 
        stickyHeader
        getColumnKey={(row, column) => row[column.key] ?? `${column.key}-${row.id ?? Math.random()}`}
      />
    </div>
  );
}
