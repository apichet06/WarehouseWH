/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

interface Props {
    show: boolean,
    handleClose: () => void
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    validated: boolean
    api: string
    editId: number | string;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    user: {
        username: string;
        firstName: string;
        lastName: string;
        imageFile: string;
        dV_ID: string;
        p_ID: string;
        status: string

    };
    setDV_ID: (newValue: string) => void;
    setP_ID: (newValue: string) => void;
}
export default function UsersModals(props: Props) {
    const { show, handleClose, handleSubmit, validated, editId, api, user, handleInputChange, setDV_ID, setP_ID } = props;

    const [divisionList, setDivisionList] = useState([]);
    const [positionList, setPositioList] = useState([]);
    const [filteredPositionList, setFilterPositionList] = useState([]);

    // เพิ่ม state สำหรับตำแหน่งที่เลือก
    const fetchData = useCallback(async () => {

        try {
            const DivisionResponse = await axios.get(`${api}/DivisionAPI`);
            if (DivisionResponse.status === 200) {
                setDivisionList(DivisionResponse.data.result)

            }

            const PositionResponse = await axios.get(`${api}/PositionAPI`);
            if (PositionResponse.status === 200) {
                setPositioList(PositionResponse.data.result)
                if (editId) {
                    const filteredPositions = PositionResponse.data.result.filter((p: any) => p.dV_ID === user.dV_ID);

                    setFilterPositionList(filteredPositions);
                }
            }
        } catch (error) {
            console.log(error);
        }

    }, [api, editId, user])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const handleDivisionChange = (e: ChangeEvent<HTMLSelectElement>) => {

        const selectedDivisionId = e.target.value;
        setDV_ID(selectedDivisionId);

        const filteredPositions = positionList.filter((e: any) => e.dV_ID === selectedDivisionId);
        setFilterPositionList(filteredPositions);

    };

    const handlePositionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setP_ID(e.target.value);
    };


    return (
        <>
            <Modal
                show={show}
                size="lg"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{editId ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มข้อมูลสมาชิก"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6">
                                <Form.Label>ชื่อล็อกอิน</Form.Label>
                                <Form.Control type="text" placeholder="Username" name="username" required defaultValue={user.username} onChange={handleInputChange} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกชื่อล็อกอิน
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>รหัสผ่าน</Form.Label>
                                <Form.Control type="text" placeholder="รหัสผ่าน" required value={123456} disabled onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>ชื่อ</Form.Label>
                                <Form.Control type="text" placeholder="ชื่อ" name="firstName" required defaultValue={user.firstName} onChange={handleInputChange} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกชื่อจริง
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>นามสกุล</Form.Label>
                                <Form.Control type="text" placeholder="นามสกุล" name="lastName" required defaultValue={user.lastName} onChange={handleInputChange} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกนามสกุล
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>แผนก</Form.Label>
                                <Form.Select name="dV_ID" required defaultValue={user.dV_ID} onChange={handleDivisionChange}>
                                    <option value="">เลือกแผนก</option>
                                    {divisionList.map((item: any) => (
                                        <option key={item.id} value={item.dV_ID}>{item.dV_Name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกแผนก
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>ตำแหน่ง</Form.Label>
                                <Form.Select name="p_ID" required defaultValue={user.p_ID} onChange={handlePositionChange}>
                                    <option value="">เลือกตำแหน่ง</option>
                                    {filteredPositionList.map((item: any) => (
                                        <option key={item.id} value={item.p_ID}>{item.p_Name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกตำแหน่ง
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>สถานะ</Form.Label>
                                <Form.Control type="text" placeholder="สถานะ" name="status" required defaultValue={user.status} onChange={handleInputChange} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกนามสกุล
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button variant="success" type="submit" >{editId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</Button>
                            <Button variant="secondary" onClick={handleClose}> Close </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}