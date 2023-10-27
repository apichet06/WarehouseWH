/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap"
import ProductlistMadals from "./productlistMadals"

interface Props {
    api: string
}
interface DataProduct {
    productID: string
    pImages: string
    productName: string
    productDescription: string
    productType: {
        typeName: string
    },
    unitPrice: string
}

export default function ProductlistForm(props: Props) {

    const field = {
        productID: '',
        pImages: '',
        productName: '',
        productDescription: '',
        productType: {
            typeName: ''
        },
        unitPrice: ''
    }

    const result: any = JSON.parse(localStorage.getItem("resulte") || "{}")
    const { api } = props
    const [data, setDate] = useState<DataProduct[]>([]);
    const [showData, setShowData] = useState<DataProduct>(field);
    const [qty, setQty] = useState(1);
    // สร้างฟังก์ชันสำหรับการจัดการข้อความยาว
    function truncateText(text: string, maxLength: number) {
        if (text.length <= maxLength) {
            return text;
        }
        // ถ้าข้อความยาวกว่า maxLength ให้ตัดแล้วเพิ่ม "..."
        return text.slice(0, maxLength) + "...";
    }


    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + '/productAPI');

            if (response.status === 200) {
                setDate(response.data.result)
            }

        } catch (error) {
            console.log(error)
        }
    }, [api])

    useEffect(() => {
        fetchData()
    }, [fetchData])





    const handleSave = async () => {
        // ตรวจสอบว่า qty อยู่ในช่วงที่ระบบรับได้
        if (qty >= 1 && qty <= 9999999) {
            try {
                const Formdata = new FormData();
                Formdata.append("productID", showData.productID);
                Formdata.append("QTYWithdrawn", qty.toString());
                Formdata.append("withdrawnBy", result.userID.toString());
                Formdata.append("unitPrice", showData.unitPrice);
                const response = await axios.post(api + '/Picking_goodsDetailAPI', Formdata, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    handleClose();
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Qty is out of range.");
        }
    }




    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = async (productID: string) => {
        const pro = await data.find((item: any) => item.productID === productID)

        if (pro) {
            setShowData({
                productID: pro.productID,
                pImages: pro.pImages,
                productName: pro.productName,
                productDescription: pro.productDescription,
                productType: { typeName: pro.productType.typeName },
                unitPrice: pro.unitPrice
            })
        }
        setShow(true);
        setQty(1)
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="ค้นหารายการสินค้า"
                            name="ProductName"
                            aria-describedby="inputGroupPrepend"
                        />
                    </Col>
                </Row>
                <Row>
                    {data.map((item: any) => (
                        <Col md={2} key={item.id} className="mb-2">
                            <Card>
                                <Card.Img variant="top" src={api + '/ImagesPathAPI/' + item.pImages} />
                                <Card.Body>
                                    <Card.Text style={{ fontSize: '15px' }}>{truncateText(item.productName, 15)}</Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item style={{ fontSize: '12px' }}>{'ประเภท ' + item.productType.typeName}</ListGroup.Item>
                                    <ListGroup.Item style={{ fontSize: '12px' }}> {truncateText(item.productDescription, 22)}</ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Button size="sm" variant="warning" onClick={() => (handleShow(item.productID))}>Preview</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <ProductlistMadals api={api} handleClose={handleClose} show={show} showData={showData} qty={qty} setQty={setQty} handleSave={handleSave} />

        </>
    )
}