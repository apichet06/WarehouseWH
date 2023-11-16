/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import ProductModals from "./productModals";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import { showSuccessAlert, showErrorAlert } from "../utility/alertUtils";
import Swal from "sweetalert2";
interface Props {
    api: string;
}

interface ProductType {
    id: number;
    autoID: number;
    typeID: string;
    typeName: string;
}


export default function ProductTable(props: Props) {
    const { api } = props;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    const [editId, setEditId] = useState('');
    const [typeName, setTypeName] = useState('');
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = editId ? await axios.put(api + '/productTypeAPI/' + editId, { typeName: typeName }) : await axios.post(api + '/productTypeAPI', { typeName: typeName });

                if (response.data.isSuccess === true) {
                    await handleClose()
                    await showSuccessAlert(response.data.message);
                    await fetchData()
                } else {
                    await handleClose()
                    await showErrorAlert(response.data.message);
                }
            } catch (error: any) {
                await handleClose()
                await showErrorAlert(error);

            }


        }

        setValidated(true);
    };

    const [data, setData] = useState<ProductType[]>([])

    const columns = [
        { name: 'ลำดับ', selector: (row: ProductType) => row.autoID, },
        { name: 'รหัสประเภทสินค้า', selector: (row: ProductType) => row.typeID, },
        { name: 'ชื่อประเภทสินค้า', selector: (row: ProductType) => row.typeName, },
        {
            name: "จัดการ",
            cell: (row: ProductType) => (
                <>
                    <Button onClick={() => { handleEdit(row.id); }} variant="outline-warning" size="sm" ><BsPencilFill /></Button>
                    &nbsp; &nbsp;
                    <Button onClick={() => handleDelete(row.typeID)} variant="outline-danger" size="sm"> <BsFillTrash3Fill /></Button>
                </>
            ),
        },
    ];

    const handleEdit = async (id: number) => {
        setEditId(id.toString())
        const datatype = data.find(row => row.id === id)
        if (datatype) {
            setTypeName(datatype?.typeName)
        }
        handleShow()
    }

    const handleDelete = async (typeID: string) => {
        try {
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
                        const response = await axios.delete(`${api}/productTypeAPI/${typeID}`)

                        if (response.status === 200) {

                            showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            fetchData();
                        } else {
                            showErrorAlert(response.data.message)
                        }
                    } catch (error: any) {
                        showErrorAlert(error.response.data.message)
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }

    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + '/productTypeAPI');
            if (response.status === 200) {

                const newData = await response.data.result.map((item: any, index: number) => ({
                    ...item, autoID: index + 1
                }))

                setData(newData)
                setLoading(false)
            }

        } catch (error) {
            console.log(error);

        }
    }, [api])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <ProductModals show={show} handleClose={handleClose} validated={validated} handleSubmit={handleSubmit} editId={editId} typeName={typeName} setTypeName={setTypeName} />
            <Container>
                <Row className="justify-content-center">
                    <Col md={7} className="text-end">
                        <Button variant="primary" onClick={() => (handleShow(), setEditId(''), setTypeName(''))}>
                            เพิ่มข้อมูล
                        </Button>
                        <hr />
                    </Col>
                    <Col md={7}>
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Text>ข้อมูลชนิดสินค้า</Card.Text>
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