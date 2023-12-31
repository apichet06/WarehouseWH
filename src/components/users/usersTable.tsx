/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import UsersModals from "./userModals";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { formatDate } from "../utility/dateUtils";
import { showSuccessAlert, showErrorAlert } from '../utility/alertUtils';
// แสดงข้อมูล Datatables
interface UsersData {
    autoId: number,
    id: number,
    userID: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    imageFile: string,
    dV_ID: string,
    p_Name: string,
    p_ID: string,
    status: string,
    date: string,
    division: {
        dV_ID: string;
        dV_Name: string;
    };
    position: {
        p_ID: string;
        p_Name: string;
        dV_ID: string | null; // Update the type for dV_ID based on your data
        dV_Name: string | null; // Update the type for dV_Name based on your data
    };
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
    const field = {
        username: '',
        firstName: '',
        lastName: '',
        dV_ID: '',
        p_ID: '',
        status: ''
    }
    const [editData, setEditData] = useState(field);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dV_ID, setDV_ID] = useState('');
    const [p_ID, setP_ID] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingOnsubmit, setLoadingOnsubmit] = useState(false);



    const [data, setData] = useState<UsersData[]>([]);
    const [validated, setValidated] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Use optional chaining

        if (file) {
            setSelectedFile(file); // Store the selected File object
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result); // Set the URL string to imageUrl
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null); // No file selected, reset the selectedFile state
            setImageUrl(null); // No file selected, reset the imageUrl state
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setLoadingOnsubmit(true)
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setLoadingOnsubmit(false)
        } else {
            try {
                const formData = new FormData();
                formData.append("username", username);
                formData.append("firstName", firstName);
                formData.append("lastName", lastName);
                // ตรวจสอบว่า selectedFile ไม่เป็น null ก่อนที่จะใช้
                if (selectedFile) {
                    formData.append("imageFile", selectedFile);
                }
                formData.append("dV_ID", dV_ID); // ใช้ dV_ID จากสถานะ
                formData.append("p_ID", p_ID);   // ใช้ p_ID จากสถานะ
                formData.append("status", status);

                const apiUrl = editId ? `${api}/UsersAPI/${editId}` : `${api}/UsersAPI`;
                const response = await (editId ? axios.put(apiUrl, formData) : axios.post(apiUrl, formData));
                if (response.status === 200) {
                    showSuccessAlert(response.data.message)
                    fetchData();
                    setImageUrl(null);
                    handleClose();
                    setLoadingOnsubmit(false);
                } else {
                    showErrorAlert(response.data.message)
                }
            } catch (error) {
                console.error("Error sending data to the API", error);
            }
        }

        setValidated(true);
    };

    const handleEdit = async (id: number) => {

        const users = data.find(data => data.id === id);

        if (users) {
            setEditData(users)
            setUsername(users.username)
            setFirstName(users.firstName)
            setLastName(users.lastName)
            setDV_ID(users.dV_ID)
            setP_ID(users.p_ID)
            setStatus(users.status)
        }

        setEditID(id.toString())
        handleShow()
        setSelectedFile(null)
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
                            showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            fetchData();
                        }
                    } catch (error: any) {
                        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
                        showErrorAlert(error.response.message)
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
                const newData = response.data.result.map((item: any, index: number) => ({
                    ...item, autoId: index + 1
                }))
                setData(newData)
                setLoading(false)
            }

        } catch (error: any) {
            showErrorAlert(error),
                console.log(error);
        }
    }, [api])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const columns = [
        { name: '#', selector: (row: UsersData) => row.autoId, sortable: true },
        { name: 'รหัสสมาชิก', selector: (row: UsersData) => row.userID, sortable: true },
        { name: 'ชื่อล็อกอิน', selector: (row: UsersData) => row.username, sortable: true },
        { name: 'ชื่อ-สกุล', selector: (row: UsersData) => row.firstName + " " + row.lastName, sortable: true },
        {
            name: 'รูปโปรไฟล์', cell: (row: UsersData) => (<>
                {row.imageFile ? (
                    <Image src={api + '/ImagesPathAPI/' + row.imageFile} width={30} rounded />
                ) : (<span>No image</span>)}</>)
        },
        { name: 'แผนก', selector: (row: UsersData) => row.division.dV_Name, sortable: true },
        { name: 'ตำแหน่ง', selector: (row: UsersData) => row.position.p_Name, sortable: true, },
        { name: 'สถานะ', selector: (row: UsersData) => row.status, sortable: true },
        { name: 'วันที่', selector: (row: UsersData) => row.date ? formatDate(row.date) : '-', sortable: true, },
        {
            name: "จัดการ",
            cell: (row: UsersData) => (
                <>
                    <Button onClick={() => { handleEdit(row.id); }} variant="outline-warning" size="sm" ><BsPencilFill /></Button>
                    &nbsp; &nbsp;
                    <Button onClick={() => handleDelete(row.id)} variant="outline-danger" size="sm"><BsFillTrash3Fill /></Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={11} className="text-end mb-2">
                        <Button variant="primary" onClick={() => {
                            handleShow();
                            setEditID('')
                            setSelectedFile(null)
                            setEditData(field);
                            setImageUrl(null)
                            setDV_ID('')
                            setP_ID('')
                        }}>
                            เพิ่ม
                        </Button>
                        <hr />
                    </Col>
                    <Col md={11}>
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Text>ข้อมูลสมาชิก </Card.Text>
                                <DataTable columns={columns} data={data} progressPending={loading} pagination />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
            <UsersModals handleClose={handleClose} show={show} validated={validated} handleSubmit={handleSubmit}
                editData={editData}
                api={api} editId={editId}
                setUsername={setUsername}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setStatus={setStatus}
                setDV_ID={setDV_ID}
                setP_ID={setP_ID}
                imageUrl={imageUrl}
                handleFileUpload={handleFileUpload}
                p_ID={p_ID}
                dV_ID={dV_ID}
                loadingOnsubmit={loadingOnsubmit}
            />
        </>
    )

}