import { useEffect, useState, useCallback } from "react";
import Table from 'react-bootstrap/Table';
import TableRow from './TableRow';
import Pagination from './Pagination';
import MemoizedHeader from './TableHeaderRow';
import Button from 'react-bootstrap/Button';
import { getPageStartIndex, getPageEndIndex, getTotalPages } from './utils';

const TableGrid = (tableProps) => {
    const { tableRows, tableHeader, updateRows } = tableProps;
    const [ selectedNodes, setSelectedNodes ] = useState({});
    const [ paginatedData, updatePaginatedData ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);

    useEffect(() => {
        const maxPage = getTotalPages(tableRows.length);
        /* if previous page was greater than max results available, update to max page available */
        if (tableRows.length > 0 && currentPage > maxPage) {
            setCurrentPage(maxPage)
        } else {
            const startInd = getPageStartIndex(currentPage);
            const endIndex = getPageEndIndex(currentPage);
            updatePaginatedData(tableRows.slice(startInd, endIndex));
        }
    }, [tableRows, currentPage]);
    
    const setPaginatedData = (curPageNum) => {
        clearAllSelection();
        setCurrentPage(curPageNum);
    }

    const updateSeletedNodes = useCallback((nodeIds, isSelected) => {
        let curNodes = {...selectedNodes};
        nodeIds.forEach((curId) => {
            curNodes = {...curNodes, [curId]: isSelected};
        });

        setSelectedNodes(curNodes);
    }, [selectedNodes]);
    
    const selectAll = (isChecked) => {
        const nodeIds = paginatedData.map(({id}) => id);
        updateSeletedNodes(nodeIds, isChecked)
    }

    const clearAllSelection = () => {
        setSelectedNodes({});
    }

    const deleteAllSelected = () => {
        const updatedList = tableRows.filter(({ id }) => {
            return !selectedNodes[id]
        });
        updateRows(updatedList);
        clearAllSelection();
    }

    const deleteSingleNode = useCallback((nodeID) => {
        const updatedList = tableRows.filter(({ id }) => id !== nodeID);
        updateRows(updatedList);
    }, [tableRows]);

    const updateNodeData = useCallback((updatedData) => {
        const foundIndex = tableRows.findIndex((node) => node.id === updatedData.id);
        if (foundIndex >= 0) {
            const toBeUpdatedTableRows = [...tableRows];
            toBeUpdatedTableRows.splice(foundIndex, 1, updatedData);
            updateRows(toBeUpdatedTableRows);
        }
    }, [tableRows]);

    return (
        <div>
            <Table bordered>
                <MemoizedHeader
                    tableHeader={tableHeader}
                    selectAllFromPage={selectAll}
                />
                <tbody>
                    <TableRow
                        tableRows={paginatedData}
                        updateSeletedNodes={updateSeletedNodes}
                        updateNodeData={updateNodeData}
                        deleteSingleNode={deleteSingleNode}
                        selectedNodes={selectedNodes}
                    />
                </tbody>
            </Table>
            <div className="table-footer">
                <div>
                    { Object.values(selectedNodes).filter((selectedFlag) => !!selectedFlag).length > 0  
                    ? <Button variant="danger" onClick={deleteAllSelected} >Delete Selected</Button> : null }
                </div>
                <Pagination
                    totalResults={tableRows.length}
                    currentPage={currentPage}
                    setPaginatedData={setPaginatedData}
                />
            </div>
        </div>
    )
}

export default TableGrid;