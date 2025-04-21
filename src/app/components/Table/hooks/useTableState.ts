import { useState, useLayoutEffect, useCallback } from "react";

import { debounce } from "@/app/utils";
import { tableSorting, tableFiltering } from "../utils";

export const useTableState = <T>(
    getRows: () => Promise<T[]>,
    pageSize: number
) => {
    const [rows, setRows] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState<keyof T | ''>('');
    const [isAscending, setIsAscending] = useState(true);
    const [filters, setFilters] = useState<{ [key in keyof T]?: string }>({});
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // TODO: separate local storage logic
    useLayoutEffect(() => {
        const saved = localStorage.getItem('my-table');
        const savedRow = localStorage.getItem('selectedRow');

        if (!saved) {
            requestTableData({ reset: true });
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
            requestTableData({
                reset: true,
                currentFilters: LSfilters,
                currentIsAscending: LSisAscending,
                currentPage: LSpage,
                currentSortField: LSsortField,
            }).then(() => {
                setFilters(LSfilters);
                setSortField(LSsortField);
                setIsAscending(LSisAscending);
                setPage(LSpage);
            });
        }
    }, []);

    const requestTableData = useCallback(
        async ({
            reset = false,
            currentFilters = filters,
            currentSortField = sortField,
            currentIsAscending = isAscending,
            currentPage = page,
        }: {
            reset?: boolean;
            currentFilters?: typeof filters;
            currentSortField?: typeof sortField;
            currentIsAscending?: typeof isAscending;
            currentPage?: number;
        }) => {
            if (loading) return;
            setLoading(true);

            const actualPage = reset ? 1 : currentPage;
            const res = await getRows();

            const array = tableFiltering(res, currentFilters);

            if (currentSortField) {
                tableSorting(array, currentSortField, currentIsAscending);
            }

            const start = (actualPage - 1) * pageSize;
            const end = start + pageSize;
            const pageRows = array.slice(start, end);

            setRows((prev) => (reset ? pageRows : [...prev, ...pageRows]));
            setHasMore(end < array.length);
            setPage(reset ? 2 : actualPage + 1);
            setLoading(false);
        },
        [loading]
    );

    const debouncedFetchData = useCallback(
        debounce(requestTableData, 500),
        [requestTableData]
    );



    const handleSort = (field: keyof T) => {
        const newSortDir = sortField === field ? !isAscending : true;
        setSortField(field);
        setIsAscending(newSortDir);
        requestTableData({
            reset: true,
            currentSortField: field,
            currentIsAscending: newSortDir,
        });
    };

    const handleFilterChange = (field: keyof T, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        debouncedFetchData({
            reset: true,
            currentFilters: newFilters,
        });
    };

    return {
        rows,
        filters,
        sortField,
        isAscending,
        page,
        hasMore,
        loading,
        requestTableData,
        handleSort,
        handleFilterChange
    };
}
