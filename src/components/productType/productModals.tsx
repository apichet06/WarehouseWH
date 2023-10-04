/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

interface Props {

    show: boolean;
    handleClose: () => void;
    validated: boolean
    handleSubmit: any;
    editId: string;
    typeName: string;
    setTypeName: (v: string) => void;

}
export default function ProductModals(props: Props) {
    const { show, handleClose, validated, handleSubmit, editId, typeName, setTypeName } = props

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? "แก้ไขประเภทสินค้า" : "เพิ่มประเภทสินค้า"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustom03">
                                <Form.Label>ชื่อประเภทสินค้า</Form.Label>
                                <Form.Control type="text" placeholder="ประเภทสินค้า" required defaultValue={typeName} onChange={(e) => setTypeName(e.target.value)} autoComplete="off" />
                                <Form.Control.Feedback type="invalid">
                                    กรุณกรอกชื่อประเภทสินค้า
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row> <Modal.Footer>
                            <Button variant="primary" type="submit">{editId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</Button>
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