/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PositionModals from "./positionModals";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import Swal from "sweetalert2";

interface Props {
    api: string
}

interface PositionData {
    id: number;
    p_ID: string;
    dV_Name: string;
    dV_ID: string;
    p_Name: string;
}

export default function PosisionTable(props: Props) {
    const { api } = props;
    const [show, setShow] = useState(false);
    const [dV_ID, setDV_ID] = useState("");
    const [p_Name, setpName] = useState("");
    const [editId, setEditId] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setEditId("");
    }

    const [data, setData] = useState<PositionData[]>([]);
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${api}/positionAPI`);
            const data = response.data.result;
            setData(data);
        } catch (error) {
            console.log("Error fetching position", error);
        }
    }, [api])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns = [ // Specify the type for columns
        {
            name: '#', selector: (row: PositionData) => row.id, sortable: true,
        },
        {
            name: 'รหัสตำแหน่ง',
            selector: (row: PositionData) => row.p_ID,
            sortable: true,
        },
        {
            name: 'แผนก',
            selector: (row: PositionData) => row.dV_Name,
            sortable: true,
        },
        {
            name: 'ตำแหน่ง',
            selector: (row: PositionData) => row.p_Name,
            sortable: true,
        },
        {
            name: "จัดการ",
            cell: (row: PositionData) => (
                <>
                    <a onClick={() => { handleEdit(row.id); }} className="text-warning" >
                        <BsPencilFill />
                    </a>
                    &nbsp; &nbsp;
                    <a onClick={() => handleDelete(row.id)} className="text-danger">
                        <BsFillTrash3Fill />
                    </a>
                </>
            ),
        },
    ];


    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        } else {


            try {
                const formData = { dV_ID, p_Name };
                const apiUrl = editId ? `${api}/positionAPI/${editId}` : `${api}/positionAPI`;
                const response = await (editId ? axios.put(apiUrl, formData) : axios.post(apiUrl, formData));
                if (response.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchData();
                    handleClose();
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }

            } catch (error) {
                console.error("Error sending data to the API", error);
            }

        }

        setValidated(true);
    };

    const handleEdit = (id: number) => {

        const position = data.find(data => data.id === id);
        if (position) {
            setDV_ID(position.dV_ID)
            setpName(position.p_Name)
            setEditId(id.toString())
            setShow(true)
        }

    }

    const handleDelete = (id: number) => {
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
                    const response = await axios.delete(`${api}/PositionAPI/${id}`, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.status === 200) {
                        // แสดงข้อความเมื่อลบสำเร็จ
                        Swal.fire(
                            'Deleted!',
                            response.data.message,
                            'success'
                        );
                        // รีเฟรชข้อมูลหลังจากลบ
                        fetchData();
                    }
                } catch (error: any) {
                    console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
                    // แสดงข้อความเมื่อเกิดข้อผิดพลาดในการลบข้อมูล
                    Swal.fire(
                        'Error!',
                        error.response.message,
                        'error'
                    );
                }
            }
        });
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={7} className="mb-3 text-end">
                        <Button variant="primary" onClick={handleShow}>
                            เพิ่ม
                        </Button>
                    </Col>
                    <Col md={7}>
                        <Card>
                            <Card.Body>
                                <Card.Text>ข้อมูลแหน่ง</Card.Text>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    pagination
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <PositionModals api={api} show={show} handleClose={handleClose} fetchData={fetchData} validated={validated}
                handleSubmit={handleSubmit} setDV_ID={setDV_ID} setpName={setpName} dV_ID={dV_ID} p_Name={p_Name} editId={editId} />
        </>
    )
}