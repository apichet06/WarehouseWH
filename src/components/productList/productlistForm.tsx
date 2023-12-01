/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, InputGroup, ListGroup, Row } from "react-bootstrap"
import ProductlistMadals from "./productlistMadals"
import { useAppContext } from './AppContext'; // อ้างถึง Context
import "./css/productlist.css"
import { BsFillChatSquareTextFill, BsSearch } from "react-icons/bs";
interface Props {
    api: string
}
interface DataProduct {
    productID: string
    pImages: string
    productName: string
    productDescription: string
    qtyInStock: number
    productType: {
        typeName: string
    },
    unitPrice: string
}

export default function ProductlistForm(props: Props) {
    const { dispatch } = useAppContext(); // ใช้ Context ที่คุณสร้าง 
    const resulteData: any = JSON.parse(localStorage.getItem("resulte") || "{}");
    const field = {
        productID: '',
        pImages: '',
        productName: '',
        productDescription: '',
        qtyInStock: 0,
        productType: {
            typeName: ''
        },
        unitPrice: ''
    }

    const result: any = JSON.parse(localStorage.getItem("resulte") || "{}")
    const { api } = props
    const [data, setData] = useState<DataProduct[]>([]);
    const [showData, setShowData] = useState<DataProduct>(field);
    const [search, setSearch] = useState("");
    const [qty, setQty] = useState(1);
    const [loadingOnsubmit, setLoadingOnsubmit] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + '/productAPI?search=' + search);

            if (response.status === 200) {
                setData(response.data.result)
            }

        } catch (error) {
            console.log(error)
        }
    }, [api, search])

    const handleSearch = (e: any) => {
        e.preventDefault();
        const searchValue = e.target.elements.search.value;
        setSearch(searchValue)
    }

    const handleCountProduct = useCallback(async () => {

        try {

            const response = await axios.get(api + "/Picking_goodsDetailAPI/Pickinglist/" + resulteData.userID);

            if (response.status === 200) {
                // const countPro = response.data.result.filter((p: any) => p.requestCode === null)
                const totalQtyWithdrawn = response.data.result.reduce((sum: any, item: any) => sum + item.qtyWithdrawn, 0);
                dispatch({ type: 'SET_AMOUNT', payload: totalQtyWithdrawn });
            }

        } catch (error) {
            console.log(error);
        }

    }, [api, resulteData.userID, dispatch])

    useEffect(() => {
        fetchData()
        handleCountProduct();
    }, [fetchData, handleCountProduct])

    const handleSave = async () => {
        // ตรวจสอบว่า qty อยู่ในช่วงที่ระบบรับได้
        await setLoadingOnsubmit(true)
        if (qty >= 1 && qty <= 9999999) {
            try {
                const Formdata = new FormData();
                Formdata.append("productID", showData.productID);
                Formdata.append("QTYWithdrawn", qty.toString());
                Formdata.append("withdrawnBy", result.userID.toString());
                Formdata.append("unitPrice", showData.unitPrice);
                const response = await axios.post(api + '/Picking_goodsDetailAPI/AddCart', Formdata, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    await setLoadingOnsubmit(false)
                    await handleClose();
                    await handleCountProduct()

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
                qtyInStock: pro.qtyInStock,
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
                        <Form onSubmit={handleSearch}>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="ค้นหารายการสินค้า"
                                    aria-label="ค้นหารายการสินค้า"
                                    name="search"
                                    autoComplete="off"
                                />
                                <Button variant="dark" type="submit">
                                    <BsSearch />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    {data.length > 0 ? data.map((item: any) => (
                        <Col md={2} key={item.id} className="mb-2">
                            <Card>
                                <Card.Img variant="top" src={api + '/ImagesPathAPI/' + item.pImages} />
                                <Card.Body>
                                    <Card.Text style={{ fontSize: '15px' }} className="custom-card-body">{item.productName}</Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item style={{ fontSize: '12px' }} className="custom-card-body">{'ประเภท ' + item.productType.typeName}</ListGroup.Item>
                                    <ListGroup.Item style={{ fontSize: '12px' }} className="custom-card-body"> {item.productDescription}</ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Button size="sm" variant="warning" onClick={() => (handleShow(item.productID))}><BsFillChatSquareTextFill /></Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : (<h3 className="text-center">ไม่พบรายการสินค้า</h3>)}
                </Row>
            </Container>
            <ProductlistMadals api={api} handleClose={handleClose} show={show} showData={showData} qty={qty} setQty={setQty} handleSave={handleSave} loadingOnsubmit={loadingOnsubmit} />

        </>
    )
}