/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Card, Col, Container, Image, Row } from "react-bootstrap"
import ProductModals from "./productModals"
import DataTable from 'react-data-table-component';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { formatDate } from "../utility/dateUtils";
import { showErrorAlert, showSuccessAlert } from "../utility/alertUtils";
interface Props {
    api: string
}
interface Product {
    autoID: number,
    id: number,
    productID: string,
    typeID: string,
    productName: string,
    productDescription: string,
    pImages: string,
    qtyMinimumStock: number,
    qtyInStock: number;
    unitPrice: number;
    unitOfMeasure: string;
    receiveAt: string;
    lastAt: string;
    productType: {
        typeName: string
    }
}

interface FormData {
    typeID: string;
    productName: string;
    productDescription: string;
    qtyMinimumStock: string;
    qtyInStock: string;
    unitPrice: string;
    unitOfMeasure: string;
    imageFile: File | null; // หรืออื่น ๆ ที่เหมาะสมกับชนิดของ pImages
}

export default function ProductTable(props: Props) {
    const { api } = props
    const [data, setData] = useState<Product[]>([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const field = {
        typeID: '',
        productName: '',
        productDescription: '',
        qtyMinimumStock: '',
        qtyInStock: '',
        unitPrice: '',
        unitOfMeasure: '',
        imageFile: null, // เก็บไฟล์รูปภาพที่เลือก
    }

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState<FormData>(field);

    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        if (form.checkValidity() === true) {
            try {
                event.preventDefault();

                const formDataToSend = new FormData();

                // เพิ่มข้อมูลจาก state formData เข้ากับ formDataToSend
                for (const [key, value] of Object.entries(formData)) {
                    if (value !== null) {
                        formDataToSend.append(key, value);
                    }
                }

                const apiUrl = editId ? `${api}/productAPI/${editId}` : `${api}/productAPI`;
                const response = await (editId ? axios.put(apiUrl, formDataToSend) : axios.post(apiUrl, formDataToSend));
                if (response.status === 200) {
                    await handleClose();
                    await showSuccessAlert(response.data.message)
                    await setImageUrl(null);
                    await fetchData();

                } else {
                    showErrorAlert(response.data.message)
                }

                setValidated(false);
            } catch (error) {
                console.error('Error posting data:', error);
                // ดำเนินการดังนี้หากเกิดข้อผิดพลาด
            }
        }
    };


    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {

            setFormData({ ...formData, imageFile: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result); // Set the URL string to imageUrl
            };
            reader.readAsDataURL(file);
        } else {
            setImageUrl(null); // No file selected, reset the imageUrl state
        }

    };

    const columns = [
        { name: 'ลำดับ', selector: (row: Product) => row.autoID, sortactive: true, width: '70px', },
        { name: 'รหัสสินค้า', selector: (row: Product) => row.productID, sortactive: true },
        { name: 'ชื่อสินค้า', selector: (row: Product) => row.productName, sortactive: true },
        { name: 'ประเภทสินค้า', selector: (row: Product) => row.productType.typeName, sortactive: true },
        {
            name: 'รูปโปรไฟล์', cell: (row: Product) => (<>
                {row.pImages ? (
                    <Image src={api + '/ImagesPathAPI/' + row.pImages} width={30} rounded />
                ) : (<span>No image</span>)}</>)
        },
        { name: 'รายละเอียด', selector: (row: Product) => row.productDescription, sortactive: true },
        { name: 'จำนวนคงเหลือ', selector: (row: Product) => row.qtyInStock, sortactive: true },
        { name: 'ราคาต่อหน่วย', selector: (row: Product) => row.unitPrice, sortactive: true },
        { name: 'หน่วยนับ', selector: (row: Product) => row.unitOfMeasure, sortactive: true },
        { name: 'วันที่รับสินค้า', selector: (row: Product) => row.receiveAt ? formatDate(row.receiveAt) : '-', sortactive: true },
        { name: 'วันที่แก้ไขล่าสุด', selector: (row: Product) => row.lastAt ? formatDate(row.lastAt) : '-', sortactive: true },
        {
            name: "จัดการ",
            cell: (row: Product) => (
                <>
                    <a onClick={() => { handleEdit(row.id); }} className="text-warning" ><BsPencilFill /></a>
                    &nbsp; &nbsp;
                    <a onClick={() => handleDelete(row.id)} className="text-danger"><BsFillTrash3Fill /></a>
                </>
            ),
        },
    ];

    const handleEdit = async (id: number) => {

        const Data = await data.find(row => row.id === id);

        if (Data) {
            if (Data) {
                setFormData({
                    typeID: Data.typeID,
                    productName: Data.productName,
                    productDescription: Data.productDescription,
                    qtyMinimumStock: Data.qtyMinimumStock.toString(),
                    qtyInStock: Data.qtyInStock.toString(),
                    unitPrice: Data.unitPrice.toString(),
                    unitOfMeasure: Data.unitOfMeasure,
                    imageFile: null, // รีเซ็ตไฟล์รูปภาพให้ว่าง
                });

                setEditId(id.toString())
            }
            handleShow()
        }
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
                        const response = await axios.delete(`${api}/productAPI/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {

                            showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            fetchData();
                        }
                    } catch (error: any) {
                        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
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
            const response = await axios.get(`${api}/productAPI`)
            if (response.status === 200) {
                const NewData = await response.data.result.map((item: any, index: any) => ({
                    ...item, autoID: index + 1
                }))
                setData(NewData)
                setLoading(false)
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [api])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    return (
        <>
            <ProductModals api={api} show={show} handleClose={handleClose} editId={editId} validated={validated}
                handleSubmit={handleSubmit} handleInputChange={handleInputChange} handleFileChange={handleFileChange}
                formData={formData} imageUrl={imageUrl} />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col md={12} className="text-end">
                        <Button variant="primary" onClick={() => { handleShow(), setEditId(''), setFormData(field) }}>
                            เพิ่มข้อมูล
                        </Button>
                        <hr />
                    </Col>
                    <Col md={12}>
                        <Card className="shadow ">
                            <Card.Body>
                                <Card.Text>ข้อมูลสินค้า</Card.Text>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    pagination
                                    progressPending={loading}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>


        </>

    )

}