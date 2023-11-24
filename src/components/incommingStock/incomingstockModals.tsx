/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap"
import Select from 'react-select';
interface Props {
    api: string
    show: boolean
    handleClose: () => void
    validated: boolean
    handleSubmit: any
    alertProduct: string
    handleinputChange: any
    setAlertProduct: (value: string) => void
    loadingOnsubmit: boolean
}

export default function IncomingstockModals(props: Props) {
    const { api, show, handleClose, validated, handleSubmit, alertProduct, handleinputChange, setAlertProduct, loadingOnsubmit } = props
    const [options, setOptions] = useState([]);
    const fetchtype = useCallback(async () => {
        try {
            const response = await axios.get(api + '/ProductAPI');
            if (response.status === 200) {
                const fetchedOptions = response.data.result.map((item: any) => ({
                    value: item.productID, // แสดงให้แก้ไขตามโครงสร้างข้อมูลจริง
                    label: item.productName, // แสดงให้แก้ไขตามโครงสร้างข้อมูลจริง
                }));
                setOptions(fetchedOptions);
            }

        } catch (error: any) {
            console.error(error.message);
        }
    }, [api]);

    const handleSelectChange = (s: any) => {
        const name = 'productID'
        const value = s ? s.value : '';
        handleinputChange({ target: { name, value } });
        console.log(s.value);

        setAlertProduct(s.value)
    }

    useEffect(() => {
        fetchtype()
    }, [fetchtype])

    return (
        <>

            <Modal
                show={show}
                size="lg"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มรายการสินค้านำเข้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" className="mb-2">
                                <Form.Label>ชื่อสินค้า</Form.Label>
                                <Select
                                    onChange={handleSelectChange}
                                    options={options}
                                    required
                                />
                                <span className='text-danger small'>{alertProduct ? "" : "กรุณาเลือกสินค้า"}</span>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>จำนวนนำเข้า</Form.Label>
                                <Form.Control type="number" name="qtyReceived" placeholder="จำนวนนำเข้า" onChange={handleinputChange} required />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกจำนวนสินค้าที่นำเข้า
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-2">
                                <Form.Label>ราคาสินค้านำเข้า(ต่อหน่วย)</Form.Label>
                                <Form.Control type="text" name="unitPriceReceived" placeholder="ราคาสินค้านำเข้า" required onChange={handleinputChange} autoComplete="off" />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอกราคาสินค้านำเข้า
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={loadingOnsubmit}>เพิ่มข้อมูล {loadingOnsubmit && <Spinner animation="border" size="sm" />}</Button>
                            <Button variant="secondary" onClick={handleClose}>
                                ปิด
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal >
        </>
    )
}