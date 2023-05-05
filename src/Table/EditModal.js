import { useState  } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EditModal = (editProps) => {
    const { TriggerBtn, nodeData, updateNodeData } = editProps;
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ userFormData, setFormData ] = useState({...nodeData});

    const updateUserFormData = (element) => {
        setFormData((prev) => ({...prev, [element.target.name]: element.target.value }));
    }

    const onSubmitUpdate = () => {
        updateNodeData(userFormData);
        setModalOpen(false);
    }

    return (
        <>
            <TriggerBtn onClick={() => {
                setModalOpen(true);
            }} />
            <Modal
                show={modalOpen}
                onHide={() => setModalOpen(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                name='email'
                                type="email"
                                placeholder="Email"
                                value={userFormData.email}
                                onChange={updateUserFormData}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Control 
                                name='name' 
                                type="text" 
                                placeholder="Name" 
                                value={userFormData.name}
                                onChange={updateUserFormData}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Control
                                name='role'
                                type="text"
                                placeholder="Role"
                                value={userFormData.role}
                                onChange={updateUserFormData}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
                    <Button onClick={onSubmitUpdate}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditModal;