import { useState, useLayoutEffect, useCallback } from "react";

import { debounce } from "@/app/utils";
import { tableSorting, tableFiltering } from "../utils";

export const useTableState = <T>(
    getRows: () => Promise<T[]>,
    pageSize: number
    /**
     * tableOptions: {
     *  rowsModel: "clientSide" | "serverSide" | "infiniteScroll"
     *  anotherOptions: copy, columns sizing, editing: etc
     * }
     */
) => {
    const [rows, setRows] = useState<T[]>([]);

    // TODO: we should have more sorting criterias. Not only ASC and DESC.
    const [sortField, setSortField] = useState<keyof T | ''>('');
    const [isAscending, setIsAscending] = useState(true);
    // TODO: we should have filtering configs as in agGrid (ex. 'agDateColumnFilter' | 'agSetColumnFilter' etc.)
    const [filters, setFilters] = useState<{ [key in keyof T]?: string }>({});
    // TODO: this state logic is related to infiniteScroll table model so it likely should used with useInfiniteScrollHook
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // TODO: separate local storage logic
    // TODO: should have some kind of api like on(Grid|Table)Ready in which we can use this logic for getting
    // data from localStorage (LS)
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
            // TODO: in case we move useInfiniteScroll with related variables out of this hook
            // here we should likely have a callback for setting scroll paramethers
            setPage(LSpage);

            if (savedRow) {
                // TODO: add clearing of cancelAnimationFrame on cleanup function
                // TODO: check if possible to get rid of function below as it is kind of workaround
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
    /**
     * TODO: in case we have different data models 'clientSide' | 'serverSide' | 'infiniteScroll'
     * this function should be different as well for different data models
     * because now it handles only infinite scroll scenario
     * 
     * ex.
     * const requestTableData = useCallback(async () => {
            const data = await fetchDataByRowModel(tableOptions.rowsModel)
     * 
     */

    const requestTableData = useCallback(
        async ({
            reset = false,
            currentFilters = filters,
            currentSortField = sortField,
            currentIsAscending = isAscending,
            currentPage = page,
        }: {
            // TODO: move to separate interface
            reset?: boolean;
            currentFilters?: typeof filters;
            currentSortField?: typeof sortField;
            currentIsAscending?: typeof isAscending;
            currentPage?: number;
        }) => {
            if (loading) return;
            setLoading(true);

            const actualPage = reset ? 1 : currentPage;
            // TODO: rename variables
            // TODO: improve getRowsFunction to avoid fetching all data for each request. We need to fetch parts
            // TODO: handle failed scenario and set proper table state 
            const res = await getRows();

            //TODO: according to different filter config 'agDateColumnFilter' | 'agSetColumnFilter' or custom filter function
            // we will have different functions to filter
            // ex. const array = tableFiltering(res, currentFilters, filterConfig);
            const array = tableFiltering(res, currentFilters);

            if (currentSortField) {
                tableSorting(array, currentSortField, currentIsAscending);
            }
            /**
             * 
            // TODO: infinite scroll logic likely should be not in this hook
            // here should be a function calculating pagination or scroll
            rows = getPaginationConfig() or rows = getScrollConfig();
            const rowsToRender = paginationStrategy(allRows, page, pageSize) or scrollStrategy
            */

            const start = (actualPage - 1) * pageSize;
            const end = start + pageSize;
            const pageRows = array.slice(start, end);

            // infinite scroll logic
            setHasMore(end < array.length);
            setPage(reset ? 2 : actualPage + 1);

            setRows((prev) => (reset ? pageRows : [...prev, ...pageRows]));
            setLoading(false);
        },
        [loading]
    );

    // TODO: This should be configurable (in some cases data sets of table could be small and could be easily filtered without debounce)
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
