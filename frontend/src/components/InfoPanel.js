import React, { useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from "react-bootstrap";
import { useStore } from '../store';
import api from "../api";
import { showLand } from '../actions';

const InfoPanel = () => {

    const [state, dispatch] = useStore();

    const [isLoading, setLoading] = useState(false);
    const [newOwner, setNewOwner] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [values, setValues] = useState({land_id: '', owner: '', coordinates: ''});

    const handleClose = () => setShowCreate(false);
    const handleShow = () => setShowCreate(true);

    const handleClick = () => {
        if (newOwner === '') {
            return;
        }
        setLoading(true);

        api.land.changeOwner(state.land.id, newOwner).then(() => {
            setLoading(false);
            dispatch(showLand({id: state.land.id, owner: newOwner}));
        });
    };

    const handleChangeOwner = e => {
        setNewOwner(e.target.value);
    };

    const handleChangeCreate = e => {
        const {name, value} = e.target;
        setValues({...values, [name]: value});
    };

    const handleSubmitCreate = event => {
        api.land.create(values).then(() => {
            window.location.reload();
        });

        event.preventDefault();
    };

    return (
        <>
            {
                state.land.id === undefined ?
                    <div>
                        Select a land on map
                    </div>
                    :
                    <>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Land ID</th>
                                <th>Owner</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{state.land.id}</td>
                                <td>{state.land.owner}</td>
                            </tr>
                            </tbody>
                        </Table>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="New owner name"
                                aria-label="New owner name"
                                aria-describedby="basic-addon2"
                                onChange={handleChangeOwner}
                            />
                            <InputGroup.Append>
                                <Button
                                    variant="primary"
                                    disabled={isLoading}
                                    onClick={!isLoading ? handleClick : null}
                                >
                                    {isLoading ? 'Submitting transaction...' : 'Change owner'}
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </>
            }
            <Button variant="primary" size="lg" block className="force-to-bottom" onClick={handleShow}>
                Create new land
            </Button>
            <Modal show={showCreate} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add new land record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitCreate}>
                        <Form.Group>
                            <Form.Label>Land ID</Form.Label>
                            <Form.Control name="land_id" type="text" placeholder="Enter Land ID" required onChange={handleChangeCreate}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Owner</Form.Label>
                            <Form.Control name="owner" type="text" placeholder="Enter owner name" required onChange={handleChangeCreate}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Coordinates</Form.Label>
                            <Form.Control name="coordinates" as="textarea" rows="3" placeholder="Enter coordinates" required onChange={handleChangeCreate}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default InfoPanel;
