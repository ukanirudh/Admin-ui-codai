import { useEffect, useMemo, useState } from "react";
import Form from 'react-bootstrap/Form';
import TableGrid from './TableGrid';
import { searchText, getHeader } from './utils';

const TableComponent = () => {
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
            return getHeader(Object.keys(usersList[0]));
        } else {
            return [];
        }
    }, [usersList]);

    const searchList = (element) => {
        const targetValue = element.target.value;
        const filteredRows = usersList.filter((curRow) => {
            const foundName = searchText(curRow.name, targetValue);
            const foundEmail = searchText(curRow.email, targetValue);
            const foundRole = searchText(curRow.role, targetValue);
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

export default TableComponent;
