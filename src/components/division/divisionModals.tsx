/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useState, FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface DivisionModalProps {
    api: string;
    show: boolean;
    handleClose: () => void;
    editBt: string;
    divisionName?: string;
    setDivisionName: (newValue: string) => void;
    fetchData: () => void;
}

export default function DivisionModal(props: DivisionModalProps) {
    const { api, show, handleClose, editBt, divisionName, setDivisionName, fetchData } = props;
    const [validated, setValidated] = useState(false);
    // เพิ่ม state สำหรับเก็บชื่อแผนก
    //   console.log(api);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            // ทำบันทึกหรือแก้ไขแผนกของคุณที่นี่
            if (editBt) {
                console.log(editBt);

                // ส่งค่า divisionName ไปยังฟังก์ชันแก้ไข
                try {
                    const response = await axios.put(`${api}/DivisionAPI/${editBt}`, { DV_name: divisionName },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: response.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        fetchData();

                    } else {
                        console.log("รหัส HTTP ไม่ถูกต้อง:", response.status);
                    }

                } catch (error: any) {
                    if (error.response && error.response.data && error.response.data.message) {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: error.response.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        console.error("เกิดข้อผิดพลาดในการส่งคำร้องขอ:", error);
                    }
                }


                console.log("แก้ไขแผนก: ", divisionName);
            } else {

                try {
                    const response = await axios.post(`${api}/DivisionAPI`, { DV_name: divisionName },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: response.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        fetchData();

                    } else {
                        console.log("รหัส HTTP ไม่ถูกต้อง:", response.status);
                    }

                } catch (error: any) {
                    if (error.response && error.response.data && error.response.data.message) {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: error.response.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        console.error("เกิดข้อผิดพลาดในการส่งคำร้องขอ:", error);
                    }
                }

            }
            handleClose(); // ปิด Modal หลังจากบันทึกหรือแก้ไข
        }

        setValidated(true);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editBt ? "เพิ่มข้อมูลแผนก" : "แก้ไขข้อมูลแผนก"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12">
                                <Form.Label>ชื่อแผนก</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="ชื่อแผนก"
                                    name="Dv_Name"
                                    value={divisionName}
                                    onChange={(e) => setDivisionName(e.target.value)} // รับค่าแผนกจาก input
                                />
                                <Form.Control.Feedback type="invalid">กรุณกรอกชื่อแผนก!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Modal.Footer>
                            <Button variant="primary" type="submit">
                                {editBt ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
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
