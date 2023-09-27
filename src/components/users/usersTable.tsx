/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import UsersModals from "./userModals";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import Swal from "sweetalert2";
// แสดงข้อมูล Datatables
interface UsersData {
    id: number,
    userID: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    imageFile: string,
    dV_ID: string,
    p_ID: string,
    status: string
}
interface Props {
    api: string
}
export default function UsersTable(props: Props) {
    const { api } = props;
    const [show, setShow] = useState(false);
    const [editId, setEditID] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [dV_ID, setDV_ID] = useState('');
    const [p_ID, setP_ID] = useState('');

    const [data, setData] = useState<UsersData[]>([]);
    const initialUserData = {
        username: '',
        firstName: '',
        lastName: '',
        imageFile: '',
        dV_ID: '',
        p_ID: '',
        status: '',
    };

    // function สร้างตัวแปลเพื่อนำไปแก้ไขหรือเพิ่มข้อมูล
    const [user, setUser] = useState(initialUserData);

    // สร้างเพื่อส่งข้อมูลแบบชุดไป แสดงที่ textbox
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const formData = new FormData();
                formData.append("username", user.username);
                formData.append("firstName", user.firstName);
                formData.append("lastName", user.lastName);
                formData.append("imageFile", user.imageFile);
                formData.append("dV_ID", dV_ID); // ใช้ dV_ID จากสถานะ
                formData.append("p_ID", p_ID);   // ใช้ p_ID จากสถานะ
                formData.append("status", user.status);

                const apiUrl = editId ? `${api}/UsersAPI/${editId}` : `${api}/UsersAPI`;
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

        const selected = data.find(data => data.id === id);

        if (selected) {
            setUser(selected)
        }

        setEditID(id.toString())
        handleShow()
    }

    const handleDelete = async (id: number) => {
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
                        const response = await axios.delete(`${api}/UsersAPI/${id}`, {
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
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${api}/usersAPI`)
            if (response.status === 200) {
                setData(response.data.result)
            }

        } catch (error) {
            console.log(error);
        }
    }, [api])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const columns = [{
        name: '#', selector: (row: UsersData) => row.id, sortable: true,
    },
    {
        name: 'รหัสสมาชิก', selector: (row: UsersData) => row.userID, sortable: true,
    },
    {
        name: 'ชื่อ-สกุล', selector: (row: UsersData) => row.firstName + " " + row.lastName, sortable: true,
    },
    {
        name: 'รูปโปรไฟล์', cell: (row: UsersData) => (<> <Image src={api + '/ImagesPathAPI/' + row.imageFile} width={30} rounded /></>)

    },
    {
        name: 'รหัสแผนก', selector: (row: UsersData) => row.dV_ID, sortable: true,
    },
    {
        name: 'รหัสตำแหน่ง',
        selector: (row: UsersData) => row.p_ID,
        sortable: true,
    }, {
        name: "จัดการ",
        cell: (row: UsersData) => (
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


    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} className="text-end my-3">
                        <Button variant="primary" onClick={() => {
                            handleShow();
                            setUser(initialUserData);
                        }}>
                            เพิ่ม
                        </Button>
                        <hr />
                    </Col>
                    <Col md={10}>
                        <Card>
                            <Card.Body>
                                <Card.Text>ข้อมูลสมาชิก </Card.Text>
                                <DataTable columns={columns} data={data} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
            <UsersModals handleClose={handleClose} show={show} validated={validated} handleSubmit={handleSubmit}
                api={api} editId={editId} handleInputChange={handleInputChange} user={user} setDV_ID={setDV_ID} setP_ID={setP_ID} />
        </>
    )

}