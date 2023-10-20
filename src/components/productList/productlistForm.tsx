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

}


export default function ProductlistForm(props: Props) {

    const field = {
        productID: ''
    }


    const { api } = props
    const [data, setDate] = useState<DataProduct[]>([]);
    const [showData, setShowData] = useState<DataProduct>(field);


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



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = async (productID: string) => {
        const pro = await data.find((item: any) => item.productID === productID)
        if (pro) {
            setShowData({
                productID: pro.productID,
            })
        }
        setShow(true);
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
                                    <Button size="sm" variant="primary" onClick={() => (handleShow(item.productID))}>เลือกเบิก</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <ProductlistMadals api={api} handleClose={handleClose} show={show} showData={showData} />

        </>
    )
}