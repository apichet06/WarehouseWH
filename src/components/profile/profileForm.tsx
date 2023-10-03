/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { useRef, useState } from "react"
import { Button, Card, Col, Container, Form, Image, Row, Table } from "react-bootstrap"

import Swal from "sweetalert2"

interface Props {
    api: string
}
export default function ProfileFrom(props: Props) {
    const { api } = props

    const result: any = JSON.parse(localStorage.getItem("resulte") || "{}")
    const [password, setpassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            if (password === confirmpassword) {
                try {
                    const response = await axios.put(api + "/UsersAPI/ChangePassword/" + result.id, { password })
                    if (response.status === 200) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: response.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setpassword('')
                        setConfirmpassword('')
                        formRef.current?.reset();
                        setValidated(false);
                    }
                } catch (error: any) {

                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: error.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });

                }
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'กรอหรือหัสผ่านไม่ตรงกัน!',
                    showConfirmButton: true,
                });
            }


        }



    };

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={4}>
                        <Card className="shadow text-center">
                            <Card.Body>
                                <Card.Text className="border"><strong style={{ fontSize: "22px" }}>ข้อมูลส่วนตัว</strong></Card.Text>
                                <Image src={api + '/ImagesPathAPI/' + result.imageFile} width={140} roundedCircle className="text-center" />
                                <hr />
                                <Form noValidate validated={validated} ref={formRef} onSubmit={handleSubmit}>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th className="text-end">ชื่อล็อกอิน :</th>
                                                <th className="text-start">{result.username}</th>
                                            </tr>
                                            <tr>
                                                <th className="text-end">ชื่อ-สกุล :</th>
                                                <th className="text-start">{result.firstName + ' ' + result.lastName}</th>
                                            </tr>
                                            <tr>
                                                <th className="text-end">แผนก :</th>
                                                <th className="text-start">{result.division.dV_Name}</th>
                                            </tr>
                                            <tr>
                                                <th className="text-end">ตำแหน่ง :</th>
                                                <th className="text-start">{result.position.p_Name}</th>
                                            </tr>
                                            <tr>
                                                <th className="text-end">สถานะ :</th>
                                                <th className="text-start">{result.status}</th>
                                            </tr>
                                            <tr>
                                                <th colSpan={2} className="text-warning">เปลี่ยนรหัสผ่านใหม่</th>
                                            </tr>
                                            <tr>
                                                <th className="text-end">รหัสผ่านใหม่ :</th>
                                                <th className="text-start">
                                                    <Form.Control type="password" placeholder="รหัสผ่าน" name="password" required size="sm" onChange={(e) => (setpassword(e.target.value))} />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอกรหัสผ่าน!
                                                    </Form.Control.Feedback>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th className="text-end">ยืนยันรหัสผ่าน :</th>
                                                <th className="text-start">
                                                    <Form.Control type="password" placeholder="รหัสผ่าน" name="confirmpassword" required size="sm" onChange={(e) => setConfirmpassword(e.target.value)} />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอกยืนยันรหัสผ่าน!
                                                    </Form.Control.Feedback>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="text-center" colSpan={2}>  <Button variant="primary" type="submit" size="sm">
                                                    เปลี่ยนรหัสผ่าน
                                                </Button></th>
                                            </tr>
                                        </thead>
                                    </Table>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
        </>
    )
}