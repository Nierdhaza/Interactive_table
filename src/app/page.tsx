'use client';

import Table from './components/Table';
import { tableColumns } from '@/app/data';
import { getRows } from './components/Table/utils';

import classes from './page.module.css';

/**
 * TODO: in case if table is on separte page
 * use 
 * import dynamic from 'next/dynamic';

const ClientTable = dynamic(() => import('./Table'), {
  ssr: boolean,
});
 */


export default function TableWrapper() {

  return (
    <>
      <h1>Interactive table</h1>
      <main className={classes.page}>
        <Table
          columns={tableColumns}
          getRows={getRows}
          stickyHeader
          //  getColumnKey={(row, column) => row[column.key] ?? `${column.key}-${row.id ?? Math.random()}`} 
          // decision for writing this check in function was because when I was adding some row data 
          // I had a scenario when Severity and Priory had same statuses: high | medium | low. Better option: should be handled with unique row data
          getColumnKey={(row, column) => row[column.key] ?? `${column.key}-${row.id ?? Math.random()}`}
        />
      </main>
    </>
  );
}
