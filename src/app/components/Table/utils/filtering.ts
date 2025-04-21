export const tableFiltering = <T>(tableData: T[], filters: { [key in keyof T]?: string }) => {
    return tableData.filter(item =>
        Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const cell = String(item[key as keyof T]).toLowerCase();
            return cell.includes((value as string).toLowerCase());
        })
    );
}