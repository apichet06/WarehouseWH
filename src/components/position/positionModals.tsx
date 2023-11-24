/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { FormEvent, useCallback, useEffect, useState, } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";


interface Props {
    api: string;
    handleClose: () => void;
    show: boolean;
    fetchData: () => void;
    validated: boolean;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    setDV_ID: (id: string) => void;
    setpName: (name: string) => void;
    p_Name: string;
    dV_ID: string;
    editId: string;
    loadingOnsubmit: boolean;
}

export default function PositionModals(props: Props) {
    const { api, show, handleClose, validated, handleSubmit, setDV_ID, setpName, p_Name, dV_ID, editId, loadingOnsubmit } = props;

    const [division, setDivision] = useState([]);

    const fetchDataDivisoin = useCallback(async () => {
        try {
            const response = await axios.get(`${api}/DivisionAPI`);
            setDivision(response.data.result);
        } catch (error) {
            console.error("Error fetching division data", error);
        }
    }, [api]);

    useEffect(() => {
        fetchDataDivisoin();
    }, [fetchDataDivisoin]);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? "แก้ไขตำแหน่งงาน" : "เพิ่มตำแหน่งงาน"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" className="mb-2">
                                <Form.Label>ชื่อแผนก</Form.Label>
                                <Form.Select
                                    aria-label="Default select example"
                                    name="dV_ID"
                                    required
                                    onChange={(e) => setDV_ID(e.target.value)}
                                    value={dV_ID}
                                >
                                    <option value="">เลือกแผนก</option>
                                    {division.map((d: any) => (
                                        <option key={d.id} value={d.dV_ID}>
                                            {d.dV_Name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณาเลือกแผนก!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="12">
                                <Form.Label>ชื่อตำแหน่ง</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="p_Name"
                                    placeholder="ชื่อตำแหน่ง"
                                    defaultValue={p_Name}
                                    onChange={(e) => setpName(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกชื่อตำแหน่ง!
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={loadingOnsubmit}>
                                {editId ? "แก้ไข" : "เพิ่ม"} {loadingOnsubmit && <Spinner animation="border" size="sm" />}
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                ปิด
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
