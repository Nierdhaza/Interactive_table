'use client';

import React, {
    ReactNode,
    useState,
    useRef
} from 'react';
import { useRouter } from 'next/navigation';
import SortIcon from './SortIcon';
import { TableProps } from './Table.interfaces';
import { useInfiniteScroll, useTableState } from './hooks';

import classes from './Table.module.css';

export default function Table<T>({
    columns,
    stickyHeader,
    noRowsChildren = <>No rows available</>,
    pageSize = 30,
    getRowKey = (row) => (row as { id: string }).id,
    getColumnKey = (row, column) => row[column.key] as string | number,
    getRows,
}: TableProps<T>) {
    /* TODO: table should not know about routing
    * In this case we use routing logic and localStorage logic in handleRow select
    * to TableProps add onRowClick function and move this router 
    * and local storage logic out of this component
    */
    const router = useRouter();

    const {
        requestTableData,
        handleFilterChange,
        handleSort,
        filters,
        hasMore,
        isAscending,
        page,
        rows,
        sortField,
        loading,
    } = useTableState(getRows, pageSize);

    const [selectedRow, setSelectedRow] = useState<string | number>('');
    
    // In case we use infiniteScroll table (other options are: 'clientSide' | 'serverSide')
    // TODO: provide a function which according to options 'clientSide' | 'serverSide' | 'infiniteScroll'
    // returns hooks with provided logic
    const observerRef = useRef<HTMLTableRowElement>(null);
    useInfiniteScroll({
        ref: observerRef,
        hasMore,
        loading,
        callback: () => {
            requestTableData({
                reset: false,
                currentFilters: filters,
                currentSortField: sortField,
                currentIsAscending: isAscending,
                currentPage: page,
            });
        },
    });

    const handleRowSelect = (row: T) => {
        const rowKey = getRowKey(row);
        setSelectedRow(rowKey);
        // TODO: move below logic to separate function
        localStorage.setItem('selectedRow', rowKey.toString());
        localStorage.setItem(
            'my-table',
            JSON.stringify({
                rows,
                filters,
                sortField,
                isAscending,
                page,
                timestamp: Date.now(),
            })
        )
        // TODO: add caching of pages fetching logic
        router.push(`/table-item-details/${rowKey}`);
    };

    return (
        <table className={classes.table} role="table">
            <thead className={stickyHeader ? classes.stickyHeader : ''}>
                <tr role="row">
                    {columns.map((column) => {
                        const isSortingActive = sortField === column.key;

                        if (column.customHeader) {
                            return (
                                <th key={column.key as string}>
                                    {column.customHeader({
                                        column,
                                        isSorted: isSortingActive,
                                        isAscending,
                                        sortHandler: () => handleSort(column.key),
                                        filterValue: filters[column.key],
                                        onFilterChange: (value) => handleFilterChange(column.key, value),
                                    })}
                                </th>
                            );
                        }

                        return (
                            <th
                                key={column.key as string}
                                role="columnheader"
                                className={isSortingActive ? classes.sorted : ''}
                                style={column.style}
                            >
                                <span>{column.label}</span>
                                {column.sortable && (
                                    <button onClick={() => handleSort(column.key)} aria-label={column.label}>
                                        <SortIcon
                                            active={isSortingActive}
                                            ascending={isAscending}
                                        />
                                    </button>
                                )}
                                {column.filterable && (
                                    <input
                                        type="text"
                                        className="filter-input"
                                        value={filters[column.key] || ''}
                                        onChange={(e) =>
                                            handleFilterChange(column.key, e.target.value)
                                        }
                                        aria-label={`${column.label}-filter`}
                                    />
                                )}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {rows.length ? (
                    <>
                        {rows.map((rowData, idx) => {
                            const rowKey = getRowKey(rowData);
                            const isSelected = rowKey === selectedRow;
                            const isLast = idx === rows.length - 1;

                            return (
                                <tr
                                    id={`row-${rowKey}`}
                                    key={rowKey}
                                    ref={isLast ? observerRef : null}
                                    onClick={(e) => handleRowSelect(rowData)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRowSelect(rowData)}
                                    className={isSelected ? classes.selected : ''}
                                    tabIndex={0}
                                    aria-selected={isSelected}
                                    role="row"
                                >
                                    {columns.map((column) => (
                                        <td key={getColumnKey(rowData, column)} role="cell">
                                            {column.render?.(rowData) ??
                                                (rowData[column.key] as ReactNode) ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {loading && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    // TODO: should be moved to css
                                    // TODO: use one component for loader
                                    style={{ textAlign: 'center', padding: '20px' }}
                                >
                                    {/*TODO: Add loader JSX to TableProps */}
                                    Loading
                                </td>
                            </tr>
                        )}
                    </>
                ) : (
                    <tr>
                        <td
                            colSpan={columns.length}
                            // TODO: should be moved to css
                            style={{ textAlign: 'center', padding: '20px' }}
                        >
                             {/*TODO: Add loader JSX to TableProps */}
                            {loading ? 'Loading...' : noRowsChildren}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
