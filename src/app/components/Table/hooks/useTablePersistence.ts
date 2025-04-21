import {  useLayoutEffect } from 'react';

export const useTablePersistence = <T>({
    setRows,
    setFilters,
    setSortField,
    setIsAscending,
    setPage,
    fetchData,
}: {
    setRows: (rows: T[]) => void;
    setFilters: React.Dispatch<React.SetStateAction<{ [key in keyof T]?: string }>>;
    setSortField: React.Dispatch<React.SetStateAction<keyof T | ''>>;
    setIsAscending: React.Dispatch<React.SetStateAction<boolean>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    fetchData?: (params: any) => Promise<void>;
}) => {
    useLayoutEffect(() => {
        const saved = localStorage.getItem('my-table');
        const savedRow = localStorage.getItem('selectedRow');

        if (!saved) {
            fetchData?.({ reset: true });
            return;
        }

        const {
            rows: LSrows,
            filters: LSfilters,
            sortField: LSsortField,
            isAscending: LSisAscending,
            page: LSpage,
            timestamp,
        } = JSON.parse(saved);

        const isFresh = timestamp && Date.now() - timestamp < 5 * 60 * 1000;

        if (isFresh && LSrows?.length) {
            setRows(LSrows);
            setFilters(LSfilters);
            setSortField(LSsortField);
            setIsAscending(LSisAscending);
            setPage(LSpage);

            if (savedRow) {
                requestAnimationFrame(() => {
                    const el = document.getElementById(`row-${savedRow}`);
                    if (el) {
                        el.focus();
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }
        } else {
            fetchData?.({
                reset: true,
                currentFilters: LSfilters,
                currentSortField: LSsortField,
                currentIsAscending: LSisAscending,
                currentPage: LSpage,
            }).then(() => {
                setFilters(LSfilters);
                setSortField(LSsortField);
                setIsAscending(LSisAscending);
                setPage(LSpage);
            });
        }
    }, []);
}