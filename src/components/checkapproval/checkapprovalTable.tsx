/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap"
import DataTable from 'react-data-table-component';
import { BsFillSendFill, BsFillTrash3Fill } from "react-icons/bs"
import { useAppContext } from "../productList/AppContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Props {
    api: string
}

interface Picking_goodsDetai {
    AutoId: number
    id: number
    productID: string
    product: {
        productName: string
        unitOfMeasure: string
    }
    qtyWithdrawn: number
    unitPrice: number

}


export default function CheckApprovalTable(props: Props) {
    const { api } = props
    const resulteData: any = JSON.parse(localStorage.getItem("resulte") || "{}");
    const [data, setData] = useState<Picking_goodsDetai[]>([]);
    const [sumAmount, setSumAmount] = useState(0);
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true);
    const { dispatch } = useAppContext(); // ใช้ Context ที่คุณสร้าง
    const [Purpose, setPurpose] = useState("");
    const navigate = useNavigate();

    const handleQty = async (id: number, amount: any) => {
        try {
            const response = await axios.get(api + "/Picking_goodsDetailAPI/Pickinglist/" + resulteData.userID);

            if (response.status === 200) {
                const row = response.data.result.find((r: any) => r.id === id);

                if (row) {
                    const newQty = row.qtyWithdrawn + amount;

                    if (newQty >= 1) {
                        const responses = await axios.put(api + "/Picking_goodsDetailAPI/Qty/" + id, { qtyWithdrawn: newQty });

                        if (responses.status === 200) {
                            fieldData();
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handlePlus = async (id: number) => {
        handleQty(id, + 1) // เพิ่ม qty ขึ้น 1 
    }
    const handleReduce = (id: number) => {
        handleQty(id, - 1)// ลด qty ลง 1 ถ้า qty มากกว่า 1 
    }


    const columns = [

        { name: 'ลำดับ', selector: (row: Picking_goodsDetai) => row.AutoId + ".", sortactive: false, width: '70px' },
        { name: 'รหัสสินค้า', selector: (row: Picking_goodsDetai) => row.productID, sortactive: false, width: '120px' },
        { name: 'ชื่อสินค้า', selector: (row: Picking_goodsDetai) => row.product.productName, sortactive: false, width: '350px' },
        { name: 'ราคาขาย', selector: (row: Picking_goodsDetai) => row.unitPrice.toLocaleString(), sortactive: false, right: true },
        {
            name: 'จำนวน', cell: (row: Picking_goodsDetai) => (
                <>
                    {/* onChange={(e) => setQty(parseInt(e.target.value, 10))} */}
                    <InputGroup>
                        <Button variant="success" onClick={() => handleReduce(row.id)} size="sm">-</Button>
                        <Form.Control type="text" value={row.qtyWithdrawn} className="text-center" size="sm" maxLength={3} disabled />
                        <Button variant="success" onClick={() => handlePlus(row.id)} size="sm">+</Button>
                    </InputGroup>

                </>
            ), width: '140px', sortactive: false, center: true,
        },
        { name: 'ยอดรวม', selector: (row: Picking_goodsDetai) => (row.qtyWithdrawn * row.unitPrice).toLocaleString(), sortactive: false, width: '100px', right: true },
        {
            name: 'จัดการ', cell: (row: Picking_goodsDetai) => (<>
                <a onClick={() => handleDelete(row.id)} className="btn btn-outline-danger btn-sm text-danger">
                    <BsFillTrash3Fill />
                </a>
            </>), width: '100px', sortactive: false, center: true,
        }
    ];


    const fieldData = useCallback(async () => {
        const response = await axios.get(api + "/Picking_goodsDetailAPI/Pickinglist/" + resulteData.userID);

        if (response.status === 200) {
            const NewData = response.data.result.map((item: any, index: any) => ({
                ...item, AutoId: index + 1
            }))

            setData(NewData)
            setLoading(false)
            const totalQtyWithdrawn = NewData.reduce((sum: any, item: any) => sum + item.qtyWithdrawn, 0);
            const totalUnitPrice = NewData.reduce((sum: any, item: any) => sum + item.qtyWithdrawn * item.unitPrice, 0);

            setSumAmount(totalQtyWithdrawn)
            setTotal(totalUnitPrice)
            // const countPro = response.data.result.filter((p: any) => p.requestCode === null)
            dispatch({ type: 'SET_AMOUNT', payload: totalQtyWithdrawn });

        }

    }, [api, resulteData.userID, dispatch])


    useEffect(() => {
        fieldData()

    }, [fieldData])

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(api + '/Picking_goodsDetailAPI/' + id)
            if (response.status === 200) {
                fieldData()
            }
        } catch (error) {
            console.log(error);

        }
    }


    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();

        } else {

            Swal.fire({
                title: 'ต้องการเบิกสินค้าใช่หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'green',
                cancelButtonColor: 'red',
                confirmButtonText: 'ใช่!',
                cancelButtonText: 'ไม่ใช่!',

            }).then(async (result) => {
                if (result.isConfirmed) {
                    const Data = {
                        Purpose: Purpose,
                        divisionId: resulteData.division.dV_ID
                    }
                    const res = await axios.post(api + '/InventoryRequestAIP/' + resulteData.userID, Data)
                    if (res.status === 200) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'ทำรายการสำเร็จ!',
                            showConfirmButton: false,
                            timer: 1100
                        })
                        setTimeout(() => { navigate("/productlist"); }, 1500);

                        fieldData()
                    }

                }
            })

        }

        setValidated(true);

    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    {sumAmount == 0 ? <Col md={10}>
                        <hr />
                        <h3 className="text-center">ไม่พบรายการสินค้ารอเบิก</h3>
                        <hr />
                    </Col> :
                        <Col md={10}>
                            <h3>รายการสินค้ารอเบิก</h3>
                            <Card className="shadow">
                                <Card.Body>
                                    <DataTable
                                        columns={columns}
                                        data={data}
                                        progressPending={loading}
                                    />
                                    <hr />
                                    <h5 className="text-end">ยอดสุทธิ {total.toLocaleString()} บาท</h5>
                                    <Row className="justify-content-center">
                                        <hr />

                                        <Col md={8}>
                                            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                                                <Row className="mb-2 justify-content-center">
                                                    <Form.Group as={Col} md="12" className=" mb-3">
                                                        <Form.Control
                                                            as="textarea"
                                                            required
                                                            type="text"
                                                            placeholder="เหตุผล"
                                                            onChange={(e) => setPurpose(e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">กรุณาระบุเหตุผลที่ขอเบิก!</Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Col md={6} className="d-grid gap-2">
                                                        <Button type="submit" variant="outline-success">เบิกสินค้า <BsFillSendFill /></Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>}
                </Row>
            </Container>
        </>
    )
}