import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DivisionModal from "./divisionModals";
import { BsPencilFill, BsFillTrash3Fill } from "react-icons/bs";
import Swal from "sweetalert2";


interface DivisionFormProps {
   api: string;
}

interface DivisionData {
   id: number;
   dV_ID: string;
   dV_Name: string;
}

export default function DivisionForm(props: DivisionFormProps) {
   const { api } = props;
   const [data, setData] = useState<DivisionData[]>([]);
   const [show, setShow] = useState(false);
   const [editBt, setEditBt] = useState("");
   const [divisionName, setDivisionName] = useState("");


   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   const columns = [
      { name: "#", selector: (row: DivisionData) => row.id.toString() },
      { name: "รหัสแผนก", selector: (row: DivisionData) => row.dV_ID, sortable: false }, // ตั้ง sortable เป็น false
      { name: "ชื่อแผนก", selector: (row: DivisionData) => row.dV_Name, sortable: false }, // ตั้ง sortable เป็น false
      {
         name: "จัดการ",
         cell: (row: DivisionData) => (
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


   const handleEdit = (id: number) => {
      const selected = data.find(row => row.id === id);
      if (selected) {
         setDivisionName(selected.dV_Name);
         setEditBt(id.toString());
         setShow(true);
      }

   };

   const handleDelete = async (id: number) => {
      console.log("Delete clicked for row:", id);
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
               const response = await axios.delete(`${api}/DivisionAPI/${id}`, {
                  headers: { 'Content-Type': 'application/json' },
               });

               if (response.status === 200) {
                  // แสดงข้อความเมื่อลบสำเร็จ
                  Swal.fire(
                     'Deleted!',
                     'ข้อมูลถูกลบเรียบร้อยแล้ว.',
                     'success'
                  );
                  // รีเฟรชข้อมูลหลังจากลบ
                  fetchData();
               } else {
                  // แสดงข้อความเมื่อเกิดข้อผิดพลาดในการลบ
                  Swal.fire(
                     'Error!',
                     'เกิดข้อผิดพลาดในการลบข้อมูล.',
                     'error'
                  );
               }
            } catch (error) {
               console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
               // แสดงข้อความเมื่อเกิดข้อผิดพลาดในการลบข้อมูล
               Swal.fire(
                  'Error!',
                  'เกิดข้อผิดพลาดในการลบข้อมูล.',
                  'error'
               );
            }
         }
      });
   };


   const fetchData = useCallback(async () => {
      try {
         const response = await axios.get(`${api}/DivisionAPI`);
         if (typeof response.data === "object") {
            const data = response.data.result as DivisionData[];
            setData(data);
         } else {
            console.log("ข้อมูลไม่ถูกต้อง");
         }
      } catch (error) {
         console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
   }, [api]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   return (
      <>
         <Container>
            <Row className="justify-content-center">
               <Col md={7} className="text-end mb-2">
                  <Button
                     variant="primary"
                     onClick={() => {
                        handleShow();
                        setEditBt("");
                        setDivisionName("")
                     }}
                  >
                     เพิ่ม
                  </Button>
                  <hr />
               </Col>
               <Col md={7}>
                  <Card className="shadow">
                     <Card.Body>
                        <Card.Title>ข้อมูลแผนกทั้งหมด</Card.Title>
                        <DataTable columns={columns} data={data} pagination />
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>
         <DivisionModal
            api={api}
            show={show}
            handleClose={handleClose}
            editBt={editBt}
            divisionName={divisionName}
            setDivisionName={setDivisionName}
            fetchData={fetchData}
         />
      </>
   );
}
