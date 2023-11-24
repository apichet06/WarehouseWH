/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import IncomingstockModals from "./incomingstockModals";
import { showSuccessAlert, showErrorAlert } from "../utility/alertUtils";
import { formatDate } from "../utility/dateUtils";
import { BsFillTrash3Fill } from "react-icons/bs";
import Swal from "sweetalert2";
interface Props {
    api: string
}

interface incomingstocks {
    autoID: number
    id: number
    incomingStockID: string
    productID: string
    qtyReceived: number
    unitPriceReceived: number
    receivedDate: string
    receivedBy: string,
    product: {
        productID: string
        productName: string
        unitOfMeasure: string
    }
    users: {
        firstName: string
        lastName: string
    }

}

interface formData {
    productID: string
    qtyReceived: number
    unitPriceReceived: number
    receivedBy: string
}

export default function IncommingStockTable(props: Props) {

    const result: any = JSON.parse(localStorage.getItem("resulte") || "{}")

    const { api } = props;
    const [data, setData] = useState<incomingstocks[]>([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [alertProduct, setAlertProduct] = useState('')
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loadingOnsubmit, setLoadingOnsubmit] = useState(false);
    const [validated, setValidated] = useState(false);

    const [formData, setformData] = useState<formData>({
        productID: '',
        qtyReceived: 0,
        unitPriceReceived: 0,
        receivedBy: result.userID
    })

    const handleinputChange = (e: any) => {
        const { name, value } = e.target
        setformData({ ...formData, [name]: value });
    }

    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        setLoadingOnsubmit(true);
        console.log(formData);

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setAlertProduct(formData.productID)
            setLoadingOnsubmit(false)
        } else {
            const response = await axios.post(api + '/incomingStockAPI', formData);
            if (response.status === 200) {
                await fetchData()
                await handleClose()
                await showSuccessAlert(response.data.message)
                setLoadingOnsubmit(false)
            } else {
                showErrorAlert(response.data.message)
            }
        }

        setValidated(true);
    };
    const fetchData = useCallback(async () => {

        try {

            const response = await axios.get(api + '/IncomingStockAPI');

            if (response.status === 200) {
                const newData = response.data.result.map((item: any, index: number) => ({
                    ...item, autoID: index + 1
                }))

                await setData(newData)
                await setLoading(false)
            }

        } catch (error) {
            console.log(error);
        }
    }, [api])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    const columns = [
        { name: 'ลำดับ', selector: (row: incomingstocks) => row.autoID, width: '70px' },
        { name: 'รหัสนำเข้า', selector: (row: incomingstocks) => row.incomingStockID },
        { name: 'รหัสสินค้า', selector: (row: incomingstocks) => row.productID },
        { name: 'ชื่อสินค้า', selector: (row: incomingstocks) => row.product.productName, width: '200px' },
        { name: 'จำนวนนำเข้า', selector: (row: incomingstocks) => row.qtyReceived },
        { name: 'หน่วย', selector: (row: incomingstocks) => row.product.unitOfMeasure },
        { name: 'ราคาต่อหน่วย', selector: (row: incomingstocks) => row.unitPriceReceived.toLocaleString() },
        { name: 'หน่วย', selector: (row: incomingstocks) => ' บาท/' + row.product.unitOfMeasure, },
        { name: 'ผู้นำเข้า', selector: (row: incomingstocks) => row.users.firstName + ' ' + row.users.lastName },
        { name: 'วันที่นำเข้า', selector: (row: incomingstocks) => formatDate(row.receivedDate), width: '160px' },
        {
            name: 'จัดการ', cell: (row: incomingstocks) => (<>
                <Button onClick={() => handleDelete(row.id)} variant="outline-danger" size="sm">
                    <BsFillTrash3Fill />
                </Button>
            </>)
        }
    ];
    const handleDelete = async (id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ลบ!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(api + '/incomingstockAPI/' + id);
                    if (response.status === 200) {
                        await fetchData()
                        await handleClose()
                        showSuccessAlert(response.data.message)
                    }
                } catch (e: any) {
                    showErrorAlert(e)
                }
            }
        });
    }
    return (
        <>
            <IncomingstockModals api={api} show={show} handleClose={handleClose} validated={validated} handleSubmit={handleSubmit}
                alertProduct={alertProduct} handleinputChange={handleinputChange} setAlertProduct={setAlertProduct} loadingOnsubmit={loadingOnsubmit} />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col md={11} className="mb-2 text-end">
                        <Button variant="primary" onClick={() => { handleShow(), setAlertProduct('0'), setValidated(false) }}>
                            เพิ่มข้อมูล
                        </Button>
                        <hr />
                    </Col>
                    <Col md={11}>
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Text>รายการสินค้าที่นำเข้า</Card.Text>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    progressPending={loading}
                                    pagination
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}