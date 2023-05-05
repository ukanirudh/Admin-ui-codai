import Button from 'react-bootstrap/Button';
import EditModal from './EditModal';

const TableRow = (props) => {
    const { tableRows, updateSeletedNodes, updateNodeData, selectedNodes, deleteSingleNode } = props;
    let filteredRows = tableRows;

    const onSingleNodeSelect = (node, nodeId) => {
        const isSelected = node.target.checked;
        updateSeletedNodes([nodeId], isSelected)
    }

    return (
        <>
            {
                filteredRows.map((rowData) => {
                    const { id, name, email, role } = rowData;
                    return (
                        <tr className={selectedNodes[id] ? 'row-selected' : ''} key={id}>
                            <td><input type="checkbox" checked={!!selectedNodes[id]} onChange={(node) => onSingleNodeSelect(node, id)}/></td>
                            {/* <td>{id}</td> */}
                            <td>{name}</td>
                            <td>{email}</td>
                            <td>{role}</td>
                            <td>
                                <div className="actions-row">
                                    <EditModal
                                        nodeData={rowData}
                                        updateNodeData={updateNodeData}
                                        TriggerBtn={({onClick}) => {
                                            return (
                                                <Button
                                                    className="btn-space"
                                                    variant="outline-primary"
                                                    onClick={onClick}
                                                >
                                                    Edit
                                                </Button>
                                            )
                                        }}
                                    />
                                    <Button
                                        className="btn-space"
                                        variant="outline-danger"
                                        onClick={() => deleteSingleNode(id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )
                })
            }
        </>
    )
}

export default TableRow;