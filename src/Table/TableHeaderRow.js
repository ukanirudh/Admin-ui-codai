import { memo } from 'react';

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
                    tableHeader.map((curHeaderKey, index) => <th key={`${curHeaderKey}-${index}`}>{curHeaderKey}</th>)
                }
                <th>
                    Actions
                </th>
            </tr>
        </thead>
    )
}

const MemoizedHeader = memo(TableHeaderRow);

export default MemoizedHeader;