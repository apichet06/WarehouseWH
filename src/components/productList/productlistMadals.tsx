import { Button, Col, Container, Form, Image, InputGroup, Modal, Row } from "react-bootstrap"

interface Props {
    api: string
    handleClose: () => void
    show: boolean
    showData: {
        productID: string
        pImages: string
        productName: string
        productDescription: string
        productType: {
            typeName: string
        }
        unitPrice: string
    }
    qty: number
    setQty: (value: React.SetStateAction<number>) => void
    handleSave: () => void
}

export default function ProductlistMadals(props: Props) {
    const { api, handleClose, show, showData, qty, setQty, handleSave } = props


    const handlePlus = () => {
        setQty(qty + 1); // เพิ่ม qty ขึ้น 1
    }

    const handleReduce = () => {
        if (qty > 1) {
            setQty(qty - 1); // ลด qty ลง 1 ถ้า qty มากกว่า 1
        }
    }


    return (
        <>


            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{showData.productID}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={5}>
                                <Image src={api + '/ImagesPathAPI/' + showData.pImages} width={"100%"} thumbnail className="shadow-sm" />
                            </Col>
                            <Col md={7}>
                                <Row>
                                    <Col md={12} className="my-2">
                                        <strong ><u>{showData.productName}</u></strong>
                                        <h6 className="m-3">ประเภท : {showData.productType.typeName}</h6>
                                        <h6 className="m-3">รายละเอียด : {showData.productDescription}</h6>
                                        <h6 className="m-3">คารา : {showData.unitPrice.toLocaleString()} บาท </h6>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={2} xs={3} className="text-center my-3" >จำนวน</Col>
                            <Col md={3} xs={5} className="text-center my-3" style={{ marginTop: "auto" }}>
                                <InputGroup  >
                                    <Button variant="secondary" id="button-addon1" onClick={handleReduce} size="sm">-</Button>
                                    <Form.Control value={qty} className="text-center" size="sm" maxLength={3} onChange={(e) => {
                                        let newQty = parseInt(e.target.value, 10);
                                        if (isNaN(newQty) || newQty === 0) {
                                            // ถ้าผู้ใช้กรอกเลข 0 หรือไม่ใช่ตัวเลขให้ตั้งเป็น 1 แทน
                                            newQty = 1;
                                        }
                                        setQty(newQty);
                                    }} />
                                    <Button variant="secondary" id="button-addon1" onClick={handlePlus} size="sm">+</Button>
                                </InputGroup>
                            </Col>
                            <Col md={2} xs={4} className="text-center my-3" style={{ marginTop: "auto" }}>
                                <Button variant="outline-success" size="sm" onClick={handleSave}>เพิ่มสินค้า</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="sm" onClick={handleClose}> ปิด </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}