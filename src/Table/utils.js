const SKIP_HEADER = ['id'];
export const PAGE_SIZE = 10;

export const getPageStartIndex = (currentPage) => (currentPage-1) * PAGE_SIZE;
export const getPageEndIndex = (currentPage) => (currentPage) * PAGE_SIZE;
export const getTotalPages = (totalResults) => Math.ceil(totalResults / PAGE_SIZE);

export const searchText = (text1, text2) => text1.toLowerCase().includes(text2.toLowerCase());

export const getHeader = (allColumns) => allColumns.filter((curColumn) => !SKIP_HEADER.includes(curColumn));