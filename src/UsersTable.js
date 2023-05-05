import { useEffect, useMemo, useState, useCallback, memo } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const PAGE_SIZE = 10;

const Pagination = (props) => {
    const { totalResults, setPaginatedData } = props;
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    const pages = [];

    for(let i = 1; i <= totalPages; i++) {
        pages.push(<Col key={i}><Button variant="secondary" onClick={() => setPaginatedData(i)}>{i}</Button></Col>)   
    }

    return (
        <div className="page-btn-nav">
            <Row> {pages} </Row>
        </div>
    )
}

const TableRow = (props) => {
    const { tableRows, updateSeletedNodes, selectedNodes } = props;
    let filteredRows = tableRows;

    const onSingleNodeSelect = (node, nodeId) => {
        const isSelected = node.target.checked;
        updateSeletedNodes([nodeId], isSelected)
    }

    return (
        <>
            {
                filteredRows.map((rowData) => {
                    return (
                        <tr className={selectedNodes[rowData.id] ? 'row-selected' : ''} key={rowData.id}>
                            <td><input type="checkbox" checked={selectedNodes[rowData.id]} onChange={(node) => onSingleNodeSelect(node, rowData.id)}/></td>
                            <td>{rowData.id}</td>
                            <td>{rowData.name}</td>
                            <td>{rowData.email}</td>
                            <td>{rowData.role}</td>
                            <td>
                                <div className="actions-row">
                                    <Button className="btn-space" variant="outline-primary">Edit</Button>
                                    <Button className="btn-space" variant="outline-danger">Delete</Button>
                                </div>
                            </td>
                        </tr>
                    )
                })
            }
        </>
    )
}

const TableHeaderRow = (props) => {
    const { tableHeader, selectAllFromPage } = props;
    const selectAllFromCurrentPage = (node) => {
        selectAllFromPage(node.target.checked);
    }

    return (
        <thead>
            <tr>
                <th>
                    <input type="checkbox" onClick={selectAllFromCurrentPage} />
                </th>
                {
                    tableHeader.map((curHeaderKey, index) => {
                        return (
                            <th key={`${curHeaderKey}-${index}`}>{curHeaderKey}</th>
                        )
                    })
                }
                <th>
                    Actions
                </th>
            </tr>
        </thead>
    )
}

const MemoizedHeader = memo(TableHeaderRow);

const TableGrid = (tableProps) => {
    const { tableRows, tableHeader, updateRows } = tableProps;
    const [ selectedNodes, setSelectedNodes ] = useState({});
    const [ paginatedData, updatePaginatedData ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);

    useEffect(() => {
        const startInd = (currentPage-1) * PAGE_SIZE;
        const endIndex = (currentPage) * PAGE_SIZE;
        updatePaginatedData(tableRows.slice(startInd, endIndex));
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
    }

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
                    setPaginatedData={setPaginatedData}
                />
            </div>
        </div>
    )
}

const UsersTable = () => {
    const [usersList, setUsersList] = useState([]);
    const [searchedResults, setSearchedResults] = useState([]);

    useEffect(() => {
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then((response) => {
            if(response.ok) {
                return response.json()
            } else {
                return new Error(response.json())
            }
        })
        .then((response) => {
            setUsersList(response);
        })
        .catch((error) => {

        })
    }, []);

    useEffect(() => {
        if (usersList.length > 0) {
            setSearchedResults(usersList);
        }
    }, [usersList]);

    const tableHeader = useMemo(() => {
        if (usersList.length > 0) {
            return Object.keys(usersList[0]);
        } else {
            return [];
        }
    }, [usersList]);

    const searchList = (element) => {
        const filteredRows = usersList.filter((curRow) => {
            const foundName = curRow.name.toLowerCase().includes(element.target.value.toLowerCase());
            const foundEmail = curRow.email.toLowerCase().includes(element.target.value.toLowerCase());
            const foundRole = curRow.role.toLowerCase().includes(element.target.value.toLowerCase());
            return foundEmail || foundRole || foundName;
        });
        setSearchedResults(filteredRows);
    }

    return (
        <>
            <Form.Control
                type="text"
                placeholder="Search by name, email or role"
                onChange={searchList}
            />
            <br />
            <TableGrid 
                tableRows={searchedResults}
                tableHeader={tableHeader}
                updateRows={setUsersList}
            />
        </>
    )
}

export default UsersTable;