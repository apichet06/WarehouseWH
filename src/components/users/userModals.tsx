
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";

interface Props {
    show: boolean,
    handleClose: () => void
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    validated: boolean
    api: string
    editId: number | string;

    editData: {
        username: string;
        firstName: string;
        lastName: string;
        dV_ID: string;
        p_ID: string;
        status: string
    };
    p_ID: string;
    dV_ID: string;
    setUsername: (value: string) => void;
    setLastName: (value: string) => void;
    setFirstName: (value: string) => void;
    setDV_ID: (value: string) => void;
    setStatus: (vlue: string) => void;
    setP_ID: (value: string) => void;
    imageUrl: string | null;
    handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    loadingOnsubmit: boolean
}


export default function UsersModals(props: Props) {
    const { show, handleClose, handleSubmit, validated, editId, api, p_ID, dV_ID, editData, setFirstName, setUsername, setLastName, setStatus, setDV_ID, setP_ID,
        imageUrl, handleFileUpload, loadingOnsubmit } = props;

    const [divisionList, setDivisionList] = useState([]);
    const [positionList, setPositionList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const divisionResponse = await axios.get(api + '/DivisionAPI');
                setDivisionList(divisionResponse.data.result);

                const positionResponse = await axios.get(api + '/PositionAPI');
                setPositionList(positionResponse.data.result);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, [api]);


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
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ชื่อล็อกอิน</Form.Label>
                                <Form.Control type="text" placeholder="Username" name="username" required defaultValue={editData.username} onChange={(e) => (setUsername(e.target.value))} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกชื่อล็อกอิน
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>รหัสผ่าน</Form.Label>
                                <Form.Control type="text" placeholder="รหัสผ่าน" required value={123456} disabled />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ชื่อ</Form.Label>
                                <Form.Control type="text" placeholder="ชื่อ" name="firstName" required defaultValue={editData.firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกชื่อจริง
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>นามสกุล</Form.Label>
                                <Form.Control type="text" placeholder="นามสกุล" name="lastName" required defaultValue={editData.lastName} onChange={(e) => setLastName(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกนามสกุล
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>แผนก</Form.Label>
                                <Form.Select name="dV_ID" required defaultValue={editData.dV_ID} onChange={(e) => setDV_ID(e.target.value)}>
                                    <option value="">เลือกแผนก</option>
                                    {divisionList.map((item: any) => (
                                        <option key={item.id} value={item.dV_ID}>{item.dV_Name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกแผนก
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ตำแหน่ง</Form.Label>
                                <Form.Select name="p_ID" required defaultValue={p_ID} onChange={(e) => setP_ID(e.target.value)}>
                                    <option value="">เลือกตำแหน่ง</option>
                                    {positionList.filter((item: any) => item.dV_ID === (dV_ID != '' ? dV_ID : editData.dV_ID)).map((item: any) => (
                                        <option key={item.id} value={item.p_ID}>{item.p_Name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกตำแหน่ง
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>สถานะ</Form.Label>
                                <Form.Select name="status" required defaultValue={editData.status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">เลือกสถานะ</option>
                                    <option value="พนักงาน">พนักงาน</option>
                                    <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                                    <option value="พ้นสถาพ">พ้นสถาพ</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณเลือกสถานะ
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formFile" className="mb-2" md={6}>
                                <Form.Label>โปรไฟล์</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleFileUpload} />
                            </Form.Group>
                            <Form.Group as={Col} md={12} className="mb-2 text-center" >

                                {imageUrl && <Image src={imageUrl} alt="Uploaded Image" width="110" thumbnail />}

                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button variant="success" type="submit" disabled={loadingOnsubmit}>{editId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"} {loadingOnsubmit && <Spinner animation="border" size="sm" />}</Button>
                            <Button variant="secondary" onClick={handleClose}> Close </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}