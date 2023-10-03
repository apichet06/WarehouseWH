/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import Select from 'react-select';
interface Props {
    api: string
    show: boolean
    handleClose: () => void
    editId: string
    validated: boolean
    handleSubmit: any
    handleInputChange: any
    handleFileChange: any
    formData: any
    imageUrl: string | null

}

export default function ProductModals(props: Props) {
    const { api, show, handleClose, editId, validated, handleSubmit, handleInputChange, handleFileChange, formData, imageUrl } = props;
    const [options, setOptions] = useState([]);

    const fetchtype = useCallback(async () => {
        try {
            const response = await axios.get(api + '/ProductTypeAPI');

            if (response.status === 200) {
                const fetchedOptions = response.data.result.map((item: any) => ({
                    value: item.typeID, // แสดงให้แก้ไขตามโครงสร้างข้อมูลจริง
                    label: item.typeName, // แสดงให้แก้ไขตามโครงสร้างข้อมูลจริง
                }));
                setOptions(fetchedOptions);
            }

        } catch (error: any) {
            console.error(error.message);
        }
    }, [api]);

    useEffect(() => {
        fetchtype()
    }, [fetchtype])
    const handleSelectChange = (selectedOption: any) => {
        // นี่คือ selectedOption ที่ผู้ใช้เลือกใน Select
        const name = 'typeID'; // ชื่อฟิลด์ที่คุณต้องการเปลี่ยนแปลง
        const value = selectedOption ? selectedOption.value : ''; // ค่าที่คุณต้องการเก็บ

        // เรียก handleInputChange เพื่อเปลี่ยนแปลงค่าใน state ของคุณ
        handleInputChange({ target: { name, value } });
    };
    return (
        <>
            {api}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มข้อมูลสินค้า'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ชื่อสินค้า</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="productName"
                                    placeholder="กรอกชื่อสินค้า"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกชื่อสินค้า
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>รายละเอียด</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="productDescription"
                                    placeholder="กรอกรายละเอียด"
                                    value={formData.productDescription}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกรายละเอียดชื่อสินค้า
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ประเภทสินค้า</Form.Label>
                                <Select
                                    defaultValue={formData.typeID}
                                    onChange={handleSelectChange}
                                    options={options}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณาเลือกประเภทสินค้า
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>จำนวนสินค้าน้อยที่สุด</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="qtyMinimumStock"
                                    placeholder="กรอกจำนวนสินค้าน้อยสุดได้กี่ชิ้น"
                                    value={formData.qtyMinimumStock}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกจำนวนสินค้าน้อยที่สุด
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>จำนวนสินค้าที่นำเข้า</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="qtyInStock"
                                    placeholder="กรอกจำนวนสินค้าที่นำเข้า"
                                    value={formData.qtyInStock}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกจำนวนสินค้าที่นำเข้า
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ราคานำเข้า</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="unitPrice"
                                    placeholder="กรอกราคานำเข้า"
                                    value={formData.unitPrice}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกราคานำเข้า
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>หน่วยนับ</Form.Label>
                                <Form.Select aria-label="Default select example" value={formData.unitOfMeasure}
                                    onChange={handleInputChange} name="unitOfMeasure">
                                    <option>--- เลือกหน่วยนับ ---</option>
                                    <option value="ชิ้น">ชิ้น</option>
                                    <option value="กิโลกรัม">กิโลกรัม</option>
                                    <option value="เมตร">เมตร</option>
                                    <option value="ตารางเมตร">ตารางเมตร</option>
                                    <option value="ลูก">ลูก</option>
                                    <option value="ห่อ">ห่อ</option>
                                    <option value="กล่อง">กล่อง</option>
                                    <option value="กล่อง">กล่อง</option>
                                    <option value="โหล">โหล</option>
                                    <option value="ตัว">ตัว</option>
                                    <option value="ลูก">ลูก</option>
                                    <option value="ชุด">ชุด</option>
                                    <option value="คู่">คู่</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกหน่วยนับ
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>รูปภาพสินค้า</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="pImages"
                                    placeholder="อับโหลดภาพ"
                                    accept=".jpg, .png, .jpeg" // ระบุประเภทไฟล์ที่อนุญาต
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={12} className="mb-2 text-center">
                                {imageUrl && <Image src={imageUrl} alt="Uploaded Image" width="110" thumbnail />}
                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">{editId ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}</Button>
                            <Button variant="secondary" onClick={handleClose}>
                                ปิด
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}